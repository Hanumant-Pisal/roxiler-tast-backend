const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { env } = require('./config/env');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');


const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const storeRoutes = require('./routes/storeRoutes');
const ratingRoutes = require('./routes/ratingRoutes');

const app = express();


app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = (env.FRONTEND_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
app.use(
  cors({
    origin: function (origin, cb) {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error('CORS blocked'), false);
    },
    credentials: true
  })
);


app.get('/', (_req, res) => {
  res.json({
    message: 'Backend API is running',
    health: '/health',
    docs: '/api'
  });
});


app.get('/health', (_req, res) => res.json({ status: 'ok' }));


app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/ratings', ratingRoutes);


app.use(notFound);
app.use(errorHandler);

module.exports = app;
