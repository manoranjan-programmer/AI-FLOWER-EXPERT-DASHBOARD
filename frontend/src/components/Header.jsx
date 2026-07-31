import React, { useState } from 'react';
import { 
  RefreshCw, 
  Calendar, 
  Search, 
  Bell, 
  Database,
  Radio,
  User,
  ChevronDown,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Header({ 
  dateRange, 
  setDateRange, 
  onRefresh, 
  loading,
  searchQuery,
  setSearchQuery,
  autoRefresh,
  setAutoRefresh
}) {
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const ranges = [
    { id: '7d', label: '7 Days' },
    { id: '30d', label: '30 Days' },
    { id: '90d', label: '90 Days' },
    { id: 'all', label: 'All Time' },
  ];

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200 transition-colors shadow-sm">
      
      {/* Title & Search Input */}
      <div className="flex items-center gap-6">
        <div className="hidden md:flex flex-col">
          <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Dashboard</span>
          <h2 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
            AI Flower Expert Analytics
          </h2>
        </div>

        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search dashboard metrics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">

        {/* Live Mongo Connection Status */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
          <Database className="w-3.5 h-3.5 text-emerald-600" />
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span>MongoDB Atlas Live</span>
        </div>

        {/* Auto-Refresh Toggle */}
        <button
          onClick={() => setAutoRefresh && setAutoRefresh(!autoRefresh)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
            autoRefresh
              ? 'bg-blue-50 text-blue-600 border-blue-200 shadow-sm'
              : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
          }`}
          title={autoRefresh ? 'Live auto-refresh enabled (5s)' : 'Enable live auto-refresh (5s)'}
        >
          <Radio className={`w-3.5 h-3.5 ${autoRefresh ? 'animate-pulse text-blue-600' : ''}`} />
          <span>{autoRefresh ? 'Live Syncing (5s)' : 'Auto-Sync Off'}</span>
        </button>

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={loading}
          className="p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors border border-gray-200"
          title="Manual refresh dataset"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-600' : ''}`} />
        </button>

        {/* Notification Bell Badge */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors border border-gray-200 relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full"></span>
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-72 p-3 bg-white rounded-2xl border border-gray-200 shadow-xl text-xs space-y-2 z-50">
              <div className="font-bold text-gray-900 border-b border-gray-100 pb-2 flex items-center justify-between">
                <span>System Notifications</span>
                <span className="text-[10px] text-blue-600 font-normal">2 New</span>
              </div>
              <div className="space-y-1.5">
                <div className="p-2 rounded-xl bg-blue-50/60 border border-blue-100">
                  <p className="font-semibold text-blue-900">MongoDB Atlas Synced</p>
                  <p className="text-[11px] text-blue-700">105 botanical knowledge articles loaded.</p>
                </div>
                <div className="p-2 rounded-xl bg-emerald-50/60 border border-emerald-100">
                  <p className="font-semibold text-emerald-900">Inference Latency Optimal</p>
                  <p className="text-[11px] text-emerald-700">Average classification response under 240ms.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 p-1.5 pl-2.5 rounded-xl bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors"
          >
            <img 
              src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80"} 
              alt="Avatar" 
              className="w-7 h-7 rounded-full object-cover ring-2 ring-blue-500/20"
            />
            <span className="text-xs font-bold text-gray-900 hidden md:inline-block truncate max-w-[100px]">
              {user?.name || 'Admin'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 p-2 bg-white rounded-2xl border border-gray-200 shadow-xl text-xs space-y-1 z-50">
              <div className="px-3 py-2 border-b border-gray-100 space-y-0.5">
                <p className="font-bold text-gray-900">{user?.name || 'System Admin'}</p>
                <p className="text-[10px] text-gray-500 truncate">{user?.email || 'admin@aflowerexpert.com'}</p>
              </div>
              <button
                onClick={logout}
                className="w-full text-left px-3 py-2 rounded-xl text-rose-600 font-semibold hover:bg-rose-50 transition-colors"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
