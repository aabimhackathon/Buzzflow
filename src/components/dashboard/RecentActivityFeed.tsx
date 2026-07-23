import React from 'react';
import { useAccounting } from '../../context/AccountingContext';
import { 
  Activity, 
  Clock, 
  UserCheck, 
  FileText, 
  ShieldCheck, 
  Building2, 
  Package, 
  ArrowRight,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { AuditLogEntry } from '../../lib/accounting/types';

export const RecentActivityFeed: React.FC = () => {
  const { auditLogs, activeCompany, setActiveTab } = useAccounting();

  // Get last 5 activities for current active company
  const companyLogs = auditLogs.filter(l => l.companyId === activeCompany.id);
  const recentActivities = companyLogs.slice(0, 5);

  const getModuleBadge = (module: AuditLogEntry['module']) => {
    switch (module) {
      case 'Accounting':
        return {
          icon: FileText,
          color: 'bg-teal-100 text-teal-800 dark:bg-teal-950/80 dark:text-teal-300 border-teal-200 dark:border-teal-800'
        };
      case 'Billing':
        return {
          icon: FileText,
          color: 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border-blue-200 dark:border-blue-800'
        };
      case 'Inventory':
        return {
          icon: Package,
          color: 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 dark:border-amber-800'
        };
      case 'Company':
        return {
          icon: Building2,
          color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
        };
      case 'Security':
        return {
          icon: ShieldCheck,
          color: 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border-rose-200 dark:border-rose-800'
        };
      default:
        return {
          icon: Activity,
          color: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700'
        };
    }
  };

  const formatRelativeTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

      if (diffMinutes < 1) return 'Just now';
      if (diffMinutes < 60) return `${diffMinutes}m ago`;
      const diffHours = Math.floor(diffMinutes / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString();
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-600" />
            Recent Activity & Audit Stream
          </h3>
          <p className="text-xs text-slate-500">Last 5 user transactions and system edits with timestamps</p>
        </div>

        <button
          onClick={() => setActiveTab('company')}
          className="flex items-center gap-1 text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline"
        >
          <span>Full Audit Log</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {recentActivities.length === 0 ? (
        <div className="p-8 text-center text-slate-400 text-xs">
          <Activity className="w-6 h-6 mx-auto mb-2 opacity-50 text-slate-400" />
          <p>No recent activity recorded yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {recentActivities.map((log, idx) => {
            const badge = getModuleBadge(log.module);
            const BadgeIcon = badge.icon;
            return (
              <div 
                key={log.id || idx}
                className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 hover:border-teal-300 dark:hover:border-teal-700 transition-all flex items-start justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-xl border ${badge.color} shrink-0 mt-0.5`}>
                    <BadgeIcon className="w-4 h-4" />
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900 dark:text-white">
                        {log.action}
                      </span>
                      <span className={`px-2 py-0.2 rounded-md text-[9px] font-extrabold uppercase border ${badge.color}`}>
                        {log.module}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1">
                      {log.details}
                    </p>

                    <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono pt-0.5">
                      <span className="flex items-center gap-1">
                        <UserCheck className="w-3 h-3 text-teal-600" />
                        <strong className="text-slate-700 dark:text-slate-300 font-sans">{log.userRole}</strong>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {formatRelativeTime(log.timestamp)} ({new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] font-mono text-slate-400 block">
                    {log.ipAddress || '127.0.0.1'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
