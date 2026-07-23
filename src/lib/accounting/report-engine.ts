import { BalanceSheetReport, Ledger, ProfitLossReport, TradingAccountReport, TrialBalanceRow, Voucher } from './types';

/**
 * Computes Trial Balance from current Ledgers.
 */
export function generateTrialBalance(ledgers: Ledger[]): TrialBalanceRow[] {
  return ledgers.map(l => {
    let debitBalance = 0;
    let creditBalance = 0;

    const isDebitNature = l.category === 'Assets' || l.category === 'Expenses';

    if (isDebitNature) {
      if (l.currentBalance >= 0) {
        debitBalance = l.currentBalance;
      } else {
        creditBalance = Math.abs(l.currentBalance);
      }
    } else {
      if (l.currentBalance >= 0) {
        creditBalance = l.currentBalance;
      } else {
        debitBalance = Math.abs(l.currentBalance);
      }
    }

    return {
      ledgerId: l.id,
      ledgerCode: l.code,
      ledgerName: l.name,
      groupName: l.groupName,
      category: l.category,
      debitBalance: Number(debitBalance.toFixed(2)),
      creditBalance: Number(creditBalance.toFixed(2))
    };
  }).filter(r => r.debitBalance > 0 || r.creditBalance > 0);
}

/**
 * Computes Trading Account (Opening Stock, Purchases, Direct Exp vs Sales, Closing Stock)
 */
export function generateTradingAccount(ledgers: Ledger[], stockValuation: number = 0): TradingAccountReport {
  const stockLedger = ledgers.find(l => l.groupId === 'grp-stock' || l.name.toLowerCase().includes('stock'));
  const openingStock = stockLedger ? stockLedger.openingBalance || 0 : 0;

  const purchaseLedgers = ledgers.filter(l => l.category === 'Expenses' && (l.groupId === 'grp-purchase' || l.name.toLowerCase().includes('purchase')));
  const purchases = purchaseLedgers.reduce((sum, l) => sum + l.currentBalance, 0);

  const directExpLedgers = ledgers.filter(l => l.category === 'Expenses' && (l.groupId === 'grp-dir-exp' || l.name.toLowerCase().includes('freight') || l.name.toLowerCase().includes('wages')));
  const directExpenses = directExpLedgers.reduce((sum, l) => sum + l.currentBalance, 0);

  const salesLedgers = ledgers.filter(l => l.category === 'Revenue' && (l.groupId === 'grp-sales' || l.name.toLowerCase().includes('sales')));
  const sales = salesLedgers.reduce((sum, l) => sum + l.currentBalance, 0);

  const closingStock = stockValuation > 0 ? stockValuation : (stockLedger ? stockLedger.currentBalance || 0 : 0);

  const totalCreditSide = sales + closingStock;
  const totalDebitSide = openingStock + purchases + directExpenses;

  const grossProfit = totalCreditSide - totalDebitSide;

  return {
    openingStock,
    purchases,
    directExpenses,
    sales,
    closingStock,
    grossProfit: Math.abs(grossProfit),
    isGrossProfit: grossProfit >= 0
  };
}

/**
 * Computes Profit & Loss Statement from Revenue and Expense ledgers.
 */
