import React, { useState } from 'react';
import { useAccounting } from '../../context/AccountingContext';
import { VEPARI_ASSETS } from '../../config/assets';
import { Sliders, Plus, Play, Pause, Clock, AlertTriangle, ShieldCheck, CheckCircle2, Zap, ArrowRight, Trash2 } from 'lucide-react';

export const AutomationEngineView: React.FC = () => {
  const { activeCompany } = useAccounting();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [workflows, setWorkflows] = useState([
    {
      id: 'wf-1',
      name: 'Debtor Overdue Payment Reminder Drafts',
      trigger: 'Customer bill overdue > 7 days',
      condition: 'Outstanding balance > ₹10,000',
      action: 'Draft WhatsApp & Email Reminder Message for Owner Review',
      status: 'ACTIVE',
      lastRun: 'Today, 09:00 AM',
      executedCount: 14
    },
    {
      id: 'wf-2',
      name: 'Low Stock SKU Purchase Order Draft',
      trigger: 'Inventory SKU reaches reorder point',
      condition: 'Supplier bank details verified',
      action: 'Prepare Purchase Voucher Draft in New Voucher Form',
      status: 'ACTIVE',
      lastRun: 'Yesterday, 06:30 PM',
      executedCount: 8
    },
    {
      id: 'wf-3',
      name: 'GST Tax Compliance Reconciliation Alert',
      trigger: '25th of every month',
      condition: 'GSTR-2B vs Input Tax Credit mismatch > ₹1,000',
      action: 'Notify Owner & Flag Unmatched Supplier Invoices',
      status: 'ACTIVE',
      lastRun: 'July 25, 2026',
      executedCount: 6
    }
  ]);

  const toggleWorkflowStatus = (id: string) => {
    setWorkflows(prev => prev.map(w => {
      if (w.id === id) {
        return { ...w, status: w.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE' };
      }
      return w;
    }));
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 p-1 flex items-center justify-center overflow-hidden shrink-0">
            <img 
              src={VEPARI_ASSETS.engines.automation} 
              alt="Automation Engine" 
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white">Vepari Automation Engine</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Rule-Based Business Workflows
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Automate scheduled payment reminders, reorder drafts & compliance checks with strict owner safety guardrails
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Workflow</span>
        </button>
      </div>

      {/* Safety Notice Banner */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3 text-xs text-amber-200">
        <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
        <span>
          <strong>Owner Safety Guarantee:</strong> Automations only prepare drafts, alerts, and reminders. No financial voucher is ever posted autonomously without explicit owner authorization.
        </span>
      </div>

      {/* Workflows Table / Grid */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sliders className="w-4 h-4 text-amber-600" />
          <span>Active Business Workflows ({workflows.filter(w => w.status === 'ACTIVE').length})</span>
        </h2>

        <div className="space-y-3">
          {workflows.map(wf => (
            <div key={wf.id} className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
              <div className="space-y-1.5 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${wf.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                    {wf.status}
                  </span>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">{wf.name}</h3>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 space-y-0.5 font-mono">
                  <div><strong>Trigger:</strong> {wf.trigger}</div>
                  <div><strong>Condition:</strong> {wf.condition}</div>
                  <div><strong>Action:</strong> {wf.action}</div>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 dark:border-slate-800">
                <div className="text-right text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                  <div>Last Run: {wf.lastRun}</div>
                  <div>Executed: {wf.executedCount} times</div>
                </div>

                <button
                  onClick={() => toggleWorkflowStatus(wf.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 ${wf.status === 'ACTIVE' ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-200 border border-amber-200 dark:border-amber-800' : 'bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200'}`}
                >
                  {wf.status === 'ACTIVE' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{wf.status === 'ACTIVE' ? 'Pause' : 'Activate'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Creating Workflow */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 max-w-lg w-full rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <span>Create New Workflow Rule</span>
            </h3>
            <p className="text-xs text-slate-500">Configure trigger conditions and draft actions for Vepari AI Automation Engine.</p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Workflow Name</label>
                <input type="text" placeholder="e.g., Weekly Debtors WhatsApp Follow Up" className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none" />
              </div>
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Trigger Event</label>
                <select className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none">
                  <option>Overdue Customer Receivable Bill</option>
                  <option>Inventory Item Reaches Reorder Level</option>
                  <option>Large Expense Voucher Exceeds Threshold</option>
                  <option>End of Month Tax & GST Reconciliation</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Target Action</label>
                <input type="text" placeholder="e.g., Prepare Draft Voucher in New Voucher Form" className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none" />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                Cancel
              </button>
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  alert('Workflow rule saved successfully!');
                }} 
                className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-400 text-slate-950 hover:bg-amber-300"
              >
                Save Workflow
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
