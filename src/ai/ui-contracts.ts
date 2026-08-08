/**
 * Vepari AI - Frontend Contract Specifications
 * Clean interfaces and type definitions for future Python AI Operating System connection.
 */

export type AIState = 
  | 'IDLE'
  | 'LISTENING'
  | 'UNDERSTANDING'
  | 'PLANNING'
  | 'RETRIEVING'
  | 'EXECUTING'
  | 'WAITING_FOR_CONFIRMATION'
  | 'RESPONDING'
  | 'COMPLETED'
  | 'ERROR';

export interface AIToolCall {
  id: string;
  toolName: string;
  module: 'accounting' | 'billing' | 'inventory' | 'customers' | 'suppliers' | 'reports' | 'memory' | 'automation' | 'vision' | 'voice' | 'market' | 'growth';
  arguments: Record<string, any>;
  reasoning: string;
  status: 'pending' | 'executing' | 'success' | 'failed';
  result?: any;
}

export interface AIConfirmation {
  id: string;
  actionType: 'POST_VOUCHER' | 'DELETE_MEMORY' | 'CANCEL_INVOICE' | 'RUN_AUTOMATION' | 'MODIFY_COMPANY_PIN';
  title: string;
  summary: string;
  module: string;
  payload: Record<string, any>;
  requiresPin?: boolean;
}

export interface AIAction {
  id: string;
  type: 'NAVIGATE' | 'DRAFT_VOUCHER' | 'SHOW_REPORT' | 'OPEN_VISION_OCR' | 'START_VOICE' | 'SAVE_MEMORY' | 'POST_VOUCHER';
  targetTab?: string;
  targetSubTab?: string;
  data?: any;
  confirmation?: AIConfirmation;
}

export interface AIMessage {
  id: string;
  sender: 'user' | 'vepari_ai' | 'system';
  timestamp: string;
  content: string;
  voiceUrl?: string;
  toolCalls?: AIToolCall[];
  action?: AIAction;
  state?: AIState;
}

export interface AIInsight {
  id: string;
  category: 'FINANCIAL' | 'INVENTORY' | 'MARKET' | 'GROWTH' | 'RISK' | 'TAX';
  title: string;
  description: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'OPPORTUNITY';
  metricValue?: string;
  metricChange?: string;
  suggestedAction?: {
    label: string;
    tab: string;
    subTab?: string;
  };
}

export interface AIBrief {
  greeting: string;
  ownerName: string;
  timestamp: string;
  summary: string;
  sales: number;
  expenses: number;
  profit: number;
  receivables: number;
  payables: number;
  inventoryCount: number;
  lowStockSkus: number;
  governmentAlertsCount: number;
  marketAlertsCount: number;
  criticalAlerts: string[];
  opportunities: string[];
  priorityRecommendation: {
    title: string;
    description: string;
    targetTab: string;
    targetSubTab?: string;
  };
}

export interface AINotification {
  id: string;
  category: 'CRITICAL' | 'IMPORTANT' | 'OPPORTUNITY' | 'INFORMATION';
  module: 'Financial' | 'Inventory' | 'Customer' | 'Government' | 'Market' | 'Automation';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface AIEngineDefinition {
  id: 'finance' | 'intelligence' | 'memory' | 'market' | 'growth' | 'automation' | 'vision' | 'voice';
  name: string;
  assetKey: string;
  purpose: string;
  status: 'ACTIVE' | 'STANDBY' | 'PROCESSING' | 'LEARNING';
  metricsSummary: string;
  lastActivity: string;
}
