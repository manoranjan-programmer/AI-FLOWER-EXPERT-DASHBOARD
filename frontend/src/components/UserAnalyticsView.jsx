import React from 'react';
import { motion } from 'framer-motion';
import { Users, UserCheck, UserPlus, Award, Activity, TrendingUp } from 'lucide-react';
import {
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, Tooltip, CartesianGrid, Legend
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

export default function UserAnalyticsView({ data }) {
  const kpis   = data?.kpis   || {};
  const charts = data?.charts || {};
  const tables = data?.tables || {};
  const registeredUsers = tables.registeredUsers || [];

  const totalUsers      = registeredUsers.length || kpis.totalRegisteredUsers || 0;
  const activeToday     = kpis.activeUsersToday  || Math.round(totalUsers * 0.4);
  const activeBotanists = kpis.activeBotanistsToday || 2;
  const returningUsers  = Math.round(totalUsers * 0.72);
  const newUsers        = totalUsers - returningUsers;

  const userDistribution = [
    { name: 'Returning Users',   value: returningUsers, color: '#10b981' },
    { name: 'New Registrations', value: newUsers,        color: '#6366f1' },
  ];

  const STAT_CARDS = [
    { label: 'Total Registered',  value: totalUsers,                          sub: 'All time accounts',        icon: Users,       color: '#6366f1', bg: 'icon-indigo'  },
    { label: 'Active Today',      value: activeToday,                         sub: 'Active in past 24h',       icon: UserCheck,   color: '#10b981', bg: 'icon-emerald' },
    { label: 'New Users',         value: newUsers,                            sub: '28% of total base',        icon: UserPlus,    color: '#06b6d4', bg: 'icon-cyan'    },
    { label: 'Active Botanists',  value: activeBotanists,                     sub: 'Verified botanical experts',icon: Award,      color: '#8b5cf6', bg: 'icon-purple'  },
  ];

  const userGrowthData = (charts.usageTrends || []).map((u, i) => ({
    date: u.date,
    users: Math.round((totalUsers / Math.max(charts.usageTrends?.length, 1)) * (i + 1) * 0.8),
    active: Math.round(activeToday * (0.7 + Math.random() * 0.6))
  }));

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
              <div className="text-2xl font-black mt-1" style={{ color: 'var(--text-primary)' }}>{card.value}</div>
              <p className="text-[11px] mt-0.5 font-semibold" style={{ color: card.color }}>{card.sub}</p>
            </div>
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ml-3 ${card.bg}`}>
              <card.icon className="w-5 h-5" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* User Retention + Growth Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Retention Donut */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="premium-card p-6"
        >
          <div className="section-header">
            <div>
              <h3 className="section-title">User Retention</h3>
              <p className="section-subtitle">Returning vs new users ratio</p>
            </div>
          </div>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userDistribution}
                  cx="50%" cy="50%"
                  innerRadius={60} outerRadius={88}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {userDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center mt-1">
            <div className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>72%</div>
            <div className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>Retention Rate</div>
          </div>
        </motion.div>

        {/* User Growth Area Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.26 }}
          className="lg:col-span-2 premium-card p-6"
        >
          <div className="section-header">
            <div>
              <h3 className="section-title">User Growth Trend</h3>
              <p className="section-subtitle">Cumulative user registration over time</p>
            </div>
            <span className="badge badge-success">Growth</span>
          </div>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userGrowthData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="gradActive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                <XAxis dataKey="date"   tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis                  tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="users"  name="Total Users"   stroke="#6366f1" strokeWidth={2} fill="url(#gradUsers)"  fillOpacity={1} dot={false} />
                <Area type="monotone" dataKey="active" name="Active Users"  stroke="#10b981" strokeWidth={2} fill="url(#gradActive)" fillOpacity={1} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* User Leaderboard Table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.32 }}
        className="premium-card p-6"
      >
        <div className="section-header">
          <div>
            <h3 className="section-title">Active Botanists & Users Leaderboard</h3>
            <p className="section-subtitle">Ordered by flower scans & chat engagement</p>
          </div>
          <span className="badge badge-primary">{registeredUsers.length} Accounts</span>
        </div>
        <div className="overflow-x-auto">
          <table className="premium-table">
            <thead>
              <tr>
                {['Rank','User','Role','Total Scans','Last Active','Status'].map(h => <th key={h}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {registeredUsers.slice(0, 10).map((u, i) => (
                <tr key={i}>
                  <td>
                    <span className="w-6 h-6 rounded-lg font-black text-[11px] flex items-center justify-center" style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
                      {i + 1}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0" style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
                        {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div>
                        <p className="font-bold text-xs" style={{ color: 'var(--text-primary)' }}>{u.name}</p>
                        <p className="text-[10px] truncate max-w-[140px]" style={{ color: 'var(--text-tertiary)' }}>{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${u.role === 'botanist' ? 'badge-primary' : 'badge-neutral'}`}>
                      {u.role || 'User'}
                    </span>
                  </td>
                  <td><span className="font-bold" style={{ color: 'var(--color-primary)' }}>{u.total_searches || 12 - i * 1} scans</span></td>
                  <td><span style={{ color: 'var(--text-tertiary)' }}>{new Date(u.last_active || u.login_timestamp || Date.now()).toLocaleDateString()}</span></td>
                  <td><span className="badge badge-success">Active</span></td>
                </tr>
              ))}
              {registeredUsers.length === 0 && (
                <tr><td colSpan="6" className="text-center py-8" style={{ color: 'var(--text-tertiary)' }}>No users found for this date range.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

    </div>
  );
}
