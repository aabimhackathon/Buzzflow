import React, { useState, useEffect } from 'react';
import { useAccounting } from '../../context/AccountingContext';
import { VOUCHER_TYPES } from '../../lib/accounting/default-coa';
import { generateVoucherNumber, validateVoucher } from '../../lib/accounting/double-entry';
import { VoucherItem, VoucherType } from '../../lib/accounting/types';
import { PlusCircle, Trash2, CheckCircle2, AlertTriangle, Wand2, ArrowLeft, Send, Sparkles, AlertCircle } from 'lucide-react';

export const NewVoucherForm: React.FC = () => {
  const { 
    ledgers, 
    vouchers, 
    addVoucher, 
    company, 
    pendingVoucherDraft, 
    setPendingVoucherDraft,
    setActiveTab 
  } = useAccounting();

  const [voucherType, setVoucherType] = useState<VoucherType>('journal');
  const [voucherNo, setVoucherNo] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [narration, setNarration] = useState('');
  const [items, setItems] = useState<VoucherItem[]>([
    { id: 'item-1', ledgerId: ledgers[0]?.id || '', drCr: 'Dr', amount: 0, narration: '' },
    { id: 'item-2', ledgerId: ledgers[1]?.id || '', drCr: 'Cr', amount: 0, narration: '' }
  ]);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Consume pending drafts from AI assistant or external links
  useEffect(() => {
    if (pendingVoucherDraft) {
      if (pendingVoucherDraft.voucherType) {
        setVoucherType(pendingVoucherDraft.voucherType as VoucherType);
      }
      if (pendingVoucherDraft.narration) {
        setNarration(pendingVoucherDraft.narration);
      }
      if (pendingVoucherDraft.items && pendingVoucherDraft.items.length > 0) {
        const mappedItems: VoucherItem[] = pendingVoucherDraft.items.map((it: any, i: number) => {
          const found = ledgers.find(l => 
            l.name.toLowerCase().includes(it.ledgerName?.toLowerCase() || '') ||
            l.id === it.ledgerId
          );
          return {
            id: `item-${Date.now()}-${i}`,
            ledgerId: found ? found.id : (ledgers[i % ledgers.length]?.id || ''),
            ledgerName: found ? found.name : it.ledgerName,
            drCr: (it.drCr === 'Dr' || it.drCr === 'Cr') ? it.drCr : 'Dr',
            amount: Number(it.amount) || 0,
            narration: it.narration || ''
          };
        });
        setItems(mappedItems);
      }
      setPendingVoucherDraft(null);
    }
  }, [pendingVoucherDraft]);

  // Generate Voucher Number on type change
  useEffect(() => {
    setVoucherNo(generateVoucherNumber(voucherType, vouchers));
  }, [voucherType, vouchers]);

  const validation = validateVoucher(items, ledgers);

  const handleItemChange = (index: number, field: keyof VoucherItem, value: any) => {
    setItems(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleAddItem = (defaultDrCr: 'Dr' | 'Cr' = 'Dr') => {
    setItems(prev => [
      ...prev,
      {
        id: `item-${Date.now()}`,
        ledgerId: ledgers[0]?.id || '',
        drCr: defaultDrCr,
        amount: 0,
        narration: ''
      }
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 2) {
      alert('A double-entry voucher must have at least 2 line items.');
      return;
    }
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleAutoBalance = () => {
    const drSum = items.filter(i => i.drCr === 'Dr').reduce((sum, i) => sum + (i.amount || 0), 0);
    const crSum = items.filter(i => i.drCr === 'Cr').reduce((sum, i) => sum + (i.amount || 0), 0);

    if (drSum === crSum) return;

    const diff = Math.abs(drSum - crSum);
    const neededSide = drSum > crSum ? 'Cr' : 'Dr';

    setItems(prev => [
      ...prev,
      {
        id: `item-bal-${Date.now()}`,
        ledgerId: ledgers.find(l => l.groupId === 'grp-bank' || l.groupId === 'grp-cash')?.id || ledgers[0]?.id || '',
        drCr: neededSide,
        amount: Number(diff.toFixed(2)),
        narration: 'Auto-balanced entry'
      }
    ]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validation.isValid) return;

    const enrichedItems = items.map(it => {
      const l = ledgers.find(led => led.id === it.ledgerId);
      return {
        ...it,
        ledgerName: l ? l.name : 'Unknown Account'
      };
    });

    const res = addVoucher({
      voucherNo,
      voucherType,
      date,
      companyId: company.id,
      items: enrichedItems,
      totalAmount: validation.debitTotal,
      narration: narration || `Being ${VOUCHER_TYPES[voucherType]?.label} entry posted`,
      status: 'posted'
    });

    if (res.success) {
      setSuccessMsg(`Voucher ${voucherNo} posted successfully! Ledgers updated.`);
      setTimeout(() => {
        setSuccessMsg(null);
        setActiveTab('daybook'); // Safely maps to accounting tab with daybook subtab!
      }, 1200);
    }
  };

  const activeVoucherInfo = VOUCHER_TYPES[voucherType] || VOUCHER_TYPES.journal;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 text-white p-5 rounded-2xl shadow-md border border-slate-800">
        <div>
          <button
            type="button"
            onClick={() => setActiveTab('daybook')}
            className="flex items-center gap-1.5 text-xs text-teal-400 hover:text-teal-300 font-bold mb-1 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Day Book
          </button>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-400" />
            Structured Double-Entry Voucher Engine (ICAI Grid)
          </h2>
          <p className="text-xs text-slate-400">Company: <span className="text-white font-semibold">{company.name}</span> | Period: {company.fyStart} to {company.fyEnd}</p>
        </div>

        <div className="flex items-center gap-4 bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700 font-mono">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-sans font-bold block">Voucher No</span>
            <input
              type="text"
              value={voucherNo}
              onChange={e => setVoucherNo(e.target.value)}
              className="bg-transparent font-bold text-sm text-teal-300 outline-none w-28"
            />
          </div>
          <div className="border-l border-slate-700 pl-4">
            <span className="text-[10px] text-slate-400 uppercase font-sans font-bold block">Date</span>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="bg-transparent font-bold text-xs text-white outline-none"
            />
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-2 shadow-lg animate-fade-in">
          <CheckCircle2 className="w-5 h-5" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Tally Key Shortcuts / Voucher Type Switcher */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Voucher Entry Type
          </span>
          <span className="text-[11px] text-slate-400 italic">
            Shortcuts: F4 (Contra), F5 (Payment), F6 (Receipt), F7 (Journal), F8 (Sales), F9 (Purchase)
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
          {Object.values(VOUCHER_TYPES).map(vt => {
            const isSelected = vt.type === voucherType;
            return (
              <button
                key={vt.type}
                type="button"
                onClick={() => setVoucherType(vt.type as VoucherType)}
                className={`p-3 rounded-xl text-left border transition-all ${
                  isSelected
                    ? 'bg-teal-600 text-white border-teal-500 shadow-md ring-2 ring-teal-400/30'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="font-bold text-xs font-mono">{vt.shortCode}</div>
                <div className="text-[11px] font-semibold truncate mt-0.5">{vt.label.split(' ')[0]}</div>
              </button>
            );
          })}
        </div>
        <p className="text-xs text-slate-500 italic border-t border-slate-100 dark:border-slate-800 pt-2">
          {activeVoucherInfo.description}
        </p>
      </div>

      {/* Main Journal Grid */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        
        {/* Narration Input Bar */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            General Narration / Entry Note
          </label>
          <input
            type="text"
            value={narration}
            onChange={e => setNarration(e.target.value)}
            placeholder={`Being ${activeVoucherInfo.label} recorded on ${date}...`}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500 font-medium"
          />
        </div>

        {/* Particulars Grid Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <span>Double-Entry Particulars Table</span>
              {validation.conflictingItemIds.size > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-800 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {validation.conflictingItemIds.size} Conflict(s) Detected
                </span>
              )}
            </h3>

            <button
              type="button"
              onClick={handleAutoBalance}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-xs font-bold hover:bg-teal-100 transition-colors"
            >
              <Wand2 className="w-3.5 h-3.5 text-teal-600" />
              <span>Auto-Balance Entry (Alt+A)</span>
            </button>
          </div>

          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-900 text-white font-bold text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-3 w-20">By/To</th>
                  <th className="py-3 px-3">Particulars (Account / Ledger)</th>
                  <th className="py-3 px-3 w-36 text-right">Debit ({company.currencySymbol})</th>
                  <th className="py-3 px-3 w-36 text-right">Credit ({company.currencySymbol})</th>
                  <th className="py-3 px-3">Memo</th>
                  <th className="py-3 px-3 w-10 text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                {items.map((item, idx) => {
                  const selectedLedger = ledgers.find(l => l.id === item.ledgerId);
                  const isConflicting = validation.conflictingItemIds.has(item.id);
                  const conflicts = validation.itemConflicts[item.id] || [];

                  return (
                    <tr 
                      key={item.id} 
                      className={`transition-colors ${
                        isConflicting 
                          ? 'bg-rose-50/90 dark:bg-rose-950/40' 
                          : 'hover:bg-slate-50/60 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      {/* Dr / Cr */}
                      <td className="py-2.5 px-3 align-top">
                        <select
                          value={item.drCr}
                          onChange={e => handleItemChange(idx, 'drCr', e.target.value)}
                          className={`w-full font-bold px-2 py-1.5 rounded-lg text-xs outline-none cursor-pointer ${
                            item.drCr === 'Dr'
                              ? 'bg-teal-100 text-teal-900 dark:bg-teal-950 dark:text-teal-300'
                              : 'bg-indigo-100 text-indigo-900 dark:bg-indigo-950 dark:text-indigo-300'
                          }`}
                        >
                          <option value="Dr">By (Dr)</option>
                          <option value="Cr">To (Cr)</option>
                        </select>
                      </td>

                      {/* Particulars Ledger Dropdown */}
                      <td className="py-2.5 px-3 align-top">
                        <select
                          value={item.ledgerId}
                          onChange={e => handleItemChange(idx, 'ledgerId', e.target.value)}
                          className={`w-full border rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-white font-sans font-medium outline-none transition-all ${
                            isConflicting 
                              ? 'bg-rose-100/60 dark:bg-rose-900/40 border-rose-400 dark:border-rose-700 focus:ring-2 focus:ring-rose-500' 
                              : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-teal-500'
                          }`}
                        >
                          <option value="">-- Select Account Ledger --</option>
                          {ledgers.map(l => (
                            <option key={l.id} value={l.id}>
                              {l.code} - {l.name} [{l.groupName}] (Bal: {company.currencySymbol}{l.currentBalance.toLocaleString()})
                            </option>
                          ))}
                        </select>

                        {selectedLedger && (
                          <span className="text-[10px] text-slate-400 font-sans block mt-0.5">
                            Category: {selectedLedger.category} | Nature: {selectedLedger.nature}
                          </span>
                        )}

                        {/* Real-time Conflict Warnings on Row */}
                        {isConflicting && conflicts.length > 0 && (
                          <div className="mt-1 space-y-0.5">
                            {conflicts.map((conf, cIdx) => (
                              <span key={cIdx} className="text-[10px] font-bold font-sans text-rose-600 dark:text-rose-300 flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3 text-rose-500 shrink-0" />
                                {conf}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>

                      {/* Debit Column */}
                      <td className="py-2.5 px-3 align-top">
                        {item.drCr === 'Dr' ? (
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={item.amount || ''}
                            onChange={e => handleItemChange(idx, 'amount', parseFloat(e.target.value) || 0)}
                            placeholder="0.00"
                            className={`w-full text-right font-mono font-bold rounded-lg px-3 py-1.5 text-xs outline-none transition-all ${
                              item.amount <= 0 || isConflicting
                                ? 'bg-rose-100/60 dark:bg-rose-900/40 border border-rose-400 dark:border-rose-700 text-rose-900 dark:text-rose-100 focus:ring-2 focus:ring-rose-500'
                                : 'bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500'
                            }`}
                            required
                          />
                        ) : (
                          <div className="text-right text-slate-300 dark:text-slate-700 px-3 py-1.5 font-bold">-</div>
                        )}
                      </td>

                      {/* Credit Column */}
                      <td className="py-2.5 px-3 align-top">
                        {item.drCr === 'Cr' ? (
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={item.amount || ''}
                            onChange={e => handleItemChange(idx, 'amount', parseFloat(e.target.value) || 0)}
                            placeholder="0.00"
                            className={`w-full text-right font-mono font-bold rounded-lg px-3 py-1.5 text-xs outline-none transition-all ${
                              item.amount <= 0 || isConflicting
                                ? 'bg-rose-100/60 dark:bg-rose-900/40 border border-rose-400 dark:border-rose-700 text-rose-900 dark:text-rose-100 focus:ring-2 focus:ring-rose-500'
                                : 'bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500'
                            }`}
                            required
                          />
                        ) : (
                          <div className="text-right text-slate-300 dark:text-slate-700 px-3 py-1.5 font-bold">-</div>
                        )}
                      </td>

                      {/* Memo Line */}
                      <td className="py-2.5 px-3 font-sans align-top">
                        <input
                          type="text"
                          value={item.narration || ''}
                          onChange={e => handleItemChange(idx, 'narration', e.target.value)}
                          placeholder="Line note..."
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      </td>

                      {/* Delete */}
                      <td className="py-2.5 px-3 text-center align-top">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleAddItem('Dr')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 hover:bg-teal-100 transition-colors"
            >
              <PlusCircle className="w-4 h-4" /> Add Debit Line (By)
            </button>
            <button
              type="button"
              onClick={() => handleAddItem('Cr')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition-colors"
            >
              <PlusCircle className="w-4 h-4" /> Add Credit Line (To)
            </button>
          </div>
        </div>

        {/* Live Double-Entry Dr = Cr Status Bar */}
        <div className={`p-4 rounded-2xl border transition-all ${
          validation.isValid
            ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
            : 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
        }`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 font-bold text-xs">
              {validation.isValid ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span>Balanced Journal Entry: Total Debit Equals Total Credit</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                  <span>Double-Entry Validation Issues Detected</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-6 font-mono text-xs font-bold">
              <span>TOTAL DEBIT: {company.currencySymbol}{validation.debitTotal.toLocaleString()}</span>
              <span>TOTAL CREDIT: {company.currencySymbol}{validation.creditTotal.toLocaleString()}</span>
            </div>
          </div>

          {validation.errors.length > 0 && (
            <div className="mt-3 pt-2 border-t border-rose-200 dark:border-rose-800/80">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800 dark:text-rose-200 block mb-1">
                Real-Time Validation Warnings (Fix before saving):
              </span>
              <ul className="space-y-1 text-[11px] text-rose-700 dark:text-rose-300 list-disc list-inside font-medium">
                {validation.errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Post Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab('daybook')}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!validation.isValid}
            className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Accept & Post Voucher (Ctrl+A)</span>
          </button>
        </div>
      </form>
    </div>
  );
};
