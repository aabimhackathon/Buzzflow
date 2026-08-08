import React, { useState, useEffect } from 'react';
import { useAccounting } from '../context/AccountingContext';
import { BrandSwitcher } from './BrandSwitcher';
import { CompanyOnboardingModal } from './company/CompanyOnboardingModal';
import { GuidedTourModal } from './common/GuidedTourModal';
import { NotificationCenter } from './common/NotificationCenter';
import { VEPARI_ASSETS } from '../config/assets';
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
  LogIn,
  ShieldCheck,
  Compass,
  Bell,
  Package,
  Users,
  Briefcase,
  TrendingUp,
  Globe,
  Sliders,
  Eye,
  Mic,
  Cpu,
  Menu,
  X,
  User,
  ChevronDown,
  Lock
} from 'lucide-react';

export const Header: React.FC<{ onToggleAi: () => void; isAiOpen: boolean }> = ({ onToggleAi, isAiOpen }) => {
  const { brand, activeCompany, activeTab, setActiveTab, license, exitCompanySession } = useAccounting();
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Auto-launch guided tour for new company login if not seen before
  useEffect(() => {
    if (activeCompany?.id) {
      const tourSeen = localStorage.getItem(`vepari_tour_seen_${activeCompany.id}`) || localStorage.getItem(`buzzflow_tour_seen_${activeCompany.id}`);
      if (!tourSeen) {
        setIsTourOpen(true);
        localStorage.setItem(`vepari_tour_seen_${activeCompany.id}`, 'true');
      }
    }
  }, [activeCompany?.id]);

  const navItems = [
    { id: 'vepari-ai', label: 'Vepari AI OS', icon: Cpu },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'finance', label: 'Finance', icon: FileSpreadsheet },
    { id: 'accounting', label: 'Accounting', icon: BookOpen },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'billing', label: 'Billing', icon: Receipt },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'suppliers', label: 'Suppliers', icon: Briefcase },
    { id: 'reports', label: 'Reports', icon: FileSpreadsheet },
    { id: 'intelligence', label: 'Intelligence', icon: Bot },
    { id: 'growth', label: 'Growth', icon: TrendingUp },
    { id: 'market', label: 'Market', icon: Globe },
    { id: 'memory', label: 'Memory', icon: FolderTree },
    { id: 'automation', label: 'Automation', icon: Sliders },
    { id: 'vision', label: 'Vision OCR', icon: Eye },
    { id: 'voice', label: 'Voice OS', icon: Mic },
    { id: 'schemes', label: 'Government', icon: Sparkles },
    { id: 'company', label: 'Company', icon: Settings },
  ];

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-[#D8E2EE] dark:border-slate-800 shadow-xs">
        {/* Top Banner Bar */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-2">
            
            {/* Brand Logo & Mobile Menu Toggle */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(prev => !prev)}
                className="lg:hidden p-2 rounded-xl text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 min-h-[40px] min-w-[40px] flex items-center justify-center"
                title="Toggle Mobile Navigation Drawer"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5 text-rose-600" /> : <Menu className="w-5 h-5 text-slate-800 dark:text-slate-200" />}
              </button>

              <div className="p-1 rounded-xl sm:rounded-2xl bg-[#163A70] text-white shadow-md shadow-blue-900/10 flex items-center justify-center border border-[#16B8A6]/30 overflow-hidden shrink-0">
                <img 
                  src={VEPARI_ASSETS.appIcon} 
                  alt="Vepari AI Accounting Logo"
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl object-cover bg-white"
                />
              </div>

              <div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-base sm:text-xl font-logo text-[#1A2433] dark:text-white tracking-tight flex items-center gap-1">
                    {brand.name}
                    <span className="w-2 h-2 rounded-full bg-[#16B8A6] animate-pulse inline-block" title="AI Ledger Sync Active" />
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-semibold bg-[#163A70]/10 text-[#163A70] dark:bg-blue-950 dark:text-blue-200 border border-[#163A70]/20 hidden xs:inline-flex">
                    {license.mode === 'educational' ? 'Edu Mode' : `${license.mode.toUpperCase()}`}
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-[#5B6878] dark:text-slate-400 truncate max-w-[140px] sm:max-w-xs font-medium">
                  {activeCompany.name}
                </p>
              </div>
            </div>

            {/* Center Desktop Actions */}
            <div className="hidden lg:flex items-center gap-2.5">
              <BrandSwitcher />

              <button
                type="button"
                onClick={() => setIsTourOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/80 dark:hover:bg-teal-900 text-teal-800 dark:text-teal-200 transition-colors border border-teal-200 dark:border-teal-800"
                title="Start Guided System Tour"
              >
                <Compass className="w-3.5 h-3.5 text-teal-600" />
                <span>Tour</span>
              </button>

              <button
                type="button"
                onClick={() => setIsOnboardingOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#EEF3F8] hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#1A2433] dark:text-slate-200 transition-colors border border-[#D8E2EE] dark:border-slate-700"
              >
                <PlusCircle className="w-3.5 h-3.5 text-[#163A70]" />
                <span>New Company</span>
              </button>
            </div>

            {/* Right Actions: Persistent User Profile Dropdown & AI Assistant */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              
              {/* Persistent User Profile Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(prev => !prev)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 transition-all shadow-2xs active:scale-95"
                  title="User Profile & Settings"
                >
                  <div className="w-6 h-6 rounded-lg bg-[#163A70] text-teal-300 flex items-center justify-center font-bold text-xs shadow-xs">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-bold text-[#1A2433] dark:text-white leading-tight">
                      {(activeCompany as any)?.ownerName || 'Business Owner'}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-none mt-0.5">
                      Administrator
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                </button>

                {/* Profile Popup Menu */}
                {isProfileOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsProfileOpen(false)} 
                    />
                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 space-y-3">
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/80 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#163A70] text-teal-300 flex items-center justify-center font-bold text-sm shadow-md">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#1A2433] dark:text-white">
                            {(activeCompany as any)?.ownerName || 'Business Owner'}
                          </p>
                          <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                            Owner / Admin
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1 text-xs">
                        <div className="px-2 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between text-slate-600 dark:text-slate-300">
                          <span className="text-slate-500">Active Entity:</span>
                          <span className="font-bold text-[#1A2433] dark:text-white truncate max-w-[120px]">{activeCompany.name}</span>
                        </div>
                        <div className="px-2 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between text-slate-600 dark:text-slate-300">
                          <span className="text-slate-500">Edition:</span>
                          <span className="font-bold text-teal-600 dark:text-teal-400 capitalize">{license.mode}</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
                        <button
                          onClick={() => {
                            setIsTourOpen(true);
                            setIsProfileOpen(false);
                          }}
                          className="w-full text-left px-2.5 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 transition-colors"
                        >
                          <Compass className="w-4 h-4 text-teal-600" />
                          <span>Start Guided System Tour</span>
                        </button>

                        <button
                          onClick={() => {
                            setIsOnboardingOpen(true);
                            setIsProfileOpen(false);
                          }}
                          className="w-full text-left px-2.5 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 transition-colors"
                        >
                          <PlusCircle className="w-4 h-4 text-[#163A70]" />
                          <span>Create / Switch Company</span>
                        </button>
                      </div>

                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                        <button
                          type="button"
                          onClick={() => {
                            setIsProfileOpen(false);
                            exitCompanySession();
                          }}
                          className="w-full py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900/80 text-rose-700 dark:text-rose-300 font-bold text-xs flex items-center justify-center gap-2 transition-all border border-rose-200 dark:border-rose-800 active:scale-95 shadow-2xs"
                        >
                          <LogOut className="w-4 h-4 text-rose-600" />
                          <span>Logout & Lock Workspace</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <button
                onClick={() => setIsNotificationsOpen(true)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 relative transition-colors"
                title="Notifications"
              >
                <Bell className="w-4 h-4 text-slate-700 dark:text-slate-200" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500" />
              </button>

              <button
                onClick={onToggleAi}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95 ${
                  isAiOpen
                    ? 'bg-[#8B5CF6] text-white shadow-ai'
                    : 'bg-gradient-ai text-white hover:opacity-95 shadow-md'
                }`}
              >
                <Bot className="w-4 h-4 text-teal-200" />
                <span className="hidden sm:inline">{brand.aiName}</span>
                <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs Bar */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-2 border-t border-[#D8E2EE]/60 dark:border-slate-800/80">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-150 active:scale-95 ${
                    isActive
                      ? 'bg-[#163A70] text-white font-semibold shadow-xs'
                      : 'text-[#5B6878] dark:text-slate-400 hover:text-[#1A2433] dark:hover:text-white hover:bg-[#EEF3F8] dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isActive ? 'text-[#16B8A6]' : 'text-[#8894A7]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Responsive Mobile Drawer Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-slate-900/95 text-white border-b border-slate-800 p-4 space-y-4 animate-in slide-in-from-top-2 backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Logged in: {activeCompany.name}
                </span>
              </div>
              <button
                onClick={exitCompanySession}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md transition-all active:scale-95"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-teal-500 text-slate-950 font-bold shadow-md'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800 gap-2">
              <button
                onClick={() => {
                  setIsOnboardingOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center justify-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5 text-teal-400" />
                <span>Create Company</span>
              </button>
              
              <button
                onClick={exitCompanySession}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-rose-300 border border-slate-700 flex items-center justify-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5 text-rose-400" />
                <span>Switch / Re-Login</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Onboarding / Setup Modal */}
      <CompanyOnboardingModal isOpen={isOnboardingOpen} onClose={() => setIsOnboardingOpen(false)} />
      <GuidedTourModal isOpen={isTourOpen} onClose={() => setIsTourOpen(false)} />
      <NotificationCenter isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
    </>
  );
};
