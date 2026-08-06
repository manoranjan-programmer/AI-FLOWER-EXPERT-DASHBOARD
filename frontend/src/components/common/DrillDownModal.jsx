import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Database, ShieldCheck, Activity, BarChart2 } from 'lucide-react';

export default function DrillDownModal({ isOpen, onClose, title, data, type = 'generic' }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-3xl max-h-[85vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden text-slate-900 dark:text-slate-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold">{title || 'Data Detail Drilldown'}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Real-time MongoDB Atlas record breakdown</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {data ? (
              <div className="space-y-4">
                {/* Summary banner */}
                <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-blue-500" />
                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                      Collection query matching criteria
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-blue-500 text-white text-xs font-bold">
                    MongoDB Verified
                  </span>
                </div>

                {/* Raw/Structured JSON display */}
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 p-4 font-mono text-xs text-emerald-400 overflow-x-auto">
                  <pre>{JSON.stringify(data, null, 2)}</pre>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">
                <BarChart2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No detailed data available for this metric.</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Source: MongoDB Atlas Analytics Index
            </span>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
