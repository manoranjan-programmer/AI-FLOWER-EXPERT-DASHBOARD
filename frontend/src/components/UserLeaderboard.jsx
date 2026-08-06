import React, { useState, useMemo } from 'react';
import {
  Users,
  UserCheck,
  Search,
  Sparkles,
  Calendar,
  Clock,
  Shield,
  Award,
  Eye,
  Image as ImageIcon,
  MessageSquare,
  ChevronRight,
  X,
  ExternalLink,
  Bot
} from 'lucide-react';
import TranscriptModal from './TranscriptModal';

export default function UserLeaderboard({ registeredUsers = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserEmail, setSelectedUserEmail] = useState('ALL');
  const [inspectingUser, setInspectingUser] = useState(null);
  const [viewingImage, setViewingImage] = useState(null);
  const [viewingTranscript, setViewingTranscript] = useState(null);

  // Filtered users list
  const filteredUsers = useMemo(() => {
    return registeredUsers.filter(u => {
      const matchQuery = !searchTerm ||
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchEmail = selectedUserEmail === 'ALL' || u.email === selectedUserEmail;

      return matchQuery && matchEmail;
    });
  }, [registeredUsers, searchTerm, selectedUserEmail]);

  // Selected single user for detail inspection
  const activeInspectedUser = useMemo(() => {
    if (inspectingUser) return inspectingUser;
    if (selectedUserEmail !== 'ALL') {
      return registeredUsers.find(u => u.email === selectedUserEmail) || null;
    }
    return null;
  }, [inspectingUser, selectedUserEmail, registeredUsers]);

  const formatDate = (isoStr) => {
    if (!isoStr) return 'N/A';
    try {
      const d = new Date(isoStr);
      if (isNaN(d.getTime())) return isoStr;
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return isoStr;
    }
  };

  const isToday = (isoStr) => {
    if (!isoStr) return false;
    try {
      const d = new Date(isoStr);
      const todayStr = new Date().toISOString().split('T')[0];
      return d.toISOString().split('T')[0] === todayStr;
    } catch (e) {
      return false;
    }
  };

  return (
    <div className="space-y-6">

      {/* Main Glassmorphism Leaderboard Container */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">

        {/* Header & Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold mb-1.5">
              <Users className="w-3.5 h-3.5" /> User Accounts & Engagement
            </div>
            <h3 className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-2">
              Registered Users & Activity Leaderboard
            </h3>
            <p className="text-xs text-gray-500 font-medium">
              Monitor registered botanists, track user activity timestamps, and inspect user search histories.
            </p>
          </div>

          {/* User Filter Dropdown & Search Bar */}
          <div className="flex flex-wrap items-center gap-3">

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search user name/email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-2 text-xs rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 w-48 sm:w-60 font-medium"
              />
            </div>

            {/* User Select Dropdown */}
            <select
              value={selectedUserEmail}
              onChange={(e) => {
                setSelectedUserEmail(e.target.value);
                setInspectingUser(null);
              }}
              className="py-2 px-3 text-xs rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-bold max-w-xs"
            >
              <option value="ALL">All Registered Users ({registeredUsers.length})</option>
              {registeredUsers.map(u => (
                <option key={u.id || u.email} value={u.email}>
                  {u.name} ({u.email})
                </option>
              ))}
            </select>

            {activeInspectedUser && (
              <button
                onClick={() => { setInspectingUser(null); setSelectedUserEmail('ALL'); }}
                className="px-3 py-2 text-xs font-bold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors flex items-center gap-1 border border-gray-200"
              >
                <X className="w-3.5 h-3.5" /> Clear Filter
              </button>
            )}
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-xs">
          <table className="w-full text-left text-xs text-gray-700">
            <thead className="bg-gray-50 text-gray-900 uppercase font-bold tracking-wider border-b border-gray-200">
              <tr>
                <th className="py-3 px-4">User Profile</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Registration Date</th>
                <th className="py-3 px-4">Last Activity</th>
                <th className="py-3 px-4 text-center">Flower Identifications</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white font-medium">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => {
                  const activeToday = isToday(user.last_active);
                  const isBotanist = (user.role || '').toLowerCase() === 'botanist';
                  const isSelected = activeInspectedUser?.email === user.email;

                  return (
                    <tr
                      key={user.id || user.email}
                      className={`hover:bg-blue-50/50 transition-colors ${isSelected ? 'bg-blue-50/70 font-semibold' : ''
                        }`}
                    >
                      {/* User Info */}
                      <td className="py-3.5 px-4 flex items-center gap-3">
                        {user.picture ? (
                          <img
                            src={user.picture}
                            alt={user.name}
                            className="w-9 h-9 rounded-full border border-gray-200 object-cover shadow-xs"
                          />
                        ) : (
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-white shadow-xs ${isBotanist ? 'bg-gradient-to-br from-emerald-500 to-teal-700' : 'bg-gradient-to-br from-blue-500 to-indigo-600'
                            }`}>
                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                            <span>{user.name}</span>
                            {isBotanist && <Award className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />}
                          </div>
                          <div className="text-gray-500 font-mono text-[11px]">{user.email}</div>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border tracking-wider flex items-center gap-1 w-max ${isBotanist
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                          }`}>
                          <Shield className="w-3 h-3" />
                          {user.role || 'user'}
                        </span>
                      </td>

                      {/* Registration Date */}
                      <td className="py-3.5 px-4 text-gray-600 font-medium">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          <span>{formatDate(user.created_at)}</span>
                        </div>
                      </td>

                      {/* Last Activity */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-gray-700">{formatDate(user.last_active)}</span>
                          {activeToday && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                              Active Today
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Total Searches */}
                      <td className="py-3.5 px-4 text-center font-black text-sm text-blue-600">
                        <span className="px-3 py-1 rounded-xl bg-blue-50 border border-blue-100">
                          {user.total_searches || (user.searches ? user.searches.length : 0)}
                        </span>
                      </td>

                      {/* Inspect Action */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => setInspectingUser(user)}
                          className="px-3 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-all shadow-xs flex items-center gap-1 mx-auto"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Inspect History
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400 font-medium">
                    No registered users match your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Per-User Detailed History & Image Inspector Panel */}
      {activeInspectedUser && (
        <div className="bg-white rounded-2xl border border-blue-200 shadow-md p-6 space-y-6 animate-in fade-in duration-200">

          {/* User Header Profile Card */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-100">
            <div className="flex items-center gap-4">
              {activeInspectedUser.picture ? (
                <img
                  src={activeInspectedUser.picture}
                  alt={activeInspectedUser.name}
                  className="w-12 h-12 rounded-full border-2 border-white shadow-sm object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-extrabold text-lg shadow-sm">
                  {activeInspectedUser.name ? activeInspectedUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
              <div>
                <h4 className="text-lg font-black text-gray-900 flex items-center gap-2">
                  <span>{activeInspectedUser.name}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-blue-600 text-white uppercase tracking-wider">
                    {activeInspectedUser.role || 'user'}
                  </span>
                </h4>
                <p className="text-xs text-gray-600 font-mono mt-0.5">{activeInspectedUser.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-white/80 rounded-xl border border-blue-100 text-center shadow-xs">
                <span className="text-[10px] font-bold text-gray-500 block uppercase">Total Identifications</span>
                <span className="text-lg font-black text-blue-600">
                  {activeInspectedUser.searches ? activeInspectedUser.searches.length : activeInspectedUser.total_searches || 0}
                </span>
              </div>

              <button
                onClick={() => setInspectingUser(null)}
                className="p-2 rounded-xl bg-white text-gray-500 hover:text-gray-900 border border-gray-200 transition-colors"
                title="Close Inspector"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* User Search History Feed */}
          <div className="space-y-4">
            <h4 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              Private Identification & AI Chat History ({activeInspectedUser.searches ? activeInspectedUser.searches.length : 0})
            </h4>

            {activeInspectedUser.searches && activeInspectedUser.searches.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeInspectedUser.searches.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="p-4 rounded-xl border border-gray-200 bg-gray-50/60 hover:bg-white hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
                  >
                    {/* Top row: Flower & Confidence */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {item.image_preview ? (
                          <img
                            src={item.image_preview}
                            alt={item.flower}
                            onClick={() => setViewingImage(item.image_preview)}
                            className="w-14 h-14 rounded-xl object-cover border border-gray-300 shadow-xs cursor-pointer hover:opacity-90 transition-opacity"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-xl bg-emerald-100 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold text-xs text-center p-1">
                            {item.flower || 'Plant'}
                          </div>
                        )}

                        <div>
                          <div className="font-extrabold text-gray-900 text-sm">{item.flower || 'Unknown Flower'}</div>
                          <div className="text-xs italic text-gray-500">{item.scientific_name || 'Botanical species'}</div>
                          <div className="text-[10px] text-gray-400 mt-1 font-medium">{item.searched_at}</div>
                        </div>
                      </div>

                      <span className={`px-2.5 py-1 rounded-full text-xs font-black border ${item.confidence >= 90
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : item.confidence >= 80
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                        {item.confidence}%
                      </span>
                    </div>

                    {/* Plant Card Badges */}
                    {item.card && Object.keys(item.card).length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {item.card.Family && (
                          <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-bold">
                            Family: {item.card.Family}
                          </span>
                        )}
                        {item.card.Sunlight && (
                          <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">
                            Sunlight: {item.card.Sunlight}
                          </span>
                        )}
                        {item.card.Water && (
                          <span className="px-2 py-0.5 rounded-md bg-cyan-50 text-cyan-700 border border-cyan-200 text-[10px] font-bold">
                            Water: {item.card.Water}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Summary snippet */}
                    {item.summary && (
                      <p className="text-xs text-gray-600 line-clamp-2 italic bg-white p-2.5 rounded-lg border border-gray-200">
                        "{item.summary}"
                      </p>
                    )}

                    {/* Action buttons */}
                    <div className="pt-2 flex items-center justify-between text-xs border-t border-gray-200/80">
                      <span className="text-gray-400 font-mono text-[10px] truncate max-w-[150px]">
                        Session: {item.session_id}
                      </span>

                      <div className="flex items-center gap-2">
                        {item.image_preview && (
                          <button
                            onClick={() => setViewingImage(item.image_preview)}
                            className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-[11px] flex items-center gap-1 transition-colors"
                          >
                            <ImageIcon className="w-3.5 h-3.5" /> View Image
                          </button>
                        )}

                        {item.messages && item.messages.length > 0 && (
                          <button
                            onClick={() => setViewingTranscript({
                              session_id: item.session_id,
                              flower: item.flower,
                              confidence: item.confidence,
                              messages: item.messages,
                              user: activeInspectedUser.email,
                              timestamp: item.timestamp
                            })}
                            className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] flex items-center gap-1 transition-colors"
                          >
                            <MessageSquare className="w-3.5 h-3.5" /> View Chat ({item.messages.length})
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-500 font-medium">
                No search history recorded for this user yet.
              </div>
            )}
          </div>

        </div>
      )}

      {/* Lightbox Image Preview Modal */}
      {viewingImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setViewingImage(null)}
        >
          <div className="relative max-w-3xl max-h-[85vh] bg-white rounded-2xl p-2 border border-gray-200 shadow-2xl overflow-hidden">
            <button
              onClick={() => setViewingImage(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={viewingImage}
              alt="Uploaded Flower Preview"
              className="max-h-[80vh] w-auto rounded-xl object-contain mx-auto"
            />
          </div>
        </div>
      )}

      {/* Transcript Modal */}
      {viewingTranscript && (
        <TranscriptModal
          session={viewingTranscript}
          onClose={() => setViewingTranscript(null)}
        />
      )}

    </div>
  );
}
