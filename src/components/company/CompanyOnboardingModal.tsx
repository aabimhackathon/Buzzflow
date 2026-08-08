import React, { useState } from 'react';
import { useAccounting } from '../../context/AccountingContext';
import { INDIAN_ENTITY_TYPES, INDUSTRY_SECTORS } from '../../config/indian-business-types';
import { Building2, Key, CreditCard, ShieldCheck, CheckCircle2, ArrowRight, Sparkles, X, Lock, Check, Factory } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CompanyOnboardingModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { addCompany, setLicense, setActiveTab } = useAccounting();

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
  const [compName, setCompName] = useState('Apex Enterprises');
  const [legalName, setLegalName] = useState('Apex Enterprises Private Limited');
  const [entityType, setEntityType] = useState<string>(INDIAN_ENTITY_TYPES[0]);
  const [industry, setIndustry] = useState<string>(INDUSTRY_SECTORS[0]);
  const [fyStart, setFyStart] = useState('2025-04-01');
  const [fyEnd, setFyEnd] = useState('2026-03-31');
  const [gstin, setGstin] = useState('27AABCU9603R1ZM');
  const [pan, setPan] = useState('AABCU9603R');
  const [tan, setTan] = useState('MUMA12345B');
  const [udyamNo, setUdyamNo] = useState('UDYAM-MH-03-0012345');
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [address, setAddress] = useState('101 Business Park, Nariman Point');
  const [city, setCity] = useState('Mumbai');
  const [state, setState] = useState('Maharashtra');
  const [pinCode, setPinCode] = useState('400021');
  const [phone, setPhone] = useState('+91 98200 12345');
  const [email, setEmail] = useState('accounts@apexenterprises.com');

  // Production Unit Details
  const [hasProductionUnit, setHasProductionUnit] = useState(true);
  const [unitName, setUnitName] = useState('Apex Manufacturing Facility Unit 1');
  const [unitAddress, setUnitAddress] = useState('Plot 42, MIDC Industrial Area, Chakan');
  const [unitCity, setUnitCity] = useState('Pune');
  const [unitState, setUnitState] = useState('Maharashtra');
  const [unitPinCode, setUnitPinCode] = useState('410501');

  // Feature Unlocking Toggles
  const [unlockedModules, setUnlockedModules] = useState({
    billing: true,
    inventory: true,
    finance: true,
    tax: true,
    ai: true
  });

  // Security PIN
  const [securityPin, setSecurityPin] = useState('12345');
  const [confirmPin, setConfirmPin] = useState('12345');
  const [pinError, setPinError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Handle Payment Processing for License Purchase
  const handleSimulatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingPayment(true);
    setTimeout(() => {
      const key = `BUZZ-${purchaseTier.toUpperCase()}-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      setGeneratedKey(key);
      setIsProcessingPayment(false);
      setLicense({
        mode: purchaseTier,
        productKey: key,
        isLicensed: true,
        activatedAt: new Date().toISOString()
      });
    }, 1200);
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
      alert('Please enter a company display name.');
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

    // Call addCompany from context
    addCompany({
      name: compName,
      legalName: legalName || compName,
      entityType,
      industry,
      fyStart,
      fyEnd,
      gstin,
      pan,
      tan,
      udyamNo,
      currency,
      currencySymbol: currency === 'INR' ? '₹' : '$',
      address,
      city,
      state,
      pinCode,
      phone,
      email,
      productionUnit: hasProductionUnit ? {
        unitName,
        address: unitAddress,
        city: unitCity,
        state: unitState,
        pinCode: unitPinCode
      } : undefined,
      unlockedModules,
      securityPin
    });

    onClose();
    setActiveTab('dashboard');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-[#D8E2EE] dark:border-slate-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 max-h-[92vh] overflow-y-auto relative shadow-2xl space-y-6">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Wizard Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-[#5B6878]">
            <span className={step >= 1 ? 'text-[#163A70] dark:text-blue-400 font-bold' : ''}>1. License Mode</span>
            <span className={step >= 2 ? 'text-[#163A70] dark:text-blue-400 font-bold' : ''}>2. Corporate & Factory Setup</span>
            <span className={step >= 3 ? 'text-[#163A70] dark:text-blue-400 font-bold' : ''}>3. 5-Digit PIN Security</span>
          </div>
          <div className="h-2 bg-[#EEF3F8] dark:bg-slate-800 rounded-full overflow-hidden flex">
            <div className={`h-full bg-[#163A70] transition-all duration-300 ${step === 1 ? 'w-1/3' : step === 2 ? 'w-2/3' : 'w-full'}`} />
          </div>
        </div>

        {/* STEP 1: License Choice or Purchase */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[#1A2433] dark:text-white flex items-center gap-2">
                <Key className="w-5 h-5 text-[#163A70]" />
                Select Vepari AI Platform License & Edition
              </h2>
              <p className="text-xs text-[#5B6878] mt-1">
                Choose Educational Mode or activate an official Enterprise Product Key with live payment simulation.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setLicenseOption('educational')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  licenseOption === 'educational'
                    ? 'border-[#2F6FED] bg-[#EEF3F8] ring-2 ring-[#2F6FED]/20'
                    : 'border-[#D8E2EE] hover:border-slate-300'
                }`}
              >
                <div className="font-bold text-xs text-[#1A2433] mb-1">Educational Mode</div>
                <div className="text-[11px] text-[#5B6878]">Free mode for learning & testing without a product key.</div>
              </button>

              <button
                type="button"
                onClick={() => setLicenseOption('key')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  licenseOption === 'key'
                    ? 'border-[#2F6FED] bg-[#EEF3F8] ring-2 ring-[#2F6FED]/20'
                    : 'border-[#D8E2EE] hover:border-slate-300'
                }`}
              >
                <div className="font-bold text-xs text-[#1A2433] mb-1">Use Existing Key</div>
                <div className="text-[11px] text-[#5B6878]">Enter a 16-character license key you already own.</div>
              </button>

              <button
                type="button"
                onClick={() => setLicenseOption('purchase')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  licenseOption === 'purchase'
                    ? 'border-[#2F6FED] bg-[#EEF3F8] ring-2 ring-[#2F6FED]/20'
                    : 'border-[#D8E2EE] hover:border-slate-300'
                }`}
              >
                <div className="font-bold text-xs text-[#1A2433] mb-1 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#D9A227]" /> Purchase License
                </div>
                <div className="text-[11px] text-[#5B6878]">Buy Silver or Gold multi-user edition with payment gateway.</div>
              </button>
            </div>

            {/* Sub-section for Existing Key */}
            {licenseOption === 'key' && (
              <div className="p-4 rounded-2xl bg-[#EEF3F8] border border-[#D8E2EE] space-y-2">
                <label className="block text-xs font-bold text-[#1A2433]">
                  Enter 16-Character Product Key
                </label>
                <input
                  type="text"
                  placeholder="e.g. BUZZ-GOLD-2026-X892"
                  value={existingKey}
                  onChange={e => setExistingKey(e.target.value.toUpperCase())}
                  className="w-full bg-white border border-[#D8E2EE] rounded-xl px-3 py-2 text-xs font-mono font-bold text-[#1A2433] outline-none"
                />
              </div>
            )}

            {/* Sub-section for Purchasing License */}
            {licenseOption === 'purchase' && !generatedKey && (
              <form onSubmit={handleSimulatePayment} className="p-5 rounded-2xl bg-[#EEF3F8] border border-[#D8E2EE] space-y-4">
                <div className="flex items-center justify-between border-b border-[#D8E2EE] pb-3">
                  <span className="text-xs font-bold text-[#1A2433] uppercase tracking-wider">
                    Select Software Edition
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setPurchaseTier('silver')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${purchaseTier === 'silver' ? 'bg-[#163A70] text-white' : 'bg-white text-[#1A2433] border border-[#D8E2EE]'}`}
                    >
                      Silver Single-User (₹18,000)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPurchaseTier('gold')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${purchaseTier === 'gold' ? 'bg-[#163A70] text-white' : 'bg-white text-[#1A2433] border border-[#D8E2EE]'}`}
                    >
                      Gold Multi-User (₹54,000)
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-bold text-[#1A2433]">
                    Payment Gateway
                  </label>
                  <div className="flex gap-3 text-xs font-semibold">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="payMethod" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} />
                      UPI / PhonePe / GPay
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="payMethod" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                      Credit / Debit Card
                    </label>
                  </div>

                  {paymentMethod === 'upi' && (
                    <input
                      type="text"
                      placeholder="Enter UPI VPA (e.g. apex@okicici)"
                      value={upiId}
                      onChange={e => setUpiId(e.target.value)}
                      className="w-full bg-white border border-[#D8E2EE] rounded-xl px-3 py-2 text-xs font-mono outline-none"
                      required
                    />
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isProcessingPayment}
                  className="w-full py-2.5 rounded-xl bg-[#16B8A6] hover:bg-[#163A70] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>{isProcessingPayment ? 'Processing Live Payment...' : `Pay ${purchaseTier === 'gold' ? '₹54,000' : '₹18,000'} & Issue License`}</span>
                </button>
              </form>
            )}

            {generatedKey && (
              <div className="p-4 rounded-2xl bg-[#16B8A6]/10 border border-[#16B8A6]/30 text-[#163A70] text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold">
                  <CheckCircle2 className="w-5 h-5 text-[#16B8A6]" />
                  <span>Payment Confirmed! License Key Generated</span>
                </div>
                <p className="font-mono font-bold text-sm bg-white p-2.5 rounded-xl text-center text-[#163A70] border border-[#D8E2EE]">
                  {generatedKey}
                </p>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleApplyLicenseAndNext}
                className="px-6 py-2.5 rounded-xl bg-[#163A70] hover:bg-[#2F6FED] text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all"
              >
                <span>Continue to Company Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Elaborated Company Setup */}
        {step === 2 && (
          <form onSubmit={handleCompanyDetailsNext} className="space-y-5 text-xs">
            <div>
              <h2 className="text-xl font-bold text-[#1A2433] dark:text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#163A70]" />
                Company Corporate & Production Setup
              </h2>
              <p className="text-xs text-[#5B6878] mt-0.5">
                Register company legal names, 25 entity types, production units, official tax identifiers, and module preferences.
              </p>
            </div>

            {/* Basic & Legal Names */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-[#1A2433] mb-1">Company Trade / Display Name *</label>
                <input
                  type="text"
                  value={compName}
                  onChange={e => setCompName(e.target.value)}
                  className="w-full bg-[#EEF3F8] border border-[#D8E2EE] rounded-xl px-3 py-2 font-bold text-[#1A2433] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-[#1A2433] mb-1">Legal Registered Name *</label>
                <input
                  type="text"
                  value={legalName}
                  onChange={e => setLegalName(e.target.value)}
                  className="w-full bg-[#EEF3F8] border border-[#D8E2EE] rounded-xl px-3 py-2 text-[#1A2433] outline-none"
                  required
                />
              </div>
            </div>

            {/* Entity Type (25 choices) & Industry Sector (25 choices) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-[#1A2433] mb-1">Business Entity Type (25 Legal Types)</label>
                <select
                  value={entityType}
                  onChange={e => setEntityType(e.target.value)}
                  className="w-full bg-[#EEF3F8] border border-[#D8E2EE] rounded-xl px-3 py-2 font-semibold text-[#1A2433] outline-none"
                >
                  {INDIAN_ENTITY_TYPES.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#1A2433] mb-1">Industry Sector (25 Sectors)</label>
                <select
                  value={industry}
                  onChange={e => setIndustry(e.target.value)}
                  className="w-full bg-[#EEF3F8] border border-[#D8E2EE] rounded-xl px-3 py-2 font-semibold text-[#1A2433] outline-none"
                >
                  {INDUSTRY_SECTORS.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Official Identifiers: GSTIN, PAN, TAN, UDYAM */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block font-bold text-[#1A2433] mb-1">GSTIN No.</label>
                <input type="text" value={gstin} onChange={e => setGstin(e.target.value)} className="w-full bg-[#EEF3F8] border border-[#D8E2EE] rounded-xl px-3 py-1.5 font-mono text-[#1A2433]" />
              </div>
              <div>
                <label className="block font-bold text-[#1A2433] mb-1">PAN No.</label>
                <input type="text" value={pan} onChange={e => setPan(e.target.value)} className="w-full bg-[#EEF3F8] border border-[#D8E2EE] rounded-xl px-3 py-1.5 font-mono text-[#1A2433]" />
              </div>
              <div>
                <label className="block font-bold text-[#1A2433] mb-1">TAN No.</label>
                <input type="text" value={tan} onChange={e => setTan(e.target.value)} className="w-full bg-[#EEF3F8] border border-[#D8E2EE] rounded-xl px-3 py-1.5 font-mono text-[#1A2433]" />
              </div>
              <div>
                <label className="block font-bold text-[#1A2433] mb-1">Udyam MSME No.</label>
                <input type="text" value={udyamNo} onChange={e => setUdyamNo(e.target.value)} className="w-full bg-[#EEF3F8] border border-[#D8E2EE] rounded-xl px-3 py-1.5 font-mono text-[#1A2433]" />
              </div>
            </div>

            {/* Primary Registered Office Address */}
            <div>
              <label className="block font-bold text-[#1A2433] mb-1">Head Office Address</label>
              <input type="text" value={address} onChange={e => setAddress(e.target.value)} className="w-full bg-[#EEF3F8] border border-[#D8E2EE] rounded-xl px-3 py-2 text-[#1A2433] mb-2" />
              <div className="grid grid-cols-3 gap-2">
                <input type="text" placeholder="City" value={city} onChange={e => setCity(e.target.value)} className="bg-[#EEF3F8] border border-[#D8E2EE] rounded-xl px-3 py-1.5" />
                <input type="text" placeholder="State" value={state} onChange={e => setState(e.target.value)} className="bg-[#EEF3F8] border border-[#D8E2EE] rounded-xl px-3 py-1.5" />
                <input type="text" placeholder="PIN Code" value={pinCode} onChange={e => setPinCode(e.target.value)} className="bg-[#EEF3F8] border border-[#D8E2EE] rounded-xl px-3 py-1.5" />
              </div>
            </div>

            {/* Production Unit / Factory / Warehouse Details */}
            <div className="p-4 rounded-2xl bg-[#EEF3F8] border border-[#D8E2EE] space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#163A70] flex items-center gap-2">
                  <Factory className="w-4 h-4 text-[#16B8A6]" /> Production Unit / Factory Details
                </span>
                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input type="checkbox" checked={hasProductionUnit} onChange={e => setHasProductionUnit(e.target.checked)} className="accent-[#163A70]" />
                  <span>Has Separate Production Plant</span>
                </label>
              </div>

              {hasProductionUnit && (
                <div className="space-y-2 pt-2 border-t border-[#D8E2EE]">
                  <input type="text" placeholder="Production Facility Name" value={unitName} onChange={e => setUnitName(e.target.value)} className="w-full bg-white border border-[#D8E2EE] rounded-xl px-3 py-1.5 font-medium" />
                  <input type="text" placeholder="Factory Address" value={unitAddress} onChange={e => setUnitAddress(e.target.value)} className="w-full bg-white border border-[#D8E2EE] rounded-xl px-3 py-1.5 font-medium" />
                  <div className="grid grid-cols-3 gap-2">
                    <input type="text" placeholder="City" value={unitCity} onChange={e => setUnitCity(e.target.value)} className="bg-white border border-[#D8E2EE] rounded-xl px-3 py-1.5" />
                    <input type="text" placeholder="State" value={unitState} onChange={e => setUnitState(e.target.value)} className="bg-white border border-[#D8E2EE] rounded-xl px-3 py-1.5" />
                    <input type="text" placeholder="PIN Code" value={unitPinCode} onChange={e => setUnitPinCode(e.target.value)} className="bg-white border border-[#D8E2EE] rounded-xl px-3 py-1.5" />
                  </div>
                </div>
              )}
            </div>

            {/* Module Unlocking Preferences */}
            <div className="p-4 rounded-2xl bg-[#EEF3F8] border border-[#D8E2EE] space-y-2">
              <span className="text-xs font-bold text-[#163A70] uppercase tracking-wider block">
                Unlock Module Access Rights
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-medium">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" checked={unlockedModules.billing} onChange={e => setUnlockedModules(u => ({ ...u, billing: e.target.checked }))} className="accent-[#163A70]" />
                  <span>GST Billing</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" checked={unlockedModules.inventory} onChange={e => setUnlockedModules(u => ({ ...u, inventory: e.target.checked }))} className="accent-[#163A70]" />
                  <span>Inventory</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" checked={unlockedModules.finance} onChange={e => setUnlockedModules(u => ({ ...u, finance: e.target.checked }))} className="accent-[#163A70]" />
                  <span>Finance</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" checked={unlockedModules.tax} onChange={e => setUnlockedModules(u => ({ ...u, tax: e.target.checked }))} className="accent-[#163A70]" />
                  <span>TDS / BRS</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" checked={unlockedModules.ai} onChange={e => setUnlockedModules(u => ({ ...u, ai: e.target.checked }))} className="accent-[#163A70]" />
                  <span>AI Accountant</span>
                </label>
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-xl border border-[#D8E2EE] text-xs font-bold text-[#5B6878]"
              >
                Back
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#163A70] hover:bg-[#2F6FED] text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all"
              >
                <span>Proceed to 5-Digit Security PIN</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Mandatory 5-Digit Security PIN Setup */}
        {step === 3 && (
          <form onSubmit={handleFinalRegisterCompany} className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[#1A2433] dark:text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#163A70]" />
                Set 5-Digit Security PIN
              </h2>
              <p className="text-xs text-[#5B6878] mt-1">
                Protect company ledgers, vouchers, and financial records with a mandatory 5-digit PIN.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#EEF3F8] border border-[#D8E2EE] space-y-4 max-w-md mx-auto text-center">
              <div>
                <label className="block text-xs font-bold text-[#1A2433] mb-2">
                  Enter 5-Digit PIN
                </label>
                <input
                  type="password"
                  maxLength={5}
                  value={securityPin}
                  onChange={e => setSecurityPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="• • • • •"
                  className="w-44 text-center font-mono text-2xl tracking-[0.5em] font-bold bg-white border border-[#D8E2EE] rounded-2xl px-4 py-3 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A2433] mb-2">
                  Confirm 5-Digit PIN
                </label>
                <input
                  type="password"
                  maxLength={5}
                  value={confirmPin}
                  onChange={e => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="• • • • •"
                  className="w-44 text-center font-mono text-2xl tracking-[0.5em] font-bold bg-white border border-[#D8E2EE] rounded-2xl px-4 py-3 outline-none"
                  required
                />
              </div>

              {pinError && (
                <div className="p-3 rounded-xl bg-[#E53935]/10 text-[#E53935] font-bold text-xs border border-[#E53935]/20">
                  {pinError}
                </div>
              )}

              <div className="text-[11px] text-[#5B6878] flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#16B8A6]" />
                <span>PIN is encrypted and stored locally in security vault.</span>
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 rounded-xl border border-[#D8E2EE] text-xs font-bold text-[#5B6878]"
              >
                Back
              </button>
              <button
                type="submit"
                className="px-8 py-3 rounded-2xl bg-[#163A70] hover:bg-[#2F6FED] text-white font-bold text-xs shadow-lg transition-all flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Create Company & Unlock Dashboard</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

