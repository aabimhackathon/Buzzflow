import { ToolDefinition, ToolExecutionResult } from '../types';
import { MemoryEngineService } from '../memory/MemoryEngineService';

export class ToolRegistry {
  /**
   * Returns list of available tool definitions for the model context.
   */
  public static getToolDefinitions(): ToolDefinition[] {
    return [
      {
        name: 'getSales',
        description: 'Retrieves sales invoices, total revenue, and sales growth data for the current company.',
        category: 'accounting',
        safetyLevel: 'READ',
        parameters: {
          period: { type: 'string', description: 'Period: today, month, or total' }
        }
      },
      {
        name: 'getExpenses',
        description: 'Retrieves total operating expenses and expense ledgers.',
        category: 'accounting',
        safetyLevel: 'READ',
        parameters: {
          period: { type: 'string', description: 'Period: today, month, or total' }
        }
      },
      {
        name: 'getProfit',
        description: 'Retrieves Profit & Loss summary including Gross Profit and Net Profit.',
        category: 'reports',
        safetyLevel: 'READ',
        parameters: {}
      },
      {
        name: 'getInventory',
        description: 'Retrieves product inventory list, stock levels, and valuations.',
        category: 'inventory',
        safetyLevel: 'READ',
        parameters: {}
      },
      {
        name: 'getLowStock',
        description: 'Retrieves products that have fallen below their reorder level.',
        category: 'inventory',
        safetyLevel: 'READ',
        parameters: {}
      },
      {
        name: 'getCustomers',
        description: 'Retrieves list of customers and debtor balances.',
        category: 'customer',
        safetyLevel: 'READ',
        parameters: {}
      },
      {
        name: 'getOutstandingReceivables',
        description: 'Retrieves customers with unpaid outstanding invoices.',
        category: 'customer',
        safetyLevel: 'READ',
        parameters: {}
      },
      {
        name: 'getSuppliers',
        description: 'Retrieves list of suppliers and creditor balances.',
        category: 'supplier',
        safetyLevel: 'READ',
        parameters: {}
      },
      {
        name: 'getOutstandingPayables',
        description: 'Retrieves supplier bills and outstanding payables.',
        category: 'supplier',
        safetyLevel: 'READ',
        parameters: {}
      },
      {
        name: 'createVoucherDraft',
        description: 'Creates a real double-entry draft voucher for sales, payment, receipt, or journal entries.',
        category: 'accounting',
        safetyLevel: 'DRAFT',
        parameters: {
          voucherType: { type: 'string', description: 'Type: sales, payment, receipt, purchase, or journal', required: true },
          narration: { type: 'string', description: 'Transaction narration description', required: true },
          amount: { type: 'number', description: 'Total transaction amount', required: true },
          drLedgerName: { type: 'string', description: 'Debit ledger name', required: true },
          crLedgerName: { type: 'string', description: 'Credit ledger name', required: true }
        }
      },
      {
        name: 'postVoucher',
        description: 'Posts a draft voucher into the official double-entry ledger database. Requires explicit confirmation.',
        category: 'accounting',
        safetyLevel: 'SENSITIVE',
        parameters: {
          voucherType: { type: 'string', description: 'Type of voucher', required: true },
          narration: { type: 'string', description: 'Narration', required: true },
          items: { type: 'array', description: 'Debit and credit items array', required: true }
        }
      },
      {
        name: 'saveBusinessMemory',
        description: 'Saves important business rules, preferences, customer notes, or supplier instructions into persistent memory.',
        category: 'memory',
        safetyLevel: 'DRAFT',
        parameters: {
          category: { type: 'string', description: 'Category: OWNER_MEMORY, PREFERENCES, BUSINESS_RULES, CUSTOMER_MEMORY, SUPPLIER_MEMORY', required: true },
          subject: { type: 'string', description: 'Memory title / subject', required: true },
          content: { type: 'string', description: 'Detailed memory note', required: true },
          tags: { type: 'array', description: 'Search keywords / tags' }
        }
      },
      {
        name: 'navigateTo',
        description: 'Navigates the user interface directly to a specific view tab or accounting section.',
        category: 'navigation',
        safetyLevel: 'READ',
        parameters: {
          tab: { type: 'string', description: 'Main tab: dashboard, accounting, billing, finance, memory, intelligence, schemes, company', required: true },
          subTab: { type: 'string', description: 'Accounting subtab: daybook, new-voucher, banking-cash, debtors-creditors, billing, inventory, coa, reports, tax-brs' }
        }
      }
    ];
  }

