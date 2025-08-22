

const mongoose = require('mongoose');
const { env } = require('./env');

async function connectDB() {
  try {
    mongoose.set('strictQuery', true);
    
    await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000, // 30 seconds timeout
      socketTimeoutMS: 45000, // 45 seconds socket timeout
      connectTimeoutMS: 30000, // 30 seconds connection timeout
      retryWrites: true,
      w: 'majority'
    });
    
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection error:', error.message);
    // Exit process with failure
    process.exit(1);
  }
}

// Handle connection events
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

module.exports = { connectDB };










// const mongoose = require('mongoose');
// const { env } = require('./env');

// async function connectDB() {
//   mongoose.set('strictQuery', true);
//   await mongoose.connect(env.MONGODB_URI);

//   console.log('Database connected successfully');
// }

// module.exports = { connectDB };
