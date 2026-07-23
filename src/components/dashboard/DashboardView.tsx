import React from 'react';
import { useAccounting } from '../../context/AccountingContext';
import { FinancialCharts } from './FinancialCharts';
import { VOUCHER_TYPES } from '../../lib/accounting/default-coa';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Landmark, 
  Users, 
  PlusCircle, 
  ArrowRight,
  BookOpen,
  Sparkles,
  Bot
} from 'lucide-react';

export const DashboardView: React.FC<{ onOpenAi: () => void }> = ({ onOpenAi }) => {
  const { brand, company, vouchers, ledgers, profitLoss, setActiveTab } = useAccounting();

  // Receivables (Debtors) & Payables (Creditors)
  const debtors = ledgers.filter(l => l.groupId === 'grp-debtors');
  const creditors = ledgers.filter(l => l.groupId === 'grp-creditors');
  const cashAndBank = ledgers.filter(l => l.groupId === 'grp-cash' || l.groupId === 'grp-bank');

  const totalReceivables = debtors.reduce((sum, d) => sum + d.currentBalance, 0);
  const totalPayables = creditors.reduce((sum, c) => sum + c.currentBalance, 0);
  const totalCashBank = cashAndBank.reduce((sum, cb) => sum + cb.currentBalance, 0);

  const profitMargin = profitLoss.operatingRevenue.subtotal > 0
    ? ((profitLoss.netProfit / profitLoss.operatingRevenue.subtotal) * 100).toFixed(1)
    : '0.0';

  const recentVouchers = vouchers.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className={`p-6 rounded-3xl bg-gradient-to-r ${brand.gradient} text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4`}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 backdrop-blur-md uppercase tracking-wider">
              {brand.badgeText}
            </span>
            <span className="text-xs text-white/80">Financial Year {company.fyStart.slice(0, 4)}-{company.fyEnd.slice(0, 4)}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {brand.name} Overview
          </h1>
          <p className="text-xs sm:text-sm text-white/80 max-w-xl mt-1">
            {brand.shortDesc}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('new-voucher')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-slate-900 font-bold text-xs shadow-lg hover:bg-slate-100 transition-all"
          >
            <PlusCircle className="w-4 h-4 text-teal-600" />
            <span>New Voucher Entry</span>
          </button>
          <button
            onClick={onOpenAi}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/40 hover:bg-slate-900/60 text-white font-semibold text-xs border border-white/20 backdrop-blur-md transition-all"
          >
            <Bot className="w-4 h-4 text-amber-300" />
            <span>AI Accountant</span>
            <Sparkles className="w-3 h-3 text-amber-300" />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Operating Revenue</p>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
              {company.currencySymbol}{profitLoss.operatingRevenue.subtotal.toLocaleString()}
            </h3>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> Sales Accounts
            </span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Net Profit */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Net Profit / Income</p>
            <h3 className={`text-xl font-bold mt-1 ${profitLoss.isProfit ? 'text-teal-600 dark:text-teal-400' : 'text-rose-600'}`}>
              {company.currencySymbol}{profitLoss.netProfit.toLocaleString()}
            </h3>
            <span className="text-[11px] text-slate-500 font-medium mt-1 block">
              Margin: <strong className="text-slate-900 dark:text-white">{profitMargin}%</strong>
            </span>
          </div>
          <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Cash & Bank Balance */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Cash & Bank Balance</p>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
              {company.currencySymbol}{totalCashBank.toLocaleString()}
            </h3>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Liquidity Reserve
            </span>
          </div>
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
            <Landmark className="w-6 h-6" />
          </div>
        </div>

        {/* Receivables vs Payables */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Receivables (Debtors)</p>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
              {company.currencySymbol}{totalReceivables.toLocaleString()}
            </h3>
            <span className="text-[11px] text-rose-500 mt-1 block">
              Payables: <strong>{company.currencySymbol}{totalPayables.toLocaleString()}</strong>
            </span>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Visual Charts */}
      <FinancialCharts />

      {/* Recent Day Book / Vouchers Feed */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-teal-600" />
              Recent Voucher Activity
            </h3>
            <p className="text-xs text-slate-500">Latest posted double-entry journal entries</p>
          </div>

          <button
            onClick={() => setActiveTab('daybook')}
            className="flex items-center gap-1 text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline"
          >
            <span>View Full Day Book</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold bg-slate-50 dark:bg-slate-800/50">
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Voucher No</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Narration</th>
                <th className="py-2.5 px-3 text-right">Amount ({company.currencySymbol})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {recentVouchers.map(v => {
                const info = VOUCHER_TYPES[v.voucherType] || VOUCHER_TYPES.journal;
                return (
                  <tr key={v.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-400">{v.date}</td>
                    <td className="py-3 px-3 font-mono font-semibold text-slate-900 dark:text-white">{v.voucherNo}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-md font-semibold text-[10px] ${info.badgeBg}`}>
                        {info.shortCode} - {info.label.split(' ')[0]}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300 max-w-xs truncate">{v.narration}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                      {company.currencySymbol}{v.totalAmount.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
