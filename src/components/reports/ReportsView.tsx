import React, { useState } from 'react';
import { TrialBalanceView } from './TrialBalanceView';
import { TradingAccountView } from './TradingAccountView';
import { ProfitLossView } from './ProfitLossView';
import { BalanceSheetView } from './BalanceSheetView';
import { FileSpreadsheet, TrendingUp, ShieldCheck, ShoppingBag } from 'lucide-react';

export const ReportsView: React.FC = () => {
  const [activeReport, setActiveReport] = useState<'tb' | 'trading' | 'pnl' | 'bs'>('tb');

  const reportTabs = [
    { id: 'tb', label: 'Trial Balance', icon: FileSpreadsheet },
    { id: 'trading', label: 'Trading Account', icon: ShoppingBag },
    { id: 'pnl', label: 'Profit & Loss Statement', icon: TrendingUp },
    { id: 'bs', label: 'Balance Sheet (ICAI Schedule III)', icon: ShieldCheck }
  ];

  return (
    <div className="space-y-6">
      {/* Sub-nav */}
      <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-x-auto no-scrollbar">
        {reportTabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeReport === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveReport(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-slate-900 text-white dark:bg-teal-600 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {activeReport === 'tb' && <TrialBalanceView />}
      {activeReport === 'trading' && <TradingAccountView />}
      {activeReport === 'pnl' && <ProfitLossView />}
      {activeReport === 'bs' && <BalanceSheetView />}
    </div>
  );
};
