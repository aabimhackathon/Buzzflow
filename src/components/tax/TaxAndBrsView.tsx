import React, { useState } from 'react';
import { useAccounting } from '../../context/AccountingContext';
import { ShieldCheck, Landmark, Receipt, FileSpreadsheet, Plus, CheckCircle, ArrowUpRight, ArrowDownLeft, Filter } from 'lucide-react';
import { BRSEntry, TDSEntry } from '../../lib/accounting/types';

export const TaxAndBrsView: React.FC = () => {
  const { company, ledgers, vouchers } = useAccounting();
  const [activeTab, setActiveTab] = useState<'brs' | 'gst' | 'tds'>('brs');

  // BRS State
  const bankLedger = ledgers.find(l => l.name.toLowerCase().includes('bank') || l.groupId === 'grp-bank') || ledgers[0];
  const cashBookBalance = bankLedger ? bankLedger.currentBalance : 0;

  const [brsEntries, setBrsEntries] = useState<BRSEntry[]>([
    {
      id: 'brs-1',
      date: '2026-07-20',
      particulars: 'Cheque issued to Vendor not yet presented',
      chequeNo: 'CHQ-88219',
      type: 'unpresented_issued',
      amount: 15000
    },
    {
      id: 'brs-2',
      date: '2026-07-21',
      particulars: 'Cheque deposited from customer pending clearance',
      chequeNo: 'CHQ-00192',
      type: 'uncredited_deposited',
      amount: 25000
    }
  ]);

  const [newBrsParticulars, setNewBrsParticulars] = useState('');
  const [newBrsAmount, setNewBrsAmount] = useState(0);
  const [newBrsType, setNewBrsType] = useState<'unpresented_issued' | 'uncredited_deposited'>('unpresented_issued');

  const unpresentedTotal = brsEntries
    .filter(e => e.type === 'unpresented_issued')
    .reduce((sum, e) => sum + e.amount, 0);

  const uncreditedTotal = brsEntries
    .filter(e => e.type === 'uncredited_deposited')
    .reduce((sum, e) => sum + e.amount, 0);

  const bankPassbookBalance = cashBookBalance + unpresentedTotal - uncreditedTotal;

  const handleAddBrsEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrsParticulars || newBrsAmount <= 0) return;

    setBrsEntries([
      ...brsEntries,
      {
        id: `brs-${Date.now()}`,
        date: new Date().toISOString().slice(0, 10),
        particulars: newBrsParticulars,
        type: newBrsType,
        amount: Number(newBrsAmount)
      }
    ]);

    setNewBrsParticulars('');
    setNewBrsAmount(0);
  };

  // GST Computation
  const cgstPayable = ledgers.find(l => l.name.includes('CGST Payable'))?.currentBalance || 0;
  const sgstPayable = ledgers.find(l => l.name.includes('SGST Payable'))?.currentBalance || 0;
  const cgstInput = ledgers.find(l => l.name.includes('CGST Input'))?.currentBalance || 0;
  const sgstInput = ledgers.find(l => l.name.includes('SGST Input'))?.currentBalance || 0;

  const totalOutputGst = cgstPayable + sgstPayable;
  const totalInputGst = cgstInput + sgstInput;
  const netGstLiability = Math.max(0, totalOutputGst - totalInputGst);

  return (
    <div className="space-y-6">
      {/* Sub-nav */}
      <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <button
          onClick={() => setActiveTab('brs')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'brs'
              ? 'bg-slate-900 text-white dark:bg-teal-600 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Landmark className="w-4 h-4" />
          <span>Bank Reconciliation (BRS)</span>
        </button>

        <button
          onClick={() => setActiveTab('gst')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'gst'
              ? 'bg-slate-900 text-white dark:bg-teal-600 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>GST Computation (GSTR-1 / 3B)</span>
        </button>

        <button
          onClick={() => setActiveTab('tds')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'tds'
              ? 'bg-slate-900 text-white dark:bg-teal-600 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>TDS Statements & Taxation</span>
        </button>
      </div>

      {/* BRS View */}
      {activeTab === 'brs' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Landmark className="w-5 h-5 text-teal-600" /> Bank Reconciliation Statement (BRS)
                </h3>
                <p className="text-xs text-slate-500">ICAI Prescribed Reconciliation format for Cash Book vs Bank Passbook</p>
              </div>
              <div className="text-right font-mono">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Bank Account</span>
                <div className="text-sm font-bold text-teal-600 dark:text-teal-400">{bankLedger?.name || 'HDFC Bank'}</div>
              </div>
            </div>

            {/* Reconciliation Table */}
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl flex justify-between items-center text-xs font-mono font-bold">
                <span>Balance as per Company Cash Book / Ledger</span>
                <span className="text-slate-900 dark:text-white text-sm">{company.currencySymbol}{cashBookBalance.toLocaleString()}</span>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">ADD: Unpresented Cheques Issued</div>
                {brsEntries.filter(e => e.type === 'unpresented_issued').map(e => (
                  <div key={e.id} className="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200/60 dark:border-emerald-800/40 flex justify-between items-center text-xs">
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">{e.particulars}</div>
                      <div className="text-[10px] text-slate-400 font-mono">Ref: {e.chequeNo || 'N/A'} | Date: {e.date}</div>
                    </div>
                    <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">+{company.currencySymbol}{e.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">LESS: Uncredited Cheques Deposited</div>
                {brsEntries.filter(e => e.type === 'uncredited_deposited').map(e => (
                  <div key={e.id} className="p-3 bg-rose-50/50 dark:bg-rose-950/20 rounded-xl border border-rose-200/60 dark:border-rose-800/40 flex justify-between items-center text-xs">
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">{e.particulars}</div>
                      <div className="text-[10px] text-slate-400 font-mono">Ref: {e.chequeNo || 'N/A'} | Date: {e.date}</div>
                    </div>
                    <span className="font-mono font-bold text-rose-700 dark:text-rose-400">-{company.currencySymbol}{e.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-teal-900 text-white rounded-xl flex justify-between items-center text-sm font-mono font-bold shadow-md">
                <span>ESTIMATED BALANCE AS PER BANK PASSBOOK</span>
                <span className="text-teal-300 text-base">{company.currencySymbol}{bankPassbookBalance.toLocaleString()}</span>
              </div>
            </div>

            {/* Add BRS Entry Form */}
            <form onSubmit={handleAddBrsEntry} className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <span className="text-xs font-bold text-slate-900 dark:text-white">Add Reconciling Item</span>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <input
                  type="text"
                  required
                  value={newBrsParticulars}
                  onChange={e => setNewBrsParticulars(e.target.value)}
                  placeholder="Particulars (Cheque / Direct Credit)"
                  className="sm:col-span-2 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none"
                />
                <select
                  value={newBrsType}
                  onChange={e => setNewBrsType(e.target.value as any)}
                  className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none"
                >
                  <option value="unpresented_issued">Unpresented Cheque (+)</option>
                  <option value="uncredited_deposited">Uncredited Cheque (-)</option>
                </select>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min={1}
                    value={newBrsAmount || ''}
                    onChange={e => setNewBrsAmount(Number(e.target.value))}
                    placeholder="Amount"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none font-mono"
                  />
                  <button type="submit" className="px-3 py-2 bg-teal-600 text-white rounded-xl font-bold text-xs">
                    Add
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GST View */}
      {activeTab === 'gst' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Receipt className="w-5 h-5 text-teal-600" /> GST Tax Summary & Input Credit Offset
              </h3>
              <p className="text-xs text-slate-500">Automatic GSTR-3B Computation (Output Liability vs Input Tax Credit ITC)</p>
            </div>
            <div className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-mono font-bold text-xs rounded-full">
              GSTIN: {company.gstin || 'Registered'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Total Output GST (Liability)</span>
              <div className="text-xl font-black text-rose-600 dark:text-rose-400 font-mono">
                {company.currencySymbol}{totalOutputGst.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-500">CGST: {cgstPayable} | SGST: {sgstPayable}</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Input Tax Credit (ITC)</span>
              <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                {company.currencySymbol}{totalInputGst.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-500">CGST Input: {cgstInput} | SGST Input: {sgstInput}</div>
            </div>

            <div className="p-4 rounded-xl bg-teal-900 text-white space-y-2 shadow-md">
              <span className="text-[10px] font-bold text-teal-300 uppercase">Net Payable Cash GST</span>
              <div className="text-xl font-black font-mono text-teal-200">
                {company.currencySymbol}{netGstLiability.toLocaleString()}
              </div>
              <div className="text-[10px] text-teal-300">Offset via Electronic Cash Ledger</div>
            </div>
          </div>
        </div>
      )}

      {/* TDS View */}
      {activeTab === 'tds' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-teal-600" /> Tax Deducted at Source (TDS) Compliance
              </h3>
              <p className="text-xs text-slate-500">Section 194C (Contractors), 194J (Professional Fees), 194I (Rent) Returns</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold font-sans">
                  <th className="py-3 px-4">TDS Section</th>
                  <th className="py-3 px-4">Nature of Payment</th>
                  <th className="py-3 px-4">Threshold Exemption</th>
                  <th className="py-3 px-4 text-right">Standard TDS Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-sans">
                <tr>
                  <td className="py-3 px-4 font-bold font-mono text-teal-600">Sec 194C</td>
                  <td className="py-3 px-4">Payments to Contractors & Sub-contractors</td>
                  <td className="py-3 px-4 font-mono">{company.currencySymbol}30,000 / Single | {company.currencySymbol}1,00,000 Aggregate</td>
                  <td className="py-3 px-4 text-right font-bold font-mono">1% (Individual) / 2% (Company)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold font-mono text-teal-600">Sec 194J</td>
                  <td className="py-3 px-4">Professional & Technical Services Fees</td>
                  <td className="py-3 px-4 font-mono">{company.currencySymbol}30,000 p.a.</td>
                  <td className="py-3 px-4 text-right font-bold font-mono">10% (Professional) / 2% (Technical)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold font-mono text-teal-600">Sec 194I</td>
                  <td className="py-3 px-4">Rent for Land, Building & Machinery</td>
                  <td className="py-3 px-4 font-mono">{company.currencySymbol}2,40,000 p.a.</td>
                  <td className="py-3 px-4 text-right font-bold font-mono">10% (Building) / 2% (Plant & Equipment)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
