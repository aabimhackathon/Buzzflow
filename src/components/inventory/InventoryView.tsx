import React, { useState } from 'react';
import { useAccounting } from '../../context/AccountingContext';
import { Package, Plus, Search, Tag, AlertTriangle, ArrowUpDown, Edit, Check, ShieldCheck } from 'lucide-react';
import { InventoryItem } from '../../lib/accounting/types';

export const InventoryView: React.FC = () => {
  const { inventory, addInventoryItem, company, updateInventoryStock } = useAccounting();
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [itemCode, setItemCode] = useState('');
  const [category, setCategory] = useState('General');
  const [unit, setUnit] = useState<'Pcs' | 'Box' | 'Kg' | 'Ltr' | 'Mtr' | 'Units'>('Pcs');
  const [hsnCode, setHsnCode] = useState('');
  const [gstRate, setGstRate] = useState(18);
  const [costPrice, setCostPrice] = useState(0);
  const [sellingPrice, setSellingPrice] = useState(0);
  const [initialStock, setInitialStock] = useState(0);
  const [reorderLevel, setReorderLevel] = useState(10);

  const filteredItems = inventory.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.itemCode.toLowerCase().includes(search.toLowerCase()) ||
    item.hsnCode.includes(search)
  );

  const totalStockValuation = inventory.reduce((sum, item) => sum + (item.currentStock * item.costPrice), 0);
  const totalSellingValuation = inventory.reduce((sum, item) => sum + (item.currentStock * item.sellingPrice), 0);
  const lowStockCount = inventory.filter(item => item.currentStock <= item.reorderLevel).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !itemCode) return;

    addInventoryItem({
      companyId: company.id,
      itemCode,
      name,
      category,
      unit,
      hsnCode,
      gstRate: Number(gstRate),
      costPrice: Number(costPrice),
      sellingPrice: Number(sellingPrice),
      currentStock: Number(initialStock),
      reorderLevel: Number(reorderLevel)
    });

    setIsAddModalOpen(false);
    // Reset form
    setName('');
    setItemCode('');
    setHsnCode('');
    setCostPrice(0);
    setSellingPrice(0);
    setInitialStock(0);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Inventory Items</span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">{inventory.length} SKUs</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Tag className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Stock Cost Valuation</span>
            <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {company.currencySymbol}{totalStockValuation.toLocaleString()}
            </h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Low Stock Alerts</span>
            <h3 className="text-2xl font-black text-amber-600 dark:text-amber-400">{lowStockCount} Items</h3>
          </div>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search stock by SKU, Item Name, HSN..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Stock Item</span>
        </button>
      </div>

      {/* Inventory Stock Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs border-collapse font-mono">
          <thead>
            <tr className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold font-sans border-b border-slate-200 dark:border-slate-800">
              <th className="py-3.5 px-4">SKU / Code</th>
              <th className="py-3.5 px-4">Item Name</th>
              <th className="py-3.5 px-4">HSN Code</th>
              <th className="py-3.5 px-4">GST Rate</th>
              <th className="py-3.5 px-4 text-right">Cost Price</th>
              <th className="py-3.5 px-4 text-right">Selling Price</th>
              <th className="py-3.5 px-4 text-center">Current Stock</th>
              <th className="py-3.5 px-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400 font-sans">
                  No inventory stock items found. Click "Add New Stock Item" to add real inventory!
                </td>
              </tr>
            ) : (
              filteredItems.map(item => {
                const isLow = item.currentStock <= item.reorderLevel;
                return (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{item.itemCode}</td>
                    <td className="py-3 px-4 font-sans font-semibold text-slate-900 dark:text-slate-100">
                      {item.name}
                      <span className="block text-[10px] text-slate-400 font-mono">{item.category}</span>
                    </td>
                    <td className="py-3 px-4 font-sans text-slate-500">{item.hsnCode || '-'}</td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300">{item.gstRate}% GST</td>
                    <td className="py-3 px-4 text-right font-bold text-slate-700 dark:text-slate-300">
                      {company.currencySymbol}{item.costPrice.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-teal-600 dark:text-teal-400">
                      {company.currencySymbol}{item.sellingPrice.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center font-bold font-sans">
                      <span className={`px-2.5 py-1 rounded-full text-xs ${isLow ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200'}`}>
                        {item.currentStock} {item.unit}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {isLow ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                          <AlertTriangle className="w-3 h-3" /> Reorder Needed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          <Check className="w-3 h-3" /> In Stock
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add New Stock Item Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-teal-600" /> Add New Inventory Stock SKU
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white font-bold">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">SKU / Code *</label>
                  <input
                    type="text"
                    required
                    value={itemCode}
                    onChange={e => setItemCode(e.target.value)}
                    placeholder="e.g. SKU-1001"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Item Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Wireless Ergonomic Mouse"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">HSN Code</label>
                  <input
                    type="text"
                    value={hsnCode}
                    onChange={e => setHsnCode(e.target.value)}
                    placeholder="e.g. 8471"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Unit</label>
                  <select
                    value={unit}
                    onChange={e => setUnit(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="Pcs">Pcs</option>
                    <option value="Box">Box</option>
                    <option value="Kg">Kg</option>
                    <option value="Ltr">Ltr</option>
                    <option value="Mtr">Mtr</option>
                    <option value="Units">Units</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">GST Rate %</label>
                  <select
                    value={gstRate}
                    onChange={e => setGstRate(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value={0}>0% GST</option>
                    <option value={5}>5% GST</option>
                    <option value={12}>12% GST</option>
                    <option value={18}>18% GST</option>
                    <option value={28}>28% GST</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Cost Price ({company.currencySymbol})</label>
                  <input
                    type="number"
                    min={0}
                    value={costPrice}
                    onChange={e => setCostPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Selling Price ({company.currencySymbol})</label>
                  <input
                    type="number"
                    min={0}
                    value={sellingPrice}
                    onChange={e => setSellingPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Initial Opening Quantity</label>
                  <input
                    type="number"
                    min={0}
                    value={initialStock}
                    onChange={e => setInitialStock(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Reorder Alert Level</label>
                  <input
                    type="number"
                    min={1}
                    value={reorderLevel}
                    onChange={e => setReorderLevel(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-teal-600 text-white shadow-md shadow-teal-600/20"
                >
                  Save Stock Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
