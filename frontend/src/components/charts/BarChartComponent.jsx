import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  Legend
} from 'recharts';

const DEFAULT_COLORS = ['#22c55e', '#6366f1', '#f59e0b', '#06b6d4', '#f43f5e', '#a855f7', '#34d399', '#84cc16'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl bg-white/95 dark:bg-slate-950/95 border border-slate-200 dark:border-slate-800 p-3 shadow-2xl backdrop-blur-md text-xs space-y-1.5 min-w-[140px]">
      <p className="font-bold text-slate-800 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800/80 pb-1">{label}</p>
      {payload.map((entry, idx) => (
        <div key={idx} className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: entry.color || entry.fill }} />
            {entry.name || 'Count'}
          </span>
          <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">
            {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function BarChartComponent({
  data = [],
  dataKey = 'value',
  xAxisKey = 'name',
  height = 300,
  layout = 'horizontal',
  colors = DEFAULT_COLORS,
  barRadius = [6, 6, 0, 0]
}) {
  const safeData = (data || []);
  const isVertical = layout === 'vertical';

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={safeData}
          layout={layout}
          margin={{ top: 10, right: 10, left: isVertical ? 20 : -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} vertical={isVertical} horizontal={!isVertical} />

          {isVertical ? (
            <>
              <XAxis type="number" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey={xAxisKey} stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} width={80} />
            </>
          ) : (
            <>
              <XAxis dataKey={xAxisKey} stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} dy={8} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} dx={-5} />
            </>
          )}

          <Tooltip content={<CustomTooltip />} />

          <Bar
            dataKey={dataKey}
            radius={isVertical ? [0, 6, 6, 0] : barRadius}
            isAnimationActive={true}
          >
            {safeData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
