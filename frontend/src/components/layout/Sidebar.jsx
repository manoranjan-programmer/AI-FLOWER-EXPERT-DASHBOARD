import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  MessageSquare,
  Flower2,
  Search,
  Users,
  Cpu,
  Database,
  Activity,
  Star,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NAV_GROUPS = [
  {
    label: 'Executive Analytics',
    items: [
      { id: 'overview', label: 'Overview', icon: LayoutDashboard, badge: 'Live' },
      { id: 'chat_analytics', label: 'Conversations', icon: MessageSquare },
      { id: 'flower_analytics', label: 'Species Catalog', icon: Flower2 },
      { id: 'search_analytics', label: 'Search & Telemetry', icon: Search },
      { id: 'user_analytics', label: 'User Operations', icon: Users },
    ]
  },
  {
    label: 'Platform Diagnostics',
    items: [
      { id: 'ai_performance', label: 'AI Engine Speed', icon: Cpu },
      { id: 'database_analytics', label: 'Database Health', icon: Database },
      { id: 'live_activity', label: 'Live Stream', icon: Activity, pulse: true },
      { id: 'feedback', label: 'User Feedback', icon: Star },
      { id: 'settings', label: 'Settings', icon: Settings },
    ]
  }
];

export default function Sidebar({ activeTab, setActiveTab, collapsed, setCollapsed }) {
  const { logout, user } = useAuth();

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 260 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 bottom-0 z-40 flex flex-col bg-white/95 dark:bg-slate-950/90 backdrop-blur-xl border-r border-slate-200 dark:border-slate-800/80 shadow-md dark:shadow-card-dark text-slate-800 dark:text-slate-200 select-none"
    >
      {/* ── Brand Header ── */}
      <div className="h-16 flex items-center justify-between px-4 shrink-0 border-b border-slate-200 dark:border-slate-800/60">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white font-black text-lg shadow-glow-emerald shrink-0">
            <Sparkles className="w-5 h-5 text-emerald-100" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>

          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col whitespace-nowrap overflow-hidden"
              >
                <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  FLOWER <span className="text-emerald-500 dark:text-emerald-400">EXPERT</span>
                </span>
                <span className="text-[10px] font-semibold tracking-widest text-slate-500 dark:text-slate-400 uppercase">
                  Executive Suite
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-900/60 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-all border border-slate-200 dark:border-slate-800/80"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* ── Navigation Items ── */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 custom-scrollbar">
        {NAV_GROUPS.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1.5">
            {!collapsed && (
              <h3 className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400/90 mb-2">
                {group.label}
              </h3>
            )}

            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <div key={item.id} className="relative group">
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 relative ${
                      isActive
                        ? 'bg-emerald-500/10 dark:bg-slate-900/90 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 dark:border-emerald-500/20 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-900/50'
                    }`}
                  >
                    {/* Active Emerald Left Indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-emerald-500 dark:bg-emerald-400 rounded-r-full shadow-glow-emerald"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}

                    <Icon className={`w-4 h-4 shrink-0 transition-transform duration-200 ${isActive ? 'text-emerald-600 dark:text-emerald-400 scale-110' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200'}`} />

                    {!collapsed && (
                      <span className="truncate flex-1 text-left">{item.label}</span>
                    )}

                    {!collapsed && item.badge && (
                      <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                        {item.badge}
                      </span>
                    )}

                    {!collapsed && item.pulse && (
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                    )}
                  </button>

                  {/* Tooltip on Collapsed Mode */}
                  {collapsed && (
                    <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center z-50 pointer-events-none">
                      <div className="px-3 py-1.5 rounded-lg bg-slate-900 text-slate-100 text-xs font-semibold whitespace-nowrap border border-slate-800 shadow-xl">
                        {item.label}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* ── Footer / Logout ── */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800/60 bg-slate-100/70 dark:bg-slate-950/60 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-md">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>

          {!collapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{user?.name || 'Administrator'}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{user?.email || 'admin@flowerexpert.ai'}</p>
            </div>
          )}

          <button
            onClick={logout}
            className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors ml-auto"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.aside>
  );
}
