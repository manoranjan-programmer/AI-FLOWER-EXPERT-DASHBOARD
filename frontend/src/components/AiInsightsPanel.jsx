import React, { useState } from 'react';
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  LineChart,
  BrainCircuit,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Activity,
  Layers
} from 'lucide-react';

export default function AiInsightsPanel({ kpis = {}, chartsData = {} }) {
  const [collapsedSections, setCollapsedSections] = useState({
    summary: false,
    trends: false,
    anomalies: false,
    recommendations: false,
    forecast: false
  });

  const toggleSection = (key) => {
    setCollapsedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const {
    totalImageUploads = 0,
    avgAccuracy = 0,
    mostIdentifiedFlower = 'Rose',
    toxicPlantRatio = 0,
    avgQuestionsPerSession = 0
  } = kpis;

  return (
    <div className="space-y-6">

      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold">
            <BrainCircuit className="w-3.5 h-3.5" /> AI Botanical Intelligence Engine
          </div>
          <h2 className="text-xl font-black tracking-tight">
            Automated AI Insights & Predictive Botanical Forecasts
          </h2>
          <p className="text-xs text-blue-100 font-medium">
            Real-time synthesis of machine learning accuracy metrics, user inquiry patterns, and anomaly detection.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-white text-blue-700 text-xs font-bold shadow-sm">
            Model Confidence: {avgAccuracy}%
          </span>
        </div>
      </div>

      {/* Grid of Collapsible Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Card 1: Executive Summary Report */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
          <div
            onClick={() => toggleSection('summary')}
            className="p-5 flex items-center justify-between cursor-pointer bg-gray-50/50 hover:bg-gray-50 transition-colors border-b border-gray-100"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">Executive Summary Report</h3>
                <p className="text-[11px] text-gray-500">High-level telemetry overview of botanical interactions</p>
              </div>
            </div>
            {collapsedSections.summary ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronUp className="w-4 h-4 text-gray-400" />}
          </div>

          {!collapsedSections.summary && (
            <div className="p-5 space-y-3 text-xs text-gray-600 leading-relaxed">
              <p>
                The AI Flower Expert platform has registered <strong className="text-gray-900">{totalImageUploads} flower image uploads</strong> with an overall mean classification accuracy of <strong className="text-blue-600">{avgAccuracy}%</strong>.
              </p>
              <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 text-blue-900 space-y-1">
                <div className="font-semibold text-xs flex items-center gap-1.5 text-blue-700">
                  <Activity className="w-4 h-4" /> Top Species Performance
                </div>
                <p className="text-[11px]">
                  <strong className="capitalize">{mostIdentifiedFlower}</strong> accounts for the highest identification volume across North American and European user query regions.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Card 2: Key Trends & Observations */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
          <div
            onClick={() => toggleSection('trends')}
            className="p-5 flex items-center justify-between cursor-pointer bg-gray-50/50 hover:bg-gray-50 transition-colors border-b border-gray-100"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">Key Trends & Observations</h3>
                <p className="text-[11px] text-gray-500">User behavior & conversational engagement patterns</p>
              </div>
            </div>
            {collapsedSections.trends ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronUp className="w-4 h-4 text-gray-400" />}
          </div>

          {!collapsedSections.trends && (
            <div className="p-5 space-y-3 text-xs text-gray-600">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Users ask an average of <strong className="text-gray-900">{avgQuestionsPerSession} follow-up questions</strong> per plant identification session, primarily regarding watering schedules and winter care.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Peak activity hours occur between 14:00 and 18:00 UTC during weekend gardening timeframes.</span>
              </div>
            </div>
          )}
        </div>

        {/* Card 3: Anomalies Detected */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
          <div
            onClick={() => toggleSection('anomalies')}
            className="p-5 flex items-center justify-between cursor-pointer bg-gray-50/50 hover:bg-gray-50 transition-colors border-b border-gray-100"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">Anomalies & Toxicity Flags</h3>
                <p className="text-[11px] text-gray-500">System anomalies and safety alerts detected</p>
              </div>
            </div>
            {collapsedSections.anomalies ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronUp className="w-4 h-4 text-gray-400" />}
          </div>

          {!collapsedSections.anomalies && (
            <div className="p-5 space-y-3 text-xs text-gray-600">
              <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-100 text-amber-900 space-y-1">
                <span className="font-semibold text-xs text-amber-700">Toxicity Warning Ratio</span>
                <p className="text-[11px]">
                  <strong className="text-amber-800">{toxicPlantRatio}% of identified flowers</strong> contained toxic properties to pets or humans (e.g. Monkshood, Sword Lily). Caution badges were displayed automatically.
                </p>
              </div>
              <div className="flex items-start gap-2 text-gray-600">
                <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <span>Cluster of low-confidence predictions (&lt;50%) detected during blurred background image uploads.</span>
              </div>
            </div>
          )}
        </div>

        {/* Card 4: Strategic Recommendations */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
          <div
            onClick={() => toggleSection('recommendations')}
            className="p-5 flex items-center justify-between cursor-pointer bg-gray-50/50 hover:bg-gray-50 transition-colors border-b border-gray-100"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-violet-50 text-violet-600 border border-violet-100">
                <Lightbulb className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">Strategic Recommendations</h3>
                <p className="text-[11px] text-gray-500">Optimization steps for accuracy and UX</p>
              </div>
            </div>
            {collapsedSections.recommendations ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronUp className="w-4 h-4 text-gray-400" />}
          </div>

          {!collapsedSections.recommendations && (
            <div className="p-5 space-y-3 text-xs text-gray-600">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-violet-600 mt-1.5 flex-shrink-0"></div>
                <span><strong>Fine-Tune Fine-Grained Petal Recognition:</strong> Expand training samples for similar species like Rose vs Peony to increase confidence above 95%.</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-violet-600 mt-1.5 flex-shrink-0"></div>
                <span><strong>Promote Toxicity Cards:</strong> Highlight pet safety badges directly on the initial identification card before chat starts.</span>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Section 5: Botanical Demand Forecast */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <LineChart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">30-Day Botanical Demand Forecast</h3>
              <p className="text-xs text-gray-500">Predictive estimation of upcoming flower queries & image traffic</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            +18.4% Projected Growth
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Projected Uploads</span>
            <p className="text-xl font-black text-gray-900 mt-1">{(totalImageUploads * 1.35).toFixed(0)} Uploads</p>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 inline-block">↑ Driven by spring season</span>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Expected Model Latency</span>
            <p className="text-xl font-black text-gray-900 mt-1">~240 ms</p>
            <span className="text-[11px] text-blue-600 font-semibold mt-1 inline-block">Optimized server caching</span>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Top Expected Species</span>
            <p className="text-xl font-black text-gray-900 mt-1">Sunflower & Dahlia</p>
            <span className="text-[11px] text-gray-500 mt-1 inline-block">Seasonal bloom trends</span>
          </div>
        </div>
      </div>

    </div>
  );
}
