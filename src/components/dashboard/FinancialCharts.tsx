import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { useAccounting } from '../../context/AccountingContext';

export const FinancialCharts: React.FC = () => {
  const { profitLoss, ledgers, company } = useAccounting();

  // Monthly Cash Flow chart data
  const comparisonData = [
    {
      month: 'May 2026',
      Inflow: 85000,
      Outflow: 42000,
      NetCash: 43000
    },
    {
      month: 'Jun 2026',
      Inflow: 105000,
      Outflow: 58000,
      NetCash: 47000
    },
    {
      month: 'Jul 2026',
      Inflow: profitLoss.operatingRevenue.subtotal,
      Outflow: profitLoss.directExpenses.subtotal + profitLoss.indirectExpenses.subtotal,
      NetCash: profitLoss.netProfit
    }
  ];

  // Group Expenses distribution for Pie Chart
  const expenseLedgers = ledgers.filter(l => l.category === 'Expenses' && l.currentBalance > 0);
  const pieData = expenseLedgers.map(l => ({
    name: l.name,
    value: l.currentBalance
  }));

  const COLORS = ['#C8A96B', '#5A6B4F', '#8A703C', '#A7B69C', '#52401E', '#C8D1C0'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-6">
      {/* Bar Chart: Financial Performance */}
      <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Cash Flow Over Time</h3>
            <p className="text-xs text-slate-500">Monthly cash inflow vs outflow ({company.currencySymbol})</p>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip 
                formatter={(val: number) => [`${company.currencySymbol}${val.toLocaleString()}`, '']}
                contentStyle={{ borderRadius: '12px', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
              <Bar dataKey="Inflow" fill="#C8A96B" radius={[6, 6, 0, 0]} name="Cash Inflow" />
              <Bar dataKey="Outflow" fill="#5A6B4F" radius={[6, 6, 0, 0]} name="Cash Outflow" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Chart: Expense Breakdown */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Operating Expense Allocation</h3>
          <p className="text-xs text-slate-500 mb-2">Category distribution of current expenses</p>
        </div>

        <div className="h-52 w-full flex items-center justify-center">
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(val: number) => [`${company.currencySymbol}${val.toLocaleString()}`, 'Amount']} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-slate-400 text-xs text-center italic">No expense balances recorded yet.</div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px]">
          {pieData.slice(0, 4).map((entry, idx) => (
            <div key={idx} className="flex items-center gap-1.5 truncate">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
              <span className="text-slate-600 dark:text-slate-400 truncate">{entry.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
