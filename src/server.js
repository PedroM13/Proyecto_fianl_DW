const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const { loadEnv } = require('./config/env');
const connectDB = require('./config/db');

const eventsRouter = require('./routes/events');
const registrationsRouter = require('./routes/registrations');

loadEnv();
connectDB();

const app = express();

// Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigin = process.env.CORS_ORIGIN || '*';
app.use(cors({ origin: allowedOrigin }));

// Static frontend
app.use(express.static(path.join(__dirname, '..', 'public')));

// API routes
app.use('/api/events', eventsRouter);
app.use('/api/events', registrationsRouter); // nested registrations under events

// Health
app.get('/health', (req, res) => res.json({ ok: true }));

// Fallback to index.html for root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('Unexpected error:', err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on ${process.env.BASE_URL || `http://localhost:${PORT}`}`);
});
