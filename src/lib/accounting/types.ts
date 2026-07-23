/**
 * Core Accounting & Enterprise Data Types
 */

export type AccountCategory = 'Assets' | 'Liabilities' | 'Equity' | 'Revenue' | 'Expenses';

export interface AccountGroup {
  id: string;
  name: string;
  category: AccountCategory;
  nature: 'debit' | 'credit';
  parentId?: string;
  description?: string;
}

export interface Ledger {
  id: string;
  code: string;
  name: string;
  groupId: string;
  groupName: string;
  category: AccountCategory;
  nature: 'debit' | 'credit';
  openingBalance: number;
  currentBalance: number;
  gstin?: string;
  email?: string;
  phone?: string;
  isSystem?: boolean;
}

export type VoucherType = 
  | 'payment'
  | 'receipt'
  | 'contra'
  | 'journal'
  | 'sales'
  | 'purchase'
  | 'credit_note'
  | 'debit_note';

export interface VoucherTypeInfo {
  type: VoucherType;
  label: string;
  shortCode: string;
  description: string;
  badgeBg: string;
  badgeText: string;
  accentBorder: string;
}

export interface VoucherItem {
  id: string;
  ledgerId: string;
  ledgerName?: string;
  drCr: 'Dr' | 'Cr';
  amount: number;
  narration?: string;
}

export interface Voucher {
  id: string;
  voucherNo: string;
  voucherType: VoucherType;
  date: string; // ISO format YYYY-MM-DD
  companyId: string;
  items: VoucherItem[];
  totalAmount: number;
  narration: string;
  status: 'posted' | 'draft' | 'void';
  createdBy?: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  companyId: string;
  name: string;
  tradeName?: string;
  email: string;
  phone: string;
  gstin: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  creditLimit: number;
  paymentTerms: string;
  mostlySupplies?: string;
  currentOutstanding?: number;
  ledgerId?: string;
  createdAt?: string;
}

export interface Supplier {
  id: string;
  companyId: string;
  name: string;
  email: string;
  phone: string;
  gstin: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  supplies: string;
  mostlySupplies?: string;
  currentOutstanding?: number;
  bankName?: string;
  accountNo?: string;
  ifsc?: string;
  creditPeriod?: string;
  ledgerId?: string;
  createdAt?: string;
}

export interface BillOutstanding {
  id: string;
  type: 'receivable' | 'payable';
  partyName: string;
  partyType: 'customer' | 'supplier';
  invoiceNo: string;
  billDate: string;
  dueDate: string;
  amount: number;
  pendingAmount: number;
  daysOverdue: number;
  status: 'Pending' | 'Partially Paid' | 'Overdue' | 'Cleared';
}

export interface ProductionUnit {
  unitName: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
}

export interface UnlockedModules {
  billing: boolean;
  inventory: boolean;
  finance: boolean;
  tax: boolean;
  ai: boolean;
}

export interface Company {
  id: string;
  name: string;
  legalName: string;
  entityType?: string;
  fyStart: string; // YYYY-MM-DD
  fyEnd: string;   // YYYY-MM-DD
  gstin?: string;
  pan?: string;
  tan?: string;
  udyamNo?: string;
  currency: string;
  currencySymbol: string;
  regionalTaxFormat?: 'GST' | 'VAT' | 'Sales Tax' | 'Consumption Tax' | 'Exempt';
  taxRateDefault?: number;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  productionUnit?: ProductionUnit;
  phone: string;
  email: string;
  industry: string;
  unlockedModules?: UnlockedModules;
  // Security 5-Digit PIN & Quarterly rules
  securityPin: string; // 5-digit PIN
  lastPinChangedAt: string; // ISO timestamp
  pinChangedQuarters: {
    q1: boolean;
    q2: boolean;
    q3: boolean;
    q4: boolean;
  };
}

