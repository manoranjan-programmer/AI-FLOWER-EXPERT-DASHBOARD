import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
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
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
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

export default function AreaChartComponent({
  data = [],
  dataKeys = [{ key: 'value', name: 'Volume', color: '#22c55e' }],
  xAxisKey = 'name',
  height = 300,
  showGrid = true,
  showLegend = true
}) {
  const safeData = (data || []);

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={safeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            {dataKeys.map((dk, i) => {
              const color = dk.color || '#22c55e';
              const gradId = `area-grad-${dk.key}-${i}`;
              return (
                <linearGradient key={gradId} id={gradId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={color} stopOpacity={0.0} />
                </linearGradient>
              );
            })}
          </defs>

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

          {dataKeys.map((dk, i) => {
            const color = dk.color || '#22c55e';
            const gradId = `area-grad-${dk.key}-${i}`;
            return (
              <Area
                key={dk.key}
                type="monotone"
                dataKey={dk.key}
                name={dk.name || dk.key}
                stroke={color}
                strokeWidth={2.5}
                fillOpacity={1}
                fill={`url(#${gradId})`}
                isAnimationActive={true}
              />
            );
          })}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
