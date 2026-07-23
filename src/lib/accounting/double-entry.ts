import { Ledger, Voucher, VoucherItem } from './types';

export interface ValidationResult {
  isValid: boolean;
  debitTotal: number;
  creditTotal: number;
  difference: number;
  errors: string[];
}

/**
 * Validates a double-entry voucher before posting.
 * Enforces Dr = Cr, non-zero amounts, at least 2 line items, and valid ledgers.
 */
export function validateVoucher(items: VoucherItem[], ledgers: Ledger[]): ValidationResult {
  const errors: string[] = [];
  
  if (!items || items.length < 2) {
    errors.push('A valid double-entry voucher must contain at least 2 line items (at least 1 Debit and 1 Credit).');
  }

  let debitTotal = 0;
  let creditTotal = 0;

  items.forEach((item, index) => {
    if (!item.ledgerId) {
      errors.push(`Line item #${index + 1} has no account/ledger selected.`);
    } else {
      const exists = ledgers.some(l => l.id === item.ledgerId);
      if (!exists) {
        errors.push(`Line item #${index + 1} references an invalid or missing ledger.`);
      }
    }

    if (!item.amount || item.amount <= 0) {
      errors.push(`Line item #${index + 1} amount must be greater than zero.`);
    } else {
      if (item.drCr === 'Dr') {
        debitTotal += item.amount;
      } else if (item.drCr === 'Cr') {
        creditTotal += item.amount;
      }
    }
  });

  // Calculate difference
  const difference = Math.abs(debitTotal - creditTotal);
  // Rounding check for floating point issues
  const isBalanced = Math.abs(debitTotal - creditTotal) < 0.001 && debitTotal > 0;

  if (!isBalanced) {
    if (debitTotal === 0 && creditTotal === 0) {
      errors.push('Voucher totals cannot be zero.');
    } else {
      errors.push(`Double-Entry Imbalance: Debit total (${debitTotal.toFixed(2)}) does not equal Credit total (${creditTotal.toFixed(2)}). Difference: ${difference.toFixed(2)}`);
    }
  }

  return {
    isValid: errors.length === 0 && isBalanced,
    debitTotal: Number(debitTotal.toFixed(2)),
    creditTotal: Number(creditTotal.toFixed(2)),
    difference: Number(difference.toFixed(2)),
    errors
  };
}

/**
 * Re-calculates updated balances for all ledgers based on opening balances and posted vouchers.
 */
export function recalculateLedgerBalances(ledgers: Ledger[], vouchers: Voucher[]): Ledger[] {
  const ledgerMap = new Map<string, Ledger>();
  
  // Clone original ledgers with reset currentBalance = openingBalance
  ledgers.forEach(l => {
    ledgerMap.set(l.id, {
      ...l,
      currentBalance: l.openingBalance
    });
  });

  // Filter posted vouchers
  const postedVouchers = vouchers.filter(v => v.status === 'posted');

  postedVouchers.forEach(v => {
    v.items.forEach(item => {
      const ledger = ledgerMap.get(item.ledgerId);
      if (ledger) {
        // Accounting Rule:
        // Asset & Expense: Dr increases (+), Cr decreases (-)
        // Liability, Equity & Revenue: Cr increases (+), Dr decreases (-)
        const isDebitNature = ledger.category === 'Assets' || ledger.category === 'Expenses';

        if (isDebitNature) {
          if (item.drCr === 'Dr') {
            ledger.currentBalance += item.amount;
          } else {
            ledger.currentBalance -= item.amount;
          }
        } else {
          // Liability / Equity / Revenue
          if (item.drCr === 'Cr') {
            ledger.currentBalance += item.amount;
          } else {
            ledger.currentBalance -= item.amount;
          }
        }
      }
    });
  });

  return Array.from(ledgerMap.values());
}

/**
 * Generates an automated voucher number based on type and existing count.
 */
export function generateVoucherNumber(type: string, existingVouchers: Voucher[]): string {
  const prefix = type.toUpperCase().slice(0, 3);
  const count = existingVouchers.filter(v => v.voucherType === type).length + 1;
  const numStr = String(count).padStart(4, '0');
  const year = new Date().getFullYear().toString().slice(-2);
  return `${prefix}-${year}-${numStr}`;
}
