import { AccountGroup, Ledger, VoucherTypeInfo } from './types';

export const VOUCHER_TYPES: Record<string, VoucherTypeInfo> = {
  payment: {
    type: 'payment',
    label: 'Payment Voucher',
    shortCode: 'PAY',
    description: 'Record outward payments from Bank or Cash accounts to vendors or expense accounts.',
    badgeBg: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300',
    badgeText: 'text-rose-700 dark:text-rose-400',
    accentBorder: 'border-rose-500'
  },
  receipt: {
    type: 'receipt',
    label: 'Receipt Voucher',
    shortCode: 'RCP',
    description: 'Record incoming funds received into Bank or Cash from customers or revenue sources.',
    badgeBg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
    badgeText: 'text-emerald-700 dark:text-emerald-400',
    accentBorder: 'border-emerald-500'
  },
  contra: {
    type: 'contra',
    label: 'Contra Voucher',
    shortCode: 'CTR',
    description: 'Record internal transfers between Cash and Bank accounts or between multiple banks.',
    badgeBg: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
    badgeText: 'text-blue-700 dark:text-blue-400',
    accentBorder: 'border-blue-500'
  },
  journal: {
    type: 'journal',
    label: 'Journal Voucher (JV)',
    shortCode: 'JRN',
    description: 'Record non-cash adjustments, depreciation, accruals, and inter-ledger transfers.',
    badgeBg: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
    badgeText: 'text-amber-700 dark:text-amber-400',
    accentBorder: 'border-amber-500'
  },
  sales: {
    type: 'sales',
    label: 'Sales Voucher / Invoice',
    shortCode: 'SLS',
    description: 'Record sales of goods or services to customers on cash or credit basis.',
    badgeBg: 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300',
    badgeText: 'text-teal-700 dark:text-teal-400',
    accentBorder: 'border-teal-500'
  },
  purchase: {
    type: 'purchase',
    label: 'Purchase Voucher',
    shortCode: 'PUR',
    description: 'Record purchase of raw materials, goods or stock items from suppliers.',
    badgeBg: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300',
    badgeText: 'text-purple-700 dark:text-purple-400',
    accentBorder: 'border-purple-500'
  },
  credit_note: {
    type: 'credit_note',
    label: 'Credit Note (Sales Return)',
    shortCode: 'CRN',
    description: 'Issued to customers for goods returned or price adjustments.',
    badgeBg: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300',
    badgeText: 'text-cyan-700 dark:text-cyan-400',
    accentBorder: 'border-cyan-500'
  },
  debit_note: {
    type: 'debit_note',
    label: 'Debit Note (Purchase Return)',
    shortCode: 'DBN',
    description: 'Issued to vendors when returning goods purchased or seeking debit adjustments.',
    badgeBg: 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300',
    badgeText: 'text-orange-700 dark:text-orange-400',
    accentBorder: 'border-orange-500'
  }
};

export const DEFAULT_GROUPS: AccountGroup[] = [
  // Assets
  { id: 'grp-ca', name: 'Current Assets', category: 'Assets', nature: 'debit' },
  { id: 'grp-cash', name: 'Cash-in-Hand', category: 'Assets', nature: 'debit', parentId: 'grp-ca' },
  { id: 'grp-bank', name: 'Bank Accounts', category: 'Assets', nature: 'debit', parentId: 'grp-ca' },
  { id: 'grp-debtors', name: 'Sundry Debtors (Customers)', category: 'Assets', nature: 'debit', parentId: 'grp-ca' },
  { id: 'grp-inv', name: 'Stock-in-Hand', category: 'Assets', nature: 'debit', parentId: 'grp-ca' },
  { id: 'grp-fa', name: 'Fixed Assets', category: 'Assets', nature: 'debit' },
  { id: 'grp-gst-input', name: 'GST Input Credit', category: 'Assets', nature: 'debit', parentId: 'grp-ca' },

  // Liabilities
  { id: 'grp-cl', name: 'Current Liabilities', category: 'Liabilities', nature: 'credit' },
  { id: 'grp-creditors', name: 'Sundry Creditors (Vendors)', category: 'Liabilities', nature: 'credit', parentId: 'grp-cl' },
  { id: 'grp-duties', name: 'Duties & Taxes (GST/TDS)', category: 'Liabilities', nature: 'credit', parentId: 'grp-cl' },
  { id: 'grp-prov', name: 'Provisions & Accruals', category: 'Liabilities', nature: 'credit', parentId: 'grp-cl' },
  { id: 'grp-loans', name: 'Loans & Borrowings', category: 'Liabilities', nature: 'credit' },

  // Equity
  { id: 'grp-capital', name: 'Capital Account', category: 'Equity', nature: 'credit' },
  { id: 'grp-reserves', name: 'Reserves & Surplus', category: 'Equity', nature: 'credit' },

  // Revenue
  { id: 'grp-sales', name: 'Sales Accounts', category: 'Revenue', nature: 'credit' },
  { id: 'grp-dir-inc', name: 'Direct Incomes', category: 'Revenue', nature: 'credit' },
  { id: 'grp-ind-inc', name: 'Indirect Incomes', category: 'Revenue', nature: 'credit' },

  // Expenses
  { id: 'grp-purchase', name: 'Purchase Accounts', category: 'Expenses', nature: 'debit' },
  { id: 'grp-dir-exp', name: 'Direct Expenses', category: 'Expenses', nature: 'debit' },
  { id: 'grp-ind-exp', name: 'Indirect Expenses', category: 'Expenses', nature: 'debit' }
];

