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

