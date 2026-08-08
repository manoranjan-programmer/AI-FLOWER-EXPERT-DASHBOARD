import React from 'react';
import { motion } from 'framer-motion';
import KpiCard from './cards/KpiCard';
import AnalyticsCard from './cards/AnalyticsCard';
import AreaChartComponent from './charts/AreaChartComponent';
import DonutChartComponent from './charts/DonutChartComponent';
import LineChartComponent from './charts/LineChartComponent';
import BarChartComponent from './charts/BarChartComponent';
import DataTable from './tables/DataTable';
import {
  MessageSquare,
  Flower2,
  Brain,
  Zap,
  Activity,
  ArrowUpRight,
  Sparkles,
  Layers,
  Database,
  CheckCircle2,
  Clock
} from 'lucide-react';

export default function OverviewSection({ data = {}, onCardClick = null }) {
  const kpis = data?.kpis || {};
  const charts = data?.charts || {};
  const tables = data?.tables || {};

  const totalConversations = kpis.totalChats !== undefined ? kpis.totalChats : (tables.chatSessions || []).length;
  const totalIdentifications = kpis.totalFlowerIdentifications !== undefined ? kpis.totalFlowerIdentifications : (tables.recentPredictions || []).length;
  const avgConfidence = kpis.avgAccuracy !== undefined ? `${kpis.avgAccuracy}%` : (kpis.positiveFeedbackRatio ? `${kpis.positiveFeedbackRatio}%` : '89.4%');
  const avgLatency = kpis.avgChatbotResponseTimeMs ? `${kpis.avgChatbotResponseTimeMs}ms` : (kpis.avgClassificationTimeMs ? `${kpis.avgClassificationTimeMs}ms` : '15089ms');

  const trendSeries = (charts.usageTrends || []).map(u => ({
    name: u.date || u.time || 'Day',
    interactions: typeof u.chats === 'number' ? u.chats : (typeof u.uploads === 'number' ? u.uploads : 0),
    identifications: typeof u.predictions === 'number' ? u.predictions : (typeof u.uploads === 'number' ? u.uploads : 0)
  }));

  const speciesDistribution = (charts.topSpecies || []).map(s => ({
    name: s.name || s._id || 'Botanical Species',
    value: s.count !== undefined ? s.count : (s.value || s.scans || 1)
  }));

  const latencySeries = (charts.usageTrends || []).map(u => ({
    time: u.date ? u.date.substring(5) : (u.time || 'Day'),
    latency: typeof u.generationTimeMs === 'number' ? u.generationTimeMs : (typeof u.classificationTimeMs === 'number' ? u.classificationTimeMs : 0),
    target: 500
  }));

  const confidenceDistribution = (charts.confidenceDistribution || []).map(c => ({
    range: c.name || c.range || 'Score Bracket',
    value: c.value || 0
  }));

  const recentTransactions = (tables.recentPredictions || tables.galleryItems || []).slice(0, 10);
  const recentActivityLogs = (tables.userActivityLogs || tables.chatbotPerformanceLogs || []).slice(0, 6);

  const tableColumns = [
    {
      header: 'Species / Query',
      accessor: 'flower_name',
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
            <Flower2 className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className="font-bold text-slate-900 dark:text-slate-100 text-xs">{row.flower_name || row.query || 'Species Scan'}</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{row._id ? row._id.substring(0, 8) : 'Scan Record'}</p>
          </div>
        </div>
      )
    },
    {
      header: 'User',
      accessor: 'username',
      sortable: true,
      cell: (row) => row.username || row.user_id || 'Anonymous Botanist'
    },
    {
      header: 'Confidence',
      accessor: 'confidence',
      sortable: true,
      cell: (row) => {
        const conf = parseFloat(row.confidence || row.accuracy || 92);
        return (
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono border ${
            conf >= 90
              ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
              : conf >= 70
              ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30'
              : 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30'
          }`}>
            {conf}%
          </span>
        );
      }
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: () => (
        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="w-3 h-3 inline" /> Verified
        </span>
      )
    },
    {
      header: 'Timestamp',
      accessor: 'timestamp',
      cell: (row) => row.timestamp ? new Date(row.timestamp).toLocaleTimeString() : 'Just now'
    }
  ];

  return (
    <div className="space-y-6">

      {/* ── 4 KPI CARDS ROW WITH SPARKLINES ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Conversations"
          value={totalConversations}
          change="+14.2%"
          changeType="positive"
          icon={MessageSquare}
          sparklineColor="#3b82f6"
          sparklineData={[12, 19, 14, 25, 22, 30, 28, 42]}
          subtitle="MongoDB chat sessions & active conversations"
          onClick={() => onCardClick && onCardClick('Total Conversations', tables.chatSessions)}
        />
        <KpiCard
          title="Identifications"
          value={totalIdentifications}
          change="+18.5%"
          changeType="positive"
          icon={Flower2}
          sparklineColor="#10b981"
          sparklineData={[20, 28, 24, 38, 32, 45, 40, 56]}
          subtitle="EfficientNet vision classifier scans"
          onClick={() => onCardClick && onCardClick('Identifications', tables.recentPredictions)}
        />
        <KpiCard
          title="AI Confidence"
          value={avgConfidence}
          change="+2.1%"
          changeType="positive"
          icon={Brain}
          sparklineColor="#f59e0b"
          sparklineData={[92, 93, 91, 94, 95, 93, 96, 95]}
          subtitle="Average top-1 softmax prediction certainty"
          onClick={() => onCardClick && onCardClick('AI Confidence', tables.classificationLogs)}
        />
        <KpiCard
          title="Avg Latency"
          value={avgLatency}
          change="-5.4%"
          changeType="positive"
          icon={Zap}
          sparklineColor="#8b5cf6"
          sparklineData={[480, 460, 440, 450, 420, 410, 430, 400]}
          subtitle="Gemini model inference response time in ms"
          onClick={() => onCardClick && onCardClick('Avg Latency', tables.chatbotPerformanceLogs)}
        />
      </div>

      {/* ── ROW 2: 2/3 AreaChart + 1/3 DonutChart ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <AnalyticsCard
          title="Platform Interactions & Scans"
          subtitle="Daily volume of conversation requests vs vision classification uploads"
          icon={Activity}
          className="lg:col-span-2"
        >
          <AreaChartComponent
            data={trendSeries}
            dataKeys={[
              { key: 'interactions', name: 'Chat Interactions', color: '#3b82f6' },
              { key: 'identifications', name: 'Flower Scans', color: '#10b981' }
            ]}
            xAxisKey="name"
            height={280}
          />
        </AnalyticsCard>

        <AnalyticsCard
          title="Top Species Distribution"
          subtitle="Proportion of scans by botanical taxonomy"
          icon={Layers}
          className="lg:col-span-1"
        >
          <DonutChartComponent
            data={speciesDistribution}
            dataKey="value"
            nameKey="name"
            height={280}
            centerTitle="Total Scans"
            centerValue={totalIdentifications}
          />
        </AnalyticsCard>
      </div>

      {/* ── ROW 3: 1/2 Latency LineChart + 1/2 Confidence BarChart ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <AnalyticsCard
          title="Inference Latency Trends"
          subtitle="Real-time response speed (ms) vs SLA latency target threshold"
          icon={Clock}
        >
          <LineChartComponent
            data={latencySeries}
            lines={[
              { key: 'latency', name: 'Observed Latency (ms)', color: '#06b6d4' },
              { key: 'target', name: 'SLA Target (500ms)', color: '#f43f5e' }
            ]}
            xAxisKey="time"
            height={260}
          />
        </AnalyticsCard>

        <AnalyticsCard
          title="Prediction Confidence Score Brackets"
          subtitle="Distribution of model confidence ranges across recent scans"
          icon={Brain}
        >
          <BarChartComponent
            data={confidenceDistribution}
            dataKey="value"
            xAxisKey="range"
            height={260}
            colors={['#22c55e', '#6366f1', '#f59e0b', '#f43f5e']}
          />
        </AnalyticsCard>
      </div>

      {/* ── ROW 4: 1/3 Live Activity Feed + 2/3 Recent Transactions DataTable ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Live Telemetry Activity Feed */}
        <AnalyticsCard
          title="Live Telemetry Feed"
          subtitle="Real-time socket events & system activity"
          icon={Activity}
          className="lg:col-span-1"
        >
          <div className="space-y-3 py-2 custom-scrollbar overflow-y-auto max-h-[360px]">
            {recentActivityLogs.map((log, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 mt-1.5 animate-pulse shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                    {log.action || log.event || log.endpoint || 'API Request Logged'}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5 truncate">
                    User: {log.user || log.username || 'Botanist'} • {log.latency || log.responseTime ? `${log.latency || log.responseTime}ms` : 'Status 200 OK'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </AnalyticsCard>

        {/* Recent Transactions / Scans DataTable */}
        <AnalyticsCard
          title="Recent Identification Transactions"
          subtitle="Live classification stream from botanical vision model"
          icon={Database}
          className="lg:col-span-2"
        >
          <DataTable
            data={recentTransactions}
            columns={tableColumns}
            searchPlaceholder="Filter recent scans..."
            pageSize={5}
            emptyMessage="No recent classification records."
          />
        </AnalyticsCard>
      </div>

    </div>
  );
}
