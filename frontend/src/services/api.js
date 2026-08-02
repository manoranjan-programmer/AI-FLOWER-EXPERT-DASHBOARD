/**
 * api.js
 * Frontend API client for communication with backend server endpoints.
 * Configured via Vite environment variable VITE_API_BASE_URL (from frontend/.env).
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export async function loginAdmin(email, password) {
  const res = await fetch(`${API_BASE}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Login failed');
  }
  return data;
}

export async function fetchAnalyticsOverview(dateRange = '30d') {
  const token = localStorage.getItem('admin_token');
  const res = await fetch(`${API_BASE}/analytics/overview?range=${dateRange}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to load analytics overview');
  }
  return data;
}

export async function fetchChatbotAnalytics(dateRange = '30d') {
  const token = localStorage.getItem('admin_token');
  const res = await fetch(`${API_BASE}/analytics/chatbot?range=${dateRange}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to load chatbot analytics');
  return data;
}

export async function fetchClassificationAnalytics(dateRange = '30d') {
  const token = localStorage.getItem('admin_token');
  const res = await fetch(`${API_BASE}/analytics/classification?range=${dateRange}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to load classification analytics');
  return data;
}

export async function fetchUserActivity(dateRange = '30d') {
  const token = localStorage.getItem('admin_token');
  const res = await fetch(`${API_BASE}/analytics/activity?range=${dateRange}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to load user activity');
  return data;
}

export async function fetchErrorDiagnostics(dateRange = '30d') {
  const token = localStorage.getItem('admin_token');
  const res = await fetch(`${API_BASE}/analytics/errors?range=${dateRange}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to load error diagnostics');
  return data;
}

// ── Feedback Analytics API ──────────────────────────────────────────────────

/**
 * Fetches paginated feedback list + summary + analytics from /api/feedback
 * @param {Object} filters  - { feedback_type, rating, feedback_status, start_date, end_date, flower_name, username, email, search }
 * @param {number} page     - current page number
 * @param {number} limit    - items per page
 */
export async function fetchFeedbackAnalytics(filters = {}, page = 1, limit = 20) {
  const token = localStorage.getItem('admin_token');
  const params = new URLSearchParams();
  params.set('page', page);
  params.set('limit', limit);
  Object.entries(filters).forEach(([k, v]) => {
    if (v && v !== 'ALL') params.set(k, v);
  });
  const res = await fetch(`${API_BASE}/feedback?${params.toString()}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to load feedback analytics');
  return data;
}

/**
 * Updates the status of a feedback document.
 * @param {string} feedbackId  - feedback_id or MongoDB _id string
 * @param {string} status      - 'new' | 'reviewed' | 'resolved'
 */
export async function updateFeedbackStatus(feedbackId, status) {
  const token = localStorage.getItem('admin_token');
  const res = await fetch(`${API_BASE}/feedback/${encodeURIComponent(feedbackId)}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ status })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update feedback status');
  return data;
}

/**
 * Exports raw feedback data from /api/feedback/export
 */
export async function exportFeedbackData(filters = {}) {
  const token = localStorage.getItem('admin_token');
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v && v !== 'ALL') params.set(k, v);
  });
  const res = await fetch(`${API_BASE}/feedback/export?${params.toString()}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to export feedback data');
  return data;
}


