import React, { useState, useEffect } from 'react';
import { useAccounting } from '../context/AccountingContext';
import { BrandSwitcher } from './BrandSwitcher';
import { CompanyOnboardingModal } from './company/CompanyOnboardingModal';
import { GuidedTourModal } from './common/GuidedTourModal';
import { 
  Building2, 
  Zap, 
  LayoutDashboard, 
  BookOpen, 
  Receipt,
  FolderTree, 
  FileSpreadsheet, 
  Settings,
  Sparkles,
  Bot,
  PlusCircle,
  LogOut,
  ShieldCheck,
  Compass
} from 'lucide-react';

export const Header: React.FC<{ onToggleAi: () => void; isAiOpen: boolean }> = ({ onToggleAi, isAiOpen }) => {
  const { brand, activeCompany, activeTab, setActiveTab, license, exitCompanySession } = useAccounting();
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);

  // Auto-launch guided tour for new company login if not seen before
  useEffect(() => {
    if (activeCompany?.id) {
      const tourSeen = localStorage.getItem(`buzzflow_tour_seen_${activeCompany.id}`);
      if (!tourSeen) {
        setIsTourOpen(true);
        localStorage.setItem(`buzzflow_tour_seen_${activeCompany.id}`, 'true');
      }
    }
  }, [activeCompany?.id]);

  const BrandIcon = Zap;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'accounting', label: 'Accounting', icon: BookOpen },
    { id: 'billing', label: 'Billing', icon: Receipt },
    { id: 'finance', label: 'Finance', icon: FileSpreadsheet },
    { id: 'memory', label: 'Memory', icon: FolderTree },
    { id: 'intelligence', label: 'Intelligence', icon: Bot },
    { id: 'schemes', label: 'Government Schemes', icon: Sparkles },
    { id: 'company', label: 'Company', icon: Settings },
  ];

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-[#D8E2EE] dark:border-slate-800 shadow-xs">
        {/* Top Banner Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Brand Logo & Name */}
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-2xl bg-[#163A70] text-white shadow-md shadow-blue-900/10 flex items-center justify-center border border-[#16B8A6]/30 overflow-hidden">
                <img 
                  src="/src/assets/images/buzzflow_logo_icon_1784785041750.jpg" 
                  alt="Buzzflow Accounting Logo"
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-xl object-cover bg-white"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-logo text-[#1A2433] dark:text-white tracking-tight flex items-center gap-1.5">
                    {brand.name}
                    <span className="w-2 h-2 rounded-full bg-[#16B8A6] animate-pulse inline-block" title="AI Ledger Sync Active" />
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#163A70]/10 text-[#163A70] dark:bg-blue-950 dark:text-blue-200 border border-[#163A70]/20">
                    {license.mode === 'educational' ? 'Educational Mode' : `${license.mode.toUpperCase()} Edition`}
                  </span>
                </div>
                <p className="text-xs text-[#5B6878] dark:text-slate-400 hidden sm:block truncate max-w-xs font-medium">
                  {activeCompany.name} ({activeCompany.currencySymbol})
                </p>
              </div>
            </div>

            {/* Center Actions */}
            <div className="hidden md:flex items-center gap-3">
              <BrandSwitcher />

              <button
                type="button"
                onClick={() => setIsTourOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/80 dark:hover:bg-teal-900 text-teal-800 dark:text-teal-200 transition-colors border border-teal-200 dark:border-teal-800"
                title="Start Guided System Tour"
              >
                <Compass className="w-3.5 h-3.5 text-teal-600" />
                <span>Guided Tour</span>
              </button>

              <button
                type="button"
                onClick={() => setIsOnboardingOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#EEF3F8] hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#1A2433] dark:text-slate-200 transition-colors border border-[#D8E2EE] dark:border-slate-700"
              >
                <PlusCircle className="w-3.5 h-3.5 text-[#163A70]" />
                <span>Create Company</span>
              </button>

              <button
                type="button"
                onClick={exitCompanySession}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 transition-colors border border-slate-200"
                title="Lock Workspace / Switch Company"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Switch Company</span>
              </button>
            </div>

            {/* Right AI Assistant & Quick Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={onToggleAi}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  isAiOpen
                    ? 'bg-[#8B5CF6] text-white shadow-ai'
                    : 'bg-gradient-ai text-white hover:opacity-95 shadow-md'
                }`}
              >
                <Bot className="w-4 h-4 text-teal-200" />
                <span className="hidden sm:inline">{brand.aiName}</span>
                <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
              </button>

              <button
                type="button"
                onClick={() => setIsOnboardingOpen(true)}
                className="md:hidden p-2 rounded-xl text-[#1A2433] dark:text-slate-300 bg-[#EEF3F8] dark:bg-slate-800"
                title="Create Company / License"
              >
                <Building2 className="w-4 h-4 text-[#163A70]" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-2 border-t border-[#D8E2EE]/60 dark:border-slate-800/80">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-150 ${
                    isActive
                      ? 'bg-[#163A70] text-white font-semibold shadow-xs'
                      : 'text-[#5B6878] dark:text-slate-400 hover:text-[#1A2433] dark:hover:text-white hover:bg-[#EEF3F8] dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#16B8A6]' : 'text-[#8894A7]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Onboarding / Setup Modal */}
      <CompanyOnboardingModal isOpen={isOnboardingOpen} onClose={() => setIsOnboardingOpen(false)} />
      <GuidedTourModal isOpen={isTourOpen} onClose={() => setIsTourOpen(false)} />
    </>
  );
};
