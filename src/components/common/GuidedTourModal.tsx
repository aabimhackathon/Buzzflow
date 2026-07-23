import React, { useState } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  Landmark, 
  BrainCircuit, 
  Building2, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  X,
  Compass,
  ShieldCheck,
  Zap,
  Receipt
} from 'lucide-react';
import { useAccounting } from '../../context/AccountingContext';

interface TourStep {
  id: string;
  title: string;
  subtitle: string;
  moduleBadge: string;
  badgeBg: string;
  badgeText: string;
  icon: React.ElementType;
  description: string;
  highlights: string[];
  previewGradient: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Buzzflow Enterprise',
    subtitle: 'Intelligent Real-Time Double-Entry Accounting Engine',
    moduleBadge: 'System Overview',
    badgeBg: 'bg-blue-100 dark:bg-blue-950/80',
    badgeText: 'text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    icon: Zap,
    description: 'Buzzflow is engineered with an ICAI-compliant double-entry ledger core. Designed for modern accounting teams, CFOs, and tax practitioners.',
    highlights: [
      'Multi-company portal with 5-digit PIN access',
      'Real-time trial balance balancing & automatic journal posting',
      'Customizable local currencies & regional tax formats (GST/VAT/Sales Tax)'
    ],
    previewGradient: 'from-blue-600 via-indigo-600 to-teal-600'
  },
  {
    id: 'accounting',
    title: 'Core Accounting & Ledger Suite',
    subtitle: 'Voucher Engine, Chart of Accounts & Bank Reconciliation',
    moduleBadge: 'Accounting Module',
    badgeBg: 'bg-teal-100 dark:bg-teal-950/80',
    badgeText: 'text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-800',
    icon: BookOpen,
    description: 'Manage all financial transactions with precision. Post Payments, Receipts, Contras, Journals, Sales, and Purchases with instant debit-credit validation.',
    highlights: [
      'Day Book audit stream with instant search & filter',
      'Hierarchical Chart of Accounts (COA) with group trees',
      'Automated Bank Reconciliation (BRS) & Tax Filing Workflows'
    ],
    previewGradient: 'from-teal-600 via-emerald-600 to-cyan-600'
  },
  {
    id: 'finance',
    title: 'Finance, Banking & Liquidity',
    subtitle: 'Debtors, Creditors, Bank Registers & Interest Models',
    moduleBadge: 'Finance Engine',
    badgeBg: 'bg-indigo-100 dark:bg-indigo-950/80',
    badgeText: 'text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    icon: Landmark,
    description: 'Maintain strict control over working capital, cash flow, outstanding aging, and party ledgers for both buyers and suppliers.',
    highlights: [
      'Sundry Debtors & Creditors aging reports with overdue alerts',
      'Bank & Cash registers with live liquidity dials',
      'Custom Interest Calculation models & term loan trackers'
    ],
    previewGradient: 'from-indigo-600 via-purple-600 to-blue-600'
  },
  {
    id: 'intelligence',
    title: 'AI Intelligence & Financial Reports',
    subtitle: 'Automated P&L, Balance Sheet & AI Ledger Assistant',
    moduleBadge: 'Intelligence & Reports',
    badgeBg: 'bg-amber-100 dark:bg-amber-950/80',
    badgeText: 'text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    icon: BrainCircuit,
    description: 'Instant financial statement generation combined with an AI Accountant that creates voucher drafts from plain English instructions.',
    highlights: [
      'Live Profit & Loss, Balance Sheet, and Trial Balance reports',
      'Interactive AI Accountant chatbot for fast double-entry voucher drafting',
      'Scheme discount calculators & promotional yield analytics'
    ],
    previewGradient: 'from-amber-600 via-orange-600 to-rose-600'
  },
  {
    id: 'compliance',
    title: 'Security, Audit Log & Encrypted Backups',
    subtitle: 'Statutory Compliance & Manual Data Safeguards',
    moduleBadge: 'Compliance & Safety',
    badgeBg: 'bg-emerald-100 dark:bg-emerald-950/80',
    badgeText: 'text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    icon: ShieldCheck,
    description: 'Ensure full regulatory compliance with detailed audit log history, quarterly PIN rotation checks, and manual encrypted JSON data backups.',
    highlights: [
      'Immutable Audit Log tracking every voucher edit and setting change',
      'Encrypted JSON Backup Export & One-Click Manual Restoration',
      'Configurable regional tax formats (GST, VAT, Sales Tax)'
    ],
    previewGradient: 'from-emerald-600 via-teal-600 to-cyan-700'
  }
];

export const GuidedTourModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { activeCompany, setActiveTab, setAccountingSubTab } = useAccounting();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (!isOpen) return null;

  const currentStep = TOUR_STEPS[currentStepIndex];
  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === TOUR_STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      onClose();
    } else {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirst) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const jumpToModule = (stepId: string) => {
    switch (stepId) {
      case 'accounting':
        setActiveTab('accounting');
        setAccountingSubTab('daybook');
        break;
      case 'finance':
        setActiveTab('finance');
        break;
      case 'intelligence':
        setActiveTab('reports');
        break;
      case 'compliance':
        setActiveTab('company');
        break;
      default:
        setActiveTab('dashboard');
        break;
    }
    onClose();
  };

  const StepIcon = currentStep.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col transition-all">
        
        {/* Header Header Gradient Banner */}
        <div className={`p-6 text-white bg-gradient-to-r ${currentStep.previewGradient} relative overflow-hidden`}>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full backdrop-blur-md transition-colors"
            title="Close Tour"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border backdrop-blur-md bg-white/20 text-white border-white/30`}>
              {currentStep.moduleBadge}
            </span>
            <span className="text-xs text-white/80 font-mono">
              Step {currentStepIndex + 1} of {TOUR_STEPS.length}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-inner">
              <StepIcon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-tight">{currentStep.title}</h3>
              <p className="text-xs text-white/90">{currentStep.subtitle}</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-5 w-full bg-black/20 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-white h-full transition-all duration-300" 
              style={{ width: `${((currentStepIndex + 1) / TOUR_STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 flex-1 text-slate-800 dark:text-slate-200">
          <p className="text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300 font-medium">
            {currentStep.description}
          </p>

          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/60 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-teal-600" /> Key Features in this Module:
            </h4>
            <ul className="space-y-2 text-xs">
              {currentStep.highlights.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-slate-700 dark:text-slate-200 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Context Note */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 bg-slate-100/70 dark:bg-slate-800/40 p-2.5 rounded-xl">
            <span className="truncate">Active Company: <strong className="text-slate-800 dark:text-slate-200">{activeCompany.name}</strong></span>
            <button 
              onClick={() => jumpToModule(currentStep.id)}
              className="text-teal-600 dark:text-teal-400 font-bold hover:underline shrink-0 flex items-center gap-1"
            >
              Open Module Directly <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 px-3 py-2 rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors"
          >
            Skip Tour
          </button>

          <div className="flex items-center gap-2">
            {!isFirst && (
              <button
                onClick={handlePrev}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
            )}

            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition-all"
            >
              <span>{isLast ? 'Get Started' : 'Next Step'}</span>
              {!isLast && <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
