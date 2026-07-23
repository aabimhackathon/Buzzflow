import React, { useState } from 'react';
import { useAccounting } from '../../context/AccountingContext';
import { VOUCHER_TYPES } from '../../lib/accounting/default-coa';
import { Voucher } from '../../lib/accounting/types';
import { BookOpen, Search, Filter, PlusCircle, Eye, X, CheckCircle2 } from 'lucide-react';

export const DayBookView: React.FC = () => {
  const { vouchers, company, setActiveTab } = useAccounting();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedVoucherModal, setSelectedVoucherModal] = useState<Voucher | null>(null);

  const filteredVouchers = vouchers.filter(v => {
    const matchesSearch = 
      v.voucherNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.narration.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.items.some(i => i.ledgerName?.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = selectedType === 'all' || v.voucherType === selectedType;

    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-600" />
            Accounting Day Book
          </h2>
          <p className="text-xs text-slate-500">Chronological ledger of all posted double-entry journal vouchers</p>
        </div>

        <button
          onClick={() => setActiveTab('new-voucher')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Voucher Entry</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search voucher number, narration, or ledger name..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500 font-semibold"
          >
            <option value="all">All Voucher Types</option>
            {Object.values(VOUCHER_TYPES).map(vt => (
              <option key={vt.type} value={vt.type}>{vt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Vouchers Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold bg-slate-50 dark:bg-slate-800/60">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Voucher No</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Ledger Breakup</th>
                <th className="py-3 px-4">Narration</th>
                <th className="py-3 px-4 text-right">Amount ({company.currencySymbol})</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredVouchers.map(v => {
                const info = VOUCHER_TYPES[v.voucherType] || VOUCHER_TYPES.journal;
                const debits = v.items.filter(i => i.drCr === 'Dr');
                const credits = v.items.filter(i => i.drCr === 'Cr');

                return (
                  <tr key={v.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-400 whitespace-nowrap">{v.date}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">{v.voucherNo}</td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-md font-bold text-[10px] ${info.badgeBg}`}>
                        {info.shortCode} - {info.label.split(' ')[0]}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs space-y-0.5">
                      <div className="font-semibold text-slate-900 dark:text-slate-200 truncate">
                        Dr: {debits.map(d => d.ledgerName || d.ledgerId).join(', ')}
                      </div>
                      <div className="text-slate-500 truncate text-[11px]">
                        Cr: {credits.map(c => c.ledgerName || c.ledgerId).join(', ')}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 max-w-xs truncate">{v.narration}</td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 dark:text-white whitespace-nowrap">
                      {company.currencySymbol}{v.totalAmount.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => setSelectedVoucherModal(v)}
                        className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                        title="View Full Journal Entry"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredVouchers.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 italic">
                    No vouchers match your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Voucher Journal Detail Modal */}
      {selectedVoucherModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">
                  Journal Voucher Detail
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-mono">
                  {selectedVoucherModal.voucherNo}
                </h3>
              </div>
              <button
                onClick={() => setSelectedVoucherModal(null)}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-500">Date:</span> <strong className="text-slate-900 dark:text-white">{selectedVoucherModal.date}</strong>
              </div>
              <div>
                <span className="text-slate-500">Status:</span> <span className="text-emerald-600 font-semibold inline-flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Posted</span>
              </div>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-semibold">
                    <th className="py-2 px-3">Dr/Cr</th>
                    <th className="py-2 px-3">Account / Ledger</th>
                    <th className="py-2 px-3 text-right">Debit ({company.currencySymbol})</th>
                    <th className="py-2 px-3 text-right">Credit ({company.currencySymbol})</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {selectedVoucherModal.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className={`py-2 px-3 font-bold ${item.drCr === 'Dr' ? 'text-teal-600' : 'text-indigo-600'}`}>
                        {item.drCr}
                      </td>
                      <td className="py-2 px-3 font-sans text-slate-900 dark:text-slate-100 font-medium">
                        {item.ledgerName}
                      </td>
                      <td className="py-2 px-3 text-right font-bold text-slate-900 dark:text-white">
                        {item.drCr === 'Dr' ? item.amount.toLocaleString() : '-'}
                      </td>
                      <td className="py-2 px-3 text-right font-bold text-slate-900 dark:text-white">
                        {item.drCr === 'Cr' ? item.amount.toLocaleString() : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs text-slate-600 dark:text-slate-300 italic">
              <strong>Narration:</strong> {selectedVoucherModal.narration}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
