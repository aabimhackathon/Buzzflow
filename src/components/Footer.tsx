import React from 'react';
import { useAccounting } from '../context/AccountingContext';
import { ShieldCheck, Database } from 'lucide-react';

export const Footer: React.FC = () => {
  const { brand, activeCompany } = useAccounting();

  return (
    <footer className="bg-[#163A70] text-slate-300 text-xs border-t border-[#D8E2EE] mt-12 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <span className="font-semibold text-white">{brand.name}</span>
            <span className="text-slate-400">|</span>
            <span className="text-teal-200 font-medium">{activeCompany.name}</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] bg-[#16B8A6]/20 text-[#16B8A6] border border-[#16B8A6]/30">
              <ShieldCheck className="w-3 h-3" /> ICAI Double-Entry Engine
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-300">
            <span>{brand.footerText}</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#1E293B] text-teal-300 font-mono text-[10px]">
              <Database className="w-3 h-3 text-[#16B8A6]" /> Local Ledger DB
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
