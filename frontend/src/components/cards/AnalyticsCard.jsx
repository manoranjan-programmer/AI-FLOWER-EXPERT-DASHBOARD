import React from 'react';
import { RefreshCw, AlertTriangle, Inbox, Sparkles } from 'lucide-react';

export default function AnalyticsCard({
  title = '',
  subtitle = '',
  icon: Icon,
  actionSlot = null,
  loading = false,
  error = null,
  onRetry = null,
  empty = false,
  emptyMessage = 'No telemetry data available for this range.',
  children,
  className = ''
}) {
  return (
    <div className={`rounded-2xl bg-white dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/90 dark:border-slate-800/80 p-5 shadow-sm dark:shadow-card-dark flex flex-col justify-between ${className}`}>
      {/* ── Card Header ── */}
      {(title || subtitle || actionSlot) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800/60 shrink-0">
          <div className="flex items-start gap-2.5">
            {Icon ? (
              <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-emerald-600 dark:text-emerald-400 border border-slate-200 dark:border-slate-700/60 mt-0.5">
                <Icon className="w-4 h-4" />
              </div>
            ) : (
              <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-emerald-600 dark:text-emerald-400 border border-slate-200 dark:border-slate-700/60 mt-0.5">
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
            )}
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                {title}
              </h3>
              {subtitle && (
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {actionSlot && <div className="shrink-0">{actionSlot}</div>}
        </div>
      )}

      {/* ── Body State Handling ── */}
      <div className="flex-1 flex flex-col min-h-0 relative">
        {/* Loading Skeleton */}
        {loading ? (
          <div className="w-full h-full min-h-[220px] flex flex-col items-center justify-center p-8 text-center space-y-3">
            <RefreshCw className="w-6 h-6 text-emerald-400 animate-spin" />
            <p className="text-xs font-semibold text-slate-400">Loading telemetry data...</p>
          </div>
        ) : error ? (
          /* Error State */
          <div className="w-full h-full min-h-[220px] flex flex-col items-center justify-center p-8 text-center space-y-3 bg-rose-500/5 rounded-xl border border-rose-500/20">
            <AlertTriangle className="w-8 h-8 text-rose-400" />
            <p className="text-xs font-bold text-rose-300">{typeof error === 'string' ? error : 'Failed to load chart data.'}</p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="px-3.5 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-xs border border-rose-500/40 transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Connection</span>
              </button>
            )}
          </div>
        ) : empty ? (
          /* Empty State */
          <div className="w-full h-full min-h-[220px] flex flex-col items-center justify-center p-8 text-center space-y-2 bg-slate-950/40 rounded-xl border border-slate-800/40">
            <Inbox className="w-8 h-8 text-slate-400" />
            <p className="text-xs font-semibold text-slate-400">{emptyMessage}</p>
          </div>
        ) : (
          /* Main Content Slot */
          children
        )}
      </div>
    </div>
  );
}
