import React, { useState } from 'react';
import { ShieldAlert, KeyRound, Check, X, Lock } from 'lucide-react';
import { useAccounting } from '../../context/AccountingContext';

interface PinModalProps {
  isOpen: boolean;
  title?: string;
  description?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const PinModal: React.FC<PinModalProps> = ({
  isOpen,
  title = "Security Authentication Required",
  description = "Enter your 5-digit permanent Security PIN to authorize this action.",
  onSuccess,
  onCancel,
}) => {
  const { company } = useAccounting();
  const [pin, setPin] = useState(['', '', '', '', '']);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (index: number, val: string) => {
    if (val.length > 1) val = val.slice(-1);
    if (!/^\d*$/.test(val)) return;

    const newPin = [...pin];
    newPin[index] = val;
    setPin(newPin);
    setError('');

    // Auto focus next input
    if (val && index < 4) {
      const nextInput = document.getElementById(`pin-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      const prevInput = document.getElementById(`pin-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredPin = pin.join('');
    
    if (enteredPin.length !== 5) {
      setError('Please enter all 5 digits of your security PIN.');
      return;
    }

    const actualPin = company.securityPin || '12345';

    if (enteredPin === actualPin) {
      setError('');
      setPin(['', '', '', '', '']);
      onSuccess();
    } else {
      setError('Incorrect 5-Digit PIN! Access denied.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 relative">
        <button
          onClick={onCancel}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>
          </div>
        </div>

        <form onSubmit={handleVerify} className="space-y-6">
          <div className="flex items-center justify-center gap-3">
            {pin.map((digit, idx) => (
              <input
                key={idx}
                id={`pin-input-${idx}`}
                type="password"
                maxLength={1}
                value={digit}
                onChange={e => handleChange(idx, e.target.value)}
                onKeyDown={e => handleKeyDown(idx, e)}
                className="w-12 h-14 text-center text-xl font-bold font-mono bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:border-teal-500 dark:focus:border-teal-400 focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all"
                autoFocus={idx === 0}
              />
            ))}
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 px-4 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-500 shadow-lg shadow-teal-600/20 transition-all flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>Verify PIN</span>
            </button>
          </div>
        </form>

        <div className="text-[11px] text-center text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-3">
          Security Rule: 5-digit PIN is permanent for key actions & can be updated max 1x per month.
        </div>
      </div>
    </div>
  );
};
