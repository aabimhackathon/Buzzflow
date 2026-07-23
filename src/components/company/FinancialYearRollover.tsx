import React, { useState } from 'react';
import { useAccounting } from '../../context/AccountingContext';
import { Calendar, Archive, RefreshCw, KeyRound, ShieldAlert, Check, ShieldCheck, History, ArrowRight } from 'lucide-react';
import { PinModal } from '../security/PinModal';

export const FinancialYearRollover: React.FC = () => {
  const { company, updateCompany, archives, closeFinancialYear, vouchers, ledgers } = useAccounting();
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pinAction, setPinAction] = useState<'close_fy' | 'update_pin' | null>(null);

  // New PIN Form State
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinMessage, setPinMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Monthly constraint check
  const lastChangedDate = company.lastPinChangedAt ? new Date(company.lastPinChangedAt) : new Date(0);
  const now = new Date();
  const isSameMonth = lastChangedDate.getFullYear() === now.getFullYear() && lastChangedDate.getMonth() === now.getMonth();

  // Quarterly PIN status
  const currentQuarter = Math.floor(now.getMonth() / 3) + 1; // 1..4

  const handleAuthorizePinUpdate = () => {
    if (isSameMonth) {
      setPinMessage({
        type: 'error',
        text: `Security Rule Violation: PIN can be updated at most ONCE per calendar month. Last updated on ${lastChangedDate.toLocaleDateString()}.`
      });
      return;
    }
    setPinAction('update_pin');
    setIsPinModalOpen(true);
  };

  const handleAuthorizeFyClose = () => {
    setPinAction('close_fy');
    setIsPinModalOpen(true);
  };

  const handlePinSuccess = () => {
    setIsPinModalOpen(false);

    if (pinAction === 'update_pin') {
      if (newPin.length !== 5 || !/^\d+$/.test(newPin)) {
        setPinMessage({ type: 'error', text: 'PIN must be exactly 5 numeric digits.' });
        return;
      }
      if (newPin !== confirmPin) {
        setPinMessage({ type: 'error', text: 'New PIN and Confirm PIN do not match.' });
        return;
      }

      // Update PIN
      const updatedQuarters = { ...company.pinChangedQuarters, [`q${currentQuarter}`]: true };
      updateCompany({
        securityPin: newPin,
        lastPinChangedAt: new Date().toISOString(),
        pinChangedQuarters: updatedQuarters
      });

      setPinMessage({ type: 'success', text: '5-Digit Security PIN updated successfully for this month & quarter!' });
      setNewPin('');
      setConfirmPin('');
    } else if (pinAction === 'close_fy') {
      // Execute Financial Year Rollover
      closeFinancialYear();
      alert(`Financial Year ${company.fyStart} to ${company.fyEnd} closed successfully! All vouchers archived into Historical Records and opening balances rolled forward.`);
    }
    setPinAction(null);
  };

  return (
    <div className="space-y-6">
      {/* 5-Digit PIN & Quarterly Security Status Panel */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Permanent 5-Digit Security PIN Management</h3>
              <p className="text-xs text-slate-500">
                Rule: PIN can be changed <span className="font-bold text-slate-700 dark:text-slate-300">max 1x per month</span> & must be updated <span className="font-bold text-slate-700 dark:text-slate-300">4 times per financial year</span>.
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Monthly Rule Status</span>
            <div className={`text-xs font-bold font-mono ${isSameMonth ? 'text-amber-600' : 'text-emerald-600'}`}>
              {isSameMonth ? 'PIN updated this month' : 'Eligible for PIN Update'}
            </div>
          </div>
        </div>

        {/* Quarterly Rotation Tracker */}
        <div>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 block">
            Financial Year Quarterly PIN Rotation Requirements (4 Times/Year):
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { q: 'Q1 (Apr - Jun)', key: 'q1' },
              { q: 'Q2 (Jul - Sep)', key: 'q2' },
              { q: 'Q3 (Oct - Dec)', key: 'q3' },
              { q: 'Q4 (Jan - Mar)', key: 'q4' }
            ].map(item => {
              const done = company.pinChangedQuarters?.[item.key as keyof typeof company.pinChangedQuarters];
              return (
                <div key={item.key} className={`p-3 rounded-xl border flex items-center justify-between text-xs font-bold ${done ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-800 dark:text-emerald-300' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 text-slate-500'}`}>
                  <span>{item.q}</span>
                  {done ? <ShieldCheck className="w-4 h-4 text-emerald-600" /> : <ShieldAlert className="w-4 h-4 text-amber-500" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Change PIN Form */}
        <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl space-y-4">
          <span className="text-xs font-bold text-slate-900 dark:text-white">Update 5-Digit Security PIN (Requires Current PIN Verification)</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">New 5-Digit PIN</label>
              <input
                type="password"
                maxLength={5}
                value={newPin}
                onChange={e => setNewPin(e.target.value)}
                placeholder="5-digit numeric PIN"
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Confirm New 5-Digit PIN</label>
              <input
                type="password"
                maxLength={5}
                value={confirmPin}
                onChange={e => setConfirmPin(e.target.value)}
                placeholder="Re-enter 5-digit PIN"
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white outline-none"
              />
            </div>
          </div>

          {pinMessage && (
            <div className={`p-3 rounded-xl text-xs font-bold ${pinMessage.type === 'success' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
              {pinMessage.text}
            </div>
          )}

          <button
            onClick={handleAuthorizePinUpdate}
            disabled={isSameMonth}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-all shadow-md"
          >
            Authorize & Change PIN
          </button>
        </div>
      </div>

      {/* Financial Year Rollover & Archiving Panel */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Year-End Financial Rollover & Automatic Archiving</h3>
              <p className="text-xs text-slate-500">Every new year all last year's records move automatically into Historical Archives while carrying forward Asset & Liability opening balances.</p>
            </div>
          </div>

          <div className="font-mono text-xs font-bold text-teal-600">
            Active FY: {company.fyStart} to {company.fyEnd}
          </div>
        </div>

        <div className="p-4 bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 rounded-xl space-y-2 text-xs text-teal-900 dark:text-teal-200">
          <p className="font-bold flex items-center gap-2">
            <RefreshCw className="w-4 h-4" /> Automated Year-End Closing Rules:
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
            <li>Current Year Vouchers ({vouchers.length} posted) will be snapshotted & moved into Historical Archives.</li>
            <li>Asset & Liability ledgers carry forward their net closing balance as the Opening Balance for the new Financial Year.</li>
            <li>Revenue & Expense ledgers reset to zero opening balance (Net Profit transferred to Capital Account).</li>
          </ul>
        </div>

        <button
          onClick={handleAuthorizeFyClose}
          className="px-5 py-3 bg-slate-900 dark:bg-teal-600 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2"
        >
          <Archive className="w-4 h-4" />
          <span>Close Current Financial Year & Move Records to Archives</span>
        </button>

        {/* Historical Archives List */}
        {archives.length > 0 && (
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <History className="w-4 h-4 text-teal-600" /> Archived Historical Financial Years
            </h4>
            <div className="space-y-2">
              {archives.map(arch => (
                <div key={arch.id} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold font-mono text-slate-900 dark:text-white">FY {arch.financialYear}</span>
                    <p className="text-[10px] text-slate-400">Archived on {new Date(arch.archivedAt).toLocaleDateString()} | {arch.vouchersSnapshot?.length || 0} Vouchers Recorded</p>
                  </div>
                  <div className="font-mono text-right text-emerald-600 font-bold">
                    Net Profit: {company.currencySymbol}{arch.profitAndLossSummary?.netProfit?.toLocaleString() || 0}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Security PIN Verification Modal */}
      <PinModal
        isOpen={isPinModalOpen}
        onSuccess={handlePinSuccess}
        onCancel={() => {
          setIsPinModalOpen(false);
          setPinAction(null);
        }}
      />
    </div>
  );
};
