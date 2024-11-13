require('dotenv').config();
const { MongoClient } = require('mongodb');

const username = encodeURIComponent(process.env.MONGODB_USERNAME);
const password = encodeURIComponent(process.env.MONGODB_PASSWORD);
const dbName = process.env.MONGODB_DATABASE;
const host = process.env.MONGODB_HOST;
const port = process.env.MONGODB_PORT;
const uri = `mongodb://${username}:${password}@${host}:${port}/${dbName}?authSource=${dbName}`;

let db = null;
async function connectDB() {
  if (db) return db;
  try {
    const client = await MongoClient.connect(uri);
    db = client.db(dbName);
    console.log('Connected to MongoDB!');
    return db;
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    throw error;
  }
}

async function createIndexes() {
  const db = await connectDB();
  const collection = db.collection('users');
  await collection.createIndex({ userName: 1 }, { unique: true });
  await collection.createIndex({ accountNumber: 1 }, { unique: true });
  await collection.createIndex({ emailAddress: 1 }, { unique: true });
  await collection.createIndex({ identityNumber: 1 }, { unique: true });
}

module.exports = { connectDB, createIndexes };