import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { Activity, PieChart as PieIcon, BarChart2, Sun, Droplets, Zap, Layers } from 'lucide-react';

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#6366f1', '#14b8a6', '#ef4444', '#84cc16'];

export default function AnalyticsCharts({ chartsData = {} }) {
  const [timelineMetric, setTimelineMetric] = useState('uploads');

  const {
    topSpecies = [],
    confidenceDistribution = [],
    familyDistribution = [],
    sunlightBreakdown = [],
    waterBreakdown = [],
    usageTrends = []
  } = chartsData;

  return (
    <div className="space-y-6">

      {/* Chart 1: Uploads & Botanical Queries Timeline (Daily Search Volume & Activity Trend) */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Daily Search Volume & Activity Trend
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Prediction volume and user search history activity over time (timestamp).
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 rounded-xl bg-gray-100 border border-gray-200 text-xs font-semibold">
            {['uploads', 'chats', 'predictions', 'users'].map(m => (
              <button
                key={m}
                onClick={() => setTimelineMetric(m)}
                className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-all ${
                  timelineMetric === m
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={usageTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
              <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb', color: '#111827', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                itemStyle={{ color: '#2563eb', fontWeight: 'bold' }}
              />
              <Area 
                type="monotone" 
                dataKey={timelineMetric} 
                stroke="#2563eb" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#blueGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2: Top 10 Species & Botanical Family Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Top 10 Identified Flower Species */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
          <div>
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-blue-600" />
              Top Identified Flower Species
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Top 10 identified flowers ranked by search frequency.
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topSpecies} margin={{ top: 10, right: 10, left: -15, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                <XAxis 
                  dataKey="name" 
                  stroke="#64748b" 
                  fontSize={10} 
                  tickLine={false} 
                  angle={-25} 
                  textAnchor="end"
                />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb', borderRadius: '12px' }} />
                <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]}>
                  {topSpecies.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Botanical Family Distribution Pie Chart */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
          <div>
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-600" />
              Botanical Family Distribution
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Breakdown of identified species by botanical family (card.Family).
            </p>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={familyDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {familyDistribution.map((entry, index) => (
                    <Cell key={`cell-fam-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb', borderRadius: '12px' }} />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Row 3: Classifier Confidence Distribution & Plant Care */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Confidence Score Distribution */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
          <div>
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              Classifier Confidence Distribution
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Model accuracy score distribution across search histories.
            </p>
          </div>

          <div className="h-60 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={confidenceDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {confidenceDistribution.map((entry, index) => (
                    <Cell key={`cell-conf-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb', borderRadius: '12px' }} />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sunlight Requirements */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
          <div>
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Sun className="w-5 h-5 text-amber-500" />
              Plant Care: Sunlight Requirements
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Light level preferences for identified flower species.
            </p>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sunlightBreakdown} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb', borderRadius: '12px' }} />
                <Bar dataKey="value" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}
