import React from 'react';
import { useAccounting } from '../../context/AccountingContext';
import { Printer, TrendingUp, TrendingDown, Download } from 'lucide-react';
import { downloadPDF } from '../../utils/pdfGenerator';

export const ProfitLossView: React.FC = () => {
  const { profitLoss, company, brand } = useAccounting();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <span className="text-[10px] font-bold text-teal-600 uppercase tracking-wider">{brand.name} Statement</span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Profit & Loss Account (P&L)</h2>
          <p className="text-xs text-slate-500">Trading & Income Statement for Financial Year {company.fyStart.slice(0, 4)}-{company.fyEnd.slice(0, 4)}</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => downloadPDF('pl-report', 'Profit_Loss_Statement')}
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

      {/* P&L Statement Card */}
      <div id="pl-report" className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
        
        {/* Trading Section */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-2">
            1. Operating Revenue & Direct Trading Income
          </h3>
          <div className="space-y-2 text-xs">
            {profitLoss.operatingRevenue.rows.map((r, i) => (
              <div key={i} className="flex justify-between items-center py-1">
                <span className="text-slate-700 dark:text-slate-300">{r.ledgerName}</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{company.currencySymbol}{r.amount.toLocaleString()}</span>
              </div>
            ))}
            <div className="flex justify-between items-center pt-2 font-bold text-teal-600 dark:text-teal-400 border-t border-dashed border-slate-200 dark:border-slate-800">
              <span>Total Operating Revenue</span>
              <span className="font-mono">{company.currencySymbol}{profitLoss.operatingRevenue.subtotal.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Direct Costs */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-2">
            2. Cost of Goods & Direct Expenses
          </h3>
          <div className="space-y-2 text-xs">
            {profitLoss.directExpenses.rows.map((r, i) => (
              <div key={i} className="flex justify-between items-center py-1">
                <span className="text-slate-700 dark:text-slate-300">{r.ledgerName}</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{company.currencySymbol}{r.amount.toLocaleString()}</span>
              </div>
            ))}
            <div className="flex justify-between items-center pt-2 font-bold text-rose-600 dark:text-rose-400 border-t border-dashed border-slate-200 dark:border-slate-800">
              <span>Total Direct Costs</span>
              <span className="font-mono">{company.currencySymbol}{profitLoss.directExpenses.subtotal.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Gross Profit Banner */}
        <div className="p-4 rounded-2xl bg-slate-900 text-white flex justify-between items-center font-bold text-sm shadow-md">
          <span className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-teal-400" /> GROSS PROFIT
          </span>
          <span className="font-mono text-lg text-teal-400">{company.currencySymbol}{profitLoss.grossProfit.toLocaleString()}</span>
        </div>

        {/* Indirect Expenses */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-2">
            3. Indirect Operating Expenses
          </h3>
          <div className="space-y-2 text-xs">
            {profitLoss.indirectExpenses.rows.map((r, i) => (
              <div key={i} className="flex justify-between items-center py-1">
                <span className="text-slate-700 dark:text-slate-300">{r.ledgerName}</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{company.currencySymbol}{r.amount.toLocaleString()}</span>
              </div>
            ))}
            <div className="flex justify-between items-center pt-2 font-bold text-rose-600 dark:text-rose-400 border-t border-dashed border-slate-200 dark:border-slate-800">
              <span>Total Operating Expenses</span>
              <span className="font-mono">{company.currencySymbol}{profitLoss.indirectExpenses.subtotal.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Net Profit Banner */}
        <div className={`p-5 rounded-2xl flex justify-between items-center font-bold text-base shadow-lg ${
          profitLoss.isProfit 
            ? 'bg-teal-600 text-white' 
            : 'bg-rose-600 text-white'
        }`}>
          <span className="flex items-center gap-2 uppercase tracking-wide">
            {profitLoss.isProfit ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
            {profitLoss.isProfit ? 'NET PROFIT FOR THE PERIOD' : 'NET LOSS FOR THE PERIOD'}
          </span>
          <span className="font-mono text-xl">{company.currencySymbol}{profitLoss.netProfit.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};