export function generateProfitLossReport(ledgers: Ledger[], stockValuation: number = 0): ProfitLossReport {
  const trading = generateTradingAccount(ledgers, stockValuation);
  const grossProfitAmount = trading.isGrossProfit ? trading.grossProfit : -trading.grossProfit;

  const indirectIncomeLedgers = ledgers.filter(l => l.category === 'Revenue' && l.groupId !== 'grp-sales' && !l.name.toLowerCase().includes('sales'));
  const indirectExpenseLedgers = ledgers.filter(l => l.category === 'Expenses' && l.groupId !== 'grp-purchase' && l.groupId !== 'grp-dir-exp' && !l.name.toLowerCase().includes('purchase'));

  const salesLedgers = ledgers.filter(l => l.category === 'Revenue' && (l.groupId === 'grp-sales' || l.name.toLowerCase().includes('sales')));
  const purchaseLedgers = ledgers.filter(l => l.category === 'Expenses' && (l.groupId === 'grp-purchase' || l.name.toLowerCase().includes('purchase')));
  const directExpenseLedgers = ledgers.filter(l => l.category === 'Expenses' && l.groupId === 'grp-dir-exp');

  const operatingRevenueRows = salesLedgers.map(l => ({ ledgerName: l.name, amount: l.currentBalance }));
  const totalRevenue = operatingRevenueRows.reduce((sum, r) => sum + r.amount, 0);

  const costOfGoodsRows = [
    ...purchaseLedgers.map(l => ({ ledgerName: l.name, amount: l.currentBalance })),
    ...directExpenseLedgers.map(l => ({ ledgerName: l.name, amount: l.currentBalance }))
  ];
  const totalCostOfGoods = costOfGoodsRows.reduce((sum, r) => sum + r.amount, 0);

  const indirectIncomeRows = indirectIncomeLedgers.map(l => ({ ledgerName: l.name, amount: l.currentBalance }));
  const totalIndirectIncome = indirectIncomeRows.reduce((sum, r) => sum + r.amount, 0);

  const indirectExpenseRows = indirectExpenseLedgers.map(l => ({ ledgerName: l.name, amount: l.currentBalance }));
  const totalIndirectExpense = indirectExpenseRows.reduce((sum, r) => sum + r.amount, 0);

  const netProfit = grossProfitAmount + totalIndirectIncome - totalIndirectExpense;

  return {
    operatingRevenue: {
      title: 'Operating Revenue (Sales)',
      rows: operatingRevenueRows,
      subtotal: Number(totalRevenue.toFixed(2))
    },
    directExpenses: {
      title: 'Direct Costs & Purchases',
      rows: costOfGoodsRows,
      subtotal: Number(totalCostOfGoods.toFixed(2))
    },
    grossProfit: Number(grossProfitAmount.toFixed(2)),
    indirectIncomes: {
      title: 'Indirect & Other Incomes',
      rows: indirectIncomeRows,
      subtotal: Number(totalIndirectIncome.toFixed(2))
    },
    indirectExpenses: {
      title: 'Indirect & Operating Expenses',
      rows: indirectExpenseRows,
      subtotal: Number(totalIndirectExpense.toFixed(2))
    },
    netProfit: Number(netProfit.toFixed(2)),
    isProfit: netProfit >= 0
  };
}

/**
 * Computes Balance Sheet (ICAI Schedule III format).
 */
export function generateBalanceSheetReport(ledgers: Ledger[], stockValuation: number = 0): BalanceSheetReport {
  const pnl = generateProfitLossReport(ledgers, stockValuation);
  const netProfit = pnl.netProfit;

  // Capital & Liabilities
  const capitalLedgers = ledgers.filter(l => l.category === 'Equity');
  const liabilityLedgers = ledgers.filter(l => l.category === 'Liabilities');

  // Asset Ledgers
  const assetLedgers = ledgers.filter(l => l.category === 'Assets');

  // Group Capital
  const capitalGroup = {
    groupName: 'Shareholders / Owners Capital',
    ledgers: [
      ...capitalLedgers.map(l => ({ ledgerName: l.name, amount: l.currentBalance, nature: l.nature })),
      { ledgerName: 'Reserves & Surplus (Net Profit/Loss)', amount: netProfit, nature: 'credit' as const }
    ],
    groupTotal: capitalLedgers.reduce((sum, l) => sum + l.currentBalance, 0) + netProfit
  };

  // Group Liabilities
  const currentLiabilitiesGroup = {
    groupName: 'Current Liabilities & Payables (Trade Payables, GST/TDS)',
    ledgers: liabilityLedgers.map(l => ({ ledgerName: l.name, amount: l.currentBalance, nature: l.nature })),
    groupTotal: liabilityLedgers.reduce((sum, l) => sum + l.currentBalance, 0)
  };

  const totalCapitalAndLiabilities = capitalGroup.groupTotal + currentLiabilitiesGroup.groupTotal;

  // Group Assets
  const assetsGroup = {
    groupName: 'Non-Current & Current Assets (Bank, Receivables, Stock)',
    ledgers: assetLedgers.map(l => ({ ledgerName: l.name, amount: l.currentBalance, nature: l.nature })),
    groupTotal: assetLedgers.reduce((sum, l) => sum + l.currentBalance, 0)
  };

  const totalAssets = assetsGroup.groupTotal;
  const difference = Math.abs(totalCapitalAndLiabilities - totalAssets);
  const isBalanced = difference < 0.01;

  return {
    capitalAndLiabilities: {
      title: 'EQUITY AND LIABILITIES (ICAI Format)',
      groups: [capitalGroup, currentLiabilitiesGroup],
      total: Number(totalCapitalAndLiabilities.toFixed(2))
    },
    assets: {
      title: 'ASSETS (ICAI Format)',
      groups: [assetsGroup],
      total: Number(totalAssets.toFixed(2))
    },
    isBalanced,
    difference: Number(difference.toFixed(2))
  };
}
