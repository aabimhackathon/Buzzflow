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
    badgeText: 'Enterprise AI Edition',
    primaryColor: '#C8A96B', // Heritage Gold
    primaryBg: 'bg-teal-600',
    accentColor: 'emerald',
    gradient: 'from-slate-900 to-slate-800',
    defaultCurrency: 'INR',
    currencySymbol: '₹',
    supportEmail: 'support@buzzflow.ai',
    website: 'https://buzzflow.ai',
    footerText: '© 2026 Buzzflow AI Technologies. Real-time Double-Entry Ledger Engine.',
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
