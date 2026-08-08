import React, { createContext, useContext, useState, useEffect } from 'react';
import { BRANDS, BrandConfig, BrandKey, DEFAULT_BRAND_KEY } from '../config/branding';
import { DEFAULT_GROUPS, DEFAULT_LEDGERS } from '../lib/accounting/default-coa';
import { recalculateLedgerBalances } from '../lib/accounting/double-entry';
import { generateBalanceSheetReport, generateProfitLossReport, generateTrialBalance, generateTradingAccount } from '../lib/accounting/report-engine';
import { INITIAL_COMPANIES, INITIAL_COMPANY, INITIAL_VOUCHERS, INITIAL_INVENTORY, INITIAL_INVOICES, INITIAL_CUSTOMERS, INITIAL_SUPPLIERS, INITIAL_BILLS_OUTSTANDING } from '../lib/accounting/sample-data';
import { AccountGroup, BalanceSheetReport, Company, Ledger, ProfitLossReport, TradingAccountReport, TrialBalanceRow, Voucher, InventoryItem, Invoice, FiscalArchive, Customer, Supplier, BillOutstanding, AuditLogEntry } from '../lib/accounting/types';

export interface LicenseInfo {
  mode: 'educational' | 'gold' | 'silver';
  productKey?: string;
  isLicensed: boolean;
  activatedAt?: string;
}

export type AccountingSubTab = 'daybook' | 'new-voucher' | 'billing' | 'inventory' | 'coa' | 'reports' | 'tax-brs' | 'banking-cash' | 'debtors-creditors';

interface AccountingContextType {
  brandKey: BrandKey;
  setBrandKey: (key: BrandKey) => void;
  brand: BrandConfig;
  
  // Multi-Company & Auth Gate
  companies: Company[];
  activeCompany: Company;
  company: Company;
  activeCompanyId: string | null;
  isCompanyAuthenticated: boolean;
  selectCompany: (companyId: string) => void;
  authenticateCompanyPin: (pin: string) => { success: boolean; message: string };
  exitCompanySession: () => void;
  addCompany: (compData: Omit<Company, 'id' | 'securityPin' | 'lastPinChangedAt' | 'pinChangedQuarters'> & { securityPin: string }) => Company;
  updateCompany: (c: Partial<Company>) => void;
  
  // Master Data & Ledgers
  groups: AccountGroup[];
  ledgers: Ledger[];
  vouchers: Voucher[];
  inventory: InventoryItem[];
  invoices: Invoice[];
  customers: Customer[];
  suppliers: Supplier[];
  billsOutstanding: BillOutstanding[];
  archives: FiscalArchive[];
  auditLogs: AuditLogEntry[];

  // Data Actions
  addAuditLog: (entry: Omit<AuditLogEntry, 'id' | 'timestamp' | 'companyId'>) => void;
  addVoucher: (v: Omit<Voucher, 'id' | 'createdAt'>) => { success: boolean; message: string; voucher?: Voucher };
  addLedger: (l: Omit<Ledger, 'id' | 'currentBalance'>) => { success: boolean; ledger?: Ledger };
  addCustomer: (cust: Omit<Customer, 'id'>) => { success: boolean; customer: Customer };
  addSupplier: (supp: Omit<Supplier, 'id'>) => { success: boolean; supplier: Supplier };
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => { success: boolean; item?: InventoryItem };
  updateInventoryStock: (skuId: string, qtyDelta: number) => void;
  addInvoice: (inv: Omit<Invoice, 'id'>) => { success: boolean; invoice?: Invoice };
  closeFinancialYear: () => void;

  // Reports & Analytics
  trialBalance: TrialBalanceRow[];
  tradingAccount: TradingAccountReport;
  profitLoss: ProfitLossReport;
  balanceSheet: BalanceSheetReport;
  
  // UI States & Tabs
  pendingVoucherDraft: Partial<Voucher> | null;
  setPendingVoucherDraft: (draft: Partial<Voucher> | null) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  accountingSubTab: AccountingSubTab;
  setAccountingSubTab: (subTab: AccountingSubTab) => void;
  license: LicenseInfo;
  setLicense: (lic: LicenseInfo) => void;

  // AI OS System Initialization & Boot Sequence State
  systemOsState: 'offline' | 'initializing' | 'ready';
  setSystemOsState: (state: 'offline' | 'initializing' | 'ready') => void;
  rebootOs: () => void;
}

const AccountingContext = createContext<AccountingContextType | undefined>(undefined);

