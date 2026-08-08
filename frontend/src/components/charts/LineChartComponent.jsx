import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl bg-white/95 dark:bg-slate-950/95 border border-slate-200 dark:border-slate-800 p-3 shadow-2xl backdrop-blur-md text-xs space-y-1.5 min-w-[140px]">
      <p className="font-bold text-slate-800 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800/80 pb-1">{label}</p>
      {payload.map((entry, idx) => (
        <div key={idx} className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
            {entry.name}
          </span>
          <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">
            {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function LineChartComponent({
  data = [],
  lines = [{ key: 'latency', name: 'Latency (ms)', color: '#06b6d4' }],
  xAxisKey = 'time',
  height = 300,
  showGrid = true,
  showLegend = true
}) {
  const safeData = (data || []);

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={safeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} vertical={false} />}

          <XAxis
            dataKey={xAxisKey}
            stroke="#64748b"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            dy={8}
          />
          <YAxis
            stroke="#64748b"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            dx={-5}
          />

          <Tooltip content={<CustomTooltip />} />

          {showLegend && (
            <Legend
              verticalAlign="top"
              align="right"
              wrapperStyle={{ paddingBottom: '12px', fontSize: '11px', color: '#94a3b8' }}
            />
          )}

          {lines.map((l) => (
            <Line
              key={l.key}
              type="monotone"
              dataKey={l.key}
              name={l.name || l.key}
              stroke={l.color || '#06b6d4'}
              strokeWidth={2.5}
              dot={{ r: 3, fill: l.color || '#06b6d4' }}
              activeDot={{ r: 6, stroke: '#090d16', strokeWidth: 2 }}
              isAnimationActive={true}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
