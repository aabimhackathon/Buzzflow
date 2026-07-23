import React, { useState } from 'react';
import { useAccounting } from '../../context/AccountingContext';
import { 
  Building2, 
  Save, 
  CheckCircle2, 
  ShieldCheck, 
  KeyRound, 
  Coins, 
  Receipt, 
  Activity, 
  Database,
  HelpCircle
} from 'lucide-react';
import { FinancialYearRollover } from './FinancialYearRollover';
import { AuditLogView } from '../accounting/AuditLogView';
import { CompanyBackupManager } from './CompanyBackupManager';
import { GuidedTourModal } from '../common/GuidedTourModal';

export const CompanySetupView: React.FC = () => {
  const { activeCompany, updateCompany, brand } = useAccounting();
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'audit' | 'backup' | 'security'>('profile');
  const [formData, setFormData] = useState({ ...activeCompany });
  const [savedMessage, setSavedMessage] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);

  const CURRENCY_OPTIONS = [
    { code: 'INR', symbol: '₹', label: 'INR - Indian Rupee (₹)' },
    { code: 'USD', symbol: '$', label: 'USD - US Dollar ($)' },
    { code: 'EUR', symbol: '€', label: 'EUR - Euro (€)' },
    { code: 'GBP', symbol: '£', label: 'GBP - British Pound (£)' },
    { code: 'AED', symbol: 'AED ', label: 'AED - UAE Dirham (AED)' },
    { code: 'SGD', symbol: 'S$', label: 'SGD - Singapore Dollar (S$)' },
    { code: 'CAD', symbol: 'C$', label: 'CAD - Canadian Dollar (C$)' },
    { code: 'AUD', symbol: 'A$', label: 'AUD - Australian Dollar (A$)' },
    { code: 'JPY', symbol: '¥', label: 'JPY - Japanese Yen (¥)' },
  ];

  const TAX_FORMAT_OPTIONS = [
    { code: 'GST', label: 'GST - Goods & Services Tax (CGST / SGST / IGST)' },
    { code: 'VAT', label: 'VAT - Value Added Tax' },
    { code: 'Sales Tax', label: 'Sales Tax - State / Federal Sales Tax' },
    { code: 'Consumption Tax', label: 'Consumption Tax' },
    { code: 'Exempt', label: 'Exempt / No Tax Registration' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateCompany(formData);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Header & Sub-Nav */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-teal-600" />
              Company Setup, Compliance & Backup
            </h2>
            <button
              onClick={() => setIsTourOpen(true)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300 border border-teal-200 dark:border-teal-800 hover:bg-teal-100 transition-colors"
            >
              <HelpCircle className="w-3 h-3 text-teal-600" /> Replay Tour
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure local currency, regional tax format ({activeCompany.regionalTaxFormat || 'GST'}), audit logs & data backups
          </p>
        </div>

        {/* Sub-Nav Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl text-xs font-bold">
          <button
            onClick={() => setActiveSubTab('profile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
              activeSubTab === 'profile' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" /> Profile & Currency
          </button>

          <button
            onClick={() => setActiveSubTab('audit')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
              activeSubTab === 'audit' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-teal-600" /> Audit Trail Log
          </button>

          <button
            onClick={() => setActiveSubTab('backup')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
              activeSubTab === 'backup' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-indigo-500" /> Encrypted Backup
          </button>

          <button
            onClick={() => setActiveSubTab('security')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
              activeSubTab === 'security' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-500" /> Security PIN & Archives
          </button>
        </div>
      </div>

      {/* Guided Tour Modal Popup */}
      <GuidedTourModal isOpen={isTourOpen} onClose={() => setIsTourOpen(false)} />

      {/* Tab 1: Profile & Currency */}
      {activeSubTab === 'profile' && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5 text-xs">
          {savedMessage && (
            <div className="flex items-center gap-1.5 p-3 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4" /> Company Profile, Regional Tax Format & Currency Settings Saved!
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Company Display Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Legal Registered Name *</label>
              <input
                type="text"
                value={formData.legalName}
                onChange={e => setFormData({ ...formData, legalName: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
          </div>

          {/* Currency & Tax Format Customization Section */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-4">
            <h4 className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-2">
              <Coins className="w-4 h-4 text-teal-600" /> Local Currency & Regional Tax Format Configuration
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Local Currency</label>
                <select
                  value={formData.currency}
                  onChange={e => {
                    const selCode = e.target.value;
                    const matched = CURRENCY_OPTIONS.find(c => c.code === selCode);
                    setFormData({
                      ...formData,
                      currency: selCode,
                      currencySymbol: matched ? matched.symbol : formData.currencySymbol || '₹'
                    });
                  }}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {CURRENCY_OPTIONS.map(c => (
                    <option key={c.code} value={c.code}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Regional Tax Format</label>
                <select
                  value={formData.regionalTaxFormat || 'GST'}
                  onChange={e => setFormData({ ...formData, regionalTaxFormat: e.target.value as any })}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {TAX_FORMAT_OPTIONS.map(t => (
                    <option key={t.code} value={t.code}>{t.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Currency Symbol Display</label>
                <input
                  type="text"
                  value={formData.currencySymbol}
                  onChange={e => setFormData({ ...formData, currencySymbol: e.target.value })}
                  placeholder="e.g. ₹ or $ or €"
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-mono font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Tax Registration / GSTIN / VAT ID</label>
                <input
                  type="text"
                  value={formData.gstin || ''}
                  onChange={e => setFormData({ ...formData, gstin: e.target.value })}
                  placeholder="e.g. 27AABCV1234F1Z9 or GB123456789"
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-mono text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Financial Year Start</label>
              <input
                type="date"
                value={formData.fyStart}
                onChange={e => setFormData({ ...formData, fyStart: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Financial Year End</label>
              <input
                type="date"
                value={formData.fyEnd}
                onChange={e => setFormData({ ...formData, fyEnd: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Business Registered Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Official Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
              <input
                type="text"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Company Settings</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Audit Logs */}
      {activeSubTab === 'audit' && <AuditLogView />}

      {/* Tab 3: Encrypted Backup */}
      {activeSubTab === 'backup' && <CompanyBackupManager />}

      {/* Tab 4: Security PIN */}
      {activeSubTab === 'security' && <FinancialYearRollover />}
    </div>
  );
};
