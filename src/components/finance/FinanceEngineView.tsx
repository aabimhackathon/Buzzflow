import React, { useState } from 'react';
import { Lightbulb, FileText, Wrench, Briefcase, TrendingDown, TrendingUp, Activity } from 'lucide-react';
import { useAccounting } from '../../context/AccountingContext';
import { VEPARI_ASSETS } from '../../config/assets';

export const FinanceEngineView: React.FC = () => {
  const { ledgers, company } = useAccounting();
  const [subTab, setSubTab] = useState<'health' | 'suggestions' | 'records' | 'maintenance' | 'management' | 'cashflow' | 'outflow'>('health');

  // Calculate Health Metrics
  const currentAssets = ledgers
    .filter(l => ['grp-ca', 'grp-cash', 'grp-bank', 'grp-debtors', 'grp-inv', 'grp-gst-input'].includes(l.groupId))
    .reduce((sum, l) => sum + l.currentBalance, 0);

  const currentLiabilities = ledgers
    .filter(l => ['grp-cl', 'grp-creditors', 'grp-duties', 'grp-prov'].includes(l.groupId))
    .reduce((sum, l) => sum + l.currentBalance, 0);

  const totalLiabilities = ledgers
    .filter(l => l.category === 'Liabilities')
    .reduce((sum, l) => sum + l.currentBalance, 0);

  const totalEquity = ledgers
    .filter(l => l.category === 'Equity')
    .reduce((sum, l) => sum + l.currentBalance, 0); // Simplified for this demo

  const liquidityRatio = currentLiabilities > 0 ? (currentAssets / currentLiabilities).toFixed(2) : 'N/A';
  const debtToEquity = totalEquity > 0 ? (totalLiabilities / totalEquity).toFixed(2) : 'N/A';
  const workingCapital = currentAssets - currentLiabilities;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-slate-200 dark:border-slate-800 pb-2">
        <button onClick={() => setSubTab('health')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${subTab === 'health' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}`}>
          <Activity className="w-4 h-4" /> Health Check
        </button>
        <button onClick={() => setSubTab('suggestions')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${subTab === 'suggestions' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}`}>
          <Lightbulb className="w-4 h-4" /> Suggestions
        </button>
        <button onClick={() => setSubTab('records')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${subTab === 'records' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}`}>
          <FileText className="w-4 h-4" /> Records
        </button>
        <button onClick={() => setSubTab('maintenance')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${subTab === 'maintenance' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}`}>
          <Wrench className="w-4 h-4" /> Maintenance
        </button>
        <button onClick={() => setSubTab('management')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${subTab === 'management' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}`}>
          <Briefcase className="w-4 h-4" /> Management
        </button>
        <button onClick={() => setSubTab('cashflow')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${subTab === 'cashflow' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}`}>
          <TrendingUp className="w-4 h-4" /> Cash Inflow
        </button>
        <button onClick={() => setSubTab('outflow')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${subTab === 'outflow' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}`}>
          <TrendingDown className="w-4 h-4" /> Cash Outflow
        </button>
      </div>

      <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {subTab === 'health' && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img 
                src={VEPARI_ASSETS.engines.finance} 
                alt="Finance Engine" 
                className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700 bg-white p-0.5 shadow-sm"
              />
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Financial Health Check</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Powered by Vepari AI Finance Engine</p>
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-400 mb-6">Real-time analysis of your company's liquidity and solvency metrics.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/20">
                <p className="text-sm font-semibold text-indigo-800 dark:text-indigo-300">Liquidity Ratio</p>
                <h3 className="text-2xl font-bold text-indigo-900 dark:text-white mt-2">{liquidityRatio}</h3>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-2">Target: &gt; 1.0 (Current Assets / Current Liab.)</p>
              </div>
              
              <div className="p-5 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20">
                <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">Working Capital</p>
                <h3 className="text-2xl font-bold text-emerald-900 dark:text-white mt-2">{company.currencySymbol}{workingCapital.toLocaleString()}</h3>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2">Available for day-to-day operations</p>
              </div>
              
              <div className="p-5 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20">
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">Debt-to-Equity Ratio</p>
                <h3 className="text-2xl font-bold text-amber-900 dark:text-white mt-2">{debtToEquity}</h3>
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">Leverage measure</p>
              </div>
            </div>
          </div>
        )}
        {subTab === 'suggestions' && (
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Financial Suggestions</h2>
            <p className="text-slate-600 dark:text-slate-400">AI-driven recommendations for improving liquidity, optimizing taxes, and reducing overhead costs based on recent ledgers.</p>
            {/* Placeholder for suggestions */}
            <div className="mt-4 grid gap-4">
              <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50">
                <h4 className="font-semibold text-emerald-800 dark:text-emerald-300">Optimize Tax Deductions</h4>
                <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">Consider pre-paying upcoming software subscriptions to claim expenses in the current financial year.</p>
              </div>
            </div>
          </div>
        )}
        {subTab === 'records' && (
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Financial Records</h2>
            <p className="text-slate-600 dark:text-slate-400">Secure repository for all financial documents, bank statements, and tax filings.</p>
          </div>
        )}
        {subTab === 'maintenance' && (
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Financial Maintenance</h2>
            <p className="text-slate-600 dark:text-slate-400">Routine checks on ledger reconciliation, anomaly detection, and account health.</p>
          </div>
        )}
        {subTab === 'management' && (
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Financial Management</h2>
            <p className="text-slate-600 dark:text-slate-400">Budget allocations, departmental limits, and financial planning controls.</p>
          </div>
        )}
        {subTab === 'cashflow' && (
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Cash Inflow Analytics</h2>
            <p className="text-slate-600 dark:text-slate-400">Tracking and forecasting of all incoming revenue streams and receivables.</p>
          </div>
        )}
        {subTab === 'outflow' && (
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Cash Outflow Management</h2>
            <p className="text-slate-600 dark:text-slate-400">Analysis of payables, operational expenses, and capital expenditures.</p>
          </div>
        )}
      </div>
    </div>
  );
};
