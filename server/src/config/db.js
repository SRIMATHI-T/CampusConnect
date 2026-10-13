const mongoose = require('mongoose');

async function connectDatabase() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/CampusConnect';
  await mongoose.connect(uri, { dbName: 'CampusConnect', serverSelectionTimeoutMS: 10000 });
  console.log(`MongoDB connected: ${mongoose.connection.name}`);
}
module.exports = connectDatabase;
