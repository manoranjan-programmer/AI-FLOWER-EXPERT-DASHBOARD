const { MongoClient } = require('mongodb');
require('dotenv').config();

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017';
const dbName = process.env.MONGO_DB || 'test';

let client = null;
let db = null;
let connectPromise = null;

async function connectDB() {
  if (db) return db;
  if (connectPromise) return connectPromise;

  connectPromise = (async () => {
    try {
      client = new MongoClient(mongoUri, {
        serverSelectionTimeoutMS: 10000,
      });
      await client.connect();
      db = client.db(dbName);
      console.log(`Connected to MongoDB Atlas successfully [DB: ${dbName}]`);
      return db;
    } catch (err) {
      console.error('Failed to connect to MongoDB:', err.message);
      connectPromise = null;
      return null;
    }
  })();

  return connectPromise;
}


function getCollection(collName) {
  if (!db) return null;
  return db.collection(collName);
}

// Read-only helpers for existing collections
async function getUsers(query = {}, limit = 500) {
  try {
    const database = await connectDB();
    if (!database) return [];
    const usersColl = database.collection(process.env.MONGO_USERS_COLLECTION || 'Users');
    return await usersColl.find(query).sort({ created_at: -1 }).limit(limit).toArray();
  } catch (err) {
    console.error('Error fetching users:', err.message);
    return [];
  }
}

async function getSearchHistory(query = {}, limit = 1000) {
  try {
    const database = await connectDB();
    if (!database) return [];
    const historyColl = database.collection(process.env.MONGO_HISTORY_COLLECTION || 'Flower_Search_History');
    return await historyColl.find(query).sort({ _id: -1 }).limit(limit).toArray();
  } catch (err) {
    console.error('Error fetching search history:', err.message);
    return [];
  }
}

async function getFlowerKnowledge(query = {}, limit = 500) {
  try {
    const database = await connectDB();
    if (!database) return [];
    const knowledgeColl = database.collection(process.env.MONGO_KNOWLEDGE_COLLECTION || 'Flower_Knowledge_Base');
    return await knowledgeColl.find(query).limit(limit).toArray();
  } catch (err) {
    console.error('Error fetching knowledge base:', err.message);
    return [];
  }
}

// Read-only helpers for analytics collections
async function getChatbotPerformance(query = {}, limit = 1000) {
  try {
    const database = await connectDB();
    if (!database) return [];
    const coll = database.collection(process.env.MONGO_CHATBOT_PERFORMANCE_COLLECTION || 'Chatbot_Performance_Analytics');
    return await coll.find(query).sort({ _id: -1 }).limit(limit).toArray();
  } catch (err) {
    console.error('Error fetching chatbot performance analytics:', err.message);
    return [];
  }
}

async function getClassificationAnalytics(query = {}, limit = 1000) {
  try {
    const database = await connectDB();
    if (!database) return [];
    const coll = database.collection(process.env.MONGO_CLASSIFICATION_COLLECTION || 'Classification_Analytics');
    return await coll.find(query).sort({ _id: -1 }).limit(limit).toArray();
  } catch (err) {
    console.error('Error fetching classification analytics:', err.message);
    return [];
  }
}

async function getUserActivity(query = {}, limit = 1000) {
  try {
    const database = await connectDB();
    if (!database) return [];
    const coll = database.collection(process.env.MONGO_USER_ACTIVITY_COLLECTION || 'User_Activity');
    return await coll.find(query).sort({ _id: -1 }).limit(limit).toArray();
  } catch (err) {
    console.error('Error fetching user activity:', err.message);
    return [];
  }
}

async function getAnalyticsLogs(query = {}, limit = 1000) {
  try {
    const database = await connectDB();
    if (!database) return [];
    const coll = database.collection(process.env.MONGO_ANALYTICS_LOGS || 'Analytics_Logs');
    return await coll.find(query).sort({ _id: -1 }).limit(limit).toArray();
  } catch (err) {
    console.error('Error fetching analytics logs:', err.message);
    return [];
  }
}

// Non-breaking logging for analytics logs
async function logAnalyticsEvent(eventData) {
  try {
    const database = await connectDB();
    if (!database) return false;
    const analyticsColl = database.collection(process.env.MONGO_ANALYTICS_LOGS || 'Analytics_Logs');
    await analyticsColl.insertOne({
      ...eventData,
      timestamp: new Date().toISOString(),
      created_at: new Date()
    });
    return true;
  } catch (err) {
    console.warn('Non-breaking logging warning:', err.message);
    return false;
  }
}

module.exports = {
  connectDB,
  getCollection,
  getUsers,
  getSearchHistory,
  getFlowerKnowledge,
  getChatbotPerformance,
  getClassificationAnalytics,
  getUserActivity,
  getAnalyticsLogs,
  logAnalyticsEvent
};


