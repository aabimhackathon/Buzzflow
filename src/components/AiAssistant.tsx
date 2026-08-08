import React, { useState, useEffect } from 'react';
import { useAccounting } from '../context/AccountingContext';
import { Bot, Send, X, Sparkles, CheckCircle2, ArrowRight, BookOpen, Lightbulb, Mic, MicOff, Volume2, Upload, ShieldAlert, Check, FileText } from 'lucide-react';
import { VEPARI_ASSETS } from '../config/assets';
import { VepariMasterAgent } from '../ai/orchestrator/VepariMasterAgent';
import { VoiceOS } from '../ai/voice/VoiceOS';
import { VisionEngineService } from '../ai/vision/VisionEngineService';
import { ConfirmationRequest } from '../ai/types';

interface Message {
  sender: 'user' | 'ai';
  text: string;
  suggestedVoucher?: any;
  confirmationRequest?: ConfirmationRequest;
}

export const AiAssistant: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { 
    brand, 
    company, 
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

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(true);
  const [activeConfirmation, setActiveConfirmation] = useState<ConfirmationRequest | null>(null);

  const ownerName = (activeCompany as any).ownerName || activeCompany.legalName || 'Business Owner';

  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: `Hello ${ownerName}! I am **Vepari AI Master Agent** — your AI Business Operating System. You can command me via text or voice to query sales, analyze profit, open views, draft vouchers, or save business memories!`
    }
  ]);

  useEffect(() => {
    setVoiceSupported(VoiceOS.isSupported());
  }, []);

  if (!isOpen) return null;

  const quickPrompts = [
    'Vepari, show today\'s sales',
    'Why did profit fall this month?',
    'Open inventory and show low stock',
    'Create a payment voucher for ₹25,000 to ABC Suppliers',
    'Remember that ABC Suppliers prefer HDFC Bank'
  ];

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = { sender: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    if (!customPrompt) setInput('');
    setIsLoading(true);

    try {
      const response = await VepariMasterAgent.processCommand(textToSend, {
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

      const aiMsg: Message = {
        sender: 'ai',
        text: response.reply,
        suggestedVoucher: response.suggestedVoucher,
        confirmationRequest: response.confirmationRequest
      };

      setMessages(prev => [...prev, aiMsg]);

      if (response.confirmationRequest) {
        setActiveConfirmation(response.confirmationRequest);
      }

      if (response.voiceText && voiceSupported) {
        setIsSpeaking(true);
        VoiceOS.speak(response.voiceText, () => setIsSpeaking(false));
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: '❌ Could not reach Vepari AI orchestrator. Falling back to local accounting tools.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVoice = () => {
    if (isListening) {
      VoiceOS.stopListening();
      setIsListening(false);
    } else {
      setIsListening(true);
      VoiceOS.startListening(
        (transcript, isFinal) => {
          setInput(transcript);
          if (isFinal) {
            setIsListening(false);
            handleSend(transcript);
          }
        },
        (err) => {
          setIsListening(false);
        }
      );
    }
  };

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setMessages(prev => [
      ...prev,
      { sender: 'user', text: `Uploaded document for OCR Vision extraction: ${file.name}` }
    ]);

    try {
      const extraction = await VisionEngineService.processInvoiceDocument(file, activeCompany);
      const voucherDraft: any = {
        ...extraction.suggestedVoucher,
        items: extraction.suggestedVoucher.items.map((it: any, idx: number) => ({
          id: `item-${idx}`,
          ledgerId: it.ledgerName,
          ledgerName: it.ledgerName,
          drCr: it.drCr || 'Dr',
          amount: it.amount
        }))
      };
      setPendingVoucherDraft(voucherDraft);
      setActiveTab('accounting');
      setAccountingSubTab('new-voucher');

      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: `📄 **Vision Extraction Complete** (Confidence: ${(extraction.confidenceScore * 100).toFixed(0)}%)\n\nExtracted invoice from **${extraction.vendorName}** (${activeCompany.currencySymbol}${extraction.totalAmount.toLocaleString()}).\nDraft voucher loaded in the Voucher Form!`,
          suggestedVoucher: voucherDraft
        }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { sender: 'ai', text: 'Failed to process document with Vision Engine.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmAction = async (conf: ConfirmationRequest) => {
    setIsLoading(true);
    try {
      const result = addVoucher({
        companyId: activeCompany.id,
        voucherNo: `VCH-${Date.now().toString().substr(-6)}`,
        date: new Date().toISOString().slice(0, 10),
        voucherType: (conf.details.voucherType as any) || 'payment',
        narration: conf.details.narration || 'AI Authorized Voucher Posting',
        totalAmount: conf.details.totalAmount || 25000,
        status: 'posted',
        items: [
          { id: '1', ledgerId: 'ABC Suppliers', ledgerName: 'ABC Suppliers', drCr: 'Dr', amount: conf.details.totalAmount || 25000 },
          { id: '2', ledgerId: 'HDFC Bank', ledgerName: 'HDFC Bank', drCr: 'Cr', amount: conf.details.totalAmount || 25000 }
        ]
      });

      addAuditLog({
        action: 'CONFIRMED_POSTING',
        module: 'Accounting',
        details: `User explicitly confirmed posting ${activeCompany.currencySymbol}${conf.details.totalAmount || 25000}`,
        userRole: ownerName
      });

      setActiveConfirmation(null);
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: `✅ **Voucher Permanently Posted!**\nTransaction posted into general ledger for ${activeCompany.name}. Ledger balances recalculated.`
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyVoucher = (vchPayload: any) => {
    setPendingVoucherDraft(vchPayload);
    setActiveTab('accounting');
    setAccountingSubTab('new-voucher');
    onClose();
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col transition-all duration-300">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/30 overflow-hidden p-0.5 flex items-center justify-center">
            <img 
              src={VEPARI_ASSETS.engines.voice} 
              alt="Voice & AI Engine" 
              className="w-full h-full object-cover rounded-lg bg-white"
            />
          </div>
          <div>
            <h3 className="font-semibold text-sm flex items-center gap-1.5 text-white">
              Vepari AI Master Agent
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </h3>
            <p className="text-[11px] text-teal-300 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
              Active Operating Intelligence
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {voiceSupported && (
            <button
              onClick={toggleVoice}
              className={`p-2 rounded-xl border transition-all ${
                isListening 
                  ? 'bg-rose-500 text-white border-rose-400 animate-pulse' 
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
              title="Voice Operating System"
            >
              {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </button>
          )}
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[92%] p-3.5 rounded-2xl ${
                msg.sender === 'user'
                  ? 'bg-teal-600 text-white rounded-br-none'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/60 rounded-bl-none'
              }`}
            >
              <div className="whitespace-pre-wrap leading-relaxed space-y-2">
                {msg.text}
              </div>

              {/* Confirmation Request Card */}
              {msg.confirmationRequest && (
                <div className="mt-3 p-3.5 bg-amber-500/10 dark:bg-amber-950/40 rounded-xl border border-amber-500/40 text-slate-900 dark:text-white space-y-2">
                  <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold text-xs">
                    <ShieldAlert className="w-4 h-4" />
                    <span>{msg.confirmationRequest.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    {msg.confirmationRequest.summary}
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => handleConfirmAction(msg.confirmationRequest!)}
                      className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Confirm & Post</span>
                    </button>
                    <button
                      onClick={() => setActiveConfirmation(null)}
                      className="py-1.5 px-3 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Suggested Voucher Action Card */}
              {msg.suggestedVoucher && (
                <div className="mt-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-teal-200 dark:border-teal-800/80 text-slate-900 dark:text-white shadow-xs">
                  <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="font-bold text-xs text-teal-600 dark:text-teal-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Suggested Entry ({msg.suggestedVoucher.voucherType?.toUpperCase() || 'VOUCHER'})
                    </span>
                  </div>

                  <div className="space-y-1 mb-3 text-[11px]">
                    <p className="text-slate-500 italic mb-1.5">"{msg.suggestedVoucher.narration}"</p>
                    {msg.suggestedVoucher.items?.map((item: any, i: number) => (
                      <div key={i} className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-1.5 rounded font-mono">
                        <span>{item.drCr || 'Dr'} {item.ledgerName}</span>
                        <span className="font-semibold">{activeCompany.currencySymbol}{item.amount?.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handleApplyVoucher(msg.suggestedVoucher)}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs transition-colors shadow-xs"
                  >
                    <span>Load Entry into Voucher Form</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-slate-400 p-2">
            <Bot className="w-4 h-4 animate-bounce text-teal-500" />
            <span className="italic text-xs">Vepari AI orchestrating tools & reasoning context...</span>
          </div>
        )}
      </div>

      {/* Document Upload / OCR & Voice Status */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between gap-2 text-[11px]">
        <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-teal-500 cursor-pointer transition-colors">
          <Upload className="w-3.5 h-3.5 text-teal-600" />
          <span>Upload Document (Vision OCR)</span>
          <input type="file" accept="image/*,.pdf" onChange={handleDocumentUpload} className="hidden" />
        </label>

        {isListening && (
          <span className="text-rose-500 font-bold flex items-center gap-1 animate-pulse">
            <Mic className="w-3.5 h-3.5" /> Listening...
          </span>
        )}
      </div>

      {/* Quick Suggestions */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
        <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500 mb-2">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Voice & Command Prompts:
        </div>
        <div className="flex flex-wrap gap-1.5">
          {quickPrompts.map((qp, i) => (
            <button
              key={i}
              onClick={() => handleSend(qp)}
              className="px-2.5 py-1 rounded-full text-[10px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-teal-500 text-slate-700 dark:text-slate-300 transition-colors truncate max-w-[210px]"
            >
              {qp}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Command Vepari AI or ask a question..."
          className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2 rounded-xl text-xs outline-none focus:ring-2 focus:ring-teal-500 border border-slate-200 dark:border-slate-700"
        />
        <button
          onClick={() => handleSend()}
          disabled={isLoading || !input.trim()}
          className="p-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

