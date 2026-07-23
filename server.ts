import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

function getAiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === "") return null;
  return new GoogleGenAI({ apiKey: apiKey.trim() });
}

// Fallback response engine for accounting, finance, economics, and business structures
function generateAccountingFallback(prompt: string, brandName: string, currencySymbol: string, companyContext: any) {
  const p = prompt.toLowerCase();
  let cleanText = "";
  let suggestedVoucher = null;

  if (p.includes("rent") || p.includes("office rent")) {
    const amountMatch = prompt.match(/(\d+[\d,]*)/);
    const amount = amountMatch ? parseInt(amountMatch[1].replace(/,/g, ''), 10) : 35000;
    cleanText = `### Office Rent Payment Accounting Entry\n\nTo record the payment of Office Rent via HDFC Bank, you apply the **Modern Rules of Accounting**:\n- **Debit Expenses (Increase)**: Debit the **Rent Expense** account.\n- **Credit Bank Asset (Decrease)**: Credit the **HDFC Bank / Bank Account**.\n\n**Journal Entry Summary:**\n- **Dr.** Rent Expense: ${currencySymbol}${amount.toLocaleString()}\n- **Cr.** HDFC Bank: ${currencySymbol}${amount.toLocaleString()}\n\n*This transaction reduces your cash/bank balance and registers an operating expense in the Profit & Loss statement.*`;
    suggestedVoucher = {
      voucherType: "payment",
      narration: `Office Rent payment of ${currencySymbol}${amount.toLocaleString()} via HDFC Bank`,
      items: [
        { ledgerName: "Rent Expense", drCr: "Dr", amount: amount },
        { ledgerName: "HDFC Bank", drCr: "Cr", amount: amount }
      ]
    };
  } else if (p.includes("gst purchase") || (p.includes("purchase") && p.includes("gst"))) {
    cleanText = `### GST Purchase Invoice with Tax Credit (18% ITC)\n\nWhen you purchase goods/services with an 18% GST rate, the GST paid is an **Input Tax Credit (ITC)** asset that offsets your future GST tax liability.\n\n**Tax Calculation Breakdown:**\n- Base Purchase Value: 82% of total invoice\n- Input CGST (9%): 9% of base\n- Input SGST (9%): 9% of base\n\n**Accounting Treatment:**\n- **Dr.** Purchase Account (Base Price)\n- **Dr.** Input CGST Account (Tax Credit Asset)\n- **Dr.** Input SGST Account (Tax Credit Asset)\n- **Cr.** Sundry Creditor / Bank Account (Total Invoice Value)\n\n*You can claim this Input Tax Credit in your GSTR-3B filing.*`;
    suggestedVoucher = {
      voucherType: "purchase",
      narration: "Purchase invoice with 18% Input GST credit",
      items: [
        { ledgerName: "Purchase Account", drCr: "Dr", amount: 100000 },
        { ledgerName: "Input CGST", drCr: "Dr", amount: 9000 },
        { ledgerName: "Input SGST", drCr: "Dr", amount: 9000 },
        { ledgerName: "Sundry Creditors", drCr: "Cr", amount: 118000 }
      ]
    };
  } else if (p.includes("sales") || p.includes("apex traders") || p.includes("invoice")) {
    const amountMatch = prompt.match(/(\d+[\d,]*)/);
    const totalAmount = amountMatch ? parseInt(amountMatch[1].replace(/,/g, ''), 10) : 118000;
    const baseAmount = Math.round(totalAmount / 1.18);
    const taxAmount = Math.round((totalAmount - baseAmount) / 2);

    cleanText = `### Sales Invoice Entry with GST\n\nTo record a sales invoice issued to a customer (e.g., Apex Traders):\n\n**Accounting Breakdown:**\n- **Debtor (Asset Increase)**: Debit **Apex Traders / Sundry Debtors** for total amount (${currencySymbol}${totalAmount.toLocaleString()})\n- **Sales Revenue (Income Increase)**: Credit **Sales Account** for base amount (${currencySymbol}${baseAmount.toLocaleString()})\n- **Output Tax Liability (Liability Increase)**: Credit **Output CGST** (${currencySymbol}${taxAmount.toLocaleString()}) and **Output SGST** (${currencySymbol}${taxAmount.toLocaleString()})\n\n**Golden Rule:** Debit the Receiver, Credit Sales & Liabilities.`;
    suggestedVoucher = {
      voucherType: "sales",
      narration: `Sales Invoice issued to Apex Traders with CGST & SGST`,
      items: [
        { ledgerName: "Apex Traders", drCr: "Dr", amount: totalAmount },
        { ledgerName: "Sales Account", drCr: "Cr", amount: baseAmount },
        { ledgerName: "Output CGST", drCr: "Cr", amount: taxAmount },
        { ledgerName: "Output SGST", drCr: "Cr", amount: taxAmount }
      ]
    };
  } else if (p.includes("rules") || p.includes("dr and cr") || p.includes("debit") || p.includes("credit")) {
    cleanText = `### Rules of Debit (Dr) and Credit (Cr)

#### 1. Modern Accounting Rules (Equation Approach)
- **Assets**: Debit to INCREASE (+), Credit to DECREASE (-)
- **Liabilities**: Credit to INCREASE (+), Debit to DECREASE (-)
- **Equity / Capital**: Credit to INCREASE (+), Debit to DECREASE (-)
- **Revenue / Income**: Credit to INCREASE (+), Debit to DECREASE (-)
- **Expenses / Losses**: Debit to INCREASE (+), Credit to DECREASE (-)

#### 2. Traditional Golden Rules
- **Real Accounts** (Assets, Cash, Buildings): *Debit what comes in, Credit what goes out.*
- **Personal Accounts** (Customers, Suppliers, Banks): *Debit the receiver, Credit the giver.*
- **Nominal Accounts** (Expenses, Incomes): *Debit all expenses & losses, Credit all incomes & gains.*`;
  } else if (p.includes("structure") || p.includes("type of business") || p.includes("business structure") || p.includes("llp") || p.includes("private limited") || p.includes("company")) {
    cleanText = `### Business Structures Overview & Legal Comparison

Selecting the right legal entity structure depends on liability protection, fundraising needs, taxation, and compliance requirements:

1. **Sole Proprietorship**:
   - *Best for*: Single owners, small local businesses, freelancers.
   - *Pros*: Easy setup, minimal compliance, complete control.
   - *Cons*: Unlimited personal liability, difficult to raise institutional capital.

2. **Partnership Firm**:
   - *Best for*: 2+ founders sharing capital and operations.
   - *Pros*: Low compliance cost, pooled resources.
   - *Cons*: Joint and several unlimited personal liability.

3. **Limited Liability Partnership (LLP)**:
   - *Best for*: Professional service providers, consulting firms, small agencies.
   - *Pros*: Separate legal entity, limited personal liability, lower compliance than Private Limited.
   - *Cons*: Cannot issue equity shares or ESOPs to venture investors.

4. **Private Limited Company (Pvt Ltd)**:
   - *Best for*: High-growth startups, tech companies seeking VC funding, manufacturing businesses.
   - *Pros*: Limited liability, easy transfer of shares, ESOP support, high credibility.
   - *Cons*: Higher annual compliance, statutory audit obligations.

5. **One Person Company (OPC)**:
   - *Best for*: Solo entrepreneurs desiring corporate entity benefits and limited liability.
   - *Pros*: Single shareholder with corporate liability protection.`;
  } else {
    cleanText = `### ${brandName} AI Business & Financial Assistant Advice

Thank you for your inquiry regarding **"${prompt}"**.

Here is an analysis based on standard financial, accounting, and economic principles for **${companyContext?.name || 'your business'}**:

1. **Financial Management**: Ensure proper tracking of cash inflows and outflows to maintain a healthy working capital ratio (> 1.2).
2. **Tax & GST Compliance**: Maintain up-to-date ledgers for Input Tax Credits (ITC) and Output GST obligations to avoid penalties.
3. **Double-Entry Discipline**: Ensure every debit entry has a corresponding credit entry to preserve trial balance equality.

*Tip: You can ask me to draft specific vouchers, analyze tax impacts, explain economics concepts, or compare business structures!*`;
  }

  return { reply: cleanText, suggestedVoucher };
}

