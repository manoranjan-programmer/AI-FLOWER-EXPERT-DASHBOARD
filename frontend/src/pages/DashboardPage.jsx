import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import FilterPanel from '../components/FilterPanel';
import ExecutiveKpiCards from '../components/ExecutiveKpiCards';
import UserLeaderboard from '../components/UserLeaderboard';
import RecentPredictionFeed from '../components/RecentPredictionFeed';
import AiInsightsPanel from '../components/AiInsightsPanel';
import AnalyticsCharts from '../components/AnalyticsCharts';
import ImageGalleryInspector from '../components/ImageGalleryInspector';
import KnowledgeBaseInspector from '../components/KnowledgeBaseInspector';
import TablesSection from '../components/TablesSection';
import SettingsPanel from '../components/SettingsPanel';
import HelpDocsPanel from '../components/HelpDocsPanel';
import { fetchAnalyticsOverview } from '../services/api';
import {
  Sparkles,
  Layers,
  Users,
  History,
  Image as ImageIcon,
  MessageSquare,
  BarChart3,
  BookOpen,
  ShieldCheck,
  BrainCircuit,
  Calendar,
  Download,
  Share2,
  Settings,
  HelpCircle,
  FileText
} from 'lucide-react';

export default function DashboardPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('30d');
  const [searchQuery, setSearchQuery] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [loading, setLoading] = useState(true);
  const [rawData, setRawData] = useState(null);
  const [appliedFilters, setAppliedFilters] = useState({});

  const loadData = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const res = await fetchAnalyticsOverview(dateRange);
      setRawData(res);
    } catch (err) {
      console.error('Failed to fetch analytics data:', err);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    loadData(true);
  }, [dateRange]);

  // Live Socket/Polling interval effect
  useEffect(() => {
    let interval = null;
    if (autoRefresh) {
      interval = setInterval(() => {
        loadData(false);
      }, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, dateRange]);

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

  // Dynamic Filtering Engine
  const data = useMemo(() => {
    if (!rawData) return null;
    const { category, region, status, search } = appliedFilters;
    const effectiveSearch = searchQuery || search || '';

    // Filter Table / Inspector Items
    let galleryItems = rawData.tables?.galleryItems || [];
    let chatSessions = rawData.tables?.chatSessions || [];
    let knowledgeBase = rawData.tables?.knowledgeBase || [];
    let registeredUsers = rawData.tables?.registeredUsers || [];
    let recentPredictions = rawData.tables?.recentPredictions || [];

    if (effectiveSearch) {
      const q = effectiveSearch.toLowerCase();
      galleryItems = galleryItems.filter(item => JSON.stringify(item).toLowerCase().includes(q));
      chatSessions = chatSessions.filter(item => JSON.stringify(item).toLowerCase().includes(q));
      knowledgeBase = knowledgeBase.filter(item => JSON.stringify(item).toLowerCase().includes(q));
      registeredUsers = registeredUsers.filter(item => JSON.stringify(item).toLowerCase().includes(q));
      recentPredictions = recentPredictions.filter(item => JSON.stringify(item).toLowerCase().includes(q));
    }

    if (status && status !== 'ALL') {
      if (status === 'high') {
        galleryItems = galleryItems.filter(i => i.confidence >= 90);
        chatSessions = chatSessions.filter(i => i.confidence >= 90);
        recentPredictions = recentPredictions.filter(i => i.confidence >= 90);
      } else if (status === 'moderate') {
        galleryItems = galleryItems.filter(i => i.confidence >= 70 && i.confidence < 90);
        chatSessions = chatSessions.filter(i => i.confidence >= 70 && i.confidence < 90);
        recentPredictions = recentPredictions.filter(i => i.confidence >= 70 && i.confidence < 90);
      } else if (status === 'low') {
        galleryItems = galleryItems.filter(i => i.confidence < 70);
        chatSessions = chatSessions.filter(i => i.confidence < 70);
        recentPredictions = recentPredictions.filter(i => i.confidence < 70);
      } else if (status === 'toxic') {
        knowledgeBase = knowledgeBase.filter(i => i.toxicity.toLowerCase().includes('toxic') && !i.toxicity.toLowerCase().includes('non-toxic'));
      }
    }

    return {
      kpis: rawData.kpis,
      charts: rawData.charts,
      tables: {
        ...rawData.tables,
        galleryItems,
        chatSessions,
        knowledgeBase,
        registeredUsers,
        recentPredictions
      }
    };
  }, [rawData, appliedFilters, searchQuery]);

  const currentDateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const kpis = data?.kpis || {};
  const charts = data?.charts || {};
  const tables = data?.tables || {};

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans flex transition-colors duration-300">

      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* Main Content Workspace */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${collapsed ? 'ml-20' : 'ml-64'
        }`}>

        {/* Header Navbar */}
        <Header
          dateRange={dateRange}
          setDateRange={setDateRange}
          onRefresh={() => loadData(true)}
          loading={loading}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          autoRefresh={autoRefresh}
          setAutoRefresh={setAutoRefresh}
        />

        {/* Dashboard Body */}
        <main className="flex-1 p-6 space-y-8 bg-[#F8F9FA] overflow-y-auto">

          {/* Welcome Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-gray-200 shadow-sm relative overflow-hidden">
            <div className="space-y-1 relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold mb-1">
                <Sparkles className="w-3.5 h-3.5" /> AI Botanical SaaS Analytics Platform
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 flex items-center gap-2">
                AI Flower Expert Analytics Dashboard
              </h1>
              <p className="text-xs text-gray-500 font-medium flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                <span>Today is {currentDateStr}</span> • <span className="font-bold text-blue-600">MongoDB Atlas DB Connected: `test`</span>
              </p>
            </div>

            <div className="flex items-center gap-2 relative z-10">
              <button
                onClick={() => window.print()}
                className="px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs transition-colors flex items-center gap-1.5 border border-gray-200"
              >
                <Download className="w-4 h-4" /> Download PDF Report
              </button>
              <button
                onClick={() => navigator.clipboard && navigator.clipboard.writeText(window.location.href)}
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm shadow-blue-500/20 transition-all flex items-center gap-1.5 btn-ripple"
              >
                <Share2 className="w-4 h-4" /> Share Dashboard
              </button>
            </div>
          </div>

          {/* Tab Navigation Quick Bar */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-white border border-gray-200 shadow-sm text-xs font-bold">
            {[
              { id: 'overview', label: 'Executive Overview', icon: Layers },
              { id: 'users', label: 'User Leaderboard & Activity', icon: Users },
              { id: 'prediction_feed', label: 'Recent Predictions Feed', icon: History },
              { id: 'charts', label: 'Visual Analytics & Charts', icon: BarChart3 },
              { id: 'knowledge', label: 'Botanical Knowledge Base', icon: BookOpen },
              { id: 'insights', label: 'AI Insights & Forecasts', icon: BrainCircuit },
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Interactive Multi-Dimensional Filter Bar */}
          {activeTab !== 'knowledge' && (
            <FilterPanel
              dateRange={dateRange}
              setDateRange={setDateRange}
              onApplyFilters={handleApplyFilters}
              onResetFilters={handleResetFilters}
            />
          )}

          {/* 1. OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <>
              <ExecutiveKpiCards kpis={kpis} />
              <UserLeaderboard registeredUsers={tables.registeredUsers} />
              <RecentPredictionFeed predictions={tables.recentPredictions} />
              <AnalyticsCharts chartsData={charts} />
              <AiInsightsPanel kpis={kpis} chartsData={charts} />
              <KnowledgeBaseInspector knowledgeBase={tables.knowledgeBase} />
              <ImageGalleryInspector galleryItems={tables.galleryItems} />
              <TablesSection tablesData={tables} activeTab={activeTab} />
            </>
          )}

          {/* 2. USER LEADERBOARD TAB */}
          {activeTab === 'users' && (
            <>
              <ExecutiveKpiCards kpis={kpis} />
              <UserLeaderboard registeredUsers={tables.registeredUsers} />
            </>
          )}

          {/* 3. RECENT PREDICTION FEED TAB */}
          {(activeTab === 'prediction_feed' || activeTab === 'predictions') && (
            <>
              <ExecutiveKpiCards kpis={kpis} />
              <RecentPredictionFeed predictions={tables.recentPredictions} />
              <TablesSection tablesData={tables} activeTab="predictions" />
            </>
          )}

          {/* 4. AI INSIGHTS & FORECASTS TAB */}
          {activeTab === 'insights' && (
            <>
              <ExecutiveKpiCards kpis={kpis} />
              <AiInsightsPanel kpis={kpis} chartsData={charts} />
            </>
          )}

          {/* 5. KNOWLEDGE BASE TAB */}
          {activeTab === 'knowledge' && (
            <KnowledgeBaseInspector knowledgeBase={tables.knowledgeBase} />
          )}

          {/* 6. ANALYTICS CHARTS TAB */}
          {activeTab === 'charts' && (
            <>
              <ExecutiveKpiCards kpis={kpis} />
              <AnalyticsCharts chartsData={charts} />
            </>
          )}

          {/* 7. UPLOADS & GALLERY TAB */}
          {(activeTab === 'uploads' || activeTab === 'gallery') && (
            <>
              <ImageGalleryInspector galleryItems={tables.galleryItems} />
              <TablesSection tablesData={tables} activeTab="uploads" />
            </>
          )}

          {/* Dedicated Analytics View Tabs */}
          {activeTab === 'chatbot_logs' && (
            <>
              <ExecutiveKpiCards kpis={kpis} />
              <TablesSection tablesData={tables} activeTab="chatbot_logs" />
            </>
          )}

          {activeTab === 'classification_logs' && (
            <>
              <ExecutiveKpiCards kpis={kpis} />
              <ImageGalleryInspector galleryItems={tables.galleryItems} />
              <TablesSection tablesData={tables} activeTab="classification_logs" />
            </>
          )}

          {activeTab === 'activity_logs' && (
            <>
              <ExecutiveKpiCards kpis={kpis} />
              <TablesSection tablesData={tables} activeTab="activity_logs" />
            </>
          )}

          {(activeTab === 'error_logs' || activeTab === 'logs') && (
            <>
              <ExecutiveKpiCards kpis={kpis} />
              <TablesSection tablesData={tables} activeTab="error_logs" />
            </>
          )}

          {/* 8. CONVERSATIONS & RECENT CHATS TAB */}
          {activeTab === 'conversations' && (
            <TablesSection tablesData={tables} activeTab="conversations" />
          )}

          {/* 9. SEARCH HISTORY TAB */}
          {activeTab === 'searches' && (
            <TablesSection tablesData={tables} activeTab="searches" />
          )}

          {/* 10. USER FEEDBACK TAB */}
          {activeTab === 'feedback' && (
            <TablesSection tablesData={tables} activeTab="feedback" />
          )}

          {/* 12. REPORTS TAB */}
          {activeTab === 'reports' && (
            <>
              <ExecutiveKpiCards kpis={kpis} />
              <TablesSection tablesData={tables} activeTab="conversations" />
            </>
          )}

          {/* 13. SETTINGS TAB */}
          {activeTab === 'settings' && (
            <SettingsPanel />
          )}

          {/* 14. HELP & DOCS TAB */}
          {activeTab === 'help' && (
            <HelpDocsPanel />
          )}

        </main>


      </div>

    </div>
  );
}
