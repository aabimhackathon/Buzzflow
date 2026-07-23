import { Company, Voucher, InventoryItem, Invoice, Customer, Supplier, BillOutstanding } from './types';

export const INITIAL_COMPANY: Company = {
  id: 'comp-001',
  name: 'My Enterprise',
  legalName: 'My Enterprise Private Limited',
  entityType: 'Private Limited Company',
  fyStart: '2025-04-01',
  fyEnd: '2026-03-31',
  gstin: '27AABCU9603R1ZN',
  pan: 'AABCU9603R',
  tan: 'MUMB12345E',
  udyamNo: 'UDYAM-MH-01-0012345',
  currency: 'INR',
  currencySymbol: '₹',
  address: 'Suite 402, Trade Tower, Bandra Kurla Complex',
  city: 'Mumbai',
  state: 'Maharashtra',
  pinCode: '400051',
  productionUnit: {
    unitName: 'Unit-1 Industrial Plant',
    address: 'Plot 45, MIDC Industrial Area, Thane West',
    city: 'Thane',
    state: 'Maharashtra',
    pinCode: '400604'
  },
  phone: '+91 98765 43210',
  email: 'admin@enterprise.com',
  industry: 'Manufacturing & Engineering',
  unlockedModules: {
    billing: true,
    inventory: true,
    finance: true,
    tax: true,
    ai: true
  },
  securityPin: '12345', // Default 5-digit security PIN
  lastPinChangedAt: new Date().toISOString(),
  pinChangedQuarters: {
    q1: true,
    q2: true,
    q3: true,
    q4: true
  }
};

export const INITIAL_COMPANIES: Company[] = [
  INITIAL_COMPANY,
  {
    id: 'comp-002',
    name: 'Apex Logistics',
    legalName: 'Apex Logistics LLP',
    entityType: 'Limited Liability Partnership (LLP)',
    fyStart: '2025-04-01',
    fyEnd: '2026-03-31',
    gstin: '33AAFFA1234B1Z2',
    pan: 'AAFFA1234B',
    tan: 'CHEE98765F',
    udyamNo: 'UDYAM-TN-02-0098765',
    currency: 'INR',
    currencySymbol: '₹',
    address: '12 Freight Hub, Guindy Industrial Estate',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pinCode: '600032',
    phone: '+91 98400 12345',
    email: 'ops@apexlogistics.in',
    industry: 'Logistics & Supply Chain',
    unlockedModules: {
      billing: true,
      inventory: true,
      finance: true,
      tax: true,
      ai: true
    },
    securityPin: '54321',
    lastPinChangedAt: new Date().toISOString(),
    pinChangedQuarters: { q1: true, q2: true, q3: true, q4: true }
  },
  {
    id: 'comp-003',
    name: 'Southern Tech',
    legalName: 'Southern Tech Solutions Pvt Ltd',
    entityType: 'Private Limited Company',
    fyStart: '2025-04-01',
    fyEnd: '2026-03-31',
    gstin: '29AABCS5678D1Z8',
    pan: 'AABCS5678D',
    tan: 'BLRS12345G',
    udyamNo: 'UDYAM-KA-03-0054321',
    currency: 'INR',
    currencySymbol: '₹',
    address: '88 Cyber Park, Electronic City Phase 1',
    city: 'Bengaluru',
    state: 'Karnataka',
    pinCode: '560100',
    phone: '+91 99000 88776',
    email: 'accounts@southerntech.com',
    industry: 'Information Technology',
    unlockedModules: {
      billing: true,
      inventory: false,
      finance: true,
      tax: true,
      ai: true
    },
    securityPin: '11111',
    lastPinChangedAt: new Date().toISOString(),
    pinChangedQuarters: { q1: true, q2: true, q3: true, q4: true }
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-101',
    companyId: 'comp-001',
    name: 'Apex Traders',
    tradeName: 'Apex Retail Store',
    email: 'billing@apextraders.com',
    phone: '+91 98200 11223',
    gstin: '27AAACA1234A1Z1',
    address: 'Commercial Complex, Sector 17',
    city: 'Vashi',
    state: 'Maharashtra',
    pinCode: '400703',
    creditLimit: 500000,
    paymentTerms: 'Net 30',
    ledgerId: 'led-debtors-apex'
  },
  {
    id: 'cust-102',
    companyId: 'comp-001',
    name: 'Global Infra Tech',
    tradeName: 'Global Infra',
    email: 'accounts@globalinfra.co',
    phone: '+91 98200 44556',
    gstin: '27AABCG5678H1Z9',
    address: 'Plot 89, Tech Park, Powai',
    city: 'Mumbai',
    state: 'Maharashtra',
    pinCode: '400076',
    creditLimit: 1000000,
    paymentTerms: 'Net 45',
    ledgerId: 'led-debtors-global'
  }
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'supp-201',
    companyId: 'comp-001',
    name: 'National Steel Corp',
    email: 'sales@nationalsteel.com',
    phone: '+91 98111 22334',
    gstin: '27AABCN9988C1Z4',
    address: 'Industrial Area Phase 2',
    city: 'Pune',
    state: 'Maharashtra',
    pinCode: '411018',
    supplies: 'Steel Sheets & Industrial Hardware',
    bankName: 'HDFC Bank',
    accountNo: '50200012345678',
    ifsc: 'HDFC0000123',
    creditPeriod: '30 Days',
    ledgerId: 'led-creditors-national'
  },
  {
    id: 'supp-202',
    companyId: 'comp-001',
    name: 'Reliance Polymer Suppliers',
    email: 'orders@reliancepolymers.com',
    phone: '+91 98111 99887',
    gstin: '27AABCR8877K1Z0',
    address: 'RIL Complex, Jamnagar Road',
    city: 'Thane',
    state: 'Maharashtra',
    pinCode: '400601',
    supplies: 'Raw Plastics & Industrial Granules',
    bankName: 'ICICI Bank',
    accountNo: '000405001234',
    ifsc: 'ICIC0000004',
    creditPeriod: '15 Days',
    ledgerId: 'led-creditors-reliance'
  }
];

