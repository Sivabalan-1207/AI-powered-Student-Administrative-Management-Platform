import React, { useState, useEffect } from 'react';
import { store } from '../../services/store';
import type { ApplicationRequest, AcademicAlert } from '../../types';
import { AnimatedCounter } from '../../components/AnimatedCounter';
import { ScrollReveal } from '../../components/ScrollReveal';
import {
  LayoutDashboard,
  FileCheck2,
  ClockAlert,
  BellRing,
  Bot,
  UtensilsCrossed,
  ShoppingBag,
  ShoppingCart,
  UsersRound,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  CalendarCheck,
  Building2,
  BadgeAlert
} from 'lucide-react';

interface StudentDashboardProps {
  onNavigate: (page: string) => void;
  onOpenAI: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onNavigate, onOpenAI }) => {
  const [state, setState] = useState(store.getState());

  useEffect(() => {
    return store.subscribe(() => {
      setState(store.getState());
    });
  }, []);

  const student = state.currentUser;
  const myApps = state.applications.filter((a) => a.studentId === student.id);
  const activeRequests = myApps.filter((a) => a.status !== 'completed' && a.status !== 'rejected');
  const completedRequests = myApps.filter((a) => a.status === 'completed' || a.status === 'ready_for_download');
  const pendingActions = myApps.filter((a) => a.status === 'doc_correction_required' || a.parentVerificationStatus === 'pending');
  const delayedRequests = myApps.filter((a) => a.isDelayed);
  const activeAlerts = state.academicAlerts.filter((a) => a.studentId === student.id && a.status === 'active');

  return (
    <div className="space-y-6 pb-12">
      
      {/* Welcome Banner in Purple & Electric Blue Gradient */}
      <ScrollReveal variant="fade-up" delayMs={0}>
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-xs text-purple-100 text-xs font-bold mb-3 border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-blue-300" />
              <span>Academic Semester 2026-2027</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Good morning, {student.name} 👋
            </h1>
            <p className="mt-2 text-purple-100 text-xs sm:text-sm leading-relaxed">
              Manage your college services, track applications, review parent verification status, and stay informed with automatic academic alerts.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3 text-xs">
              <span className="px-3 py-1 bg-white/15 rounded-xl border border-white/20 font-bold font-mono">
                Reg No: {student.registerNumber}
              </span>
              <span className="px-3 py-1 bg-white/15 rounded-xl border border-white/20 font-semibold">
                {student.department} (Year {student.yearOfStudy})
              </span>
            </div>
          </div>

          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-10 translate-y-10">
            <GraduationCap className="w-80 h-80 text-white" />
          </div>
        </div>
      </ScrollReveal>

      {/* Academic Warning Notification Banner if attendance < 75% */}
      {activeAlerts.length > 0 && (
        <ScrollReveal variant="fade-up" delayMs={100}>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs flex items-start justify-between shadow-xs">
            <div className="flex items-start gap-3">
              <BadgeAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-amber-900 text-sm">
                  Academic Alert Notice ({activeAlerts.length} Active Condition)
                </div>
                <div className="text-amber-800 mt-1 leading-relaxed">
                  {activeAlerts[0].guidanceText}
                </div>
              </div>
            </div>
            <button
              onClick={() => onNavigate('academic-alerts')}
              className="px-3.5 py-1.5 bg-amber-600 text-white font-bold rounded-xl hover:bg-amber-700 transition-colors shrink-0 ml-3 shadow-2xs"
            >
              Review Alerts
            </button>
          </div>
        </ScrollReveal>
      )}

      {/* Dashboard Key Statistics Grid with Animated Counter */}
      <ScrollReveal variant="fade-up" delayMs={150}>
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          {[
            { label: 'Active Requests', val: activeRequests.length, color: 'text-purple-700', bg: 'bg-purple-100/80', icon: ClockAlert },
            { label: 'Completed Certificates', val: completedRequests.length, color: 'text-emerald-700', bg: 'bg-emerald-100/80', icon: FileCheck2 },
            { label: 'Pending Actions', val: pendingActions.length, color: 'text-amber-700', bg: 'bg-amber-100/80', icon: UsersRound },
            { label: 'Delayed Requests', val: delayedRequests.length, color: 'text-red-700', bg: 'bg-red-100/80', icon: AlertTriangle },
            { label: 'Academic Alerts', val: activeAlerts.length, color: 'text-blue-700', bg: 'bg-blue-100/80', icon: BellRing },
            { label: 'Campus Orders', val: state.orders.filter((o) => o.userId === student.id).length, color: 'text-purple-700', bg: 'bg-purple-100/80', icon: ShoppingBag }
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

      {/* Quick Action Shortcuts Grid */}
      <ScrollReveal variant="fade-up" delayMs={200}>
        <h2 className="text-base font-extrabold text-slate-900 mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-700" />
          <span>Quick Administrative & Service Actions</span>
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
          {[
            { id: 'new-request', title: 'Apply Certificate', desc: 'Bonafide, Conduct, Loan', icon: FileCheck2, color: 'text-purple-700', bg: 'bg-purple-100/80' },
            { id: 'my-requests', title: 'Track Requests', desc: 'Live stage timeline', icon: ClockAlert, color: 'text-blue-700', bg: 'bg-blue-100/80' },
            { id: 'parent-verify-preview', title: 'Parent Status', desc: 'Independent approval link', icon: UsersRound, color: 'text-purple-700', bg: 'bg-purple-100/80' },
            { id: 'academic-alerts', title: 'Check Attendance', desc: '75% minimum threshold', icon: CalendarCheck, color: 'text-amber-700', bg: 'bg-amber-100/80' },
            { id: 'academic-alerts', title: 'Internal Marks', desc: 'Test scores breakdown', icon: GraduationCap, color: 'text-blue-700', bg: 'bg-blue-100/80' },
            { id: 'academic-alerts', title: 'Academic Alerts', desc: 'Automated warning engine', icon: BellRing, color: 'text-red-700', bg: 'bg-red-100/80' },
            { id: 'food-court', title: 'Open Food Court', desc: 'Meals, snacks & drinks', icon: UtensilsCrossed, color: 'text-emerald-700', bg: 'bg-emerald-100/80' },
            { id: 'stationery-store', title: 'Stationery Store', desc: 'Lab records & notebooks', icon: ShoppingBag, color: 'text-purple-700', bg: 'bg-purple-100/80' },
            { id: 'my-orders', title: 'My Orders & QR', icon: ShoppingCart, desc: 'View collection receipts', color: 'text-blue-700', bg: 'bg-blue-100/80' },
            { id: 'ai-assistant', title: 'Ask Student Assist AI', desc: 'Instant administrative bot', icon: Bot, color: 'text-purple-800', bg: 'bg-purple-200/80', isAI: true }
          ].map((act, idx) => {
            const IconComp = act.icon;
            return (
              <button
                key={idx}
                onClick={() => {
                  if (act.id === 'ai-assistant') onOpenAI();
                  else if (act.id === 'parent-verify-preview') onNavigate('my-requests');
                  else onNavigate(act.id);
                }}
                className={`p-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/80 text-left transition-all hover-card-elevation group ${
                  act.isAI ? 'ring-2 ring-purple-400/40 bg-purple-50/30' : ''
                }`}
              >
                <div className={`w-9 h-9 rounded-xl ${act.bg} ${act.color} flex items-center justify-center mb-2.5 transition-transform group-hover:scale-110`}>
                  <IconComp className="w-5 h-5" />
                </div>
                <div className="font-extrabold text-slate-900 text-xs">{act.title}</div>
                <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{act.desc}</div>
              </button>
            );
          })}
        </div>
      </ScrollReveal>

      {/* Active Requests Timeline Summary Section */}
      <ScrollReveal variant="fade-up" delayMs={250}>
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <ClockAlert className="w-5 h-5 text-purple-700" />
                <span>Active Requests & AI Completion Estimates</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Live status from persistent application registry.
              </p>
            </div>

            <button
              onClick={() => onNavigate('my-requests')}
              className="text-xs font-bold text-purple-700 hover:text-purple-800 flex items-center gap-1"
            >
              <span>View All Tracker</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {myApps.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              No active certificate requests. Click "Apply Certificate" above to submit one.
            </div>
          ) : (
            <div className="space-y-3">
              {myApps.slice(0, 3).map((app) => (
                <div
                  key={app.id}
                  onClick={() => onNavigate('my-requests')}
                  className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:bg-slate-100/80 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 text-sm">{app.serviceTitle}</span>
                      <span className="font-mono text-[10px] text-slate-400 font-bold">{app.requestNumber}</span>
                    </div>
                    <div className="text-slate-600 text-xs">
                      Current Stage: <span className="font-bold text-purple-800">{app.currentStage}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 font-medium">Predicted Completion:</div>
                      <div className="font-bold text-slate-800">
                        {new Date(app.predictedCompletionDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </div>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full font-extrabold uppercase text-[10px] ${
                        app.status === 'ready_for_download'
                          ? 'bg-emerald-100 text-emerald-800'
                          : app.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : app.parentVerificationStatus === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {app.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollReveal>

    </div>
  );
};
