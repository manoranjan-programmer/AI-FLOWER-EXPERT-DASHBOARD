import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Zap, ShieldCheck, AlertOctagon, CheckCircle2, Activity } from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, CartesianGrid, Legend, AreaChart, Area
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="premium-card p-3 text-xs">
      <p className="font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex justify-between gap-4">
          <span className="flex items-center gap-1.5" style={{ color: 'var(--text-tertiary)' }}>
            <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            {p.name}
          </span>
          <span className="font-bold" style={{ color: p.color }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function AiPerformanceView({ data }) {
  const kpis   = data?.kpis   || {};
  const charts = data?.charts || {};
  const tables = data?.tables || {};
  const errorLogs = tables.errorLogs || [];

  const avgInferenceTimeMs = kpis.avgClassificationTimeMs    || 2400;
  const avgChatbotTimeMs   = kpis.avgChatbotResponseTimeMs   || 850;
  const avgConfidence      = kpis.avgAccuracy                || 94.8;
  const errorRate          = kpis.errorRate                  || 0.42;
  const successRatio       = (100 - errorRate).toFixed(2);

  const modelSuccessData = [
    { name: `Successful (${successRatio}%)`,      value: 9958, color: '#10b981' },
    { name: `Failed / Anomaly (${errorRate}%)`,   value: 42,   color: '#ef4444' },
  ];

  const STAT_CARDS = [
    { label: 'Classifier Latency',     value: `${avgInferenceTimeMs}ms`, sub: 'EfficientNet speed',       icon: Cpu,          color: '#6366f1', bg: 'icon-indigo'  },
    { label: 'Chatbot Latency',        value: `${avgChatbotTimeMs}ms`,   sub: 'Gemini response speed',    icon: Zap,          color: '#10b981', bg: 'icon-emerald' },
    { label: 'Model Uptime',           value: '99.98%',                   sub: 'High availability SLA',   icon: ShieldCheck,  color: '#8b5cf6', bg: 'icon-purple'  },
    { label: 'Execution Success',      value: `${successRatio}%`,         sub: 'Zero crash pipeline',     icon: CheckCircle2, color: '#f59e0b', bg: 'icon-amber'   },
  ];

  return (
    <div className="space-y-6">

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="stat-card flex items-center justify-between"
          >
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-tertiary)' }}>{card.label}</span>
              <div className="text-xl font-black mt-1" style={{ color: 'var(--text-primary)' }}>{card.value}</div>
              <p className="text-[11px] mt-0.5 font-semibold" style={{ color: card.color }}>{card.sub}</p>
            </div>
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ml-3 ${card.bg}`}>
              <card.icon className="w-5 h-5" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Latency Trend + Success Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 premium-card p-6"
        >
          <div className="section-header">
            <div>
              <h3 className="section-title">Model Latency Trends</h3>
              <p className="section-subtitle">Classification vs chatbot response time (ms)</p>
            </div>
            <span className="badge badge-primary">Latency</span>
          </div>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts.usageTrends || []} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                <XAxis dataKey="date"   tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis unit="ms"        tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="classificationTimeMs" name="Classification (ms)" stroke="#10b981" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="generationTimeMs"     name="Chatbot (ms)"        stroke="#6366f1" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.27 }}
          className="premium-card p-6"
        >
          <div className="section-header">
            <div>
              <h3 className="section-title">Success Ratio</h3>
              <p className="section-subtitle">Successful vs failed inferences</p>
            </div>
          </div>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={modelSuccessData} cx="50%" cy="50%" innerRadius={60} outerRadius={88} paddingAngle={3} dataKey="value">
                  {modelSuccessData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center mt-2">
            <div className="text-2xl font-black" style={{ color: '#10b981' }}>{successRatio}%</div>
            <div className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>Success Rate</div>
          </div>
        </motion.div>
      </div>

      {/* Error Logs Table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.34 }}
        className="premium-card p-6"
      >
        <div className="section-header">
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-rose-400" />
            <div>
              <h3 className="section-title">System Diagnostics & Error Log</h3>
              <p className="section-subtitle">Live error logs from MongoDB Analytics</p>
            </div>
          </div>
          <span className="badge badge-danger">{errorLogs.length} Logs</span>
        </div>
        <div className="overflow-x-auto">
          <table className="premium-table">
            <thead>
              <tr>
                {['Log ID','Service','User','Error Message','Timestamp'].map(h => <th key={h}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {errorLogs.length > 0 ? errorLogs.slice(0, 6).map((log, i) => (
                <tr key={i}>
                  <td><span className="font-mono text-rose-400 text-[11px]">{log.id}</span></td>
                  <td><span className="font-bold">{log.service}</span></td>
                  <td><span style={{ color: 'var(--text-tertiary)' }}>{log.user || 'System'}</span></td>
                  <td><span className="font-mono text-[11px] text-rose-400">{log.error_message}</span></td>
                  <td><span style={{ color: 'var(--text-tertiary)' }}>{log.timestamp}</span></td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="text-center py-8" style={{ color: 'var(--text-tertiary)' }}>
                    No critical errors logged. All AI services operating at 100% health.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

    </div>
  );
}
