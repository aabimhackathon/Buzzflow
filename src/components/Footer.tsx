import React from 'react';
import { useAccounting } from '../context/AccountingContext';
import { ShieldCheck, Database } from 'lucide-react';

export const Footer: React.FC = () => {
  const { brand, company, isSupabaseConnected } = useAccounting();

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-12 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <span className="font-semibold text-white">{brand.name}</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">{company.name}</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-emerald-400 border border-slate-700">
              <ShieldCheck className="w-3 h-3" /> ICAI Prescribed Double-Entry
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>{brand.footerText}</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 text-emerald-300">
              <Database className="w-3 h-3 text-emerald-400" /> Supabase Connected
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
