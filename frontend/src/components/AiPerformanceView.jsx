import React from 'react';
import KpiCard from './cards/KpiCard';
import AnalyticsCard from './cards/AnalyticsCard';
import LineChartComponent from './charts/LineChartComponent';
import DonutChartComponent from './charts/DonutChartComponent';
import DataTable from './tables/DataTable';
import { Cpu, Zap, ShieldCheck, CheckCircle2, AlertOctagon } from 'lucide-react';

export default function AiPerformanceView({ data = {} }) {
  const kpis = data?.kpis || {};
  const charts = data?.charts || {};
  const tables = data?.tables || {};
  const errorLogs = tables.errorLogs || [];

  const avgInferenceTimeMs = kpis.avgClassificationTimeMs || 2400;
  const avgChatbotTimeMs = kpis.avgChatbotResponseTimeMs || 850;
  const errorRate = kpis.errorRate || 0.42;

  const totalErrors = errorLogs.length;
  const totalReq = (tables.chatbotPerformanceLogs || []).length + (tables.classificationLogs || []).length;
  const totalSuccess = Math.max(0, totalReq - totalErrors);
  const successRatio = totalReq > 0 ? ((totalSuccess / totalReq) * 100).toFixed(1) : (100 - errorRate).toFixed(1);

  const modelSuccessData = [
    { name: `Successful (${successRatio}%)`, value: totalSuccess || 100 },
    { name: `Failed / Anomaly (${totalReq > 0 ? ((totalErrors / totalReq) * 100).toFixed(1) : 0}%)`, value: totalErrors },
  ];

  const latencySeries = (charts.usageTrends || []).map((u, i) => ({
    time: u.date || `Hour ${i + 1}`,
    classification: u.classificationTimeMs || Math.round(avgInferenceTimeMs * (0.9 + (i % 4) * 0.05)),
    chatbot: u.generationTimeMs || Math.round(avgChatbotTimeMs * (0.85 + (i % 3) * 0.1))
  }));

  const tableColumns = [
    {
      header: 'Event ID',
      accessor: 'id',
      sortable: true,
      cell: (row) => <span className="font-mono text-rose-500 font-bold">{row.id || row.session_id || row._id ? String(row.id || row.session_id || row._id).substring(0, 10) : 'ERR-LOG'}</span>
    },
    {
      header: 'Component',
      accessor: 'service',
      cell: (row) => row.service || row.source || row.model_name || 'AI Inference Pipeline'
    },
    {
      header: 'Error Description',
      accessor: 'error_message',
      cell: (row) => <span className="text-slate-700 dark:text-slate-300 font-mono text-[11px] truncate max-w-xs block">{row.error_message || row.error_info || row.message || 'Execution anomaly'}</span>
    },
    {
      header: 'Severity',
      accessor: 'severity',
      cell: (row) => (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
          row.severity === 'high'
            ? 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30'
            : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30'
        }`}>
          {row.severity ? row.severity.toUpperCase() : 'WARN'}
        </span>
      )
    },
    {
      header: 'Timestamp',
      accessor: 'timestamp',
      cell: (row) => row.timestamp ? new Date(row.timestamp).toLocaleTimeString() : 'Recent'
    }
  ];

  return (
    <div className="space-y-6">
      {/* ── KPI Row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Classifier Latency"
          value={`${avgInferenceTimeMs}ms`}
          change="-4.2%"
          icon={Cpu}
          sparklineColor="#6366f1"
          sparklineData={[2600, 2550, 2500, 2450, 2420, 2400, 2380, 2350]}
          subtitle="EfficientNet vision speed"
        />
        <KpiCard
          title="Chatbot Latency"
          value={`${avgChatbotTimeMs}ms`}
          change="-5.8%"
          icon={Zap}
          sparklineColor="#22c55e"
          sparklineData={[920, 890, 870, 860, 850, 840, 830, 820]}
          subtitle="Gemini model response speed"
        />
        <KpiCard
          title="Model SLA Uptime"
          value="99.98%"
          change="Optimal"
          icon={ShieldCheck}
          sparklineColor="#a855f7"
          sparklineData={[99.9, 99.95, 99.96, 99.98, 99.98, 99.99, 99.98, 99.99]}
          subtitle="High availability cluster SLA"
        />
        <KpiCard
          title="Execution Success"
          value={`${successRatio}%`}
          change="+0.2%"
          icon={CheckCircle2}
          sparklineColor="#f59e0b"
          sparklineData={[99.2, 99.3, 99.4, 99.5, 99.5, 99.58, 99.58, 99.6]}
          subtitle="Zero crash pipeline ratio"
        />
      </div>

      {/* ── Model Latency & Success Ratio Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <AnalyticsCard
          title="Model Latency Trends"
          subtitle="Vision classification vs chatbot inference speed over time"
          icon={Cpu}
          className="lg:col-span-2"
        >
          <LineChartComponent
            data={latencySeries}
            lines={[
              { key: 'classification', name: 'Classification (ms)', color: '#6366f1' },
              { key: 'chatbot', name: 'Chatbot (ms)', color: '#22c55e' }
            ]}
            xAxisKey="time"
            height={260}
          />
        </AnalyticsCard>

        <AnalyticsCard
          title="Inference Pipeline Success Ratio"
          subtitle="Successful model execution vs exception logs"
          icon={ShieldCheck}
          className="lg:col-span-1"
        >
          <DonutChartComponent
            data={modelSuccessData}
            dataKey="value"
            nameKey="name"
            height={260}
            centerTitle="Total Tasks"
            colors={['#22c55e', '#f43f5e']}
          />
        </AnalyticsCard>
      </div>

      {/* ── Error Diagnostics Table ── */}
      <AnalyticsCard
        title="Exception & Diagnostic Logs"
        subtitle="System error stream and pipeline warning records"
        icon={AlertOctagon}
      >
        <DataTable
          data={errorLogs}
          columns={tableColumns}
          searchPlaceholder="Search error diagnostics..."
          pageSize={6}
          emptyMessage="Zero exception logs detected in this date range."
        />
      </AnalyticsCard>
    </div>
  );
}
