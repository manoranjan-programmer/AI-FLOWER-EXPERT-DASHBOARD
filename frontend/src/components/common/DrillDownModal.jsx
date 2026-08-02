import React, { useState } from 'react';
import { X, Search, Database, FileCode, Layers, Eye, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { exportToCSV } from '../../services/exporter';

export default function DrillDownModal({ isOpen, onClose, title, category, records = [] }) {
  const [search, setSearch] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);

  if (!isOpen) return null;

  const filteredRecords = records.filter(r => {
    if (!search.trim()) return true;
    return JSON.stringify(r).toLowerCase().includes(search.toLowerCase());
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-6xl bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-2xl border border-gray-200 dark:border-gray-800 space-y-4 max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-gray-900 dark:text-white">
                  MongoDB Telemetry Drill-Down: {title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  {filteredRecords.length} raw MongoDB Atlas records slice ({category})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => exportToCSV(filteredRecords, `${category}_drilldown.csv`)}
                className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-gray-700 dark:text-gray-300 font-bold text-xs transition-colors flex items-center gap-1.5"
              >
                <FileCode className="w-4 h-4" /> Export Slice CSV
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search in drill-down records..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 border border-transparent focus:border-blue-500 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
            />
          </div>

          {/* Drill-down Body Grid */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-hidden min-h-[350px]">
            {/* Left: Document List */}
            <div className="overflow-y-auto space-y-2 pr-1 rounded-2xl border border-gray-200 dark:border-gray-800 p-3 bg-gray-50/50 dark:bg-gray-900/50">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((r, idx) => (
                  <div
                    key={r.id || r._id || idx}
                    onClick={() => setSelectedRecord(r)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer space-y-1 ${
                      selectedRecord === r
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'border-gray-200 dark:border-gray-800/80 bg-white dark:bg-gray-800/60 hover:border-gray-300 dark:hover:border-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="truncate">
                        {r.flower || r.name || r.user_email || r.service || `Record #${idx + 1}`}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400">
                      <span>{r.searched_at || r.timestamp || r.created_at || 'Indexed Record'}</span>
                      {r.confidence && (
                        <span className="font-mono text-emerald-500 font-bold">{r.confidence}%</span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-xs text-gray-400">
                  No matching MongoDB records found for this slice.
                </div>
              )}
            </div>

            {/* Right: Selected Document JSON / Detail Viewer */}
            <div className="overflow-y-auto rounded-2xl border border-gray-200 dark:border-gray-800 p-4 bg-gray-900 text-gray-100 font-mono text-xs leading-relaxed">
              {selectedRecord ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-800 text-blue-400 font-bold">
                    <span>MongoDB BSON/JSON Document</span>
                    <span>_id: {selectedRecord.id || selectedRecord._id || 'local'}</span>
                  </div>
                  <pre className="whitespace-pre-wrap overflow-x-auto text-[11px] text-emerald-400">
                    {JSON.stringify(selectedRecord, null, 2)}
                  </pre>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500 font-sans text-xs">
                  Click any record on the left to inspect full MongoDB document fields.
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
