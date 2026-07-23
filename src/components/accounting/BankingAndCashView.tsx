import React, { useState } from 'react';
import { useAccounting } from '../../context/AccountingContext';
import { 
  Landmark, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus, 
  Search, 
  Calendar, 
  FileText, 
  Building2, 
  CheckCircle2, 
  Download, 
  Filter,
  DollarSign
} from 'lucide-react';

export const BankingAndCashView: React.FC = () => {
  const { vouchers, ledgers, activeCompany, addVoucher } = useAccounting();

  const [activeType, setActiveType] = useState<'all' | 'bank' | 'cash'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewTxModalOpen, setIsNewTxModalOpen] = useState(false);

  // New Transaction Form
  const [txType, setTxType] = useState<'receipt' | 'payment'>('receipt');
  const [accountType, setAccountType] = useState<'bank' | 'cash'>('bank');
  const [amount, setAmount] = useState('');
  const [partyName, setPartyName] = useState('');
  const [narration, setNarration] = useState('');
  const [referenceNo, setReferenceNo] = useState('');

  // Get Cash & Bank Ledgers
  const bankLedgers = ledgers.filter(l => l.groupName === 'Bank Accounts' || l.category === 'Assets' && l.name.toLowerCase().includes('bank'));
  const cashLedgers = ledgers.filter(l => l.groupName === 'Cash-in-hand' || l.name.toLowerCase().includes('cash'));

  const totalBankBalance = bankLedgers.reduce((acc, l) => acc + l.currentBalance, 0);
  const totalCashBalance = cashLedgers.reduce((acc, l) => acc + l.currentBalance, 0);

  // Filter vouchers related to Receipt, Payment, and Contra (Cash/Bank)
  const cashBankVouchers = vouchers.filter(v => {
    const isCashBank = v.voucherType === 'receipt' || v.voucherType === 'payment' || v.voucherType === 'contra';
    if (!isCashBank) return false;

    const drLedger = v.items.find(i => i.drCr === 'Dr')?.ledgerName || '';
    const crLedger = v.items.find(i => i.drCr === 'Cr')?.ledgerName || '';

    if (activeType === 'bank') {
      return drLedger.toLowerCase().includes('bank') || crLedger.toLowerCase().includes('bank');
    }
    if (activeType === 'cash') {
      return drLedger.toLowerCase().includes('cash') || crLedger.toLowerCase().includes('cash');
    }
    return true;
  }).filter(v => {
    const drLedger = v.items.find(i => i.drCr === 'Dr')?.ledgerName || '';
    const crLedger = v.items.find(i => i.drCr === 'Cr')?.ledgerName || '';

    return (
      v.voucherNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.narration.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drLedger.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crLedger.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleCreateCashBankTx = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmt = parseFloat(amount) || 0;
    if (numAmt <= 0) return;

    const targetAccountLedger = accountType === 'bank' 
      ? (bankLedgers[0]?.name || 'HDFC Bank Account') 
      : (cashLedgers[0]?.name || 'Cash in Hand');

    if (txType === 'receipt') {
      addVoucher({
        voucherNo: `RC-CB-${Date.now().toString().slice(-4)}`,
        voucherType: 'receipt',
        date: new Date().toISOString().split('T')[0],
        companyId: activeCompany.id,
        status: 'posted',
        items: [
          { id: '1', ledgerId: bankLedgers[0]?.id || 'led-bank-hdfc', ledgerName: targetAccountLedger, drCr: 'Dr', amount: numAmt },
          { id: '2', ledgerId: 'led-sales', ledgerName: partyName ? `${partyName} Account` : 'Sales Account', drCr: 'Cr', amount: numAmt }
        ],
        totalAmount: numAmt,
        narration: narration || `Cash/Bank Receipt from ${partyName || 'Customer'} (Ref: ${referenceNo || 'N/A'})`
      });
    } else {
      addVoucher({
        voucherNo: `PY-CB-${Date.now().toString().slice(-4)}`,
        voucherType: 'payment',
        date: new Date().toISOString().split('T')[0],
        companyId: activeCompany.id,
        status: 'posted',
        items: [
          { id: '1', ledgerId: 'led-pur', ledgerName: partyName ? `${partyName} Account` : 'Supplier Account', drCr: 'Dr', amount: numAmt },
          { id: '2', ledgerId: bankLedgers[0]?.id || 'led-bank-hdfc', ledgerName: targetAccountLedger, drCr: 'Cr', amount: numAmt }
        ],
        totalAmount: numAmt,
        narration: narration || `Cash/Bank Payment to ${partyName || 'Vendor'} (Ref: ${referenceNo || 'N/A'})`
      });
    }

    setIsNewTxModalOpen(false);
    setAmount('');
    setPartyName('');
    setNarration('');
    setReferenceNo('');
  };

  return (
    <div className="space-y-6 text-xs font-sans">
      
      {/* Top Banner & Quick Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Bank Balance Card */}
        <div className="bg-white p-5 rounded-2xl border border-[#D8E2EE] shadow-soft relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#5B6878] uppercase tracking-wider">Bank Accounts Balance</span>
            <div className="p-2.5 rounded-xl bg-[#163A70] text-white">
              <Landmark className="w-5 h-5 text-[#16B8A6]" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold font-num text-[#163A70]">
              {activeCompany.currencySymbol}{totalBankBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </h3>
            <p className="text-[11px] text-[#5B6878] mt-1 flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2BA84A]" />
              <span>{bankLedgers.length} Reconciled Bank Accounts</span>
            </p>
          </div>
        </div>

        {/* Cash Balance Card */}
        <div className="bg-white p-5 rounded-2xl border border-[#D8E2EE] shadow-soft relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#5B6878] uppercase tracking-wider">Cash In Hand</span>
            <div className="p-2.5 rounded-xl bg-[#16B8A6] text-white">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold font-num text-[#1A2433]">
              {activeCompany.currencySymbol}{totalCashBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </h3>
            <p className="text-[11px] text-[#5B6878] mt-1 flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2BA84A]" />
              <span>Main Cash Vault Active</span>
            </p>
          </div>
        </div>

        {/* Net Cash Flow Summary */}
        <div className="bg-gradient-to-br from-[#163A70] to-[#1E293B] p-5 rounded-2xl text-white shadow-soft relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-teal-200 uppercase tracking-wider">Total Liquidity Position</span>
            <button
              onClick={() => setIsNewTxModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-[#16B8A6] hover:bg-teal-400 text-white font-bold text-xs flex items-center gap-1 shadow-md transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>New Entry</span>
            </button>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold font-num text-white">
              {activeCompany.currencySymbol}{(totalBankBalance + totalCashBalance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </h3>
            <p className="text-[11px] text-slate-300 mt-1 font-medium">
              Live Cash Flow & Bank Ledger Sync
            </p>
          </div>
        </div>
      </div>

      {/* Control Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#D8E2EE] shadow-xs">
        <div className="flex items-center gap-2 bg-[#EEF3F8] p-1 rounded-xl">
          <button
            onClick={() => setActiveType('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${activeType === 'all' ? 'bg-[#163A70] text-white shadow-xs' : 'text-[#5B6878]'}`}
          >
            All Liquidity Logs
          </button>
          <button
            onClick={() => setActiveType('bank')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${activeType === 'bank' ? 'bg-[#163A70] text-white shadow-xs' : 'text-[#5B6878]'}`}
          >
            Bank Transactions
          </button>
          <button
            onClick={() => setActiveType('cash')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${activeType === 'cash' ? 'bg-[#163A70] text-white shadow-xs' : 'text-[#5B6878]'}`}
          >
            Cash Transactions
          </button>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#8894A7]" />
            <input
              type="text"
              placeholder="Search narration, ref or voucher..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-[#F7F9FC] border border-[#D8E2EE] rounded-xl pl-9 pr-3 py-2 text-xs text-[#1A2433] outline-none"
            />
          </div>
        </div>
      </div>

      {/* Cash Flow Vouchers Table */}
      <div className="bg-white rounded-card border border-[#D8E2EE] shadow-soft overflow-hidden">
        <div className="p-4 border-b border-[#D8E2EE] flex items-center justify-between bg-[#F7F9FC]">
          <h3 className="font-bold text-sm text-[#163A70]">Cash Flow & Bank Ledger Register</h3>
          <span className="text-xs text-[#5B6878] font-semibold">{cashBankVouchers.length} Entries Recorded</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#EEF3F8] text-[#5B6878] font-bold text-[11px] border-b border-[#D8E2EE]">
                <th className="p-3">Date</th>
                <th className="p-3">Voucher No</th>
                <th className="p-3">Type</th>
                <th className="p-3">Account / Ledger</th>
                <th className="p-3">Narration</th>
                <th className="p-3 text-right">Inflow (Dr)</th>
                <th className="p-3 text-right">Outflow (Cr)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D8E2EE]">
              {cashBankVouchers.map((v) => {
                const isReceipt = v.voucherType === 'receipt';
                const drLedger = v.items.find(i => i.drCr === 'Dr')?.ledgerName || 'Debited Account';
                const crLedger = v.items.find(i => i.drCr === 'Cr')?.ledgerName || 'Credited Account';

                return (
                  <tr key={v.id} className="hover:bg-[#EEF3F8]/50 transition-colors">
                    <td className="p-3 font-num text-[#1A2433] whitespace-nowrap">{v.date}</td>
                    <td className="p-3 font-mono font-bold text-[#163A70]">{v.voucherNo}</td>
                    <td className="p-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                        isReceipt ? 'bg-[#2BA84A]/10 text-[#2BA84A]' : 'bg-[#E53935]/10 text-[#E53935]'
                      }`}>
                        {isReceipt ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                        {v.voucherType}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-[#1A2433]">
                      {isReceipt ? drLedger : crLedger}
                    </td>
                    <td className="p-3 text-[#5B6878] max-w-xs truncate">{v.narration}</td>
                    <td className="p-3 text-right font-num font-bold text-[#2BA84A]">
                      {isReceipt ? `${activeCompany.currencySymbol}${v.totalAmount.toLocaleString('en-IN')}` : '-'}
                    </td>
                    <td className="p-3 text-right font-num font-bold text-[#E53935]">
                      {!isReceipt ? `${activeCompany.currencySymbol}${v.totalAmount.toLocaleString('en-IN')}` : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Cash/Bank Transaction Modal */}
      {isNewTxModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4">
          <div className="bg-white rounded-card border border-[#D8E2EE] shadow-2xl max-w-lg w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[#D8E2EE] pb-3">
              <h3 className="font-bold text-base text-[#163A70]">Record Bank / Cash Entry</h3>
              <button onClick={() => setIsNewTxModalOpen(false)} className="text-[#8894A7] hover:text-[#1A2433] font-bold text-sm">✕</button>
            </div>

            <form onSubmit={handleCreateCashBankTx} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#1A2433] mb-1">Transaction Flow</label>
                  <select value={txType} onChange={e => setTxType(e.target.value as any)} className="w-full bg-[#EEF3F8] border border-[#D8E2EE] rounded-xl px-3 py-2 font-bold text-[#1A2433]">
                    <option value="receipt">Money In (Receipt)</option>
                    <option value="payment">Money Out (Payment)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#1A2433] mb-1">Account Mode</label>
                  <select value={accountType} onChange={e => setAccountType(e.target.value as any)} className="w-full bg-[#EEF3F8] border border-[#D8E2EE] rounded-xl px-3 py-2 font-bold text-[#1A2433]">
                    <option value="bank">Bank Account</option>
                    <option value="cash">Cash in Hand</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#1A2433] mb-1">Party / Customer / Supplier Name</label>
                <input
                  type="text"
                  placeholder="e.g. Acme Tech Solutions"
                  value={partyName}
                  onChange={e => setPartyName(e.target.value)}
                  className="w-full bg-[#EEF3F8] border border-[#D8E2EE] rounded-xl px-3 py-2 text-[#1A2433]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#1A2433] mb-1">Amount ({activeCompany.currencySymbol})</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="w-full bg-[#EEF3F8] border border-[#D8E2EE] rounded-xl px-3 py-2 font-bold font-num text-[#1A2433]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#1A2433] mb-1">Reference / Cheque No.</label>
                  <input
                    type="text"
                    placeholder="e.g. UTR-98213"
                    value={referenceNo}
                    onChange={e => setReferenceNo(e.target.value)}
                    className="w-full bg-[#EEF3F8] border border-[#D8E2EE] rounded-xl px-3 py-2 text-[#1A2433]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#1A2433] mb-1">Narration / Remarks</label>
                <input
                  type="text"
                  placeholder="e.g. Bank transfer for Inv-102"
                  value={narration}
                  onChange={e => setNarration(e.target.value)}
                  className="w-full bg-[#EEF3F8] border border-[#D8E2EE] rounded-xl px-3 py-2 text-[#1A2433]"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button type="button" onClick={() => setIsNewTxModalOpen(false)} className="px-4 py-2 rounded-xl border border-[#D8E2EE] text-[#5B6878] font-bold">Cancel</button>
                <button type="submit" className="px-6 py-2 rounded-xl bg-[#163A70] hover:bg-[#2F6FED] text-white font-bold shadow-md">Record Transaction</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
