import { GoogleGenAI } from '@google/genai';

export interface AiAccountingRequest {
  prompt: string;
  brandName?: string;
  currencySymbol?: string;
  currentVoucherContext?: any;
  companyContext?: any;
}

export async function processAiAccountingQuery(reqData: AiAccountingRequest): Promise<{
  reply: string;
  suggestedVoucher?: {
    voucherType: string;
    narration: string;
    items: { ledgerName: string; drCr: 'Dr' | 'Cr'; amount: number }[];
  };
}> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return {
      reply: '⚠️ **Gemini API Key Missing**: Please ensure GEMINI_API_KEY is configured in your platform Secrets panel to enable AI Assistant capabilities.'
    };
  }

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });

  const brandName = reqData.brandName || 'Vepari AI';
  const currencySymbol = reqData.currencySymbol || '₹';

  const systemInstruction = `
You are the lead AI Financial Advisor & Double-Entry Accounting Assistant for ${brandName}.
You specialize in Indian Accounting Standards (Ind AS), US GAAP, double-entry bookkeeping rules, GST/Tax computations, and voucher journal entries.

Accounting Rules You Always Follow:
1. Every financial transaction MUST balance: Total Debit (Dr) = Total Credit (Cr).
2. Assets & Expenses: Debit increases (+), Credit decreases (-).
3. Liabilities, Equity & Revenue: Credit increases (+), Debit decreases (-).
4. Standard Voucher Types: Payment, Receipt, Contra, Journal (JV), Sales, Purchase, Credit Note, Debit Note.
5. In India GST: Sales include Taxable Base + CGST Payable (9%) + SGST Payable (9%) or IGST (18%). Purchases include CGST Input Credit + SGST Input Credit.

Your Goal:
Provide clear, expert, professional accounting answers.
If the user asks to record or draft a transaction (e.g. "Record payment of 5,000 for electricity bill" or "Create invoice for 100,000 to Apex Traders"), include an explicit JSON block in your response tagged with \`\`\`json ... \`\`\` containing the suggested voucher items so the user can auto-populate their voucher form!

JSON Structure for suggested voucher:
\`\`\`json
{
  "voucherType": "payment" | "receipt" | "contra" | "journal" | "sales" | "purchase" | "credit_note" | "debit_note",
  "narration": "Being...",
  "items": [
    { "ledgerName": "Electricity & Utilities", "drCr": "Dr", "amount": 5000 },
    { "ledgerName": "HDFC Bank Corporate Account", "drCr": "Cr", "amount": 5000 }
  ]
}
\`\`\`

Always use currency symbol "${currencySymbol}" when discussing monetary amounts.
Maintain a helpful, confident, precise accounting tone.
`;

  try {
    const userPromptWithContext = `
User Query: "${reqData.prompt}"

${reqData.currentVoucherContext ? `Current Active Voucher Context: ${JSON.stringify(reqData.currentVoucherContext)}` : ''}
${reqData.companyContext ? `Company Context: ${JSON.stringify(reqData.companyContext)}` : ''}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: userPromptWithContext,
      config: {
        systemInstruction,
        temperature: 0.2
      }
    });

    const fullReply = response.text || 'I apologize, I could not process your query at this time.';

    // Extract JSON block if present
    let suggestedVoucher;
    const jsonMatch = fullReply.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      try {
        const parsed = JSON.parse(jsonMatch[1]);
        if (parsed.voucherType && Array.isArray(parsed.items)) {
          suggestedVoucher = parsed;
        }
      } catch (e) {
        // Could not parse json block, ignore
      }
    }

    return {
      reply: fullReply,
      suggestedVoucher
    };
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return {
      reply: `❌ **Error querying AI Assistant**: ${error?.message || 'An unexpected error occurred while communicating with Gemini API.'}`
    };
  }
}