export const AccountingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [brandKey, setBrandKey] = useState<BrandKey>(() => {
    const saved = localStorage.getItem('vepari_brand_key') || localStorage.getItem('buzzflow_brand_key');
    return (saved as BrandKey) || DEFAULT_BRAND_KEY;
  });

  // Companies List State
  const [companies, setCompanies] = useState<Company[]>(() => {
    const saved = localStorage.getItem('vepari_companies') || localStorage.getItem('buzzflow_companies');
    return saved ? JSON.parse(saved) : INITIAL_COMPANIES;
  });

  const [activeCompanyId, setActiveCompanyId] = useState<string | null>(() => {
    return localStorage.getItem('vepari_active_company_id') || localStorage.getItem('buzzflow_active_company_id') || null;
  });

  const [isCompanyAuthenticated, setIsCompanyAuthenticated] = useState<boolean>(() => {
    return (localStorage.getItem('vepari_company_auth') || localStorage.getItem('buzzflow_company_auth')) === 'true';
  });

  const activeCompany = companies.find(c => c.id === activeCompanyId) || companies[0] || INITIAL_COMPANY;

  const [license, setLicenseState] = useState<LicenseInfo>(() => {
    const saved = localStorage.getItem('vepari_license') || localStorage.getItem('buzzflow_license');
    return saved ? JSON.parse(saved) : { mode: 'educational', isLicensed: true };
  });

  const [groups] = useState<AccountGroup[]>(DEFAULT_GROUPS);

  const [vouchers, setVouchers] = useState<Voucher[]>(() => {
    const saved = localStorage.getItem('vepari_vouchers') || localStorage.getItem('buzzflow_vouchers');
    return saved ? JSON.parse(saved) : INITIAL_VOUCHERS;
  });

  const [ledgers, setLedgers] = useState<Ledger[]>(() => {
    const saved = localStorage.getItem('vepari_ledgers') || localStorage.getItem('buzzflow_ledgers');
    if (saved) return JSON.parse(saved);
    return recalculateLedgerBalances(DEFAULT_LEDGERS, INITIAL_VOUCHERS);
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('vepari_inventory') || localStorage.getItem('buzzflow_inventory');
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('vepari_invoices') || localStorage.getItem('buzzflow_invoices');
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('vepari_customers') || localStorage.getItem('buzzflow_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    const saved = localStorage.getItem('vepari_suppliers') || localStorage.getItem('buzzflow_suppliers');
    return saved ? JSON.parse(saved) : INITIAL_SUPPLIERS;
  });

  const [billsOutstanding, setBillsOutstanding] = useState<BillOutstanding[]>(() => {
    const saved = localStorage.getItem('vepari_bills_outstanding') || localStorage.getItem('buzzflow_bills_outstanding');
    return saved ? JSON.parse(saved) : INITIAL_BILLS_OUTSTANDING;
  });

  const [archives, setArchives] = useState<FiscalArchive[]>(() => {
    const saved = localStorage.getItem('vepari_archives') || localStorage.getItem('buzzflow_archives');
    return saved ? JSON.parse(saved) : [];
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    const saved = localStorage.getItem('vepari_audit_logs') || localStorage.getItem('buzzflow_audit_logs');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'audit-101',
        companyId: 'comp-101',
        timestamp: new Date(Date.now() - 3600000 * 48).toISOString(),
        action: 'System Initialized',
        module: 'Company',
        details: 'Initial double-entry Chart of Accounts, local currency (INR ₹), and GST framework booted.',
        userRole: 'Administrator / Chief Accountant',
        ipAddress: '192.168.1.10'
      },
      {
        id: 'audit-102',
        companyId: 'comp-101',
        timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
        action: 'Voucher Posted',
        module: 'Accounting',
        details: 'Posted Sales Voucher #SAL-2026-001 for ₹2,36,000 to Reliance Industries Ltd with 18% GST.',
        userRole: 'Staff Accountant',
        ipAddress: '192.168.1.14'
      },
      {
        id: 'audit-103',
        companyId: 'comp-101',
        timestamp: new Date(Date.now() - 3600000 * 6).toISOString(),
        action: 'Ledger Created',
        module: 'Accounting',
        details: 'Created Sundry Debtor Ledger - Infosys Technologies (CUST-4821).',
        userRole: 'Chief Accountant',
        ipAddress: '192.168.1.10'
      }
    ];
  });

  const [pendingVoucherDraft, setPendingVoucherDraft] = useState<Partial<Voucher> | null>(null);
  const [activeTab, setActiveTabState] = useState<string>('vepari-ai');
  const [accountingSubTab, setAccountingSubTab] = useState<AccountingSubTab>('daybook');

  // AI OS System Initialization & Boot state
  const [systemOsState, setSystemOsState] = useState<'offline' | 'initializing' | 'ready'>(
    isCompanyAuthenticated ? 'ready' : 'offline'
  );

  // Auto-initialize AI OS when isCompanyAuthenticated becomes true
  useEffect(() => {
    if (isCompanyAuthenticated) {
      setSystemOsState('initializing');
      setActiveTabState('vepari-ai');
      const timer = setTimeout(() => {
        setSystemOsState('ready');
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      setSystemOsState('offline');
    }
  }, [isCompanyAuthenticated]);

  const rebootOs = () => {
    if (!isCompanyAuthenticated) return;
    setSystemOsState('initializing');
    setActiveTabState('vepari-ai');
    setTimeout(() => {
      setSystemOsState('ready');
    }, 2000);
  };

  // Navigation controller mapping
  const setActiveTab = (tab: string) => {
    const subTabs: AccountingSubTab[] = ['daybook', 'new-voucher', 'billing', 'inventory', 'coa', 'reports', 'tax-brs', 'banking-cash', 'debtors-creditors'];
    if (subTabs.includes(tab as AccountingSubTab)) {
      setActiveTabState('accounting');
      setAccountingSubTab(tab as AccountingSubTab);
    } else {
      setActiveTabState(tab);
    }
  };

  const setLicense = (lic: LicenseInfo) => {
    setLicenseState(lic);
    localStorage.setItem('vepari_license', JSON.stringify(lic));
  };

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('vepari_brand_key', brandKey);
  }, [brandKey]);

  useEffect(() => {
    localStorage.setItem('vepari_companies', JSON.stringify(companies));
  }, [companies]);

  useEffect(() => {
    if (activeCompanyId) {
      localStorage.setItem('vepari_active_company_id', activeCompanyId);
    } else {
      localStorage.removeItem('vepari_active_company_id');
    }
  }, [activeCompanyId]);

  useEffect(() => {
    localStorage.setItem('vepari_company_auth', isCompanyAuthenticated ? 'true' : 'false');
  }, [isCompanyAuthenticated]);

  useEffect(() => {
    localStorage.setItem('vepari_vouchers', JSON.stringify(vouchers));
    const updatedLedgers = recalculateLedgerBalances(ledgers, vouchers);
    setLedgers(updatedLedgers);
    localStorage.setItem('vepari_ledgers', JSON.stringify(updatedLedgers));
  }, [vouchers]);

  useEffect(() => {
    localStorage.setItem('vepari_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('vepari_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('vepari_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('vepari_suppliers', JSON.stringify(suppliers));
  }, [suppliers]);

  useEffect(() => {
    localStorage.setItem('vepari_bills_outstanding', JSON.stringify(billsOutstanding));
  }, [billsOutstanding]);

  useEffect(() => {
    localStorage.setItem('vepari_archives', JSON.stringify(archives));
  }, [archives]);

  useEffect(() => {
    localStorage.setItem('vepari_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  const addAuditLog = (entry: Omit<AuditLogEntry, 'id' | 'timestamp' | 'companyId'>) => {
    const newLog: AuditLogEntry = {
      ...entry,
      id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      companyId: activeCompany?.id || 'comp-101',
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const brand = BRANDS[brandKey] || BRANDS.vepari_ai || BRANDS.buzzflow;

  // Multi-Company Selection & Security 5-Digit PIN Verification
  const selectCompany = (companyId: string) => {
    setActiveCompanyId(companyId);
    setIsCompanyAuthenticated(false);
  };

  const authenticateCompanyPin = (pin: string) => {
    const targetComp = companies.find(c => c.id === activeCompanyId) || activeCompany;
    if (targetComp && targetComp.securityPin === pin) {
      setIsCompanyAuthenticated(true);
      setActiveTabState('vepari-ai');
      return { success: true, message: 'Authentication Successful' };
    }
    return { success: false, message: 'Invalid 5-digit PIN. Please try again.' };
  };

  const exitCompanySession = () => {
    setIsCompanyAuthenticated(false);
  };

  const addCompany = (compData: Omit<Company, 'id' | 'securityPin' | 'lastPinChangedAt' | 'pinChangedQuarters'> & { securityPin: string }) => {
    const newComp: Company = {
      ...compData,
      id: `comp-${Date.now()}`,
      securityPin: compData.securityPin || '12345',
      lastPinChangedAt: new Date().toISOString(),
      pinChangedQuarters: { q1: true, q2: true, q3: true, q4: true }
    };

    setCompanies(prev => [...prev, newComp]);
    setActiveCompanyId(newComp.id);
    setIsCompanyAuthenticated(true);
    setActiveTabState('vepari-ai');
    return newComp;
  };

  const updateCompany = (updated: Partial<Company>) => {
    setCompanies(prev => prev.map(c => c.id === activeCompany.id ? { ...c, ...updated } : c));
    addAuditLog({
      action: 'Company Profile & Tax/Currency Updated',
      module: 'Company',
      details: `Updated profile & tax settings for ${activeCompany.name} (Currency: ${updated.currencySymbol || activeCompany.currencySymbol}, Tax Format: ${updated.regionalTaxFormat || activeCompany.regionalTaxFormat || 'GST'})`,
      userRole: 'Administrator / Chief Accountant'
    });
  };

  const addVoucher = (newVchData: Omit<Voucher, 'id' | 'createdAt'>) => {
    const newVoucher: Voucher = {
      ...newVchData,
      id: `vch-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setVouchers(prev => [newVoucher, ...prev]);
    addAuditLog({
      action: 'Voucher Posted',
      module: 'Accounting',
      details: `Posted ${newVoucher.voucherType.toUpperCase()} Voucher #${newVoucher.voucherNo} for ${activeCompany.currencySymbol}${newVoucher.totalAmount?.toLocaleString() || 0} (${newVoucher.narration || 'General Entry'})`,
      userRole: 'Staff Accountant'
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
    addAuditLog({
      action: 'Ledger Created',
      module: 'Accounting',
      details: `Created new ledger account ${newLedger.name} (${newLedger.groupName})`,
      userRole: 'Chief Accountant'
    });
    return { success: true, ledger: newLedger };
  };

  // Add New Customer Flow with automatic Tally Chart of Accounts Sync
  const addCustomer = (custData: Omit<Customer, 'id'>) => {
    const customerId = `cust-${Date.now()}`;
    const ledgerCode = `CUST-${Math.floor(1000 + Math.random() * 9000)}`;
    
    // Automatically create Sundry Debtors Ledger in Tally Chart of Accounts
    const newLedger: Ledger = {
      id: `led-${customerId}`,
      code: ledgerCode,
      name: `${custData.name} (Sundry Debtor)`,
      groupId: 'grp-sundry-debtors',
      groupName: 'Sundry Debtors',
      category: 'Assets',
      nature: 'debit',
      openingBalance: 0,
      currentBalance: 0,
      gstin: custData.gstin,
      email: custData.email,
      phone: custData.phone
    };

    setLedgers(prev => [...prev, newLedger]);

    const newCustomer: Customer = {
      ...custData,
      id: customerId,
      ledgerId: newLedger.id,
      createdAt: new Date().toISOString()
    };

    setCustomers(prev => [...prev, newCustomer]);
    return { success: true, customer: newCustomer };
  };

  // Add New Supplier Flow with automatic Tally Chart of Accounts Sync
  const addSupplier = (suppData: Omit<Supplier, 'id'>) => {
    const supplierId = `supp-${Date.now()}`;
    const ledgerCode = `SUPP-${Math.floor(1000 + Math.random() * 9000)}`;

    // Automatically create Sundry Creditors Ledger in Tally Chart of Accounts
    const newLedger: Ledger = {
      id: `led-${supplierId}`,
      code: ledgerCode,
      name: `${suppData.name} (Sundry Creditor)`,
      groupId: 'grp-sundry-creditors',
      groupName: 'Sundry Creditors',
      category: 'Liabilities',
      nature: 'credit',
      openingBalance: 0,
      currentBalance: 0,
      gstin: suppData.gstin,
      email: suppData.email,
      phone: suppData.phone
    };

    setLedgers(prev => [...prev, newLedger]);

    const newSupplier: Supplier = {
      ...suppData,
      id: supplierId,
      ledgerId: newLedger.id,
      createdAt: new Date().toISOString()
    };

    setSuppliers(prev => [...prev, newSupplier]);
    return { success: true, supplier: newSupplier };
  };

  const addInventoryItem = (itemData: Omit<InventoryItem, 'id'>) => {
    const newItem: InventoryItem = {
      ...itemData,
      id: `inv-sku-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setInventory(prev => [...prev, newItem]);
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

    return { success: true, invoice: newInvoice };
  };

  const closeFinancialYear = () => {
    const currentFyLabel = `${activeCompany.fyStart.slice(0, 4)}-${activeCompany.fyEnd.slice(0, 4)}`;
    const pnl = generateProfitLossReport(ledgers);

    const archive: FiscalArchive = {
      id: `fy-archive-${Date.now()}`,
      companyId: activeCompany.id,
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

    const currentStartYear = parseInt(activeCompany.fyStart.slice(0, 4), 10);
    const nextStart = `${currentStartYear + 1}-04-01`;
    const nextEnd = `${currentStartYear + 2}-03-31`;

    updateCompany({ fyStart: nextStart, fyEnd: nextEnd });
  };

  // Financial Reports
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
        companies,
        activeCompany,
        company: activeCompany,
        activeCompanyId,
        isCompanyAuthenticated,
        selectCompany,
        authenticateCompanyPin,
        exitCompanySession,
        addCompany,
        updateCompany,
        groups,
        ledgers,
        vouchers,
        inventory,
        invoices,
        customers,
        suppliers,
        billsOutstanding,
        archives,
        auditLogs,
        addAuditLog,
        addVoucher,
        addLedger,
        addCustomer,
        addSupplier,
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
        systemOsState,
        setSystemOsState,
        rebootOs
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
