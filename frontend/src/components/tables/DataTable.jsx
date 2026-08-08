import React, { useState, useMemo } from 'react';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Inbox,
  Sparkles
} from 'lucide-react';

export default function DataTable({
  data = [],
  columns = [],
  title = '',
  searchPlaceholder = 'Search records...',
  pageSize = 7,
  renderExpandedRow = null,
  emptyMessage = 'No matching telemetry records found.'
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState({});

  const safeData = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  // Handle client search
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return safeData;
    const query = searchQuery.toLowerCase();
    return safeData.filter((row) =>
      columns.some((col) => {
        const val = col.accessor ? row[col.accessor] : col.cell ? col.cell(row) : null;
        return String(val || '').toLowerCase().includes(query);
      })
    );
  }, [safeData, searchQuery, columns]);

  // Handle column sorting
  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData;
    return [...filteredData].sort((a, b) => {
      let valA = a[sortColumn];
      let valB = b[sortColumn];

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortColumn, sortDirection]);

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const pageIndex = Math.min(currentPage, totalPages);
  const paginatedData = useMemo(() => {
    const start = (pageIndex - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, pageIndex, pageSize]);

  const handleSort = (accessor) => {
    if (!accessor) return;
    if (sortColumn === accessor) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(accessor);
      setSortDirection('asc');
    }
  };

  const toggleRowExpanded = (idx) => {
    setExpandedRows((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="w-full space-y-4">
      {/* ── Table Top Bar (Title & Search Filter) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {title && (
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            {title}
            <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono text-[10px]">
              {sortedData.length} records
            </span>
          </h4>
        )}

        <div className="relative flex-1 max-w-xs ml-auto">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={searchPlaceholder}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-emerald-500/50 shadow-inner"
          />
        </div>
      </div>

      {/* ── Main Table Frame ── */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-950/60 shadow-inner custom-scrollbar">
        <table className="w-full text-left text-xs border-collapse">
          {/* Table Header */}
          <thead>
            <tr className="bg-slate-100 dark:bg-slate-900/90 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800/80 uppercase text-[10px] tracking-wider font-bold">
              {renderExpandedRow && <th className="w-8 px-3 py-3 text-center"></th>}
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  onClick={() => col.sortable && handleSort(col.accessor)}
                  className={`px-4 py-3 select-none ${col.sortable ? 'cursor-pointer hover:text-slate-900 dark:hover:text-slate-200' : ''}`}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{col.header}</span>
                    {col.sortable && (
                      <ArrowUpDown className={`w-3 h-3 ${sortColumn === col.accessor ? 'text-emerald-500' : 'opacity-40'}`} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rIdx) => {
                const isExpanded = !!expandedRows[rIdx];
                return (
                  <React.Fragment key={rIdx}>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors group">
                      {renderExpandedRow && (
                        <td className="px-3 py-3 text-center">
                          <button
                            onClick={() => toggleRowExpanded(rIdx)}
                            className="p-1 rounded-md bg-slate-200 dark:bg-slate-800/80 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                          >
                            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          </button>
                        </td>
                      )}
                      {columns.map((col, cIdx) => (
                        <td key={cIdx} className="px-4 py-3 font-medium text-slate-800 dark:text-slate-300">
                          {col.cell ? col.cell(row) : String(row[col.accessor] ?? '—')}
                        </td>
                      ))}
                    </tr>

                    {/* Expandable Row Content */}
                    {renderExpandedRow && isExpanded && (
                      <tr className="bg-slate-900/80 border-b border-slate-800">
                        <td colSpan={columns.length + 1} className="p-4">
                          {renderExpandedRow(row)}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            ) : (
              <tr>
                <td colSpan={columns.length + (renderExpandedRow ? 1 : 0)} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Inbox className="w-7 h-7 text-slate-400" />
                    <p className="text-xs font-semibold">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination Control Footer ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2 px-1 text-xs text-slate-400 font-medium">
          <span>
            Page <strong className="text-slate-200 font-mono">{pageIndex}</strong> of{' '}
            <strong className="text-slate-200 font-mono">{totalPages}</strong>
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={pageIndex === 1}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 disabled:opacity-40"
              title="First Page"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={pageIndex === 1}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 disabled:opacity-40"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={pageIndex === totalPages}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 disabled:opacity-40"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={pageIndex === totalPages}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 disabled:opacity-40"
              title="Last Page"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
