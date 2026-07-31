import React from 'react';
import { X, MessageSquare, Bot, User, Clock } from 'lucide-react';

export default function TranscriptModal({ session, onClose }) {
  if (!session) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl bg-white border border-gray-200 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                Session Transcript: <span className="text-blue-600">{session.session_id}</span>
              </h3>
              <p className="text-xs text-gray-500">
                User: <span className="font-semibold text-gray-800">{session.user}</span> | Flower: <span className="font-semibold text-gray-800 capitalize">{session.flower}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Messages */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 text-xs">
          {session.messages && session.messages.length > 0 ? (
            session.messages.map((msg, idx) => (
              <div 
                key={idx}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role !== 'user' && (
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 flex-shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[80%] p-4 rounded-2xl leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none shadow-sm'
                    : 'bg-gray-100 text-gray-800 border border-gray-200 rounded-bl-none'
                }`}>
                  <div className="font-semibold mb-1 opacity-75 capitalize flex items-center justify-between gap-4">
                    <span>{msg.role}</span>
                  </div>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>

                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 flex-shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-400 font-medium">No message history available for this session.</div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 flex justify-between items-center text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-gray-400" /> Timestamp: {new Date(session.timestamp).toLocaleString()}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-900 text-white font-medium transition-colors"
          >
            Close Transcript
          </button>
        </div>

      </div>
    </div>
  );
}
