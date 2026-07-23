import React, { useState } from 'react';
import { useAccounting } from '../../context/AccountingContext';
import { CheckCircle2, AlertTriangle, Printer, Search, Download } from 'lucide-react';
import { downloadPDF } from '../../utils/pdfGenerator';

export const TrialBalanceView: React.FC = () => {
  const { trialBalance, company, brand } = useAccounting();
  const [search, setSearch] = useState('');

  const filteredRows = trialBalance.filter(r => 
    r.ledgerName.toLowerCase().includes(search.toLowerCase()) ||
    r.ledgerCode.includes(search) ||
    r.groupName.toLowerCase().includes(search.toLowerCase())
  );

  const totalDebit = filteredRows.reduce((sum, r) => sum + r.debitBalance, 0);
  const totalCredit = filteredRows.reduce((sum, r) => sum + r.creditBalance, 0);
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <span className="text-[10px] font-bold text-teal-600 uppercase tracking-wider">{brand.name} Financial Report</span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Trial Balance Statement</h2>
          <p className="text-xs text-slate-500">As of {new Date().toLocaleDateString()} | Verification of Ledger Debit/Credit Equality</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => downloadPDF('tb-report', 'Trial_Balance')}
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

      <div id="tb-report" className="space-y-6">
        {/* Equality Status Alert */}
      <div className={`p-4 rounded-2xl border flex items-center justify-between font-bold text-xs ${
        isBalanced 
          ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200' 
          : 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
      }`}>
        <div className="flex items-center gap-2">
          {isBalanced ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <AlertTriangle className="w-5 h-5 text-rose-600" />}
          <span>{isBalanced ? 'Trial Balance Verified: Total Debit Equals Total Credit' : 'Trial Balance Imbalance Detected!'}</span>
        </div>
        <div className="font-mono text-sm">
          Dr {company.currencySymbol}{totalDebit.toLocaleString()} = Cr {company.currencySymbol}{totalCredit.toLocaleString()}
        </div>
      </div>

      {/* Filter */}
      <div className="relative max-w-sm">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Filter trial balance accounts..."
          className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs border-collapse font-mono">
          <thead>
            <tr className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold font-sans border-b border-slate-200 dark:border-slate-800">
              <th className="py-3 px-4 w-20">Code</th>
              <th className="py-3 px-4">Account / Ledger</th>
              <th className="py-3 px-4">Group</th>
              <th className="py-3 px-4 text-right">Debit Balance ({company.currencySymbol})</th>
              <th className="py-3 px-4 text-right">Credit Balance ({company.currencySymbol})</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredRows.map(r => (
              <tr key={r.ledgerId} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white">{r.ledgerCode}</td>
                <td className="py-2.5 px-4 font-sans font-semibold text-slate-900 dark:text-slate-100">{r.ledgerName}</td>
                <td className="py-2.5 px-4 font-sans text-slate-500">{r.groupName}</td>
                <td className="py-2.5 px-4 text-right font-bold text-teal-600 dark:text-teal-400">
                  {r.debitBalance > 0 ? r.debitBalance.toLocaleString() : '-'}
                </td>
                <td className="py-2.5 px-4 text-right font-bold text-indigo-600 dark:text-indigo-400">
                  {r.creditBalance > 0 ? r.creditBalance.toLocaleString() : '-'}
                </td>
              </tr>
            ))}
            <tr className="bg-slate-900 text-white font-bold text-sm">
              <td colSpan={3} className="py-3.5 px-4 font-sans">TOTALS</td>
              <td className="py-3.5 px-4 text-right">{totalDebit.toLocaleString()}</td>
              <td className="py-3.5 px-4 text-right">{totalCredit.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      </div>
      </div>
    </div>
  );
};
