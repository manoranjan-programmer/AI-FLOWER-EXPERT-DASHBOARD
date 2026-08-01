/**
 * analyticsService.js
 * Aggregates live data directly from MongoDB Atlas collections:
 *  - Flower_Search_History (Primary user upload & AI chat history)
 *  - Flower_Knowledge_Base (Botanical knowledge base)
 * Merges with synthesized datasets for rich fallback visualization if DB data is sparse.
 */

const { getSearchHistory, getFlowerKnowledge } = require('../db');
const { generateSynthesizedData } = require('./seedService');

/**
 * Generates array of YYYY-MM-DD date strings for given day count
 */
function generateDateSeries(days = 30) {
  const dates = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
}

/**
 * Parses confidence percentage into float (0-100)
 */
function parseConfidence(conf) {
  if (conf === undefined || conf === null) return 85.0;
  const num = parseFloat(conf);
  if (isNaN(num)) return 85.0;
  return num <= 1.0 ? parseFloat((num * 100).toFixed(2)) : parseFloat(num.toFixed(2));
}

/**
 * Checks if plant card or record indicates toxic/poisonous properties
 */
function isToxicPlant(record, knowledgeMatch) {
  const toxCard = record.card && record.card.Toxicity ? String(record.card.Toxicity).toLowerCase() : '';
  const toxKb = knowledgeMatch && (knowledgeMatch['Toxicity Level'] || knowledgeMatch.Toxicity) ? String(knowledgeMatch['Toxicity Level'] || knowledgeMatch.Toxicity).toLowerCase() : '';
  const summaryText = (record.summary || '').toLowerCase();
  
  const textToCheck = `${toxCard} ${toxKb} ${summaryText}`;
  if (textToCheck.includes('non-toxic') || textToCheck.includes('not toxic') || textToCheck.includes('safe for pets')) {
    return false;
  }
  return textToCheck.includes('toxic') || textToCheck.includes('poison') || textToCheck.includes('harmful') || textToCheck.includes('caution');
}

