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
  ShieldCheck,
  Image,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';
import adminAvatar from '../assets/admin-avatar.png';

const NAV_GROUPS = [
  {
    label: 'Core Analytics',
    items: [
      { id: 'overview',            label: 'Dashboard',         icon: LayoutDashboard,  badge: 'Home' },
      { id: 'chat_analytics',      label: 'Conversations',     icon: MessageSquare },
      { id: 'flower_analytics',    label: 'Flower Analytics',  icon: Flower2 },
      { id: 'search_analytics',    label: 'Search Analytics',  icon: Search },
      { id: 'user_analytics',      label: 'User Analytics',    icon: Users },
    ]
  },
  {
    label: 'System',
    items: [
      { id: 'ai_performance',      label: 'AI Performance',    icon: Cpu },
      { id: 'database_analytics',  label: 'Database',          icon: Database },
      { id: 'live_activity',       label: 'Live Activity',     icon: Activity, pulse: true },
      { id: 'feedback',            label: 'Feedback',          icon: Star },
      { id: 'settings',            label: 'Settings',          icon: Settings },
    ]
  }
];

export default function Sidebar({ activeTab, setActiveTab, collapsed, setCollapsed }) {
  const { logout, user } = useAuth();

  return (
    <aside
      className="fixed top-0 left-0 bottom-0 z-40 flex flex-col glass-heavy border-r transition-all duration-300 ease-in-out"
      style={{
        width: collapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)',
        borderColor: 'var(--border-default)',
      }}
    >
      {/* ── Brand Header ── */}
      <div
        className="flex items-center justify-between px-4 shrink-0"
        style={{ height: 'var(--header-height)', borderBottom: '1px solid var(--border-subtle)' }}
      >
        <div className="flex items-center gap-3 min-w-0 overflow-hidden">
          <img
            src="/logo.png"
            alt="Flower AI Logo"
            className="w-9 h-9 rounded-xl object-cover shrink-0 shadow-lg shadow-indigo-500/25"
          />

          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.18 }}
                className="flex flex-col overflow-hidden"
              >
                <span className="font-black text-sm tracking-tight leading-none" style={{ color: 'var(--text-primary)' }}>
                  Flower AI
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.1em] mt-0.5" style={{ color: 'var(--color-primary)' }}>
                  Analytics Core
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg transition-all shrink-0 hover:bg-white/8"
          style={{ color: 'var(--text-tertiary)' }}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed
            ? <ChevronRight className="w-4 h-4" />
            : <ChevronLeft className="w-4 h-4" />
          }
        </button>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden" style={{ padding: collapsed ? '16px 8px' : '16px 10px' }}>
        {NAV_GROUPS.map((group, gIdx) => (
          <div key={gIdx} className={gIdx > 0 ? 'mt-5' : ''}>
            {/* Group label */}
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="px-3 mb-2"
                >
                  <span className="text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: 'var(--text-tertiary)' }}>
                    {group.label}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Items */}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    title={collapsed ? item.label : undefined}
                    className={`sidebar-nav-item w-full ${isActive ? 'active' : ''} ${collapsed ? 'justify-center' : ''}`}
                    style={collapsed ? { padding: '9px', justifyContent: 'center' } : {}}
                  >
                    <div className="relative shrink-0">
                      <Icon
                        className="w-[17px] h-[17px]"
                        style={{ color: isActive ? 'var(--color-primary)' : 'var(--text-tertiary)' }}
                      />
                      {item.pulse && (
                        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500">
                          <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75" />
                        </span>
                      )}
                    </div>

                    <AnimatePresence>
                      {!collapsed && (
                        <motion.div
                          initial={{ opacity: 0, x: -4 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -4 }}
                          transition={{ duration: 0.15 }}
                          className="flex-1 flex items-center justify-between min-w-0 overflow-hidden"
                        >
                          <span className="truncate">{item.label}</span>
                          {item.badge && (
                            <span
                              className="ml-2 shrink-0 px-1.5 py-0.5 rounded-full text-[9px] font-bold"
                              style={{
                                background: isActive ? 'rgba(129,140,248,0.2)' : 'var(--bg-elevated)',
                                color: isActive ? 'var(--color-primary)' : 'var(--text-tertiary)',
                              }}
                            >
                              {item.badge}
                            </span>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* ── Footer ── */}
      <div
        className="shrink-0 p-3 space-y-2"
        style={{ borderTop: '1px solid var(--border-subtle)' }}
      >
        {/* Profile card */}
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.18 }}
              className="flex items-center gap-2.5 p-2.5 rounded-xl"
              style={{ background: 'var(--bg-input)', border: '1px solid var(--border-subtle)' }}
            >
              <img
                src={user?.avatar || adminAvatar}
                alt="Admin"
                className="w-8 h-8 rounded-full object-cover ring-2"
                style={{ ringColor: 'var(--color-primary-light)' }}
              />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                  {user?.name || 'Administrator'}
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-semibold text-emerald-500">Connected</span>
                </div>
              </div>
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-500" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Logout */}
        <button
          onClick={logout}
          title="Sign out"
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all text-xs font-semibold"
          style={{ color: '#ef4444' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
              >
                Sign Out
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </aside>
  );
}
