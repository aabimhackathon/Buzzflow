/**
 * Centralized Branding Configuration
 * Changing active brand dynamically updates the entire application's identity.
 */

import { VEPARI_ASSETS } from './assets';

export type BrandKey = 'vepari_ai' | 'buzzflow';

export interface BrandConfig {
  key: BrandKey;
  name: string;
  tagline: string;
  shortDesc: string;
  logoIcon: string; // Lucide icon identifier or text
  appIcon: string;
  brandImage: string;
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

const vepariBrand: BrandConfig = {
  key: 'vepari_ai',
  name: 'Vepari AI',
  tagline: 'Intelligent Double-Entry Financial Engine & GST Suite',
  shortDesc: 'Automated double-entry ledgers, live voucher validation, and AI-powered GST compliance.',
  logoIcon: 'Zap',
  appIcon: VEPARI_ASSETS.appIcon,
  brandImage: VEPARI_ASSETS.brand,
  badgeText: 'Enterprise Edition',
  primaryColor: '#163A70', // Deep Enterprise Blue
  primaryBg: 'bg-[#163A70]',
  accentColor: '#2F6FED', // Royal Blue
  gradient: 'from-[#163A70] to-[#2F6FED]',
  defaultCurrency: 'INR',
  currencySymbol: '₹',
  supportEmail: 'support@vepari.ai',
  website: 'https://vepari.ai',
  footerText: '© 2026 Vepari AI Technologies. Real-time Double-Entry Ledger Engine.',
  aiName: 'Vepari AI Accountant',
  aiPromptPrefix: 'You are Vepari AI Accountant, an expert in Indian Accounting Standards (Ind AS), GST compliance, and double-entry bookkeeping.',
  features: [
    'Live Dr=Cr Double-Entry Balance Validator',
    'Instant GST Tax Ledger Computation',
    'AI-Guided Journal Entry Auto-Completion',
    'Trial Balance, P&L, and Balance Sheet Engine'
  ]
};

export const BRANDS: Record<BrandKey, BrandConfig> = {
  vepari_ai: vepariBrand,
  buzzflow: { ...vepariBrand, key: 'buzzflow' }
};

export const DEFAULT_BRAND_KEY: BrandKey = 'vepari_ai';
