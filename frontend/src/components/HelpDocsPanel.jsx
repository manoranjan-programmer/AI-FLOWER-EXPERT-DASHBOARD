import React from 'react';
import { HelpCircle, BookOpen, Database, Code, ShieldCheck, Terminal, ExternalLink } from 'lucide-react';

export default function HelpDocsPanel() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
      
      {/* Header */}
      <div className="pb-4 border-b border-gray-200">
        <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-blue-600" />
          Help & Documentation Guide
        </h3>
        <p className="text-xs text-gray-500 mt-0.5">
          Complete operational documentation for AI Flower Expert Analytics Dashboard & MongoDB Atlas Integration.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-gray-700">
        
        {/* Card 1: MongoDB Architecture */}
        <div className="p-5 rounded-xl bg-gray-50 border border-gray-200 space-y-3">
          <div className="flex items-center gap-2 font-bold text-gray-900 text-sm">
            <Database className="w-4 h-4 text-blue-600" />
            MongoDB Atlas Collections
          </div>
          <p className="leading-relaxed text-gray-600">
            The dashboard aggregates live records from two collections in the target <code className="bg-white px-1.5 py-0.5 rounded border text-blue-600 font-mono">test</code> database:
          </p>
          <ul className="space-y-1.5 list-disc pl-4 font-mono text-[11px] text-gray-800">
            <li><strong>Flower_Search_History</strong>: Image uploads, classifications, confidence scores, plant cards, and user chat history.</li>
            <li><strong>Flower_Knowledge_Base</strong>: Master dataset of 105 botanical species, care tips, toxicity levels, and medicinal applications.</li>
          </ul>
        </div>

        {/* Card 2: API Endpoints */}
        <div className="p-5 rounded-xl bg-gray-50 border border-gray-200 space-y-3">
          <div className="flex items-center gap-2 font-bold text-gray-900 text-sm">
            <Code className="w-4 h-4 text-emerald-600" />
            RESTful API Endpoints
          </div>
          <ul className="space-y-2 font-mono text-[11px]">
            <li className="p-2 rounded-lg bg-white border border-gray-200">
              <span className="text-blue-600 font-bold">POST</span> /api/admin/login
              <p className="text-gray-500 text-[10px]">Authenticates administrator and issues JWT session token.</p>
            </li>
            <li className="p-2 rounded-lg bg-white border border-gray-200">
              <span className="text-emerald-600 font-bold">GET</span> /api/analytics/overview?range=30d
              <p className="text-gray-500 text-[10px]">Returns aggregated KPIs, charts, gallery items, and knowledge base.</p>
            </li>
          </ul>
        </div>

        {/* Card 3: Default Credentials */}
        <div className="p-5 rounded-xl bg-gray-50 border border-gray-200 space-y-3">
          <div className="flex items-center gap-2 font-bold text-gray-900 text-sm">
            <ShieldCheck className="w-4 h-4 text-violet-600" />
            Admin Default Credentials
          </div>
          <div className="p-3 rounded-lg bg-white border border-gray-200 space-y-1 font-mono text-[11px]">
            <p>Email: <span className="font-bold text-gray-900">admin@aflowerexpert.com</span></p>
            <p>Password: <span className="font-bold text-gray-900">admin123</span></p>
            <p className="text-[10px] text-gray-500 pt-1">Configured in server/.env via ADMIN_EMAIL and ADMIN_PASSWORD variables.</p>
          </div>
        </div>

        {/* Card 4: Exporting Reports */}
        <div className="p-5 rounded-xl bg-gray-50 border border-gray-200 space-y-3">
          <div className="flex items-center gap-2 font-bold text-gray-900 text-sm">
            <Terminal className="w-4 h-4 text-amber-600" />
            Exporting & Reporting
          </div>
          <p className="leading-relaxed text-gray-600">
            Use the export toolbar in the Data Explorer to generate instant reports:
          </p>
          <div className="flex gap-2">
            <span className="px-2.5 py-1 rounded bg-blue-50 text-blue-700 font-bold border border-blue-200 text-[10px]">CSV Export</span>
            <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 text-[10px]">Excel (.xlsx)</span>
            <span className="px-2.5 py-1 rounded bg-rose-50 text-rose-700 font-bold border border-rose-200 text-[10px]">PDF Reports</span>
          </div>
        </div>

      </div>

    </div>
  );
}
