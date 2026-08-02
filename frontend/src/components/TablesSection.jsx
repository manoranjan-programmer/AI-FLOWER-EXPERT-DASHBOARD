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
  Sparkles,
  CheckCircle,
  XCircle,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Monitor
} from 'lucide-react';
import { exportToCSV, exportToExcel, exportToPDF } from '../services/exporter';
import TranscriptModal from './TranscriptModal';

export default function TablesSection({ tablesData, activeTab }) {
  const [activeTable, setActiveTable] = useState('conversations');
  const [searchTerm, setSearchTerm] = useState('');
  const [flowerFilter, setFlowerFilter] = useState('ALL');
  const [confFilter, setConfFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTranscript, setSelectedTranscript] = useState(null);

  const itemsPerPage = 8;

  const {
    chatSessions = [],
    chatbotPerformanceLogs = [],
    classificationLogs = [],
    userActivityLogs = [],
    galleryItems = [],
    registeredUsers = [],
    errorLogs = []
  } = tablesData || {};

  // Sync activeTable with activeTab prop
  React.useEffect(() => {
    if (['conversations', 'chatbot_logs', 'classification_logs', 'activity_logs', 'users', 'error_logs'].includes(activeTab)) {
      setActiveTable(activeTab);
      setCurrentPage(1);
    }
  }, [activeTab]);

  const currentDataset = useMemo(() => {
    switch (activeTable) {
      case 'conversations': return chatSessions;
      case 'chatbot_logs': return chatbotPerformanceLogs.length > 0 ? chatbotPerformanceLogs : chatSessions;
      case 'classification_logs': return classificationLogs.length > 0 ? classificationLogs : galleryItems;
      case 'activity_logs': return userActivityLogs;
      case 'users': return registeredUsers;
      case 'error_logs': return errorLogs;
      default: return chatSessions;
    }
  }, [activeTable, chatSessions, chatbotPerformanceLogs, classificationLogs, userActivityLogs, galleryItems, registeredUsers, errorLogs]);

  const uniqueFlowers = useMemo(() => {
    const set = new Set();
    currentDataset.forEach(item => {
      const fl = item.flower || item.predicted_flower || item.flower_context;
      if (fl) set.add(fl);
    });
    return Array.from(set);
  }, [currentDataset]);

  const filteredDataset = useMemo(() => {
    return currentDataset.filter(item => {
      const searchMatch = !searchTerm || JSON.stringify(item).toLowerCase().includes(searchTerm.toLowerCase());

      const flName = item.flower || item.predicted_flower || item.flower_context;
      const flowerMatch = flowerFilter === 'ALL' || flName === flowerFilter;

      const conf = item.confidence || item.classifier_confidence;
      let confMatch = true;
      if (conf) {
        if (confFilter === '90+') confMatch = conf >= 90;
        else if (confFilter === '80-90') confMatch = conf >= 80 && conf < 90;
        else if (confFilter === '<80') confMatch = conf < 80;
      }

      return searchMatch && flowerMatch && confMatch;
    });
  }, [currentDataset, searchTerm, flowerFilter, confFilter]);

  const totalPages = Math.ceil(filteredDataset.length / itemsPerPage) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredDataset.slice(start, start + itemsPerPage);
  }, [filteredDataset, currentPage]);

  const handleExportCSV = () => {
    exportToCSV(filteredDataset, `${activeTable}_analytics_export.csv`);
  };

  const handleExportExcel = () => {
    exportToExcel(filteredDataset, activeTable, `${activeTable}_analytics_export.xlsx`);
  };

  const handleExportPDF = () => {
    const columns = [
      { header: 'ID / Session', accessor: 'session_id' },
      { header: 'User Email', accessor: 'email' },
      { header: 'Timestamp', accessor: 'timestamp' }
    ];
    exportToPDF(columns, filteredDataset, `${activeTable.toUpperCase()} Analytics Report`, `${activeTable}_report.pdf`);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">

      {/* Top Header & Table Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            MongoDB Live Analytics Explorer
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Searchable tables for chatbot performance, image classification, activity, and error logs.
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
          { id: 'conversations', label: 'Conversations History' },
          { id: 'chatbot_logs', label: 'Chatbot Performance' },
          { id: 'classification_logs', label: 'Image Classification' },
          { id: 'activity_logs', label: 'User Activity Feed' },
          { id: 'users', label: 'Registered Users' },
          { id: 'error_logs', label: 'Error Diagnostics' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => { setActiveTable(t.id); setCurrentPage(1); }}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${activeTable === t.id
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
            placeholder="Search records in MongoDB..."
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
            <option value="ALL">All Species Filter</option>
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
              {activeTable === 'chatbot_logs' && (
                <>
                  <th className="py-3 px-4">Session ID</th>
                  <th className="py-3 px-4">User / Email</th>
                  <th className="py-3 px-4">Model Name</th>
                  <th className="py-3 px-4">Generation Time</th>
                  <th className="py-3 px-4">Tokens</th>
                  <th className="py-3 px-4">Feedback</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Transcript</th>
                </>
              )}
              {activeTable === 'classification_logs' && (
                <>
                  <th className="py-3 px-4">Session ID</th>
                  <th className="py-3 px-4">Filename</th>
                  <th className="py-3 px-4">Predicted Flower</th>
                  <th className="py-3 px-4">Confidence</th>
                  <th className="py-3 px-4">Model Latency</th>
                  <th className="py-3 px-4">Size</th>
                  <th className="py-3 px-4">Status</th>
                </>
              )}
              {activeTable === 'activity_logs' && (
                <>
                  <th className="py-3 px-4">User Email</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Details</th>
                  <th className="py-3 px-4">Browser / Device</th>
                  <th className="py-3 px-4">Timestamp</th>
                </>
              )}
              {activeTable === 'users' && (
                <>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Total Searches</th>
                  <th className="py-3 px-4">Last Active</th>
                </>
              )}
              {activeTable === 'error_logs' && (
                <>
                  <th className="py-3 px-4">Session ID</th>
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Error Message</th>
                  <th className="py-3 px-4">Timestamp</th>
                </>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 font-medium bg-white">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, idx) => (
                <tr key={idx} className="hover:bg-blue-50/40 transition-colors">

                  {activeTable === 'conversations' && (
                    <>
                      <td className="py-3 px-4 font-bold text-blue-600">{row.session_id}</td>
                      <td className="py-3 px-4">{row.user || row.user_email}</td>
                      <td className="py-3 px-4 font-semibold text-gray-900">{row.flower}</td>
                      <td className="py-3 px-4">{row.message_count || (row.messages ? row.messages.length : 2)} turns</td>
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

                  {activeTable === 'chatbot_logs' && (
                    <>
                      <td className="py-3 px-4 font-bold text-blue-600">{row.session_id}</td>
                      <td className="py-3 px-4">{row.email || row.username}</td>
                      <td className="py-3 px-4 font-mono text-[11px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">{row.model_name || 'Gemini-1.5-Pro'}</td>
                      <td className="py-3 px-4 font-semibold text-amber-600">{row.generation_time_ms} ms</td>
                      <td className="py-3 px-4 font-mono">{row.total_tokens || 140}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 w-fit ${row.feedback === 'like' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : row.feedback === 'dislike' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-gray-50 text-gray-600 border-gray-200'
                          }`}>
                          {row.feedback === 'like' ? <ThumbsUp className="w-3 h-3 text-emerald-600" /> : row.feedback === 'dislike' ? <ThumbsDown className="w-3 h-3 text-rose-600" /> : null}
                          {row.feedback || 'neutral'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {row.status || 'success'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => setSelectedTranscript({
                            session_id: row.session_id,
                            flower: row.flower_context || 'AI Chat Interaction',
                            user: row.email,
                            timestamp: row.timestamp,
                            messages: row.transcript && row.transcript.length > 0 ? row.transcript : [
                              { role: 'user', content: row.user_prompt || 'User Prompt', timestamp: row.timestamp },
                              { role: 'assistant', content: row.ai_response || 'AI Response', timestamp: row.timestamp }
                            ]
                          })}
                          className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors border border-blue-100"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </>
                  )}

                  {activeTable === 'classification_logs' && (
                    <>
                      <td className="py-3 px-4 font-bold text-blue-600">{row.session_id}</td>
                      <td className="py-3 px-4 font-mono text-gray-800">{row.uploaded_image_metadata ? row.uploaded_image_metadata.filename : (row.filename || 'uploaded_flower.jpeg')}</td>
                      <td className="py-3 px-4 font-bold text-gray-900">{row.predicted_flower || row.flower}</td>
                      <td className="py-3 px-4 font-bold text-emerald-600">{row.classifier_confidence || row.confidence}%</td>
                      <td className="py-3 px-4 font-semibold text-cyan-700">{row.classification_time_ms || 2400} ms</td>
                      <td className="py-3 px-4">{row.uploaded_image_metadata ? `${row.uploaded_image_metadata.size_kb} KB` : '180 KB'}</td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {row.status || 'success'}
                        </span>
                      </td>
                    </>
                  )}

                  {activeTable === 'activity_logs' && (
                    <>
                      <td className="py-3 px-4 font-bold text-gray-900">{row.email || row.username}</td>
                      <td className="py-3 px-4 font-semibold text-blue-600 uppercase">{row.action}</td>
                      <td className="py-3 px-4 text-gray-700">{row.details}</td>
                      <td className="py-3 px-4 text-gray-500">{row.device_info ? `${row.device_info.browser || 'Edge'} (${row.device_info.os || 'Windows'})` : 'Edge (Windows)'}</td>
                      <td className="py-3 px-4 text-gray-500">{new Date(row.timestamp).toLocaleString()}</td>
                    </>
                  )}

                  {activeTable === 'users' && (
                    <>
                      <td className="py-3 px-4 font-bold text-gray-900">{row.name}</td>
                      <td className="py-3 px-4">{row.email}</td>
                      <td className="py-3 px-4 capitalize font-semibold text-purple-700">{row.role}</td>
                      <td className="py-3 px-4 font-bold text-blue-600">{row.total_searches}</td>
                      <td className="py-3 px-4 text-gray-500">{new Date(row.last_active).toLocaleString()}</td>
                    </>
                  )}

                  {activeTable === 'error_logs' && (
                    <>
                      <td className="py-3 px-4 font-mono text-blue-600">{row.session_id}</td>
                      <td className="py-3 px-4 font-bold text-gray-800">{row.service}</td>
                      <td className="py-3 px-4">{row.user}</td>
                      <td className="py-3 px-4 text-rose-600 font-medium">{row.error_message}</td>
                      <td className="py-3 px-4 text-gray-500">{new Date(row.timestamp).toLocaleString()}</td>
                    </>
                  )}

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="py-8 text-center text-gray-400 font-medium">
                  No records match your selected filter criteria in MongoDB.
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
