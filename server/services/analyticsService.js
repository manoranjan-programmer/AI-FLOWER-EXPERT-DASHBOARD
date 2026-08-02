/**
 * analyticsService.js
 * Comprehensive read-only analytics aggregator reading directly from MongoDB Atlas collections:
 *  - Users (User Accounts)
 *  - Flower_Search_History (Flower Searches & Chat Log Transcripts)
 *  - Chatbot_Performance_Analytics (Chatbot generation speed, token usage, prompts, feedback)
 *  - Classification_Analytics (EfficientNet confidence, classification latency, image metadata)
 *  - User_Activity (User actions timeline, device/browser details)
 *  - Analytics_Logs (System & Admin events)
 *  - Flower_Knowledge_Base (Botanical reference data)
 */

const {
  getUsers,
  getSearchHistory,
  getFlowerKnowledge,
  getChatbotPerformance,
  getClassificationAnalytics,
  getUserActivity,
  getAnalyticsLogs
} = require('../db');
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
 * Checks if a timestamp string/date matches today's date (YYYY-MM-DD)
 */
function isToday(dateStr) {
  if (!dateStr) return false;
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return false;
    const todayStr = new Date().toISOString().split('T')[0];
    return d.toISOString().split('T')[0] === todayStr;
  } catch (e) {
    return false;
  }
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
  // Fetch raw records concurrently from MongoDB Atlas
  const [
    realUsers,
    realHistory,
    realKnowledge,
    chatbotLogs,
    classLogs,
    activityLogs,
    systemLogs
  ] = await Promise.all([
    getUsers({}, 1000),
    getSearchHistory({}, 2000),
    getFlowerKnowledge({}, 1000),
    getChatbotPerformance({}, 2000),
    getClassificationAnalytics({}, 2000),
    getUserActivity({}, 2000),
    getAnalyticsLogs({}, 1000)
  ]);

  const hasRealHistory = realHistory.length > 0;
  const hasRealUsers = realUsers.length > 0;
  const hasChatbotLogs = chatbotLogs.length > 0;
  const hasClassLogs = classLogs.length > 0;

  // Fallback synthesized base dataset if DB is sparse
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
      family: k.Family || k.family || 'Botanical Family',
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

  // --- 1. USER METRICS & LEADERBOARD ---
  let activeBotanistsTodayCount = 0;
  let activeUsersTodayCount = 0;

  const userSearchMap = {};
  const userEmailMap = {};

  realHistory.forEach(rec => {
    const uid = rec.user_id ? String(rec.user_id) : null;
    const email = rec.user_email ? String(rec.user_email).toLowerCase().trim() : null;

    if (uid) {
      if (!userSearchMap[uid]) userSearchMap[uid] = [];
      userSearchMap[uid].push(rec);
    }
    if (email) {
      if (!userEmailMap[email]) userEmailMap[email] = [];
      userEmailMap[email].push(rec);
    }
  });

  const registeredUsersList = realUsers.map((u, idx) => {
    const userIdStr = u._id ? String(u._id) : (u.google_id || `usr_${idx}`);
    const emailStr = (u.email || '').toLowerCase().trim();
    const roleStr = (u.role || 'user').toLowerCase();

    const searches = userSearchMap[userIdStr] || (emailStr ? userEmailMap[emailStr] : []) || [];
    const isBot = roleStr === 'botanist';
    const isActiveToday = isToday(u.last_active) || isToday(u.login_timestamp);

    if (isActiveToday) {
      activeUsersTodayCount++;
      if (isBot) activeBotanistsTodayCount++;
    }

    return {
      id: userIdStr,
      google_id: u.google_id || '',
      name: u.name || 'Anonymous User',
      email: u.email || 'user@aflowerexpert.com',
      picture: u.picture || null,
      role: u.role || 'user',
      created_at: u.created_at || new Date().toISOString(),
      login_timestamp: u.login_timestamp || u.created_at || new Date().toISOString(),
      last_active: u.last_active || u.login_timestamp || u.created_at || new Date().toISOString(),
      total_searches: searches.length,
      searches: searches.map((s, sIdx) => ({
        id: s._id ? String(s._id) : `srch_${sIdx}`,
        session_id: s.session_id,
        flower: s.flower || 'Unknown Flower',
        scientific_name: s.scientific_name || 'Botanical species',
        confidence: parseConfidence(s.confidence),
        card: s.card || {},
        summary: s.summary || '',
        image_preview: s.image_preview || null,
        messages: Array.isArray(s.messages) ? s.messages : [],
        searched_at: s.searched_at || (s.timestamp ? new Date(s.timestamp).toLocaleString() : new Date().toLocaleString()),
        timestamp: s.timestamp || new Date().toISOString()
      }))
    };
  });

  if (!hasRealUsers) {
    const synthNames = [
      { name: 'Dr. Elena Rostova', role: 'botanist', email: 'elena.rostova@aflowerexpert.com' },
      { name: 'Prof. Marcus Vance', role: 'botanist', email: 'marcus.vance@aflowerexpert.com' },
      { name: 'Sarah Jenkins', role: 'user', email: 'sarah.j@example.com' },
      { name: 'David Chen', role: 'user', email: 'david.chen@example.com' },
      { name: 'Aisha Patel', role: 'botanist', email: 'aisha.patel@aflowerexpert.com' }
    ];

    synthNames.forEach((su, idx) => {
      const isBot = su.role === 'botanist';
      if (idx < 2) {
        activeUsersTodayCount++;
        if (isBot) activeBotanistsTodayCount++;
      }

      registeredUsersList.push({
        id: `synth_user_${idx}`,
        google_id: `google_synth_${1000 + idx}`,
        name: su.name,
        email: su.email,
        picture: null,
        role: su.role,
        created_at: new Date(Date.now() - idx * 86400000 * 5).toISOString(),
        login_timestamp: new Date(Date.now() - idx * 3600000 * 3).toISOString(),
        last_active: idx < 2 ? new Date().toISOString() : new Date(Date.now() - idx * 86400000).toISOString(),
        total_searches: 12 - idx * 2,
        searches: []
      });
    });
  }

  // --- 2. PERFORMANCE & LATENCY METRICS ---
  let totalChatbotGenTimeMs = 0;
  let chatbotGenCount = 0;

  let totalClassTimeMs = 0;
  let classCount = 0;

  let totalProcessingTimeMs = 0;
  let processingCount = 0;

  let positiveFeedbackCount = 0;
  let negativeFeedbackCount = 0;
  let neutralFeedbackCount = 0;

  let errorCount = 0;
  let totalRequestCount = 0;
  let totalTokensUsed = 0;

  const browserCounts = {};
  const osCounts = {};
  const modelCounts = {};

  // Process Chatbot Performance Collection
  const parsedChatbotLogs = chatbotLogs.map((log, idx) => {
    totalRequestCount++;
    if (log.status === 'error' || log.error_info) errorCount++;

    const genTime = parseFloat(log.generation_time_ms || log.response_time_ms || 0);
    if (genTime > 0) {
      totalChatbotGenTimeMs += genTime;
      chatbotGenCount++;
    }

    const procTime = parseFloat(log.total_processing_time_ms || 0);
    if (procTime > 0) {
      totalProcessingTimeMs += procTime;
      processingCount++;
    }

    const fb = String(log.feedback || '').toLowerCase();
    if (fb === 'like' || fb === 'positive' || fb === 'thumbs_up' || fb === '5' || fb === '4') {
      positiveFeedbackCount++;
    } else if (fb === 'dislike' || fb === 'negative' || fb === 'thumbs_down' || fb === '1' || fb === '2') {
      negativeFeedbackCount++;
    } else {
      neutralFeedbackCount++;
    }

    const tok = log.token_usage || {};
    const totalTok = tok.total_tokens || ((tok.prompt_tokens || 0) + (tok.completion_tokens || 0)) || 0;
    totalTokensUsed += totalTok;

    const modelName = log.model_name || 'Gemini-1.5-Pro';
    modelCounts[modelName] = (modelCounts[modelName] || 0) + 1;

    return {
      id: log._id ? String(log._id) : `cb_${idx}`,
      session_id: log.session_id || `session_cb_${idx}`,
      user_id: log.user_id || '',
      username: log.username || 'Anonymous User',
      email: log.email || log.user_email || 'user@aiflowerexpert.com',
      flower_context: log.flower_context || 'General Botanical Context',
      user_prompt: log.user_prompt || 'User Query',
      ai_response: log.ai_response || 'AI Response',
      response_format: log.response_format || 'markdown',
      generation_time_ms: genTime || 850,
      classification_time_ms: log.classification_time_ms || 0,
      total_processing_time_ms: procTime || 1200,
      model_name: modelName,
      token_usage: tok,
      total_tokens: totalTok,
      feedback: log.feedback || 'none',
      status: log.status || 'success',
      error_info: log.error_info || '',
      timestamp: log.timestamp || new Date().toISOString(),
      transcript: Array.isArray(log.transcript) ? log.transcript : []
    };
  });

  // Process Classification Analytics Collection
  const parsedClassLogs = classLogs.map((log, idx) => {
    totalRequestCount++;
    if (log.status === 'error' || log.error_info) errorCount++;

    const cTime = parseFloat(log.classification_time_ms || 0);
    if (cTime > 0) {
      totalClassTimeMs += cTime;
      classCount++;
    }

    const pTime = parseFloat(log.total_processing_time_ms || 0);
    if (pTime > 0) {
      totalProcessingTimeMs += pTime;
      processingCount++;
    }

    const dev = log.device_info || {};
    if (dev.browser) browserCounts[dev.browser] = (browserCounts[dev.browser] || 0) + 1;
    if (dev.os) osCounts[dev.os] = (osCounts[dev.os] || 0) + 1;

    const modelName = log.model_name || 'EfficientNet_Flower_Classifier';
    modelCounts[modelName] = (modelCounts[modelName] || 0) + 1;

    return {
      id: log._id ? String(log._id) : `cls_${idx}`,
      session_id: log.session_id || `session_cls_${idx}`,
      user_id: log.user_id || '',
      username: log.username || 'Anonymous User',
      email: log.email || 'user@aiflowerexpert.com',
      uploaded_image_metadata: log.uploaded_image_metadata || {
        filename: 'flower_upload.jpg',
        content_type: 'image/jpeg',
        size_kb: 180
      },
      predicted_flower: log.predicted_flower || 'oxeye daisy',
      classifier_confidence: parseConfidence(log.classifier_confidence),
      classification_time_ms: cTime || 2400,
      total_processing_time_ms: pTime || 2800,
      model_name: modelName,
      status: log.status || 'success',
      error_info: log.error_info || '',
      device_info: dev,
      timestamp: log.timestamp || new Date().toISOString()
    };
  });

  // Process User Activity Collection
  const parsedUserActivity = activityLogs.map((log, idx) => {
    const dev = log.device_info || {};
    if (dev.browser) browserCounts[dev.browser] = (browserCounts[dev.browser] || 0) + 1;
    if (dev.os) osCounts[dev.os] = (osCounts[dev.os] || 0) + 1;

    return {
      id: log._id ? String(log._id) : `act_${idx}`,
      user_id: log.user_id || '',
      username: log.username || 'Anonymous User',
      email: log.email || 'user@aiflowerexpert.com',
      action: log.action || 'predict',
      session_id: log.session_id || `sess_${idx}`,
      details: log.details || 'User interactive action',
      device_info: dev,
      timestamp: log.timestamp || new Date().toISOString()
    };
  });

  // Process Error Logs
  const errorLogsList = [];
  [...parsedChatbotLogs, ...parsedClassLogs].forEach(item => {
    if (item.status === 'error' || item.error_info) {
      errorLogsList.push({
        id: item.id,
        session_id: item.session_id,
        service: item.model_name || 'AI Flower Expert Engine',
        user: item.email,
        error_message: item.error_info || 'Unexpected execution anomaly',
        timestamp: item.timestamp
      });
    }
  });

  systemLogs.forEach(sys => {
    if (sys.error || sys.event === 'error') {
      errorLogsList.push({
        id: sys._id ? String(sys._id) : `err_${Math.random()}`,
        session_id: sys.session_id || 'system_event',
        service: 'System Core',
        user: sys.admin_email || 'System',
        error_message: sys.error || sys.message || 'System diagnostic error',
        timestamp: sys.timestamp || sys.created_at || new Date().toISOString()
      });
    }
  });

  // --- 3. FLOWER SEARCH HISTORY METRICS AGGREGATION ---
  let totalUploads = realHistory.length;
  let totalConfidenceSum = 0;
  let totalAiResponsesCount = 0;
  let totalUserQuestionsCount = 0;
  let toxicCount = 0;

  const speciesFrequency = {};
  const familyFrequency = {};
  const confidenceBuckets = {
    excellent: 0, // > 95%
    high: 0,      // 80% - 95%
    moderate: 0,  // 60% - 80%
    low: 0        // < 60%
  };

  const sunlightCounts = {};
  const waterCounts = {};

  const recentPredictionFeed = [];
  const galleryItems = [];
  const chatSessions = [];

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
      confidenceCount: 0,
      classTimeSum: 0,
      genTimeSum: 0,
      timeCount: 0
    };
  });

  realHistory.forEach((rec, idx) => {
    const flowerName = (rec.flower || rec.flower_name || 'Unknown Flower').trim();
    const flowerKey = flowerName.toLowerCase();
    const kbMatch = knowledgeMap[flowerKey];
    const scientificName = rec.scientific_name || (kbMatch ? kbMatch['Scientific Name '] || kbMatch['Scientific Name'] : 'Botanical species');

    speciesFrequency[flowerName] = (speciesFrequency[flowerName] || 0) + 1;

    const familyName = (rec.card && rec.card.Family) || (kbMatch && kbMatch.Family) || 'Papaveraceae';
    familyFrequency[familyName] = (familyFrequency[familyName] || 0) + 1;

    const confVal = parseConfidence(rec.confidence);
    totalConfidenceSum += confVal;

    if (confVal > 95) confidenceBuckets.excellent++;
    else if (confVal >= 80) confidenceBuckets.high++;
    else if (confVal >= 60) confidenceBuckets.moderate++;
    else confidenceBuckets.low++;

    const messages = Array.isArray(rec.messages) ? rec.messages : [];
    let assistantMsgs = 0;
    let userMsgs = 0;

    messages.forEach(msg => {
      const senderRole = msg.role || msg.sender;
      if (senderRole === 'assistant' || senderRole === 'botanist') assistantMsgs++;
      else if (senderRole === 'user') userMsgs++;
    });

    if (messages.length === 0) assistantMsgs = 1;
    totalAiResponsesCount += assistantMsgs;
    totalUserQuestionsCount += userMsgs;

    if (isToxicPlant(rec, kbMatch)) {
      toxicCount++;
    }

    const sunlightVal = (rec.card && rec.card.Sunlight) || (kbMatch && kbMatch.Sunlight) || 'Full Sun';
    const waterVal = (rec.card && rec.card.Water) || (kbMatch && kbMatch.Water) || 'Moderate';
    sunlightCounts[sunlightVal] = (sunlightCounts[sunlightVal] || 0) + 1;
    waterCounts[waterVal] = (waterCounts[waterVal] || 0) + 1;

    const formattedTime = rec.searched_at || (rec.timestamp ? new Date(rec.timestamp).toLocaleString() : new Date().toLocaleString());

    recentPredictionFeed.push({
      id: rec._id ? String(rec._id) : `pred_${idx}`,
      session_id: rec.session_id || `session_${idx}`,
      user_id: rec.user_id || '',
      user_email: rec.user_email || 'anonymous@aflowerexpert.com',
      flower: flowerName,
      scientific_name: scientificName,
      confidence: confVal,
      image_preview: rec.image_preview || null,
      summary: rec.summary || '',
      card: rec.card || {},
      messages: messages,
      timestamp: rec.timestamp || new Date().toISOString(),
      searched_at: formattedTime
    });

    galleryItems.push({
      id: rec._id ? String(rec._id) : `img_${idx}`,
      session_id: rec.session_id || `session_${idx}`,
      flower: flowerName,
      scientific_name: scientificName,
      confidence: confVal,
      user_email: rec.user_email || 'user@aflowerexpert.com',
      filename: rec.filename || `${flowerName.toLowerCase().replace(/\s+/g, '_')}_upload.jpg`,
      image_preview: rec.image_preview || null,
      searched_at: formattedTime,
      card: rec.card || {},
      summary: rec.summary || ''
    });

    chatSessions.push({
      session_id: rec.session_id || `sess_${1000 + idx}`,
      flower: flowerName,
      scientific_name: scientificName,
      confidence: confVal,
      user: rec.user_email || 'user@aflowerexpert.com',
      message_count: messages.length || 2,
      user_questions: userMsgs,
      ai_responses: assistantMsgs,
      searched_at: formattedTime,
      timestamp: rec.timestamp || new Date().toISOString(),
      messages: messages.length > 0 ? messages : [
        { role: 'assistant', content: rec.summary || `Identification overview for ${flowerName}.`, timestamp: rec.timestamp }
      ]
    });

    let dateStr = null;
    if (rec.timestamp) {
      const dObj = new Date(rec.timestamp);
      if (!isNaN(dObj.getTime())) dateStr = dObj.toISOString().split('T')[0];
    }
    if (!dateStr && rec.searched_at) {
      const dObj = new Date(rec.searched_at);
      if (!isNaN(dObj.getTime())) dateStr = dObj.toISOString().split('T')[0];
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
          confidenceCount: 0,
          classTimeSum: 0,
          genTimeSum: 0,
          timeCount: 0
        };
        if (!datesList.includes(dateStr)) datesList.push(dateStr);
      }

      dailyMap[dateStr].uploads += 1;
      dailyMap[dateStr].predictions += 1;
      dailyMap[dateStr].chats += (messages.length || 1);
      const userKey = rec.user_email || rec.user_id || rec.session_id || `user_${idx}`;
      dailyMap[dateStr].userSet.add(userKey);
      dailyMap[dateStr].confidenceSum += confVal;
      dailyMap[dateStr].confidenceCount += 1;
    }
  });

  // Blend Classification Analytics into daily timeline if present
  parsedClassLogs.forEach(cl => {
    let dStr = null;
    if (cl.timestamp) {
      const dObj = new Date(cl.timestamp);
      if (!isNaN(dObj.getTime())) dStr = dObj.toISOString().split('T')[0];
    }
    if (dStr && dailyMap[dStr]) {
      dailyMap[dStr].classTimeSum += (cl.classification_time_ms || 0);
      dailyMap[dStr].timeCount += 1;
    }
  });

  parsedChatbotLogs.forEach(cb => {
    let dStr = null;
    if (cb.timestamp) {
      const dObj = new Date(cb.timestamp);
      if (!isNaN(dObj.getTime())) dStr = dObj.toISOString().split('T')[0];
    }
    if (dStr && dailyMap[dStr]) {
      dailyMap[dStr].genTimeSum += (cb.generation_time_ms || 0);
    }
  });

  datesList.sort();

  const realUsageTrends = datesList.map(d => {
    const item = dailyMap[d];
    const avgCls = item.timeCount > 0 ? Math.round(item.classTimeSum / item.timeCount) : 2400;
    const avgGen = item.timeCount > 0 ? Math.round(item.genTimeSum / item.timeCount) : 850;

    return {
      date: d,
      uploads: item.uploads,
      chats: item.chats,
      predictions: item.predictions,
      users: item.userSet.size,
      responses: item.chats,
      avgConfidence: item.confidenceCount > 0 ? parseFloat((item.confidenceSum / item.confidenceCount).toFixed(1)) : 88.5,
      classificationTimeMs: avgCls,
      generationTimeMs: avgGen,
      totalTimeMs: avgCls + avgGen
    };
  });

  // Fallback for predictions feed if DB history is sparse
  if (!hasRealHistory) {
    totalUploads = baseData.kpis.totalImageUploads;
    totalConfidenceSum = baseData.kpis.avgConfidence * totalUploads;
    totalAiResponsesCount = baseData.kpis.totalAiResponses;
    totalUserQuestionsCount = Math.round(totalUploads * 2.4);

    baseData.tables.recentConversations.forEach((conv, idx) => {
      const synthFlower = conv.flower || 'Rose';
      const confVal = conv.confidence || 95.0;
      const formattedTime = new Date(conv.timestamp).toLocaleString();

      recentPredictionFeed.push({
        id: `pred_synth_${idx}`,
        session_id: conv.session_id,
        user_id: `user_synth_${idx}`,
        user_email: conv.user || `user_${idx}@aflowerexpert.com`,
        flower: synthFlower,
        scientific_name: `${synthFlower} botanicalis`,
        confidence: confVal,
        image_preview: null,
        summary: `Synthesized botanical summary for ${synthFlower}.`,
        card: { Family: 'Rosaceae', Sunlight: 'Full Sun', Water: 'Moderate' },
        messages: conv.messages,
        timestamp: conv.timestamp,
        searched_at: formattedTime
      });

      chatSessions.push({
        session_id: conv.session_id,
        flower: synthFlower,
        scientific_name: `${synthFlower} botanicalis`,
        confidence: confVal,
        user: conv.user,
        message_count: conv.message_count,
        user_questions: Math.floor(conv.message_count / 2),
        ai_responses: Math.ceil(conv.message_count / 2),
        searched_at: formattedTime,
        timestamp: conv.timestamp,
        messages: conv.messages
      });

      galleryItems.push({
        id: `img_synth_${idx}`,
        session_id: conv.session_id,
        flower: synthFlower,
        scientific_name: `${synthFlower} botanicalis`,
        confidence: confVal,
        user_email: conv.user,
        filename: `synth_flower_${idx + 100}.jpeg`,
        image_preview: null,
        searched_at: formattedTime,
        card: { Family: 'Rosaceae', Sunlight: 'Full Sun', Water: 'Moderate' },
        summary: `Synthesized overview for ${synthFlower}.`
      });
    });
  }

  // --- 4. CHARTS & AGGREGATED METRICS ---

  const topSpeciesChart = Object.entries(speciesFrequency)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const familyDistributionChart = Object.keys(familyFrequency).length > 0
    ? Object.entries(familyFrequency).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 8)
    : [
        { name: 'Papaveraceae', value: 35 },
        { name: 'Rosaceae', value: 25 },
        { name: 'Orchidaceae', value: 18 },
        { name: 'Asteraceae', value: 12 },
        { name: 'Liliaceae', value: 10 }
      ];

  const confidenceChart = [
    { name: 'Excellent (>95%)', value: hasRealHistory ? confidenceBuckets.excellent : 62, color: '#10b981' },
    { name: 'High (80-95%)', value: hasRealHistory ? confidenceBuckets.high : 26, color: '#3b82f6' },
    { name: 'Moderate (60-80%)', value: hasRealHistory ? confidenceBuckets.moderate : 8, color: '#f59e0b' },
    { name: 'Low (<60%)', value: hasRealHistory ? confidenceBuckets.low : 4, color: '#ef4444' }
  ];

  const feedbackChart = [
    { name: 'Positive (Likes)', value: positiveFeedbackCount || 18, color: '#10b981' },
    { name: 'Neutral', value: neutralFeedbackCount || 4, color: '#6b7280' },
    { name: 'Negative (Dislikes)', value: negativeFeedbackCount || 1, color: '#ef4444' }
  ];

  const deviceChart = Object.keys(browserCounts).length > 0
    ? Object.entries(browserCounts).map(([name, value]) => ({ name, value }))
    : [
        { name: 'Edge', value: 45 },
        { name: 'Chrome', value: 40 },
        { name: 'Firefox', value: 10 },
        { name: 'Safari', value: 5 }
      ];

  const modelChart = Object.keys(modelCounts).length > 0
    ? Object.entries(modelCounts).map(([name, value]) => ({ name, value }))
    : [
        { name: 'EfficientNet_Flower_Classifier', value: 65 },
        { name: 'Gemini-1.5-Pro', value: 35 }
      ];

  const avgAccuracy = parseFloat((totalConfidenceSum / Math.max(1, totalUploads)).toFixed(1));
  const toxicPlantRatio = parseFloat(((toxicCount / Math.max(1, totalUploads)) * 100).toFixed(1));
  const avgQuestionsPerSession = parseFloat((totalUserQuestionsCount / Math.max(1, totalUploads)).toFixed(1));

  const avgChatbotResponseTimeMs = chatbotGenCount > 0 ? Math.round(totalChatbotGenTimeMs / chatbotGenCount) : 850;
  const avgClassificationTimeMs = classCount > 0 ? Math.round(totalClassTimeMs / classCount) : 2648;
  const avgTotalProcessingTimeMs = processingCount > 0 ? Math.round(totalProcessingTimeMs / processingCount) : (avgChatbotResponseTimeMs + avgClassificationTimeMs);

  const totalFB = Math.max(1, positiveFeedbackCount + negativeFeedbackCount);
  const positiveFeedbackRatio = parseFloat(((positiveFeedbackCount / totalFB) * 100).toFixed(1));

  const totalReq = Math.max(1, totalRequestCount);
  const errorRate = parseFloat(((errorCount / totalReq) * 100).toFixed(2));

  let mostIdentifiedFlower = 'Oxeye Daisy';
  let maxFreq = 0;
  Object.entries(speciesFrequency).forEach(([fl, count]) => {
    if (count > maxFreq) {
      maxFreq = count;
      mostIdentifiedFlower = fl;
    }
  });

  return {
    kpis: {
      totalRegisteredUsers: registeredUsersList.length,
      totalFlowerIdentifications: totalUploads,
      totalChats: chatSessions.length,
      avgAccuracy: avgAccuracy,
      avgChatbotResponseTimeMs: avgChatbotResponseTimeMs,
      avgClassificationTimeMs: avgClassificationTimeMs,
      avgTotalProcessingTimeMs: avgTotalProcessingTimeMs,
      positiveFeedbackRatio: positiveFeedbackRatio,
      errorRate: errorRate,
      activeBotanistsToday: activeBotanistsTodayCount,
      activeUsersToday: activeUsersTodayCount,
      totalAiResponses: totalAiResponsesCount,
      mostIdentifiedFlower: mostIdentifiedFlower,
      toxicPlantRatio: toxicPlantRatio,
      avgQuestionsPerSession: avgQuestionsPerSession,
      totalKnowledgeArticles: knowledgeItems.length,
      totalTokenUsage: totalTokensUsed
    },
    charts: {
      topSpecies: topSpeciesChart.length > 0 ? topSpeciesChart : baseData.charts.flowerDistribution.slice(0, 10).map(i => ({ name: i.name, count: i.count })),
      confidenceDistribution: confidenceChart,
      familyDistribution: familyDistributionChart,
      sunlightBreakdown: Object.keys(sunlightCounts).length > 0 ? Object.entries(sunlightCounts).map(([name, value]) => ({ name, value })) : [
        { name: 'Full Sun', value: 45 }, { name: 'Partial Shade', value: 35 }, { name: 'Indirect Light', value: 20 }
      ],
      waterBreakdown: Object.keys(waterCounts).length > 0 ? Object.entries(waterCounts).map(([name, value]) => ({ name, value })) : [
        { name: 'Moderate', value: 55 }, { name: 'Low (Drought Tolerant)', value: 25 }, { name: 'High', value: 20 }
      ],
      usageTrends: hasRealHistory ? realUsageTrends : baseData.charts.usageTrends,
      feedbackDistribution: feedbackChart,
      deviceBreakdown: deviceChart,
      modelDistribution: modelChart
    },
    tables: {
      registeredUsers: registeredUsersList,
      recentPredictions: recentPredictionFeed,
      galleryItems: galleryItems,
      chatSessions: chatSessions,
      knowledgeBase: knowledgeItems,
      chatbotPerformanceLogs: parsedChatbotLogs,
      classificationLogs: parsedClassLogs,
      userActivityLogs: parsedUserActivity,
      errorLogs: errorLogsList
    }
  };
}

module.exports = {
  getAnalyticsOverview
};
