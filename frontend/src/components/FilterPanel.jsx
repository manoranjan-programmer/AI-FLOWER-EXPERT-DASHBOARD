import React, { useState } from 'react';
import { Filter, Search, RotateCcw, Check, SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = [
  { value: 'ALL',            label: 'All Categories' },
  { value: 'classification', label: 'Classification' },
  { value: 'chat',           label: 'Chat Sessions' },
  { value: 'knowledge',      label: 'Knowledge Base' },
  { value: 'logs',           label: 'System Logs' },
];

const STATUSES = [
  { value: 'ALL',      label: 'All Confidence' },
  { value: 'high',     label: 'High >90%' },
  { value: 'moderate', label: 'Moderate 70-90%' },
  { value: 'low',      label: 'Low <70%' },
];

export default function FilterPanel({ dateRange, setDateRange, onApplyFilters, onResetFilters }) {
  const [category, setCategory] = useState('ALL');
  const [status,   setStatus]   = useState('ALL');
  const [search,   setSearch]   = useState('');
  const [isOpen,   setIsOpen]   = useState(false);

  const handleApply = () => {
    onApplyFilters?.({ category, status, search, dateRange });
  };

  const handleReset = () => {
    setCategory('ALL');
    setStatus('ALL');
    setSearch('');
    setDateRange('30d');
    onResetFilters?.();
  };

  const hasActiveFilters = category !== 'ALL' || status !== 'ALL' || search;

  return (
    <div
      className="rounded-2xl mb-5 transition-all"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
    >
      {/* Header toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <div className="flex items-center gap-2.5">
          <SlidersHorizontal className="w-3.5 h-3.5" style={{ color: 'var(--color-primary)' }} />
          <span className="text-[12px] font-bold" style={{ color: 'var(--text-primary)' }}>
            Analytics Filters
          </span>
          {hasActiveFilters && (
            <span className="badge badge-primary">Active</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={(e) => { e.stopPropagation(); handleReset(); }}
              className="text-[10px] font-bold transition-colors"
              style={{ color: 'var(--text-tertiary)' }}
            >
              Clear
            </button>
          )}
          {isOpen
            ? <ChevronUp className="w-3.5 h-3.5" style={{ color: 'var(--text-tertiary)' }} />
            : <ChevronDown className="w-3.5 h-3.5" style={{ color: 'var(--text-tertiary)' }} />
          }
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden', borderTop: '1px solid var(--border-subtle)' }}
          >
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">

                {/* Keyword Search */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-tertiary)' }}>
                    Keyword Search
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: 'var(--text-tertiary)' }} />
                    <input
                      type="text"
                      placeholder="Filter species, user, ID…"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      className="premium-input pl-9 text-xs"
                    />
                  </div>
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-tertiary)' }}>
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="premium-input text-xs cursor-pointer"
                  >
                    {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>

                {/* Confidence Status */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-tertiary)' }}>
                    Confidence Level
                  </label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                    className="premium-input text-xs cursor-pointer"
                  >
                    {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2" style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 12 }}>
                <button onClick={handleReset} className="btn-secondary text-xs py-1.5 px-3 gap-1.5">
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
                <button onClick={handleApply} className="btn-primary text-xs py-1.5 px-4 gap-1.5">
                  <Check className="w-3 h-3" /> Apply Filters
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
