import React, { useState } from 'react';
import { useAccounting, AccountingSubTab } from '../../context/AccountingContext';
import { DayBookView } from '../vouchers/DayBookView';
import { NewVoucherForm } from '../vouchers/NewVoucherForm';
import { ChartOfAccountsView } from '../accounts/ChartOfAccountsView';
import { ReportsView } from '../reports/ReportsView';
import { BillingView } from '../billing/BillingView';
import { InventoryView } from '../inventory/InventoryView';
import { TaxAndBrsView } from '../tax/TaxAndBrsView';
import { SupabaseSqlModal } from '../supabase/SupabaseSqlModal';
import { BookOpen, PlusCircle, FolderTree, FileSpreadsheet, Receipt, Package, Landmark, Database } from 'lucide-react';

export const AccountingEngineView: React.FC = () => {
  const { accountingSubTab, setAccountingSubTab } = useAccounting();
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);

  const subTab = accountingSubTab;
  const setSubTab = setAccountingSubTab;

  return (
    <div className="space-y-6">
      {/* Navigation Sub-Bar */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setSubTab('daybook')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${subTab === 'daybook' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}`}
          >
            <BookOpen className="w-4 h-4" /> Day Book
          </button>
          <button
            onClick={() => setSubTab('new-voucher')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${subTab === 'new-voucher' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}`}
          >
            <PlusCircle className="w-4 h-4" /> New Voucher
          </button>
          <button
            onClick={() => setSubTab('billing')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${subTab === 'billing' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}`}
          >
            <Receipt className="w-4 h-4" /> GST Billing Software
          </button>
          <button
            onClick={() => setSubTab('inventory')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${subTab === 'inventory' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}`}
          >
            <Package className="w-4 h-4" /> Inventory
          </button>
          <button
            onClick={() => setSubTab('coa')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${subTab === 'coa' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}`}
          >
            <FolderTree className="w-4 h-4" /> Chart of Accounts
          </button>
          <button
            onClick={() => setSubTab('reports')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${subTab === 'reports' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}`}
          >
            <FileSpreadsheet className="w-4 h-4" /> ICAI Reports
          </button>
          <button
            onClick={() => setSubTab('tax-brs')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${subTab === 'tax-brs' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}`}
          >
            <Landmark className="w-4 h-4 text-amber-500" /> BRS & Taxation
          </button>
        </div>

        <button
          onClick={() => setIsSupabaseModalOpen(true)}
          className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-100 hover:bg-emerald-200 text-emerald-800 dark:bg-emerald-950 dark:hover:bg-emerald-900 dark:text-emerald-300 flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-all"
        >
          <Database className="w-4 h-4" />
          <span>Supabase SQL Query</span>
        </button>
      </div>

      <div>
        {subTab === 'daybook' && <DayBookView />}
        {subTab === 'new-voucher' && <NewVoucherForm />}
        {subTab === 'billing' && <BillingView />}
        {subTab === 'inventory' && <InventoryView />}
        {subTab === 'coa' && <ChartOfAccountsView />}
        {subTab === 'reports' && <ReportsView />}
        {subTab === 'tax-brs' && <TaxAndBrsView />}
      </div>

      <SupabaseSqlModal isOpen={isSupabaseModalOpen} onClose={() => setIsSupabaseModalOpen(false)} />
    </div>
  );
};
