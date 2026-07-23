import { Company, Voucher, InventoryItem, Invoice } from './types';

export const INITIAL_COMPANY: Company = {
  id: 'comp-001',
  name: 'My Enterprise',
  legalName: 'My Enterprise Private Limited',
  fyStart: '2025-04-01',
  fyEnd: '2026-03-31',
  gstin: '',
  currency: 'INR',
  currencySymbol: '₹',
  address: 'Primary Office Address',
  city: 'Mumbai',
  state: 'Maharashtra',
  pinCode: '400001',
  phone: '',
  email: 'admin@enterprise.com',
  industry: 'General Business & Trade',
  securityPin: '12345', // Default 5-digit security PIN
  lastPinChangedAt: new Date().toISOString(),
  pinChangedQuarters: {
    q1: true,
    q2: true,
    q3: true,
    q4: true
  }
};

// Clean empty arrays for production/user entry (No mock vouchers/invoices)
export const INITIAL_VOUCHERS: Voucher[] = [];

export const INITIAL_INVENTORY: InventoryItem[] = [];

export const INITIAL_INVOICES: Invoice[] = [];
