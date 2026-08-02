import React, { useState } from 'react';
import {
  Filter,
  Calendar,
  Globe,
  Tag,
  Search,
  RotateCcw,
  Check,
  SlidersHorizontal
} from 'lucide-react';

export default function FilterPanel({
  dateRange,
  setDateRange,
  onApplyFilters,
  onResetFilters
}) {
  const [category, setCategory] = useState('ALL');
  const [region, setRegion] = useState('ALL');
  const [status, setStatus] = useState('ALL');
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(true);

  const handleApply = () => {
    if (onApplyFilters) {
      onApplyFilters({ category, region, status, search, dateRange });
    }
  };

  const handleReset = () => {
    setCategory('ALL');
    setRegion('ALL');
    setStatus('ALL');
    setSearch('');
    setDateRange('30d');
    if (onResetFilters) {
      onResetFilters();
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 transition-all">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2 text-gray-900 font-bold text-sm">
          <SlidersHorizontal className="w-4 h-4 text-blue-600" />
          <span>Interactive Analytics Filters</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          {isOpen ? 'Collapse Filters' : 'Expand Filters'}
        </button>
      </div>

      {isOpen && (
        <div className="pt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">

            {/* Search Input */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                Keyword Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Filter species, user, ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-gray-50 text-gray-900 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                />
              </div>
            </div>

            {/* Date Range Selector */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-3 h-3 text-blue-600" /> Date Range
              </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full py-2 px-3 text-xs rounded-xl bg-gray-50 text-gray-900 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-medium"
              >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
                <option value="all">All Time History</option>
              </select>
            </div>

            {/* Category Filter */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                <Tag className="w-3 h-3 text-emerald-600" /> Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full py-2 px-3 text-xs rounded-xl bg-gray-50 text-gray-900 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-medium"
              >
                <option value="ALL">All Categories</option>
                <option value="classification">AI Classification</option>
                <option value="chat">Botanical Chat</option>
                <option value="knowledge">Knowledge Base</option>
                <option value="logs">System API Logs</option>
              </select>
            </div>

            {/* Region Filter */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                <Globe className="w-3 h-3 text-violet-600" /> Region
              </label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full py-2 px-3 text-xs rounded-xl bg-gray-50 text-gray-900 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-medium"
              >
                <option value="ALL">All Regions</option>
                <option value="US-East">United States (US-East)</option>
                <option value="EU-Central">Germany (EU-Central)</option>
                <option value="IN-South">India (IN-South)</option>
                <option value="AP-Northeast">Japan (AP-Northeast)</option>
                <option value="CA-Central">Canada (CA-Central)</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                Classification Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full py-2 px-3 text-xs rounded-xl bg-gray-50 text-gray-900 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-medium"
              >
                <option value="ALL">All Confidence Statuses</option>
                <option value="high">High Confidence (&gt;90%)</option>
                <option value="moderate">Moderate (70-90%)</option>
                <option value="low">Low (&lt;70%)</option>
                <option value="toxic">Flagged Toxic Plants</option>
              </select>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
            </button>
            <button
              onClick={handleApply}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm shadow-blue-500/20 transition-all btn-ripple"
            >
              <Check className="w-3.5 h-3.5" /> Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