function generateSchemesFallback(query: string, companyContext: any) {
  return `### Government Schemes & MSME Subsidies Analysis for ${companyContext?.name || 'Your Business'}

Based on your business profile (**Industry:** ${companyContext?.industry || 'General MSME'}, **State:** ${companyContext?.state || 'India'}):

#### 1. Credit Guarantee Scheme for Micro & Small Enterprises (CGTMSE)
- **Eligibility**: New and existing Micro and Small Enterprises.
- **Benefit**: Collateral-free credit facility up to ₹5 Crore for MSMEs from eligible financial institutions.
- **Official Portal**: [cgtmse.in](https://www.cgtmse.in)

#### 2. Prime Minister’s Employment Generation Programme (PMEGP)
- **Eligibility**: Individuals above 18 years, SHGs, and registered societies.
- **Benefit**: Subsidy ranging from 15% to 35% on project costs up to ₹50 Lakh for manufacturing and ₹20 Lakh for services.
- **Official Portal**: [kviconline.gov.in](https://www.kviconline.gov.in)

#### 3. ZED (Zero Defect Zero Effect) Certification Scheme
- **Eligibility**: All MSMEs with a valid Udyam Registration.
- **Benefit**: Financial assistance up to 80% on ZED certification cost, enabling quality enhancement and environmental sustainability.
- **Official Portal**: [zed.msme.gov.in](https://zed.msme.gov.in)

#### 4. SIDBI Make in India Soft Loan Fund for MSMEs (SMILE)
- **Eligibility**: MSMEs in manufacturing and service sectors.
- **Benefit**: Soft loans and term loan assistance at competitive interest rates for technology upgrading and expansion.
- **Official Portal**: [sidbi.in](https://www.sidbi.in)`;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API route for Gemini Accounting
  app.post("/api/ai/accounting", async (req, res) => {
    const { prompt, brandName, currencySymbol, companyContext } = req.body;
    const ai = getAiClient();

    if (ai) {
      try {
        const systemInstruction = `You are the ${brandName} AI Assistant. 
You are an expert in accounting, finance, and economics. You assist businesses of all types and structures with all kinds of financial, economic, and accounting queries.
You help users with double-entry accounting (Dr/Cr), GST computations, and suggesting journal entries, as well as general business structuring and assistance.
Context: 
Company Name: ${companyContext?.name}
GSTIN: ${companyContext?.gstin}
Currency: ${currencySymbol}

If the user asks to draft an entry or record a transaction, suggest a voucher in this exact JSON format at the end of your response, wrapped in a markdown code block labeled \`\`\`json:
{
  "suggestedVoucher": {
    "voucherType": "payment|receipt|journal|sales|purchase|contra",
    "narration": "Summary of transaction",
    "items": [
      { "ledgerName": "Account Name", "drCr": "Dr", "amount": 1000 },
      { "ledgerName": "Account Name", "drCr": "Cr", "amount": 1000 }
    ]
  }
}
Only output the JSON if a voucher should be drafted. Keep explanations concise and professional.`;

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
          config: {
            systemInstruction: systemInstruction,
            temperature: 0.2
          }
        });

        const text = response.text || "";
        
        // Attempt to extract JSON from response
        let suggestedVoucher = null;
        const jsonMatch = text.match(/```json\s*(\{[\s\S]*?\})\s*```/);
        if (jsonMatch && jsonMatch[1]) {
          try {
            const parsed = JSON.parse(jsonMatch[1]);
            if (parsed.suggestedVoucher) {
              suggestedVoucher = parsed.suggestedVoucher;
            }
          } catch (e) {
            console.error("Failed to parse voucher JSON", e);
          }
        }

        // Remove the JSON block from the text to display it cleanly
        const cleanText = text.replace(/```json\s*\{[\s\S]*?\}\s*```/g, '').trim();

        return res.json({ reply: cleanText, suggestedVoucher });
      } catch (error) {
        console.warn("Gemini API call failed, using intelligent domain fallback:", error);
      }
    }

    // Fallback response if Gemini API key is missing or failed
    const fallbackData = generateAccountingFallback(prompt, brandName || "BuzzFlow", currencySymbol || "₹", companyContext);
    return res.json(fallbackData);
  });

  // API route for Schemes with Google Search Grounding
  app.post("/api/ai/schemes", async (req, res) => {
    const { query, companyContext } = req.body;
    const ai = getAiClient();

    if (ai) {
      try {
        const systemInstruction = `You are a Government Schemes and Growth Expert AI.
Context:
Company Name: ${companyContext?.name}
Industry: ${companyContext?.industry}
State: ${companyContext?.state}

Your goal is to search for the latest, official government schemes, grants, subsidies, and loans specifically for MSMEs or businesses matching the context.
You must ALWAYS use the Google Search tool to find relevant information from official trusted government websites (e.g., .gov.in, msme.gov.in, sidbi.in, etc.).
Present the details clearly, including eligibility criteria, benefits, and application links if available.
Make it easier for the user to analyze and record. Use markdown for formatting.`;

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: query,
          config: {
            systemInstruction: systemInstruction,
            temperature: 0.2,
            tools: [{ googleSearch: {} }]
          }
        });

        if (response.text) {
          return res.json({ reply: response.text });
        }
      } catch (error) {
        console.warn("Gemini Search Grounding call failed, using intelligent schemes fallback:", error);
      }
    }

    // Fallback response if Gemini API key is missing or failed
    const fallbackReply = generateSchemesFallback(query, companyContext);
    return res.json({ reply: fallbackReply });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();

