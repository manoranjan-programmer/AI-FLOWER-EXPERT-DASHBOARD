import React from 'react';
import { 
  Camera, 
  Target, 
  Bot, 
  Flower2, 
  AlertTriangle, 
  HelpCircle, 
  TrendingUp, 
  BookOpen 
} from 'lucide-react';

export default function ExecutiveKpiCards({ kpis = {} }) {
  const {
    totalImageUploads = 0,
    avgAccuracy = 0,
    totalAiResponses = 0,
    mostIdentifiedFlower = 'N/A',
    toxicPlantRatio = 0,
    avgQuestionsPerSession = 0,
    totalKnowledgeArticles = 0
  } = kpis;

  const cards = [
    {
      title: 'Total Image Uploads',
      value: totalImageUploads.toLocaleString(),
      subtitle: 'Sessions in Flower_Search_History',
      icon: Camera,
      badge: '+11.8%',
      isPositive: true,
      iconBg: 'bg-blue-50 text-blue-600 border-blue-100',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      title: 'Average AI Accuracy',
      value: `${avgAccuracy}%`,
      subtitle: 'Mean classification certainty',
      icon: Target,
      badge: '+1.5%',
      isPositive: true,
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      title: 'Total AI Responses',
      value: totalAiResponses.toLocaleString(),
      subtitle: 'Generated botanical turns',
      icon: Bot,
      badge: '+17.9%',
      isPositive: true,
      iconBg: 'bg-violet-50 text-violet-600 border-violet-100',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      title: 'Most Identified Flower',
      value: mostIdentifiedFlower,
      subtitle: 'Highest frequency species',
      icon: Flower2,
      badge: 'Top Species',
      isPositive: true,
      iconBg: 'bg-amber-50 text-amber-600 border-amber-100',
      badgeBg: 'bg-amber-50 text-amber-700 border-amber-200'
    },
    {
      title: 'Toxic Plant Upload Ratio',
      value: `${toxicPlantRatio}%`,
      subtitle: 'Flagged with toxicity warnings',
      icon: AlertTriangle,
      badge: toxicPlantRatio > 50 ? 'Warning' : 'Normal',
      isPositive: false,
      iconBg: 'bg-rose-50 text-rose-600 border-rose-100',
      badgeBg: toxicPlantRatio > 50 ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-gray-100 text-gray-700 border-gray-200'
    },
    {
      title: 'User Questions / Session',
      value: avgQuestionsPerSession,
      subtitle: 'Avg follow-ups per identification',
      icon: HelpCircle,
      badge: 'Engagement',
      isPositive: true,
      iconBg: 'bg-cyan-50 text-cyan-600 border-cyan-100',
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
                <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
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
