import React, { useState } from 'react';
import { useAccounting } from '../context/AccountingContext';
import { Bot, Send, X, Sparkles, CheckCircle2, ArrowRight, BookOpen, Lightbulb } from 'lucide-react';

interface Message {
  sender: 'user' | 'ai';
  text: string;
  suggestedVoucher?: any;
}

export const AiAssistant: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { brand, company, setPendingVoucherDraft, setActiveTab } = useAccounting();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: `Hello! I am **${brand.aiName}**, your accounting, finance, and economics assistant. Ask me about business structures, financial strategies, or how to record transactions!`
    }
  ]);

  if (!isOpen) return null;

  const quickPrompts = [
    'Record Office Rent payment of 35,000 via HDFC bank',
    'How do I record a GST purchase invoice with 18% tax credit?',
    'Draft a Sales Invoice for 118,000 to Apex Traders with CGST & SGST',
    'Explain Dr and Cr rules for Assets vs Liabilities'
  ];

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = { sender: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    if (!customPrompt) setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/accounting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          brandName: brand.name,
          currencySymbol: company.currencySymbol,
          companyContext: { name: company.name, gstin: company.gstin }
        })
      });

      const data = await res.json();
      const aiMsg: Message = {
        sender: 'ai',
        text: data.reply || 'No response returned.',
        suggestedVoucher: data.suggestedVoucher
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: '❌ Could not reach AI service. Please check your network connection or API setup.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyVoucher = (vchPayload: any) => {
    setPendingVoucherDraft(vchPayload);
    setActiveTab('new-voucher');
    onClose();
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[460px] bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col transition-all duration-300">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-teal-500/20 text-teal-400 border border-teal-500/30">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-sm flex items-center gap-1.5">
              {brand.aiName}
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </h3>
            <p className="text-[11px] text-slate-400">Powered by Gemini 3.6 Flash</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[90%] p-3.5 rounded-2xl ${
                msg.sender === 'user'
                  ? 'bg-teal-600 text-white rounded-br-none'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/60 rounded-bl-none'
              }`}
            >
              <div className="whitespace-pre-wrap leading-relaxed space-y-2">
                {msg.text}
              </div>

              {/* Suggested Voucher Action Card */}
              {msg.suggestedVoucher && (
                <div className="mt-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-teal-200 dark:border-teal-800/80 text-slate-900 dark:text-white shadow-xs">
                  <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="font-bold text-xs text-teal-600 dark:text-teal-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Suggested Entry ({msg.suggestedVoucher.voucherType.toUpperCase()})
                    </span>
                  </div>

                  <div className="space-y-1 mb-3 text-[11px]">
                    <p className="text-slate-500 italic mb-1.5">"{msg.suggestedVoucher.narration}"</p>
                    {msg.suggestedVoucher.items?.map((item: any, i: number) => (
                      <div key={i} className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-1.5 rounded font-mono">
                        <span>{item.drCr} {item.ledgerName}</span>
                        <span className="font-semibold">{company.currencySymbol}{item.amount?.toLocaleString()}</span>
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
            <span className="italic text-xs">Analyzing accounting rules & generating advice...</span>
          </div>
        )}
      </div>

      {/* Quick Suggestions */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
        <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500 mb-2">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Quick Prompts:
        </div>
        <div className="flex flex-wrap gap-1.5">
          {quickPrompts.map((qp, i) => (
            <button
              key={i}
              onClick={() => handleSend(qp)}
              className="px-2.5 py-1 rounded-full text-[10px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-teal-500 text-slate-700 dark:text-slate-300 transition-colors truncate max-w-[200px]"
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
          placeholder="Ask AI Accountant or draft an entry..."
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
