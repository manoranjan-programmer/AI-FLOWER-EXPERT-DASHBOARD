import React from 'react';
import KpiCard from './cards/KpiCard';
import AnalyticsCard from './cards/AnalyticsCard';
import AreaChartComponent from './charts/AreaChartComponent';
import DataTable from './tables/DataTable';
import { Database, HardDrive, Layers, Server, FileCode2 } from 'lucide-react';

export default function DatabaseAnalyticsView({ data = {} }) {
  const tables = data?.tables || {};

  const collectionsStats = [
    { name: 'Flower_Search_History', docs: (tables.recentPredictions || []).length, sizeKb: ((tables.recentPredictions || []).length * 1.8).toFixed(1), avgDocSize: '1.8 KB', indexes: 3 },
    { name: 'Chatbot_Performance_Analytics', docs: (tables.chatbotPerformanceLogs || []).length, sizeKb: ((tables.chatbotPerformanceLogs || []).length * 2.4).toFixed(1), avgDocSize: '2.4 KB', indexes: 4 },
    { name: 'Classification_Analytics', docs: (tables.classificationLogs || []).length, sizeKb: ((tables.classificationLogs || []).length * 1.5).toFixed(1), avgDocSize: '1.5 KB', indexes: 3 },
    { name: 'Users', docs: (tables.registeredUsers || []).length, sizeKb: ((tables.registeredUsers || []).length * 0.9).toFixed(1), avgDocSize: '0.9 KB', indexes: 2 },
    { name: 'Flower_Knowledge_Base', docs: (tables.knowledgeBase || []).length, sizeKb: ((tables.knowledgeBase || []).length * 4.2).toFixed(1), avgDocSize: '4.2 KB', indexes: 2 },
    { name: 'User_Activity', docs: (tables.userActivityLogs || []).length, sizeKb: ((tables.userActivityLogs || []).length * 0.7).toFixed(1), avgDocSize: '0.7 KB', indexes: 2 },
    { name: 'Analytics_Logs', docs: (tables.errorLogs || []).length, sizeKb: ((tables.errorLogs || []).length * 1.1).toFixed(1), avgDocSize: '1.1 KB', indexes: 2 },
  ];

  const totalDocs = collectionsStats.reduce((s, c) => s + c.docs, 0);
  const totalKb = collectionsStats.reduce((s, c) => s + parseFloat(c.sizeKb), 0);
  const totalMb = (totalKb / 1024).toFixed(2);
  const avgDocSizeKb = (totalKb / Math.max(1, totalDocs)).toFixed(2);

  const growthSeries = (data?.charts?.usageTrends || []).map(u => ({
    name: u.date || u.time || 'Day',
    documents: totalDocs - 150 + (u.uploads || 10) * 2,
  }));

  const tableColumns = [
    {
      header: 'Collection Name',
      accessor: 'name',
      sortable: true,
      cell: (row) => <span className="font-mono text-emerald-400 font-bold">{row.name}</span>
    },
    {
      header: 'Documents',
      accessor: 'docs',
      sortable: true,
      cell: (row) => row.docs.toLocaleString()
    },
    {
      header: 'Size (KB)',
      accessor: 'sizeKb',
      sortable: true,
      cell: (row) => `${row.sizeKb} KB`
    },
    {
      header: 'Avg Doc Size',
      accessor: 'avgDocSize',
      cell: (row) => row.avgDocSize
    },
    {
      header: 'Indexes',
      accessor: 'indexes',
      cell: (row) => (
        <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono text-[10px] font-bold">
          {row.indexes} Indexes
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* ── KPI Row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Documents"
          value={totalDocs.toLocaleString()}
          change="+8.2%"
          icon={FileCode2}
          sparklineColor="#22c55e"
          sparklineData={[7000, 7200, 7400, 7600, 7800, 8000, 8200, 8605]}
          subtitle="Across 7 MongoDB collections"
        />
        <KpiCard
          title="Storage Used"
          value={`${totalMb} MB`}
          change="+3.4%"
          icon={HardDrive}
          sparklineColor="#6366f1"
          sparklineData={[12, 12.5, 13, 13.5, 14, 14.5, 14.8, 15.2]}
          subtitle="MongoDB Atlas cluster volume"
        />
        <KpiCard
          title="Avg Doc Size"
          value={`${avgDocSizeKb} KB`}
          change="Optimal"
          icon={Layers}
          sparklineColor="#a855f7"
          sparklineData={[1.7, 1.8, 1.8, 1.8, 1.85, 1.82, 1.81, 1.81]}
          subtitle="Optimized BSON payload size"
        />
        <KpiCard
          title="Cluster Status"
          value="Operational"
          change="100% Uptime"
          icon={Server}
          sparklineColor="#06b6d4"
          sparklineData={[100, 100, 100, 100, 100, 100, 100, 100]}
          subtitle="MongoDB test cluster connected"
        />
      </div>

      {/* ── Document Growth & Collections Visual ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <AnalyticsCard
          title="Collection Sizes Overview"
          subtitle="Proportion of storage per collection"
          icon={Database}
          className="lg:col-span-1"
        >
          <div className="space-y-3 py-2 custom-scrollbar overflow-y-auto max-h-[300px]">
            {collectionsStats.map((col, i) => {
              const pct = Math.round((col.docs / Math.max(1, totalDocs)) * 100);
              return (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-800 dark:text-slate-300 font-semibold truncate max-w-[180px]">{col.name}</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{col.docs.toLocaleString()} docs</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </AnalyticsCard>

        <AnalyticsCard
          title="Database Document Growth Trajectory"
          subtitle="Cumulative BSON document growth over time"
          icon={HardDrive}
          className="lg:col-span-2"
        >
          <AreaChartComponent
            data={growthSeries}
            dataKeys={[{ key: 'documents', name: 'Document Count', color: '#22c55e' }]}
            xAxisKey="name"
            height={260}
          />
        </AnalyticsCard>
      </div>

      {/* ── MongoDB Collections Directory Table ── */}
      <AnalyticsCard
        title="MongoDB Collections Schema & Indexes"
        subtitle="Live collection stats & index definitions"
        icon={Database}
      >
        <DataTable
          data={collectionsStats}
          columns={tableColumns}
          searchPlaceholder="Search collections..."
          pageSize={7}
        />
      </AnalyticsCard>
    </div>
  );
}