// Inventory Stock Types
export interface InventoryItem {
  id: string;
  companyId: string;
  itemCode: string;
  name: string;
  category: string;
  unit: 'Pcs' | 'Box' | 'Kg' | 'Ltr' | 'Mtr' | 'Units';
  hsnCode: string;
  gstRate: number; // e.g. 0, 5, 12, 18, 28
  costPrice: number;
  sellingPrice: number;
  currentStock: number;
  reorderLevel: number;
  createdAt?: string;
}

// Flexible Billing & Invoicing Types
export interface InvoiceItem {
  id: string;
  itemId?: string;
  itemName: string;
  hsnCode: string;
  qty: number;
  unit: string;
  rate: number;
  discountPct: number;
  gstRate: number;
  taxableAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  total: number;
}

export interface Invoice {
  id: string;
  companyId: string;
  invoiceNo: string;
  customerName: string;
  customerGstin?: string;
  customerAddress?: string;
  invoiceDate: string;
  dueDate?: string;
  items: InvoiceItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  status: 'paid' | 'unpaid' | 'overdue';
  terms?: string;
  voucherId?: string;
  createdAt?: string;
}

// Fiscal Year Archive Record
export interface FiscalArchive {
  id: string;
  companyId: string;
  financialYear: string; // e.g. "2024-2025"
  archivedAt: string;
  openingBalances: Record<string, number>;
  closingBalances: Record<string, number>;
  vouchersSnapshot: Voucher[];
  profitAndLossSummary: {
    grossProfit: number;
    netProfit: number;
    totalRevenue: number;
    totalExpense: number;
  };
}

// BRS (Bank Reconciliation Statement) Types
export interface BRSEntry {
  id: string;
  date: string;
  particulars: string;
  chequeNo?: string;
  type: 'unpresented_issued' | 'uncredited_deposited' | 'bank_charge' | 'direct_credit';
  amount: number;
}

// TDS & Tax Types
export interface TDSEntry {
  id: string;
  section: '194C' | '194J' | '194I' | '194H' | '192';
  deducteeName: string;
  pan: string;
  paymentDate: string;
  grossAmount: number;
  tdsRate: number;
  tdsAmount: number;
  status: 'deducted' | 'deposited';
}

// Financial Report Interfaces
export interface TrialBalanceRow {
  ledgerId: string;
  ledgerCode: string;
  ledgerName: string;
  groupName: string;
  category: AccountCategory;
  debitBalance: number;
  creditBalance: number;
}

export interface ProfitLossSection {
  title: string;
  rows: { ledgerName: string; amount: number }[];
  subtotal: number;
}

export interface ProfitLossReport {
  operatingRevenue: ProfitLossSection;
  directExpenses: ProfitLossSection;
  grossProfit: number;
  indirectIncomes: ProfitLossSection;
  indirectExpenses: ProfitLossSection;
  netProfit: number;
  isProfit: boolean;
}

export interface BalanceSheetSection {
  title: string;
  groups: {
    groupName: string;
    ledgers: { ledgerName: string; amount: number; nature: 'debit' | 'credit' }[];
    groupTotal: number;
  }[];
  total: number;
}

export interface BalanceSheetReport {
  capitalAndLiabilities: BalanceSheetSection;
  assets: BalanceSheetSection;
  isBalanced: boolean;
  difference: number;
}

export interface TradingAccountReport {
  openingStock: number;
  purchases: number;
  directExpenses: number;
  sales: number;
  closingStock: number;
  grossProfit: number;
  isGrossProfit: boolean;
}

export interface DayBookEntry {
  voucher: Voucher;
  ledgerBreakdown: {
    debitLedgers: { name: string; amount: number }[];
    creditLedgers: { name: string; amount: number }[];
  };
}

export interface AuditLogEntry {
  id: string;
  companyId: string;
  timestamp: string; // ISO String
  action: string;
  module: 'Accounting' | 'Billing' | 'Inventory' | 'Company' | 'Finance' | 'Security';
  details: string;
  userRole: string;
  ipAddress?: string;
}

