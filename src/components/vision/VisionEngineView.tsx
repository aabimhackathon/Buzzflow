import React, { useState } from 'react';
import { useAccounting } from '../../context/AccountingContext';
import { VEPARI_ASSETS } from '../../config/assets';
import { VisionEngineService, VisionInvoiceExtraction } from '../../ai/vision/VisionEngineService';
import { Upload, FileText, CheckCircle2, Sparkles, Eye, ArrowRight, ShieldCheck, RefreshCw, AlertCircle, Image as ImageIcon } from 'lucide-react';

export const VisionEngineView: React.FC = () => {
  const { activeCompany, setPendingVoucherDraft, setActiveTab, setAccountingSubTab } = useAccounting();
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extraction, setExtraction] = useState<VisionInvoiceExtraction | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setIsProcessing(true);

    try {
      const result = await VisionEngineService.processInvoiceDocument(uploadedFile, activeCompany);
      setExtraction(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplyVoucher = () => {
    if (!extraction) return;
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
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 p-1 flex items-center justify-center overflow-hidden shrink-0">
            <img 
              src={VEPARI_ASSETS.engines.vision} 
              alt="Vision Engine" 
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white">Vepari Vision OCR Engine</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                Document Intelligence & OCR
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Instantly extract vendor invoices, receipts & bills with 98%+ AI confidence directly into accounting vouchers
            </p>
          </div>
        </div>

        <span className="text-xs text-teal-300 font-mono bg-teal-950/80 px-3 py-1.5 rounded-xl border border-teal-800 shrink-0">
          Powered by Gemini 2.5 Flash Vision
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Upload Dropzone & Live Document Preview */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Upload className="w-4 h-4 text-teal-600" />
              <span>Upload Document (Invoice / Receipt / Bill)</span>
            </h2>

            <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-500 rounded-2xl bg-slate-50 dark:bg-slate-800/50 cursor-pointer transition-colors group text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ImageIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  {file ? file.name : 'Click or Drag & Drop Invoice image or PDF'}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">Supports PNG, JPG, WEBP, PDF up to 10MB</p>
              </div>
              <input type="file" accept="image/*,.pdf" onChange={handleFileUpload} className="hidden" />
            </label>

            {isProcessing && (
              <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center gap-3 text-xs text-teal-300 animate-pulse">
                <RefreshCw className="w-4 h-4 animate-spin text-teal-400" />
                <span>Analyzing document layout, extracting tax items & vendor details...</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Extracted Extraction Preview & Draft Creation */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Eye className="w-4 h-4 text-teal-600" />
                <span>AI Vision OCR Extraction Results</span>
              </h2>
              {extraction && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  {(extraction.confidenceScore * 100).toFixed(0)}% Confidence
                </span>
              )}
            </div>

            {!extraction ? (
              <div className="p-8 text-center text-xs text-slate-400 italic">
                Upload a document on the left to see live structured JSON extraction & voucher conversion.
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-medium block">Vendor Name</span>
                    <strong className="text-slate-900 dark:text-white font-semibold">{extraction.vendorName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-medium block">Invoice Number</span>
                    <strong className="text-slate-900 dark:text-white font-mono">{extraction.invoiceNumber}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-medium block">Invoice Date</span>
                    <strong className="text-slate-900 dark:text-white font-mono">{extraction.date}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-medium block">Total Amount</span>
                    <strong className="text-teal-600 dark:text-teal-400 font-bold text-sm">
                      {activeCompany.currencySymbol}{extraction.totalAmount.toLocaleString()}
                    </strong>
                  </div>
                </div>

                {/* Line Items Table */}
                <div className="space-y-1.5">
                  <span className="font-bold text-slate-700 dark:text-slate-300 text-[11px] block">Extracted Line Items</span>
                  <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
                    {extraction.items.map((item, idx) => (
                      <div key={idx} className="p-2.5 flex items-center justify-between text-slate-800 dark:text-slate-200">
                        <span>{item.description} (x{item.quantity})</span>
                        <span className="font-mono font-semibold">{activeCompany.currencySymbol}{item.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={handleApplyVoucher}
                  className="w-full py-3 px-4 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-md shadow-teal-600/20"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Load into New Voucher Form & Review</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
