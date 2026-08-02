import React from 'react';
import ExecutiveKpiCards from '../../components/ExecutiveKpiCards';
import SystemHealthWidget from '../../components/common/SystemHealthWidget';
import AnalyticsCharts from '../../components/AnalyticsCharts';
import TablesSection from '../../components/TablesSection';
import UserLeaderboard from '../../components/UserLeaderboard';
import RecentPredictionFeed from '../../components/RecentPredictionFeed';
import KnowledgeBaseInspector from '../../components/KnowledgeBaseInspector';
import ImageGalleryInspector from '../../components/ImageGalleryInspector';
import { useAnalytics } from '../../context/AnalyticsContext';

export default function ExecutiveOverviewPage() {
  const { data } = useAnalytics();
  const kpis = data?.kpis || {};
  const charts = data?.charts || {};
  const tables = data?.tables || {};

  return (
    <div className="space-y-8">
      <SystemHealthWidget />
      <ExecutiveKpiCards kpis={kpis} tables={tables} />
      <AnalyticsCharts chartsData={charts} />
      <UserLeaderboard registeredUsers={tables.registeredUsers} />
      <RecentPredictionFeed predictions={tables.recentPredictions} />
      <KnowledgeBaseInspector knowledgeBase={tables.knowledgeBase} />
      <ImageGalleryInspector galleryItems={tables.galleryItems} />
      <TablesSection tablesData={tables} activeTab="overview" />
    </div>
  );
}
