import { BusinessBriefing } from '../types';

export class BriefingEngine {
  /**
   * Computes a personalized business briefing based on real financial & inventory data.
   */
  public static generateBriefing(
    company: any,
    vouchers: any[],
    ledgers: any[],
    inventory: any[],
    profitLoss: any
  ): BusinessBriefing {
    const ownerName = company.ownerName || 'Business Owner';
    const hour = new Date().getHours();
    let timeOfDay = 'Morning';
    if (hour >= 12 && hour < 17) timeOfDay = 'Afternoon';
    else if (hour >= 17) timeOfDay = 'Evening';

    const greeting = `Good ${timeOfDay}, ${ownerName}.`;

    // Sales calculations
    const salesVouchers = vouchers.filter(v => v.type === 'sales' && !v.isCancelled);
    const totalSales = salesVouchers.reduce((acc, v) => acc + (v.totalAmount || 0), 0);

    // Receivables calculation
    const debtors = ledgers.filter(l => l.groupId === 'grp-debtors');
    const totalReceivable = debtors.reduce((acc, l) => acc + l.currentBalance, 0);

    // Low stock calculation
    const lowStockItems = inventory.filter(i => i.quantity <= i.reorderLevel);

    // Critical Items array
    const criticalItems: string[] = [];
    if (totalReceivable > 0) {
      criticalItems.push(`${debtors.length} debtor customer(s) have unpaid outstanding balances totaling ${company.currencySymbol}${totalReceivable.toLocaleString()}.`);
    }
    if (lowStockItems.length > 0) {
      criticalItems.push(`${lowStockItems.length} inventory SKU(s) (${lowStockItems.map(i => i.name).join(', ')}) crossed reorder levels.`);
    }
    if (criticalItems.length === 0) {
      criticalItems.push(`All accounts are balanced and inventory stock levels are healthy.`);
    }

    // Recommended Action
    let recommendedAction = {
      title: 'Review Debtors Outstanding & Follow Up',
      description: `Follow up on overdue customer receivables of ${company.currencySymbol}${totalReceivable.toLocaleString()} to accelerate cash flow.`,
      targetTab: 'accounting',
      targetSubTab: 'debtors-creditors'
    };

    if (lowStockItems.length > 0 && totalReceivable === 0) {
      recommendedAction = {
        title: 'Restock Low Inventory Items',
        description: `Create purchase draft vouchers for ${lowStockItems.length} items below reorder levels.`,
        targetTab: 'accounting',
        targetSubTab: 'inventory'
      };
    } else if (criticalItems.length === 1 && totalReceivable === 0 && lowStockItems.length === 0) {
      recommendedAction = {
        title: 'Explore MSME Growth Schemes',
        description: 'Check government subsidies and credit guarantee schemes for your business.',
        targetTab: 'schemes',
        targetSubTab: 'overview'
      };
    }

    return {
      greeting,
      ownerName,
      timestamp: new Date().toISOString(),
      summary: `Here is your executive business briefing for ${company.name}: Revenue stands at ${company.currencySymbol}${totalSales.toLocaleString()} with a Net Profit of ${company.currencySymbol}${profitLoss.netProfit.toLocaleString()}.`,
      highlights: [
        {
          label: 'Total Revenue',
          value: `${company.currencySymbol}${totalSales.toLocaleString()}`,
          status: 'positive'
        },
        {
          label: 'Net Profit',
          value: `${company.currencySymbol}${profitLoss.netProfit.toLocaleString()}`,
          status: profitLoss.netProfit >= 0 ? 'positive' : 'negative'
        },
        {
          label: 'Debtors Receivable',
          value: `${company.currencySymbol}${totalReceivable.toLocaleString()}`,
          status: totalReceivable > 50000 ? 'warning' : 'neutral'
        },
        {
          label: 'Low Stock SKUs',
          value: `${lowStockItems.length} Items`,
          status: lowStockItems.length > 0 ? 'warning' : 'positive'
        }
      ],
      criticalItems,
      recommendedAction
    };
  }
}
