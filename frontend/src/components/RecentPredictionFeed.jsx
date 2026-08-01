import React, { useState } from 'react';
import { 
  Sparkles, 
  Clock, 
  User, 
  Target, 
  Eye, 
  MessageSquare, 
  Image as ImageIcon, 
  X, 
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import TranscriptModal from './TranscriptModal';

export default function RecentPredictionFeed({ predictions = [] }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [filterQuery, setFilterQuery] = useState('');

  const filteredPredictions = predictions.filter(p => {
    if (!filterQuery) return true;
    const q = filterQuery.toLowerCase();
    return (
      (p.flower && p.flower.toLowerCase().includes(q)) ||
      (p.user_email && p.user_email.toLowerCase().includes(q)) ||
      (p.scientific_name && p.scientific_name.toLowerCase().includes(q))
    );
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold mb-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Real-Time Identification Feed
          </div>
          <h3 className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-2">
            Recent Flower Predictions Feed
          </h3>
          <p className="text-xs text-gray-500 font-medium">
            Live stream of user uploaded plant photos, model prediction confidence, and botanical cards.
          </p>
        </div>

        {/* Quick Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Filter prediction feed..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-medium w-52 sm:w-64"
          />
        </div>
      </div>

      {/* Predictions Feed Table / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPredictions.length > 0 ? (
          filteredPredictions.map((item, idx) => {
            const confVal = item.confidence || 90;
            const confBadgeClass = confVal >= 90 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
              : confVal >= 80 
              ? 'bg-blue-50 text-blue-700 border-blue-200' 
              : 'bg-amber-50 text-amber-700 border-amber-200';

            return (
              <div 
                key={item.id || item.session_id || idx}
                className="saas-card p-4 rounded-2xl border border-gray-200 bg-white hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                {/* Top Section: Thumbnail & Species details */}
                <div className="space-y-3">
                  
                  {/* Image Preview / Lightbox Trigger */}
                  <div className="relative aspect-video rounded-xl bg-gray-100 border border-gray-200 overflow-hidden group">
                    {item.image_preview ? (
                      <img 
                        src={item.image_preview} 
                        alt={item.flower} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                        onClick={() => setSelectedImage(item.image_preview)}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100 text-emerald-700 p-4 text-center">
                        <ImageIcon className="w-8 h-8 mb-1 opacity-70" />
                        <span className="text-xs font-bold">{item.flower} Preview</span>
                      </div>
                    )}

                    {/* Floating Confidence Badge */}
                    <div className="absolute top-2.5 right-2.5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-black border shadow-xs backdrop-blur-xs ${confBadgeClass}`}>
                        {confVal}% Confident
                      </span>
                    </div>

                    {/* Hover Zoom overlay */}
                    {item.image_preview && (
                      <div 
                        onClick={() => setSelectedImage(item.image_preview)}
                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-white font-bold text-xs gap-1.5"
                      >
                        <Eye className="w-4 h-4" /> Expand Preview
                      </div>
                    )}
                  </div>

                  {/* Species Name & User Info */}
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-gray-900 text-base flex items-center gap-1.5">
                        <span>{item.flower || 'Unknown Flower'}</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      </h4>
                    </div>

                    <p className="text-xs italic text-gray-500 font-medium">
                      {item.scientific_name || 'Botanical species'}
                    </p>

                    <div className="mt-2 flex items-center gap-1.5 text-[11px] text-gray-500 font-medium">
                      <User className="w-3.5 h-3.5 text-gray-400" />
                      <span className="font-mono text-gray-700 truncate max-w-[190px]">
                        {item.user_email || 'guest@aflowerexpert.com'}
                      </span>
                    </div>
                  </div>

                  {/* Botanical Metadata Cards */}
                  {item.card && Object.keys(item.card).length > 0 && (
                    <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-[11px] space-y-1">
                      {item.card.Family && (
                        <div className="flex justify-between text-gray-600">
                          <span className="font-semibold text-gray-400">Family:</span>
                          <span className="font-bold text-purple-700">{item.card.Family}</span>
                        </div>
                      )}
                      {item.card.Sunlight && (
                        <div className="flex justify-between text-gray-600">
                          <span className="font-semibold text-gray-400">Sunlight:</span>
                          <span className="font-medium text-gray-800">{item.card.Sunlight}</span>
                        </div>
                      )}
                      {item.card.Water && (
                        <div className="flex justify-between text-gray-600">
                          <span className="font-semibold text-gray-400">Water:</span>
                          <span className="font-medium text-gray-800">{item.card.Water}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Summary Text snippet */}
                  {item.summary && (
                    <p className="text-xs text-gray-600 line-clamp-2 italic bg-blue-50/40 p-2 rounded-lg border border-blue-100">
                      "{item.summary}"
                    </p>
                  )}

                </div>

                {/* Footer Bar: Searched At & Chat Action */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-[11px] text-gray-400 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{item.searched_at || 'Just now'}</span>
                  </div>

                  {item.messages && item.messages.length > 0 && (
                    <button
                      onClick={() => setSelectedSession({
                        session_id: item.session_id,
                        flower: item.flower,
                        confidence: confVal,
                        messages: item.messages,
                        user: item.user_email,
                        timestamp: item.timestamp
                      })}
                      className="px-3 py-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] flex items-center gap-1 shadow-xs transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> Inspect Chat
                    </button>
                  )}
                </div>

              </div>
            );
          })
        ) : (
          <div className="col-span-full p-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-300 text-gray-400 font-medium">
            No prediction records found matching your filter criteria.
          </div>
        )}
      </div>

      {/* Lightbox Image Preview Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-3xl max-h-[85vh] bg-white rounded-2xl p-2 border border-gray-200 shadow-2xl overflow-hidden">
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <img 
              src={selectedImage} 
              alt="Uploaded Flower" 
              className="max-h-[80vh] w-auto rounded-xl object-contain mx-auto"
            />
          </div>
        </div>
      )}

      {/* Transcript Modal */}
      {selectedSession && (
        <TranscriptModal
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
        />
      )}

    </div>
  );
}
