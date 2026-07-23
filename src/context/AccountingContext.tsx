import React, { createContext, useContext, useState, useEffect } from 'react';
import { BRANDS, BrandConfig, BrandKey, DEFAULT_BRAND_KEY } from '../config/branding';
import { DEFAULT_GROUPS, DEFAULT_LEDGERS } from '../lib/accounting/default-coa';
import { recalculateLedgerBalances } from '../lib/accounting/double-entry';
import { generateBalanceSheetReport, generateProfitLossReport, generateTrialBalance, generateTradingAccount } from '../lib/accounting/report-engine';
import { INITIAL_COMPANY, INITIAL_VOUCHERS, INITIAL_INVENTORY, INITIAL_INVOICES } from '../lib/accounting/sample-data';
import { AccountGroup, BalanceSheetReport, Company, Ledger, ProfitLossReport, TradingAccountReport, TrialBalanceRow, Voucher, InventoryItem, Invoice, FiscalArchive } from '../lib/accounting/types';
import { supabase } from '../lib/supabase';

export interface LicenseInfo {
  mode: 'educational' | 'gold' | 'silver';
  productKey?: string;
  isLicensed: boolean;
  activatedAt?: string;
}

export type AccountingSubTab = 'daybook' | 'new-voucher' | 'billing' | 'inventory' | 'coa' | 'reports' | 'tax-brs';

interface AccountingContextType {
  brandKey: BrandKey;
  setBrandKey: (key: BrandKey) => void;
  brand: BrandConfig;
  company: Company;
  updateCompany: (c: Partial<Company>) => void;
  groups: AccountGroup[];
  ledgers: Ledger[];
  vouchers: Voucher[];
  inventory: InventoryItem[];
  invoices: Invoice[];
  archives: FiscalArchive[];
  addVoucher: (v: Omit<Voucher, 'id' | 'createdAt'>) => { success: boolean; message: string; voucher?: Voucher };
  addLedger: (l: Omit<Ledger, 'id' | 'currentBalance'>) => { success: boolean; ledger?: Ledger };
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => { success: boolean; item?: InventoryItem };
  updateInventoryStock: (skuId: string, qtyDelta: number) => void;
  addInvoice: (inv: Omit<Invoice, 'id'>) => { success: boolean; invoice?: Invoice };
  closeFinancialYear: () => void;
  trialBalance: TrialBalanceRow[];
  tradingAccount: TradingAccountReport;
  profitLoss: ProfitLossReport;
  balanceSheet: BalanceSheetReport;
  pendingVoucherDraft: Partial<Voucher> | null;
  setPendingVoucherDraft: (draft: Partial<Voucher> | null) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  accountingSubTab: AccountingSubTab;
  setAccountingSubTab: (subTab: AccountingSubTab) => void;
  license: LicenseInfo;
  setLicense: (lic: LicenseInfo) => void;
  isSupabaseConnected: boolean;
  resetCompanyAndData: (newCompanyData: Partial<Company>) => void;
}

const AccountingContext = createContext<AccountingContextType | undefined>(undefined);

