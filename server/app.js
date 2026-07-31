const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { connectDB, logAnalyticsEvent } = require('./db');
const { getAnalyticsOverview } = require('./services/analyticsService');

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_admin_analytics_jwt_key_2026';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@aflowerexpert.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

app.use(cors());
app.use(express.json());

// Initialize DB connection (cached for serverless invocations)
connectDB();

// Middleware: Authentication Guard
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid authorization token' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Token expired or invalid' });
  }
}

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'AI Flower Expert Admin Analytics API Server',
    timestamp: new Date().toISOString()
  });
});

// Admin Login Route
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const inputEmail = email.trim().toLowerCase();
  const validEmails = [ADMIN_EMAIL.toLowerCase(), 'admin@aflowerexpert.com', 'admin@aiflowerexpert.com'];

  if (validEmails.includes(inputEmail) && password === ADMIN_PASSWORD) {
    const token = jwt.sign(
      { email: inputEmail, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Log admin login event
    logAnalyticsEvent({
      event: 'admin_login',
      admin_email: inputEmail,
      user_agent: req.headers['user-agent']
    });

    return res.json({
      success: true,
      token,
      user: {
        name: 'System Admin',
        email: inputEmail,
        role: 'Administrator',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'
      }
    });
  }

  return res.status(401).json({ error: 'Invalid admin email or password' });
});

// Analytics Overview API (Authenticated)
app.get('/api/analytics/overview', verifyToken, async (req, res) => {
  try {
    const { range = '30d' } = req.query;
    const data = await getAnalyticsOverview(range);
    res.json(data);
  } catch (err) {
    console.error('Error fetching analytics overview:', err);
    res.status(500).json({ error: 'Failed to compute analytics overview' });
  }
});

// Non-breaking Analytics Ingestion Route
app.post('/api/analytics/log', async (req, res) => {
  try {
    const eventData = req.body;
    await logAnalyticsEvent(eventData);
    res.json({ success: true, logged: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = app;
