/**
 * feedbackRoutes.js
 * Express Router for User Feedback Analytics API.
 * Mounted at /api/feedback in app.js (after verifyToken middleware).
 * Does NOT modify any existing routes.
 */

const express = require('express');
const router = express.Router();
const {
  getFeedbackList,
  updateFeedbackStatus,
  exportFeedbackData
} = require('../services/feedbackService');

/**
 * GET /api/feedback
 * Fetch paginated feedback list + summary + analytics.
 * Query params: feedback_type, rating, feedback_status, start_date, end_date,
 *               flower_name, username, email, search, page, limit
 */
router.get('/', async (req, res) => {
  try {
    const {
      feedback_type, rating, feedback_status,
      start_date, end_date,
      flower_name, username, email, search,
      page = 1, limit = 20
    } = req.query;

    const filters = {
      feedback_type, rating, feedback_status,
      start_date, end_date,
      flower_name, username, email, search
    };

    const pagination = { page, limit };

    const result = await getFeedbackList(filters, pagination);
    res.json(result);
  } catch (err) {
    console.error('Error in GET /api/feedback:', err.message);
    res.status(500).json({ error: 'Failed to fetch feedback analytics data' });
  }
});

/**
 * GET /api/feedback/export
 * Returns raw feedback documents for CSV/Excel/PDF export.
 * Query params: same filters as GET /
 */
router.get('/export', async (req, res) => {
  try {
    const {
      feedback_type, rating, feedback_status,
      start_date, end_date,
      flower_name, username, email, search
    } = req.query;

    const filters = {
      feedback_type, rating, feedback_status,
      start_date, end_date,
      flower_name, username, email, search
    };

    const data = await exportFeedbackData(filters);
    res.json({ data, count: data.length });
  } catch (err) {
    console.error('Error in GET /api/feedback/export:', err.message);
    res.status(500).json({ error: 'Failed to export feedback data' });
  }
});

/**
 * PUT /api/feedback/:feedback_id
 * Updates feedback_status for a given feedback document.
 * Body: { status: "new" | "reviewed" | "resolved" }
 */
router.put('/:feedback_id', async (req, res) => {
  try {
    const { feedback_id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Missing required field: status' });
    }

    const result = await updateFeedbackStatus(feedback_id, status);

    if (!result.success && result.matchedCount === 0) {
      return res.status(404).json({ error: `No feedback found with id: ${feedback_id}` });
    }

    res.json({
      success: true,
      feedback_id,
      new_status: status,
      ...result
    });
  } catch (err) {
    console.error(`Error in PUT /api/feedback/${req.params.feedback_id}:`, err.message);
    if (err.message.startsWith('Invalid status')) {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Failed to update feedback status' });
  }
});

module.exports = router;
