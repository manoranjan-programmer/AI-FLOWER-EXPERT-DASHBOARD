const { MongoClient } = require('mongodb');
require('dotenv').config();

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017';
const dbName = process.env.MONGO_DB || 'test';

let client = null;
let db = null;

async function connectDB() {
  if (db) return db;
  try {
    client = new MongoClient(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    await client.connect();
    db = client.db(dbName);
    console.log(`Connected to MongoDB Atlas successfully [DB: ${dbName}]`);
    return db;
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err.message);
    return null;
  }
}

function getCollection(collName) {
  if (!db) return null;
  return db.collection(collName);
}

// Read-only helpers for existing collections
async function getSearchHistory(query = {}, limit = 500) {
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
  getSearchHistory,
  getFlowerKnowledge,
  logAnalyticsEvent
};
