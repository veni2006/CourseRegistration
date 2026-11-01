const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

const mongoose = require('mongoose');

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI is missing from environment variables');
  }

  try {
    const conn = await mongoose.connect(uri, {
      dbName: 'college_course_registration',
      serverSelectionTimeoutMS: 8000
    });
    console.log(`[MongoDB Connected] Host: ${conn.connection.host}, Database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB Connection Error] ${error.message}`);
    console.error(`[Atlas Note] If connection fails with SSL / ServerSelection error, make sure your current IP is whitelisted in MongoDB Atlas Network Access (or set to 0.0.0.0/0 for access anywhere).`);
    throw error;
  }
};

module.exports = connectDB;
