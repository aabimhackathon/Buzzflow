import React, { useState } from 'react';
import { Database, Search, Filter, Plus, Tag } from 'lucide-react';
import { VEPARI_ASSETS } from '../../config/assets';

interface MemoryRecord {
  id: string;
  type: string;
  content: string;
  tags: string[];
  timestamp: Date;
}

export const MemoryEngineView: React.FC = () => {
  const [memories, setMemories] = useState<MemoryRecord[]>([
    { id: '1', type: 'Voucher Record', content: 'Indexed automated payment voucher for Software Subscription.', tags: ['software', 'subscription'], timestamp: new Date() },
    { id: '2', type: 'AI Interaction', content: 'User queried about GST setup. Context stored for future reference.', tags: ['gst', 'setup', 'tax'], timestamp: new Date(Date.now() - 3600000) }
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newNote, setNewNote] = useState('');
  const [newTags, setNewTags] = useState('');

  const handleAddMemory = () => {
    if (!newNote.trim()) return;
    const tagsArray = newTags.split(',').map(t => t.trim()).filter(Boolean);
    const newRecord: MemoryRecord = {
      id: Date.now().toString(),
      type: 'Manual Note',
      content: newNote,
      tags: tagsArray,
      timestamp: new Date()
    };
    setMemories([newRecord, ...memories]);
    setNewNote('');
    setNewTags('');
  };

  const filteredMemories = memories.filter(m => 
    m.content.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img 
            src={VEPARI_ASSETS.engines.memory} 
            alt="Memory Engine" 
            className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700 bg-white p-0.5 shadow-sm"
          />
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Memory Engine
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Indexed repository of all financial records, queries, and system contexts.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search indexed memories or tags..." 
              className="pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Memory Index
            </h3>
            <textarea 
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Enter contextual note or decision..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={2}
            />
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="Tags (comma separated)..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button 
                onClick={handleAddMemory}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors whitespace-nowrap"
              >
                Index Memory
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {filteredMemories.map(m => (
              <div key={m.id} className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-semibold uppercase tracking-wider ${m.type === 'AI Interaction' ? 'text-emerald-600 dark:text-emerald-400' : 'text-indigo-600 dark:text-indigo-400'}`}>{m.type}</span>
                  <span className="text-xs text-slate-500">{m.timestamp.toLocaleString()}</span>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300">{m.content}</p>
                {m.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {m.tags.map(t => (
                      <span key={t} className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md text-[10px] font-semibold flex items-center gap-1">
                        <Tag className="w-3 h-3" /> {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {filteredMemories.length === 0 && (
              <div className="text-center p-6 text-slate-500 text-sm">
                No memories found matching your search.
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800/50">
            <h3 className="text-sm font-bold text-indigo-900 dark:text-indigo-100 mb-2">Index Status</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-indigo-700 dark:text-indigo-300">Total Records</span>
                <span className="font-semibold text-indigo-900 dark:text-indigo-100">{1246 + memories.length}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-indigo-700 dark:text-indigo-300">AI Embeddings</span>
                <span className="font-semibold text-indigo-900 dark:text-indigo-100">Active</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-indigo-700 dark:text-indigo-300">Last Sync</span>
                <span className="font-semibold text-indigo-900 dark:text-indigo-100">Just now</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
