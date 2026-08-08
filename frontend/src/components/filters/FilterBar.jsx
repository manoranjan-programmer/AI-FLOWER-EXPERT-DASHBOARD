import React, { useState } from 'react';
import { Search, Filter, X, SlidersHorizontal, RotateCcw } from 'lucide-react';
import DateRangePicker from './DateRangePicker';

export default function FilterBar({
  dateRange = '30d',
  setDateRange = () => {},
  onApplyFilters = () => {},
  onResetFilters = () => {},
  categories = ['ALL', 'Identifications', 'Conversations', 'Users', 'Errors'],
  statuses = ['ALL', 'high', 'moderate', 'low']
}) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  const handleCategoryChange = (val) => {
    setSelectedCategory(val);
    onApplyFilters({
      search,
      category: val,
      status: selectedStatus,
      dateRange
    });
  };

  const handleStatusChange = (val) => {
    setSelectedStatus(val);
    onApplyFilters({
      search,
      category: selectedCategory,
      status: val,
      dateRange
    });
  };

  const handleSearchChange = (val) => {
    setSearch(val);
    onApplyFilters({
      search: val,
      category: selectedCategory,
      status: selectedStatus,
      dateRange
    });
  };

  const handleApply = () => {
    onApplyFilters({
      search,
      category: selectedCategory,
      status: selectedStatus,
      dateRange
    });
  };

  const handleClear = () => {
    setSearch('');
    setSelectedCategory('ALL');
    setSelectedStatus('ALL');
    onResetFilters();
  };

  const hasActiveFilters = search || selectedCategory !== 'ALL' || selectedStatus !== 'ALL';

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/90 dark:border-slate-800/80 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
      <div className="flex flex-wrap items-center gap-3 flex-1">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleApply()}
            placeholder="Search telemetry records..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-emerald-500/50 shadow-inner"
          />
        </div>

        {/* Category Dropdown Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-200 font-semibold focus:outline-none focus:border-emerald-500/50"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Status Dropdown Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">Confidence:</span>
          <select
            value={selectedStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-200 font-semibold focus:outline-none focus:border-blue-500/50"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>{s.toUpperCase()}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end md:self-auto">
        <button
          onClick={handleApply}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-md shadow-blue-500/20 transition-all"
        >
          <Filter className="w-3.5 h-3.5" />
          <span>Apply</span>
        </button>

        {hasActiveFilters && (
          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
            <span>Clear</span>
          </button>
        )}
      </div>
    </div>
  );
}