  /**
   * Executes a tool with context and application actions.
   */
  public static async executeTool(
    toolName: string,
    args: Record<string, any>,
    appContext: {
      company: any;
      vouchers: any[];
      ledgers: any[];
      inventory: any[];
      invoices: any[];
      customers: any[];
      suppliers: any[];
      profitLoss: any;
      balanceSheet: any;
      addVoucher: (v: any) => any;
      setActiveTab: (tab: string) => void;
      setAccountingSubTab: (subTab: any) => void;
      setPendingVoucherDraft: (draft: any) => void;
    }
  ): Promise<ToolExecutionResult> {
    const { company, vouchers, ledgers, inventory, invoices, customers, suppliers, profitLoss, balanceSheet, addVoucher, setActiveTab, setAccountingSubTab, setPendingVoucherDraft } = appContext;

    switch (toolName) {
      case 'getSales': {
        const salesVouchers = vouchers.filter(v => v.type === 'sales' && !v.isCancelled);
        const totalSales = salesVouchers.reduce((acc, v) => acc + (v.totalAmount || 0), 0);
        return {
          toolName,
          success: true,
          data: {
            salesCount: salesVouchers.length,
            totalSales,
            currency: company.currencySymbol,
            invoices: invoices.slice(0, 5)
          },
          message: `Total sales recorded for ${company.name}: ${company.currencySymbol}${totalSales.toLocaleString()} across ${salesVouchers.length} transactions.`
        };
      }

      case 'getExpenses': {
        const expenseLedgers = ledgers.filter(l => l.groupId === 'grp-direct-expenses' || l.groupId === 'grp-indirect-expenses');
        const totalExpenses = expenseLedgers.reduce((acc, l) => acc + l.currentBalance, 0);
        return {
          toolName,
          success: true,
          data: {
            totalExpenses,
            breakdown: expenseLedgers.map(l => ({ name: l.name, balance: l.currentBalance }))
          },
          message: `Total operating expenses: ${company.currencySymbol}${totalExpenses.toLocaleString()}.`
        };
      }

      case 'getProfit': {
        return {
          toolName,
          success: true,
          data: {
            netProfit: profitLoss.netProfit,
            grossProfit: profitLoss.grossProfit,
            totalRevenue: profitLoss.totalRevenue,
            totalExpenses: profitLoss.totalExpenses
          },
          message: `Net Profit: ${company.currencySymbol}${profitLoss.netProfit.toLocaleString()} (Gross Profit: ${company.currencySymbol}${profitLoss.grossProfit.toLocaleString()}).`
        };
      }

      case 'getInventory': {
        return {
          toolName,
          success: true,
          data: {
            itemsCount: inventory.length,
            items: inventory.map(i => ({
              name: i.name,
              sku: i.sku,
              quantity: i.quantity,
              unit: i.unit,
              rate: i.sellingPrice,
              stockValue: i.quantity * i.purchasePrice,
              reorderLevel: i.reorderLevel
            }))
          },
          message: `Retrieved ${inventory.length} inventory SKUs.`
        };
      }

      case 'getLowStock': {
        const lowStockItems = inventory.filter(i => i.quantity <= i.reorderLevel);
        return {
          toolName,
          success: true,
          data: {
            lowStockCount: lowStockItems.length,
            items: lowStockItems
          },
          message: lowStockItems.length > 0 
            ? `Found ${lowStockItems.length} item(s) running below reorder level: ${lowStockItems.map(i => i.name).join(', ')}.`
            : `All inventory levels are healthy above reorder thresholds.`
        };
      }

      case 'getCustomers':
      case 'getOutstandingReceivables': {
        const debtors = ledgers.filter(l => l.groupId === 'grp-debtors');
        const totalReceivable = debtors.reduce((acc, l) => acc + l.currentBalance, 0);
        return {
          toolName,
          success: true,
          data: {
            totalReceivable,
            customers: debtors.map(d => ({ name: d.name, outstanding: d.currentBalance }))
          },
          message: `Total outstanding receivables from debtors: ${company.currencySymbol}${totalReceivable.toLocaleString()}.`
        };
      }

      case 'getSuppliers':
      case 'getOutstandingPayables': {
        const creditors = ledgers.filter(l => l.groupId === 'grp-creditors');
        const totalPayable = creditors.reduce((acc, l) => acc + l.currentBalance, 0);
        return {
          toolName,
          success: true,
          data: {
            totalPayable,
            suppliers: creditors.map(c => ({ name: c.name, outstanding: c.currentBalance }))
          },
          message: `Total outstanding payables to suppliers: ${company.currencySymbol}${totalPayable.toLocaleString()}.`
        };
      }

      case 'createVoucherDraft': {
        const amount = Number(args.amount) || 0;
        const voucherType = args.voucherType || 'journal';
        const narration = args.narration || `Draft transaction for ${args.drLedgerName} and ${args.crLedgerName}`;
        
        const draft = {
          type: voucherType as any,
          voucherNumber: `DRAFT-${Date.now().toString().substr(-5)}`,
          date: new Date().toISOString().slice(0, 10),
          narration,
          totalAmount: amount,
          items: [
            {
              id: `item-1`,
              ledgerId: args.drLedgerName,
              ledgerName: args.drLedgerName,
              debitAmount: amount,
              creditAmount: 0
            },
            {
              id: `item-2`,
              ledgerId: args.crLedgerName,
              ledgerName: args.crLedgerName,
              debitAmount: 0,
              creditAmount: amount
            }
          ]
        };

        setPendingVoucherDraft(draft);
        setActiveTab('accounting');
        setAccountingSubTab('new-voucher');

        return {
          toolName,
          success: true,
          data: draft,
          message: `Draft ${voucherType.toUpperCase()} voucher created for ${company.currencySymbol}${amount.toLocaleString()} and loaded in the Voucher Form for review.`,
          actionToPerform: {
            type: 'DRAFT_VOUCHER',
            targetTab: 'accounting',
            targetSubTab: 'new-voucher',
            data: draft
          }
        };
      }

      case 'postVoucher': {
        // Execute voucher posting directly
        const items = args.items || [];
        const voucherType = args.voucherType || 'journal';
        const narration = args.narration || 'AI Posted Voucher';
        const totalAmount = items.reduce((acc: number, it: any) => acc + (it.amount || it.debitAmount || 0), 0) / 2 || 1000;

        const result = addVoucher({
          companyId: company.id,
          voucherNumber: `VCH-${Date.now().toString().substr(-6)}`,
          date: new Date().toISOString().slice(0, 10),
          type: voucherType as any,
          narration,
          totalAmount,
          items: items.map((it: any, idx: number) => ({
            id: `vitem-${idx}`,
            ledgerId: it.ledgerName || 'General Ledger',
            ledgerName: it.ledgerName || 'General Ledger',
            debitAmount: it.drCr === 'Dr' ? it.amount : 0,
            creditAmount: it.drCr === 'Cr' ? it.amount : 0
          }))
        });

        return {
          toolName: 'postVoucher',
          success: result.success,
          data: result.voucher,
          message: result.message || 'Voucher posted successfully into double-entry ledger.'
        };
      }

      case 'saveBusinessMemory': {
        const mem = MemoryEngineService.saveMemory(
          company.id,
          args.category || 'PREFERENCES',
          args.subject || 'Business Context',
          args.content || '',
          args.tags || []
        );
        return {
          toolName,
          success: true,
          data: mem,
          message: `Saved into Vepari Business Memory: "${mem.subject}".`,
          actionToPerform: {
            type: 'SAVE_MEMORY',
            data: mem
          }
        };
      }

      case 'navigateTo': {
        const tab = args.tab || 'dashboard';
        const subTab = args.subTab;
        setActiveTab(tab);
        if (subTab) setAccountingSubTab(subTab);
        return {
          toolName,
          success: true,
          data: { tab, subTab },
          message: `Navigated to ${tab.toUpperCase()} ${subTab ? `(Sub-section: ${subTab})` : ''}.`,
          actionToPerform: {
            type: 'NAVIGATE',
            targetTab: tab,
            targetSubTab: subTab
          }
        };
      }

      default:
        return {
          toolName,
          success: false,
          data: null,
          message: `Unknown or unhandled tool: ${toolName}`
        };
    }
  }
}
