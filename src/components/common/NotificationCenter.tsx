import React, { useState } from 'react';
import { useAccounting } from '../../context/AccountingContext';
import { AINotification } from '../../ai/ui-contracts';
import { Bell, AlertTriangle, ShieldAlert, Sparkles, CheckCircle2, Clock, X, ArrowRight, Filter } from 'lucide-react';

export const NotificationCenter: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { activeCompany, setActiveTab, setAccountingSubTab } = useAccounting();
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'CRITICAL' | 'IMPORTANT' | 'OPPORTUNITY' | 'INFORMATION'>('ALL');

  const notifications: AINotification[] = [
    {
      id: 'notif-1',
      category: 'CRITICAL',
      module: 'Financial',
      title: 'Debtor Overdue Receivable Threshold Cross',
      message: `${activeCompany.currencySymbol}48,500 in receivables cross 30-day aging term. Immediate follow-up required.`,
      timestamp: '10 mins ago',
      read: false,
      actionUrl: 'accounting'
    },
    {
      id: 'notif-2',
      category: 'IMPORTANT',
      module: 'Inventory',
      title: 'Reorder Level Warning for SKUs',
      message: 'Office Paper & IT Peripheral SKUs have crossed minimum stock safety thresholds.',
      timestamp: '1 hour ago',
      read: false,
      actionUrl: 'accounting'
    },
    {
      id: 'notif-3',
      category: 'OPPORTUNITY',
      module: 'Customer',
      title: 'Cross-Sell Potential Identified',
      message: 'Apex Traders purchase frequency indicates high propensity for Category A re-orders.',
      timestamp: '3 hours ago',
      read: true,
      actionUrl: 'growth'
    },
    {
      id: 'notif-4',
      category: 'INFORMATION',
      module: 'Government',
      title: 'GSTR-2B Automated Match Status',
      message: 'All input CGST/SGST tax credits reconciled for current filing quarter.',
      timestamp: 'Yesterday',
      read: true,
      actionUrl: 'reports'
    }
  ];

  if (!isOpen) return null;

  const filtered = activeCategory === 'ALL' 
    ? notifications 
    : notifications.filter(n => n.category === activeCategory);

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col">
      
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-amber-400" />
          <div>
            <h3 className="font-bold text-sm text-white">Vepari Notification Center</h3>
            <p className="text-[11px] text-slate-400">Alerts & Proactive OS Intelligence</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Category Pills */}
      <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs font-semibold">
        {['ALL', 'CRITICAL', 'IMPORTANT', 'OPPORTUNITY', 'INFORMATION'].map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat as any)}
            className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
              activeCategory === cat 
                ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filtered.map(notif => (
          <div
            key={notif.id}
            className={`p-4 rounded-2xl border transition-all ${
              notif.category === 'CRITICAL' 
                ? 'bg-rose-50/60 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900'
                : notif.category === 'IMPORTANT'
                ? 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900'
                : notif.category === 'OPPORTUNITY'
                ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900'
                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-[10px] font-bold uppercase mb-1">
              <span className={`px-2 py-0.5 rounded ${
                notif.category === 'CRITICAL' ? 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200' : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
              }`}>
                {notif.module} • {notif.category}
              </span>
              <span className="text-slate-400 font-mono">{notif.timestamp}</span>
            </div>

            <h4 className="font-bold text-xs text-slate-900 dark:text-white mt-1">{notif.title}</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{notif.message}</p>

            {notif.actionUrl && (
              <button
                onClick={() => {
                  setActiveTab(notif.actionUrl as any);
                  onClose();
                }}
                className="mt-3 text-[11px] font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
              >
                <span>Take Action</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
