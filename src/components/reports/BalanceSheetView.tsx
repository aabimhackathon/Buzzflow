import React from 'react';
import { useAccounting } from '../../context/AccountingContext';
import { Printer, CheckCircle2, ShieldCheck, AlertTriangle, Download } from 'lucide-react';
import { downloadPDF } from '../../utils/pdfGenerator';

export const BalanceSheetView: React.FC = () => {
  const { balanceSheet, company, brand } = useAccounting();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <span className="text-[10px] font-bold text-teal-600 uppercase tracking-wider">{brand.name} Statement</span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Balance Sheet Statement</h2>
          <p className="text-xs text-slate-500">As at {new Date().toLocaleDateString()} | Capital, Liabilities & Assets Matrix</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => downloadPDF('bs-report', 'Balance_Sheet')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-teal-600 hover:bg-slate-800 text-white font-semibold text-xs transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Statement</span>
          </button>
        </div>
      </div>

      <div id="bs-report" className="space-y-6">
        {/* Equality Alert */}
      <div className={`p-4 rounded-2xl border flex items-center justify-between font-bold text-xs ${
        balanceSheet.isBalanced
          ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
          : 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
      }`}>
        <div className="flex items-center gap-2">
          {balanceSheet.isBalanced ? <ShieldCheck className="w-5 h-5 text-emerald-600" /> : <AlertTriangle className="w-5 h-5 text-rose-600" />}
          <span>{balanceSheet.isBalanced ? 'Balanced Equation: Total Capital & Liabilities = Total Assets' : `Imbalance of ${company.currencySymbol}${balanceSheet.difference}`}</span>
        </div>
        <div className="font-mono text-sm">
          {company.currencySymbol}{balanceSheet.capitalAndLiabilities.total.toLocaleString()} = {company.currencySymbol}{balanceSheet.assets.total.toLocaleString()}
        </div>
      </div>

      {/* Dual Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Capital & Liabilities Column */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider">
              Capital & Liabilities
            </h3>

            {balanceSheet.capitalAndLiabilities.groups.map((group, idx) => (
              <div key={idx} className="space-y-2 text-xs">
                <h4 className="font-bold text-teal-600 dark:text-teal-400 font-sans">{group.groupName}</h4>
                <div className="space-y-1.5 font-mono">
                  {group.ledgers.map((l, i) => (
                    <div key={i} className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800/60">
                      <span className="font-sans text-slate-700 dark:text-slate-300">{l.ledgerName}</span>
                      <span className="font-bold text-slate-900 dark:text-white">{company.currencySymbol}{l.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 text-white flex justify-between items-center font-bold text-sm">
            <span>TOTAL LIABILITIES & CAPITAL</span>
            <span className="font-mono text-teal-400">{company.currencySymbol}{balanceSheet.capitalAndLiabilities.total.toLocaleString()}</span>
          </div>
        </div>

        {/* Assets Column */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider">
              Assets & Resources
            </h3>

            {balanceSheet.assets.groups.map((group, idx) => (
              <div key={idx} className="space-y-2 text-xs">
                <h4 className="font-bold text-indigo-600 dark:text-indigo-400 font-sans">{group.groupName}</h4>
                <div className="space-y-1.5 font-mono">
                  {group.ledgers.map((l, i) => (
                    <div key={i} className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800/60">
                      <span className="font-sans text-slate-700 dark:text-slate-300">{l.ledgerName}</span>
                      <span className="font-bold text-slate-900 dark:text-white">{company.currencySymbol}{l.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 text-white flex justify-between items-center font-bold text-sm">
            <span>TOTAL ASSETS</span>
            <span className="font-mono text-indigo-400">{company.currencySymbol}{balanceSheet.assets.total.toLocaleString()}</span>
          </div>
        </div>

      </div>
      </div>
    </div>
  );
};
