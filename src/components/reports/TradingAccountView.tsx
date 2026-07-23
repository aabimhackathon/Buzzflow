import React from 'react';
import { useAccounting } from '../../context/AccountingContext';
import { generateTradingAccount } from '../../lib/accounting/report-engine';
import { Printer, Download, BookOpen } from 'lucide-react';
import { downloadPDF } from '../../utils/pdfGenerator';

export const TradingAccountView: React.FC = () => {
  const { ledgers, company, brand } = useAccounting();
  const trading = generateTradingAccount(ledgers);

  const totalDebitSide = trading.openingStock + trading.purchases + trading.directExpenses + (trading.isGrossProfit ? trading.grossProfit : 0);
  const totalCreditSide = trading.sales + trading.closingStock + (!trading.isGrossProfit ? trading.grossProfit : 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <span className="text-[10px] font-bold text-teal-600 uppercase tracking-wider">{brand.name} ICAI Prescribed Report</span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Trading Account Statement</h2>
          <p className="text-xs text-slate-500">For the Financial Period {company.fyStart} to {company.fyEnd}</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => downloadPDF('trading-report', 'Trading_Account')}
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

      <div id="trading-report" className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs font-bold text-slate-800 dark:text-white">
          <span>Dr. (DEBIT SIDE) - Costs & Expenses</span>
          <span>Cr. (CREDIT SIDE) - Sales & Stock</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800 text-xs font-mono">
          {/* Debit Side */}
          <div className="p-4 space-y-3">
            <div className="flex justify-between font-bold text-slate-900 dark:text-white">
              <span>To Opening Stock</span>
              <span>{company.currencySymbol}{trading.openingStock.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-bold text-slate-900 dark:text-white">
              <span>To Purchases Account</span>
              <span>{company.currencySymbol}{trading.purchases.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-bold text-slate-900 dark:text-white">
              <span>To Direct Expenses (Freight, Wages)</span>
              <span>{company.currencySymbol}{trading.directExpenses.toLocaleString()}</span>
            </div>

            {trading.isGrossProfit && (
              <div className="flex justify-between font-bold text-emerald-600 dark:text-emerald-400 pt-4 border-t border-dashed border-slate-200 dark:border-slate-800">
                <span>To Gross Profit c/d (transferred to P&L)</span>
                <span>{company.currencySymbol}{trading.grossProfit.toLocaleString()}</span>
              </div>
            )}
          </div>

          {/* Credit Side */}
          <div className="p-4 space-y-3">
            <div className="flex justify-between font-bold text-slate-900 dark:text-white">
              <span>By Sales Account</span>
              <span>{company.currencySymbol}{trading.sales.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-bold text-slate-900 dark:text-white">
              <span>By Closing Stock</span>
              <span>{company.currencySymbol}{trading.closingStock.toLocaleString()}</span>
            </div>

            {!trading.isGrossProfit && (
              <div className="flex justify-between font-bold text-rose-600 dark:text-rose-400 pt-4 border-t border-dashed border-slate-200 dark:border-slate-800">
                <span>By Gross Loss c/d (transferred to P&L)</span>
                <span>{company.currencySymbol}{trading.grossProfit.toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Totals Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 border-t border-slate-200 dark:border-slate-800 bg-slate-900 text-white font-bold text-sm font-mono">
          <div className="p-3.5 flex justify-between">
            <span>TOTAL DEBIT</span>
            <span>{company.currencySymbol}{totalDebitSide.toLocaleString()}</span>
          </div>
          <div className="p-3.5 flex justify-between border-t md:border-t-0 md:border-l border-slate-700">
            <span>TOTAL CREDIT</span>
            <span>{company.currencySymbol}{totalCreditSide.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
