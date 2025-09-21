const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Check if we should use fallback mode
    if (process.env.DB_FALLBACK_MODE === 'true') {
      console.log('📊 Database: Running in fallback mode (MongoDB not required)');
      return;
    }

    // Check if MONGODB_URI is provided
    if (!process.env.MONGODB_URI) {
      console.log('⚠️ Database: MONGODB_URI not provided, continuing without database');
      return;
    }

    console.log('📊 Connecting to MongoDB...');
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // 5 seconds
      socketTimeoutMS: 45000, // 45 seconds
    });
    
    console.log(`📊 Database: MongoDB Connected: ${conn.connection.host}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('📊 Database connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('📊 Database disconnected');
    });
    
  } catch (error) {
    console.error('📊 Database connection error:', error.message);
    console.log('📊 Database: Continuing without MongoDB (fallback mode)');
    // Don't exit the process, just continue without database
  }
};

module.exports = connectDB;