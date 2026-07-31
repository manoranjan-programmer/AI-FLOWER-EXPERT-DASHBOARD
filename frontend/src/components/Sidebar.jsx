import React from 'react';
import { 
  LayoutDashboard, 
  BarChart3, 
  BookOpen, 
  MessageSquare, 
  ImageIcon, 
  History, 
  Search, 
  Star, 
  AlertCircle, 
  LogOut, 
  Flower2, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck,
  BrainCircuit,
  Settings,
  HelpCircle,
  FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ activeTab, setActiveTab, collapsed, setCollapsed }) {
  const { logout, user } = useAuth();

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'insights', label: 'AI Insights & Forecasts', icon: BrainCircuit },
    { id: 'knowledge', label: 'Knowledge Base', icon: BookOpen },
    { id: 'charts', label: 'Analytics Charts', icon: BarChart3 },
    { id: 'conversations', label: 'Recent Chats', icon: MessageSquare },
    { id: 'uploads', label: 'Image Metadata', icon: ImageIcon },
    { id: 'predictions', label: 'Predictions', icon: History },
    { id: 'searches', label: 'Search History', icon: Search },
    { id: 'feedback', label: 'User Feedback', icon: Star },
    { id: 'logs', label: 'Error & API Logs', icon: AlertCircle },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help', label: 'Help & Docs', icon: HelpCircle },
  ];

  return (
    <aside className={`fixed top-0 left-0 bottom-0 z-40 flex flex-col transition-all duration-300 ${
      collapsed ? 'w-20' : 'w-64'
    } bg-white border-r border-gray-200 shadow-sm`}>
      
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="p-2 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
            <Flower2 className="w-6 h-6 animate-spin-slow" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-gray-900">
                Flower Analytics
              </span>
              <span className="text-[11px] text-gray-500 font-semibold">AI SaaS Dashboard</span>
            </div>
          )}
        </div>

        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all duration-150 ${
                isActive
                  ? 'bg-blue-50 text-blue-600 border border-blue-200/80 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}

              title={collapsed ? item.label : undefined}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </div>

      {/* Footer Profile & Logout */}
      <div className="p-3 border-t border-gray-200 bg-gray-50 space-y-2">
        {!collapsed && (
          <div className="flex items-center gap-3 p-2 rounded-xl bg-white border border-gray-200 shadow-sm">
            <img 
              src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80"} 
              alt="Avatar" 
              className="w-8 h-8 rounded-full ring-2 ring-blue-500/20 object-cover"
            />
            <div className="flex flex-col truncate">
              <span className="text-xs font-bold text-gray-900 truncate">{user?.name || 'Administrator'}</span>
              <span className="text-[10px] text-blue-600 flex items-center gap-1 font-semibold">
                <ShieldCheck className="w-3 h-3" /> MongoDB Live
              </span>
            </div>
          </div>
        )}

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-colors text-xs font-bold border border-transparent hover:border-rose-100"
          title="Sign out of dashboard"
        >
          <LogOut className="w-4 h-4" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>

    </aside>
  );
}
