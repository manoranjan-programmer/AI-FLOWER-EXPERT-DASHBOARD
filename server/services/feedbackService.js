/**
 * feedbackService.js
 * Feedback Analytics Service — reads from User_Feedback (or Chatbot_Feedback) collection.
 * Provides: paginated list, summary aggregations, status updates.
 * Does NOT modify any existing collections or APIs.
 */

const { connectDB } = require('../db');
require('dotenv').config();

const COLLECTION = process.env.MONGO_FEEDBACK_COLLECTION || 'User_Feedback';
const FALLBACK_COLLECTION = 'Chatbot_Feedback';

/**
 * Returns the feedback collection, trying primary then fallback name.
 */
async function getFeedbackCollection() {
  const database = await connectDB();
  if (!database) return null;

  // Try to detect which collection exists by counting docs
  const primary = database.collection(COLLECTION);
  const count = await primary.countDocuments({}).catch(() => 0);
  if (count > 0) return primary;

  const fallback = database.collection(FALLBACK_COLLECTION);
  return fallback;
}

/**
 * Build a MongoDB filter query from UI filter params.
 */
function buildFilterQuery(filters = {}) {
  const query = {};
  const andConditions = [];

  // feedback_type: "Like" | "Dislike"
  if (filters.feedback_type && filters.feedback_type !== 'ALL') {
    const ft = filters.feedback_type.toLowerCase();
    if (ft === 'like') {
      andConditions.push({
        $or: [
          { feedback_type: { $regex: 'like|positive', $options: 'i' } },
          { rating: { $gte: 4 } }
        ]
      });
    } else if (ft === 'dislike') {
      andConditions.push({
        $or: [
          { feedback_type: { $regex: 'dislike|negative', $options: 'i' } },
          { rating: { $lte: 2, $gt: 0 } }
        ]
      });
    } else {
      andConditions.push({ feedback_type: { $regex: filters.feedback_type, $options: 'i' } });
    }
  }

  // rating: 1-5
  if (filters.rating && filters.rating !== 'ALL') {
    const numRating = parseInt(filters.rating, 10);
    const strRating = String(filters.rating);
    andConditions.push({
      $or: [
        { rating: numRating },
        { rating: strRating }
      ]
    });
  }

  // feedback_status: "new" | "reviewed" | "resolved"
  if (filters.feedback_status && filters.feedback_status !== 'ALL') {
    andConditions.push({ feedback_status: { $regex: `^${filters.feedback_status}$`, $options: 'i' } });
  }

  // date range
  if (filters.start_date || filters.end_date) {
    const timeCond = {};
    if (filters.start_date) {
      timeCond.$gte = new Date(filters.start_date).toISOString();
    }
    if (filters.end_date) {
      const end = new Date(filters.end_date);
      end.setHours(23, 59, 59, 999);
      timeCond.$lte = end.toISOString();
    }
    andConditions.push({ timestamp: timeCond });
  }

  // flower_name
  if (filters.flower_name && filters.flower_name.trim()) {
    andConditions.push({ flower_name: { $regex: filters.flower_name.trim(), $options: 'i' } });
  }

  // username
  if (filters.username && filters.username.trim()) {
    andConditions.push({ username: { $regex: filters.username.trim(), $options: 'i' } });
  }

  // email
  if (filters.email && filters.email.trim()) {
    andConditions.push({ email: { $regex: filters.email.trim(), $options: 'i' } });
  }

  // keyword search across key text fields
  if (filters.search && filters.search.trim()) {
    const re = { $regex: filters.search.trim(), $options: 'i' };
    andConditions.push({
      $or: [
        { username: re },
        { email: re },
        { flower_name: re },
        { user_prompt: re },
        { ai_response: re },
        { custom_comment: re },
        { feedback_id: re },
      ]
    });
  }

  if (andConditions.length > 0) {
    query.$and = andConditions;
  }

  return query;
}

/**
 * GET /api/feedback
 * Returns paginated list + full summary analytics.
 */
