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
import { VepariAiCommandCenter } from './components/orchestrator/VepariAiCommandCenter';
import { GrowthEngineView } from './components/growth/GrowthEngineView';
import { MarketEngineView } from './components/market/MarketEngineView';
import { AutomationEngineView } from './components/automation/AutomationEngineView';
import { VisionEngineView } from './components/vision/VisionEngineView';
import { VoiceEngineView } from './components/voice/VoiceEngineView';
import { useAiOsBoot } from './hooks/useAiOsBoot';
import { AiOsBootSequence } from './components/orchestrator/AiOsBootSequence';

const MainContent: React.FC = () => {
  const { activeTab, activeCompanyId, isCompanyAuthenticated, activeCompany } = useAccounting();
  const [isAiOpen, setIsAiOpen] = useState(false);
  const { isBooting, bootProgress, bootStepMessage } = useAiOsBoot();

  // If company is not selected or PIN is not authenticated, show Company Gate Landing Page
  if (!activeCompanyId || !isCompanyAuthenticated) {
    return <CompanyPortalGate />;
  }

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#1A2433] flex flex-col font-sans selection:bg-[#16B8A6] selection:text-white">
      {/* 3-Second Particle Boot Visual Effect Overlay when authenticated */}
      {isBooting && (
        <AiOsBootSequence 
          companyName={activeCompany?.name || 'Workspace'} 
          progress={bootProgress} 
          stepMessage={bootStepMessage} 
        />
      )}

      {/* Header Bar */}
      <Header onToggleAi={() => setIsAiOpen(prev => !prev)} isAiOpen={isAiOpen} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {(() => {
          switch (activeTab) {
            case 'vepari-ai':
              return <VepariAiCommandCenter />;
            case 'dashboard':
              return <DashboardView onOpenAi={() => setIsAiOpen(true)} />;
            case 'accounting':
            case 'daybook':
            case 'new-voucher':
            case 'coa':
            case 'tax-brs':
            case 'banking-cash':
              return <AccountingEngineView />;
            case 'inventory':
              return <AccountingEngineView defaultSubTab="inventory" />;
            case 'reports':
              return <AccountingEngineView defaultSubTab="reports" />;
            case 'customers':
            case 'suppliers':
            case 'debtors-creditors':
              return <AccountingEngineView defaultSubTab="debtors-creditors" />;
            case 'billing':
              return <AccountingEngineView defaultSubTab="billing" />;
            case 'finance':
              return <FinanceEngineView />;
            case 'memory':
              return <MemoryEngineView />;
            case 'intelligence':
              return <IntelligenceEngineView onOpenAi={() => setIsAiOpen(true)} />;
            case 'growth':
              return <GrowthEngineView />;
            case 'market':
              return <MarketEngineView />;
            case 'automation':
              return <AutomationEngineView />;
            case 'vision':
              return <VisionEngineView />;
            case 'voice':
              return <VoiceEngineView />;
            case 'schemes':
              return <SchemesEngineView />;
            case 'company':
              return <CompanySetupView />;
            default:
              return <VepariAiCommandCenter />;
          }
        })()}
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
