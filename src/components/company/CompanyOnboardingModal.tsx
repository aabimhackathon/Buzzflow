import React, { useState } from 'react';
import { useAccounting } from '../../context/AccountingContext';
import { Building2, Key, CreditCard, ShieldCheck, CheckCircle2, ArrowRight, Sparkles, X, Lock, Check } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CompanyOnboardingModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { resetCompanyAndData, setLicense, setActiveTab } = useAccounting();

  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: License, 2: Company Details & Features, 3: 5-Digit Security PIN

  // License state
  const [licenseOption, setLicenseOption] = useState<'educational' | 'key' | 'purchase'>('educational');
  const [existingKey, setExistingKey] = useState('');
  const [purchaseTier, setPurchaseTier] = useState<'silver' | 'gold'>('gold');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking'>('upi');
  const [cardNumber, setCardNumber] = useState('');
  const [upiId, setUpiId] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);

  // Company Details
  const [compName, setCompName] = useState('New Enterprise');
  const [legalName, setLegalName] = useState('New Enterprise Private Limited');
  const [fyStart, setFyStart] = useState('2025-04-01');
  const [fyEnd, setFyEnd] = useState('2026-03-31');
  const [gstin, setGstin] = useState('27AABCU9603R1ZM');
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [currencySymbol, setCurrencySymbol] = useState('₹');
  const [address, setAddress] = useState('101 Business Hub, Nariman Point');
  const [city, setCity] = useState('Mumbai');
  const [state, setState] = useState('Maharashtra');
  const [pinCode, setPinCode] = useState('400021');
  const [phone, setPhone] = useState('+91 98200 12345');
  const [email, setEmail] = useState('accounts@newenterprise.com');
  const [industry, setIndustry] = useState('General Trade & Services');

  // Feature Toggles
  const [features, setFeatures] = useState({
    gstBilling: true,
    inventory: true,
    brs: true,
    financeEngine: true,
    tdsTax: true
  });

  // Security PIN
  const [securityPin, setSecurityPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Handle Payment Processing for License Purchase
  const handleSimulatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingPayment(true);
    setTimeout(() => {
      const key = `TALLY-${purchaseTier.toUpperCase()}-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      setGeneratedKey(key);
      setIsProcessingPayment(false);
      setLicense({
        mode: purchaseTier,
        productKey: key,
        isLicensed: true,
        activatedAt: new Date().toISOString()
      });
    }, 1500);
  };

  const handleApplyLicenseAndNext = () => {
    if (licenseOption === 'educational') {
      setLicense({ mode: 'educational', isLicensed: true });
    } else if (licenseOption === 'key') {
      if (!existingKey.trim()) {
        alert('Please enter a valid product key.');
        return;
      }
      setLicense({ mode: 'gold', productKey: existingKey, isLicensed: true });
    }
    setStep(2);
  };

  const handleCompanyDetailsNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!compName.trim()) {
      alert('Please enter a company name.');
      return;
    }
    setStep(3);
  };

  const handleFinalRegisterCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (securityPin.length !== 5 || !/^\d{5}$/.test(securityPin)) {
      setPinError('Security PIN must be exactly 5 digits.');
      return;
    }
    if (securityPin !== confirmPin) {
      setPinError('Security PINs do not match.');
      return;
    }

    setPinError(null);

    // Initialize Company with clean dataset
    resetCompanyAndData({
      name: compName,
      legalName: legalName || compName,
      fyStart,
      fyEnd,
      gstin,
      currency,
      currencySymbol: currency === 'INR' ? '₹' : '$',
      address,
      city,
      state,
      pinCode,
      phone,
      email,
      industry,
      securityPin,
      lastPinChangedAt: new Date().toISOString(),
      pinChangedQuarters: { q1: true, q2: true, q3: false, q4: false }
    });

    onClose();
    setActiveTab('accounting');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[92vh] overflow-y-auto relative shadow-2xl space-y-6">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Wizard Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span className={step >= 1 ? 'text-teal-600 dark:text-teal-400' : ''}>1. License Mode</span>
            <span className={step >= 2 ? 'text-teal-600 dark:text-teal-400' : ''}>2. Tally Company Details</span>
            <span className={step >= 3 ? 'text-teal-600 dark:text-teal-400' : ''}>3. 5-Digit Security PIN</span>
          </div>
          <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
            <div className={`h-full bg-teal-500 transition-all duration-300 ${step === 1 ? 'w-1/3' : step === 2 ? 'w-2/3' : 'w-full'}`} />
          </div>
        </div>

        {/* STEP 1: License Choice or Purchase */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Key className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                Select Tally Software License & Activation Mode
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Choose Educational Mode or purchase an official Product License Key with live payment simulation.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setLicenseOption('educational')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  licenseOption === 'educational'
                    ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-950/40 ring-2 ring-teal-500/30'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="font-bold text-xs text-slate-900 dark:text-white mb-1">Educational Mode</div>
                <div className="text-[11px] text-slate-500">Free mode for learning & testing without a product key.</div>
              </button>

              <button
                type="button"
                onClick={() => setLicenseOption('key')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  licenseOption === 'key'
                    ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-950/40 ring-2 ring-teal-500/30'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="font-bold text-xs text-slate-900 dark:text-white mb-1">Use Existing Key</div>
                <div className="text-[11px] text-slate-500">Enter a 16-character license key you already own.</div>
              </button>

              <button
                type="button"
                onClick={() => setLicenseOption('purchase')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  licenseOption === 'purchase'
                    ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-950/40 ring-2 ring-teal-500/30'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="font-bold text-xs text-slate-900 dark:text-white mb-1 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Purchase License
                </div>
                <div className="text-[11px] text-slate-500">Buy Silver or Gold multi-user edition with payment gateway.</div>
              </button>
            </div>

            {/* Sub-section for Existing Key */}
            {licenseOption === 'key' && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Enter 16-Character Product Key
                </label>
                <input
                  type="text"
                  placeholder="e.g. TALLY-GOLD-2026-X892"
                  value={existingKey}
                  onChange={e => setExistingKey(e.target.value.toUpperCase())}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            )}

            {/* Sub-section for Purchasing License */}
            {licenseOption === 'purchase' && !generatedKey && (
              <form onSubmit={handleSimulatePayment} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
                  <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Select Software Edition
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setPurchaseTier('silver')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${purchaseTier === 'silver' ? 'bg-slate-900 text-white dark:bg-teal-600' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}
                    >
                      Silver Single-User (₹18,000)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPurchaseTier('gold')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${purchaseTier === 'gold' ? 'bg-slate-900 text-white dark:bg-teal-600' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}
                    >
                      Gold Multi-User (₹54,000)
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Payment Method
                  </label>
                  <div className="flex gap-3">
                    <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer font-semibold">
                      <input type="radio" name="payMethod" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} />
                      UPI / GPay / PhonePe
                    </label>
                    <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer font-semibold">
                      <input type="radio" name="payMethod" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                      Credit / Debit Card
                    </label>
                    <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer font-semibold">
                      <input type="radio" name="payMethod" checked={paymentMethod === 'netbanking'} onChange={() => setPaymentMethod('netbanking')} />
                      NetBanking
                    </label>
                  </div>

                  {paymentMethod === 'upi' && (
                    <input
                      type="text"
                      placeholder="Enter VPA / UPI ID (e.g. user@okaxis)"
                      value={upiId}
                      onChange={e => setUpiId(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 dark:text-white outline-none"
                      required
                    />
                  )}

                  {paymentMethod === 'card' && (
                    <input
                      type="text"
                      placeholder="Card Number (4000 1234 5678 9010)"
                      value={cardNumber}
                      onChange={e => setCardNumber(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 dark:text-white outline-none"
                      required
                    />
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isProcessingPayment}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>{isProcessingPayment ? 'Processing Live Payment...' : `Pay ${purchaseTier === 'gold' ? '₹54,000' : '₹18,000'} & Generate Product Key`}</span>
                </button>
              </form>
            )}

            {generatedKey && (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span>Payment Successful! License Generated & Activated</span>
                </div>
                <p className="font-mono font-bold text-sm bg-emerald-100 dark:bg-emerald-900/80 p-2 rounded-xl text-center text-emerald-900 dark:text-emerald-200">
                  {generatedKey}
                </p>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleApplyLicenseAndNext}
                className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all"
              >
                <span>Continue to Company Creation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Tally Company Details & Features */}
        {step === 2 && (
          <form onSubmit={handleCompanyDetailsNext} className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                Create Company Details (Tally Software Format)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Configure your organization details, financial year, and feature modules.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Company Name *
                </label>
                <input
                  type="text"
                  value={compName}
                  onChange={e => setCompName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-semibold outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Legal / Mailing Name
                </label>
                <input
                  type="text"
                  value={legalName}
                  onChange={e => setLegalName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Financial Year From
                </label>
                <input
                  type="date"
                  value={fyStart}
                  onChange={e => setFyStart(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Books Beginning From (FY End)
                </label>
                <input
                  type="date"
                  value={fyEnd}
                  onChange={e => setFyEnd(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  GSTIN / Tax ID
                </label>
                <input
                  type="text"
                  value={gstin}
                  onChange={e => setGstin(e.target.value)}
                  placeholder="27AABCU9603R1ZM"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-mono text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Base Currency
                </label>
                <select
                  value={currency}
                  onChange={e => {
                    const val = e.target.value as 'INR' | 'USD';
                    setCurrency(val);
                    setCurrencySymbol(val === 'INR' ? '₹' : '$');
                  }}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none"
                >
                  <option value="INR">Indian Rupee (INR ₹)</option>
                  <option value="USD">US Dollar (USD $)</option>
                  <option value="EUR">Euro (EUR €)</option>
                  <option value="GBP">British Pound (GBP £)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Address & Location Details
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none mb-2"
                />
                <div className="grid grid-cols-3 gap-2">
                  <input type="text" placeholder="City" value={city} onChange={e => setCity(e.target.value)} className="bg-slate-50 dark:bg-slate-800 border rounded-xl px-3 py-1.5" />
                  <input type="text" placeholder="State" value={state} onChange={e => setState(e.target.value)} className="bg-slate-50 dark:bg-slate-800 border rounded-xl px-3 py-1.5" />
                  <input type="text" placeholder="PIN Code" value={pinCode} onChange={e => setPinCode(e.target.value)} className="bg-slate-50 dark:bg-slate-800 border rounded-xl px-3 py-1.5" />
                </div>
              </div>
            </div>

            {/* Features Selection Grid */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block">
                Select Features & Modules to Enable
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={features.gstBilling} onChange={e => setFeatures(f => ({ ...f, gstBilling: e.target.checked }))} className="accent-teal-600" />
                  <span>GST Invoicing & Billing</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={features.inventory} onChange={e => setFeatures(f => ({ ...f, inventory: e.target.checked }))} className="accent-teal-600" />
                  <span>Inventory Control</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={features.brs} onChange={e => setFeatures(f => ({ ...f, brs: e.target.checked }))} className="accent-teal-600" />
                  <span>Bank Reconciliation (BRS)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={features.financeEngine} onChange={e => setFeatures(f => ({ ...f, financeEngine: e.target.checked }))} className="accent-teal-600" />
                  <span>Financial Health Engine</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={features.tdsTax} onChange={e => setFeatures(f => ({ ...f, tdsTax: e.target.checked }))} className="accent-teal-600" />
                  <span>TDS & Tax Computation</span>
                </label>
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300"
              >
                Back
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all"
              >
                <span>Proceed to Security PIN Setup</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Mandatory 5-Digit Security PIN Setup */}
        {step === 3 && (
          <form onSubmit={handleFinalRegisterCompany} className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                Set Mandatory 5-Digit Security PIN
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Protect company ledgers, voucher alterations, and financial reports with a 5-digit security PIN.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4 max-w-md mx-auto text-center">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Enter 5-Digit Security PIN
                </label>
                <input
                  type="password"
                  maxLength={5}
                  value={securityPin}
                  onChange={e => setSecurityPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="• • • • •"
                  className="w-40 text-center font-mono text-2xl tracking-[0.5em] font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Confirm 5-Digit Security PIN
                </label>
                <input
                  type="password"
                  maxLength={5}
                  value={confirmPin}
                  onChange={e => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="• • • • •"
                  className="w-40 text-center font-mono text-2xl tracking-[0.5em] font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              {pinError && (
                <div className="p-3 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold text-xs border border-rose-500/20">
                  {pinError}
                </div>
              )}

              <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>PIN must be changed quarterly according to ICAI security guidelines.</span>
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300"
              >
                Back
              </button>
              <button
                type="submit"
                className="px-8 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Register Company & Unlock Gateway</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
