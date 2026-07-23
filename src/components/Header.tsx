import React, { useState } from 'react';
import { useAccounting } from '../context/AccountingContext';
import { BrandSwitcher } from './BrandSwitcher';
import { CompanyOnboardingModal } from './company/CompanyOnboardingModal';
import { 
  Building2, 
  Zap, 
  LayoutDashboard, 
  BookOpen, 
  FolderTree, 
  FileSpreadsheet, 
  Settings,
  Sparkles,
  Bot,
  PlusCircle,
  Key
} from 'lucide-react';

export const Header: React.FC<{ onToggleAi: () => void; isAiOpen: boolean }> = ({ onToggleAi, isAiOpen }) => {
  const { brand, company, activeTab, setActiveTab, license } = useAccounting();
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  const BrandIcon = Zap;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'accounting', label: 'Accounting Engine', icon: BookOpen },
    { id: 'finance', label: 'Finance Engine', icon: FileSpreadsheet },
    { id: 'memory', label: 'Memory Engine', icon: FolderTree },
    { id: 'intelligence', label: 'Intelligence Engine', icon: Bot },
    { id: 'schemes', label: 'Gov Schemes & Growth', icon: Sparkles },
    { id: 'company', label: 'Company', icon: Settings },
  ];

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs">
        {/* Top Banner Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Brand Logo & Name */}
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${brand.primaryBg} text-white shadow-md shadow-teal-500/10`}>
                <BrandIcon className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                    {brand.name}
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800">
                    {license.mode === 'educational' ? 'Educational Mode' : `${license.mode.toUpperCase()} Edition`}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block truncate max-w-xs font-semibold">
                  {company.name} ({company.currencySymbol})
                </p>
              </div>
            </div>

            {/* Center Brand Switcher */}
            <div className="hidden md:flex items-center gap-3">
              <BrandSwitcher />

              <button
                type="button"
                onClick={() => setIsOnboardingOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors border border-slate-200 dark:border-slate-700"
              >
                <PlusCircle className="w-3.5 h-3.5 text-teal-600" />
                <span>Create Company / License</span>
              </button>
            </div>

            {/* Right AI Assistant & Quick Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={onToggleAi}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 border ${
                  isAiOpen
                    ? 'bg-amber-50 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-700'
                    : 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-500 border-transparent shadow-xs'
                }`}
              >
                <Bot className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">{brand.aiName}</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              </button>

              <button
                type="button"
                onClick={() => setIsOnboardingOpen(true)}
                className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800"
                title="Create Company / License"
              >
                <Building2 className="w-4 h-4 text-teal-600" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-2 border-t border-slate-100 dark:border-slate-800/80">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-150 ${
                    isActive
                      ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-semibold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-teal-400 dark:text-teal-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Onboarding / Setup Modal */}
      <CompanyOnboardingModal isOpen={isOnboardingOpen} onClose={() => setIsOnboardingOpen(false)} />
    </>
  );
};
