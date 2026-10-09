import React, { useState, useEffect } from 'react';
import { store } from '../../services/store';
import { Settings, Shield, History, FileCheck2, Database, Key } from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const [state, setState] = useState(store.getState());

  useEffect(() => {
    return store.subscribe(() => {
      setState(store.getState());
    });
  }, []);

  const auditLogs = state.auditLogs;
  const services = state.services;

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Settings className="w-6 h-6 text-indigo-600" />
            <span>Institutional Administrator Console</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            System administration, service definitions, role permissions, and complete audit trail inspector.
          </p>
        </div>
      </div>

      {/* Audit Log Inspector */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
        <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
          <History className="w-5 h-5 text-indigo-600" />
          <span>Immutable Audit Log Inspector ({auditLogs.length} Events)</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase text-[10px] font-bold">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Request Ref</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-bold text-indigo-600">
                    {log.requestId || 'SYSTEM'}
                  </td>
                  <td className="py-3 px-4 text-slate-800 font-semibold font-sans">
                    {log.actorName} ({log.actorRole})
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900 font-sans">
                    {log.action}
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-sans">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Services Registry */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
        <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
          <FileCheck2 className="w-5 h-5 text-indigo-600" />
          <span>Active Administrative Services Registry</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((s) => (
            <div key={s.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">{s.title}</span>
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-slate-200 text-slate-700 rounded">
                  {s.code}
                </span>
              </div>

              <div className="text-[11px] text-slate-600">{s.description}</div>
              <div className="text-[11px] text-slate-500 font-semibold">
                Target: {s.targetDays} days • Parent Verification: {s.requiresParentVerification ? 'Yes' : 'No'}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
