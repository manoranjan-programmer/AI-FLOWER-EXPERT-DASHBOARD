import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  LayoutDashboard,
  MessageSquare,
  Flower2,
  Users,
  Cpu,
  Database,
  Activity,
  Star,
  Settings,
  Calendar,
  Sun,
  Moon,
  ArrowRight,
  Command,
  X
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function CommandPalette({
  isOpen = false,
  onClose = () => {},
  setActiveTab = () => {},
  setDateRange = () => {}
}) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { darkMode, toggleTheme } = useTheme();

  const COMMAND_ITEMS = [
    { type: 'nav', id: 'overview', title: 'Go to Overview Dashboard', icon: LayoutDashboard, category: 'Navigation' },
    { type: 'nav', id: 'chat_analytics', title: 'Go to Conversations & Chatbot Analytics', icon: MessageSquare, category: 'Navigation' },
    { type: 'nav', id: 'flower_analytics', title: 'Go to Species Catalog & Vision Scans', icon: Flower2, category: 'Navigation' },
    { type: 'nav', id: 'search_analytics', title: 'Go to Search & Telemetry Logs', icon: Search, category: 'Navigation' },
    { type: 'nav', id: 'user_analytics', title: 'Go to User Operations', icon: Users, category: 'Navigation' },
    { type: 'nav', id: 'ai_performance', title: 'Go to AI Engine Speed & Token Throughput', icon: Cpu, category: 'Navigation' },
    { type: 'nav', id: 'database_analytics', title: 'Go to Database Health', icon: Database, category: 'Navigation' },
    { type: 'nav', id: 'live_activity', title: 'Go to Live Activity Stream', icon: Activity, category: 'Navigation' },
    { type: 'nav', id: 'feedback', title: 'Go to User Reviews & Feedback Queue', icon: Star, category: 'Navigation' },
    { type: 'nav', id: 'settings', title: 'Go to System Configurations', icon: Settings, category: 'Navigation' },

    { type: 'filter', id: '7d', title: 'Filter: Last 7 Days', icon: Calendar, category: 'Date Range' },
    { type: 'filter', id: '30d', title: 'Filter: Last 30 Days', icon: Calendar, category: 'Date Range' },
    { type: 'filter', id: 'this_month', title: 'Filter: This Month', icon: Calendar, category: 'Date Range' },

    { type: 'action', id: 'theme', title: `Toggle System Theme (${darkMode ? 'Light' : 'Dark'} Mode)`, icon: darkMode ? Sun : Moon, category: 'Appearance' },
  ];

  // Natural language local search filter
  const filteredItems = COMMAND_ITEMS.filter((item) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q) || item.id.toLowerCase().includes(q);
  });

  // Global Ctrl + K listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Keyboard navigation within modal
  const handleKeyDownModal = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        executeItem(filteredItems[selectedIndex]);
      }
    }
  };

  const executeItem = (item) => {
    if (item.type === 'nav') {
      setActiveTab(item.id);
    } else if (item.type === 'filter') {
      setDateRange(item.id);
    } else if (item.type === 'action' && item.id === 'theme') {
      toggleTheme();
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col"
          onKeyDown={handleKeyDownModal}
        >
          {/* Top Search Input Box */}
          <div className="flex items-center px-4 border-b border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950/60">
            <Search className="w-4 h-4 text-emerald-500 shrink-0" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              placeholder="Type a command or search feature..."
              className="w-full px-3 py-4 bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none font-sans"
            />
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Command Items List */}
          <div className="max-h-80 overflow-y-auto p-2 space-y-1 custom-scrollbar">
            {filteredItems.length > 0 ? (
              filteredItems.map((item, idx) => {
                const Icon = item.icon;
                const isSelected = idx === selectedIndex;
                return (
                  <button
                    key={idx}
                    onClick={() => executeItem(item)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-colors ${
                      isSelected
                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-500' : 'text-slate-400'}`} />
                      <span className="truncate">{item.title}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60 font-mono">
                        {item.category}
                      </span>
                      <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? 'opacity-100 text-emerald-500' : 'opacity-0'}`} />
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="p-8 text-center text-xs text-slate-400 font-medium">
                No matching executive commands found for "{query}"
              </div>
            )}
          </div>

          {/* Footer Shortcuts hint */}
          <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono">
            <div className="flex items-center gap-3">
              <span><kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">↑↓</kbd> Navigate</span>
              <span><kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">↵</kbd> Select</span>
              <span><kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">Esc</kbd> Close</span>
            </div>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <Command className="w-3 h-3 inline" /> Executive Palette
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
