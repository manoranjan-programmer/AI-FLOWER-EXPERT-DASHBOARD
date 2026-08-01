import React from 'react';
import { 
  Users, 
  Camera, 
  Target, 
  UserCheck, 
  Flower2, 
  Bot, 
  TrendingUp, 
  ShieldCheck 
} from 'lucide-react';

export default function ExecutiveKpiCards({ kpis = {} }) {
  const {
    totalRegisteredUsers = 0,
    totalFlowerIdentifications = 0,
    totalImageUploads = 0,
    avgAccuracy = 0,
    activeBotanistsToday = 0,
    activeUsersToday = 0,
    mostIdentifiedFlower = 'N/A',
    totalAiResponses = 0
  } = kpis;

  const identificationsCount = totalFlowerIdentifications || totalImageUploads || 0;

  const cards = [
    {
      title: 'Total Registered Users',
      value: totalRegisteredUsers.toLocaleString(),
      subtitle: 'Documents in Users collection',
      icon: Users,
      badge: 'Live MongoDB',
      isPositive: true,
      iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200'
    },
    {
      title: 'Total Flower Identifications',
      value: identificationsCount.toLocaleString(),
      subtitle: 'Records in Flower_Search_History',
      icon: Camera,
      badge: 'Predictions',
      isPositive: true,
      iconBg: 'bg-blue-50 text-blue-600 border-blue-100',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      title: 'Average Classifier Accuracy',
      value: `${avgAccuracy}%`,
      subtitle: 'Mean model confidence score',
      icon: Target,
      badge: '+1.5%',
      isPositive: true,
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      title: 'Active Botanists Today',
      value: activeBotanistsToday.toLocaleString(),
      subtitle: activeUsersToday > 0 ? `${activeUsersToday} total active users today` : 'Botanists active today',
      icon: UserCheck,
      badge: 'Active Today',
      isPositive: true,
      iconBg: 'bg-teal-50 text-teal-600 border-teal-100',
      badgeBg: 'bg-teal-50 text-teal-700 border-teal-200'
    },
    {
      title: 'Top Identified Species',
      value: mostIdentifiedFlower,
      subtitle: 'Most frequent flower prediction',
      icon: Flower2,
      badge: 'Top Species',
      isPositive: true,
      iconBg: 'bg-amber-50 text-amber-600 border-amber-100',
      badgeBg: 'bg-amber-50 text-amber-700 border-amber-200'
    },
    {
      title: 'Total AI Chat Responses',
      value: totalAiResponses.toLocaleString(),
      subtitle: 'Botanical AI turn interactions',
      icon: Bot,
      badge: 'Engagement',
      isPositive: true,
      iconBg: 'bg-violet-50 text-violet-600 border-violet-100',
      badgeBg: 'bg-blue-50 text-blue-700 border-blue-200'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="saas-card p-5 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  {card.title}
                </span>
                <div className="text-2xl font-black text-gray-900 tracking-tight capitalize">
                  {card.value}
                </div>
              </div>

              <div className={`p-3 rounded-xl border ${card.iconBg}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="text-gray-500 text-[11px] font-medium truncate max-w-[170px]">
                {card.subtitle}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 ${card.badgeBg}`}>
                {card.isPositive && <TrendingUp className="w-3 h-3 text-emerald-600" />}
                <span>{card.badge}</span>
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
