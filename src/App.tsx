import React, { useState } from 'react';
import { AccountingProvider, useAccounting } from './context/AccountingContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AiAssistant } from './components/AiAssistant';
import { DashboardView } from './components/dashboard/DashboardView';
import { CompanyPortalGate } from './components/company/CompanyPortalGate';

import { CompanySetupView } from './components/company/CompanySetupView';
import { AccountingEngineView } from './components/accounting/AccountingEngineView';
import { FinanceEngineView } from './components/finance/FinanceEngineView';
import { MemoryEngineView } from './components/memory/MemoryEngineView';
import { IntelligenceEngineView } from './components/intelligence/IntelligenceEngineView';
import { SchemesEngineView } from './components/schemes/SchemesEngineView';

const MainContent: React.FC = () => {
  const { activeTab, activeCompanyId, isCompanyAuthenticated } = useAccounting();
  const [isAiOpen, setIsAiOpen] = useState(false);

  // If company is not selected or PIN is not authenticated, show Company Gate Landing Page
  if (!activeCompanyId || !isCompanyAuthenticated) {
    return <CompanyPortalGate />;
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView onOpenAi={() => setIsAiOpen(true)} />;
      case 'accounting':
      case 'daybook':
      case 'new-voucher':
      case 'inventory':
      case 'coa':
      case 'reports':
      case 'tax-brs':
      case 'banking-cash':
      case 'debtors-creditors':
        return <AccountingEngineView />;
      case 'billing':
        return <AccountingEngineView defaultSubTab="billing" />;
      case 'finance':
        return <FinanceEngineView />;
      case 'memory':
        return <MemoryEngineView />;
      case 'intelligence':
        return <IntelligenceEngineView onOpenAi={() => setIsAiOpen(true)} />;
      case 'schemes':
        return <SchemesEngineView />;
      case 'company':
        return <CompanySetupView />;
      default:
        return <DashboardView onOpenAi={() => setIsAiOpen(true)} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#1A2433] flex flex-col font-sans selection:bg-[#16B8A6] selection:text-white">
      {/* Header Bar */}
      <Header onToggleAi={() => setIsAiOpen(prev => !prev)} isAiOpen={isAiOpen} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderActiveView()}
      </main>

      {/* Floating AI Drawer */}
      <AiAssistant isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AccountingProvider>
      <MainContent />
    </AccountingProvider>
  );
}
