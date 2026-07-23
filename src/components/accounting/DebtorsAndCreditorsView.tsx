import React, { useState } from 'react';
import { useAccounting } from '../../context/AccountingContext';
import { 
  Users, 
  Truck, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus, 
  Search, 
  Building2, 
  Mail, 
  Phone, 
  FileText, 
  CheckCircle2, 
  Clock, 
  CreditCard,
  MapPin,
  Sparkles,
  FolderTree
} from 'lucide-react';

export const DebtorsAndCreditorsView: React.FC = () => {
  const { 
    customers, 
    suppliers, 
    billsOutstanding, 
    addCustomer, 
    addSupplier, 
    activeCompany,
    ledgers 
  } = useAccounting();

  const [activeTab, setActiveTab] = useState<'debtors' | 'creditors' | 'receivables' | 'payables'>('debtors');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false);

  // New Customer Form State
  const [custName, setCustName] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custGstin, setCustGstin] = useState('');
  const [custAddress, setCustAddress] = useState('');
  const [custCity, setCustCity] = useState('');
  const [custState, setCustState] = useState('');
  const [custCreditLimit, setCustCreditLimit] = useState('100000');
  const [custMostlySupplies, setCustMostlySupplies] = useState('Industrial Raw Materials & Components');

  // New Supplier Form State
  const [suppName, setSuppName] = useState('');
  const [suppEmail, setSuppEmail] = useState('');
  const [suppPhone, setSuppPhone] = useState('');
  const [suppGstin, setSuppGstin] = useState('');
  const [suppAddress, setSuppAddress] = useState('');
  const [suppCity, setSuppCity] = useState('');
  const [suppState, setSuppState] = useState('');
  const [suppMostlySupplies, setSuppMostlySupplies] = useState('Electrical Components & Spares');

  // Metrics
  const totalDebtorsBalance = customers.reduce((acc, c) => acc + (c.currentOutstanding || 0), 0);
  const totalCreditorsBalance = suppliers.reduce((acc, s) => acc + (s.currentOutstanding || 0), 0);

  const billsReceivable = billsOutstanding.filter(b => b.type === 'receivable');
  const billsPayable = billsOutstanding.filter(b => b.type === 'payable');

  const totalReceivables = billsReceivable.reduce((acc, b) => acc + b.pendingAmount, 0);
  const totalPayables = billsPayable.reduce((acc, b) => acc + b.pendingAmount, 0);

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName.trim()) return;

    addCustomer({
      companyId: activeCompany.id,
      name: custName,
      tradeName: custName,
      email: custEmail,
      phone: custPhone,
      gstin: custGstin,
      address: `${custAddress}, ${custCity}, ${custState}`,
      city: custCity,
      state: custState,
      pinCode: '400001',
      creditLimit: parseFloat(custCreditLimit) || 100000,
      paymentTerms: '30 Days Net',
      mostlySupplies: custMostlySupplies,
      currentOutstanding: 0
    });

    setIsAddCustomerOpen(false);
    setCustName('');
    setCustEmail('');
    setCustPhone('');
    setCustGstin('');
    setCustAddress('');
    setCustCity('');
    setCustState('');
  };

  const handleCreateSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!suppName.trim()) return;

    addSupplier({
      companyId: activeCompany.id,
      name: suppName,
      email: suppEmail,
      phone: suppPhone,
      gstin: suppGstin,
      address: `${suppAddress}, ${suppCity}, ${suppState}`,
      city: suppCity,
      state: suppState,
      pinCode: '400001',
      supplies: suppMostlySupplies || 'Factory Raw Materials',
      mostlySupplies: suppMostlySupplies,
      currentOutstanding: 0
    });

    setIsAddSupplierOpen(false);
    setSuppName('');
    setSuppEmail('');
    setSuppPhone('');
    setSuppGstin('');
    setSuppAddress('');
    setSuppCity('');
    setSuppState('');
  };

  return (
    <div className="space-y-6 text-xs font-sans">
      
      {/* Top Banner Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-[#D8E2EE] shadow-soft">
          <div className="flex items-center justify-between text-[#5B6878]">
            <span className="font-bold uppercase tracking-wider text-[10px]">Total Debtors (Customers)</span>
            <Users className="w-4 h-4 text-[#2F6FED]" />
          </div>
          <h3 className="text-xl font-bold font-num text-[#1A2433] mt-2">
            {activeCompany.currencySymbol}{totalDebtorsBalance.toLocaleString('en-IN')}
          </h3>
          <p className="text-[11px] text-[#5B6878] mt-1">{customers.length} Accounts Active</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#D8E2EE] shadow-soft">
          <div className="flex items-center justify-between text-[#5B6878]">
            <span className="font-bold uppercase tracking-wider text-[10px]">Total Creditors (Suppliers)</span>
            <Truck className="w-4 h-4 text-[#FF7043]" />
          </div>
          <h3 className="text-xl font-bold font-num text-[#1A2433] mt-2">
            {activeCompany.currencySymbol}{totalCreditorsBalance.toLocaleString('en-IN')}
          </h3>
          <p className="text-[11px] text-[#5B6878] mt-1">{suppliers.length} Accounts Active</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#D8E2EE] shadow-soft">
          <div className="flex items-center justify-between text-[#5B6878]">
            <span className="font-bold uppercase tracking-wider text-[10px]">Bills Receivable</span>
            <ArrowDownLeft className="w-4 h-4 text-[#2BA84A]" />
          </div>
          <h3 className="text-xl font-bold font-num text-[#2BA84A] mt-2">
            {activeCompany.currencySymbol}{totalReceivables.toLocaleString('en-IN')}
          </h3>
          <p className="text-[11px] text-[#5B6878] mt-1">{billsReceivable.length} Pending Invoices</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#D8E2EE] shadow-soft">
          <div className="flex items-center justify-between text-[#5B6878]">
            <span className="font-bold uppercase tracking-wider text-[10px]">Bills Payable</span>
            <ArrowUpRight className="w-4 h-4 text-[#E53935]" />
          </div>
          <h3 className="text-xl font-bold font-num text-[#E53935] mt-2">
            {activeCompany.currencySymbol}{totalPayables.toLocaleString('en-IN')}
          </h3>
          <p className="text-[11px] text-[#5B6878] mt-1">{billsPayable.length} Pending Invoices</p>
        </div>
      </div>

      {/* Navigation Sub-Tabs & Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#D8E2EE] shadow-xs">
        <div className="flex items-center gap-2 bg-[#EEF3F8] p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('debtors')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'debtors' ? 'bg-[#163A70] text-white shadow-xs' : 'text-[#5B6878]'}`}
          >
            Customers (Sundry Debtors)
          </button>
          <button
            onClick={() => setActiveTab('creditors')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'creditors' ? 'bg-[#163A70] text-white shadow-xs' : 'text-[#5B6878]'}`}
          >
            Suppliers (Sundry Creditors)
          </button>
          <button
            onClick={() => setActiveTab('receivables')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'receivables' ? 'bg-[#163A70] text-white shadow-xs' : 'text-[#5B6878]'}`}
          >
            Bills Receivable
          </button>
          <button
            onClick={() => setActiveTab('payables')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'payables' ? 'bg-[#163A70] text-white shadow-xs' : 'text-[#5B6878]'}`}
          >
            Bills Payable
          </button>
        </div>

        <div className="flex items-center gap-3">
          {activeTab === 'debtors' && (
            <button
              onClick={() => setIsAddCustomerOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#2F6FED] hover:bg-[#163A70] text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>New Customer (Debtor)</span>
            </button>
          )}

          {activeTab === 'creditors' && (
            <button
              onClick={() => setIsAddSupplierOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#FF7043] hover:bg-[#163A70] text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>New Supplier (Creditor)</span>
            </button>
          )}
        </div>
      </div>

      {/* Tab 1: Debtors Table */}
      {activeTab === 'debtors' && (
        <div className="bg-white rounded-card border border-[#D8E2EE] shadow-soft overflow-hidden">
          <div className="p-4 border-b border-[#D8E2EE] flex items-center justify-between bg-[#F7F9FC]">
            <h3 className="font-bold text-sm text-[#163A70]">Customer & Debtor Directory (Synced to Chart of Accounts)</h3>
            <span className="text-xs text-[#5B6878] font-semibold">{customers.length} Customers Registered</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#EEF3F8] text-[#5B6878] font-bold text-[11px] border-b border-[#D8E2EE]">
                  <th className="p-3">Customer Name</th>
                  <th className="p-3">GSTIN / Contact</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Mostly Supplies / Buys</th>
                  <th className="p-3 text-right">Credit Limit</th>
                  <th className="p-3 text-right">Current Outstanding</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D8E2EE]">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-[#EEF3F8]/50 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-[#1A2433]">{c.name}</div>
                      <div className="text-[10px] text-[#5B6878] font-mono">{c.email}</div>
                    </td>
                    <td className="p-3 font-mono text-[#5B6878]">
                      <div>{c.gstin || 'Unregistered'}</div>
                      <div className="text-[10px] text-[#8894A7]">{c.phone}</div>
                    </td>
                    <td className="p-3 text-[#5B6878]">{c.city}, {c.state}</td>
                    <td className="p-3 text-[#1A2433] font-medium">{c.mostlySupplies || 'General Supplies'}</td>
                    <td className="p-3 text-right font-num text-[#5B6878]">
                      {activeCompany.currencySymbol}{c.creditLimit.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3 text-right font-num font-bold text-[#2F6FED]">
                      {activeCompany.currencySymbol}{(c.currentOutstanding || 0).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Creditors Table */}
      {activeTab === 'creditors' && (
        <div className="bg-white rounded-card border border-[#D8E2EE] shadow-soft overflow-hidden">
          <div className="p-4 border-b border-[#D8E2EE] flex items-center justify-between bg-[#F7F9FC]">
            <h3 className="font-bold text-sm text-[#163A70]">Supplier & Creditor Directory (Synced to Chart of Accounts)</h3>
            <span className="text-xs text-[#5B6878] font-semibold">{suppliers.length} Suppliers Registered</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#EEF3F8] text-[#5B6878] font-bold text-[11px] border-b border-[#D8E2EE]">
                  <th className="p-3">Supplier Name</th>
                  <th className="p-3">GSTIN / Contact</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Primary Goods Supplied</th>
                  <th className="p-3 text-right">Current Payable</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D8E2EE]">
                {suppliers.map((s) => (
                  <tr key={s.id} className="hover:bg-[#EEF3F8]/50 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-[#1A2433]">{s.name}</div>
                      <div className="text-[10px] text-[#5B6878] font-mono">{s.email}</div>
                    </td>
                    <td className="p-3 font-mono text-[#5B6878]">
                      <div>{s.gstin || 'Unregistered'}</div>
                      <div className="text-[10px] text-[#8894A7]">{s.phone}</div>
                    </td>
                    <td className="p-3 text-[#5B6878]">{s.city}, {s.state}</td>
                    <td className="p-3 text-[#1A2433] font-medium">{s.mostlySupplies || s.supplies || 'Factory Raw Materials'}</td>
                    <td className="p-3 text-right font-num font-bold text-[#FF7043]">
                      {activeCompany.currencySymbol}{(s.currentOutstanding || 0).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3 & 4: Bills Outstanding (Receivable & Payable) */}
      {(activeTab === 'receivables' || activeTab === 'payables') && (
        <div className="bg-white rounded-card border border-[#D8E2EE] shadow-soft overflow-hidden">
          <div className="p-4 border-b border-[#D8E2EE] flex items-center justify-between bg-[#F7F9FC]">
            <h3 className="font-bold text-sm text-[#163A70]">
              {activeTab === 'receivables' ? 'Outstanding Bills Receivable (Customers)' : 'Outstanding Bills Payable (Suppliers)'}
            </h3>
            <span className="text-xs text-[#5B6878] font-semibold">
              {activeTab === 'receivables' ? billsReceivable.length : billsPayable.length} Open Invoices
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#EEF3F8] text-[#5B6878] font-bold text-[11px] border-b border-[#D8E2EE]">
                  <th className="p-3">Bill No.</th>
                  <th className="p-3">Bill Date</th>
                  <th className="p-3">Party Name</th>
                  <th className="p-3">Due Date</th>
                  <th className="p-3 text-right">Bill Amount</th>
                  <th className="p-3 text-right">Pending Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D8E2EE]">
                {(activeTab === 'receivables' ? billsReceivable : billsPayable).map((b) => (
                  <tr key={b.id} className="hover:bg-[#EEF3F8]/50 transition-colors">
                    <td className="p-3 font-mono font-bold text-[#163A70]">{b.invoiceNo}</td>
                    <td className="p-3 font-num text-[#5B6878]">{b.billDate}</td>
                    <td className="p-3 font-bold text-[#1A2433]">{b.partyName}</td>
                    <td className="p-3 font-num text-[#5B6878]">{b.dueDate}</td>
                    <td className="p-3 text-right font-num text-[#5B6878]">
                      {activeCompany.currencySymbol}{b.amount.toLocaleString('en-IN')}
                    </td>
                    <td className={`p-3 text-right font-num font-bold ${activeTab === 'receivables' ? 'text-[#2BA84A]' : 'text-[#E53935]'}`}>
                      {activeCompany.currencySymbol}{b.pendingAmount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Create Customer */}
      {isAddCustomerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4">
          <div className="bg-white rounded-card border border-[#D8E2EE] shadow-2xl max-w-lg w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[#D8E2EE] pb-3">
              <h3 className="font-bold text-base text-[#163A70] flex items-center gap-2">
                <Users className="w-5 h-5 text-[#2F6FED]" />
                Add New Customer (Sundry Debtor)
              </h3>
              <button onClick={() => setIsAddCustomerOpen(false)} className="text-[#8894A7] hover:text-[#1A2433] font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-4">
              <div>
                <label className="block font-bold text-[#1A2433] mb-1">Customer / Party Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Reliance Retail Logistics"
                  value={custName}
                  onChange={e => setCustName(e.target.value)}
                  className="w-full bg-[#EEF3F8] border border-[#D8E2EE] rounded-xl px-3 py-2 font-bold text-[#1A2433]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#1A2433] mb-1">GSTIN Number</label>
                  <input type="text" placeholder="27AABC..." value={custGstin} onChange={e => setCustGstin(e.target.value)} className="w-full bg-[#EEF3F8] border border-[#D8E2EE] rounded-xl px-3 py-2 font-mono" />
                </div>
                <div>
                  <label className="block font-bold text-[#1A2433] mb-1">Credit Limit ({activeCompany.currencySymbol})</label>
                  <input type="number" value={custCreditLimit} onChange={e => setCustCreditLimit(e.target.value)} className="w-full bg-[#EEF3F8] border border-[#D8E2EE] rounded-xl px-3 py-2 font-num" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#1A2433] mb-1">Items / Products Mostly Supplied / Purchased</label>
                <input
                  type="text"
                  placeholder="e.g. Electrical Transformers, Copper Cables"
                  value={custMostlySupplies}
                  onChange={e => setCustMostlySupplies(e.target.value)}
                  className="w-full bg-[#EEF3F8] border border-[#D8E2EE] rounded-xl px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#1A2433] mb-1">Email Address</label>
                  <input type="email" value={custEmail} onChange={e => setCustEmail(e.target.value)} className="w-full bg-[#EEF3F8] border border-[#D8E2EE] rounded-xl px-3 py-2" />
                </div>
                <div>
                  <label className="block font-bold text-[#1A2433] mb-1">Phone Number</label>
                  <input type="text" value={custPhone} onChange={e => setCustPhone(e.target.value)} className="w-full bg-[#EEF3F8] border border-[#D8E2EE] rounded-xl px-3 py-2" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#1A2433] mb-1">Address & City</label>
                <input type="text" placeholder="Address" value={custAddress} onChange={e => setCustAddress(e.target.value)} className="w-full bg-[#EEF3F8] border border-[#D8E2EE] rounded-xl px-3 py-2 mb-2" />
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" placeholder="City" value={custCity} onChange={e => setCustCity(e.target.value)} className="bg-[#EEF3F8] border border-[#D8E2EE] rounded-xl px-3 py-1.5" />
                  <input type="text" placeholder="State" value={custState} onChange={e => setCustState(e.target.value)} className="bg-[#EEF3F8] border border-[#D8E2EE] rounded-xl px-3 py-1.5" />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#EEF3F8] border border-[#D8E2EE] flex items-center gap-2 text-[11px] text-[#5B6878]">
                <FolderTree className="w-4 h-4 text-[#2F6FED]" />
                <span>Will automatically create a <strong>Sundry Debtors Ledger</strong> in Chart of Accounts!</span>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsAddCustomerOpen(false)} className="px-4 py-2 rounded-xl border border-[#D8E2EE] text-[#5B6878] font-bold">Cancel</button>
                <button type="submit" className="px-6 py-2 rounded-xl bg-[#2F6FED] hover:bg-[#163A70] text-white font-bold shadow-md">Add Customer & Sync Ledger</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create Supplier */}
      {isAddSupplierOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4">
          <div className="bg-white rounded-card border border-[#D8E2EE] shadow-2xl max-w-lg w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[#D8E2EE] pb-3">
              <h3 className="font-bold text-base text-[#163A70] flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#FF7043]" />
                Add New Supplier (Sundry Creditor)
              </h3>
              <button onClick={() => setIsAddSupplierOpen(false)} className="text-[#8894A7] hover:text-[#1A2433] font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateSupplier} className="space-y-4">
              <div>
                <label className="block font-bold text-[#1A2433] mb-1">Supplier / Vendor Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Hindalco Aluminum Corporation"
                  value={suppName}
                  onChange={e => setSuppName(e.target.value)}
                  className="w-full bg-[#EEF3F8] border border-[#D8E2EE] rounded-xl px-3 py-2 font-bold text-[#1A2433]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#1A2433] mb-1">GSTIN Number</label>
                  <input type="text" placeholder="27AABC..." value={suppGstin} onChange={e => setSuppGstin(e.target.value)} className="w-full bg-[#EEF3F8] border border-[#D8E2EE] rounded-xl px-3 py-2 font-mono" />
                </div>
                <div>
                  <label className="block font-bold text-[#1A2433] mb-1">Primary Supplies Provided</label>
                  <input type="text" placeholder="e.g. Raw Aluminum Ingots" value={suppMostlySupplies} onChange={e => setSuppMostlySupplies(e.target.value)} className="w-full bg-[#EEF3F8] border border-[#D8E2EE] rounded-xl px-3 py-2" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#1A2433] mb-1">Email Address</label>
                  <input type="email" value={suppEmail} onChange={e => setSuppEmail(e.target.value)} className="w-full bg-[#EEF3F8] border border-[#D8E2EE] rounded-xl px-3 py-2" />
                </div>
                <div>
                  <label className="block font-bold text-[#1A2433] mb-1">Phone Number</label>
                  <input type="text" value={suppPhone} onChange={e => setSuppPhone(e.target.value)} className="w-full bg-[#EEF3F8] border border-[#D8E2EE] rounded-xl px-3 py-2" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#1A2433] mb-1">Address & City</label>
                <input type="text" placeholder="Address" value={suppAddress} onChange={e => setSuppAddress(e.target.value)} className="w-full bg-[#EEF3F8] border border-[#D8E2EE] rounded-xl px-3 py-2 mb-2" />
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" placeholder="City" value={suppCity} onChange={e => setSuppCity(e.target.value)} className="bg-[#EEF3F8] border border-[#D8E2EE] rounded-xl px-3 py-1.5" />
                  <input type="text" placeholder="State" value={suppState} onChange={e => setSuppState(e.target.value)} className="bg-[#EEF3F8] border border-[#D8E2EE] rounded-xl px-3 py-1.5" />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#EEF3F8] border border-[#D8E2EE] flex items-center gap-2 text-[11px] text-[#5B6878]">
                <FolderTree className="w-4 h-4 text-[#FF7043]" />
                <span>Will automatically create a <strong>Sundry Creditors Ledger</strong> in Chart of Accounts!</span>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsAddSupplierOpen(false)} className="px-4 py-2 rounded-xl border border-[#D8E2EE] text-[#5B6878] font-bold">Cancel</button>
                <button type="submit" className="px-6 py-2 rounded-xl bg-[#FF7043] hover:bg-[#163A70] text-white font-bold shadow-md">Add Supplier & Sync Ledger</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