export const AccountingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [brandKey, setBrandKey] = useState<BrandKey>(() => {
    const saved = localStorage.getItem('buzzflow_brand_key');
    return (saved as BrandKey) || DEFAULT_BRAND_KEY;
  });

  const [company, setCompany] = useState<Company>(() => {
    const saved = localStorage.getItem('buzzflow_company');
    return saved ? JSON.parse(saved) : INITIAL_COMPANY;
  });

  const [license, setLicenseState] = useState<LicenseInfo>(() => {
    const saved = localStorage.getItem('buzzflow_license');
    return saved ? JSON.parse(saved) : { mode: 'educational', isLicensed: true };
  });

  const [groups] = useState<AccountGroup[]>(DEFAULT_GROUPS);

  const [vouchers, setVouchers] = useState<Voucher[]>(() => {
    const saved = localStorage.getItem('buzzflow_vouchers');
    return saved ? JSON.parse(saved) : INITIAL_VOUCHERS;
  });

  const [ledgers, setLedgers] = useState<Ledger[]>(() => {
    const saved = localStorage.getItem('buzzflow_ledgers');
    if (saved) return JSON.parse(saved);
    return recalculateLedgerBalances(DEFAULT_LEDGERS, INITIAL_VOUCHERS);
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('buzzflow_inventory');
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('buzzflow_invoices');
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });

  const [archives, setArchives] = useState<FiscalArchive[]>(() => {
    const saved = localStorage.getItem('buzzflow_archives');
    return saved ? JSON.parse(saved) : [];
  });

  const [pendingVoucherDraft, setPendingVoucherDraft] = useState<Partial<Voucher> | null>(null);
  const [activeTab, setActiveTabState] = useState<string>('dashboard');
  const [accountingSubTab, setAccountingSubTab] = useState<AccountingSubTab>('daybook');
  const [isSupabaseConnected] = useState<boolean>(true);

  // Smart setActiveTab that redirects subtabs safely
  const setActiveTab = (tab: string) => {
    const subTabs: AccountingSubTab[] = ['daybook', 'new-voucher', 'billing', 'inventory', 'coa', 'reports', 'tax-brs'];
    if (subTabs.includes(tab as AccountingSubTab)) {
      setActiveTabState('accounting');
      setAccountingSubTab(tab as AccountingSubTab);
    } else {
      setActiveTabState(tab);
    }
  };

  const setLicense = (lic: LicenseInfo) => {
    setLicenseState(lic);
    localStorage.setItem('buzzflow_license', JSON.stringify(lic));
  };

  // Sync state to localStorage & Supabase
  useEffect(() => {
    localStorage.setItem('buzzflow_brand_key', brandKey);
  }, [brandKey]);

  useEffect(() => {
    localStorage.setItem('buzzflow_company', JSON.stringify(company));
    // Async push to Supabase
    supabase.from('companies').upsert({
      id: company.id,
      name: company.name,
      legal_name: company.legalName,
      fy_start: company.fyStart,
      fy_end: company.fyEnd,
      gstin: company.gstin,
      currency: company.currency,
      currency_symbol: company.currencySymbol,
      address: company.address,
      city: company.city,
      state: company.state,
      pin_code: company.pinCode,
      phone: company.phone,
      email: company.email,
      industry: company.industry,
      pin_code_security: company.securityPin,
      last_pin_changed_at: company.lastPinChangedAt,
      pin_changed_quarters: company.pinChangedQuarters
    }).then(({ error }) => {
      if (error) console.log('Supabase Sync Note:', error.message);
    });
  }, [company]);

  useEffect(() => {
    localStorage.setItem('buzzflow_vouchers', JSON.stringify(vouchers));
    const updatedLedgers = recalculateLedgerBalances(ledgers, vouchers);
    setLedgers(updatedLedgers);
    localStorage.setItem('buzzflow_ledgers', JSON.stringify(updatedLedgers));
  }, [vouchers]);

  useEffect(() => {
    localStorage.setItem('buzzflow_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('buzzflow_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('buzzflow_archives', JSON.stringify(archives));
  }, [archives]);

  const brand = BRANDS[brandKey] || BRANDS.buzzflow;

  const updateCompany = (updated: Partial<Company>) => {
    setCompany(prev => ({ ...prev, ...updated }));
  };

  const resetCompanyAndData = (newCompanyData: Partial<Company>) => {
    const updatedCompany: Company = {
      ...company,
      ...newCompanyData,
      id: `comp-${Date.now()}`
    };
    setCompany(updatedCompany);
    setVouchers([]);
    setInventory([]);
    setInvoices([]);
    setArchives([]);
    const freshLedgers = recalculateLedgerBalances(DEFAULT_LEDGERS, []);
    setLedgers(freshLedgers);
  };

  const addVoucher = (newVchData: Omit<Voucher, 'id' | 'createdAt'>) => {
    const newVoucher: Voucher = {
      ...newVchData,
      id: `vch-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    setVouchers(prev => [newVoucher, ...prev]);

    supabase.from('vouchers').insert({
      id: newVoucher.id,
      company_id: newVoucher.companyId,
      voucher_no: newVoucher.voucherNo,
      voucher_type: newVoucher.voucherType,
      date: newVoucher.date,
      total_amount: newVoucher.totalAmount,
      narration: newVoucher.narration,
      status: newVoucher.status,
      items: newVoucher.items
    }).then(({ error }) => {
      if (error) console.log('Supabase Voucher Sync Note:', error.message);
    });

    return { success: true, message: 'Voucher posted successfully!', voucher: newVoucher };
  };

  const addLedger = (newLedgerData: Omit<Ledger, 'id' | 'currentBalance'>) => {
    const newLedger: Ledger = {
      ...newLedgerData,
      id: `led-${Date.now()}`,
      currentBalance: newLedgerData.openingBalance || 0
    };

    setLedgers(prev => [...prev, newLedger]);

    supabase.from('ledgers').insert({
      id: newLedger.id,
      company_id: company.id,
      code: newLedger.code,
      name: newLedger.name,
      group_id: newLedger.groupId,
      group_name: newLedger.groupName,
      category: newLedger.category,
      nature: newLedger.nature,
      opening_balance: newLedger.openingBalance,
      current_balance: newLedger.currentBalance
    }).then(({ error }) => {
      if (error) console.log('Supabase Ledger Sync Note:', error.message);
    });

    return { success: true, ledger: newLedger };
  };

  const addInventoryItem = (itemData: Omit<InventoryItem, 'id'>) => {
    const newItem: InventoryItem = {
      ...itemData,
      id: `inv-sku-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    setInventory(prev => [...prev, newItem]);

    supabase.from('inventory_items').insert({
      id: newItem.id,
      company_id: company.id,
      item_code: newItem.itemCode,
      name: newItem.name,
      category: newItem.category,
      unit: newItem.unit,
      hsn_code: newItem.hsnCode,
      gst_rate: newItem.gstRate,
      cost_price: newItem.costPrice,
      selling_price: newItem.sellingPrice,
      current_stock: newItem.currentStock,
      reorder_level: newItem.reorderLevel
    }).then(({ error }) => {
      if (error) console.log('Supabase Inventory Sync Note:', error.message);
    });

    return { success: true, item: newItem };
  };

  const updateInventoryStock = (skuId: string, qtyDelta: number) => {
    setInventory(prev => prev.map(item => {
      if (item.id === skuId) {
        return { ...item, currentStock: Math.max(0, item.currentStock + qtyDelta) };
      }
      return item;
    }));
  };

  const addInvoice = (invData: Omit<Invoice, 'id'>) => {
    const newInvoice: Invoice = {
      ...invData,
      id: `inv-doc-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    setInvoices(prev => [newInvoice, ...prev]);

    invData.items.forEach(item => {
      if (item.itemId) {
        updateInventoryStock(item.itemId, -item.qty);
      }
    });

    supabase.from('invoices').insert({
      id: newInvoice.id,
      company_id: company.id,
      invoice_no: newInvoice.invoiceNo,
      customer_name: newInvoice.customerName,
      customer_gstin: newInvoice.customerGstin,
      customer_address: newInvoice.customerAddress,
      invoice_date: newInvoice.invoiceDate,
      items: newInvoice.items,
      subtotal: newInvoice.subtotal,
      tax_amount: newInvoice.taxAmount,
      total_amount: newInvoice.totalAmount,
      status: newInvoice.status,
      terms: newInvoice.terms
    }).then(({ error }) => {
      if (error) console.log('Supabase Invoice Sync Note:', error.message);
    });

    return { success: true, invoice: newInvoice };
  };

  const closeFinancialYear = () => {
    const currentFyLabel = `${company.fyStart.slice(0, 4)}-${company.fyEnd.slice(0, 4)}`;
    const pnl = generateProfitLossReport(ledgers);

    const archive: FiscalArchive = {
      id: `fy-archive-${Date.now()}`,
      companyId: company.id,
      financialYear: currentFyLabel,
      archivedAt: new Date().toISOString(),
      openingBalances: ledgers.reduce((acc, l) => ({ ...acc, [l.id]: l.openingBalance }), {}),
      closingBalances: ledgers.reduce((acc, l) => ({ ...acc, [l.id]: l.currentBalance }), {}),
      vouchersSnapshot: [...vouchers],
      profitAndLossSummary: {
        grossProfit: pnl.grossProfit,
        netProfit: pnl.netProfit,
        totalRevenue: pnl.operatingRevenue.subtotal,
        totalExpense: pnl.directExpenses.subtotal + pnl.indirectExpenses.subtotal
      }
    };

    setArchives(prev => [archive, ...prev]);

    const resetLedgers = ledgers.map(l => {
      const isBalanceSheetAccount = l.category === 'Assets' || l.category === 'Liabilities' || l.category === 'Equity';
      return {
        ...l,
        openingBalance: isBalanceSheetAccount ? l.currentBalance : 0,
        currentBalance: isBalanceSheetAccount ? l.currentBalance : 0
      };
    });

    setLedgers(resetLedgers);
    setVouchers([]);

    const currentStartYear = parseInt(company.fyStart.slice(0, 4), 10);
    const nextStart = `${currentStartYear + 1}-04-01`;
    const nextEnd = `${currentStartYear + 2}-03-31`;

    updateCompany({ fyStart: nextStart, fyEnd: nextEnd });

    supabase.from('fiscal_archives').insert({
      id: archive.id,
      company_id: archive.companyId,
      financial_year: archive.financialYear,
      archived_at: archive.archivedAt,
      opening_balances: archive.openingBalances,
      closing_balances: archive.closingBalances,
      vouchers_snapshot: archive.vouchersSnapshot,
      profit_loss_summary: archive.profitAndLossSummary
    }).then(({ error }) => {
      if (error) console.log('Supabase Archive Sync Note:', error.message);
    });
  };

  // Reports
  const trialBalance = generateTrialBalance(ledgers);
  const tradingAccount = generateTradingAccount(ledgers);
  const profitLoss = generateProfitLossReport(ledgers);
  const balanceSheet = generateBalanceSheetReport(ledgers);

  return (
    <AccountingContext.Provider
      value={{
        brandKey,
        setBrandKey,
        brand,
        company,
        updateCompany,
        groups,
        ledgers,
        vouchers,
        inventory,
        invoices,
        archives,
        addVoucher,
        addLedger,
        addInventoryItem,
        updateInventoryStock,
        addInvoice,
        closeFinancialYear,
        trialBalance,
        tradingAccount,
        profitLoss,
        balanceSheet,
        pendingVoucherDraft,
        setPendingVoucherDraft,
        activeTab,
        setActiveTab,
        accountingSubTab,
        setAccountingSubTab,
        license,
        setLicense,
        isSupabaseConnected,
        resetCompanyAndData
      }}
    >
      {children}
    </AccountingContext.Provider>
  );
};

export const useAccounting = () => {
  const context = useContext(AccountingContext);
  if (!context) {
    throw new Error('useAccounting must be used within an AccountingProvider');
  }
  return context;
};
