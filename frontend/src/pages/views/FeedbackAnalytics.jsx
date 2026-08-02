import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar,
  Activity,
  Filter,
  Search,
  ArrowLeft,
  ArrowRight,
  FileText,
  Upload,
  BarChart3,
  PieChart as PieIcon,
  ArrowUpRight,
  CheckSquare,
  XSquare,
  Star,
  Flower2,
  AlertCircle,
} from 'lucide-react';
import { fetchFeedbackAnalytics, updateFeedbackStatus, exportFeedbackData } from '../../services/api';
import KpiCard from '../../components/KpiCard';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, CartesianGrid, Legend, LineChart, Line } from 'recharts';

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#6366f1', '#14b8a6', '#ef4444', '#84cc16'];

export default function FeedbackAnalytics() {
  // ---- State ----
  const [filters, setFilters] = useState({
    feedback_type: 'ALL',
    rating: 'ALL',
    feedback_status: 'ALL',
    start_date: '',
    end_date: '',
    search: '',
  });
  const [pageInfo, setPageInfo] = useState({ page: 1, limit: 20 });
  const [data, setData] = useState({ feedback: [], pagination: {}, summary: {}, analytics: {} });
  const [loading, setLoading] = useState(false);

  // ---- Data Loading ----
  const loadData = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const res = await fetchFeedbackAnalytics(filters, pageInfo.page, pageInfo.limit);
      setData(res);
    } catch (err) {
      console.error('Failed to load feedback analytics:', err);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    loadData(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, pageInfo.page, pageInfo.limit]);

  // ---- Handlers ----
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPageInfo((p) => ({ ...p, page: 1 })); // reset to first page on filter change
  };

  const handleStatusUpdate = async (feedbackId, newStatus) => {
    try {
      await updateFeedbackStatus(feedbackId, newStatus);
      // Refresh current page after status change
      loadData(false);
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  const handleExport = async () => {
    try {
      const exportData = await exportFeedbackData(filters);
      const csvContent = 'data:text/csv;charset=utf-8,' +
        ['feedback_id,session_id,conversation_id,user_id,username,email,flower_name,feedback_type,rating,selected_reasons,custom_comment,model_name,timestamp']
          .concat(
            exportData.map((f) =>
              [
                f.feedback_id,
                f.session_id,
                f.conversation_id,
                f.user_id,
                f.username,
                f.email,
                f.flower_name,
                f.feedback_type,
                f.rating,
                (Array.isArray(f.selected_reasons) ? f.selected_reasons.join('|') : ''),
                `"${(f.custom_comment || '').replace(/"/g, '""')}"`,
                f.model_name,
                f.timestamp,
              ].join(',')
            )
          )
          .join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `feedback_export_${new Date().toISOString()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  // ---- Memoized Chart Data ----
  const { summary, analytics, feedback } = data;

  // ---- UI ----
  return (
    <div className="space-y-6 p-6 bg-[#F8F9FA] max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600" /> User Feedback Analytics
        </h2>
        <button
          onClick={handleExport}
          className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm transition"
        >
          Export CSV
        </button>
      </div>

      {/* Interactive Feedback Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <div className="flex items-center gap-2 text-gray-900 font-bold text-xs">
            <Filter className="w-4 h-4 text-blue-600" />
            <span>Feedback Analytics Filters</span>
          </div>
          <button
            onClick={() => {
              setFilters({
                feedback_type: 'ALL',
                rating: 'ALL',
                feedback_status: 'ALL',
                start_date: '',
                end_date: '',
                search: '',
              });
              setPageInfo({ page: 1, limit: 20 });
            }}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            Reset All Filters
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Keyword Search */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              Keyword Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                name="search"
                placeholder="Filter user, flower, prompt..."
                value={filters.search}
                onChange={handleFilterChange}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-gray-50 text-gray-900 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
              />
            </div>
          </div>

          {/* Feedback Type */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              Feedback Type
            </label>
            <select
              name="feedback_type"
              value={filters.feedback_type}
              onChange={handleFilterChange}
              className="w-full py-2 px-3 text-xs rounded-xl bg-gray-50 text-gray-900 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-medium"
            >
              <option value="ALL">All Types (Likes & Dislikes)</option>
              <option value="Like">Likes Only (Positive)</option>
              <option value="Dislike">Dislikes Only (Negative)</option>
            </select>
          </div>

          {/* Rating */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              Rating Score
            </label>
            <select
              name="rating"
              value={filters.rating}
              onChange={handleFilterChange}
              className="w-full py-2 px-3 text-xs rounded-xl bg-gray-50 text-gray-900 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-medium"
            >
              <option value="ALL">All Ratings (1-5 Stars)</option>
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>{r} ★ Star{r > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>

          {/* Feedback Status */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              Feedback Status
            </label>
            <select
              name="feedback_status"
              value={filters.feedback_status}
              onChange={handleFilterChange}
              className="w-full py-2 px-3 text-xs rounded-xl bg-gray-50 text-gray-900 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-medium"
            >
              <option value="ALL">All Statuses</option>
              <option value="new">New (Pending)</option>
              <option value="reviewed">Reviewed</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {/* KPI Grid - Top 5 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <KpiCard
          title="Total Feedback"
          value={summary.total?.toLocaleString() || '0'}
          icon={FileText}
          color="purple"
          sparklineData={[]}
        />
        <KpiCard
          title="Likes"
          value={summary.likes?.toLocaleString() || '0'}
          icon={CheckSquare}
          color="emerald"
          sparklineData={[]}
        />
        <KpiCard
          title="Dislikes"
          value={summary.dislikes?.toLocaleString() || '0'}
          icon={XSquare}
          color="rose"
          sparklineData={[]}
        />
        <KpiCard
          title="Satisfaction %"
          value={summary.satisfaction !== undefined ? `${summary.satisfaction}%` : '0%'}
          icon={BarChart3}
          color="blue"
          sparklineData={[]}
        />
        <KpiCard
          title="Avg Rating"
          value={summary.avgRating?.toFixed(2) || '0'}
          icon={Star}
          color="amber"
          sparklineData={[]}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Trend Area */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
          <h3 className="text-base font-semibold mb-2 flex items-center gap-1">
            <BarChart3 className="w-4 h-4 text-blue-600" /> Daily Feedback Trend (last 30d)
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={analytics.dailyTrend || []} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
              <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb', color: '#111827', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
              <Area type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={2} fill="url(#trendGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        {/* Rating Distribution Bar */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
          <h3 className="text-base font-semibold mb-2 flex items-center gap-1">
            <Star className="w-4 h-4 text-amber-500" /> Rating Distribution
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={analytics.ratingDistribution || []} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
              <XAxis dataKey="star" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip />
              <Bar dataKey="count" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* Feedback Type Pie */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
          <h3 className="text-base font-semibold mb-2 flex items-center gap-1">
            <PieIcon className="w-4 h-4 text-purple-600" /> Like vs Dislike
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={analytics.feedbackTypeDist || []}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
                nameKey="name"
              >
                {(analytics.feedbackTypeDist || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* Status Distribution Bar */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
          <h3 className="text-base font-semibold mb-2 flex items-center gap-1">
            <AlertCircle className="w-4 h-4 text-rose-600" /> Feedback Status
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={analytics.statusDistribution || []} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip />
              <Bar dataKey="value" fill="#06b6d4" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* Top Flowers Bar */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
          <h3 className="text-base font-semibold mb-2 flex items-center gap-1">
            <Flower2 className="w-4 h-4 text-pink-600" /> Top Reported Flowers
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={summary.topFlowers || []} layout="vertical" margin={{ top: 20, right: 20, left: 40, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
              <XAxis type="number" stroke="#64748b" fontSize={11} />
              <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={11} />
              <Tooltip />
              <Bar dataKey="count" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* Top Reasons Bar */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
          <h3 className="text-base font-semibold mb-2 flex items-center gap-1">
            <AlertCircle className="w-4 h-4 text-amber-500" /> Top Complaint Reasons
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={summary.topReasons || []} layout="vertical" margin={{ top: 20, right: 20, left: 40, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
              <XAxis type="number" stroke="#64748b" fontSize={11} />
              <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={11} />
              <Tooltip />
              <Bar dataKey="count" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Feedback Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 overflow-x-auto">
        <h3 className="text-base font-semibold mb-2 flex items-center gap-1">
          <FileText className="w-4 h-4 text-gray-600" /> Feedback Records
        </h3>
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left font-medium text-gray-600">Date</th>
              <th className="px-3 py-2 text-left font-medium text-gray-600">User</th>
              <th className="px-3 py-2 text-left font-medium text-gray-600">Flower</th>
              <th className="px-3 py-2 text-left font-medium text-gray-600">Type</th>
              <th className="px-3 py-2 text-left font-medium text-gray-600">Rating</th>
              <th className="px-3 py-2 text-left font-medium text-gray-600">Status</th>
              <th className="px-3 py-2 text-center font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {feedback.map((fb) => (
              <tr key={fb.feedback_id || fb._id} className="border-t border-gray-200">
                <td className="px-3 py-2">{new Date(fb.timestamp).toLocaleDateString()}</td>
                <td className="px-3 py-2">{fb.username || '—'}</td>
                <td className="px-3 py-2">{fb.flower_name || '—'}</td>
                <td className="px-3 py-2">{fb.feedback_type}</td>
                <td className="px-3 py-2">{fb.rating ?? '—'}</td>
                <td className="px-3 py-2 capitalize">{fb.feedback_status}</td>
                <td className="px-3 py-2 text-center">
                  {fb.feedback_status !== 'resolved' && (
                    <select
                      value={fb.feedback_status}
                      onChange={(e) => handleStatusUpdate(fb.feedback_id || fb._id, e.target.value)}
                      className="border rounded px-1 py-0.5 text-xs"
                    >
                      <option value="new">New</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-gray-600">
            Page {pageInfo.page} of {data.pagination.totalPages || 1}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPageInfo((p) => ({ ...p, page: Math.max(1, p.page - 1) }))}
              disabled={pageInfo.page <= 1}
              className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPageInfo((p) => ({ ...p, page: p.page + 1 }))}
              disabled={pageInfo.page >= (data.pagination.totalPages || 1)}
              className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
