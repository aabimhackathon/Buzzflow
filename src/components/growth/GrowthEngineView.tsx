import React from 'react';
import { useAccounting } from '../../context/AccountingContext';
import { VEPARI_ASSETS } from '../../config/assets';
import { TrendingUp, Sparkles, Users, Package, ArrowUpRight, Target, Lightbulb, Zap } from 'lucide-react';

export const GrowthEngineView: React.FC = () => {
  const { activeCompany, customers, inventory, setActiveTab, setAccountingSubTab } = useAccounting();

  const growthOpportunities = [
    {
      id: 'growth-1',
      title: 'Customer Cross-Sell Opportunity',
      type: 'REVENUE_EXPANSION',
      description: '3 top recurring customers (including Apex Traders) regularly order Category A SKUs but have not purchased Complementary SKUs yet.',
      potentialRevenue: `${activeCompany.currencySymbol}75,000`,
      priority: 'HIGH',
      actionLabel: 'Generate Targeted Quotations',
      targetTab: 'billing'
    },
    {
      id: 'growth-2',
      title: 'Slow-Moving Stock Liquidation Scheme',
      type: 'INVENTORY_OPTIMIZATION',
      description: '2 SKUs have remained in warehouse for >60 days. Re-bundling them with fast-movers at a 5% discount frees up ₹32,000 in tied working capital.',
      potentialRevenue: `${activeCompany.currencySymbol}32,000`,
      priority: 'MEDIUM',
      actionLabel: 'View Slow Moving SKUs',
      targetTab: 'accounting',
      targetSubTab: 'inventory'
    },
    {
      id: 'growth-3',
      title: 'Repeat Purchase Incentive Automation',
      type: 'CUSTOMER_RETENTION',
      description: 'Set up automated WhatsApp invoice reminders with 1.5% early payment discount terms to improve cash collection cycle by 8 days.',
      potentialRevenue: 'Accelerates Cash Cycle',
      priority: 'HIGH',
      actionLabel: 'Configure Incentive Rules',
      targetTab: 'automation'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-1 flex items-center justify-center overflow-hidden shrink-0">
            <img 
              src={VEPARI_ASSETS.engines.growth} 
              alt="Growth Engine" 
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white">Vepari Growth Engine</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Revenue & Sales Intelligence
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Automated sales expansion triggers, customer upsell recommendations & inventory turnover optimization
            </p>
          </div>
        </div>

        <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-1.5 self-start md:self-auto">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span>Growth Potential: +14.2% YoY</span>
        </div>
      </div>

      {/* Opportunities List */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Target className="w-4 h-4 text-emerald-600" />
          <span>AI-Identative Business Growth Opportunities</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {growthOpportunities.map(opp => (
            <div key={opp.id} className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="px-2 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    {opp.type}
                  </span>
                  <span className="font-bold text-emerald-600">{opp.potentialRevenue}</span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                  {opp.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {opp.description}
                </p>
              </div>

              <button
                onClick={() => {
                  setActiveTab(opp.targetTab);
                  if (opp.targetSubTab) setAccountingSubTab(opp.targetSubTab as any);
                }}
                className="w-full py-2 px-3 rounded-xl bg-slate-900 dark:bg-slate-800 text-white hover:bg-emerald-600 dark:hover:bg-emerald-600 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 mt-2"
              >
                <span>{opp.actionLabel}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
