import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import FilterPanel from '../components/FilterPanel';

import OverviewSection from '../components/OverviewSection';
import ChatAnalyticsView from '../components/ChatAnalyticsView';
import FlowerAnalyticsView from '../components/FlowerAnalyticsView';
import SearchAnalyticsView from '../components/SearchAnalyticsView';
import UserAnalyticsView from '../components/UserAnalyticsView';
import AiPerformanceView from '../components/AiPerformanceView';
import DatabaseAnalyticsView from '../components/DatabaseAnalyticsView';
import LiveActivityView from '../components/LiveActivityView';
import SettingsPanel from '../components/SettingsPanel';
import FeedbackAnalytics from './views/FeedbackAnalytics';

import DrillDownModal from '../components/common/DrillDownModal';
import { SkeletonCard, SkeletonChart } from '../components/common/SkeletonLoader';
import { fetchAnalyticsOverview } from '../services/api';

const PAGE_TRANSITION = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.18 } }
};

export default function DashboardPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('30d');
  const [searchQuery, setSearchQuery] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [loading, setLoading] = useState(true);
  const [rawData, setRawData] = useState(null);
  const [appliedFilters, setAppliedFilters] = useState({});

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalData, setModalData] = useState(null);

  const loadData = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const res = await fetchAnalyticsOverview(dateRange);
      setRawData(res);
    } catch (err) {
      console.error('Failed to fetch analytics overview data:', err);
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => { loadData(true); }, [dateRange]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => loadData(false), 5000);
    return () => clearInterval(interval);
  }, [autoRefresh, loadData]);

  const handleApplyFilters = (newFilters) => {
    setAppliedFilters(newFilters);
    if (newFilters.dateRange && newFilters.dateRange !== dateRange) {
      setDateRange(newFilters.dateRange);
    }
  };

  const handleResetFilters = () => {
    setAppliedFilters({});
    setDateRange('30d');
  };

  const handleCardClick = (title, recordData) => {
    setModalTitle(title);
    setModalData(recordData || { note: 'MongoDB Record Details', timestamp: new Date().toISOString() });
    setModalOpen(true);
  };

  const filteredData = useMemo(() => {
    if (!rawData) return null;
    const { category, status, search } = appliedFilters;
    const q = (searchQuery || search || '').toLowerCase();

    let galleryItems = rawData.tables?.galleryItems || [];
    let chatSessions = rawData.tables?.chatSessions || [];
    let knowledgeBase = rawData.tables?.knowledgeBase || [];
    let registeredUsers = rawData.tables?.registeredUsers || [];
    let recentPredictions = rawData.tables?.recentPredictions || [];
    let chatbotLogs = rawData.tables?.chatbotPerformanceLogs || [];
    let classLogs = rawData.tables?.classificationLogs || [];
    let activityLogs = rawData.tables?.userActivityLogs || [];
    let errorLogs = rawData.tables?.errorLogs || [];

    if (q) {
      const f = (arr) => arr.filter(i => JSON.stringify(i).toLowerCase().includes(q));
      galleryItems = f(galleryItems);
      chatSessions = f(chatSessions);
      knowledgeBase = f(knowledgeBase);
      registeredUsers = f(registeredUsers);
      recentPredictions = f(recentPredictions);
      chatbotLogs = f(chatbotLogs);
      classLogs = f(classLogs);
    }

    if (status && status !== 'ALL') {
      if (status === 'high') recentPredictions = recentPredictions.filter(i => (parseFloat(i.confidence) || 0) >= 90);
      if (status === 'moderate') recentPredictions = recentPredictions.filter(i => { const c = parseFloat(i.confidence) || 0; return c >= 70 && c < 90; });
      if (status === 'low') recentPredictions = recentPredictions.filter(i => (parseFloat(i.confidence) || 0) < 70);
    }

    return {
      kpis: {
        ...rawData.kpis,
        totalChats: chatSessions.length,
        totalFlowerIdentifications: recentPredictions.length,
        totalRegisteredUsers: registeredUsers.length
      },
      charts: rawData.charts || {},
      tables: {
        ...rawData.tables,
        galleryItems, chatSessions, knowledgeBase, registeredUsers,
        recentPredictions, chatbotPerformanceLogs: chatbotLogs,
        classificationLogs: classLogs, userActivityLogs: activityLogs, errorLogs
      }
    };
  }, [rawData, appliedFilters, searchQuery]);

  const sidebarW = collapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)';

  return (
    <div className="min-h-screen aurora-bg text-slate-900 dark:text-white font-sans flex" style={{ fontFamily: 'Inter, sans-serif' }}>

      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* Main workspace */}
      <div
        className="flex-1 flex flex-col min-w-0 transition-all duration-300"
        style={{ marginLeft: sidebarW }}
      >
        <Header
          dateRange={dateRange}
          setDateRange={setDateRange}
          onRefresh={() => loadData(true)}
          loading={loading}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          autoRefresh={autoRefresh}
          setAutoRefresh={setAutoRefresh}
          rawData={rawData}
        />

        <main className="flex-1 overflow-y-auto">
          {/* Filter bar */}
          {activeTab !== 'settings' && activeTab !== 'feedback' && (
            <div className="px-6 pt-5">
              <FilterPanel
                dateRange={dateRange}
                setDateRange={setDateRange}
                onApplyFilters={handleApplyFilters}
                onResetFilters={handleResetFilters}
              />
            </div>
          )}

          {/* Content area */}
          <div className="px-6 pb-8 pt-5">

            {/* Skeleton loading */}
            {loading && !rawData && (
              <div className="space-y-5">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard />
                </div>
                <SkeletonChart />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <SkeletonCard /><SkeletonCard /><SkeletonCard />
                </div>
              </div>
            )}

            {/* Animated page views */}
            <AnimatePresence mode="wait">
              {!loading && filteredData && (
                <motion.div
                  key={activeTab}
                  {...PAGE_TRANSITION}
                >
                  {activeTab === 'overview' && <OverviewSection data={filteredData} onCardClick={handleCardClick} />}
                  {activeTab === 'chat_analytics' && <ChatAnalyticsView data={filteredData} />}
                  {activeTab === 'flower_analytics' && <FlowerAnalyticsView data={filteredData} />}
                  {activeTab === 'search_analytics' && <SearchAnalyticsView data={filteredData} />}
                  {activeTab === 'user_analytics' && <UserAnalyticsView data={filteredData} />}
                  {activeTab === 'ai_performance' && <AiPerformanceView data={filteredData} />}
                  {activeTab === 'database_analytics' && <DatabaseAnalyticsView data={filteredData} />}
                  {activeTab === 'live_activity' && <LiveActivityView data={filteredData} />}
                  {activeTab === 'feedback' && <FeedbackAnalytics />}
                  {activeTab === 'settings' && <SettingsPanel />}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>

      <DrillDownModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        data={modalData}
      />
    </div>
  );
}
