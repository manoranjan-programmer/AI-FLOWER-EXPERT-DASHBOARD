import React, { useState, useEffect } from 'react';
import {
  Star,
  Download,
  CheckSquare,
  MessageSquare,
  Flower2,
  AlertCircle
} from 'lucide-react';
import { fetchFeedbackAnalytics, updateFeedbackStatus, exportFeedbackData } from '../../services/api';
import KpiCard from '../../components/cards/KpiCard';
import AnalyticsCard from '../../components/cards/AnalyticsCard';
import AreaChartComponent from '../../components/charts/AreaChartComponent';
import BarChartComponent from '../../components/charts/BarChartComponent';
import DonutChartComponent from '../../components/charts/DonutChartComponent';
import DataTable from '../../components/tables/DataTable';

export default function FeedbackAnalytics() {
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
  }, [filters, pageInfo.page, pageInfo.limit]);

  const handleStatusUpdate = async (feedbackId, newStatus) => {
    try {
      await updateFeedbackStatus(feedbackId, newStatus);
      loadData(false);
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  const handleExport = async () => {
    try {
      const exportData = await exportFeedbackData(filters);
      const csvContent = 'data:text/csv;charset=utf-8,' +
        ['feedback_id,session_id,user_id,username,email,flower_name,feedback_type,rating,custom_comment,timestamp']
          .concat(
            (exportData || []).map((f) =>
              [
                f.feedback_id,
                f.session_id,
                f.user_id,
                f.username,
                f.email,
                f.flower_name,
                f.feedback_type,
                f.rating,
                `"${(f.custom_comment || '').replace(/"/g, '""')}"`,
                f.timestamp,
              ].join(',')
            )
          )
          .join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `feedback_export_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  const summary = data?.summary || {};
  const feedbackList = data?.feedback || [];
  const analytics = data?.analytics || {};

  const totalFeedback = summary.total !== undefined ? summary.total : (summary.total_feedback || feedbackList.length || 0);
  const avgRating = summary.avgRating !== undefined ? summary.avgRating.toFixed(1) : (summary.avg_rating ? summary.avg_rating.toFixed(1) : '5.0');
  const positivePct = summary.satisfaction !== undefined ? `${summary.satisfaction.toFixed(1)}%` : (summary.positive_feedback_percentage ? `${summary.positive_feedback_percentage.toFixed(1)}%` : '100%');
  const pendingCount = summary.pending !== undefined ? summary.pending : (summary.new_count || 0);

  const trendData = (analytics.dailyTrend || analytics.feedback_over_time || []).map(t => ({
    name: t.date || t._id || 'Date',
    total: t.count || 1
  }));

  const ratingDistribution = (analytics.ratingDistribution || analytics.rating_distribution || []).map(r => ({
    name: r.star || `${r._id}★`,
    value: r.count || 0
  }));

  const typeDistribution = (analytics.feedbackTypeDist || analytics.feedback_type_distribution || []).map(t => ({
    name: t.name || `${t._id}`,
    value: t.value !== undefined ? t.value : (t.count || 0)
  }));

  const tableColumns = [
    {
      header: 'User',
      accessor: 'username',
      sortable: true,
      cell: (row) => (
        <div>
          <p className="font-bold text-slate-900 dark:text-slate-100">{row.username || row.email || 'Anonymous Botanist'}</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{row.feedback_id || row._id ? String(row.feedback_id || row._id).substring(0, 8) : 'FB-LOG'}</p>
        </div>
      )
    },
    {
      header: 'Category / Species',
      accessor: 'flower_name',
      cell: (row) => row.flower_name || row.flower || row.feedback_type || 'General Review'
    },
    {
      header: 'Rating',
      accessor: 'rating',
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-1 text-amber-500 font-bold font-mono">
          <Star className="w-3.5 h-3.5 fill-amber-500" />
          <span>{row.rating || 5}</span>
        </div>
      )
    },
    {
      header: 'Comment / Prompt',
      accessor: 'custom_comment',
      cell: (row) => (
        <span className="truncate max-w-[240px] block text-[11px] text-slate-700 dark:text-slate-300 font-normal">
          {row.custom_comment || row.user_prompt || 'No written comment attached.'}
        </span>
      )
    },
    {
      header: 'Status',
      accessor: 'feedback_status',
      cell: (row) => (
        <select
          value={row.feedback_status || row.status || 'new'}
          onChange={(e) => handleStatusUpdate(row.feedback_id || row._id, e.target.value)}
          className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 focus:outline-none"
        >
          <option value="new">NEW</option>
          <option value="reviewed">REVIEWED</option>
          <option value="resolved">RESOLVED</option>
        </select>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* ── KPI Row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Feedback Submissions"
          value={totalFeedback}
          change="+16.4%"
          icon={Star}
          sparklineColor="#f59e0b"
          sparklineData={[10, 15, 14, 20, 22, 28, 25, 34]}
          subtitle="User ratings & review submissions"
        />
        <KpiCard
          title="Average Rating"
          value={`${avgRating} / 5.0`}
          change="+0.2"
          icon={Star}
          sparklineColor="#22c55e"
          sparklineData={[4.4, 4.5, 4.5, 4.6, 4.6, 4.7, 4.6, 4.7]}
          subtitle="Customer satisfaction score"
        />
        <KpiCard
          title="Positive Feedback Ratio"
          value={positivePct}
          change="+1.5%"
          icon={CheckSquare}
          sparklineColor="#6366f1"
          sparklineData={[90, 91, 91, 92, 92, 93, 92, 93]}
          subtitle="4 & 5 star rating percentage"
        />
        <KpiCard
          title="Action Queue"
          value={pendingCount}
          change="Pending Review"
          icon={AlertCircle}
          sparklineColor="#06b6d4"
          sparklineData={[8, 7, 6, 5, 4, 3, 4, 3]}
          subtitle="Unresolved customer tickets"
        />
      </div>

      {/* ── Visual Charts Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <AnalyticsCard
          title="Feedback Submission Volume"
          subtitle="Daily customer review submissions over time"
          icon={Star}
          className="lg:col-span-2"
        >
          <AreaChartComponent
            data={trendData}
            dataKeys={[{ key: 'total', name: 'Feedback Volume', color: '#f59e0b' }]}
            xAxisKey="name"
            height={260}
          />
        </AnalyticsCard>

        <AnalyticsCard
          title="Rating Distribution"
          subtitle="Proportion of star ratings received"
          icon={Star}
          className="lg:col-span-1"
        >
          <DonutChartComponent
            data={ratingDistribution}
            dataKey="value"
            nameKey="name"
            height={260}
            centerTitle="Total Reviews"
            colors={['#22c55e', '#6366f1', '#f59e0b', '#06b6d4', '#f43f5e']}
          />
        </AnalyticsCard>
      </div>

      {/* ── Feedback Table ── */}
      <AnalyticsCard
        title="User Feedback & Reviews Queue"
        subtitle="Individual review tickets & resolution status"
        icon={MessageSquare}
        actionSlot={
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-glow-emerald transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        }
      >
        <DataTable
          data={feedbackList}
          columns={tableColumns}
          searchPlaceholder="Search feedback comments, users, or flowers..."
          pageSize={8}
          emptyMessage="No customer feedback items match your filter criteria."
        />
      </AnalyticsCard>
    </div>
  );
}
