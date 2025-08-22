const dotenv = require('dotenv');
dotenv.config();

const required = ['MONGODB_URI', 'JWT_SECRET', 'REFRESH_SECRET', 'FRONTEND_ORIGINS'];
required.forEach(k => {
  if (!process.env[k]) {
    console.warn(`Missing env var: ${k}`);
  }
});

const env = {
  PORT: process.env.PORT || 9000,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '15m',
  REFRESH_SECRET: process.env.REFRESH_SECRET,
  REFRESH_EXPIRES_IN: process.env.REFRESH_EXPIRES_IN || '7d',
  FRONTEND_ORIGINS: process.env.FRONTEND_ORIGINS || 'http://localhost:5173',
  NODE_ENV: process.env.NODE_ENV || 'development'
};

module.exports = { env };
