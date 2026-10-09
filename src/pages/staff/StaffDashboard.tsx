import React, { useState, useEffect } from 'react';
import { store } from '../../services/store';
import { AnimatedCounter } from '../../components/AnimatedCounter';
import { ScrollReveal } from '../../components/ScrollReveal';
import {
  PanelsTopLeft,
  FileCheck2,
  UsersRound,
  ShieldCheck,
  ClockAlert,
  AlertTriangle,
  CheckCircle2,
  UtensilsCrossed,
  ShoppingBag,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface StaffDashboardProps {
  onNavigate: (page: string) => void;
}

export const StaffDashboard: React.FC<StaffDashboardProps> = ({ onNavigate }) => {
  const [state, setState] = useState(store.getState());

  useEffect(() => {
    return store.subscribe(() => {
      setState(store.getState());
    });
  }, []);

  const allApps = state.applications;
  const pendingParent = allApps.filter((a) => a.parentVerificationStatus === 'pending');
  const pendingHOD = allApps.filter((a) => a.hodApprovalStatus === 'pending' && a.parentVerificationStatus === 'verified');
  const delayedApps = allApps.filter((a) => a.isDelayed);
  const activeAlerts = state.academicAlerts.filter((a) => a.status === 'active');
  const foodOrders = state.orders.filter((o) => o.storeType === 'food');
  const stationeryOrders = state.orders.filter((o) => o.storeType === 'stationery');

  // Recharts Chart Data with Purple & Blue Palette
  const categoryData = [
    { name: 'Bonafide', count: allApps.filter((a) => a.serviceId === 'srv-bonafide').length },
    { name: 'Loan Cert', count: allApps.filter((a) => a.serviceId === 'srv-loan').length },
    { name: 'Medium Instr', count: allApps.filter((a) => a.serviceId === 'srv-study').length },
    { name: 'Intern NOC', count: allApps.filter((a) => a.serviceId === 'srv-noc-internship').length }
  ];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <ScrollReveal variant="fade-up" delayMs={0}>
        <div className="bg-gradient-to-r from-purple-950 via-purple-900 to-blue-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-400/20 text-purple-200 font-extrabold text-xs mb-3 border border-purple-400/30">
                <PanelsTopLeft className="w-4 h-4 text-purple-300" />
                <span>Institutional Administrative Workspace</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">Staff Operational Dashboard</h1>
              <p className="text-purple-100 text-xs sm:text-sm mt-1 max-w-xl">
                Process student application requests, review document pre-checks, monitor academic risk alerts, and manage campus shopping orders.
              </p>
            </div>

            <button
              onClick={() => onNavigate('request-management')}
              className="px-6 py-3 bg-gradient-to-r from-purple-700 to-blue-600 hover:from-purple-800 hover:to-blue-700 text-white font-extrabold text-xs rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all shrink-0"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Open Request Inbox</span>
            </button>
          </div>
        </div>
      </ScrollReveal>

      {/* Operational Stats Grid with Animated Counters */}
      <ScrollReveal variant="fade-up" delayMs={100}>
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          {[
            { label: 'Total Inflow', val: allApps.length, color: 'text-purple-700', bg: 'bg-purple-100/80', icon: FileCheck2 },
            { label: 'Pending Parent', val: pendingParent.length, color: 'text-amber-700', bg: 'bg-amber-100/80', icon: UsersRound },
            { label: 'Pending HOD', val: pendingHOD.length, color: 'text-purple-700', bg: 'bg-purple-100/80', icon: ShieldCheck },
            { label: 'Delayed Requests', val: delayedApps.length, color: 'text-red-700', bg: 'bg-red-100/80', icon: ClockAlert },
            { label: 'Academic Alerts', val: activeAlerts.length, color: 'text-amber-700', bg: 'bg-amber-100/80', icon: AlertTriangle },
            { label: 'Campus Orders', val: foodOrders.length + stationeryOrders.length, color: 'text-blue-700', bg: 'bg-blue-100/80', icon: UtensilsCrossed }
          ].map((s, idx) => {
            const IconComp = s.icon;
            return (
              <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover-card-elevation">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">{s.label}</span>
                  <div className={`p-1.5 rounded-xl ${s.bg} ${s.color}`}>
                    <IconComp className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-extrabold text-slate-900 mt-2">
                  <AnimatedCounter value={s.val} />
                </div>
              </div>
            );
          })}
        </div>
      </ScrollReveal>

      {/* Analytics Charts Row */}
      <ScrollReveal variant="fade-up" delayMs={200}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Recharts Bar Chart: Certificate Applications Volume */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4 hover-card-elevation">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-purple-700" />
                  <span>Certificate Request Distribution</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Application volume per service category</p>
              </div>
            </div>

            <div className="h-56 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#6d28d9" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Priority Inbox Preview */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4 hover-card-elevation">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <ClockAlert className="w-5 h-5 text-purple-700" />
                <span>Priority Request Queue</span>
              </h3>
              <button
                onClick={() => onNavigate('request-management')}
                className="text-xs font-bold text-purple-700 hover:underline"
              >
                View All ({allApps.length})
              </button>
            </div>

            <div className="space-y-3">
              {allApps.slice(0, 3).map((app) => (
                <div
                  key={app.id}
                  onClick={() => onNavigate('request-management')}
                  className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:bg-slate-100/80 transition-colors cursor-pointer flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-extrabold text-slate-900">{app.studentName} ({app.registerNumber})</div>
                    <div className="text-[11px] text-slate-500">{app.serviceTitle} • {app.currentStage}</div>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      app.parentVerificationStatus === 'verified'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {app.parentVerificationStatus === 'verified' ? 'Parent Verified' : 'Parent Pending'}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </ScrollReveal>

    </div>
  );
};
