import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from 'recharts';

const DEFAULT_COLORS = ['#22c55e', '#6366f1', '#f59e0b', '#06b6d4', '#f43f5e', '#a855f7', '#34d399', '#84cc16'];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const data = payload[0];
  return (
    <div className="rounded-xl bg-white/95 dark:bg-slate-950/95 border border-slate-200 dark:border-slate-800 p-3 shadow-2xl backdrop-blur-md text-xs space-y-1">
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }} />
        <span className="font-bold text-slate-800 dark:text-slate-200">{data.name}</span>
      </div>
      <p className="font-mono text-emerald-600 dark:text-emerald-400 font-bold text-sm">
        {typeof data.value === 'number' ? data.value.toLocaleString() : data.value}
        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal ml-1">
          ({((data.percent || 0) * 100).toFixed(1)}%)
        </span>
      </p>
    </div>
  );
};

export default function DonutChartComponent({
  data = [],
  dataKey = 'value',
  nameKey = 'name',
  height = 300,
  colors = DEFAULT_COLORS,
  centerTitle = 'Total',
  centerValue = null
}) {
  const safeData = (data || []);
  const totalValue = centerValue !== null
    ? centerValue
    : safeData.reduce((acc, curr) => acc + (parseFloat(curr[dataKey]) || 0), 0);

  return (
    <div className="relative" style={{ width: '100%', height }}>
      {/* Center Metric Label Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-6">
        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
          {centerTitle}
        </span>
        <span className="text-xl font-black text-slate-900 dark:text-slate-100 font-mono tracking-tight">
          {typeof totalValue === 'number' ? totalValue.toLocaleString() : totalValue}
        </span>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip content={<CustomTooltip />} />

          <Legend
            verticalAlign="bottom"
            align="center"
            iconType="circle"
            wrapperStyle={{ paddingTop: '8px', fontSize: '11px', color: '#94a3b8' }}
          />

          <Pie
            data={safeData}
            cx="50%"
            cy="45%"
            innerRadius="60%"
            outerRadius="80%"
            paddingAngle={4}
            dataKey={dataKey}
            nameKey={nameKey}
            isAnimationActive={true}
          >
            {safeData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
                stroke="#0f172a"
                strokeWidth={2}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
