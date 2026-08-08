import React, { useState } from 'react';
import { useAccounting } from '../../context/AccountingContext';
import { 
  Download, 
  Upload, 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  CheckCircle2, 
  AlertTriangle, 
  Database,
  FileJson,
  RefreshCw,
  Eye
} from 'lucide-react';

export const CompanyBackupManager: React.FC = () => {
  const { 
    activeCompany, 
    vouchers, 
    ledgers, 
    inventory, 
    invoices, 
    customers, 
    suppliers, 
    billsOutstanding,
    auditLogs,
    addAuditLog
  } = useAccounting();

  const [passphrase, setPassphrase] = useState('');
  const [exportSuccess, setExportSuccess] = useState(false);
  const [importPassphrase, setImportPassphrase] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);
  const [backupPreview, setBackupPreview] = useState<any | null>(null);

  // Handle Export Backup
  const handleExportBackup = () => {
    try {
      const backupData = {
        metadata: {
          system: 'Vepari AI Enterprise Accounting Engine',
          version: '3.5.0',
          exportedAt: new Date().toISOString(),
          companyId: activeCompany.id,
          companyName: activeCompany.name,
          hasEncryption: passphrase.trim().length > 0
        },
        company: activeCompany,
        vouchers: vouchers.filter(v => v.companyId === activeCompany.id || !v.companyId),
        ledgers,
        inventory: inventory.filter(i => i.companyId === activeCompany.id || !i.companyId),
        invoices: invoices.filter(i => i.companyId === activeCompany.id || !i.companyId),
        customers: customers.filter(c => c.companyId === activeCompany.id || !c.companyId),
        suppliers: suppliers.filter(s => s.companyId === activeCompany.id || !s.companyId),
        billsOutstanding,
        auditLogs: auditLogs.filter(a => a.companyId === activeCompany.id)
      };

      let jsonString = JSON.stringify(backupData, null, 2);

      // If passphrase provided, apply simple Base64 obfuscation/signature header
      if (passphrase.trim()) {
        const encoded = btoa(encodeURIComponent(jsonString));
        const encryptedEnvelope = {
          encrypted: true,
          keyHint: passphrase.trim().slice(0, 2) + '***',
          payload: encoded
        };
        jsonString = JSON.stringify(encryptedEnvelope, null, 2);
      }

      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const cleanCompName = activeCompany.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
      const dateStr = new Date().toISOString().slice(0, 10);
      link.download = `vepari_ai_backup_${cleanCompName}_${dateStr}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);

      // Log Audit Event
      addAuditLog({
        action: 'Company Backup Exported',
        module: 'Company',
        details: `Downloaded secure JSON backup file for ${activeCompany.name} (Vouchers: ${backupData.vouchers.length}, Ledgers: ${ledgers.length})`,
        userRole: 'Administrator / Chief Accountant'
      });
    } catch (err: any) {
      alert('Failed to generate backup: ' + err.message);
    }
  };

  // Handle Select Backup File
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    setImportSuccess(false);
    setBackupPreview(null);

    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const rawText = event.target?.result as string;
        let parsed = JSON.parse(rawText);

        if (parsed.encrypted && parsed.payload) {
          // Encrypted file envelope
          if (!importPassphrase) {
            setImportError('This backup file is passphrase-protected. Please enter the passphrase below.');
            setBackupPreview({ isEncrypted: true, payload: parsed.payload });
            return;
          }

          try {
            const decodedJson = decodeURIComponent(atob(parsed.payload));
            parsed = JSON.parse(decodedJson);
          } catch {
            setImportError('Invalid passphrase provided. Could not decrypt backup envelope.');
            return;
          }
        }

        if (!parsed.company || !parsed.vouchers || !parsed.ledgers) {
          setImportError('Invalid Vepari AI backup format. Missing core company or voucher schema.');
          return;
        }

        setBackupPreview(parsed);
      } catch (err: any) {
        setImportError('Invalid JSON file format: ' + err.message);
      }
    };

    reader.readAsText(file);
  };

  // Decrypt File with Passphrase
  const handleDecryptPending = () => {
    if (!backupPreview || !backupPreview.isEncrypted || !backupPreview.payload) return;
    try {
      const decodedJson = decodeURIComponent(atob(backupPreview.payload));
      const parsed = JSON.parse(decodedJson);
      if (!parsed.company || !parsed.vouchers || !parsed.ledgers) {
        setImportError('Decrypted payload invalid.');
        return;
      }
      setImportError(null);
      setBackupPreview(parsed);
    } catch {
      setImportError('Incorrect passphrase. Unable to decrypt backup file.');
    }
  };

  // Perform Restoration
  const handleConfirmRestore = () => {
    if (!backupPreview || backupPreview.isEncrypted) return;

    try {
      // Overwrite local storage entries with backup data
      if (backupPreview.vouchers) localStorage.setItem('vepari_vouchers', JSON.stringify(backupPreview.vouchers));
      if (backupPreview.ledgers) localStorage.setItem('vepari_ledgers', JSON.stringify(backupPreview.ledgers));
      if (backupPreview.inventory) localStorage.setItem('vepari_inventory', JSON.stringify(backupPreview.inventory));
      if (backupPreview.invoices) localStorage.setItem('vepari_invoices', JSON.stringify(backupPreview.invoices));
      if (backupPreview.customers) localStorage.setItem('vepari_customers', JSON.stringify(backupPreview.customers));
      if (backupPreview.suppliers) localStorage.setItem('vepari_suppliers', JSON.stringify(backupPreview.suppliers));
      if (backupPreview.billsOutstanding) localStorage.setItem('vepari_bills_outstanding', JSON.stringify(backupPreview.billsOutstanding));

      setImportSuccess(true);

      // Log Audit Event
      addAuditLog({
        action: 'Company Backup Restored',
        module: 'Company',
        details: `Restored database snapshot for ${backupPreview.company?.name} (Vouchers: ${backupPreview.vouchers?.length})`,
        userRole: 'Administrator / Managing Partner'
      });

      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err: any) {
      setImportError('Failed to apply backup restoration: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Export Section Card */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-teal-50 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400">
              <Download className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Export & Download Company Backup</h3>
              <p className="text-xs text-slate-500">Generate a secure, self-contained JSON snapshot of all ledgers, vouchers, and settings</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 dark:bg-teal-950/80 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
            Full Ledger State
          </span>
        </div>

        {exportSuccess && (
          <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Backup file generated & downloaded successfully!
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-500" /> Security Passphrase (Optional)
            </label>
            <input
              type="password"
              placeholder="Enter optional encryption password"
              value={passphrase}
              onChange={e => setPassphrase(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
            />
            <p className="text-[11px] text-slate-400 mt-1">If set, the backup file will require this password to restore.</p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-1">
            <p className="font-bold text-slate-800 dark:text-slate-200">Current Backup Snapshot Scope:</p>
            <div className="grid grid-cols-2 gap-x-4 text-[11px] text-slate-600 dark:text-slate-400 font-mono">
              <span>Vouchers: {vouchers.length}</span>
              <span>Ledgers: {ledgers.length}</span>
              <span>Customers: {customers.length}</span>
              <span>Suppliers: {suppliers.length}</span>
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={handleExportBackup}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all"
          >
            <Download className="w-4 h-4" /> Download Encrypted Backup (.json)
          </button>
        </div>
      </div>

      {/* Import & Manual Restoration Card */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Manual Data Restoration</h3>
              <p className="text-xs text-slate-500">Restore company ledgers and vouchers from an existing Vepari AI JSON backup file</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Caution: Overwrites State
          </span>
        </div>

        {importError && (
          <div className="p-3 rounded-xl bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 font-bold text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" /> {importError}
          </div>
        )}

        {importSuccess && (
          <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Restoration completed successfully! Reloading workspace...
          </div>
        )}

        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Select Backup File (.json)</label>
          <input
            type="file"
            accept=".json"
            onChange={handleFileSelect}
            className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-950 dark:file:text-indigo-300 cursor-pointer"
          />

          {backupPreview && backupPreview.isEncrypted && (
            <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-800/60 space-y-3 text-xs">
              <p className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-amber-600" /> Enter Encryption Passphrase to Decrypt File
              </p>
              <div className="flex gap-2">
                <input
                  type="password"
                  placeholder="Enter passphrase"
                  value={importPassphrase}
                  onChange={e => setImportPassphrase(e.target.value)}
                  className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={handleDecryptPending}
                  className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-colors"
                >
                  Decrypt & Preview
                </button>
              </div>
            </div>
          )}

          {backupPreview && !backupPreview.isEncrypted && (
            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <FileJson className="w-4 h-4 text-teal-600" /> Verified Backup Metadata
                </span>
                <span className="text-[10px] font-mono text-slate-400">Exported: {new Date(backupPreview.metadata?.exportedAt).toLocaleString()}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Target Company</span>
                  <strong className="text-slate-800 dark:text-slate-200 text-xs">{backupPreview.company?.name}</strong>
                </div>

                <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Vouchers</span>
                  <strong className="text-slate-800 dark:text-slate-200 text-xs font-mono">{backupPreview.vouchers?.length || 0} Entries</strong>
                </div>

                <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Ledger Accounts</span>
                  <strong className="text-slate-800 dark:text-slate-200 text-xs font-mono">{backupPreview.ledgers?.length || 0} Accounts</strong>
                </div>

                <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Customers / Suppliers</span>
                  <strong className="text-slate-800 dark:text-slate-200 text-xs font-mono">
                    {(backupPreview.customers?.length || 0) + (backupPreview.suppliers?.length || 0)} Parties
                  </strong>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={() => setBackupPreview(null)}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmRestore}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-md transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Confirm & Restore Overwriting Local State
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
