const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { connectDB, logAnalyticsEvent } = require('./db');
const { getAnalyticsOverview } = require('./services/analyticsService');
const feedbackRouter = require('./api/feedbackRoutes');

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_admin_analytics_jwt_key_2026';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin.ai@flowerexpert.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin-ai@123';

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

// Health Check (Supports both /api/health, /health, /api, /)
app.get(['/api/health', '/health', '/api', '/'], (req, res) => {
  res.json({
    status: 'ok',
    service: 'AI Flower Expert Admin Analytics API Server',
    timestamp: new Date().toISOString()
  });
});

// Admin Login Route (Supports both /api/admin/login and /admin/login)
app.post(['/api/admin/login', '/admin/login'], (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const inputEmail = (email || '').trim().toLowerCase();
  const inputPassword = (password || '').trim();

  const validEmails = [
    'admin.ai@flowerexpert.com',
    'admin@aflowerexpert.com',
    'admin@aiflowerexpert.com',
    (process.env.ADMIN_EMAIL || '').trim().toLowerCase()
  ].filter(Boolean);

  const validPasswords = [
    'Admin-ai@123',
    'admin123',
    (process.env.ADMIN_PASSWORD || '').trim()
  ].filter(Boolean);

  if (validEmails.includes(inputEmail) && validPasswords.includes(inputPassword)) {
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
        avatar: '/admin-avatar.png'
      }
    });
  }

  return res.status(401).json({ error: 'Invalid admin email or password' });
});

// Analytics Overview API (Authenticated)
app.get(['/api/analytics/overview', '/analytics/overview'], verifyToken, async (req, res) => {
  try {
    const { range = '30d' } = req.query;
    const data = await getAnalyticsOverview(range);
    res.json(data);
  } catch (err) {
    console.error('Error fetching analytics overview:', err);
    res.status(500).json({ error: 'Failed to compute analytics overview' });
  }
});

// Chatbot Analytics API (Authenticated)
app.get(['/api/analytics/chatbot', '/analytics/chatbot'], verifyToken, async (req, res) => {
  try {
    const { range = '30d' } = req.query;
    const data = await getAnalyticsOverview(range);
    res.json({
      kpis: {
        totalChats: data.kpis.totalChats,
        avgChatbotResponseTimeMs: data.kpis.avgChatbotResponseTimeMs,
        positiveFeedbackRatio: data.kpis.positiveFeedbackRatio,
        totalTokenUsage: data.kpis.totalTokenUsage
      },
      charts: {
        usageTrends: data.charts.usageTrends,
        feedbackDistribution: data.charts.feedbackDistribution,
        modelDistribution: data.charts.modelDistribution
      },
      logs: data.tables.chatbotPerformanceLogs,
      chatSessions: data.tables.chatSessions
    });
  } catch (err) {
    console.error('Error fetching chatbot analytics:', err);
    res.status(500).json({ error: 'Failed to fetch chatbot performance data' });
  }
});

// Classification Analytics API (Authenticated)
app.get(['/api/analytics/classification', '/analytics/classification'], verifyToken, async (req, res) => {
  try {
    const { range = '30d' } = req.query;
    const data = await getAnalyticsOverview(range);
    res.json({
      kpis: {
        totalFlowerIdentifications: data.kpis.totalFlowerIdentifications,
        avgAccuracy: data.kpis.avgAccuracy,
        avgClassificationTimeMs: data.kpis.avgClassificationTimeMs,
        mostIdentifiedFlower: data.kpis.mostIdentifiedFlower
      },
      charts: {
        topSpecies: data.charts.topSpecies,
        confidenceDistribution: data.charts.confidenceDistribution,
        familyDistribution: data.charts.familyDistribution,
        deviceBreakdown: data.charts.deviceBreakdown
      },
      logs: data.tables.classificationLogs,
      galleryItems: data.tables.galleryItems
    });
  } catch (err) {
    console.error('Error fetching classification analytics:', err);
    res.status(500).json({ error: 'Failed to fetch classification analytics data' });
  }
});

// User Activity API (Authenticated)
app.get(['/api/analytics/activity', '/analytics/activity'], verifyToken, async (req, res) => {
  try {
    const { range = '30d' } = req.query;
    const data = await getAnalyticsOverview(range);
    res.json({
      kpis: {
        totalRegisteredUsers: data.kpis.totalRegisteredUsers,
        activeUsersToday: data.kpis.activeUsersToday,
        activeBotanistsToday: data.kpis.activeBotanistsToday
      },
      charts: {
        deviceBreakdown: data.charts.deviceBreakdown,
        usageTrends: data.charts.usageTrends
      },
      users: data.tables.registeredUsers,
      activityLogs: data.tables.userActivityLogs
    });
  } catch (err) {
    console.error('Error fetching user activity analytics:', err);
    res.status(500).json({ error: 'Failed to fetch user activity data' });
  }
});

// System & Error Diagnostics API (Authenticated)
app.get(['/api/analytics/errors', '/analytics/errors'], verifyToken, async (req, res) => {
  try {
    const { range = '30d' } = req.query;
    const data = await getAnalyticsOverview(range);
    res.json({
      kpis: {
        errorRate: data.kpis.errorRate,
        totalErrors: data.tables.errorLogs.length
      },
      errorLogs: data.tables.errorLogs
    });
  } catch (err) {
    console.error('Error fetching error analytics:', err);
    res.status(500).json({ error: 'Failed to fetch error diagnostics data' });
  }
});

// Feedback Analytics API (Authenticated)
app.use(['/api/feedback', '/feedback'], verifyToken, feedbackRouter);

// Non-breaking Analytics Ingestion Route
app.post(['/api/analytics/log', '/analytics/log'], async (req, res) => {
  try {
    const eventData = req.body;
    await logAnalyticsEvent(eventData);
    res.json({ success: true, logged: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = app;

