import { Ledger, Voucher, VoucherItem } from './types';

export interface ValidationResult {
  isValid: boolean;
  debitTotal: number;
  creditTotal: number;
  difference: number;
  errors: string[];
  conflictingItemIds: Set<string>;
  itemConflicts: Record<string, string[]>;
}

/**
 * Validates a double-entry voucher before posting.
 * Enforces Dr = Cr, non-zero amounts, at least 2 line items, valid ledgers, and detects account conflicts.
 */
export function validateVoucher(items: VoucherItem[], ledgers: Ledger[]): ValidationResult {
  const errors: string[] = [];
  const conflictingItemIds = new Set<string>();
  const itemConflicts: Record<string, string[]> = {};

  const addConflict = (id: string, reason: string) => {
    conflictingItemIds.add(id);
    if (!itemConflicts[id]) {
      itemConflicts[id] = [];
    }
    if (!itemConflicts[id].includes(reason)) {
      itemConflicts[id].push(reason);
    }
  };

  if (!items || items.length < 2) {
    errors.push('A valid double-entry voucher must contain at least 2 line items (at least 1 Debit and 1 Credit).');
  }

  let debitTotal = 0;
  let creditTotal = 0;
  let hasDebit = false;
  let hasCredit = false;

  // Track ledger usages to detect conflicts
  const ledgerCounts: Record<string, { dr: string[]; cr: string[] }> = {};

  items.forEach((item, index) => {
    const itemKey = item.id || `item-${index}`;

    if (!item.ledgerId) {
      errors.push(`Line item #${index + 1} has no account/ledger selected.`);
      addConflict(itemKey, 'Account selection missing');
    } else {
      const exists = ledgers.some(l => l.id === item.ledgerId);
      if (!exists) {
        errors.push(`Line item #${index + 1} references an invalid or missing ledger.`);
        addConflict(itemKey, 'Invalid ledger reference');
      } else {
        if (!ledgerCounts[item.ledgerId]) {
          ledgerCounts[item.ledgerId] = { dr: [], cr: [] };
        }
        if (item.drCr === 'Dr') {
          ledgerCounts[item.ledgerId].dr.push(itemKey);
        } else {
          ledgerCounts[item.ledgerId].cr.push(itemKey);
        }
      }
    }

    if (!item.amount || item.amount <= 0) {
      errors.push(`Line item #${index + 1} amount must be greater than zero.`);
      addConflict(itemKey, 'Amount must be > 0');
    } else {
      if (item.drCr === 'Dr') {
        debitTotal += item.amount;
        hasDebit = true;
      } else if (item.drCr === 'Cr') {
        creditTotal += item.amount;
        hasCredit = true;
      }
    }
  });

  // Check for duplicate account / circular entry conflicts
  Object.entries(ledgerCounts).forEach(([ledgerId, usage]) => {
    const ledger = ledgers.find(l => l.id === ledgerId);
    const name = ledger ? ledger.name : 'Account';

    if (usage.dr.length > 1) {
      errors.push(`Conflicting input: Account "${name}" selected multiple times on Debit side.`);
      usage.dr.forEach(id => addConflict(id, `Duplicate account on Debit side (${name})`));
    }
    if (usage.cr.length > 1) {
      errors.push(`Conflicting input: Account "${name}" selected multiple times on Credit side.`);
      usage.cr.forEach(id => addConflict(id, `Duplicate account on Credit side (${name})`));
    }
    if (usage.dr.length > 0 && usage.cr.length > 0) {
      errors.push(`Conflicting double-entry: Account "${name}" selected on BOTH Debit and Credit sides (circular self-balancing conflict).`);
      usage.dr.concat(usage.cr).forEach(id => addConflict(id, `Circular entry conflict: "${name}" used on both Dr & Cr`));
    }
  });

  if (!hasDebit) {
    errors.push('Voucher is missing a Debit line item.');
  }
  if (!hasCredit) {
    errors.push('Voucher is missing a Credit line item.');
  }

  // Calculate difference
  const difference = Math.abs(debitTotal - creditTotal);
  const isBalanced = Math.abs(debitTotal - creditTotal) < 0.001 && debitTotal > 0 && hasDebit && hasCredit;

  if (!isBalanced) {
    if (debitTotal === 0 && creditTotal === 0) {
      errors.push('Voucher totals cannot be zero.');
    } else {
      errors.push(`Double-Entry Imbalance: Total Debit (${debitTotal.toFixed(2)}) does not equal Total Credit (${creditTotal.toFixed(2)}). Difference: ${difference.toFixed(2)}`);
    }
  }

  return {
    isValid: errors.length === 0 && isBalanced && conflictingItemIds.size === 0,
    debitTotal: Number(debitTotal.toFixed(2)),
    creditTotal: Number(creditTotal.toFixed(2)),
    difference: Number(difference.toFixed(2)),
    errors,
    conflictingItemIds,
    itemConflicts
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
