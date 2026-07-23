import React, { useState } from 'react';
import { Sparkles, Search, Building, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { useAccounting } from '../../context/AccountingContext';
import ReactMarkdown from 'react-markdown';

export const SchemesEngineView: React.FC = () => {
  const { company } = useAccounting();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResult('');
    try {
      const res = await fetch('/api/ai/schemes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, companyContext: company })
      });
      const data = await res.json();
      setResult(data.reply || 'No results found.');
    } catch (e) {
      console.error(e);
      setResult('Error connecting to Intelligence Engine.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center space-y-4 mb-8">
        <div className="w-16 h-16 mx-auto bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center mb-4">
          <Building className="w-8 h-8 text-teal-600 dark:text-teal-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Gov Schemes & Growth Engine</h2>
        <p className="text-slate-600 dark:text-slate-400">Discover official government schemes, grants, and subsidies for MSMEs using AI-powered search across trusted government domains.</p>
      </div>

      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Active Business Profile Reference
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Industry: <strong>{company.industry}</strong> | State: <strong>{company.state}</strong>
          </p>
        </div>
        <div className="text-xs text-slate-500 max-w-xs">
          The AI will automatically cross-reference your business details with government portals to suggest relevant subsidies.
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center focus-within:ring-2 ring-teal-500">
        <div className="pl-4 text-slate-400">
          <Search className="w-5 h-5" />
        </div>
        <input 
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          placeholder="e.g., What are the latest MSME loan schemes for tech startups?"
          className="flex-1 bg-transparent border-none focus:outline-none px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400"
        />
        <button 
          onClick={handleSearch}
          disabled={loading || !query.trim()}
          className="px-6 py-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-semibold rounded-xl flex items-center gap-2 transition-colors"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
          <span>Search</span>
        </button>
      </div>

      {result && (
        <div className="mt-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 overflow-hidden">
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <ReactMarkdown>{result}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};
