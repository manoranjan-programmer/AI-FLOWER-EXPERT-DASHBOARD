import React from 'react';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';

export default function Sparkline({
  data = [],
  color = '#22c55e',
  height = 36
}) {
  // Fallback sample sparkline data if empty
  const chartData = (data && data.length > 0)
    ? data.map((d, i) => (typeof d === 'number' ? { value: d } : { value: d.value ?? d.count ?? 10 }))
    : [
        { value: 12 }, { value: 18 }, { value: 14 }, { value: 25 },
        { value: 20 }, { value: 32 }, { value: 28 }, { value: 40 }
      ];

  const gradientId = `sparkline-gradient-${color.replace('#', '')}`;

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 2, right: 0, left: 0, bottom: 2 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.4} />
              <stop offset="100%" stopColor={color} stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            fillOpacity={1}
            fill={`url(#${gradientId})`}
            isAnimationActive={true}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
