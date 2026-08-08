const { getAnalyticsOverview } = require('./services/analyticsService');

async function test() {
  try {
    const data = await getAnalyticsOverview('30d');
    console.log('=== KPIS ===');
    console.log(data.kpis);
    console.log('\n=== TABLES COUNTS ===');
    Object.keys(data.tables).forEach(k => {
      console.log(`${k}: ${data.tables[k].length} items`);
    });
    console.log('\n=== SAMPLE RECENT PREDICTION ===');
    console.log(data.tables.recentPredictions[0]);
    console.log('\n=== SAMPLE CHAT SESSION ===');
    console.log(data.tables.chatSessions[0]);
    console.log('\n=== SAMPLE KNOWLEDGE ARTICLE ===');
    console.log(data.tables.knowledgeBase[0]);
    console.log('\n=== SAMPLE REGISTERED USER ===');
    console.log(data.tables.registeredUsers[0]);
  } catch (err) {
    console.error('Test error:', err);
  } process.exit(0);
}

test();
