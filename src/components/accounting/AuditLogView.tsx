import React, { useState } from 'react';
import { useAccounting } from '../../context/AccountingContext';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  Download, 
  Clock, 
  UserCheck, 
  FileText, 
  Activity, 
  CheckCircle2,
  Lock,
  Building2,
  Sliders,
  Printer
} from 'lucide-react';
import { AuditLogEntry } from '../../lib/accounting/types';

export const AuditLogView: React.FC = () => {
  const { auditLogs, activeCompany } = useAccounting();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModule, setSelectedModule] = useState<string>('All');
  const [selectedRole, setSelectedRole] = useState<string>('All');

  // Filter audit logs for the current company
  const companyLogs = auditLogs.filter(log => log.companyId === activeCompany.id);

  const filteredLogs = companyLogs.filter(log => {
    const matchesSearch = 
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userRole.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesModule = selectedModule === 'All' || log.module === selectedModule;
    const matchesRole = selectedRole === 'All' || log.userRole === selectedRole;

    return matchesSearch && matchesModule && matchesRole;
  });

  const handleExportCSV = () => {
    if (filteredLogs.length === 0) return;
    const headers = ['Timestamp', 'Module', 'Action', 'Details', 'User Role', 'IP Address'];
    const rows = filteredLogs.map(l => [
      `"${l.timestamp}"`,
      `"${l.module}"`,
      `"${l.action}"`,
      `"${l.details.replace(/"/g, '""')}"`,
      `"${l.userRole}"`,
      `"${l.ipAddress || '127.0.0.1'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `vepari_ai_audit_log_${activeCompany.name}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getModuleBadge = (module: AuditLogEntry['module']) => {
    switch (module) {
      case 'Accounting':
        return 'bg-teal-100 text-teal-800 dark:bg-teal-950/80 dark:text-teal-300 border-teal-200 dark:border-teal-800';
      case 'Billing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'Inventory':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'Company':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800';
      case 'Security':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border-rose-200 dark:border-rose-800';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#163A70] to-slate-900 text-white p-6 rounded-3xl shadow-md border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#16B8A6]/20 text-[#16B8A6] border border-[#16B8A6]/30">
              <ShieldCheck className="w-3 h-3" /> ICAI Compliance Standard
            </span>
            <span className="text-xs text-slate-400 font-mono">Immutable Audit Trail</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">System Audit Log & Compliance Engine</h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Real-time record of all voucher creations, ledger edits, PIN changes, and data backups for <strong className="text-white">{activeCompany.name}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            disabled={filteredLogs.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#16B8A6] hover:bg-[#149b8c] disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all"
          >
            <Download className="w-4 h-4" /> Export CSV Audit Trail
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-all"
          >
            <Printer className="w-4 h-4" /> Print
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Audit Records</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1 font-mono">{companyLogs.length}</p>
          </div>
          <div className="p-3 rounded-2xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Accounting Actions</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1 font-mono">
              {companyLogs.filter(l => l.module === 'Accounting' || l.module === 'Billing').length}
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Security & Backup Events</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1 font-mono">
              {companyLogs.filter(l => l.module === 'Security' || l.module === 'Company').length}
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">
            <Lock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Authorized Auditors</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1 font-mono">
              {Array.from(new Set(companyLogs.map(l => l.userRole))).length || 1}
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search action, details, user role..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <Sliders className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <select
              value={selectedModule}
              onChange={e => setSelectedModule(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-bold text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="All">All Modules</option>
              <option value="Accounting">Accounting</option>
              <option value="Billing">Billing</option>
              <option value="Inventory">Inventory</option>
              <option value="Company">Company</option>
              <option value="Security">Security</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <UserCheck className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <select
              value={selectedRole}
              onChange={e => setSelectedRole(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-bold text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="All">All Roles</option>
              {Array.from(new Set(companyLogs.map(l => l.userRole))).map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 uppercase font-bold tracking-wider">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Module</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Details</th>
                <th className="py-3 px-4">User Role</th>
                <th className="py-3 px-4 text-right">IP / System</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <Activity className="w-8 h-8 mx-auto text-slate-400 mb-2 opacity-50" />
                    <p className="font-bold text-sm">No Audit Logs Found</p>
                    <p className="text-xs text-slate-400">All financial activities, voucher postings, and security edits will appear here.</p>
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap font-mono text-slate-600 dark:text-slate-400 text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{new Date(log.timestamp).toLocaleString()}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getModuleBadge(log.module)}`}>
                        {log.module}
                      </span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap font-bold text-slate-900 dark:text-white">
                      {log.action}
                    </td>

                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300 max-w-md">
                      {log.details}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[11px]">
                        <UserCheck className="w-3 h-3 text-teal-600" />
                        {log.userRole}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right font-mono text-[11px] text-slate-500">
                      {log.ipAddress || '127.0.0.1 (Local Session)'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
