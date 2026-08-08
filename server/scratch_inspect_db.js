const { MongoClient } = require('mongodb');
require('dotenv').config();

const mongoUri = process.env.MONGO_URI;
const dbName = process.env.MONGO_DB || 'test';

async function main() {
  console.log('Connecting to URI:', mongoUri.replace(/:[^:@]+@/, ':****@'));
  const client = new MongoClient(mongoUri);
  try {
    await client.connect();
    const db = client.db(dbName);
    console.log(`\n=== Connected to Database: ${db.databaseName} ===\n`);
    
    const collections = await db.listCollections().toArray();
    console.log('Collections in database:', collections.map(c => c.name));

    for (const colInfo of collections) {
      const colName = colInfo.name;
      const count = await db.collection(colName).countDocuments();
      const sample = await db.collection(colName).find().limit(2).toArray();
      console.log(`\n----------------------------------------`);
      console.log(`Collection: "${colName}" | Count: ${count}`);
      console.log(`Sample Docs:`, JSON.stringify(sample, null, 2));
    }
  } catch (err) {
    console.error('Inspection Error:', err);
  } finally {
    await client.close();
  }
}

main();
