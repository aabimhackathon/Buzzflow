import { BusinessMemoryItem, MemoryCategory } from '../types';

const STORAGE_KEY = 'vepari_business_memories';

export class MemoryEngineService {
  /**
   * Retrieves all stored memories for a company.
   */
  public static getMemories(companyId: string): BusinessMemoryItem[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('buzzflow_business_memories');
      if (!saved) return this.getDefaultMemories(companyId);
      const all: BusinessMemoryItem[] = JSON.parse(saved);
      return all.filter(m => m.companyId === companyId);
    } catch (e) {
      console.error('Failed to parse business memories', e);
      return this.getDefaultMemories(companyId);
    }
  }

  /**
   * Saves a new business memory item.
   */
  public static saveMemory(
    companyId: string,
    category: MemoryCategory,
    subject: string,
    content: string,
    tags: string[] = []
  ): BusinessMemoryItem {
    const all = this.getAllMemories();
    const newItem: BusinessMemoryItem = {
      id: `mem-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      companyId,
      category,
      subject,
      content,
      tags: tags.length > 0 ? tags : [category.toLowerCase(), 'vepari-ai'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    all.push(newItem);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    return newItem;
  }

  /**
   * Searches memories relevant to a user query.
   */
  public static searchMemories(companyId: string, query: string): BusinessMemoryItem[] {
    const memories = this.getMemories(companyId);
    if (!query || query.trim() === '') return memories;

    const terms = query.toLowerCase().split(' ').filter(t => t.length > 2);
    if (terms.length === 0) return memories;

    return memories.filter(mem => {
      const targetText = `${mem.subject} ${mem.content} ${mem.category} ${mem.tags.join(' ')}`.toLowerCase();
      return terms.some(term => targetText.includes(term));
    });
  }

  /**
   * Deletes a memory item.
   */
  public static deleteMemory(memoryId: string): void {
    const all = this.getAllMemories();
    const filtered = all.filter(m => m.id !== memoryId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  }

  private static getAllMemories(): BusinessMemoryItem[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('buzzflow_business_memories');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  private static getDefaultMemories(companyId: string): BusinessMemoryItem[] {
    const defaults: BusinessMemoryItem[] = [
      {
        id: 'mem-default-1',
        companyId,
        category: 'PREFERENCES',
        subject: 'Supplier Payment Bank Preference',
        content: 'Preferred bank account for supplier payouts is HDFC Bank Current Account.',
        tags: ['bank', 'hdfc', 'payments', 'suppliers'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'mem-default-2',
        companyId,
        category: 'BUSINESS_RULES',
        subject: 'GST Payment Schedule',
        content: 'GST returns and tax liability payments must be reconciled before the 20th of every month.',
        tags: ['gst', 'tax', 'compliance', 'schedule'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'mem-default-3',
        companyId,
        category: 'CUSTOMER_MEMORY',
        subject: 'Apex Traders Credit Period',
        content: 'Apex Traders has an agreed credit period of 15 days for all sales invoices.',
        tags: ['apex traders', 'customer', 'credit', 'terms'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    return defaults;
  }
}
