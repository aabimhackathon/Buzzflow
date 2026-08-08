import React, { useState, useEffect } from 'react';
import { useAccounting } from '../../context/AccountingContext';
import { FinancialCharts } from './FinancialCharts';
import { RecentActivityFeed } from './RecentActivityFeed';
import { VOUCHER_TYPES } from '../../lib/accounting/default-coa';
import { DashboardSkeleton } from '../common/SkeletonLoader';
import { BriefingEngine } from '../../ai/briefing/BriefingEngine';
import { EventIntelligenceEngine } from '../../ai/events/EventIntelligenceEngine';
import { VEPARI_ASSETS } from '../../config/assets';
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
  Bot,
  Info,
  ExternalLink,
  PieChart,
  FileSpreadsheet,
  RefreshCw,
  AlertTriangle,
  Lightbulb,
  CheckCircle2
} from 'lucide-react';

export const DashboardView: React.FC<{ onOpenAi: () => void }> = ({ onOpenAi }) => {
  const { brand, company, vouchers, ledgers, inventory, profitLoss, setActiveTab, setAccountingSubTab } = useAccounting();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [company.id]);

  // Compute Briefing & Proactive Events from Real Data
  const briefing = BriefingEngine.generateBriefing(company, vouchers, ledgers, inventory, profitLoss);
  const events = EventIntelligenceEngine.detectEvents(company, vouchers, ledgers, inventory);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

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

  const handleJumpToReport = (tab: string, subtab?: any) => {
    setActiveTab(tab);
    if (subtab) {
      setAccountingSubTab(subtab);
    }
  };

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
            onClick={() => handleJumpToReport('accounting', 'new-voucher')}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white text-slate-900 font-bold text-xs shadow-md hover:bg-slate-100 transition-all"
          >
            <PlusCircle className="w-4 h-4 text-teal-600" />
            <span>Post Voucher</span>
          </button>
          <button
            onClick={onOpenAi}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-xs backdrop-blur-md transition-all"
          >
            <Bot className="w-4 h-4 text-amber-300" />
            <span>AI Assistant</span>
          </button>
        </div>
      </div>

      {/* Jarvis-Style Executive Morning Briefing */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <img 
              src={VEPARI_ASSETS.engines.intelligence} 
              alt="Vepari AI" 
              className="w-10 h-10 rounded-xl object-cover bg-white p-0.5 border border-amber-400/40 shadow-lg shadow-amber-500/10"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight text-white">{briefing.greeting}</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  AI Business Briefing
                </span>
              </div>
              <p className="text-xs text-slate-400">While you were away — Vepari AI intelligence report for {company.name}</p>
            </div>
          </div>
          <button
            onClick={onOpenAi}
            className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-all flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Command Vepari AI</span>
          </button>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed">{briefing.summary}</p>

        {/* Briefing Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {briefing.highlights.map((hl, idx) => (
            <div key={idx} className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-[10px] text-slate-400 block uppercase font-medium">{hl.label}</span>
              <span className="text-base font-bold text-white mt-0.5 block">{hl.value}</span>
            </div>
          ))}
        </div>

        {/* Priority Recommended Action */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-amber-300 block">Priority Recommendation</span>
              <p className="text-xs text-slate-300 mt-0.5">{briefing.recommendedAction.description}</p>
            </div>
          </div>
          <button
            onClick={() => handleJumpToReport(briefing.recommendedAction.targetTab || 'accounting', briefing.recommendedAction.targetSubTab)}
            className="px-3 py-1.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs shrink-0 flex items-center gap-1"
          >
            <span>{briefing.recommendedAction.title}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid with Interactive Hover-Tooltips */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Widget 1: Operating Revenue */}
        <div className="group relative bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-700 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-medium text-slate-500">Operating Revenue</p>
                <Info className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-500 transition-colors" />
              </div>
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

          {/* Hover Tooltip Popup Card */}
          <div className="absolute left-0 right-0 top-full mt-2 z-30 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-700 text-xs space-y-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
              <span className="font-bold text-emerald-400 flex items-center gap-1">
                <FileSpreadsheet className="w-3.5 h-3.5" /> Source Data Summary
              </span>
              <span className="text-[10px] text-slate-400 font-mono">P&L Engine</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Aggregated total from Sales & Revenue ledgers (Group: Sales Accounts). Reflects gross income from invoices and sales vouchers posted in the current FY.
            </p>
            <button
              onClick={() => handleJumpToReport('reports')}
              className="w-full mt-1 pt-1.5 border-t border-slate-800 text-teal-300 hover:text-white font-bold flex items-center justify-between text-[11px] transition-colors"
            >
              <span>View Profit & Loss Report</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Widget 2: Net Profit / Income */}
        <div className="group relative bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-teal-300 dark:hover:border-teal-700 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-medium text-slate-500">Net Profit / Income</p>
                <Info className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-500 transition-colors" />
              </div>
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

          {/* Hover Tooltip Popup Card */}
          <div className="absolute left-0 right-0 top-full mt-2 z-30 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-700 text-xs space-y-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
              <span className="font-bold text-teal-400 flex items-center gap-1">
                <PieChart className="w-3.5 h-3.5" /> Source Data Summary
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Trading & P&L</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Net surplus calculated as Gross Profit minus Indirect Operating Expenses (Salaries, Rent, Utilities, Depreciation).
            </p>
            <button
              onClick={() => handleJumpToReport('reports')}
              className="w-full mt-1 pt-1.5 border-t border-slate-800 text-teal-300 hover:text-white font-bold flex items-center justify-between text-[11px] transition-colors"
            >
              <span>View Detailed P&L Breakdown</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Widget 3: Cash & Bank Balance */}
        <div className="group relative bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-blue-300 dark:hover:border-blue-700 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-medium text-slate-500">Cash & Bank Balance</p>
                <Info className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 transition-colors" />
              </div>
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

          {/* Hover Tooltip Popup Card */}
          <div className="absolute left-0 right-0 top-full mt-2 z-30 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-700 text-xs space-y-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
              <span className="font-bold text-blue-400 flex items-center gap-1">
                <Landmark className="w-3.5 h-3.5" /> Source Data Summary
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Bank Registers</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Combined real-time closing balance of Cash-in-Hand and primary liquid Bank Accounts (HDFC, SBI, Petty Cash).
            </p>
            <button
              onClick={() => handleJumpToReport('finance')}
              className="w-full mt-1 pt-1.5 border-t border-slate-800 text-teal-300 hover:text-white font-bold flex items-center justify-between text-[11px] transition-colors"
            >
              <span>Open Banking & Liquidity Engine</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Widget 4: Receivables vs Payables */}
        <div className="group relative bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-amber-300 dark:hover:border-amber-700 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-medium text-slate-500">Receivables (Debtors)</p>
                <Info className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-500 transition-colors" />
              </div>
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

          {/* Hover Tooltip Popup Card */}
          <div className="absolute left-0 right-0 top-full mt-2 z-30 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-700 text-xs space-y-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
              <span className="font-bold text-amber-400 flex items-center gap-1">
                <Users className="w-3.5 h-3.5" /> Source Data Summary
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Party Ledgers</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Sum of outstanding balances across all Sundry Debtors (Customers) vs Sundry Creditors (Suppliers & Vendors).
            </p>
            <button
              onClick={() => handleJumpToReport('finance')}
              className="w-full mt-1 pt-1.5 border-t border-slate-800 text-teal-300 hover:text-white font-bold flex items-center justify-between text-[11px] transition-colors"
            >
              <span>View Debtors & Creditors Aging</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>

      {/* Visual Charts */}
      <FinancialCharts />

      {/* Recent Activity Feed Component (Task 1) */}
      <RecentActivityFeed />

      {/* Recent Day Book / Vouchers Feed */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-teal-600" />
              Recent Voucher Activity
            </h3>
            <p className="text-xs text-slate-500">Latest posted double-entry journal entries</p>
          </div>

          <button
            onClick={() => handleJumpToReport('accounting', 'daybook')}
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
