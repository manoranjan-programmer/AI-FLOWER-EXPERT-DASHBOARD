import React from 'react';
import { Calendar, Download, Sparkles, SlidersHorizontal, CheckCircle2 } from 'lucide-react';
import DateRangePicker from '../filters/DateRangePicker';

const TAB_TITLES = {
  overview: { title: 'Executive Overview', subtitle: 'Real-time telemetry, model accuracy metrics & interaction volume.' },
  chat_analytics: { title: 'Conversations & Chatbot', subtitle: 'NLP dialogue length, Gemini response latency & sentiment scores.' },
  flower_analytics: { title: 'Species Identification Catalog', subtitle: 'EfficientNet vision classification, species density & top scans.' },
  search_analytics: { title: 'Search & Telemetry', subtitle: 'Global user query logs, vector match confidence & search speed.' },
  user_analytics: { title: 'User Operations', subtitle: 'Account registrations, active sessions & user engagement analytics.' },
  ai_performance: { title: 'AI Engine Speed', subtitle: 'Model execution throughput, token usage & hardware latency.' },
  database_analytics: { title: 'Database Health & Collections', subtitle: 'MongoDB document counts, query index speed & cluster storage.' },
  live_activity: { title: 'Live Stream Telemetry', subtitle: 'Real-time API traffic, user socket events & live prediction feed.' },
  feedback: { title: 'User Feedback & Reviews', subtitle: 'Customer sentiment rating, correction requests & resolution queue.' },
  settings: { title: 'System Configurations', subtitle: 'API base keys, feature flags & administrative privileges.' },
};

export default function Header({
  activeTab = 'overview',
  dateRange = '30d',
  setDateRange = () => {},
  onExport = null,
  extraActions = null
}) {
  const current = TAB_TITLES[activeTab] || { title: 'Analytics Dashboard', subtitle: 'System performance indicators.' };

  return (
    <div className="bg-white/60 dark:bg-slate-950/40 border-b border-slate-200 dark:border-slate-800/60 px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      {/* ── Title & Subtitle ── */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <Sparkles className="w-3.5 h-3.5" />
          </span>
          <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100 font-sans">
            {current.title}
          </h1>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium max-w-xl">
          {current.subtitle}
        </p>
      </div>

      {/* ── Action Bar: Date Range Picker & Export Buttons ── */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Date Range Picker */}
        <DateRangePicker value={dateRange} onChange={setDateRange} />

        {extraActions}

        {onExport && (
          <button
            onClick={onExport}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
        )}
      </div>
    </div>
  );
}
