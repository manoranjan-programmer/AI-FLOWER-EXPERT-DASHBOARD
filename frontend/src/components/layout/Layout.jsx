import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import Header from './Header';
import CommandPalette from '../command/CommandPalette';
import ErrorBoundary from '../common/ErrorBoundary';

export default function Layout({
  children,
  activeTab = 'overview',
  setActiveTab = () => {},
  dateRange = '30d',
  setDateRange = () => {},
  onRefresh = () => {},
  loading = false,
  autoRefresh = false,
  setAutoRefresh = () => {},
  onExport = null,
  extraActions = null
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  const sidebarWidth = collapsed ? 80 : 260;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans flex antialiased selection:bg-emerald-500 selection:text-slate-950">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* Main Content Workspace Wrapper */}
      <div
        className="flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out"
        style={{ marginLeft: `${sidebarWidth}px` }}
      >
        {/* Top Sticky Nav Header */}
        <TopNav
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
          onRefresh={onRefresh}
          loading={loading}
          autoRefresh={autoRefresh}
          setAutoRefresh={setAutoRefresh}
        />

        {/* Executive Page Header */}
        <Header
          activeTab={activeTab}
          dateRange={dateRange}
          setDateRange={setDateRange}
          onExport={onExport}
          extraActions={extraActions}
        />

        {/* Dynamic Page Container wrapped in ErrorBoundary */}
        <main className="flex-1 p-6 overflow-y-auto">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </main>
      </div>

      {/* Ctrl + K Command Palette Dialog */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        setActiveTab={setActiveTab}
        setDateRange={setDateRange}
      />
    </div>
  );
}
