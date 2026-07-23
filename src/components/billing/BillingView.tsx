import React, { useState } from 'react';
import { useAccounting } from '../../context/AccountingContext';
import { FileText, Plus, Trash2, Printer, CheckCircle, Download, Building2, UserCheck, ShieldCheck, Sparkles, Send } from 'lucide-react';
import { Invoice, InvoiceItem } from '../../lib/accounting/types';
import { downloadPDF } from '../../utils/pdfGenerator';

export const BillingView: React.FC = () => {
  const { company, inventory, invoices, addInvoice, addVoucher, ledgers } = useAccounting();

  // Invoice Builder State
  const [customerName, setCustomerName] = useState('');
  const [customerGstin, setCustomerGstin] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [terms, setTerms] = useState('Payment due within 15 days from date of issue. Interest @ 18% p.a. applicable on overdue invoices.');
  const [isIgst, setIsIgst] = useState(false); // Inter-state IGST vs Intra-state CGST+SGST

  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: `inv-item-1`,
      itemName: 'Professional Consulting / Product',
      hsnCode: '9983',
      qty: 1,
      unit: 'Units',
      rate: 1000,
      discountPct: 0,
      gstRate: 18,
      taxableAmount: 1000,
      cgst: 90,
      sgst: 90,
      igst: 0,
      total: 1180
    }
  ]);

  const updateItemCalculations = (item: InvoiceItem): InvoiceItem => {
    const gross = item.qty * item.rate;
    const discount = (gross * (item.discountPct || 0)) / 100;
    const taxableAmount = gross - discount;
    const gstRate = item.gstRate || 0;

    let cgst = 0;
    let sgst = 0;
    let igst = 0;

    if (isIgst) {
      igst = (taxableAmount * gstRate) / 100;
    } else {
      cgst = (taxableAmount * (gstRate / 2)) / 100;
      sgst = (taxableAmount * (gstRate / 2)) / 100;
    }

    const total = taxableAmount + cgst + sgst + igst;

    return {
      ...item,
      taxableAmount: Number(taxableAmount.toFixed(2)),
      cgst: Number(cgst.toFixed(2)),
      sgst: Number(sgst.toFixed(2)),
      igst: Number(igst.toFixed(2)),
      total: Number(total.toFixed(2))
    };
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
    const updatedItems = [...items];
    const item = { ...updatedItems[index], [field]: value };
    updatedItems[index] = updateItemCalculations(item);
    setItems(updatedItems);
  };

  const selectInventoryItem = (index: number, skuId: string) => {
    const stockItem = inventory.find(i => i.id === skuId);
    if (!stockItem) return;

    const updatedItems = [...items];
    const item: InvoiceItem = {
      ...updatedItems[index],
      itemId: stockItem.id,
      itemName: stockItem.name,
      hsnCode: stockItem.hsnCode || '9983',
      unit: stockItem.unit,
      rate: stockItem.sellingPrice,
      gstRate: stockItem.gstRate
    };
    updatedItems[index] = updateItemCalculations(item);
    setItems(updatedItems);
  };

  const addItemRow = () => {
    const newItem: InvoiceItem = {
      id: `inv-item-${Date.now()}`,
      itemName: '',
      hsnCode: '9983',
      qty: 1,
      unit: 'Pcs',
      rate: 0,
      discountPct: 0,
      gstRate: 18,
      taxableAmount: 0,
      cgst: 0,
      sgst: 0,
      igst: 0,
      total: 0
    };
    setItems([...items, newItem]);
  };

  const removeItemRow = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const subtotal = items.reduce((sum, item) => sum + item.taxableAmount, 0);
  const totalCgst = items.reduce((sum, item) => sum + item.cgst, 0);
  const totalSgst = items.reduce((sum, item) => sum + item.sgst, 0);
  const totalIgst = items.reduce((sum, item) => sum + item.igst, 0);
  const totalTax = totalCgst + totalSgst + totalIgst;
  const grandTotal = subtotal + totalTax;

  const handlePostInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName) {
      alert('Please enter Customer Name to post invoice.');
      return;
    }

    const invNo = `INV-${new Date().getFullYear().toString().slice(-2)}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newInvoice: Omit<Invoice, 'id'> = {
      companyId: company.id,
      invoiceNo: invNo,
      customerName,
      customerGstin,
      customerAddress,
      invoiceDate,
      items,
      subtotal: Number(subtotal.toFixed(2)),
      taxAmount: Number(totalTax.toFixed(2)),
      discountAmount: 0,
      totalAmount: Number(grandTotal.toFixed(2)),
      status: 'paid',
      terms
    };

    // Also post directly into Accounting Vouchers & Ledgers
    const debtorLedger = ledgers.find(l => l.name.toLowerCase().includes('debtors') || l.name.toLowerCase().includes('apex') || l.groupId === 'grp-sundry-debtors') || ledgers[0];
    const salesLedger = ledgers.find(l => l.groupId === 'grp-sales' || l.category === 'Revenue') || ledgers[0];
    const cgstLedger = ledgers.find(l => l.name.includes('CGST')) || ledgers[0];
    const sgstLedger = ledgers.find(l => l.name.includes('SGST')) || ledgers[0];

    const voucherItems = [
      { id: 'item-inv-1', ledgerId: debtorLedger.id, ledgerName: customerName, drCr: 'Dr' as const, amount: grandTotal, narration: `Sales Invoice ${invNo}` },
      { id: 'item-inv-2', ledgerId: salesLedger.id, ledgerName: salesLedger.name, drCr: 'Cr' as const, amount: subtotal, narration: `Taxable Sales` }
    ];

    if (totalCgst > 0) {
      voucherItems.push({ id: 'item-inv-cgst', ledgerId: cgstLedger.id, ledgerName: 'CGST Payable (Output)', drCr: 'Cr' as const, amount: totalCgst, narration: 'Output CGST' });
    }
    if (totalSgst > 0) {
      voucherItems.push({ id: 'item-inv-sgst', ledgerId: sgstLedger.id, ledgerName: 'SGST Payable (Output)', drCr: 'Cr' as const, amount: totalSgst, narration: 'Output SGST' });
    }

    addVoucher({
      voucherNo: invNo,
      voucherType: 'sales',
      date: invoiceDate,
      companyId: company.id,
      items: voucherItems,
      totalAmount: grandTotal,
      narration: `Being sales invoice ${invNo} issued to ${customerName} (GSTIN: ${customerGstin || 'Unregistered'})`,
      status: 'posted'
    });

    addInvoice(newInvoice);
    alert(`Billing Invoice ${invNo} saved successfully & posted to Accounting & Supabase!`);

    // Reset customer
    setCustomerName('');
    setCustomerGstin('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <span className="text-[10px] font-bold text-teal-600 uppercase tracking-wider">Enterprise Billing & Invoicing</span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Flexible GST Tax Invoice Creator</h2>
          <p className="text-xs text-slate-500">Fully customizable billing software linked directly with Accounting, Inventory & Supabase</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => downloadPDF('invoice-preview', 'GST_Tax_Invoice')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-teal-600 hover:bg-slate-800 text-white font-semibold text-xs transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download Invoice PDF</span>
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Invoice</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Invoice Configuration Panel */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-teal-600" /> Customer & Billing Settings
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Customer / Billed Party Name *</label>
              <input
                type="text"
                required
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                placeholder="e.g. Apex Traders Pvt Ltd"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Customer GSTIN / UIN</label>
              <input
                type="text"
                value={customerGstin}
                onChange={e => setCustomerGstin(e.target.value)}
                placeholder="e.g. 27AABCT9981F1Z2"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Billing & Delivery Address</label>
              <textarea
                rows={2}
                value={customerAddress}
                onChange={e => setCustomerAddress(e.target.value)}
                placeholder="Address, City, State, PIN"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Invoice Date</label>
                <input
                  type="date"
                  value={invoiceDate}
                  onChange={e => setInvoiceDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Tax Regime</label>
                <button
                  type="button"
                  onClick={() => setIsIgst(!isIgst)}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-bold border transition-colors ${isIgst ? 'bg-indigo-50 border-indigo-300 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300' : 'bg-teal-50 border-teal-300 text-teal-700 dark:bg-teal-950 dark:text-teal-300'}`}
                >
                  {isIgst ? 'IGST (Inter-State)' : 'CGST + SGST'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Custom Terms & Conditions</label>
              <textarea
                rows={3}
                value={terms}
                onChange={e => setTerms(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none resize-none"
              />
            </div>

            <button
              onClick={handlePostInvoice}
              className="w-full py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-lg shadow-teal-600/20 flex items-center justify-center gap-2 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Post & Save Invoice</span>
            </button>
          </div>
        </div>

        {/* Live Printable Invoice Canvas */}
        <div className="lg:col-span-2">
          <div id="invoice-preview" className="bg-white text-slate-900 p-8 rounded-2xl border border-slate-200 shadow-xl font-sans space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start border-b border-slate-200 pb-6">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-teal-700">TAX INVOICE</span>
                <h1 className="text-2xl font-black text-slate-900">{company.name}</h1>
                <p className="text-xs text-slate-600 max-w-sm">{company.address}, {company.city}, {company.state} - {company.pinCode}</p>
                <p className="text-xs font-mono font-bold text-slate-800 mt-1">GSTIN: {company.gstin || '27AABCV1234F1Z9'}</p>
              </div>

              <div className="text-right space-y-1">
                <div className="text-xs font-mono font-bold text-slate-500">Invoice Ref</div>
                <div className="text-lg font-black font-mono text-teal-700">INV-2026-PREVIEW</div>
                <div className="text-xs text-slate-600 font-mono">Date: {invoiceDate}</div>
              </div>
            </div>

            {/* Billed To */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-xs grid grid-cols-2 gap-4">
              <div>
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">BILLED TO:</span>
                <div className="font-bold text-slate-900 text-sm">{customerName || 'Customer Name'}</div>
                <div className="text-slate-600">{customerAddress || 'Customer Address Details'}</div>
                <div className="font-mono text-slate-800 mt-1">GSTIN: {customerGstin || 'Unregistered'}</div>
              </div>
              <div className="text-right">
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">SUPPLY STATE:</span>
                <div className="font-bold text-slate-900">{company.state} ({isIgst ? 'Inter-State IGST' : 'Intra-State CGST/SGST'})</div>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white font-bold border-b border-slate-900">
                    <th className="py-2.5 px-3">Item Description</th>
                    <th className="py-2.5 px-2">HSN</th>
                    <th className="py-2.5 px-2 text-center">Qty</th>
                    <th className="py-2.5 px-2 text-right">Rate</th>
                    <th className="py-2.5 px-2 text-right">GST %</th>
                    <th className="py-2.5 px-3 text-right">Taxable</th>
                    <th className="py-2.5 px-3 text-right">Total</th>
                    <th className="py-2.5 px-1"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {items.map((item, idx) => (
                    <tr key={item.id}>
                      <td className="py-2 px-3">
                        {inventory.length > 0 && (
                          <select
                            onChange={e => selectInventoryItem(idx, e.target.value)}
                            className="block w-full mb-1 text-[10px] bg-slate-100 border border-slate-300 rounded px-1 py-0.5"
                          >
                            <option value="">-- Link SKU from Inventory --</option>
                            {inventory.map(sku => (
                              <option key={sku.id} value={sku.id}>{sku.itemCode} - {sku.name}</option>
                            ))}
                          </select>
                        )}
                        <input
                          type="text"
                          value={item.itemName}
                          onChange={e => handleItemChange(idx, 'itemName', e.target.value)}
                          placeholder="Item description"
                          className="w-full font-bold text-slate-900 bg-transparent outline-none border-b border-dashed border-slate-300 focus:border-teal-600"
                        />
                      </td>
                      <td className="py-2 px-2">
                        <input
                          type="text"
                          value={item.hsnCode}
                          onChange={e => handleItemChange(idx, 'hsnCode', e.target.value)}
                          className="w-14 font-mono text-slate-700 bg-transparent outline-none border-b border-dashed border-slate-300"
                        />
                      </td>
                      <td className="py-2 px-2 text-center">
                        <input
                          type="number"
                          min={1}
                          value={item.qty}
                          onChange={e => handleItemChange(idx, 'qty', Number(e.target.value))}
                          className="w-12 text-center font-bold text-slate-900 bg-transparent outline-none border-b border-dashed border-slate-300"
                        />
                      </td>
                      <td className="py-2 px-2 text-right">
                        <input
                          type="number"
                          min={0}
                          value={item.rate}
                          onChange={e => handleItemChange(idx, 'rate', Number(e.target.value))}
                          className="w-20 text-right font-mono font-bold text-slate-900 bg-transparent outline-none border-b border-dashed border-slate-300"
                        />
                      </td>
                      <td className="py-2 px-2 text-right">
                        <select
                          value={item.gstRate}
                          onChange={e => handleItemChange(idx, 'gstRate', Number(e.target.value))}
                          className="text-xs font-mono font-bold bg-transparent outline-none"
                        >
                          <option value={0}>0%</option>
                          <option value={5}>5%</option>
                          <option value={12}>12%</option>
                          <option value={18}>18%</option>
                          <option value={28}>28%</option>
                        </select>
                      </td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-slate-800">
                        {company.currencySymbol}{item.taxableAmount.toLocaleString()}
                      </td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-teal-700">
                        {company.currencySymbol}{item.total.toLocaleString()}
                      </td>
                      <td className="py-2 px-1 text-center">
                        <button onClick={() => removeItemRow(idx)} className="text-rose-500 hover:text-rose-700">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              onClick={addItemRow}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Add Item Line
            </button>

            {/* Calculations Summary */}
            <div className="flex justify-end pt-4 border-t border-slate-200">
              <div className="w-64 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal Taxable:</span>
                  <span className="font-bold">{company.currencySymbol}{subtotal.toLocaleString()}</span>
                </div>
                {!isIgst ? (
                  <>
                    <div className="flex justify-between text-slate-600">
                      <span>CGST Total:</span>
                      <span className="font-bold">{company.currencySymbol}{totalCgst.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>SGST Total:</span>
                      <span className="font-bold">{company.currencySymbol}{totalSgst.toLocaleString()}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between text-slate-600">
                    <span>IGST Total:</span>
                    <span className="font-bold">{company.currencySymbol}{totalIgst.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-black text-slate-900 border-t-2 border-slate-900 pt-2 font-sans">
                  <span>GRAND TOTAL:</span>
                  <span className="text-teal-700 font-mono">{company.currencySymbol}{grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Terms */}
            <div className="text-[11px] text-slate-500 border-t border-slate-200 pt-4">
              <div className="font-bold text-slate-700 uppercase tracking-wider text-[9px] mb-1">TERMS & CONDITIONS:</div>
              <p>{terms}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
