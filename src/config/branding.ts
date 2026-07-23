/**
 * Centralized Branding Configuration
 * Changing active brand dynamically updates the entire application's identity.
 */

export type BrandKey = 'buzzflow';

export interface BrandConfig {
  key: BrandKey;
  name: string;
  tagline: string;
  shortDesc: string;
  logoIcon: string; // Lucide icon identifier or text
  badgeText: string;
  primaryColor: string;
  primaryBg: string;
  accentColor: string;
  gradient: string;
  defaultCurrency: 'INR' | 'USD';
  currencySymbol: '₹' | '$';
  supportEmail: string;
  website: string;
  footerText: string;
  aiName: string;
  aiPromptPrefix: string;
  features: string[];
}

export const BRANDS: Record<BrandKey, BrandConfig> = {
  buzzflow: {
    key: 'buzzflow',
    name: 'Buzzflow',
    tagline: 'Intelligent Double-Entry Financial Engine & GST Suite',
    shortDesc: 'Automated double-entry ledgers, live voucher validation, and AI-powered GST compliance.',
    logoIcon: 'Zap',
    badgeText: 'Enterprise Edition',
    primaryColor: '#163A70', // Deep Enterprise Blue
    primaryBg: 'bg-[#163A70]',
    accentColor: '#2F6FED', // Royal Blue
    gradient: 'from-[#163A70] to-[#2F6FED]',
    defaultCurrency: 'INR',
    currencySymbol: '₹',
    supportEmail: 'support@buzzflow.com',
    website: 'https://buzzflow.com',
    footerText: '© 2026 Buzzflow Technologies. Real-time Double-Entry Ledger Engine.',
    aiName: 'Buzzflow AI Accountant',
    aiPromptPrefix: 'You are Buzzflow AI Accountant, an expert in Indian Accounting Standards (Ind AS), GST compliance, and double-entry bookkeeping.',
    features: [
      'Live Dr=Cr Double-Entry Balance Validator',
      'Instant GST Tax Ledger Computation',
      'AI-Guided Journal Entry Auto-Completion',
      'Trial Balance, P&L, and Balance Sheet Engine'
    ]
  }
};

export const DEFAULT_BRAND_KEY: BrandKey = 'buzzflow';