async function getFeedbackList(filters = {}, pagination = {}) {
  const coll = await getFeedbackCollection();
  if (!coll) {
    return {
      feedback: [],
      pagination: { total: 0, page: 1, limit: 20, totalPages: 0 },
      summary: buildEmptySummary(),
      analytics: buildEmptyAnalytics()
    };
  }

  const page = Math.max(1, parseInt(pagination.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(pagination.limit, 10) || 20));
  const skip = (page - 1) * limit;
  const query = buildFilterQuery(filters);

  // Run in parallel: paginated list + total count + filtered summary & analytics
  const [feedbackDocs, totalCount, summary, analytics] = await Promise.all([
    coll
      .find(query)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()
      .catch(() => []),
    coll.countDocuments(query).catch(() => 0),
    computeSummary(coll, query),
    computeAnalytics(coll, query)
  ]);

  return {
    feedback: feedbackDocs.map(sanitizeDoc),
    pagination: {
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit)
    },
    summary,
    analytics
  };
}

/**
 * Strips internal MongoDB _id from response docs.
 */
function sanitizeDoc(doc) {
  const { _id, ...rest } = doc;
  return rest;
}

/**
 * Computes overall summary KPIs from the full collection (no filter).
 */
async function computeSummary(coll, query = {}) {
  try {
    const [allDocs, todayAgg, weekAgg, monthAgg, topFlowersAgg, topReasonsAgg, topUsersAgg, browserAgg, deviceAgg] = await Promise.all([
      coll.find(query).toArray().catch(() => []),
      (async () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const matchObj = Object.keys(query).length > 0 ? { $and: [query, { timestamp: { $gte: today.toISOString() } }] } : { timestamp: { $gte: today.toISOString() } };
        return coll.countDocuments(matchObj).catch(() => 0);
      })(),
      (async () => {
        const week = new Date();
        week.setDate(week.getDate() - 7);
        const matchObj = Object.keys(query).length > 0 ? { $and: [query, { timestamp: { $gte: week.toISOString() } }] } : { timestamp: { $gte: week.toISOString() } };
        return coll.countDocuments(matchObj).catch(() => 0);
      })(),
      (async () => {
        const month = new Date();
        month.setDate(month.getDate() - 30);
        const matchObj = Object.keys(query).length > 0 ? { $and: [query, { timestamp: { $gte: month.toISOString() } }] } : { timestamp: { $gte: month.toISOString() } };
        return coll.countDocuments(matchObj).catch(() => 0);
      })(),
      coll.aggregate([
        { $match: Object.keys(query).length > 0 ? { $and: [query, { flower_name: { $exists: true, $ne: null, $ne: '' } }] } : { flower_name: { $exists: true, $ne: null, $ne: '' } } },
        { $group: { _id: '$flower_name', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]).toArray().catch(() => []),
      coll.aggregate([
        { $match: Object.keys(query).length > 0 ? { $and: [query, { selected_reasons: { $exists: true, $ne: null } }] } : { selected_reasons: { $exists: true, $ne: null } } },
        { $unwind: '$selected_reasons' },
        { $match: { selected_reasons: { $ne: '' } } },
        { $group: { _id: '$selected_reasons', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]).toArray().catch(() => []),
      coll.aggregate([
        { $match: Object.keys(query).length > 0 ? { $and: [query, { username: { $exists: true, $ne: null, $ne: '' } }] } : { username: { $exists: true, $ne: null, $ne: '' } } },
        { $group: { _id: '$username', count: { $sum: 1 }, email: { $first: '$email' } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]).toArray().catch(() => []),
      coll.aggregate([
        { $match: Object.keys(query).length > 0 ? { $and: [query, { browser_info: { $exists: true, $ne: null, $ne: '' } }] } : { browser_info: { $exists: true, $ne: null, $ne: '' } } },
        { $group: { _id: '$browser_info', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]).toArray().catch(() => []),
      coll.aggregate([
        { $match: Object.keys(query).length > 0 ? { $and: [query, { device_info: { $exists: true, $ne: null, $ne: '' } }] } : { device_info: { $exists: true, $ne: null, $ne: '' } } },
        { $group: { _id: '$device_info', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]).toArray().catch(() => []),
    ]);

    const total = allDocs.length;
    let likes = 0;
    let dislikes = 0;
    let sumRating = 0;
    let ratingCount = 0;
    let sumResponseTime = 0;
    let responseTimeCount = 0;
    let sumClassTime = 0;
    let classTimeCount = 0;
    let sumConfidence = 0;
    let confidenceCount = 0;
    let resolved = 0;
    let pending = 0;
    let reviewed = 0;

    allDocs.forEach(d => {
      const type = String(d.feedback_type || '').toLowerCase();
      const r = parseFloat(d.rating);

      // Feedback type (Like vs Dislike)
      if (type === 'like' || type === 'positive' || r >= 4) {
        likes++;
      } else if (type === 'dislike' || type === 'negative' || (r > 0 && r <= 2)) {
        dislikes++;
      }

      // Rating
      if (!isNaN(r) && r > 0) {
        sumRating += r;
        ratingCount++;
      }

      // Response Time
      const rt = parseFloat(d.response_generation_time || d.response_time_ms || d.generation_time_ms || d.response_time || d.total_processing_time);
      if (!isNaN(rt) && rt > 0) {
        sumResponseTime += rt;
        responseTimeCount++;
      }

      // Classification Time
      const ct = parseFloat(d.classification_time || d.classification_time_ms);
      if (!isNaN(ct) && ct > 0) {
        sumClassTime += ct;
        classTimeCount++;
      }

      // Confidence
      let conf = parseFloat(d.classifier_confidence || d.confidence);
      if (!isNaN(conf) && conf > 0) {
        if (conf <= 1) conf = conf * 100;
        sumConfidence += conf;
        confidenceCount++;
      }

      // Status
      const status = String(d.feedback_status || '').toLowerCase();
      if (status === 'resolved') resolved++;
      else if (status === 'reviewed') reviewed++;
      else pending++;
    });

    const satisfaction = total > 0 ? parseFloat(((likes / total) * 100).toFixed(1)) : 0;
    const avgRating = ratingCount > 0 ? parseFloat((sumRating / ratingCount).toFixed(2)) : 0;
    const avgResponseTime = responseTimeCount > 0 ? Math.round(sumResponseTime / responseTimeCount) : 0;
    const avgClassificationTime = classTimeCount > 0 ? Math.round(sumClassTime / classTimeCount) : 0;
    const avgConfidence = confidenceCount > 0 ? parseFloat((sumConfidence / confidenceCount).toFixed(1)) : 0;

    return {
      total,
      likes,
      dislikes,
      satisfaction,
      avgRating,
      avgResponseTime,
      avgClassificationTime,
      avgConfidence,
      resolved,
      pending,
      reviewed,
      todayCount: todayAgg,
      weekCount: weekAgg,
      monthCount: monthAgg,
      topFlowers: topFlowersAgg.map(f => ({ name: f._id || 'Unknown', count: f.count })),
      topReasons: topReasonsAgg.map(r => ({ name: r._id, count: r.count })),
      topUsers: topUsersAgg.map(u => ({ username: u._id, email: u.email, count: u.count })),
      topBrowser: browserAgg[0]?._id || 'N/A',
      topDevice: deviceAgg[0]?._id || 'N/A',
      browserBreakdown: browserAgg.map(b => ({ name: b._id, count: b.count })),
      deviceBreakdown: deviceAgg.map(d => ({ name: d._id, count: d.count })),
    };
  } catch (err) {
    console.error('Error computing feedback summary:', err.message);
    return buildEmptySummary();
  }
}

/**
 * Computes chart-ready analytics data.
 */
async function computeAnalytics(coll, query = {}) {
  try {
    const [allDocs, dailyTrend, monthlyTrend, ratingDist, statusDist, flowerDist, reasonsDist, responseTimeTrend] = await Promise.all([
      coll.find(query).toArray().catch(() => []),

      // Daily trend (last 30 days)
      coll.aggregate([
        {
          $match: Object.keys(query).length > 0 ? {
            $and: [
              query,
              { timestamp: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() } }
            ]
          } : {
            timestamp: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() }
          }
        },
        {
          $group: {
            _id: { $substr: ['$timestamp', 0, 10] },
            count: { $sum: 1 },
            likes: { $sum: { $cond: [{ $eq: ['$feedback_type', 'Like'] }, 1, 0] } },
            dislikes: { $sum: { $cond: [{ $eq: ['$feedback_type', 'Dislike'] }, 1, 0] } },
          }
        },
        { $sort: { _id: 1 } },
        { $limit: 30 }
      ]).toArray().catch(() => []),

      // Monthly trend (last 12 months)
      coll.aggregate([
        {
          $match: Object.keys(query).length > 0 ? {
            $and: [
              query,
              { timestamp: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString() } }
            ]
          } : {
            timestamp: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString() }
          }
        },
        {
          $group: {
            _id: { $substr: ['$timestamp', 0, 7] },
            count: { $sum: 1 },
            likes: { $sum: { $cond: [{ $eq: ['$feedback_type', 'Like'] }, 1, 0] } },
            dislikes: { $sum: { $cond: [{ $eq: ['$feedback_type', 'Dislike'] }, 1, 0] } },
            avgRating: { $avg: { $toDouble: '$rating' } }
          }
        },
        { $sort: { _id: 1 } },
        { $limit: 12 }
      ]).toArray().catch(() => []),

      // Rating distribution (1-5 stars)
      coll.aggregate([
        { $match: Object.keys(query).length > 0 ? { $and: [query, { rating: { $exists: true, $ne: null } }] } : { rating: { $exists: true, $ne: null } } },
        { $group: { _id: '$rating', count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]).toArray().catch(() => []),

      // Status distribution
      coll.aggregate([
        { $match: query },
        { $group: { _id: '$feedback_status', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]).toArray().catch(() => []),

      // Top flowers (for chart)
      coll.aggregate([
        { $match: Object.keys(query).length > 0 ? { $and: [query, { flower_name: { $exists: true, $ne: null, $ne: '' } }] } : { flower_name: { $exists: true, $ne: null, $ne: '' } } },
        { $group: { _id: '$flower_name', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]).toArray().catch(() => []),

      // Top reasons (for chart)
      coll.aggregate([
        { $match: Object.keys(query).length > 0 ? { $and: [query, { selected_reasons: { $exists: true, $ne: null } }] } : { selected_reasons: { $exists: true, $ne: null } } },
        { $unwind: '$selected_reasons' },
        { $match: { selected_reasons: { $ne: '' } } },
        { $group: { _id: '$selected_reasons', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]).toArray().catch(() => []),

      // Average response time trend (last 30 days)
      coll.aggregate([
        {
          $match: Object.keys(query).length > 0 ? {
            $and: [
              query,
              { timestamp: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() } },
              { response_generation_time: { $exists: true, $ne: null } }
            ]
          } : {
            timestamp: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() },
            response_generation_time: { $exists: true, $ne: null }
          }
        },
        {
          $group: {
            _id: { $substr: ['$timestamp', 0, 10] },
            avgResponseTime: { $avg: { $toDouble: '$response_generation_time' } },
            avgConfidence: { $avg: { $toDouble: '$classifier_confidence' } }
          }
        },
        { $sort: { _id: 1 } }
      ]).toArray().catch(() => [])
    ]);

    let likesCount = 0;
    let dislikesCount = 0;
    allDocs.forEach(d => {
      const type = String(d.feedback_type || '').toLowerCase();
      const r = parseFloat(d.rating);
      if (type === 'like' || type === 'positive' || r >= 4) {
        likesCount++;
      } else if (type === 'dislike' || type === 'negative' || (r > 0 && r <= 2)) {
        dislikesCount++;
      }
    });

    return {
      dailyTrend: dailyTrend.map(d => ({
        date: d._id,
        count: d.count,
        likes: d.likes,
        dislikes: d.dislikes
      })),
      monthlyTrend: monthlyTrend.map(m => ({
        month: m._id,
        count: m.count,
        likes: m.likes,
        dislikes: m.dislikes,
        avgRating: parseFloat((m.avgRating || 0).toFixed(2))
      })),
      ratingDistribution: [1, 2, 3, 4, 5].map(star => {
        const found = ratingDist.find(r => Number(r._id) === star);
        return { star: `${star}★`, count: found ? found.count : 0 };
      }),
      feedbackTypeDist: [
        { name: 'Like', value: likesCount, color: '#10b981' },
        { name: 'Dislike', value: dislikesCount, color: '#ef4444' }
      ],
      statusDistribution: statusDist.map(s => ({
        name: s._id || 'unknown',
        value: s.count
      })),
      topFlowers: flowerDist.map(f => ({ name: f._id, count: f.count })),
      topReasons: reasonsDist.map(r => ({ name: r._id, count: r.count })),
      responseTimeTrend: responseTimeTrend.map(r => ({
        date: r._id,
        avgResponseTime: parseFloat((r.avgResponseTime || 0).toFixed(0)),
        avgConfidence: parseFloat((r.avgConfidence || 0).toFixed(1))
      }))
    };
  } catch (err) {
    console.error('Error computing feedback analytics:', err.message);
    return buildEmptyAnalytics();
  }
}

/**
 * Updates the feedback_status field for a given feedback_id.
 * Status lifecycle: new → reviewed → resolved
 */
async function updateFeedbackStatus(feedbackId, newStatus) {
  const validStatuses = ['new', 'reviewed', 'resolved'];
  if (!validStatuses.includes(newStatus)) {
    throw new Error(`Invalid status: ${newStatus}. Must be one of: ${validStatuses.join(', ')}`);
  }

  const coll = await getFeedbackCollection();
  if (!coll) throw new Error('Database connection unavailable');

  const { ObjectId } = require('mongodb');

  // Try matching by feedback_id field first, then by _id
  let result = await coll.updateOne(
    { feedback_id: feedbackId },
    {
      $set: {
        feedback_status: newStatus,
        updated_at: new Date().toISOString()
      }
    }
  );

  // If no match, try by MongoDB _id
  if (result.matchedCount === 0 && ObjectId.isValid(feedbackId)) {
    result = await coll.updateOne(
      { _id: new ObjectId(feedbackId) },
      {
        $set: {
          feedback_status: newStatus,
          updated_at: new Date().toISOString()
        }
      }
    );
  }

  return {
    success: result.modifiedCount > 0,
    matchedCount: result.matchedCount,
    modifiedCount: result.modifiedCount
  };
}

/**
 * Returns raw feedback documents for export (no pagination).
 */
async function exportFeedbackData(filters = {}) {
  const coll = await getFeedbackCollection();
  if (!coll) return [];

  const query = buildFilterQuery(filters);
  const docs = await coll
    .find(query)
    .sort({ timestamp: -1 })
    .limit(5000)
    .toArray()
    .catch(() => []);

  return docs.map(sanitizeDoc);
}

function buildEmptySummary() {
  return {
    total: 0, likes: 0, dislikes: 0, satisfaction: 0,
    avgRating: 0, avgResponseTime: 0, avgClassificationTime: 0,
    avgConfidence: 0, resolved: 0, pending: 0, reviewed: 0,
    todayCount: 0, weekCount: 0, monthCount: 0,
    topFlowers: [], topReasons: [], topUsers: [],
    topBrowser: 'N/A', topDevice: 'N/A',
    browserBreakdown: [], deviceBreakdown: []
  };
}

function buildEmptyAnalytics() {
  return {
    dailyTrend: [], monthlyTrend: [], ratingDistribution: [],
    feedbackTypeDist: [], statusDistribution: [],
    topFlowers: [], topReasons: [], responseTimeTrend: []
  };
}

module.exports = {
  getFeedbackList,
  updateFeedbackStatus,
  exportFeedbackData
};
