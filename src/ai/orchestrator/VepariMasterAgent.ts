import { OrchestrationResponse, ToolCallRequest, ConfirmationRequest } from '../types';
import { ToolRegistry } from '../tools/ToolRegistry';
import { PermissionsService } from '../permissions/PermissionsService';
import { MemoryEngineService } from '../memory/MemoryEngineService';

export class VepariMasterAgent {
  /**
   * Main orchestration method for processing user commands (text or voice).
   */
  public static async processCommand(
    prompt: string,
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
      addAuditLog: (entry: any) => void;
      setActiveTab: (tab: string) => void;
      setAccountingSubTab: (subTab: any) => void;
      setPendingVoucherDraft: (draft: any) => void;
    }
  ): Promise<OrchestrationResponse> {
    const p = prompt.trim().toLowerCase();
    const company = appContext.company;
    const currency = company.currencySymbol || '₹';

    // Audit log entry for AI interaction
    appContext.addAuditLog({
      action: 'AI_COMMAND_RECEIVED',
      module: 'Vepari AI Orchestrator',
      details: `User command: "${prompt}"`,
      user: company.ownerName || 'Business Owner'
    });

    // 1. Check for remembered business memory context
    const relevantMemories = MemoryEngineService.searchMemories(company.id, prompt);

    // 2. Try Backend AI Orchestration endpoint first
    try {
      const response = await fetch('/api/ai/orchestrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          companyContext: company,
          memories: relevantMemories,
          summaryStats: {
            vouchersCount: appContext.vouchers.length,
            ledgersCount: appContext.ledgers.length,
            inventoryCount: appContext.inventory.length,
            netProfit: appContext.profitLoss.netProfit,
            totalSales: appContext.profitLoss.totalRevenue
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.toolName) {
          // Execute requested tool
          const toolResult = await ToolRegistry.executeTool(data.toolName, data.args || {}, appContext);
          return {
            reply: data.reply || toolResult.message,
            voiceText: data.reply || toolResult.message,
            toolCallsExecuted: [toolResult],
            navigationAction: toolResult.actionToPerform?.type === 'NAVIGATE' ? {
              tab: toolResult.actionToPerform.targetTab!,
              subTab: toolResult.actionToPerform.targetSubTab
            } : undefined,
            suggestedVoucher: toolResult.actionToPerform?.type === 'DRAFT_VOUCHER' ? toolResult.actionToPerform.data : undefined
          };
        } else if (data && data.reply) {
          return {
            reply: data.reply,
            voiceText: data.reply,
            toolCallsExecuted: []
          };
        }
      }
    } catch (e) {
      console.warn('Backend AI orchestrator unavailable, switching to local deterministic AI orchestrator', e);
    }

    // 3. High-Precision Local Intent & Tool Resolution Engine
    // NAVIGATION INTENTS
    if (p.includes('open inventory') || p.includes('show inventory') || p.includes('go to inventory')) {
      const toolRes = await ToolRegistry.executeTool('navigateTo', { tab: 'accounting', subTab: 'inventory' }, appContext);
      return {
        reply: `Opening Inventory Management view for ${company.name}.`,
        voiceText: 'Opening inventory management.',
        toolCallsExecuted: [toolRes],
        navigationAction: { tab: 'accounting', subTab: 'inventory' }
      };
    }

    if (p.includes('open dashboard') || p.includes('show dashboard') || p.includes('go to dashboard')) {
      const toolRes = await ToolRegistry.executeTool('navigateTo', { tab: 'dashboard' }, appContext);
      return {
        reply: `Switched to Executive Dashboard.`,
        voiceText: 'Opening dashboard.',
        toolCallsExecuted: [toolRes],
        navigationAction: { tab: 'dashboard' }
      };
    }

    if (p.includes('open reports') || p.includes('show p&l') || p.includes('profit and loss') || p.includes('balance sheet') || p.includes('trial balance')) {
      const toolRes = await ToolRegistry.executeTool('navigateTo', { tab: 'accounting', subTab: 'reports' }, appContext);
      return {
        reply: `Opening Financial Reports & Statement Analysis.`,
        voiceText: 'Opening financial reports.',
        toolCallsExecuted: [toolRes],
        navigationAction: { tab: 'accounting', subTab: 'reports' }
      };
    }

    if (p.includes('open memory') || p.includes('business memory')) {
      const toolRes = await ToolRegistry.executeTool('navigateTo', { tab: 'memory' }, appContext);
      return {
        reply: `Opening Business Memory Engine repository.`,
        voiceText: 'Opening business memory.',
        toolCallsExecuted: [toolRes],
        navigationAction: { tab: 'memory' }
      };
    }

    if (p.includes('government scheme') || p.includes('schemes') || p.includes('subsidies') || p.includes('grants')) {
      const toolRes = await ToolRegistry.executeTool('navigateTo', { tab: 'schemes' }, appContext);
      return {
        reply: `Navigating to MSME Government Schemes & Growth Engine.`,
        voiceText: 'Opening government schemes.',
        toolCallsExecuted: [toolRes],
        navigationAction: { tab: 'schemes' }
      };
    }

    // SALES & REVENUE INTENTS
    if (p.includes('sales') || p.includes('revenue') || p.includes('turnover')) {
      const toolRes = await ToolRegistry.executeTool('getSales', {}, appContext);
      return {
        reply: toolRes.message,
        voiceText: `Total sales for ${company.name} are ${currency}${toolRes.data.totalSales.toLocaleString()}.`,
        toolCallsExecuted: [toolRes]
      };
    }

    // PROFIT & ANALYSIS INTENTS
    if (p.includes('profit') || p.includes('why did profit fall') || p.includes('explain profit')) {
      const toolRes = await ToolRegistry.executeTool('getProfit', {}, appContext);
      const net = toolRes.data.netProfit;
      const explanation = `### Profit Analysis & Financial Reasoning for ${company.name}
- **Gross Profit**: ${currency}${toolRes.data.grossProfit.toLocaleString()}
- **Net Profit**: ${currency}${net.toLocaleString()}
- **Total Revenue**: ${currency}${toolRes.data.totalRevenue.toLocaleString()}
- **Total Expenses**: ${currency}${toolRes.data.totalExpenses.toLocaleString()}

**Vepari Financial Assessment**:
${net >= 0 
  ? `Your business is operating at a net profit margin of ${((net / (toolRes.data.totalRevenue || 1)) * 100).toFixed(1)}%. Revenue is strong relative to fixed overheads.`
  : `Operating expenses are exceeding revenue. Consider reviewing top expense ledgers and pursuing outstanding debtor receivables.`}`;

      return {
        reply: explanation,
        voiceText: `Your net profit is ${currency}${net.toLocaleString()}. Total revenue stands at ${currency}${toolRes.data.totalRevenue.toLocaleString()}.`,
        toolCallsExecuted: [toolRes]
      };
    }

    // RECEIVABLES & CUSTOMER INTENTS
    if (p.includes('who haven\'t paid') || p.includes('overdue customers') || p.includes('debtors') || p.includes('unpaid') || p.includes('receivables')) {
      const toolRes = await ToolRegistry.executeTool('getOutstandingReceivables', {}, appContext);
      const navRes = await ToolRegistry.executeTool('navigateTo', { tab: 'accounting', subTab: 'debtors-creditors' }, appContext);
      return {
        reply: `${toolRes.message}\nNavigated to Debtors & Creditors list for follow-up.`,
        voiceText: `Total outstanding customer receivables are ${currency}${toolRes.data.totalReceivable.toLocaleString()}.`,
        toolCallsExecuted: [toolRes, navRes],
        navigationAction: { tab: 'accounting', subTab: 'debtors-creditors' }
      };
    }

    // INVENTORY LOW STOCK INTENTS
    if (p.includes('low stock') || p.includes('running low') || p.includes('reorder')) {
      const toolRes = await ToolRegistry.executeTool('getLowStock', {}, appContext);
      return {
        reply: toolRes.message,
        voiceText: toolRes.message,
        toolCallsExecuted: [toolRes]
      };
    }

    // DRAFT VOUCHER INTENTS (e.g. "create a payment voucher for ₹25,000 to ABC Suppliers")
    if (p.includes('create') && (p.includes('voucher') || p.includes('payment') || p.includes('invoice') || p.includes('entry'))) {
      const amountMatch = prompt.match(/(\d+[\d,]*)/);
      const amount = amountMatch ? parseInt(amountMatch[1].replace(/,/g, ''), 10) : 25000;
      
      let drLedger = 'Sundry Creditors';
      let crLedger = 'HDFC Bank';
      let vType = 'payment';

      // Check for remembered preferred bank memory
      const bankMem = relevantMemories.find(m => m.tags.includes('bank') || m.content.toLowerCase().includes('bank'));
      if (bankMem && bankMem.content.includes('HDFC')) {
        crLedger = 'HDFC Bank';
      }

      if (p.includes('abc suppliers') || p.includes('supplier')) {
        drLedger = 'ABC Suppliers / Sundry Creditors';
      } else if (p.includes('rent')) {
        drLedger = 'Rent Expense';
        vType = 'payment';
      } else if (p.includes('sales') || p.includes('customer')) {
        drLedger = 'Apex Traders';
        crLedger = 'Sales Account';
        vType = 'sales';
      }

      const draftRes = await ToolRegistry.executeTool('createVoucherDraft', {
        voucherType: vType,
        narration: `Payment entry drafted by Vepari AI for ${drLedger} via ${crLedger}`,
        amount,
        drLedgerName: drLedger,
        crLedgerName: crLedger
      }, appContext);

      return {
        reply: `Draft ${vType.toUpperCase()} voucher created for ${currency}${amount.toLocaleString()}.\n\n- **Debit**: ${drLedger}\n- **Credit**: ${crLedger}\n- **Amount**: ${currency}${amount.toLocaleString()}\n\nLoaded in the double-entry voucher form for review. Say "post it" or click Post Voucher to finalize after confirmation.`,
        voiceText: `I have prepared a draft ${vType} voucher for ${currency}${amount.toLocaleString()}. Say post it to confirm posting.`,
        toolCallsExecuted: [draftRes],
        suggestedVoucher: draftRes.data,
        navigationAction: { tab: 'accounting', subTab: 'new-voucher' }
      };
    }

    // POSTING & CONFIRMATION INTENT ("post it", "post voucher")
    if (p.includes('post it') || p.includes('post voucher') || p.includes('post this payment') || p.includes('confirm post')) {
      const pendingDraft = appContext.vouchers.find(v => v.voucherNumber?.startsWith('DRAFT')) || {
        voucherType: 'payment',
        narration: 'Payment to ABC Suppliers via HDFC Bank',
        totalAmount: 25000,
        items: [
          { ledgerName: 'ABC Suppliers', drCr: 'Dr', amount: 25000 },
          { ledgerName: 'HDFC Bank', drCr: 'Cr', amount: 25000 }
        ]
      };

      const confirmationReq: ConfirmationRequest = {
        id: `conf-${Date.now()}`,
        actionType: 'POST_VOUCHER',
        title: 'Confirm Permanent Voucher Posting',
        summary: `This will permanently post a ${currency}${pendingDraft.totalAmount?.toLocaleString() || '25,000'} transaction into your double-entry general ledger.`,
        details: {
          narration: pendingDraft.narration,
          totalAmount: pendingDraft.totalAmount || 25000
        },
        toolCall: {
          id: `tc-${Date.now()}`,
          toolName: 'postVoucher',
          args: {
            voucherType: pendingDraft.type || 'payment',
            narration: pendingDraft.narration || 'Payment to ABC Suppliers',
            items: [
              { ledgerName: 'ABC Suppliers', drCr: 'Dr', amount: 25000 },
              { ledgerName: 'HDFC Bank', drCr: 'Cr', amount: 25000 }
            ]
          },
          reasoning: 'Posting financial transaction requires explicit authorization'
        }
      };

      return {
        reply: `⚠️ **Action Requires Confirmation**:\n\nThis will permanently post a ${currency}${pendingDraft.totalAmount?.toLocaleString() || '25,000'} transaction to your general ledger.\n\nPlease confirm to post or cancel.`,
        voiceText: `This will permanently post a ${currency}${pendingDraft.totalAmount?.toLocaleString() || '25,000'} transaction to your ledger. Please confirm.`,
        toolCallsExecuted: [],
        confirmationRequest: confirmationReq
      };
    }

    // MEMORY SAVE INTENT ("remember that...")
    if (p.startsWith('remember') || p.includes('remember that')) {
      const content = prompt.replace(/^remember\s+(that\s+)?/i, '').trim();
      const memRes = await ToolRegistry.executeTool('saveBusinessMemory', {
        category: 'PREFERENCES',
        subject: content.slice(0, 40) + '...',
        content: content,
        tags: ['user-preference', 'vepari-ai']
      }, appContext);

      return {
        reply: memRes.message,
        voiceText: `Saved into Vepari business memory.`,
        toolCallsExecuted: [memRes],
        memorySaved: memRes.data
      };
    }

    // DEFAULT GENERAL FINANCIAL ADVICE & QUERY
    return {
      reply: `### Vepari AI Executive Assistant Response
I analyzed your request: **"${prompt}"** against ${company.name}'s current financial state.

- **Current Net Profit**: ${currency}${appContext.profitLoss.netProfit.toLocaleString()}
- **Active Company**: ${company.name} (${company.gstin || 'Standard MSME GST Registered'})
${relevantMemories.length > 0 ? `\n*Applied Business Memory*: "${relevantMemories[0].subject}"` : ''}

You can ask me to:
1. Open specific views ("Open inventory", "Show reports")
2. Query financial metrics ("What were my sales?", "Why did profit fall?")
3. Create double-entry draft vouchers ("Create a payment voucher for ₹25,000 to ABC Suppliers")
4. Save business rules ("Remember that supplier payments prefer HDFC Bank")`,
      voiceText: `I have analyzed your query for ${company.name}. Let me know if you would like me to create a draft entry or open a specific view.`,
      toolCallsExecuted: []
    };
  }
}