export const INITIAL_BILLS_OUTSTANDING: BillOutstanding[] = [
  {
    id: 'bill-301',
    type: 'receivable',
    partyName: 'Apex Traders',
    partyType: 'customer',
    invoiceNo: 'INV-2025-001',
    billDate: '2025-04-10',
    dueDate: '2025-05-10',
    amount: 118000,
    pendingAmount: 118000,
    daysOverdue: 14,
    status: 'Overdue'
  },
  {
    id: 'bill-302',
    type: 'receivable',
    partyName: 'Global Infra Tech',
    partyType: 'customer',
    invoiceNo: 'INV-2025-004',
    billDate: '2025-05-01',
    dueDate: '2025-06-15',
    amount: 250000,
    pendingAmount: 250000,
    daysOverdue: 0,
    status: 'Pending'
  },
  {
    id: 'bill-303',
    type: 'payable',
    partyName: 'National Steel Corp',
    partyType: 'supplier',
    invoiceNo: 'NSC/24-25/998',
    billDate: '2025-04-05',
    dueDate: '2025-05-05',
    amount: 85000,
    pendingAmount: 85000,
    daysOverdue: 19,
    status: 'Overdue'
  },
  {
    id: 'bill-304',
    type: 'payable',
    partyName: 'Reliance Polymer Suppliers',
    partyType: 'supplier',
    invoiceNo: 'RPL/8892',
    billDate: '2025-05-12',
    dueDate: '2025-05-27',
    amount: 142000,
    pendingAmount: 142000,
    daysOverdue: 0,
    status: 'Pending'
  }
];

// Clean empty arrays for production/user entry (No mock vouchers/invoices)
export const INITIAL_VOUCHERS: Voucher[] = [];

export const INITIAL_INVENTORY: InventoryItem[] = [];

export const INITIAL_INVOICES: Invoice[] = [];