export const DEFAULT_LEDGERS: Ledger[] = [
  // Cash & Bank
  { id: 'led-101', code: '1001', name: 'Main Cash Account', groupId: 'grp-cash', groupName: 'Cash-in-Hand', category: 'Assets', nature: 'debit', openingBalance: 25000, currentBalance: 25000, isSystem: true },
  { id: 'led-102', code: '1002', name: 'HDFC Bank Corporate Account', groupId: 'grp-bank', groupName: 'Bank Accounts', category: 'Assets', nature: 'debit', openingBalance: 185000, currentBalance: 185000, isSystem: true },
  { id: 'led-103', code: '1003', name: 'ICICI Current Account', groupId: 'grp-bank', groupName: 'Bank Accounts', category: 'Assets', nature: 'debit', openingBalance: 45000, currentBalance: 45000, isSystem: true },
  { id: 'led-104', code: '1004', name: 'Petty Cash Fund', groupId: 'grp-cash', groupName: 'Cash-in-Hand', category: 'Assets', nature: 'debit', openingBalance: 5000, currentBalance: 5000 },

  // Debtors (Customers)
  { id: 'led-201', code: '2001', name: 'Apex Traders (Customer)', groupId: 'grp-debtors', groupName: 'Sundry Debtors', category: 'Assets', nature: 'debit', openingBalance: 32000, currentBalance: 32000, gstin: '27AAAAA0000A1Z5' },
  { id: 'led-202', code: '2002', name: 'Global Retail Corp', groupId: 'grp-debtors', groupName: 'Sundry Debtors', category: 'Assets', nature: 'debit', openingBalance: 18400, currentBalance: 18400, gstin: '27BBBCA1111B2Z3' },
  { id: 'led-203', code: '2003', name: 'Zenith Tech Solutions', groupId: 'grp-debtors', groupName: 'Sundry Debtors', category: 'Assets', nature: 'debit', openingBalance: 0, currentBalance: 0, gstin: '33CCCCA2222C3Z1' },

  // Creditors (Vendors)
  { id: 'led-301', code: '3001', name: 'Alpha Industrial Suppliers', groupId: 'grp-creditors', groupName: 'Sundry Creditors', category: 'Liabilities', nature: 'credit', openingBalance: 28000, currentBalance: 28000, gstin: '27DDDDD3333D4Z2' },
  { id: 'led-302', code: '3002', name: 'Orion Logistics Ltd', groupId: 'grp-creditors', groupName: 'Sundry Creditors', category: 'Liabilities', nature: 'credit', openingBalance: 12500, currentBalance: 12500, gstin: '27EEEEE4444E5Z9' },
  { id: 'led-303', code: '3003', name: 'Prime Cloud Services', groupId: 'grp-creditors', groupName: 'Sundry Creditors', category: 'Liabilities', nature: 'credit', openingBalance: 0, currentBalance: 0 },

  // Capital
  { id: 'led-401', code: '4001', name: 'Owner Capital Account', groupId: 'grp-capital', groupName: 'Capital Account', category: 'Equity', nature: 'credit', openingBalance: 250000, currentBalance: 250000, isSystem: true },
  { id: 'led-402', code: '4002', name: 'Owner Drawings', groupId: 'grp-capital', groupName: 'Capital Account', category: 'Equity', nature: 'debit', openingBalance: 0, currentBalance: 0 },

  // Revenue
  { id: 'led-501', code: '5001', name: 'General Product Sales', groupId: 'grp-sales', groupName: 'Sales Accounts', category: 'Revenue', nature: 'credit', openingBalance: 0, currentBalance: 0, isSystem: true },
  { id: 'led-502', code: '5002', name: 'Consulting & Service Income', groupId: 'grp-sales', groupName: 'Sales Accounts', category: 'Revenue', nature: 'credit', openingBalance: 0, currentBalance: 0 },
  { id: 'led-503', code: '5003', name: 'Sales Return & Allowance', groupId: 'grp-sales', groupName: 'Sales Accounts', category: 'Revenue', nature: 'debit', openingBalance: 0, currentBalance: 0 },
  { id: 'led-504', code: '5004', name: 'Interest Received', groupId: 'grp-ind-inc', groupName: 'Indirect Incomes', category: 'Revenue', nature: 'credit', openingBalance: 0, currentBalance: 0 },

  // Purchases
  { id: 'led-601', code: '6001', name: 'Raw Material Purchases', groupId: 'grp-purchase', groupName: 'Purchase Accounts', category: 'Expenses', nature: 'debit', openingBalance: 0, currentBalance: 0, isSystem: true },
  { id: 'led-602', code: '6002', name: 'Stock Purchases (18% GST)', groupId: 'grp-purchase', groupName: 'Purchase Accounts', category: 'Expenses', nature: 'debit', openingBalance: 0, currentBalance: 0 },
  { id: 'led-603', code: '6003', name: 'Purchase Return', groupId: 'grp-purchase', groupName: 'Purchase Accounts', category: 'Expenses', nature: 'credit', openingBalance: 0, currentBalance: 0 },

  // Duties & Taxes
  { id: 'led-701', code: '7001', name: 'CGST Payable (9%)', groupId: 'grp-duties', groupName: 'Duties & Taxes', category: 'Liabilities', nature: 'credit', openingBalance: 0, currentBalance: 0 },
  { id: 'led-702', code: '7002', name: 'SGST Payable (9%)', groupId: 'grp-duties', groupName: 'Duties & Taxes', category: 'Liabilities', nature: 'credit', openingBalance: 0, currentBalance: 0 },
  { id: 'led-703', code: '7003', name: 'IGST Payable (18%)', groupId: 'grp-duties', groupName: 'Duties & Taxes', category: 'Liabilities', nature: 'credit', openingBalance: 0, currentBalance: 0 },
  { id: 'led-704', code: '7004', name: 'CGST Input Credit', groupId: 'grp-gst-input', groupName: 'GST Input Credit', category: 'Assets', nature: 'debit', openingBalance: 0, currentBalance: 0 },
  { id: 'led-705', code: '7005', name: 'SGST Input Credit', groupId: 'grp-gst-input', groupName: 'GST Input Credit', category: 'Assets', nature: 'debit', openingBalance: 0, currentBalance: 0 },

  // Expenses
  { id: 'led-801', code: '8001', name: 'Office Rent Expense', groupId: 'grp-ind-exp', groupName: 'Indirect Expenses', category: 'Expenses', nature: 'debit', openingBalance: 0, currentBalance: 0 },
  { id: 'led-802', code: '8002', name: 'Salaries & Wages', groupId: 'grp-ind-exp', groupName: 'Indirect Expenses', category: 'Expenses', nature: 'debit', openingBalance: 0, currentBalance: 0 },
  { id: 'led-803', code: '8003', name: 'Electricity & Utilities', groupId: 'grp-ind-exp', groupName: 'Indirect Expenses', category: 'Expenses', nature: 'debit', openingBalance: 0, currentBalance: 0 },
  { id: 'led-804', code: '8004', name: 'Software & Cloud Infrastructure', groupId: 'grp-ind-exp', groupName: 'Indirect Expenses', category: 'Expenses', nature: 'debit', openingBalance: 0, currentBalance: 0 },
  { id: 'led-805', code: '8005', name: 'Marketing & Digital Ads', groupId: 'grp-ind-exp', groupName: 'Indirect Expenses', category: 'Expenses', nature: 'debit', openingBalance: 0, currentBalance: 0 },
  { id: 'led-806', code: '8006', name: 'Freight & Transportation', groupId: 'grp-dir-exp', groupName: 'Direct Expenses', category: 'Expenses', nature: 'debit', openingBalance: 0, currentBalance: 0 },
  { id: 'led-807', code: '8007', name: 'Bank Charges & Fees', groupId: 'grp-ind-exp', groupName: 'Indirect Expenses', category: 'Expenses', nature: 'debit', openingBalance: 0, currentBalance: 0 }
];
