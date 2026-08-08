import React from 'react';
import { Bot, Sparkles } from 'lucide-react';
import { VEPARI_ASSETS } from '../../config/assets';

export const IntelligenceEngineView: React.FC<{ onOpenAi: () => void }> = ({ onOpenAi }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-2xl mx-auto space-y-6">
      <div className="w-24 h-24 bg-amber-100 dark:bg-amber-900/30 rounded-3xl flex items-center justify-center border-4 border-amber-50 dark:border-amber-900/10 shadow-xl mb-2 overflow-hidden p-2">
        <img 
          src={VEPARI_ASSETS.engines.intelligence} 
          alt="Intelligence Engine" 
          className="w-full h-full object-cover rounded-2xl bg-white"
        />
      </div>
      
      <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
        Intelligence Engine
      </h2>
      
      <p className="text-lg text-slate-600 dark:text-slate-400">
        Your dedicated AI accountant. Powered by advanced reasoning models to assist with complex financial queries, tax compliance, and automated bookkeeping.
      </p>

      <button 
        onClick={onOpenAi}
        className="mt-8 flex items-center gap-2 px-6 py-3 bg-slate-900 text-white dark:bg-amber-600 dark:hover:bg-amber-500 hover:bg-slate-800 rounded-xl font-bold transition-all shadow-lg shadow-amber-500/20"
      >
        <Sparkles className="w-5 h-5" />
        Summon AI Assistant
      </button>
    </div>
  );
};
