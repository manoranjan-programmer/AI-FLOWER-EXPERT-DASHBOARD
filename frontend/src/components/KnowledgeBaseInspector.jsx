import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Sun, 
  Droplets, 
  X, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight,
  Info
} from 'lucide-react';

export default function KnowledgeBaseInspector({ knowledgeBase = [] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const itemsPerPage = 8;

  const totalPages = Math.ceil(knowledgeBase.length / itemsPerPage) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return knowledgeBase.slice(start, start + itemsPerPage);
  }, [knowledgeBase, currentPage]);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            MongoDB Master Botanical Knowledge Base
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Full catalog of botanical species, scientific classifications, care profiles, toxicity levels, and medicinal uses.
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>{knowledgeBase.length} Live Botanical Articles</span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-left text-xs text-gray-700">
          <thead className="bg-gray-50 text-gray-900 uppercase font-bold tracking-wider border-b border-gray-200">
            <tr>
              <th className="py-3 px-4">Flower Species</th>
              <th className="py-3 px-4">Scientific Name</th>
              <th className="py-3 px-4">Botanical Family</th>
              <th className="py-3 px-4">Native Region</th>
              <th className="py-3 px-4">Sunlight & Water</th>
              <th className="py-3 px-4">Toxicity</th>
              <th className="py-3 px-4 text-center">Botanical Profile</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 font-medium bg-white">
            {paginatedData.length > 0 ? (
              paginatedData.map((item, idx) => (
                <tr key={idx} className="hover:bg-blue-50/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-gray-900 capitalize flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                    {item.flower}
                  </td>
                  <td className="py-3 px-4 italic text-blue-600 font-semibold">{item.scientific_name}</td>
                  <td className="py-3 px-4 text-gray-800">{item.family}</td>
                  <td className="py-3 px-4 text-gray-500 max-w-[150px] truncate">{item.native_region}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-amber-600 font-semibold text-[11px]">
                        <Sun className="w-3.5 h-3.5" /> {item.sunlight}
                      </span>
                      <span className="flex items-center gap-1 text-cyan-600 font-semibold text-[11px]">
                        <Droplets className="w-3.5 h-3.5" /> {item.water}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      item.toxicity?.toLowerCase().includes('toxic') && !item.toxicity?.toLowerCase().includes('non-toxic')
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>
                      {item.toxicity}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => setSelectedRecord(item)}
                      className="px-3 py-1 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors text-xs font-semibold flex items-center gap-1 mx-auto border border-blue-100"
                    >
                      <Info className="w-3.5 h-3.5" /> Inspect Card
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-8 text-center text-gray-400 font-medium">
                  No knowledge base articles available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between pt-2 text-xs text-gray-500">
        <span>
          Showing {paginatedData.length} of {knowledgeBase.length} articles
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-semibold text-gray-800">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-100 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Botanical Inspector Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl bg-white border border-gray-200 shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 capitalize">
                    {selectedRecord.flower} <span className="text-xs italic text-blue-600 font-normal">({selectedRecord.scientific_name})</span>
                  </h3>
                  <p className="text-xs text-gray-500">
                    Family: <span className="text-gray-800 font-semibold">{selectedRecord.family}</span> | Region: <span className="text-gray-800 font-semibold">{selectedRecord.native_region}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedRecord(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 p-6 overflow-y-auto space-y-5 text-xs text-gray-700">
              
              {/* Care & Traits Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-gray-50 border border-gray-200">
                <div>
                  <span className="text-gray-400 uppercase font-semibold text-[10px]">Sunlight</span>
                  <p className="font-bold text-amber-600 mt-0.5">{selectedRecord.sunlight}</p>
                </div>
                <div>
                  <span className="text-gray-400 uppercase font-semibold text-[10px]">Water</span>
                  <p className="font-bold text-cyan-600 mt-0.5">{selectedRecord.water}</p>
                </div>
                <div>
                  <span className="text-gray-400 uppercase font-semibold text-[10px]">Toxicity</span>
                  <p className="font-bold text-rose-600 mt-0.5">{selectedRecord.toxicity}</p>
                </div>
                <div>
                  <span className="text-gray-400 uppercase font-semibold text-[10px]">Pollinators</span>
                  <p className="font-bold text-emerald-600 mt-0.5">{selectedRecord.pollinators}</p>
                </div>
              </div>

              {/* Description */}
              {selectedRecord.description && (
                <div className="space-y-1">
                  <h4 className="font-bold text-gray-900 uppercase tracking-wider text-[11px]">Botanical Description</h4>
                  <p className="p-4 rounded-xl bg-gray-50 border border-gray-200 leading-relaxed text-gray-700">
                    {selectedRecord.description}
                  </p>
                </div>
              )}

              {/* Medicinal Uses */}
              {selectedRecord.medicinal_uses && (
                <div className="space-y-1">
                  <h4 className="font-bold text-gray-900 uppercase tracking-wider text-[11px]">Medicinal & Health Applications</h4>
                  <p className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 leading-relaxed text-emerald-900">
                    {selectedRecord.medicinal_uses}
                  </p>
                </div>
              )}

              {/* Uses */}
              {selectedRecord.uses && (
                <div className="space-y-1">
                  <h4 className="font-bold text-gray-900 uppercase tracking-wider text-[11px]">Cultural & Commercial Uses</h4>
                  <p className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 leading-relaxed text-blue-900">
                    {selectedRecord.uses}
                  </p>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 flex justify-end">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-900 text-white font-medium transition-colors"
              >
                Close Profile
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
