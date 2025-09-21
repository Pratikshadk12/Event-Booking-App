const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Check if we should use fallback mode
    if (process.env.DB_FALLBACK_MODE === 'true') {
      console.log('📊 Database: Running in fallback mode (MongoDB not required)');
      return;
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`📊 Database: MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('📊 Database connection error:', error.message);
    console.log('📊 Database: Continuing without MongoDB (fallback mode)');
    // Don't exit the process, just continue without database
  }
};

module.exports = connectDB;