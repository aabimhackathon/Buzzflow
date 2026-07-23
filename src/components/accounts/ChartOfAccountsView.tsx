import React, { useState } from 'react';
import { useAccounting } from '../../context/AccountingContext';
import { NewLedgerModal } from './NewLedgerModal';
import { AccountCategory } from '../../lib/accounting/types';
import { FolderTree, Search, PlusCircle, CheckCircle2 } from 'lucide-react';

export const ChartOfAccountsView: React.FC = () => {
  const { ledgers, company } = useAccounting();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AccountCategory | 'All'>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories: (AccountCategory | 'All')[] = ['All', 'Assets', 'Liabilities', 'Equity', 'Revenue', 'Expenses'];

  const filteredLedgers = ledgers.filter(l => {
    const matchesCategory = selectedCategory === 'All' || l.category === selectedCategory;
    const matchesSearch = 
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.groupName.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FolderTree className="w-5 h-5 text-teal-600" />
            Chart of Accounts (COA)
          </h2>
          <p className="text-xs text-slate-500">Structured master database of 50+ double-entry financial ledger accounts</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Custom Ledger</span>
        </button>
      </div>

      {/* Category Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar w-full sm:w-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white dark:bg-teal-600 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search account code or title..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Accounts List Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold bg-slate-50 dark:bg-slate-800/60">
                <th className="py-3 px-4 w-20">Code</th>
                <th className="py-3 px-4">Account Title / Ledger</th>
                <th className="py-3 px-4">Parent Group</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Opening Bal ({company.currencySymbol})</th>
                <th className="py-3 px-4 text-right">Current Bal ({company.currencySymbol})</th>
                <th className="py-3 px-4 text-center">Nature</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredLedgers.map(l => (
                <tr key={l.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">{l.code}</td>
                  <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">
                    <div className="flex items-center gap-2">
                      <span>{l.name}</span>
                      {l.isSystem && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                          System
                        </span>
                      )}
                      {l.gstin && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300">
                          GST: {l.gstin}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400 font-medium">{l.groupName}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {l.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-500">
                    {l.openingBalance.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                    {l.currentBalance.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                      l.nature === 'debit' ? 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300' : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                    }`}>
                      {l.nature.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <NewLedgerModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
