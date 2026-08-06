import React, { useState, useRef, useEffect } from 'react';
import {
  RefreshCw, Search, Bell, Database, Radio,
  ChevronDown, Sun, Moon, Download, FileSpreadsheet,
  FileText, Printer, Sparkles, X, Zap, Command
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { exportToCSV, exportToExcel, exportToPDF, exportDashboardSnapshot } from '../services/exporter';
import adminAvatar from '../assets/admin-avatar.png';

const DATE_RANGES = [
  { id: 'today', label: 'Today' },
  { id: 'yesterday', label: 'Yesterday' },
  { id: '7d', label: '7 Days' },
  { id: '30d', label: '30 Days' },
  { id: 'this_month', label: 'This Month' },
  { id: 'all', label: 'All Time' },
];

const DROPDOWN_VARIANTS = {
  hidden: { opacity: 0, scale: 0.96, y: -6 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.15, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, scale: 0.96, y: -6, transition: { duration: 0.1 } }
};

export default function Header({
  dateRange,
  setDateRange,
  onRefresh,
  loading,
  searchQuery,
  setSearchQuery,
  autoRefresh,
  setAutoRefresh,
  rawData
}) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const searchRef = useRef(null);

  // Close all dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest('[data-dropdown]')) {
        setProfileOpen(false);
        setNotificationsOpen(false);
        setExportOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleExportCSV = () => { exportToCSV(rawData?.tables?.recentPredictions || [], `flower_analytics_${dateRange}.csv`); setExportOpen(false); };
  const handleExportExcel = () => { exportToExcel(rawData?.tables?.recentPredictions || [], 'Flower Analytics', `flower_analytics_${dateRange}.xlsx`); setExportOpen(false); };
  const handleExportPDF = () => {
    const cols = [
      { header: 'Flower', accessor: 'flower' },
      { header: 'Scientific Name', accessor: 'scientific_name' },
      { header: 'Confidence %', accessor: 'confidence' },
      { header: 'User Email', accessor: 'user_email' },
      { header: 'Timestamp', accessor: 'searched_at' }
    ];
    exportToPDF(cols, rawData?.tables?.recentPredictions || [], 'AI Flower Analytics Report', `flower_analytics_${dateRange}.pdf`);
    setExportOpen(false);
  };

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between px-5 gap-4 glass-heavy border-b shadow-sm"
      style={{ height: 'var(--header-height)', borderColor: 'var(--border-subtle)' }}
    >

      {/* ── Left: Brand context ── */}
      <div className="hidden lg:flex items-center gap-3 shrink-0">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: 'var(--text-tertiary)' }}>
            Enterprise Analytics
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-sm font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
              AI Flower Expert
            </span>
            <span className="text-[11px] font-medium" style={{ color: 'var(--color-primary)' }}>
              Dashboard
            </span>
          </div>
        </div>
      </div>

      {/* ── Center: Global Search ── */}
      <div className="flex-1 max-w-sm lg:max-w-md xl:max-w-lg">
        <div className="relative" ref={searchRef}>
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: 'var(--text-tertiary)' }} />
          <input
            id="global-search"
            type="text"
            placeholder="Search flowers, users, sessions…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-16 py-2 text-[13px] rounded-xl transition-all outline-none"
            style={{
              background: 'var(--bg-input)',
              border: '1px solid var(--border-default)',
              color: 'var(--text-primary)',
            }}
            onFocus={e => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.boxShadow = '0 0 0 3px var(--color-primary-light)'; }}
            onBlur={e => { e.target.style.borderColor = 'var(--border-default)'; e.target.style.boxShadow = 'none'; }}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            {searchQuery ? (
              <button onClick={() => setSearchQuery('')} className="p-0.5 rounded" style={{ color: 'var(--text-tertiary)' }}>
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <div className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-bold" style={{ background: 'var(--border-subtle)', color: 'var(--text-tertiary)' }}>
                <Command className="w-2.5 h-2.5" />K
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Right Controls ── */}
      <div className="flex items-center gap-1.5">

        {/* Date range pills */}
        <div className="hidden md:flex items-center gap-1 p-1 rounded-xl" style={{ background: 'var(--bg-input)', border: '1px solid var(--border-subtle)' }}>
          {DATE_RANGES.map(r => (
            <button
              key={r.id}
              onClick={() => setDateRange(r.id)}
              className="px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all"
              style={dateRange === r.id ? {
                background: 'linear-gradient(135deg, #1e40af, #2563eb)',
                color: 'white',
                boxShadow: '0 2px 6px rgba(30,64,175,0.35)'
              } : {
                color: 'var(--text-tertiary)'
              }}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Mobile date select */}
        <div className="md:hidden">
          <select
            value={dateRange}
            onChange={e => setDateRange(e.target.value)}
            className="text-xs px-2 py-1.5 rounded-lg font-semibold outline-none cursor-pointer"
            style={{ background: 'var(--bg-input)', border: '1px solid var(--border-default)', color: 'var(--text-primary)' }}
          >
            {DATE_RANGES.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
          </select>
        </div>

        {/* Divider */}
        <div className="hidden xl:block w-px h-5 mx-1" style={{ background: 'var(--border-default)' }} />

        {/* MongoDB status — xl only */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', color: '#10b981' }}>
          <Database className="w-3.5 h-3.5" />
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="hidden 2xl:inline">MongoDB Live</span>
        </div>

        {/* Auto refresh */}
        <button
          onClick={() => setAutoRefresh && setAutoRefresh(!autoRefresh)}
          title={autoRefresh ? 'Auto-refresh on (5s)' : 'Enable auto-refresh'}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-semibold transition-all border"
          style={autoRefresh ? {
            background: 'rgba(99,102,241,0.1)',
            borderColor: 'rgba(99,102,241,0.3)',
            color: 'var(--color-primary)'
          } : {
            background: 'var(--bg-input)',
            borderColor: 'var(--border-default)',
            color: 'var(--text-tertiary)'
          }}
        >
          <Radio className={`w-3.5 h-3.5 ${autoRefresh ? 'animate-pulse' : ''}`} />
          <span className="hidden lg:inline">{autoRefresh ? 'Live' : 'Sync'}</span>
        </button>

        {/* Refresh */}
        <button
          onClick={onRefresh}
          disabled={loading}
          title="Refresh data"
          className="p-2 rounded-xl transition-all border disabled:opacity-50"
          style={{ background: 'var(--bg-input)', borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          className="p-2 rounded-xl transition-all border"
          style={{ background: 'var(--bg-input)', borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}
        >
          {theme === 'dark'
            ? <Sun className="w-3.5 h-3.5 text-amber-400" />
            : <Moon className="w-3.5 h-3.5 text-indigo-500" />
          }
        </button>

        {/* Export dropdown */}
        <div className="relative" data-dropdown>
          <button
            onClick={() => { setExportOpen(!exportOpen); setNotificationsOpen(false); setProfileOpen(false); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold text-white transition-all shadow-sm"
            style={{ background: 'linear-gradient(135deg, #1e40af, #2563eb)', boxShadow: '0 2px 8px rgba(30,64,175,0.35)' }}
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
            <ChevronDown className="w-3 h-3" />
          </button>

          <AnimatePresence>
            {exportOpen && (
              <motion.div
                variants={DROPDOWN_VARIANTS} initial="hidden" animate="visible" exit="exit"
                className="absolute right-0 mt-2 w-52 p-2 rounded-2xl shadow-xl z-50 premium-card"
                style={{ minWidth: 200 }}
              >
                {[
                  { icon: FileText, color: '#10b981', label: 'Export as CSV', action: handleExportCSV },
                  { icon: FileSpreadsheet, color: '#6366f1', label: 'Export as Excel', action: handleExportExcel },
                  { icon: Download, color: '#ef4444', label: 'Export PDF Report', action: handleExportPDF },
                  { icon: Printer, color: '#f59e0b', label: 'Print Snapshot', action: () => { setExportOpen(false); exportDashboardSnapshot(); } },
                ].map((item, i) => (
                  <button
                    key={i}
                    onClick={item.action}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all text-left"
                    style={{ color: 'var(--text-primary)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <item.icon className="w-4 h-4 shrink-0" style={{ color: item.color }} />
                    {item.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Notifications */}
        <div className="relative" data-dropdown>
          <button
            onClick={() => { setNotificationsOpen(!notificationsOpen); setExportOpen(false); setProfileOpen(false); }}
            className="relative p-2 rounded-xl transition-all border"
            style={{ background: 'var(--bg-input)', borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}
          >
            <Bell className="w-3.5 h-3.5" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-indigo-500 rounded-full" />
          </button>

          <AnimatePresence>
            {notificationsOpen && (
              <motion.div
                variants={DROPDOWN_VARIANTS} initial="hidden" animate="visible" exit="exit"
                className="absolute right-0 mt-2 w-80 p-4 rounded-2xl shadow-xl z-50 premium-card"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold flex items-center gap-1.5" style={{ color: 'var(--text-primary)' }}>
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> System Notifications
                  </span>
                  <span className="badge badge-primary">Live</span>
                </div>
                <div className="space-y-2">
                  <div className="p-3 rounded-xl" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
                    <p className="text-xs font-bold text-emerald-400">MongoDB Atlas Connected</p>
                    <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>All collections indexed & synced.</p>
                  </div>
                  <div className="p-3 rounded-xl" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
                    <p className="text-xs font-bold" style={{ color: 'var(--color-primary)' }}>Model Inference Operational</p>
                    <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>Avg classifier latency 240ms.</p>
                  </div>
                  {autoRefresh && (
                    <div className="p-3 rounded-xl" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
                      <p className="text-xs font-bold text-amber-400">Auto-Refresh Active</p>
                      <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>Data syncing every 5 seconds.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <div className="relative" data-dropdown>
          <button
            onClick={() => { setProfileOpen(!profileOpen); setExportOpen(false); setNotificationsOpen(false); }}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl transition-all border"
            style={{ background: 'var(--bg-input)', borderColor: 'var(--border-default)' }}
          >
            <img src={user?.avatar || adminAvatar} alt="Admin" className="w-7 h-7 rounded-full object-cover ring-2 ring-indigo-500/30" />
            <span className="hidden md:block text-xs font-bold max-w-[80px] truncate" style={{ color: 'var(--text-primary)' }}>
              {user?.name || 'Admin'}
            </span>
            <ChevronDown className="w-3 h-3" style={{ color: 'var(--text-tertiary)' }} />
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                variants={DROPDOWN_VARIANTS} initial="hidden" animate="visible" exit="exit"
                className="absolute right-0 mt-2 w-52 p-2 rounded-2xl shadow-xl z-50 premium-card"
              >
                <div className="px-3 py-2 mb-1" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{user?.name || 'System Admin'}</p>
                  <p className="text-[10px] mt-0.5 truncate" style={{ color: 'var(--text-tertiary)' }}>{user?.email || 'admin@aflowerexpert.com'}</p>
                </div>
                <button
                  onClick={logout}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all"
                  style={{ color: '#ef4444' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  Sign Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
