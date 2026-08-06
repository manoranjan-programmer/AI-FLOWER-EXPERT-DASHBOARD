import React from 'react';

export function SkeletonCard() {
  return (
    <div className="stat-card space-y-3" style={{ minHeight: 148 }}>
      <div className="flex items-start justify-between">
        <div className="skeleton h-3 w-24 rounded-full" />
        <div className="skeleton w-9 h-9 rounded-xl" />
      </div>
      <div className="skeleton h-7 w-20 rounded-lg" />
      <div className="skeleton h-2.5 w-16 rounded-full" />
      <div className="skeleton h-10 w-full rounded-lg mt-2" />
    </div>
  );
}

export function SkeletonChart({ height = 280 }) {
  return (
    <div className="premium-card p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="space-y-2">
          <div className="skeleton h-4 w-40 rounded-full" />
          <div className="skeleton h-3 w-56 rounded-full" />
        </div>
        <div className="skeleton h-6 w-16 rounded-full" />
      </div>
      <div className="skeleton rounded-xl" style={{ height }} />
    </div>
  );
}

export function SkeletonTable({ rows = 5 }) {
  return (
    <div className="premium-card p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="skeleton h-4 w-36 rounded-full" />
        <div className="skeleton h-7 w-24 rounded-xl" />
      </div>
      <div className="space-y-3">
        {/* Header */}
        <div className="flex gap-4 pb-2" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="skeleton h-3 w-16 rounded-full" />
          <div className="skeleton h-3 w-24 rounded-full" />
          <div className="skeleton h-3 w-20 rounded-full" />
          <div className="skeleton h-3 w-14 rounded-full ml-auto" />
        </div>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 py-1">
            <div className="skeleton h-3 w-12 rounded-full" />
            <div className="skeleton h-3 w-32 rounded-full" />
            <div className="skeleton h-3 w-20 rounded-full" />
            <div className="skeleton h-5 w-14 rounded-full ml-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}
