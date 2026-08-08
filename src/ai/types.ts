/**
 * Vepari AI - Master Architecture Types & Interfaces
 */

export type SafetyLevel = 'READ' | 'DRAFT' | 'SENSITIVE';

export type MemoryCategory = 
  | 'OWNER_MEMORY'
  | 'COMPANY_MEMORY'
  | 'CUSTOMER_MEMORY'
  | 'SUPPLIER_MEMORY'
  | 'BUSINESS_RULES'
  | 'PREFERENCES'
  | 'DECISIONS'
  | 'IMPORTANT_EVENTS';

export interface BusinessMemoryItem {
  id: string;
  companyId: string;
  category: MemoryCategory;
  subject: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface BusinessEvent {
  id: string;
  companyId: string;
  type: 'LOW_STOCK' | 'OVERDUE_RECEIVABLE' | 'LARGE_EXPENSE' | 'SALES_DIP' | 'TAX_ALERT' | 'OPPORTUNITY';
  title: string;
  description: string;
  severity: 'CRITICAL' | 'IMPORTANT' | 'OPPORTUNITY' | 'INFO';
  timestamp: string;
  read: boolean;
  actionTarget?: string;
  actionSubTab?: string;
}

export interface BusinessBriefing {
  greeting: string;
  ownerName: string;
  timestamp: string;
  summary: string;
  highlights: {
    label: string;
    value: string;
    change?: string;
    status: 'positive' | 'negative' | 'neutral' | 'warning';
  }[];
  criticalItems: string[];
  recommendedAction: {
    title: string;
    description: string;
    targetTab?: string;
    targetSubTab?: string;
  };
}

export interface ToolDefinition {
  name: string;
  description: string;
  category: 'accounting' | 'inventory' | 'customer' | 'supplier' | 'billing' | 'reports' | 'memory' | 'navigation' | 'government';
  safetyLevel: SafetyLevel;
  parameters: {
    [key: string]: {
      type: 'string' | 'number' | 'boolean' | 'object' | 'array';
      description: string;
      required?: boolean;
    };
  };
}

export interface ToolCallRequest {
  id: string;
  toolName: string;
  args: Record<string, any>;
  reasoning: string;
}

export interface ToolExecutionResult {
  toolName: string;
  success: boolean;
  data: any;
  message?: string;
  actionToPerform?: {
    type: 'NAVIGATE' | 'OPEN_MODAL' | 'DRAFT_VOUCHER' | 'SAVE_MEMORY' | 'POST_VOUCHER';
    targetTab?: string;
    targetSubTab?: string;
    data?: any;
  };
}

export interface ConfirmationRequest {
  id: string;
  actionType: 'POST_VOUCHER' | 'DELETE_DATA' | 'UPDATE_COMPANY_PIN' | 'CLOSE_FISCAL_YEAR';
  title: string;
  summary: string;
  details: Record<string, any>;
  toolCall: ToolCallRequest;
}

export interface OrchestrationResponse {
  reply: string;
  voiceText?: string;
  toolCallsExecuted: ToolExecutionResult[];
  navigationAction?: {
    tab: string;
    subTab?: string;
  };
  suggestedVoucher?: any;
  confirmationRequest?: ConfirmationRequest;
  memorySaved?: BusinessMemoryItem;
  stateChangeSummary?: string;
}

export interface VoiceOSState {
  isListening: boolean;
  isSpeaking: boolean;
  transcript: string;
  supported: boolean;
  error: string | null;
}
