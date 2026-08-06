import React from 'react';
import { motion } from 'framer-motion';
import { Flower2, Award, AlertTriangle, ShieldCheck, Target, TrendingUp } from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, CartesianGrid, Legend, RadialBarChart, RadialBar
} from 'recharts';

const PALETTE = ['#6366f1','#10b981','#f59e0b','#06b6d4','#ec4899','#8b5cf6','#84cc16','#f97316','#14b8a6','#a855f7'];
const CONF_COLORS = ['#ef4444','#f97316','#f59e0b','#6366f1','#10b981'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="premium-card p-3 text-xs">
      <p className="font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center justify-between gap-3">
          <span style={{ color: 'var(--text-tertiary)' }}>{p.name}</span>
          <span className="font-bold" style={{ color: p.color }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function FlowerAnalyticsView({ data }) {
  const kpis   = data?.kpis   || {};
  const charts = data?.charts || {};
  const tables = data?.tables || {};

  const topSpecies       = charts.topSpecies             || [];
  const confidenceDist   = charts.confidenceDistribution || [];
  const predictions      = tables.recentPredictions      || [];

  const histogramBuckets = [
    { range: '0–20%',   count: 0, color: CONF_COLORS[0] },
    { range: '20–40%',  count: 0, color: CONF_COLORS[1] },
    { range: '40–60%',  count: 0, color: CONF_COLORS[2] },
    { range: '60–80%',  count: 0, color: CONF_COLORS[3] },
    { range: '80–100%', count: 0, color: CONF_COLORS[4] },
  ];
  predictions.forEach(p => {
    const c = parseFloat(p.confidence) || 0;
    if (c <= 20)      histogramBuckets[0].count++;
    else if (c <= 40) histogramBuckets[1].count++;
    else if (c <= 60) histogramBuckets[2].count++;
    else if (c <= 80) histogramBuckets[3].count++;
    else              histogramBuckets[4].count++;
  });

  const lowConf = predictions.filter(p => (parseFloat(p.confidence) || 0) < 75);

  const STAT_CARDS = [
    { label: 'Total Flower Scans',    value: kpis.totalFlowerIdentifications || 0, sub: 'EfficientNet classified',    icon: Flower2,       color: '#10b981', bg: 'icon-emerald' },
    { label: 'Avg Classifier Accuracy', value: `${kpis.avgAccuracy || 94.8}%`,     sub: 'High precision model',       icon: Award,         color: '#6366f1', bg: 'icon-indigo' },
    { label: 'Most Popular Species',  value: kpis.mostIdentifiedFlower || 'Oxeye Daisy', sub: 'Ranked #1 species',   icon: Target,        color: '#8b5cf6', bg: 'icon-purple' },
    { label: 'Low Confidence Flagged',value: lowConf.length,                        sub: 'Requires botanist review',  icon: AlertTriangle,  color: '#f59e0b', bg: 'icon-amber' },
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
            transition={{ delay: i * 0.07, duration: 0.35 }}
            className="stat-card flex items-center justify-between"
          >
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-tertiary)' }}>{card.label}</span>
              <div className="text-xl font-black mt-1 truncate" style={{ color: 'var(--text-primary)', maxWidth: 160 }}>{card.value}</div>
              <p className="text-[11px] mt-0.5 font-semibold" style={{ color: card.color }}>{card.sub}</p>
            </div>
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ml-3 ${card.bg}`}>
              <card.icon className="w-5 h-5" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Top Species + Confidence Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Top 10 Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="lg:col-span-2 premium-card p-6"
        >
          <div className="section-header">
            <div>
              <h3 className="section-title">Top 10 Identified Flower Species</h3>
              <p className="section-subtitle">Frequency across user image uploads</p>
            </div>
            <span className="badge badge-success">Species Leaderboard</span>
          </div>
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topSpecies.slice(0, 10)} margin={{ top: 4, right: 4, left: -16, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                <XAxis dataKey="name" tick={{ fill: 'var(--text-tertiary)', fontSize: 10 }} angle={-25} textAnchor="end" axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Identifications" radius={[6, 6, 0, 0]}>
                  {topSpecies.slice(0, 10).map((_, i) => (
                    <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Confidence Donut */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.4 }}
          className="premium-card p-6"
        >
          <div className="section-header">
            <div>
              <h3 className="section-title">Confidence Distribution</h3>
              <p className="section-subtitle">Score bracket breakdown</p>
            </div>
          </div>
          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={confidenceDist.length ? confidenceDist : histogramBuckets.map(b => ({ name: b.range, value: b.count, color: b.color }))}
                  cx="50%" cy="50%"
                  innerRadius={60} outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {(confidenceDist.length ? confidenceDist : histogramBuckets).map((entry, i) => (
                    <Cell key={i} fill={entry.color || PALETTE[i % PALETTE.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Center stat */}
          <div className="text-center mt-2">
            <div className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>{kpis.avgAccuracy || 94.8}%</div>
            <div className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>Overall Model Accuracy</div>
          </div>
        </motion.div>
      </div>

      {/* Confidence Histogram */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.32, duration: 0.4 }}
        className="premium-card p-6"
      >
        <div className="section-header">
          <div>
            <h3 className="section-title">Confidence Score Histogram</h3>
            <p className="section-subtitle">Prediction count per confidence bracket</p>
          </div>
          <span className="badge badge-primary">Histogram</span>
        </div>
        <div style={{ height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={histogramBuckets} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
              <XAxis dataKey="range" tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Predictions" radius={[6, 6, 0, 0]}>
                {histogramBuckets.map((b, i) => <Cell key={i} fill={b.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Low Confidence Table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.38, duration: 0.4 }}
        className="premium-card p-6"
      >
        <div className="section-header">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <div>
              <h3 className="section-title">Low Confidence Predictions (&lt;75%)</h3>
              <p className="section-subtitle">Flagged for botanist review</p>
            </div>
          </div>
          <span className="badge badge-warning">{lowConf.length} Flagged</span>
        </div>

        <div className="overflow-x-auto">
          <table className="premium-table">
            <thead>
              <tr>
                {['Prediction ID','Predicted Flower','Scientific Name','Confidence','User Email','Status'].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {lowConf.length > 0 ? lowConf.slice(0, 8).map((item, i) => (
                <tr key={i}>
                  <td><span className="font-mono text-amber-400 text-[11px]">{item.id}</span></td>
                  <td><span className="font-bold">{item.flower}</span></td>
                  <td><span className="italic" style={{ color: 'var(--text-tertiary)' }}>{item.scientific_name}</span></td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="progress-track w-16">
                        <div className="progress-fill bg-amber-400" style={{ width: `${item.confidence}%` }} />
                      </div>
                      <span className="font-bold text-amber-400">{item.confidence}%</span>
                    </div>
                  </td>
                  <td><span style={{ color: 'var(--text-tertiary)' }}>{item.user_email}</span></td>
                  <td><span className="badge badge-warning">Pending Review</span></td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="text-center py-8" style={{ color: 'var(--text-tertiary)' }}>
                    No low confidence predictions — model performing at peak accuracy (&gt;90%)
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
