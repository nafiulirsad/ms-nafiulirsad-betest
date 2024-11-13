const { connectDB } = require('../config/mongodb');
const { ObjectId } = require('mongodb');
const redisClient = require('../config/redis');

class User {
  constructor(userName, accountNumber, emailAddress, identityNumber) {
    this.userName = userName;
    this.accountNumber = accountNumber;
    this.emailAddress = emailAddress;
    this.identityNumber = identityNumber;
  }

  static async getCachedData(key, query) {
    const cachedData = await redisClient.get(key);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    const db = await connectDB();
    const collection = db.collection('users');
    const data = await collection.findOne(query);
    if (data) {
      redisClient.set(key, JSON.stringify(data), 'EX', 3600);
    }
    return data;
  }

  static async create(userData) {
    const db = await connectDB();
    const collection = db.collection('users');
    const result = await collection.insertOne(userData);
    return await collection.findOne({ _id: result.insertedId });
  }

  static async findByUserName(userName) {
    return this.getCachedData(userName, { userName });
  }

  static async findByAccountNumber(accountNumber) {
    return this.getCachedData(accountNumber, { accountNumber });
  }

  static async findByEmailAddress(emailAddress) {
    return this.getCachedData(emailAddress, { emailAddress });
  }

  static async findByIdentityNumber(identityNumber) {
    return this.getCachedData(identityNumber, { identityNumber });
  }

  static async getAllUsers() {
    const cachedUsers = await redisClient.get('allUsers');
    if (cachedUsers) {
      return JSON.parse(cachedUsers);
    }
    const db = await connectDB();
    const collection = db.collection('users');
    const users = await collection.find({}).toArray();
    if(users){
      redisClient.set('allUsers', JSON.stringify(users), 'EX', 3600);
    }
    return users;
  }

  static async update(userId, updatedData) {
    const db = await connectDB();
    const collection = db.collection('users');
    const result = await collection.updateOne(
      { _id: new ObjectId(userId) }, 
      { $set: updatedData }
    );
    return result.modifiedCount > 0;
  }

  static async delete(userId) {
    const db = await connectDB();
    const collection = db.collection('users');
    const result = await collection.deleteOne({ _id: new ObjectId(userId) });
    return result.deletedCount > 0;
  }
}

module.exports = User;