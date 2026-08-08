import React, { useState, useEffect } from 'react';
import { Search, RefreshCw, Sun, Moon, Bell, ShieldCheck, Sparkles, Command } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useNotifications } from '../../context/NotificationContext';

export default function TopNav({
  onOpenCommandPalette,
  onRefresh,
  loading = false,
  autoRefresh = false,
  setAutoRefresh = () => {}
}) {
  const { darkMode, toggleTheme } = useTheme();
  const { notifications, unreadCount } = useNotifications();
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (!loading) {
      setLastUpdated(new Date());
    }
  }, [loading]);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 px-6 flex items-center justify-between text-slate-800 dark:text-slate-200">
      {/* ── Left: Global Search Command Palette Button ── */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <button
          onClick={onOpenCommandPalette}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/90 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700 text-xs transition-all shadow-inner group"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition-colors" />
            <span className="truncate font-normal">Search features, species, users...</span>
          </div>
          <kbd className="hidden sm:flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700/60 shadow-sm">
            <Command className="w-2.5 h-2.5" /> K
          </kbd>
        </button>
      </div>

      {/* ── Right Action Controls ── */}
      <div className="flex items-center gap-3">
        {/* Updated Badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 text-[11px] font-mono text-slate-600 dark:text-slate-400">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span>Updated {formatTime(lastUpdated)}</span>
        </div>

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={loading}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900/80 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200 dark:border-slate-800/80 transition-all disabled:opacity-50"
          title="Refresh Data"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-500' : ''}`} />
        </button>

        {/* Auto Refresh Toggle */}
        <button
          onClick={() => setAutoRefresh(!autoRefresh)}
          className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
            autoRefresh
              ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30'
              : 'bg-slate-100 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800/80 hover:text-slate-900'
          }`}
          title="Toggle Auto Refresh (5s)"
        >
          <span className={`w-1.5 h-1.5 rounded-full ${autoRefresh ? 'bg-blue-500 animate-ping' : 'bg-slate-400'}`} />
          <span className="hidden sm:inline">Live 5s</span>
        </button>

        {/* Dark/Light Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900/80 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-amber-500 border border-slate-200 dark:border-slate-800/80 transition-all"
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
        </button>

        {/* Notifications Popover Toggle */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900/80 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 border border-slate-200 dark:border-slate-800/80 transition-all relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-white font-black text-[9px] flex items-center justify-center border border-white dark:border-slate-950">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Drawer */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-50 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">System Notifications</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                  {unreadCount} New
                </span>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                {notifications && notifications.length > 0 ? (
                  notifications.map((n, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/60 text-xs">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{n.title || n.message}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{n.timestamp || 'Just now'}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 dark:text-slate-400 text-center py-4">No unread alerts.</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar Badge */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200 dark:border-slate-800/80">
          <div className="w-9 h-9 rounded-xl bg-slate-900 border border-emerald-500/30 p-0.5 shadow-md overflow-hidden shrink-0">
            <img src="/logo.png" alt="Executive HQ Logo" className="w-full h-full object-cover rounded-lg" />
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-bold text-slate-900 dark:text-slate-200 leading-none">Executive HQ</p>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-3 h-3 inline" /> Admin Authenticated
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
