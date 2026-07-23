import React, { useState } from 'react';
import { useAccounting, AccountingSubTab } from '../../context/AccountingContext';
import { DayBookView } from '../vouchers/DayBookView';
import { NewVoucherForm } from '../vouchers/NewVoucherForm';
import { ChartOfAccountsView } from '../accounts/ChartOfAccountsView';
import { ReportsView } from '../reports/ReportsView';
import { BillingView } from '../billing/BillingView';
import { InventoryView } from '../inventory/InventoryView';
import { TaxAndBrsView } from '../tax/TaxAndBrsView';
import { BankingAndCashView } from './BankingAndCashView';
import { DebtorsAndCreditorsView } from './DebtorsAndCreditorsView';
import { BookOpen, PlusCircle, FolderTree, FileSpreadsheet, Receipt, Package, Landmark, Landmark as BankIcon, Users } from 'lucide-react';

interface Props {
  defaultSubTab?: AccountingSubTab;
}

export const AccountingEngineView: React.FC<Props> = ({ defaultSubTab }) => {
  const { accountingSubTab, setAccountingSubTab } = useAccounting();

  const subTab = defaultSubTab || accountingSubTab;
  const setSubTab = setAccountingSubTab;

  return (
    <div className="space-y-6">
      {/* Navigation Sub-Bar */}
      <div className="flex items-center justify-between gap-2 border-b border-[#D8E2EE] dark:border-slate-800 pb-2 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setSubTab('daybook')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${subTab === 'daybook' ? 'bg-[#163A70] text-white shadow-md' : 'text-[#5B6878] hover:bg-[#EEF3F8]'}`}
          >
            <BookOpen className="w-4 h-4 text-[#16B8A6]" /> Day Book
          </button>
          <button
            onClick={() => setSubTab('new-voucher')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${subTab === 'new-voucher' ? 'bg-[#163A70] text-white shadow-md' : 'text-[#5B6878] hover:bg-[#EEF3F8]'}`}
          >
            <PlusCircle className="w-4 h-4 text-[#16B8A6]" /> New Voucher
          </button>
          <button
            onClick={() => setSubTab('banking-cash')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${subTab === 'banking-cash' ? 'bg-[#163A70] text-white shadow-md' : 'text-[#5B6878] hover:bg-[#EEF3F8]'}`}
          >
            <BankIcon className="w-4 h-4 text-[#16B8A6]" /> Bank & Cash Flow
          </button>
          <button
            onClick={() => setSubTab('debtors-creditors')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${subTab === 'debtors-creditors' ? 'bg-[#163A70] text-white shadow-md' : 'text-[#5B6878] hover:bg-[#EEF3F8]'}`}
          >
            <Users className="w-4 h-4 text-[#2F6FED]" /> Debtors & Creditors
          </button>
          <button
            onClick={() => setSubTab('billing')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${subTab === 'billing' ? 'bg-[#163A70] text-white shadow-md' : 'text-[#5B6878] hover:bg-[#EEF3F8]'}`}
          >
            <Receipt className="w-4 h-4 text-[#6C63FF]" /> GST Billing
          </button>
          <button
            onClick={() => setSubTab('inventory')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${subTab === 'inventory' ? 'bg-[#163A70] text-white shadow-md' : 'text-[#5B6878] hover:bg-[#EEF3F8]'}`}
          >
            <Package className="w-4 h-4 text-[#D9A227]" /> Inventory
          </button>
          <button
            onClick={() => setSubTab('coa')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${subTab === 'coa' ? 'bg-[#163A70] text-white shadow-md' : 'text-[#5B6878] hover:bg-[#EEF3F8]'}`}
          >
            <FolderTree className="w-4 h-4 text-[#2F6FED]" /> Chart of Accounts
          </button>
          <button
            onClick={() => setSubTab('reports')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${subTab === 'reports' ? 'bg-[#163A70] text-white shadow-md' : 'text-[#5B6878] hover:bg-[#EEF3F8]'}`}
          >
            <FileSpreadsheet className="w-4 h-4 text-[#7B61FF]" /> Reports
          </button>
          <button
            onClick={() => setSubTab('tax-brs')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${subTab === 'tax-brs' ? 'bg-[#163A70] text-white shadow-md' : 'text-[#5B6878] hover:bg-[#EEF3F8]'}`}
          >
            <Landmark className="w-4 h-4 text-[#F59E0B]" /> BRS & Taxation
          </button>
        </div>
      </div>

      <div>
        {subTab === 'daybook' && <DayBookView />}
        {subTab === 'new-voucher' && <NewVoucherForm />}
        {subTab === 'banking-cash' && <BankingAndCashView />}
        {subTab === 'debtors-creditors' && <DebtorsAndCreditorsView />}
        {subTab === 'billing' && <BillingView />}
        {subTab === 'inventory' && <InventoryView />}
        {subTab === 'coa' && <ChartOfAccountsView />}
        {subTab === 'reports' && <ReportsView />}
        {subTab === 'tax-brs' && <TaxAndBrsView />}
      </div>
    </div>
  );
};
