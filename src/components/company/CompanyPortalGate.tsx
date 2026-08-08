import React, { useState } from 'react';
import { useAccounting } from '../../context/AccountingContext';
import { CompanyOnboardingModal } from './CompanyOnboardingModal';
import { VEPARI_ASSETS } from '../../config/assets';
import { 
  Building2, 
  ShieldCheck, 
  KeyRound, 
  ArrowRight, 
  Plus, 
  Zap, 
  Lock, 
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  MapPin,
  ChevronRight,
  LogIn
} from 'lucide-react';

export const CompanyPortalGate: React.FC = () => {
  const { 
    companies, 
    activeCompanyId, 
    selectCompany, 
    authenticateCompanyPin, 
    isCompanyAuthenticated,
    brand 
  } = useAccounting();

  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [selectedCompIdForPin, setSelectedCompIdForPin] = useState<string | null>(activeCompanyId || (companies[0]?.id || null));
  const [userRole, setUserRole] = useState<'owner' | 'accountant' | 'auditor'>('owner');

  const targetComp = companies.find(c => c.id === selectedCompIdForPin) || companies[0];

  const handleSelectCompany = (comp: typeof companies[0]) => {
    setSelectedCompIdForPin(comp.id);
    selectCompany(comp.id);
    setPinInput('');
    setPinError('');
  };

  const handlePinSubmit = (e?: React.FormEvent, directPin?: string) => {
    if (e) e.preventDefault();
    const pinToAuth = directPin || pinInput;
    if (pinToAuth.length !== 5) {
      setPinError('Please enter a full 5-digit PIN');
      return;
    }

    const res = authenticateCompanyPin(pinToAuth);
    if (!res.success) {
      setPinError(res.message);
      setPinInput('');
    }
  };

  const handleQuickLogin = (pin: string) => {
    setPinInput(pin);
    handlePinSubmit(undefined, pin);
  };

  const handleKeyClick = (digit: string) => {
    if (pinInput.length < 5) {
      const nextPin = pinInput + digit;
      setPinInput(nextPin);
      setPinError('');
      if (nextPin.length === 5) {
        setTimeout(() => handlePinSubmit(undefined, nextPin), 150);
      }
    }
  };

  const handleBackspace = () => {
    setPinInput(prev => prev.slice(0, -1));
    setPinError('');
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#1A2433] flex flex-col justify-between font-sans relative overflow-hidden">
      {/* Background Decorative Accents */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#163A70]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#16B8A6]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Portal Top Bar */}
      <header className="border-b border-[#D8E2EE] bg-white/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#163A70] flex items-center justify-center text-white shadow-lg shadow-[#163A70]/20 border border-[#16B8A6]/30 overflow-hidden p-0.5">
              <img 
                src={VEPARI_ASSETS.appIcon} 
                alt="Vepari AI Accounting Logo" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-lg bg-white"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold font-logo text-[#163A70] tracking-tight flex items-center gap-2">
                {brand.name}
                <span className="px-2 py-0.5 text-[10px] rounded-full bg-[#163A70]/10 text-[#163A70] font-sans font-bold border border-[#163A70]/20">Enterprise</span>
              </h1>
              <p className="text-xs text-[#5B6878] font-medium">Enterprise Business Accounting & GST Portal</p>
            </div>
          </div>

          <button
            onClick={() => setIsOnboardingOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#163A70] hover:bg-[#2F6FED] text-white font-semibold text-xs transition-all shadow-md"
          >
            <Plus className="w-4 h-4 text-[#16B8A6]" />
            <span>Create New License Company</span>
          </button>
        </div>
      </header>

      {/* Main Portal Body */}
      <main className="max-w-7xl mx-auto px-6 py-12 flex-1 w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        
        {/* Left Column: Company Selector */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16B8A6]/10 text-[#16B8A6] text-xs font-bold mb-3 border border-[#16B8A6]/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Multi-Company Security Vault</span>
            </div>
            <h2 className="text-3xl font-bold text-[#1A2433] tracking-tight">Select Business Workspace</h2>
            <p className="text-sm text-[#5B6878] mt-1">
              Choose an enterprise company profile to authenticate with your 5-digit encrypted security PIN.
            </p>
          </div>

          {/* Companies List Cards */}
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 no-scrollbar">
            {companies.map((comp) => {
              const isSelected = targetComp?.id === comp.id;
              return (
                <div
                  key={comp.id}
                  onClick={() => handleSelectCompany(comp)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'bg-white border-[#2F6FED] shadow-soft ring-2 ring-[#2F6FED]/20'
                      : 'bg-white border-[#D8E2EE] hover:border-[#2F6FED]/50 hover:bg-[#EEF3F8]/50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl ${isSelected ? 'bg-[#163A70] text-white' : 'bg-[#EEF3F8] text-[#163A70]'}`}>
                        <Building2 className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-base text-[#1A2433]">{comp.name}</h3>
                          <span className="text-[10px] px-2 py-0.5 rounded-md font-semibold bg-[#EEF3F8] text-[#163A70] border border-[#D8E2EE]">
                            {comp.entityType || 'Private Limited'}
                          </span>
                        </div>
                        <p className="text-xs text-[#5B6878] mt-0.5 font-medium">{comp.legalName}</p>

                        <div className="flex items-center gap-4 mt-3 text-xs text-[#8894A7]">
                          <span className="flex items-center gap-1">
                            <Briefcase className="w-3.5 h-3.5 text-[#2F6FED]" />
                            {comp.industry}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-[#16B8A6]" />
                            {comp.city}, {comp.state}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isSelected ? (
                        <div className="flex items-center gap-1 px-3 py-1 rounded-lg bg-[#2F6FED]/10 text-[#2F6FED] text-xs font-bold">
                          <span>Selected</span>
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      ) : (
                        <span className="text-xs text-[#8894A7] hover:text-[#2F6FED] font-medium">Click to select</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: 5-Digit PIN Gate Pad */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-2xl sm:rounded-card border border-[#D8E2EE] shadow-soft p-5 sm:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-28 h-28 bg-[#2F6FED]/5 rounded-bl-full pointer-events-none" />

            {/* Role Switcher Pills */}
            <div className="flex items-center justify-center gap-1 bg-[#F7F9FC] p-1 rounded-xl border border-[#D8E2EE] mb-5">
              <button
                type="button"
                onClick={() => setUserRole('owner')}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                  userRole === 'owner' ? 'bg-[#163A70] text-white shadow-xs' : 'text-[#5B6878] hover:text-[#1A2433]'
                }`}
              >
                Owner
              </button>
              <button
                type="button"
                onClick={() => setUserRole('accountant')}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                  userRole === 'accountant' ? 'bg-[#163A70] text-white shadow-xs' : 'text-[#5B6878] hover:text-[#1A2433]'
                }`}
              >
                Accountant
              </button>
              <button
                type="button"
                onClick={() => setUserRole('auditor')}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                  userRole === 'auditor' ? 'bg-[#163A70] text-white shadow-xs' : 'text-[#5B6878] hover:text-[#1A2433]'
                }`}
              >
                Auditor
              </button>
            </div>

            <div className="text-center space-y-1.5 mb-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto rounded-2xl bg-[#163A70] flex items-center justify-center text-white shadow-lg shadow-[#163A70]/20">
                <Lock className="w-6 h-6 sm:w-7 sm:h-7 text-[#16B8A6]" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#1A2433]">Security PIN Verification</h3>
              <p className="text-xs text-[#5B6878]">
                Authenticate <span className="font-bold text-[#163A70]">{userRole.toUpperCase()}</span> role for <strong className="text-[#163A70]">{targetComp?.name}</strong>
              </p>
            </div>

            <form onSubmit={handlePinSubmit} className="space-y-5">
              {/* PIN Display Slots */}
              <div className="flex justify-center gap-2 sm:gap-3">
                {[0, 1, 2, 3, 4].map((idx) => {
                  const hasChar = pinInput.length > idx;
                  return (
                    <div
                      key={idx}
                      className={`w-10 h-12 sm:w-12 sm:h-14 rounded-xl border-2 flex items-center justify-center text-xl sm:text-2xl font-bold font-num transition-all ${
                        hasChar
                          ? 'border-[#2F6FED] bg-[#2F6FED]/5 text-[#163A70] shadow-xs scale-105'
                          : 'border-[#D8E2EE] bg-[#F7F9FC] text-transparent'
                      }`}
                    >
                      {hasChar ? '•' : ''}
                    </div>
                  );
                })}
              </div>

              {pinError && (
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#E53935] bg-[#E53935]/10 p-2.5 rounded-xl border border-[#E53935]/20">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{pinError}</span>
                </div>
              )}

              {/* Custom Touch Keypad */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-1">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleKeyClick(num)}
                    className="py-2.5 sm:py-3 rounded-xl bg-[#F7F9FC] hover:bg-[#EEF3F8] active:bg-[#2F6FED]/20 text-[#1A2433] font-bold text-base sm:text-lg font-num border border-[#D8E2EE] transition-all shadow-2xs active:scale-95 min-h-[44px]"
                  >
                    {num}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setPinInput('')}
                  className="py-2.5 sm:py-3 rounded-xl bg-[#F7F9FC] hover:bg-rose-50 text-[#E53935] font-bold text-xs border border-[#D8E2EE] transition-all min-h-[44px]"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => handleKeyClick('0')}
                  className="py-2.5 sm:py-3 rounded-xl bg-[#F7F9FC] hover:bg-[#EEF3F8] active:bg-[#2F6FED]/20 text-[#1A2433] font-bold text-base sm:text-lg font-num border border-[#D8E2EE] transition-all min-h-[44px]"
                >
                  0
                </button>
                <button
                  type="button"
                  onClick={handleBackspace}
                  className="py-2.5 sm:py-3 rounded-xl bg-[#F7F9FC] hover:bg-slate-100 text-[#5B6878] font-bold text-xs border border-[#D8E2EE] transition-all min-h-[44px]"
                >
                  ⌫
                </button>
              </div>

              {/* 1-Click Quick Login Option Buttons */}
              <div className="pt-2 space-y-2 border-t border-[#D8E2EE]">
                <div className="text-[11px] font-bold text-center text-[#5B6878] uppercase tracking-wider">
                  Instant Demo Login
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('12345')}
                    className="py-2.5 px-3 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-2xs"
                  >
                    <LogIn className="w-3.5 h-3.5 text-teal-600" />
                    <span>Owner (12345)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin('54321')}
                    className="py-2.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-2xs"
                  >
                    <LogIn className="w-3.5 h-3.5 text-blue-600" />
                    <span>Accountant (54321)</span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={pinInput.length !== 5}
                className="w-full py-3.5 rounded-xl bg-gradient-brand hover:opacity-95 text-white font-bold text-sm shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2 min-h-[44px] active:scale-[0.99]"
              >
                <span>Login & Unlock OS</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="p-3 rounded-xl bg-[#EEF3F8] border border-[#D8E2EE] text-[11px] text-[#5B6878] text-center">
                💡 <span className="font-semibold">Demo Hint:</span> Default PIN for demo companies is <code className="bg-white px-1.5 py-0.5 rounded font-mono font-bold text-[#163A70]">12345</code> or <code className="bg-white px-1.5 py-0.5 rounded font-mono font-bold text-[#163A70]">54321</code>.
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Portal Footer */}
      <footer className="border-t border-[#D8E2EE] bg-white py-4 px-6 text-center text-xs text-[#8894A7]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 Vepari AI Accounting Platform. All data stored securely in local workspace vault.</span>
          <span className="font-semibold text-[#163A70]">Encrypted 5-Digit Security Protocol</span>
        </div>
      </footer>

      {/* Company Creation Modal */}
      <CompanyOnboardingModal isOpen={isOnboardingOpen} onClose={() => setIsOnboardingOpen(false)} />
    </div>
  );
};
