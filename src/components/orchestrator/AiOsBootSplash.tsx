import React, { useEffect, useState } from 'react';
import { VEPARI_ASSETS } from '../../config/assets';
import { AiOsParticleCanvas } from './AiOsParticleCanvas';
import { Cpu, Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface AiOsBootSplashProps {
  companyName: string;
  onComplete: () => void;
}

export const AiOsBootSplash: React.FC<AiOsBootSplashProps> = ({ companyName, onComplete }) => {
  const [bootStep, setBootStep] = useState(0);

  const steps = [
    'INITIALIZING VEPARI AI OPERATING SYSTEM CORE...',
    'CONNECTING DOUBLE-ENTRY GENERAL LEDGER & TALLY ENGINE...',
    'LOADING 8 AUTHORITATIVE BUSINESS INTELLIGENCE MODULES...',
    'APPLYING 5-DIGIT ENCRYPTED OWNER GUARDRAILS & SECURITY PIN...',
    'VEPARI AI BUSINESS OS INITIALIZED'
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => setBootStep(1), 300);
    const timer2 = setTimeout(() => setBootStep(2), 700);
    const timer3 = setTimeout(() => setBootStep(3), 1100);
    const timer4 = setTimeout(() => setBootStep(4), 1500);
    const timer5 = setTimeout(() => onComplete(), 2000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col items-center justify-center p-6 select-none overflow-hidden">
      {/* High Density Interactive Particle Background */}
      <AiOsParticleCanvas aiState="EXECUTING" className="opacity-80" />

      {/* Central Glowing AI Core Orb */}
      <div className="relative z-10 max-w-md w-full bg-slate-900/90 backdrop-blur-xl border border-teal-500/40 p-8 rounded-3xl shadow-2xl shadow-teal-500/20 text-center space-y-6">
        
        {/* Animated Core Icon */}
        <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-teal-500 via-amber-400 to-blue-500 opacity-30 blur-xl animate-pulse" />
          <div className="relative w-full h-full rounded-2xl bg-slate-950 border border-teal-400/50 p-2 flex items-center justify-center shadow-inner">
            <img 
              src={VEPARI_ASSETS.appIcon} 
              alt="Vepari AI Core" 
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-center gap-2 mb-1">
            <h2 className="text-2xl font-black font-logo tracking-tight text-white">VEPARI AI OS</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 uppercase">v2.5</span>
          </div>
          <p className="text-xs text-slate-400">
            Booting Business Operating System for <strong className="text-teal-300">{companyName}</strong>
          </p>
        </div>

        {/* Progress Bar & Sequence Text */}
        <div className="space-y-3">
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700/80">
            <div 
              className="h-full bg-gradient-to-r from-teal-400 via-amber-400 to-emerald-400 transition-all duration-300 ease-out"
              style={{ width: `${((bootStep + 1) / steps.length) * 100}%` }}
            />
          </div>

          <div className="h-10 flex items-center justify-center text-xs font-mono text-teal-300 gap-2">
            <Cpu className="w-4 h-4 text-amber-400 animate-spin shrink-0" />
            <span className="truncate">{steps[bootStep]}</span>
          </div>
        </div>

        {/* Footnote */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Encrypted Workspace Vault
          </span>
          <span>100% Client-Side Private</span>
        </div>
      </div>
    </div>
  );
};
