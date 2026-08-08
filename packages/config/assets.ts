/**
 * Centralized Vepari AI Authoritative Assets Configuration
 */

export const VEPARI_APP_ICON = '/assets/branding/App%20icon.png';
export const VEPARI_BRAND = '/assets/branding/brand.png';
export const VEPARI_FAVICON = '/assets/branding/favicon.png';

export const VEPARI_ENGINES = {
  automation: '/assets/engines/automation%20engine.png',
  finance: '/assets/engines/finance%20engine.png',
  growth: '/assets/engines/growth%20engine.png',
  intelligence: '/assets/engines/intelligence%20engine.png',
  market: '/assets/engines/market%20engine.png',
  memory: '/assets/engines/memory%20engine.png',
  vision: '/assets/engines/vision%20engine.png',
  voice: '/assets/engines/voice%20engine.png',
} as const;

export const VEPARI_UI = {
  lightbulbTips: '/assets/ui/lightbulb_tips',
} as const;

export const VEPARI_ASSETS = {
  appIcon: VEPARI_APP_ICON,
  brand: VEPARI_BRAND,
  favicon: VEPARI_FAVICON,
  engines: VEPARI_ENGINES,
  ui: VEPARI_UI,
} as const;

export default VEPARI_ASSETS;
