import { SafetyLevel, ToolDefinition } from '../types';

export class PermissionsService {
  /**
   * Classifies tool execution safety level.
   */
  public static getSafetyLevel(toolName: string): SafetyLevel {
    const sensitiveTools = [
      'postVoucher',
      'deleteVoucher',
      'closeFinancialYear',
      'updateCompanyPin',
      'deleteCompany'
    ];

    const draftTools = [
      'createVoucherDraft',
      'createInvoiceDraft',
      'createCustomerDraft',
      'createSupplierDraft',
      'saveBusinessMemory'
    ];

    if (sensitiveTools.includes(toolName)) {
      return 'SENSITIVE';
    }
    if (draftTools.includes(toolName)) {
      return 'DRAFT';
    }
    return 'READ';
  }

  /**
   * Checks if a tool call requires explicit user confirmation.
   */
  public static requiresConfirmation(toolName: string): boolean {
    return this.getSafetyLevel(toolName) === 'SENSITIVE';
  }
}
