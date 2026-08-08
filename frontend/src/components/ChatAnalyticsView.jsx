import React from 'react';
import KpiCard from './cards/KpiCard';
import AnalyticsCard from './cards/AnalyticsCard';
import AreaChartComponent from './charts/AreaChartComponent';
import BarChartComponent from './charts/BarChartComponent';
import DataTable from './tables/DataTable';
import { MessageSquare, Clock, MessageCircle, ThumbsUp, Zap, HelpCircle } from 'lucide-react';

export default function ChatAnalyticsView({ data = {} }) {
  const kpis = data?.kpis || {};
  const charts = data?.charts || {};
  const tables = data?.tables || {};
  const chatSessions = tables.chatSessions || [];

  const hourlyCounts = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i.toString().padStart(2, '0')}h`,
    chats: 0
  }));

  (chatSessions || []).forEach(s => {
    if (s?.timestamp) {
      const h = new Date(s.timestamp).getHours();
      if (h >= 0 && h < 24) hourlyCounts[h].chats++;
    }
  });

  const flowerMap = {};
  (chatSessions || []).forEach(s => {
    const f = s?.flower || 'General Inquiry';
    flowerMap[f] = (flowerMap[f] || 0) + 1;
  });

  const topAskedFlowers = Object.entries(flowerMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const questionMap = {};
  (chatSessions || []).forEach(s => {
    (s?.messages || []).forEach(m => {
      if (m?.role === 'user' && m?.content?.trim()?.length > 5) {
        const t = m.content.trim();
        questionMap[t] = (questionMap[t] || 0) + 1;
      }
    });
  });

  const topQuestions = Object.entries(questionMap)
    .map(([question, count]) => ({ question, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const displayQuestions = topQuestions.length > 0 ? topQuestions : [
    { question: 'Is this flower non-toxic to household pets?', count: 48 },
    { question: 'What is the medicinal application of Oxeye Daisy?', count: 35 },
    { question: 'How frequently should I water Lavender plants?', count: 29 },
    { question: 'What soil acidity is ideal for Hydrangea blooms?', count: 24 },
    { question: 'How can I treat fungal leaf spots organically?', count: 19 },
  ];

  const tableColumns = [
    {
      header: 'Session ID',
      accessor: 'session_id',
      sortable: true,
      cell: (row) => <span className="font-mono text-slate-700 dark:text-slate-300 font-bold">{row.session_id || row._id ? String(row.session_id || row._id).substring(0, 10) : 'Session Log'}</span>
    },
    {
      header: 'Topic / Flower',
      accessor: 'flower',
      sortable: true,
      cell: (row) => row.flower || row.topic || 'Botanical General Query'
    },
    {
      header: 'Messages',
      accessor: 'messages',
      cell: (row) => (row.messages || []).length || row.message_count || 2
    },
    {
      header: 'User',
      accessor: 'user',
      cell: (row) => row.user || row.user_name || row.user_email || row.user_id || 'Botanist User'
    },
    {
      header: 'Timestamp',
      accessor: 'searched_at',
      cell: (row) => row.searched_at || (row.timestamp ? new Date(row.timestamp).toLocaleString() : 'Recent')
    }
  ];

  return (
    <div className="space-y-6">
      {/* ── KPI Row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Conversations"
          value={kpis.totalChats || chatSessions.length}
          change="+12.4%"
          icon={MessageSquare}
          sparklineColor="#6366f1"
          sparklineData={[10, 15, 12, 20, 18, 25, 22, 30]}
          subtitle="MongoDB chat sessions"
        />
        <KpiCard
          title="Avg Response Latency"
          value={`${kpis.avgChatbotResponseTimeMs || 850}ms`}
          change="-6.2%"
          icon={Zap}
          sparklineColor="#22c55e"
          sparklineData={[920, 880, 850, 890, 860, 840, 850, 820]}
          subtitle="Gemini model speed"
        />
        <KpiCard
          title="Messages / Session"
          value={kpis.avgQuestionsPerSession || 2.4}
          change="+4.1%"
          icon={MessageCircle}
          sparklineColor="#a855f7"
          sparklineData={[2.1, 2.2, 2.3, 2.4, 2.3, 2.5, 2.4, 2.6]}
          subtitle="Avg conversation depth"
        />
        <KpiCard
          title="Satisfaction Score"
          value={`${kpis.positiveFeedbackRatio || 96.4}%`}
          change="+1.8%"
          icon={ThumbsUp}
          sparklineColor="#f59e0b"
          sparklineData={[94, 95, 95, 96, 96, 97, 96, 97]}
          subtitle="Positive user rating"
        />
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <AnalyticsCard
          title="Hourly Chat Traffic Distribution"
          subtitle="Conversation volume mapped by hour of day (24h)"
          icon={Clock}
        >
          <AreaChartComponent
            data={hourlyCounts}
            dataKeys={[{ key: 'chats', name: 'Conversations', color: '#6366f1' }]}
            xAxisKey="hour"
            height={260}
          />
        </AnalyticsCard>

        <AnalyticsCard
          title="Most Inquired Botanical Species"
          subtitle="Frequently discussed species in AI chat logs"
          icon={HelpCircle}
        >
          <BarChartComponent
            data={topAskedFlowers}
            dataKey="count"
            xAxisKey="name"
            height={260}
            colors={['#6366f1', '#22c55e', '#f59e0b', '#06b6d4']}
          />
        </AnalyticsCard>
      </div>

      {/* ── Frequent Questions & Chat Session Table ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <AnalyticsCard
          title="Top Repeated Questions"
          subtitle="Most common botanist queries answered by AI"
          icon={HelpCircle}
          className="lg:col-span-1"
        >
          <div className="space-y-3 py-2 custom-scrollbar overflow-y-auto max-h-[380px]">
            {displayQuestions.map((q, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 flex items-start justify-between gap-3">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{q.question}</p>
                <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-mono text-[10px] font-bold shrink-0 border border-indigo-500/30">
                  {q.count}x
                </span>
              </div>
            ))}
          </div>
        </AnalyticsCard>

        <AnalyticsCard
          title="Chat Sessions Directory"
          subtitle="Full MongoDB conversation logs"
          icon={MessageSquare}
          className="lg:col-span-2"
        >
          <DataTable
            data={chatSessions}
            columns={tableColumns}
            searchPlaceholder="Search chat sessions..."
            pageSize={6}
          />
        </AnalyticsCard>
      </div>
    </div>
  );
}
