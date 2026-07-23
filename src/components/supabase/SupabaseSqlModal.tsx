import React, { useState } from 'react';
import { Database, Copy, Check, ExternalLink, ShieldCheck, RefreshCw, X } from 'lucide-react';
import { SUPABASE_SCHEMA_SQL, SUPABASE_URL } from '../../lib/supabase';

export const SupabaseSqlModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-4 mb-4">
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Supabase Cloud Database Editor & SQL Setup</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Connected
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Supabase Endpoint: <code className="text-emerald-600 dark:text-emerald-400 font-mono">{SUPABASE_URL}</code>
            </p>
          </div>
        </div>

        <div className="bg-slate-100 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 mb-4 text-xs space-y-2 text-slate-700 dark:text-slate-300">
          <p className="font-semibold flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            Supabase SQL Query for Tables & Security Policies
          </p>
          <p>
            You can copy the SQL script below and execute it directly in your Supabase SQL Editor to provision all ICAI accounting, inventory, billing, security PIN logs, and fiscal archive tables:
          </p>
        </div>

        <div className="relative flex-1 min-h-[250px] mb-4">
          <textarea
            readOnly
            value={SUPABASE_SCHEMA_SQL}
            className="w-full h-full p-4 font-mono text-xs bg-slate-900 text-teal-300 rounded-2xl border border-slate-800 outline-none resize-none no-scrollbar"
          />
          <button
            onClick={handleCopy}
            className="absolute top-3 right-3 px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'SQL Copied!' : 'Copy SQL Script'}</span>
          </button>
        </div>

        <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1.5"
          >
            <ExternalLink className="w-4 h-4" />
            Open Supabase Dashboard
          </a>
          <button
            onClick={onClose}
            className="py-2.5 px-5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-500 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
