import React, { useState } from 'react';
import { useAccounting } from '../../context/AccountingContext';
import { VEPARI_ASSETS } from '../../config/assets';
import { TrendingUp, TrendingDown, Globe, ShieldAlert, Sparkles, Clock, ExternalLink, RefreshCw, BarChart2, DollarSign, Tag } from 'lucide-react';

export const MarketEngineView: React.FC = () => {
  const { activeCompany } = useAccounting();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const marketUpdates = [
    {
      id: 'mkt-1',
      source: 'GST Council Advisory & Ministry of Finance',
      category: 'GST Tax Policy',
      title: 'Clarification on Input Tax Credit (ITC) Matching Rules for MSMEs',
      summary: 'GSTR-2B automated reconciliation mandate enforced. Input tax credit claims must match supplier filings within 180 days to avoid interest penalties.',
      impact: 'Positive for compliance; check GSTR-2A supplier status.',
      timestamp: 'Today, 08:30 AM',
      indicator: 'TAX_ALERT'
    },
    {
      id: 'mkt-2',
      source: 'BSE Commodities & National Index',
      category: 'Raw Materials & Packaging',
      title: 'Polymers & Packaging Paper Board Prices Soften by 2.4%',
      summary: 'Global freight index reduction leads to lower import prices for industrial packaging paper and polypropylene raw material granules.',
      impact: 'Favorable cost reduction for inventory procurement.',
      timestamp: 'Yesterday, 04:15 PM',
      indicator: 'PRICE_CHANGE'
    },
    {
      id: 'mkt-3',
      source: 'Reserve Bank of India (RBI)',
      category: 'Credit & Lending Rates',
      title: 'Repo Rate Unchanged; MSME CGTMSE Credit Scheme Limit Raised',
      summary: 'Collateral-free CGTMSE credit guarantee ceiling raised to ₹5 Crore for manufacturing MSMEs with sub-vented interest rates.',
      impact: 'Expansion loan opportunity at lower borrowing cost.',
      timestamp: '2 days ago',
      indicator: 'ECONOMIC_INSIGHT'
    }
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 p-1 flex items-center justify-center overflow-hidden shrink-0">
            <img 
              src={VEPARI_ASSETS.engines.market} 
              alt="Market Engine" 
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white">Vepari Market Engine</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                External Macro Intelligence
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Real-time commodity price tracking, GST policy updates, sector benchmarks & economic indicators
            </p>
          </div>
        </div>

        <button
          onClick={handleRefresh}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-2 transition-colors self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-blue-400 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh Market Feeds</span>
        </button>
      </div>

      {/* AI Market Interpretation Summary Card */}
      <div className="bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-900 p-5 rounded-3xl border border-blue-500/30 text-white space-y-3">
        <div className="flex items-center gap-2 text-blue-400 font-bold text-xs">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span>Vepari AI Market Interpretation for {activeCompany.name}</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Based on recent macro movements, raw material procurement costs in your sector are projected to decrease by <strong>1.8% to 2.4%</strong> over the next quarter. We advise reviewing open supplier quotes before issuing new purchase orders.
        </p>
      </div>

      {/* Market Updates Grid */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Globe className="w-4 h-4 text-blue-600" />
          <span>Verified Market Feeds & Regulatory Intelligence</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {marketUpdates.map(update => (
            <div key={update.id} className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between text-[11px]">
                <span className="px-2 py-0.5 rounded-full font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  {update.category}
                </span>
                <span className="text-slate-400 font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {update.timestamp}
                </span>
              </div>

              <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                {update.title}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {update.summary}
              </p>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300">
                <strong className="text-blue-600 dark:text-blue-400 block font-semibold mb-0.5">Vepari Business Impact:</strong>
                <span>{update.impact}</span>
              </div>

              <div className="pt-2 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-100 dark:border-slate-800">
                <span className="truncate max-w-[200px]">{update.source}</span>
                <ExternalLink className="w-3 h-3 text-slate-400 hover:text-blue-600 cursor-pointer" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
