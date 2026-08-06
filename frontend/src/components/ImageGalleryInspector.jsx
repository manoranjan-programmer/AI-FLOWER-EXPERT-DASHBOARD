import React, { useState, useMemo } from 'react';
import { Camera, Search, Filter, Grid, List, Sparkles, Info } from 'lucide-react';

export default function ImageGalleryInspector({ galleryItems = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [confidenceFilter, setConfidenceFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  const filteredItems = useMemo(() => {
    return galleryItems.filter(item => {
      const matchSearch = !searchTerm ||
        (item.flower && item.flower.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.scientific_name && item.scientific_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.filename && item.filename.toLowerCase().includes(searchTerm.toLowerCase()));

      const conf = item.confidence || 0;
      let matchConf = true;
      if (confidenceFilter === 'high') matchConf = conf >= 90;
      else if (confidenceFilter === 'medium') matchConf = conf >= 70 && conf < 90;
      else if (confidenceFilter === 'low') matchConf = conf < 70;

      return matchSearch && matchConf;
    });
  }, [galleryItems, searchTerm, confidenceFilter]);

  const getBadgeStyle = (conf) => {
    if (conf >= 90) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (conf >= 70) return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-rose-50 text-rose-700 border-rose-200';
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">

      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Camera className="w-5 h-5 text-blue-600" />
            Uploaded Images & Predictions Gallery Inspector
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Deep-dive visual inspector for flower image uploads, classification scores, and Data URI previews.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-gray-100 border border-gray-200 text-xs">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-gray-50 border border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search species, scientific name, or filename..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-white text-gray-900 placeholder-gray-400 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={confidenceFilter}
            onChange={(e) => setConfidenceFilter(e.target.value)}
            className="w-full py-1.5 px-3 text-xs rounded-lg bg-white text-gray-900 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-medium"
          >
            <option value="ALL">All Confidence Scores</option>
            <option value="high">High (&gt;= 90%)</option>
            <option value="medium">Moderate (70% - 90%)</option>
            <option value="low">Low (&lt; 70%)</option>
          </select>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredItems.length > 0 ? (
            filteredItems.map((item, idx) => (
              <div
                key={idx}
                className="group p-4 rounded-xl bg-gray-50 border border-gray-200 hover:border-blue-400 transition-all flex flex-col justify-between space-y-3 hover:shadow-md"
              >
                {/* Thumbnail Preview */}
                <div className="w-full h-40 rounded-lg bg-white border border-gray-200 overflow-hidden relative flex items-center justify-center">
                  {item.image_preview ? (
                    <img
                      src={item.image_preview}
                      alt={item.flower}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-4 text-center space-y-1">
                      <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                        <Camera className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] text-gray-400 font-medium">No Image Preview</span>
                    </div>
                  )}

                  <span className={`absolute top-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-bold border backdrop-blur-md shadow-sm ${getBadgeStyle(item.confidence)}`}>
                    {item.confidence}%
                  </span>
                </div>

                {/* Info */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-gray-900 truncate capitalize">
                      {item.flower}
                    </h4>
                  </div>
                  <p className="text-xs italic text-gray-500 truncate">
                    {item.scientific_name || 'Botanical species'}
                  </p>
                </div>

                {/* Footer Details */}
                <div className="pt-2 border-t border-gray-200 flex items-center justify-between text-[11px] text-gray-500 font-mono">
                  <span className="truncate max-w-[120px]">{item.filename || 'upload.jpg'}</span>
                  <span>{item.searched_at}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-gray-400 font-medium">
              No uploaded image records match your search criteria.
            </div>
          )}
        </div>
      ) : (
        /* Table View */
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-left text-xs text-gray-700">
            <thead className="bg-gray-50 text-gray-900 uppercase font-bold tracking-wider border-b border-gray-200">
              <tr>
                <th className="py-3 px-4">Preview</th>
                <th className="py-3 px-4">Flower Species</th>
                <th className="py-3 px-4">Scientific Name</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4">Filename</th>
                <th className="py-3 px-4">Searched At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 font-medium bg-white">
              {filteredItems.map((item, idx) => (
                <tr key={idx} className="hover:bg-blue-50/40 transition-colors">
                  <td className="py-2.5 px-4">
                    <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-200 overflow-hidden flex items-center justify-center">
                      {item.image_preview ? (
                        <img src={item.image_preview} alt={item.flower} className="w-full h-full object-cover" />
                      ) : (
                        <Camera className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                  </td>
                  <td className="py-2.5 px-4 font-bold text-gray-900 capitalize">{item.flower}</td>
                  <td className="py-2.5 px-4 italic text-gray-500">{item.scientific_name}</td>
                  <td className="py-2.5 px-4">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getBadgeStyle(item.confidence)}`}>
                      {item.confidence}%
                    </span>
                  </td>
                  <td className="py-2.5 px-4 font-mono text-gray-500">{item.filename}</td>
                  <td className="py-2.5 px-4 text-gray-500">{item.searched_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
