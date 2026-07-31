import React, { useState, useMemo } from 'react';
import { 
  Search, 
  FileSpreadsheet, 
  FileCode, 
  FileText, 
  Filter, 
  Eye, 
  ChevronLeft, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { exportToCSV, exportToExcel, exportToPDF } from '../services/exporter';
import TranscriptModal from './TranscriptModal';

export default function TablesSection({ tablesData, activeTab }) {
  const [activeTable, setActiveTable] = useState(activeTab !== 'overview' && activeTab !== 'charts' ? activeTab : 'conversations');
  const [searchTerm, setSearchTerm] = useState('');
  const [flowerFilter, setFlowerFilter] = useState('ALL');
  const [confFilter, setConfFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTranscript, setSelectedTranscript] = useState(null);

  const itemsPerPage = 8;

  // Sync activeTable with prop tab changes
  React.useEffect(() => {
    if (['conversations', 'uploads', 'predictions', 'searches', 'feedback', 'logs'].includes(activeTab)) {
      setActiveTable(activeTab);
      setCurrentPage(1);
    }
  }, [activeTab]);

  const {
    recentConversations = [],
    uploadedImages = [],
    predictionHistory = [],
    searchHistory = [],
    feedbackList = [],
    errorLogs = []
  } = tablesData || {};

  // Table Configuration & Master Datasets
  const currentDataset = useMemo(() => {
    switch (activeTable) {
      case 'conversations': return recentConversations;
      case 'uploads': return uploadedImages;
      case 'predictions': return predictionHistory;
      case 'searches': return searchHistory;
      case 'feedback': return feedbackList;
      case 'logs': return errorLogs;
      default: return recentConversations;
    }
  }, [activeTable, recentConversations, uploadedImages, predictionHistory, searchHistory, feedbackList, errorLogs]);

  // Unique Flowers for Filter Dropdown
  const uniqueFlowers = useMemo(() => {
    const set = new Set();
    currentDataset.forEach(item => {
      const fl = item.flower || item.predicted_flower || item.matched_flower;
      if (fl) set.add(fl);
    });
    return Array.from(set);
  }, [currentDataset]);

  // Filtered & Searched Dataset
  const filteredDataset = useMemo(() => {
    return currentDataset.filter(item => {
      // Global Search
      const searchMatch = !searchTerm || JSON.stringify(item).toLowerCase().includes(searchTerm.toLowerCase());
      
      // Flower Filter
      const flName = item.flower || item.predicted_flower || item.matched_flower;
      const flowerMatch = flowerFilter === 'ALL' || flName === flowerFilter;

      // Confidence Filter
      const conf = item.confidence;
      let confMatch = true;
      if (confFilter === '90+') confMatch = conf >= 90;
      else if (confFilter === '80-90') confMatch = conf >= 80 && conf < 90;
      else if (confFilter === '<80') confMatch = conf < 80;

      return searchMatch && flowerMatch && confMatch;
    });
  }, [currentDataset, searchTerm, flowerFilter, confFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredDataset.length / itemsPerPage) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredDataset.slice(start, start + itemsPerPage);
  }, [filteredDataset, currentPage]);

  // Export handlers
  const handleExportCSV = () => {
    exportToCSV(filteredDataset, `${activeTable}_export.csv`);
  };

  const handleExportExcel = () => {
    exportToExcel(filteredDataset, activeTable, `${activeTable}_export.xlsx`);
  };

  const handleExportPDF = () => {
    const columns = getColumnsForTable(activeTable);
    exportToPDF(columns, filteredDataset, `${activeTable.toUpperCase()} Report`, `${activeTable}_report.pdf`);
  };

  function getColumnsForTable(tableKey) {
    switch (tableKey) {
      case 'conversations':
        return [
          { header: 'Session ID', accessor: 'session_id' },
          { header: 'User Email', accessor: 'user' },
          { header: 'Flower', accessor: 'flower' },
          { header: 'Messages', accessor: 'message_count' },
          { header: 'Timestamp', accessor: 'timestamp' }
        ];
      case 'uploads':
        return [
          { header: 'Filename', accessor: 'filename' },
          { header: 'Dimensions', accessor: 'dimensions' },
          { header: 'Size', accessor: 'size' },
          { header: 'Flower', accessor: 'predicted_flower' },
          { header: 'Confidence (%)', accessor: 'confidence' }
        ];
      case 'predictions':
        return [
          { header: 'Prediction ID', accessor: 'id' },
          { header: 'Flower', accessor: 'flower' },
          { header: 'Scientific Name', accessor: 'scientific_name' },
          { header: 'Confidence (%)', accessor: 'confidence' },
          { header: 'Latency (ms)', accessor: 'response_time_ms' }
        ];
      default:
        return [
          { header: 'ID', accessor: 'id' },
          { header: 'User', accessor: 'user' },
          { header: 'Timestamp', accessor: 'timestamp' }
        ];
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
      
      {/* Top Header & Table Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            Granular Analytics Data Explorer
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Search, filter, inspect transcripts, and export system performance logs.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 text-gray-700 hover:bg-blue-600 hover:text-white text-xs font-semibold transition-all border border-gray-200 shadow-sm"
          >
            <FileCode className="w-4 h-4" /> CSV
          </button>

          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 text-gray-700 hover:bg-emerald-600 hover:text-white text-xs font-semibold transition-all border border-gray-200 shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4" /> Excel
          </button>

          <button
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 text-gray-700 hover:bg-rose-600 hover:text-white text-xs font-semibold transition-all border border-gray-200 shadow-sm"
          >
            <FileText className="w-4 h-4" /> PDF Report
          </button>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-gray-200">
        {[
          { id: 'conversations', label: 'Recent Conversations' },
          { id: 'uploads', label: 'Uploaded Image Metadata' },
          { id: 'predictions', label: 'Prediction History' },
          { id: 'searches', label: 'Search History' },
          { id: 'feedback', label: 'User Feedback' },
          { id: 'logs', label: 'Error & API Logs' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => { setActiveTable(t.id); setCurrentPage(1); }}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
              activeTable === t.id
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Filter Controls Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-gray-50 border border-gray-200">
        
        {/* Instant Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-white text-gray-900 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          />
        </div>

        {/* Flower Name Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={flowerFilter}
            onChange={(e) => setFlowerFilter(e.target.value)}
            className="w-full py-1.5 px-3 text-xs rounded-lg bg-white text-gray-900 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-medium"
          >
            <option value="ALL">All Flowers</option>
            {uniqueFlowers.map(fl => (
              <option key={fl} value={fl}>{fl}</option>
            ))}
          </select>
        </div>

        {/* Confidence Filter */}
        <div className="flex items-center gap-2">
          <select
            value={confFilter}
            onChange={(e) => setConfFilter(e.target.value)}
            className="w-full py-1.5 px-3 text-xs rounded-lg bg-white text-gray-900 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-medium"
          >
            <option value="ALL">All Confidence Scores</option>
            <option value="90+">High Confidence (90%+)</option>
            <option value="80-90">Moderate (80% - 90%)</option>
            <option value="<80">Low Confidence (&lt;80%)</option>
          </select>
        </div>

      </div>

      {/* Render Dynamic Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-left text-xs text-gray-700">
          
          {/* Table Header */}
          <thead className="bg-gray-50 text-gray-900 uppercase font-bold tracking-wider border-b border-gray-200">
            <tr>
              {activeTable === 'conversations' && (
                <>
                  <th className="py-3 px-4">Session ID</th>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Flower Context</th>
                  <th className="py-3 px-4">Messages</th>
                  <th className="py-3 px-4">Confidence</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4 text-center">Transcript</th>
                </>
              )}
              {activeTable === 'uploads' && (
                <>
                  <th className="py-3 px-4">Filename</th>
                  <th className="py-3 px-4">Dimensions</th>
                  <th className="py-3 px-4">Size</th>
                  <th className="py-3 px-4">Predicted Flower</th>
                  <th className="py-3 px-4">Confidence</th>
                  <th className="py-3 px-4">Timestamp</th>
                </>
              )}
              {activeTable === 'predictions' && (
                <>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Flower Name</th>
                  <th className="py-3 px-4">Scientific Name</th>
                  <th className="py-3 px-4">Confidence</th>
                  <th className="py-3 px-4">Latency</th>
                  <th className="py-3 px-4">Status</th>
                </>
              )}
              {activeTable === 'searches' && (
                <>
                  <th className="py-3 px-4">Query</th>
                  <th className="py-3 px-4">Matched Flower</th>
                  <th className="py-3 px-4">Results</th>
                  <th className="py-3 px-4">User Location</th>
                  <th className="py-3 px-4">Timestamp</th>
                </>
              )}
              {activeTable === 'feedback' && (
                <>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Rating</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Comment</th>
                  <th className="py-3 px-4">Timestamp</th>
                </>
              )}
              {activeTable === 'logs' && (
                <>
                  <th className="py-3 px-4">Endpoint</th>
                  <th className="py-3 px-4">Method</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Latency</th>
                  <th className="py-3 px-4">Error Snippet</th>
                  <th className="py-3 px-4">Timestamp</th>
                </>
              )}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-gray-200 font-medium bg-white">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, idx) => (
                <tr key={idx} className="hover:bg-blue-50/40 transition-colors">
                  
                  {activeTable === 'conversations' && (
                    <>
                      <td className="py-3 px-4 font-bold text-blue-600">{row.session_id}</td>
                      <td className="py-3 px-4">{row.user}</td>
                      <td className="py-3 px-4 font-semibold text-gray-900">{row.flower}</td>
                      <td className="py-3 px-4">{row.message_count} turns</td>
                      <td className="py-3 px-4 font-semibold text-blue-600">{row.confidence}%</td>
                      <td className="py-3 px-4 text-gray-500">{new Date(row.timestamp).toLocaleString()}</td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => setSelectedTranscript(row)}
                          className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors border border-blue-100"
                          title="View transcript"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </>
                  )}

                  {activeTable === 'uploads' && (
                    <>
                      <td className="py-3 px-4 font-bold text-gray-900">{row.filename}</td>
                      <td className="py-3 px-4 text-gray-500">{row.dimensions}</td>
                      <td className="py-3 px-4">{row.size}</td>
                      <td className="py-3 px-4 font-semibold text-blue-600">{row.predicted_flower}</td>
                      <td className="py-3 px-4 text-blue-600 font-semibold">{row.confidence}%</td>
                      <td className="py-3 px-4 text-gray-500">{new Date(row.timestamp).toLocaleString()}</td>
                    </>
                  )}

                  {activeTable === 'predictions' && (
                    <>
                      <td className="py-3 px-4 font-mono text-xs text-gray-400">{row.id}</td>
                      <td className="py-3 px-4 font-bold text-gray-900">{row.flower}</td>
                      <td className="py-3 px-4 italic text-gray-500">{row.scientific_name}</td>
                      <td className="py-3 px-4 font-bold text-blue-600">{row.confidence}%</td>
                      <td className="py-3 px-4">{row.response_time_ms} ms</td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          {row.status}
                        </span>
                      </td>
                    </>
                  )}

                  {activeTable === 'searches' && (
                    <>
                      <td className="py-3 px-4 font-semibold text-gray-800">"{row.query}"</td>
                      <td className="py-3 px-4 font-bold text-blue-600">{row.matched_flower}</td>
                      <td className="py-3 px-4">{row.results_found} docs</td>
                      <td className="py-3 px-4 text-gray-500">{row.location}</td>
                      <td className="py-3 px-4 text-gray-500">{new Date(row.timestamp).toLocaleString()}</td>
                    </>
                  )}

                  {activeTable === 'feedback' && (
                    <>
                      <td className="py-3 px-4 font-semibold">{row.user}</td>
                      <td className="py-3 px-4 text-amber-500 font-bold">★ {row.rating}/5</td>
                      <td className="py-3 px-4 font-semibold">{row.category}</td>
                      <td className="py-3 px-4 italic text-gray-600 max-w-xs truncate">{row.comment}</td>
                      <td className="py-3 px-4 text-gray-500">{new Date(row.timestamp).toLocaleString()}</td>
                    </>
                  )}

                  {activeTable === 'logs' && (
                    <>
                      <td className="py-3 px-4 font-mono text-gray-900 font-bold">{row.endpoint}</td>
                      <td className="py-3 px-4 font-bold">{row.method}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          row.status_code === 200 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {row.status_code}
                        </span>
                      </td>
                      <td className="py-3 px-4">{row.latency_ms} ms</td>
                      <td className="py-3 px-4 font-mono text-[11px] text-gray-500 max-w-xs truncate">{row.error_message}</td>
                      <td className="py-3 px-4 text-gray-500">{new Date(row.timestamp).toLocaleString()}</td>
                    </>
                  )}

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-8 text-center text-gray-400 font-medium">
                  No records match your selected filter criteria.
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between pt-2 text-xs text-gray-500">
        <span>
          Showing {paginatedData.length} of {filteredDataset.length} records
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-semibold text-gray-800">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-100 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Transcript Modal */}
      {selectedTranscript && (
        <TranscriptModal
          session={selectedTranscript}
          onClose={() => setSelectedTranscript(null)}
        />
      )}

    </div>
  );
}
