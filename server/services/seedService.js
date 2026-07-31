/**
 * seedService.js
 * Synthesizes realistic, comprehensive analytics data fallback if MongoDB collections are empty or sparse.
 * Guarantees rich metrics for KPIs, charts, and detailed filterable tables.
 */

const FLOWER_SPECIES = [
  'Rose', 'Tulip', 'Sunflower', 'Orchid', 'Lily', 'Daisy', 'Lavender', 
  'Lotus', 'Jasmine', 'Hibiscus', 'Marigold', 'Carnation', 'Dahlia', 'Peony', 'Iris'
];

const ERROR_ENDPOINTS = [
  '/api/predict', '/api/chat', '/api/search', '/api/knowledge', '/api/feedback'
];

const USER_LOCATIONS = [
  'United States (US-East)', 'Germany (EU-Central)', 'India (IN-South)', 
  'Japan (AP-Northeast)', 'United Kingdom (EU-West)', 'Canada (CA-Central)'
];

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

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min, max, decimals = 2) {
  const val = Math.random() * (max - min) + min;
  return parseFloat(val.toFixed(decimals));
}

function generateSynthesizedData(filterDateRange = '30d') {
  const dayCount = filterDateRange === '7d' ? 7 : filterDateRange === '90d' ? 90 : filterDateRange === 'ytd' ? 180 : 30;
  const dates = generateDateSeries(dayCount);

  // Time series usage trends
  const usageTrends = dates.map(date => {
    const baseUsers = getRandomInt(120, 450);
    const chats = Math.round(baseUsers * getRandomFloat(1.5, 3.2));
    const uploads = Math.round(baseUsers * getRandomFloat(0.8, 1.8));
    const predictions = Math.round(uploads * getRandomFloat(1.1, 1.4));
    const responses = chats + predictions;

    return {
      date,
      users: baseUsers,
      chats,
      uploads,
      predictions,
      responses,
      avgConfidence: getRandomFloat(89.5, 98.8),
      avgLatencyMs: getRandomInt(210, 480)
    };
  });

  // KPI summary calculation
  const totalUsers = usageTrends.reduce((acc, curr) => acc + curr.users, 0);
  const totalChats = usageTrends.reduce((acc, curr) => acc + curr.chats, 0);
  const totalImageUploads = usageTrends.reduce((acc, curr) => acc + curr.uploads, 0);
  const totalPredictions = usageTrends.reduce((acc, curr) => acc + curr.predictions, 0);
  const totalAiResponses = usageTrends.reduce((acc, curr) => acc + curr.responses, 0);
  const avgConfidence = parseFloat((usageTrends.reduce((acc, curr) => acc + curr.avgConfidence, 0) / usageTrends.length).toFixed(2));
  const avgResponseTimeMs = Math.round(usageTrends.reduce((acc, curr) => acc + curr.avgLatencyMs, 0) / usageTrends.length);
  const dailyActiveUsers = usageTrends[usageTrends.length - 1].users;
  const totalSearches = Math.round(totalPredictions * 1.65);

  // Flower prediction distribution
  const flowerDistribution = FLOWER_SPECIES.map((flower, idx) => {
    const share = Math.max(5, 100 - idx * 6 + getRandomInt(-3, 3));
    return {
      name: flower,
      count: Math.round(totalPredictions * (share / 500)),
      confidence: getRandomFloat(91.2, 99.1)
    };
  }).sort((a, b) => b.count - a.count);

  // Most searched flowers
  const mostSearchedFlowers = flowerDistribution.slice(0, 10).map(item => ({
    flower: item.name,
    searches: Math.round(item.count * 1.6),
    views: Math.round(item.count * 2.4)
  }));

  // User activity timeline (hourly distribution)
  const hourlyActivity = Array.from({ length: 24 }, (_, hour) => {
    const period = hour < 6 ? 'night' : hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';
    const multiplier = period === 'night' ? 0.2 : period === 'morning' ? 0.9 : period === 'afternoon' ? 1.4 : 1.1;
    return {
      hour: `${hour.toString().padStart(2, '0')}:00`,
      activeUsers: Math.round(getRandomInt(15, 50) * multiplier),
      requests: Math.round(getRandomInt(40, 150) * multiplier)
    };
  });

  // Confidence score distribution
  const confidenceDistribution = [
    { range: '95% - 100%', count: Math.round(totalPredictions * 0.62), percentage: 62 },
    { range: '85% - 94%', count: Math.round(totalPredictions * 0.26), percentage: 26 },
    { range: '75% - 84%', count: Math.round(totalPredictions * 0.08), percentage: 8 },
    { range: 'Below 75%', count: Math.round(totalPredictions * 0.04), percentage: 4 },
  ];

  // AI response time trends & latency percentiles
  const responseTimeTrends = dates.slice(-14).map(date => ({
    date,
    p50: getRandomInt(180, 240),
    p90: getRandomInt(320, 490),
    p99: getRandomInt(650, 980),
    avg: getRandomInt(220, 310)
  }));

  // Chatbot performance metrics
  const chatbotPerformance = {
    totalConversations: totalChats,
    avgMessagesPerSession: 4.8,
    completionRate: 96.4,
    sentimentBreakdown: [
      { name: 'Positive / Helpful', value: 78, color: '#10b981' },
      { name: 'Neutral Inquiry', value: 17, color: '#3b82f6' },
      { name: 'Unresolved / Low Conf', value: 5, color: '#ef4444' }
    ]
  };

  // 1. Recent Conversations Table
  const recentConversations = Array.from({ length: 30 }, (_, i) => {
    const flower = FLOWER_SPECIES[i % FLOWER_SPECIES.length];
    const timestamp = new Date(Date.now() - i * 3600000 * 1.8).toISOString();
    return {
      session_id: `sess_${1000 + i}`,
      user: `user_${800 + i}@aflowerexpert.com`,
      flower,
      message_count: getRandomInt(2, 12),
      confidence: getRandomFloat(88.0, 99.5),
      duration: `${getRandomInt(45, 320)}s`,
      timestamp,
      messages: [
        { role: 'user', content: `Can you identify this flower? I found it in my garden.` },
        { role: 'assistant', content: `This flower appears to be a **${flower}** with high confidence. It thrives best in well-draining soil and partial sunlight.` },
        { role: 'user', content: `How often should I water it during spring?` },
        { role: 'assistant', content: `During spring, water the ${flower} roughly 2-3 times per week, ensuring the soil remains moist but not waterlogged.` }
      ]
    };
  });

  // 2. Uploaded Images Metadata Table
  const uploadedImages = Array.from({ length: 30 }, (_, i) => {
    const flower = FLOWER_SPECIES[(i * 2) % FLOWER_SPECIES.length];
    const width = getRandomInt(1080, 4032);
    const height = getRandomInt(1080, 3024);
    const sizeKb = getRandomInt(450, 3800);
    return {
      id: `img_${500 + i}`,
      filename: `flower_upload_${100 + i}.jpeg`,
      dimensions: `${width} x ${height}`,
      size: `${(sizeKb / 1024).toFixed(2)} MB`,
      mime_type: 'image/jpeg',
      predicted_flower: flower,
      confidence: getRandomFloat(90.0, 99.8),
      user: `user_${800 + (i % 10)}@aflowerexpert.com`,
      timestamp: new Date(Date.now() - i * 2700000).toISOString()
    };
  });

  // 3. Prediction History Table
  const predictionHistory = Array.from({ length: 30 }, (_, i) => {
    const flower = FLOWER_SPECIES[i % FLOWER_SPECIES.length];
    const conf = getRandomFloat(72.0, 99.9);
    return {
      id: `pred_${9000 + i}`,
      flower,
      scientific_name: `${flower} botanicalis`,
      confidence: conf,
      response_time_ms: getRandomInt(180, 520),
      status: conf >= 85 ? 'High Confidence' : conf >= 75 ? 'Moderate' : 'Low Confidence',
      user: `user_${800 + (i % 15)}@aflowerexpert.com`,
      timestamp: new Date(Date.now() - i * 2100000).toISOString()
    };
  });

  // 4. User Search History Table
  const searchHistory = Array.from({ length: 30 }, (_, i) => {
    const flower = FLOWER_SPECIES[i % FLOWER_SPECIES.length];
    return {
      id: `srch_${400 + i}`,
      query: `How to care for ${flower} in winter`,
      matched_flower: flower,
      results_found: getRandomInt(4, 18),
      location: USER_LOCATIONS[i % USER_LOCATIONS.length],
      user: `user_${800 + (i % 12)}@aflowerexpert.com`,
      timestamp: new Date(Date.now() - i * 1900000).toISOString()
    };
  });

  // 5. Feedback & Ratings Table
  const feedbackList = Array.from({ length: 25 }, (_, i) => {
    const rating = getRandomInt(3, 5);
    const category = i % 3 === 0 ? 'Accuracy' : i % 3 === 1 ? 'Response Speed' : 'Answer Detail';
    return {
      id: `fb_${300 + i}`,
      user: `user_${800 + (i % 8)}@aflowerexpert.com`,
      rating,
      category,
      comment: rating === 5 
        ? `Super accurate prediction! The care instructions were extremely helpful.` 
        : `Identified the flower quickly, but could provide more details on watering schedule.`,
      status: 'Reviewed',
      timestamp: new Date(Date.now() - i * 4500000).toISOString()
    };
  });

  // 6. Error Logs & API Usage Table
  const errorLogs = Array.from({ length: 25 }, (_, i) => {
    const isError = i % 4 === 0;
    const statusCode = isError ? (i % 8 === 0 ? 500 : 400) : 200;
    const endpoint = ERROR_ENDPOINTS[i % ERROR_ENDPOINTS.length];
    return {
      id: `log_${700 + i}`,
      endpoint,
      method: endpoint.includes('predict') || endpoint.includes('chat') ? 'POST' : 'GET',
      status_code: statusCode,
      latency_ms: getRandomInt(120, 850),
      user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/126.0',
      error_message: isError ? (statusCode === 500 ? 'Internal Error: Model inference timeout' : 'Bad Request: Invalid image format') : 'None',
      timestamp: new Date(Date.now() - i * 3200000).toISOString()
    };
  });

  return {
    kpis: {
      totalUsers,
      totalChats,
      totalImageUploads,
      totalPredictions,
      totalAiResponses,
      avgConfidence,
      avgResponseTimeMs,
      dailyActiveUsers,
      totalSearches,
      trends: {
        usersChange: '+14.2%',
        chatsChange: '+18.6%',
        uploadsChange: '+11.8%',
        predictionsChange: '+15.4%',
        responsesChange: '+17.9%',
        confidenceChange: '+1.5%',
        responseTimeChange: '-8.4%',
        dauChange: '+9.3%',
        searchesChange: '+13.1%'
      }
    },
    charts: {
      usageTrends,
      flowerDistribution,
      mostSearchedFlowers,
      hourlyActivity,
      confidenceDistribution,
      responseTimeTrends,
      chatbotPerformance
    },
    tables: {
      recentConversations,
      uploadedImages,
      predictionHistory,
      searchHistory,
      feedbackList,
      errorLogs
    }
  };
}

module.exports = {
  generateSynthesizedData
};
