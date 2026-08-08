import React from 'react';
import { VEPARI_ASSETS } from '../../config/assets';
import { AiOsParticleCanvas } from './AiOsParticleCanvas';
import { Cpu, ShieldCheck, Sparkles, Terminal } from 'lucide-react';

interface AiOsBootSequenceProps {
  companyName: string;
  progress: number;
  stepMessage: string;
  onSkip?: () => void;
}

export const AiOsBootSequence: React.FC<AiOsBootSequenceProps> = ({
  companyName,
  progress,
  stepMessage,
  onSkip
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col items-center justify-center p-4 sm:p-6 select-none overflow-hidden animate-in fade-in duration-300">
      {/* Dynamic Neural Particle Canvas Background */}
      <AiOsParticleCanvas aiState="EXECUTING" className="opacity-90" />

      {/* Central Glassmorphic AI Core Terminal */}
      <div className="relative z-10 max-w-lg w-full bg-slate-900/95 backdrop-blur-2xl border border-teal-500/40 p-6 sm:p-8 rounded-3xl shadow-2xl shadow-teal-500/20 text-center space-y-6">
        
        {/* Pulsing Core Orb */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-teal-500 via-amber-400 to-indigo-500 opacity-40 blur-xl animate-pulse" />
          <div className="relative w-full h-full rounded-2xl bg-slate-950 border border-teal-400/60 p-2.5 flex items-center justify-center shadow-inner">
            <img 
              src={VEPARI_ASSETS.appIcon} 
              alt="Vepari AI Core" 
              className="w-full h-full object-cover rounded-xl shadow-md"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-center gap-2 mb-1.5">
            <h2 className="text-2xl sm:text-3xl font-black font-logo tracking-tight text-white flex items-center gap-2">
              VEPARI AI OS
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 uppercase tracking-wider">
              v2.5
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 font-medium">
            Booting AI Business Operating System for <strong className="text-teal-300">{companyName}</strong>
          </p>
        </div>

        {/* System Diagnostics & Progress */}
        <div className="space-y-3 bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-teal-400 font-bold">
              <Terminal className="w-3.5 h-3.5" />
              SYSTEM BOOT
            </span>
            <span className="text-amber-400 font-bold font-num">{progress}%</span>
          </div>

          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700/80">
            <div 
              className="h-full bg-gradient-to-r from-teal-400 via-amber-400 to-emerald-400 transition-all duration-150 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="h-8 flex items-center justify-center text-xs font-mono text-teal-300 gap-2">
            <Cpu className="w-4 h-4 text-amber-400 animate-spin shrink-0" />
            <span className="truncate">{stepMessage}</span>
          </div>
        </div>

        {/* Footer & Vault Badge */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Encrypted Workspace Vault
          </span>
          {onSkip && (
            <button
              onClick={onSkip}
              className="text-xs text-slate-400 hover:text-white underline transition-colors"
            >
              Skip Intro
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
