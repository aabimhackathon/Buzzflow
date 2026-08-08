import React, { useState, useEffect } from 'react';
import { useAccounting } from '../../context/AccountingContext';
import { VEPARI_ASSETS } from '../../config/assets';
import { BriefingEngine } from '../../ai/briefing/BriefingEngine';
import { AIState, AIToolCall, AIConfirmation } from '../../ai/ui-contracts';
import { AiOsParticleCanvas } from './AiOsParticleCanvas';
import { AiOsBootSplash } from './AiOsBootSplash';
import { 
  Sparkles, 
  Bot, 
  Mic, 
  MicOff, 
  Send, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Clock, 
  Cpu, 
  Layers, 
  Zap,
  ShieldCheck,
  Search,
  Upload,
  RefreshCw,
  Sliders,
  Maximize2
} from 'lucide-react';

interface VepariAiCommandCenterProps {
  onOpenVoice?: () => void;
  onOpenVision?: () => void;
}

export const VepariAiCommandCenter: React.FC<VepariAiCommandCenterProps> = () => {
  const { company, activeCompany, vouchers, ledgers, inventory, profitLoss, setActiveTab, setAccountingSubTab, addVoucher, addAuditLog, systemOsState, setSystemOsState, rebootOs } = useAccounting();
  
  // Particle Boot sequence state
  const [showBootSplash, setShowBootSplash] = useState(systemOsState === 'initializing');

  useEffect(() => {
    if (systemOsState === 'initializing') {
      setShowBootSplash(true);
    }
  }, [systemOsState]);

  const handleBootComplete = () => {
    setShowBootSplash(false);
    if (setSystemOsState) {
      setSystemOsState('ready');
    }
  };

  // AI State interface indicator (IDLE, LISTENING, UNDERSTANDING, PLANNING, RETRIEVING, EXECUTING, WAITING_FOR_CONFIRMATION, RESPONDING, COMPLETED, ERROR)
  const [aiState, setAiState] = useState<AIState>('IDLE');
  const [inputCommand, setInputCommand] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Active operation execution simulation for UI visualization
  const [activeToolCall, setActiveToolCall] = useState<AIToolCall | null>(null);
  const [activeConfirmation, setActiveConfirmation] = useState<AIConfirmation | null>(null);
  const [operationLog, setOperationLog] = useState<string[]>([]);

  // Briefing computation from real financial data
  const briefing = BriefingEngine.generateBriefing(activeCompany, vouchers, ledgers, inventory, profitLoss);

  const engines = [
    {
      id: 'finance',
      name: 'Finance Engine',
      asset: VEPARI_ASSETS.engines.finance,
      purpose: 'Double-entry general ledger, working capital, P&L, balance sheet & liquidity monitoring',
      status: 'ACTIVE',
      metric: `${activeCompany.currencySymbol}${profitLoss.netProfit.toLocaleString()} Net Profit`,
      tab: 'finance'
    },
    {
      id: 'intelligence',
      name: 'Intelligence Engine',
      asset: VEPARI_ASSETS.engines.intelligence,
      purpose: 'Business health scoring, trend analysis, predictive insights & anomaly detection',
      status: 'ACTIVE',
      metric: '94/100 Health Index',
      tab: 'intelligence'
    },
    {
      id: 'memory',
      name: 'Memory Engine',
      asset: VEPARI_ASSETS.engines.memory,
      purpose: 'Remembers owner preferences, business rules, customer terms & learned decisions',
      status: 'ACTIVE',
      metric: '18 Active Business Memories',
      tab: 'memory'
    },
    {
      id: 'market',
      name: 'Market Engine',
      asset: VEPARI_ASSETS.engines.market,
      purpose: 'External price trends, GST tax policy changes, sector updates & economic intelligence',
      status: 'ACTIVE',
      metric: '3 Market Updates',
      tab: 'market'
    },
    {
      id: 'growth',
      name: 'Growth Engine',
      asset: VEPARI_ASSETS.engines.growth,
      purpose: 'Customer upsell recommendations, slow-moving inventory clearance & revenue triggers',
      status: 'ACTIVE',
      metric: '2 Growth Opportunities',
      tab: 'growth'
    },
    {
      id: 'automation',
      name: 'Automation Engine',
      asset: VEPARI_ASSETS.engines.automation,
      purpose: 'Scheduled payment reminders, reorder level alerts & automated voucher drafting',
      status: 'ACTIVE',
      metric: '4 Active Workflows',
      tab: 'automation'
    },
    {
      id: 'vision',
      name: 'Vision Engine',
      asset: VEPARI_ASSETS.engines.vision,
      purpose: 'Document OCR processing for invoices, receipts & bills directly into vouchers',
      status: 'STANDBY',
      metric: '98% OCR Accuracy',
      tab: 'vision'
    },
    {
      id: 'voice',
      name: 'Voice Engine',
      asset: VEPARI_ASSETS.engines.voice,
      purpose: 'Natural language voice interface for command execution & spoken reporting',
      status: 'STANDBY',
      metric: 'Hindi / English Voice Ready',
      tab: 'voice'
    }
  ];

  const handleCommandSubmit = (cmdText?: string) => {
    const prompt = cmdText || inputCommand;
    if (!prompt.trim()) return;

    setInputCommand('');
    setIsProcessing(true);
    setAiState('UNDERSTANDING');
    setOperationLog([`Received command: "${prompt}"`, `Parsing intent for ${activeCompany.name}...`]);

    setTimeout(() => {
      setAiState('PLANNING');
      setOperationLog(prev => [...prev, `Selected tool: getOutstandingReceivables & draftVoucher`]);
    }, 400);

    setTimeout(() => {
      setAiState('RETRIEVING');
      setOperationLog(prev => [...prev, `Retrieved 2 overdue debtor accounts totaling ${activeCompany.currencySymbol}48,500`]);
    }, 800);

    setTimeout(() => {
      if (prompt.toLowerCase().includes('payment') || prompt.toLowerCase().includes('voucher') || prompt.toLowerCase().includes('create')) {
        setAiState('WAITING_FOR_CONFIRMATION');
        setActiveToolCall({
          id: 'tool-1',
          toolName: 'createVoucherDraft',
          module: 'accounting',
          arguments: { party: 'ABC Suppliers', amount: 25000, type: 'payment' },
          reasoning: 'Drafting payment voucher to clear overdue vendor balance',
          status: 'pending'
        });
        setActiveConfirmation({
          id: 'conf-1',
          actionType: 'POST_VOUCHER',
          title: 'Confirm Payment Voucher Creation',
          summary: `Post Payment Voucher of ${activeCompany.currencySymbol}25,000 to ABC Suppliers via HDFC Bank`,
          module: 'Accounting',
          payload: { voucherType: 'payment', amount: 25000, party: 'ABC Suppliers' }
        });
      } else {
        setAiState('COMPLETED');
        setOperationLog(prev => [...prev, `Query completed successfully.`]);
      }
      setIsProcessing(false);
    }, 1200);
  };

  const handleConfirmAction = () => {
    if (!activeConfirmation) return;
    setAiState('EXECUTING');
    
    addVoucher({
      companyId: activeCompany.id,
      voucherNo: `VCH-${Date.now().toString().substr(-6)}`,
      date: new Date().toISOString().slice(0, 10),
      voucherType: 'payment',
      narration: activeConfirmation.summary,
      totalAmount: activeConfirmation.payload.amount || 25000,
      status: 'posted',
      items: [
        { id: '1', ledgerId: 'ABC Suppliers', ledgerName: 'ABC Suppliers', drCr: 'Dr', amount: 25000 },
        { id: '2', ledgerId: 'HDFC Bank', ledgerName: 'HDFC Bank', drCr: 'Cr', amount: 25000 }
      ]
    });

    addAuditLog({
      action: 'POST_VOUCHER',
      module: 'Accounting',
      details: activeConfirmation.summary,
      userRole: (activeCompany as any).ownerName || activeCompany.legalName || 'Owner'
    });

    setTimeout(() => {
      setAiState('COMPLETED');
      setOperationLog(prev => [...prev, `✅ Voucher posted successfully into General Ledger.`]);
      setActiveConfirmation(null);
      setActiveToolCall(null);
    }, 500);
  };

  return (
    <div className="space-y-6 relative">
      
      {/* Particle Boot Initialization Sequence */}
      {(showBootSplash || systemOsState === 'initializing') && (
        <AiOsBootSplash
          companyName={activeCompany.name}
          onComplete={handleBootComplete}
        />
      )}

      {/* Top Operating System Banner with Particle Canvas Background */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white p-6 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
        
        {/* Interactive Neural Canvas Background */}
        <AiOsParticleCanvas aiState={aiState} className="opacity-70" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="p-2 bg-amber-400/10 border border-amber-400/30 rounded-2xl shadow-lg relative group">
              <div className="absolute inset-0 bg-teal-400/20 rounded-2xl blur-md group-hover:blur-lg transition-all" />
              <img 
                src={VEPARI_ASSETS.appIcon} 
                alt="Vepari AI Operating System" 
                className="relative z-10 w-12 h-12 rounded-xl object-cover bg-white p-0.5"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black tracking-tight text-white font-logo">VEPARI AI OS</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 uppercase tracking-wider">
                  AI Business Operating System
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Central Intelligence & Command Center for <strong className="text-teal-300">{activeCompany.name}</strong>
              </p>
            </div>
          </div>

          {/* AI State Pill Selector & Re-Boot Trigger */}
          <div className="flex items-center gap-2 bg-slate-950/90 p-2 rounded-2xl border border-slate-800/80 backdrop-blur-md">
            <button
              onClick={() => rebootOs ? rebootOs() : setShowBootSplash(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-[11px] font-bold text-teal-300 border border-teal-500/30 transition-all shadow-xs"
              title="Re-run AI OS particle boot sequence"
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span>Re-Initialize OS</span>
            </button>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800/90 border border-slate-700 text-xs font-bold text-amber-300">
              <span className={`w-2 h-2 rounded-full ${aiState === 'IDLE' ? 'bg-emerald-400' : 'bg-amber-400 animate-ping'}`} />
              <span>{aiState}</span>
            </div>
          </div>
        </div>

        {/* Executive Greeting & WHILE YOU WERE AWAY Briefing */}
        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <span>{briefing.greeting}</span>
              <span className="text-xs font-normal text-slate-400">| Executive Morning Briefing</span>
            </h2>
            <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>WHILE YOU WERE AWAY</span>
            </span>
          </div>

          {/* KPI Summary Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80">
              <span className="text-[10px] font-medium text-slate-400 block uppercase">Sales</span>
              <span className="text-base font-bold text-white mt-0.5 block">{briefing.highlights[0]?.value}</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80">
              <span className="text-[10px] font-medium text-slate-400 block uppercase">Net Profit</span>
              <span className="text-base font-bold text-emerald-400 mt-0.5 block">{briefing.highlights[1]?.value}</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80">
              <span className="text-[10px] font-medium text-slate-400 block uppercase">Receivables</span>
              <span className="text-base font-bold text-amber-300 mt-0.5 block">{briefing.highlights[2]?.value}</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80">
              <span className="text-[10px] font-medium text-slate-400 block uppercase">Low Stock</span>
              <span className="text-base font-bold text-rose-300 mt-0.5 block">{briefing.highlights[3]?.value}</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80">
              <span className="text-[10px] font-medium text-slate-400 block uppercase">Government</span>
              <span className="text-base font-bold text-teal-300 mt-0.5 block">0 GST Alerts</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80">
              <span className="text-[10px] font-medium text-slate-400 block uppercase">Market Index</span>
              <span className="text-base font-bold text-blue-300 mt-0.5 block">Stable</span>
            </div>
          </div>

          {/* AI Priority Recommendation */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-400 text-slate-950 font-black shrink-0 mt-0.5">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-300 block uppercase tracking-wider">Vepari Priority Action</span>
                <p className="text-xs text-slate-200 mt-0.5">{briefing.recommendedAction.description}</p>
              </div>
            </div>
            <button
              onClick={() => {
                setActiveTab(briefing.recommendedAction.targetTab || 'accounting');
                if (briefing.recommendedAction.targetSubTab) setAccountingSubTab(briefing.recommendedAction.targetSubTab as any);
              }}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors shrink-0 flex items-center gap-1.5"
            >
              <span>{briefing.recommendedAction.title}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Command Bar & AI State Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Command Input & Live Operation Visualizer */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Command Input Box */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                <Bot className="w-4 h-4 text-teal-600" />
                <span>Command Vepari AI Operating System</span>
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('voice')}
                  className="px-2.5 py-1 rounded-xl text-[11px] font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800 flex items-center gap-1"
                >
                  <Mic className="w-3 h-3" /> Voice Command
                </button>
                <button
                  onClick={() => setActiveTab('vision')}
                  className="px-2.5 py-1 rounded-xl text-[11px] font-semibold bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 border border-teal-200 dark:border-teal-800 flex items-center gap-1"
                >
                  <Upload className="w-3 h-3" /> Vision OCR
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputCommand}
                onChange={e => setInputCommand(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCommandSubmit()}
                placeholder="Type your command (e.g., 'Show overdue debtors', 'Draft payment voucher to ABC for ₹25,000')..."
                className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-3 rounded-2xl text-xs outline-none focus:ring-2 focus:ring-teal-500 border border-slate-200 dark:border-slate-700"
              />
              <button
                onClick={() => handleCommandSubmit()}
                disabled={isProcessing}
                className="px-5 py-3 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Execute</span>
              </button>
            </div>

            {/* Quick Prompts */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
              {['Show low stock items', 'Create payment voucher for ABC', 'Why did profit fall?', 'What GST tax rule changed?'].map((p, i) => (
                <button
                  key={i}
                  onClick={() => handleCommandSubmit(p)}
                  className="px-3 py-1 rounded-full text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-teal-500 border border-slate-200 dark:border-slate-700 whitespace-nowrap"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* AI Operation Visualization Box */}
          <div className="relative overflow-hidden bg-slate-900 text-white p-5 rounded-3xl border border-slate-800 shadow-xl space-y-4">
            <AiOsParticleCanvas aiState={aiState} className="opacity-40" />
            <div className="relative z-10 flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">AI Operation Visualizer</h3>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Module Inspector</span>
            </div>

            {/* Live Step Tracker */}
            <div className="space-y-2 text-xs font-mono">
              {operationLog.length === 0 ? (
                <p className="text-slate-500 italic">No active operation running. Enter a command above to observe AI execution.</p>
              ) : (
                operationLog.map((log, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                    <span>{log}</span>
                  </div>
                ))
              )}
            </div>

            {/* Confirmation Box if Pending */}
            {activeConfirmation && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>{activeConfirmation.title}</span>
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-slate-950 uppercase">
                    Confirmation Required
                  </span>
                </div>
                <p className="text-xs text-slate-200">{activeConfirmation.summary}</p>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={handleConfirmAction}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm & Post Voucher</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveConfirmation(null);
                      setAiState('IDLE');
                      setOperationLog(prev => [...prev, 'Operation cancelled by user.']);
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-semibold text-xs border border-slate-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: System Status & Memory Feed */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-teal-600" />
                <span>Operating System Pulse</span>
              </h3>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                100% HEALTHY
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span>Core Accounting Ledger</span>
                <span className="font-bold text-slate-900 dark:text-white">Balanced</span>
              </div>
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span>Security PIN Guard</span>
                <span className="font-bold text-emerald-600">Active (5-Digit)</span>
              </div>
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span>Gemini 2.5 Orchestrator</span>
                <span className="font-bold text-teal-600">Connected</span>
              </div>
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span>Vision OCR Engine</span>
                <span className="font-bold text-blue-600">Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Engine Command Center Grid (8 Authoritative Vepari AI Engines) */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-teal-600" />
              <span>Vepari AI Operating Engines</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">8 specialized intelligence modules running on top of company data</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {engines.map(engine => (
            <div
              key={engine.id}
              onClick={() => setActiveTab(engine.tab)}
              className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-teal-500/60 dark:hover:border-teal-500/60 shadow-xs hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform">
                    <img 
                      src={engine.asset} 
                      alt={engine.name} 
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    {engine.status}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-teal-600 transition-colors">
                    {engine.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {engine.purpose}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">{engine.metric}</span>
                <span className="text-teal-600 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                  Open <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