async function getAnalyticsOverview(dateRange = '30d') {
  // Fetch raw records from MongoDB Atlas
  const realHistory = await getSearchHistory({}, 1000);
  const realKnowledge = await getFlowerKnowledge({}, 1000);
  const hasRealData = realHistory.length > 0;

  // Generate fallback base dataset if DB is empty
  const baseData = generateSynthesizedData(dateRange);

  // Build a lookup map from Knowledge Base
  const knowledgeMap = {};
  const knowledgeItems = realKnowledge.map((k, idx) => {
    const flower = k.Flower || k.flower || 'Unknown Flower';
    const name = flower.toLowerCase().trim();
    if (name) knowledgeMap[name] = k;

    return {
      id: k._id ? k._id.toString() : `kb_${idx}`,
      flower: flower,
      scientific_name: k['Scientific Name '] || k['Scientific Name'] || k.scientific_name || 'Botanical Species',
      family: k.Family || 'Botanical Family',
      native_region: k['Native Region'] || k.native_region || 'Global',
      sunlight: k.Sunlight || 'Full Sun',
      water: k.Water || 'Moderate',
      toxicity: k['Toxicity Level'] || k.Toxicity || k.toxicity || 'Non-toxic',
      pollinators: k.Pollinators || 'Bees & Butterflies',
      description: k.Description || '',
      care_tips: k['Care Tips'] || k.care_tips || '',
      medicinal_uses: k['Medicinal Uses'] || k.medicinal_uses || '',
      uses: k.Uses || k.uses || ''
    };
  });

  // --- REAL MONGODB METRICS AGGREGATION ---
  let totalUploads = realHistory.length;
  let totalConfidenceSum = 0;
  let totalAiResponsesCount = 0;
  let totalUserQuestionsCount = 0;
  let toxicCount = 0;

  const speciesFrequency = {};
  const confidenceBuckets = {
    excellent: 0, // > 95%
    high: 0,      // 80% - 95%
    moderate: 0,  // 60% - 80%
    low: 0        // < 60%
  };

  const sunlightCounts = {};
  const waterCounts = {};

  const galleryItems = [];
  const chatSessions = [];

  // Generate date series for real daily timeline aggregation
  const daysCount = dateRange === '7d' ? 7 : dateRange === '90d' ? 90 : 30;
  const datesList = generateDateSeries(daysCount);
  const dailyMap = {};

  datesList.forEach(d => {
    dailyMap[d] = {
      date: d,
      uploads: 0,
      chats: 0,
      predictions: 0,
      userSet: new Set(),
      confidenceSum: 0,
      confidenceCount: 0
    };
  });

  realHistory.forEach((rec, idx) => {
    // 1. Species & Scientific Name
    const flowerName = (rec.flower || rec.flower_name || 'Unknown Flower').trim();
    const flowerKey = flowerName.toLowerCase();
    const kbMatch = knowledgeMap[flowerKey];
    const scientificName = rec.scientific_name || (kbMatch ? kbMatch['Scientific Name '] || kbMatch['Scientific Name'] : 'Botanical species');

    speciesFrequency[flowerName] = (speciesFrequency[flowerName] || 0) + 1;

    // 2. Confidence Score
    const confVal = parseConfidence(rec.confidence);
    totalConfidenceSum += confVal;

    if (confVal > 95) confidenceBuckets.excellent++;
    else if (confVal >= 80) confidenceBuckets.high++;
    else if (confVal >= 60) confidenceBuckets.moderate++;
    else confidenceBuckets.low++;

    // 3. Messages & Engagement
    const messages = Array.isArray(rec.messages) ? rec.messages : [];
    let assistantMsgs = 0;
    let userMsgs = 0;

    messages.forEach(msg => {
      if (msg.role === 'assistant') assistantMsgs++;
      else if (msg.role === 'user') userMsgs++;
    });

    if (messages.length === 0) assistantMsgs = 1;
    totalAiResponsesCount += assistantMsgs;
    totalUserQuestionsCount += userMsgs;

    // 4. Toxicity
    if (isToxicPlant(rec, kbMatch)) {
      toxicCount++;
    }

    // 5. Care Profile (Sunlight & Water)
    const sunlightVal = (rec.card && rec.card.Sunlight) || (kbMatch && kbMatch.Sunlight) || 'Full Sun';
    const waterVal = (rec.card && rec.card.Water) || (kbMatch && kbMatch.Water) || 'Moderate';
    sunlightCounts[sunlightVal] = (sunlightCounts[sunlightVal] || 0) + 1;
    waterCounts[waterVal] = (waterCounts[waterVal] || 0) + 1;

    // 6. Gallery Inspector Item
    galleryItems.push({
      id: rec._id ? rec._id.toString() : `img_${idx}`,
      session_id: rec.session_id || `session_${idx}`,
      flower: flowerName,
      scientific_name: scientificName,
      confidence: confVal,
      filename: rec.filename || `${flowerName.toLowerCase().replace(/\s+/g, '_')}_upload.jpg`,
      image_preview: rec.image_preview || null,
      searched_at: rec.searched_at || (rec.timestamp ? new Date(rec.timestamp).toLocaleString() : new Date().toLocaleString()),
      card: rec.card || {},
      summary: rec.summary || ''
    });

    // 7. Live Chat Session Inspector Item
    chatSessions.push({
      session_id: rec.session_id || `sess_${1000 + idx}`,
      flower: flowerName,
      scientific_name: scientificName,
      confidence: confVal,
      message_count: messages.length || 2,
      user_questions: userMsgs,
      ai_responses: assistantMsgs,
      searched_at: rec.searched_at || (rec.timestamp ? new Date(rec.timestamp).toLocaleString() : new Date().toLocaleString()),
      messages: messages.length > 0 ? messages : [
        { role: 'assistant', content: rec.summary || `Identification overview for ${flowerName}.`, timestamp: rec.timestamp }
      ]
    });

    // 8. Daily Timeline Real Aggregation
    let dateStr = null;
    if (rec.timestamp) {
      const dObj = new Date(rec.timestamp);
      if (!isNaN(dObj.getTime())) dateStr = dObj.toISOString().split('T')[0];
    }
    if (!dateStr && rec.searched_at) {
      const dObj = new Date(rec.searched_at);
      if (!isNaN(dObj.getTime())) dateStr = dObj.toISOString().split('T')[0];
    }
    if (!dateStr && rec._id && typeof rec._id.getTimestamp === 'function') {
      try {
        dateStr = rec._id.getTimestamp().toISOString().split('T')[0];
      } catch (e) {}
    }

    if (dateStr) {
      if (!dailyMap[dateStr]) {
        dailyMap[dateStr] = {
          date: dateStr,
          uploads: 0,
          chats: 0,
          predictions: 0,
          userSet: new Set(),
          confidenceSum: 0,
          confidenceCount: 0
        };
        if (!datesList.includes(dateStr)) {
          datesList.push(dateStr);
        }
      }

      dailyMap[dateStr].uploads += 1;
      dailyMap[dateStr].predictions += 1;
      dailyMap[dateStr].chats += (messages.length || 1);
      const userId = rec.user || rec.session_id || `user_${idx}`;
      dailyMap[dateStr].userSet.add(userId);
      dailyMap[dateStr].confidenceSum += confVal;
      dailyMap[dateStr].confidenceCount += 1;
    }
  });

  // Ensure dates are sorted chronologically
  datesList.sort();

  const realUsageTrends = datesList.map(d => {
    const item = dailyMap[d];
    return {
      date: d,
      uploads: item.uploads,
      chats: item.chats,
      predictions: item.predictions,
      users: item.userSet.size,
      responses: item.chats,
      avgConfidence: item.confidenceCount > 0 ? parseFloat((item.confidenceSum / item.confidenceCount).toFixed(1)) : 0
    };
  });

  // If MongoDB history is empty, synthesize gallery & sessions from baseData
  if (totalUploads === 0) {
    totalUploads = baseData.kpis.totalImageUploads;
    totalConfidenceSum = baseData.kpis.avgConfidence * totalUploads;
    totalAiResponsesCount = baseData.kpis.totalAiResponses;
    totalUserQuestionsCount = Math.round(totalUploads * 2.4);

    baseData.tables.recentConversations.forEach((conv, idx) => {
      chatSessions.push({
        session_id: conv.session_id,
        flower: conv.flower,
        scientific_name: `${conv.flower} botanicalis`,
        confidence: conv.confidence,
        message_count: conv.message_count,
        user_questions: Math.floor(conv.message_count / 2),
        ai_responses: Math.ceil(conv.message_count / 2),
        searched_at: new Date(conv.timestamp).toLocaleString(),
        messages: conv.messages
      });

      galleryItems.push({
        id: `img_synth_${idx}`,
        session_id: conv.session_id,
        flower: conv.flower,
        scientific_name: `${conv.flower} botanicalis`,
        confidence: conv.confidence,
        filename: `synth_flower_${idx + 100}.jpeg`,
        image_preview: null,
        searched_at: new Date(conv.timestamp).toLocaleString(),
        card: { Sunlight: 'Full Sun', Water: 'Moderate' },
        summary: `Synthesized overview for ${conv.flower}.`
      });
    });
  }

  // Most identified flower
  let mostIdentifiedFlower = 'Rose';
  let maxFreq = 0;
  Object.entries(speciesFrequency).forEach(([fl, count]) => {
    if (count > maxFreq) {
      maxFreq = count;
      mostIdentifiedFlower = fl;
    }
  });

  const avgAccuracy = parseFloat((totalConfidenceSum / Math.max(1, totalUploads)).toFixed(1));
  const toxicPlantRatio = parseFloat(((toxicCount / Math.max(1, totalUploads)) * 100).toFixed(1));
  const avgQuestionsPerSession = parseFloat((totalUserQuestionsCount / Math.max(1, totalUploads)).toFixed(1));

  // Build top 10 species chart data
  const topSpeciesChart = Object.entries(speciesFrequency)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Confidence distribution chart data
  const confidenceChart = [
    { name: 'Excellent (>95%)', value: hasRealData ? confidenceBuckets.excellent : (confidenceBuckets.excellent || 45), color: '#10b981' },
    { name: 'High (80-95%)', value: hasRealData ? confidenceBuckets.high : (confidenceBuckets.high || 30), color: '#3b82f6' },
    { name: 'Moderate (60-80%)', value: hasRealData ? confidenceBuckets.moderate : (confidenceBuckets.moderate || 15), color: '#f59e0b' },
    { name: 'Low (<60%)', value: hasRealData ? confidenceBuckets.low : (confidenceBuckets.low || 10), color: '#ef4444' }
  ];

  // Plant care profiles chart data
  const sunlightChart = Object.keys(sunlightCounts).length > 0
    ? Object.entries(sunlightCounts).map(([name, value]) => ({ name, value }))
    : [
        { name: 'Full Sun', value: 45 },
        { name: 'Partial Shade', value: 35 },
        { name: 'Indirect Light', value: 15 },
        { name: 'Low Light', value: 5 }
      ];

  const waterChart = Object.keys(waterCounts).length > 0
    ? Object.entries(waterCounts).map(([name, value]) => ({ name, value }))
    : [
        { name: 'Moderate', value: 55 },
        { name: 'Low (Drought Tolerant)', value: 25 },
        { name: 'High (Moist Soil)', value: 20 }
      ];

  return {
    kpis: {
      totalImageUploads: totalUploads,
      avgAccuracy: avgAccuracy,
      totalAiResponses: totalAiResponsesCount,
      mostIdentifiedFlower: mostIdentifiedFlower,
      toxicPlantRatio: toxicPlantRatio,
      avgQuestionsPerSession: avgQuestionsPerSession,
      totalKnowledgeArticles: knowledgeItems.length
    },
    charts: {
      topSpecies: topSpeciesChart.length > 0 ? topSpeciesChart : baseData.charts.flowerDistribution.slice(0, 10).map(i => ({ name: i.name, count: i.count })),
      confidenceDistribution: confidenceChart,
      sunlightBreakdown: sunlightChart,
      waterBreakdown: waterChart,
      usageTrends: hasRealData ? realUsageTrends : baseData.charts.usageTrends
    },
    tables: {
      galleryItems: galleryItems,
      chatSessions: chatSessions,
      knowledgeBase: knowledgeItems
    }
  };
}

module.exports = {
  getAnalyticsOverview
};

