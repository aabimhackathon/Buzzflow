import { BusinessEvent } from '../types';

export class EventIntelligenceEngine {
  /**
   * Scans company records and returns list of proactive business events/alerts.
   */
  public static detectEvents(
    company: any,
    vouchers: any[],
    ledgers: any[],
    inventory: any[]
  ): BusinessEvent[] {
    const events: BusinessEvent[] = [];
    const companyId = company.id;
    const now = new Date().toISOString();

    // 1. Low Stock Event Detection
    const lowStock = inventory.filter(i => i.quantity <= i.reorderLevel);
    if (lowStock.length > 0) {
      events.push({
        id: `evt-stock-${Date.now()}`,
        companyId,
        type: 'LOW_STOCK',
        title: 'Inventory Reorder Level Alert',
        description: `${lowStock.length} SKU(s) (${lowStock.map(i => i.name).join(', ')}) are below reorder threshold.`,
        severity: 'IMPORTANT',
        timestamp: now,
        read: false,
        actionTarget: 'accounting',
        actionSubTab: 'inventory'
      });
    }

    // 2. Overdue Receivables Event Detection
    const debtors = ledgers.filter(l => l.groupId === 'grp-debtors' && l.currentBalance > 0);
    const totalReceivables = debtors.reduce((sum, d) => sum + d.currentBalance, 0);
    if (totalReceivables > 0) {
      events.push({
        id: `evt-receivable-${Date.now()}`,
        companyId,
        type: 'OVERDUE_RECEIVABLE',
        title: 'Outstanding Customer Receivables',
        description: `Total pending customer dues: ${company.currencySymbol}${totalReceivables.toLocaleString()} across ${debtors.length} debtor account(s).`,
        severity: totalReceivables > 50000 ? 'CRITICAL' : 'IMPORTANT',
        timestamp: now,
        read: false,
        actionTarget: 'accounting',
        actionSubTab: 'debtors-creditors'
      });
    }

    // 3. Government Scheme Opportunity Alert
    events.push({
      id: `evt-scheme-${Date.now()}`,
      companyId,
      type: 'OPPORTUNITY',
      title: 'CGTMSE & PMEGP Government Scheme Matching',
      description: `Eligible for collateral-free MSME credit guarantees up to ₹5 Cr.`,
      severity: 'OPPORTUNITY',
      timestamp: now,
      read: false,
      actionTarget: 'schemes'
    });

    return events;
  }
}
