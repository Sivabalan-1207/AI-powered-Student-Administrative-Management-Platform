import React, { useState, useEffect } from 'react';
import { store } from '../../services/store';
import { User, Mail, Phone, Building, GraduationCap, Shield } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const [state, setState] = useState(store.getState());

  useEffect(() => {
    return store.subscribe(() => {
      setState(store.getState());
    });
  }, []);

  const user = state.currentUser;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
        <img
          src={user.avatarUrl}
          alt={user.name}
          className="w-16 h-16 rounded-full object-cover ring-4 ring-indigo-500/20"
        />
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">{user.name}</h1>
          <span className="px-2.5 py-0.5 rounded bg-indigo-100 text-indigo-800 font-extrabold text-[10px] uppercase">
            {user.role.replace(/_/g, ' ')}
          </span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4 text-xs shadow-2xs">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Account Profile Information</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-slate-400 font-medium">Institutional Email:</span>
            <div className="font-bold text-slate-900 mt-0.5">{user.email}</div>
          </div>

          {user.registerNumber && (
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-slate-400 font-medium">Register Number:</span>
              <div className="font-mono font-extrabold text-indigo-600 mt-0.5">{user.registerNumber}</div>
            </div>
          )}

          {user.employeeId && (
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-slate-400 font-medium">Employee ID:</span>
              <div className="font-mono font-extrabold text-indigo-600 mt-0.5">{user.employeeId}</div>
            </div>
          )}

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-slate-400 font-medium">Department:</span>
            <div className="font-bold text-slate-900 mt-0.5">{user.department}</div>
          </div>

          {user.parentEmail && (
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-slate-400 font-medium">Registered Parent Contact:</span>
              <div className="font-bold text-purple-700 mt-0.5">{user.parentEmail} ({user.parentPhone})</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
