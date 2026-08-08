import React from 'react';
import OverviewSection from '../../components/OverviewSection';

export default function ExecutiveOverviewPage({ data, onCardClick }) {
  return (
    <div className="space-y-6">
      <OverviewSection data={data} onCardClick={onCardClick} />
    </div>
  );
}
