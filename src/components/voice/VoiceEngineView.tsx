import React, { useState, useEffect, useRef } from 'react';
import { useAccounting } from '../../context/AccountingContext';
import { VEPARI_ASSETS } from '../../config/assets';
import { VoiceOS } from '../../ai/voice/VoiceOS';
import { VepariMasterAgent } from '../../ai/orchestrator/VepariMasterAgent';
import { Mic, MicOff, Volume2, VolumeX, Sparkles, RefreshCw, CheckCircle2, ShieldAlert, Radio, AlertTriangle } from 'lucide-react';

export const VoiceEngineView: React.FC = () => {
  const { 
    activeCompany, 
    vouchers, 
    ledgers, 
    inventory, 
    invoices, 
    customers, 
    suppliers, 
    profitLoss, 
    balanceSheet, 
    addVoucher, 
    addAuditLog, 
    setActiveTab, 
    setAccountingSubTab, 
    setPendingVoucherDraft 
  } = useAccounting();

  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [voiceReply, setVoiceReply] = useState('');
  const [supported, setSupported] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    setSupported(VoiceOS.isSupported());
  }, []);

  // Simple Waveform Visualizer on Canvas when listening
  useEffect(() => {
    if (!isListening || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let step = 0;

    const render = () => {
      step += 0.1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#0D9488'; // Teal
      
      const bars = 32;
      const barWidth = canvas.width / bars;

      for (let i = 0; i < bars; i++) {
        const height = Math.sin(step + i * 0.3) * 20 + 25;
        const x = i * barWidth;
        const y = (canvas.height - height) / 2;
        ctx.fillRect(x + 2, y, barWidth - 4, height);
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isListening]);

  const toggleListening = () => {
    if (isListening) {
      VoiceOS.stopListening();
      setIsListening(false);
    } else {
      setIsListening(true);
      setTranscript('');
      setVoiceReply('');

      VoiceOS.startListening(
        (text, isFinal) => {
          setTranscript(text);
          if (isFinal) {
            setIsListening(false);
            processVoiceCommand(text);
          }
        },
        (err) => {
          setIsListening(false);
        }
      );
    }
  };

  const processVoiceCommand = async (cmdText: string) => {
    const res = await VepariMasterAgent.processCommand(cmdText, {
      company: activeCompany,
      vouchers,
      ledgers,
      inventory,
      invoices,
      customers,
      suppliers,
      profitLoss,
      balanceSheet,
      addVoucher,
      addAuditLog,
      setActiveTab,
      setAccountingSubTab,
      setPendingVoucherDraft
    });

    setVoiceReply(res.reply);

    if (res.voiceText) {
      setIsSpeaking(true);
      VoiceOS.speak(res.voiceText, () => setIsSpeaking(false));
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 p-1 flex items-center justify-center overflow-hidden shrink-0">
            <img 
              src={VEPARI_ASSETS.engines.voice} 
              alt="Voice Engine" 
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white">Vepari Voice Operating System</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Hindi & English Spoken Interface
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Command your entire accounting system, query financials or draft vouchers through natural speech
            </p>
          </div>
        </div>

        <span className="text-xs text-rose-300 font-mono bg-rose-950/80 px-3 py-1.5 rounded-xl border border-rose-800 shrink-0 flex items-center gap-1.5">
          <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
          <span>Speech Recognition Active</span>
        </span>
      </div>

      {!supported && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3 text-xs text-amber-200">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
          <span>Speech Recognition API is limited in this browser. You can still type commands in Vepari AI!</span>
        </div>
      )}

      {/* Main Interactive Mic Stage */}
      <div className="bg-slate-900 text-white p-8 rounded-3xl border border-slate-800 shadow-2xl flex flex-col items-center justify-center space-y-6 text-center">
        
        {/* Waveform Canvas */}
        <canvas ref={canvasRef} width={300} height={60} className="w-full max-w-sm h-16 rounded-2xl bg-slate-950/80 border border-slate-800/80" />

        {/* Big Mic Button */}
        <button
          onClick={toggleListening}
          className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl ${
            isListening
              ? 'bg-rose-500 text-white shadow-rose-500/40 scale-110 animate-pulse'
              : 'bg-teal-600 hover:bg-teal-500 text-white shadow-teal-600/30'
          }`}
        >
          {isListening ? <Mic className="w-10 h-10" /> : <MicOff className="w-10 h-10" />}
        </button>

        <div>
          <p className="text-sm font-bold text-slate-200">
            {isListening ? 'Listening to your command...' : 'Tap Mic & Speak your Command'}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Try saying: "Vepari, what was our profit this month?" or "Show low stock SKUs"
          </p>
        </div>

        {/* Real-time Transcription Stream */}
        {transcript && (
          <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700/80 max-w-lg w-full text-xs text-amber-300 font-mono text-left space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-sans font-bold block">Spoken Transcription</span>
            <p className="text-sm text-white font-sans">"{transcript}"</p>
          </div>
        )}

        {/* AI Voice Reply Output */}
        {voiceReply && (
          <div className="p-4 rounded-2xl bg-teal-950/60 border border-teal-800/80 max-w-lg w-full text-xs text-slate-200 text-left space-y-2">
            <div className="flex items-center justify-between text-teal-400 font-bold text-xs">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" /> Vepari Voice Response
              </span>
              {isSpeaking && <Volume2 className="w-4 h-4 text-teal-300 animate-bounce" />}
            </div>
            <p className="leading-relaxed text-slate-100">{voiceReply}</p>
          </div>
        )}
      </div>
    </div>
  );
};
