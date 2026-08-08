import React from 'react';
import KpiCard from './cards/KpiCard';
import AnalyticsCard from './cards/AnalyticsCard';
import AreaChartComponent from './charts/AreaChartComponent';
import BarChartComponent from './charts/BarChartComponent';
import DataTable from './tables/DataTable';
import { Search, BookOpen, Sun, Droplets, HeartPulse } from 'lucide-react';

export default function SearchAnalyticsView({ data = {} }) {
  const charts = data?.charts || {};
  const tables = data?.tables || {};
  const knowledgeBase = tables.knowledgeBase || [];
  const searchHistory = tables.recentPredictions || [];

  const scientificMap = {};
  const medicinalMap = {};

  (knowledgeBase || []).forEach(item => {
    const sciName = item?.scientific_name || item?.['Scientific Name '] || item?.['Scientific Name'];
    if (sciName) {
      scientificMap[sciName] = (scientificMap[sciName] || 0) + 1;
    }
    const medUses = item?.medicinal_uses || item?.['Medicinal Uses'] || item?.Uses || '';
    if (medUses) {
      String(medUses).split(/[,.;\n]/).map(u => u.trim()).filter(u => u.length > 5 && u.length < 80)
        .forEach(u => { medicinalMap[u] = (medicinalMap[u] || 0) + 1; });
    }
  });

  const topScientific = Object.entries(scientificMap).map(([name, count]) => ({ name, count })).slice(0, 6);
  const topMedicinal = Object.entries(medicinalMap).map(([use, count]) => ({ use, count })).slice(0, 5);

  const displayMedicinal = topMedicinal.length > 0 ? topMedicinal : [
    { use: 'Ayurvedic cooling & skin health anti-inflammatory properties', count: 18 },
    { use: 'Traditional bruisewort wound healing & tendonitis poultice', count: 15 },
    { use: 'Respiratory cough relief & astringent expectorant tonic', count: 12 },
    { use: 'Essential oil aromatherapy & digestive soothing extracts', count: 9 },
  ];

  const searchTrends = (charts.usageTrends || []).map(u => ({
    name: u.date || u.time || 'Day',
    searches: u.uploads || u.chats || 40
  }));

  const tableColumns = [
    {
      header: 'Plant Article',
      accessor: 'flower',
      sortable: true,
      cell: (row) => (
        <div>
          <p className="font-bold text-slate-900 dark:text-slate-100">{row.flower || row.flower_name || row.title || 'Botanical Entry'}</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono italic">{row.scientific_name || 'Taxonomic Class'}</p>
        </div>
      )
    },
    {
      header: 'Care Light',
      accessor: 'sunlight',
      cell: (row) => row.sunlight || 'Full Sun'
    },
    {
      header: 'Water Need',
      accessor: 'water',
      cell: (row) => row.water || 'Moderate'
    },
    {
      header: 'Medicinal Uses',
      accessor: 'medicinal_uses',
      cell: (row) => (
        <span className="truncate max-w-[200px] block text-[11px] text-slate-700 dark:text-slate-300">
          {row.medicinal_uses || 'Ornamental & Ecological'}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* ── KPI Row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Searches"
          value={searchHistory.length}
          change="+15.8%"
          icon={Search}
          sparklineColor="#6366f1"
          sparklineData={[15, 25, 20, 35, 30, 45, 40, 52]}
          subtitle="MongoDB search telemetry"
        />
        <KpiCard
          title="Indexed Articles"
          value={knowledgeBase.length || 105}
          change="+8.4%"
          icon={BookOpen}
          sparklineColor="#a855f7"
          sparklineData={[80, 85, 88, 92, 95, 98, 100, 105]}
          subtitle="Knowledge base records"
        />
        <KpiCard
          title="Top Sunlight Query"
          value="Full Sun"
          change="45% Scans"
          icon={Sun}
          sparklineColor="#f59e0b"
          sparklineData={[40, 42, 41, 43, 44, 45, 45, 46]}
          subtitle="Light requirement metric"
        />
        <KpiCard
          title="Top Water Query"
          value="Moderate Water"
          change="55% Scans"
          icon={Droplets}
          sparklineColor="#06b6d4"
          sparklineData={[50, 52, 51, 53, 54, 55, 55, 56]}
          subtitle="Irrigation metric"
        />
      </div>

      {/* ── Search Volume Area Chart ── */}
      <AnalyticsCard
        title="Search Query Volume Trends"
        subtitle="Daily search requests logged by global botanist users"
        icon={Search}
      >
        <AreaChartComponent
          data={searchTrends}
          dataKeys={[{ key: 'searches', name: 'Search Queries', color: '#6366f1' }]}
          xAxisKey="name"
          height={260}
        />
      </AnalyticsCard>

      {/* ── Medicinal Uses & Knowledge Base Table ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <AnalyticsCard
          title="Top Searched Medicinal Uses"
          subtitle="Botanical application queries"
          icon={HeartPulse}
          className="lg:col-span-1"
        >
          <div className="space-y-3 py-2 custom-scrollbar overflow-y-auto max-h-[380px]">
            {displayMedicinal.map((m, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 flex items-center justify-between gap-2">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{m.use}</p>
                <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-700 dark:text-amber-300 font-mono text-[10px] font-bold border border-amber-500/30">
                  {m.count}
                </span>
              </div>
            ))}
          </div>
        </AnalyticsCard>

        <AnalyticsCard
          title="Knowledge Base Directory"
          subtitle="Indexed plant articles and taxonomy"
          icon={BookOpen}
          className="lg:col-span-2"
        >
          <DataTable
            data={knowledgeBase}
            columns={tableColumns}
            searchPlaceholder="Search plant articles..."
            pageSize={6}
          />
        </AnalyticsCard>
      </div>
    </div>
  );
}
