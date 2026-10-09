import React, { useState, useEffect } from 'react';
import { store } from '../../services/store';
import { BellRing, GraduationCap, CalendarCheck, AlertTriangle, CheckCircle2, Info, BookOpen } from 'lucide-react';

export const AcademicAlertsPage: React.FC = () => {
  const [state, setState] = useState(store.getState());

  useEffect(() => {
    return store.subscribe(() => {
      setState(store.getState());
    });
  }, []);

  const student = state.currentUser;
  const myAlerts = state.academicAlerts.filter((a) => a.studentId === student.id);
  const myRecords = state.academicRecords.filter((r) => r.studentId === student.id);

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <BellRing className="w-6 h-6 text-amber-600" />
          <span>Automatic Academic Alerts & Attendance Monitoring</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Automated academic risk engine evaluating attendance against the mandatory 75% threshold and internal test marks.
        </p>
      </div>

      {/* Active Academic Alert Cards */}
      <div className="space-y-4">
        <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-700">
          Active Warning Notifications ({myAlerts.filter((a) => a.status === 'active').length})
        </h2>

        {myAlerts.filter((a) => a.status === 'active').length === 0 ? (
          <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-3xl text-emerald-900 text-xs flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <div className="font-extrabold text-sm">All Academic Targets Satisfied</div>
              <div className="mt-0.5 text-emerald-800">
                Your attendance is above the 75% minimum threshold and internal assessment test marks are in good standing.
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myAlerts.filter((a) => a.status === 'active').map((alert) => (
              <div
                key={alert.id}
                className="p-5 rounded-3xl bg-amber-50/90 border border-amber-200 text-amber-950 space-y-3 shadow-2xs"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 font-extrabold text-sm text-amber-900">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                    <span>{alert.type === 'attendance' ? 'Low Attendance Alert' : 'Low Internal Score Alert'}</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 font-extrabold text-[10px] uppercase">
                    {alert.severity}
                  </span>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-amber-200/80 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{alert.courseCode} - {alert.courseName}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                    <span className="text-slate-500">Current Value:</span>
                    <span className="font-extrabold text-red-600 text-sm">{alert.currentValue}%</span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Required Threshold:</span>
                    <span className="font-bold text-slate-800">{alert.thresholdValue}%</span>
                  </div>
                </div>

                <p className="text-xs text-amber-900 leading-relaxed font-medium">
                  {alert.guidanceText}
                </p>

                <div className="text-[10px] text-amber-700 font-semibold pt-2 border-t border-amber-200/60">
                  Generated on {new Date(alert.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Course Breakdown Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-2xs">
        <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-indigo-600" />
          <span>Semester Course Performance Breakdown</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase text-[10px] font-bold">
                <th className="py-3 px-4">Course Code & Name</th>
                <th className="py-3 px-4">Attended / Total</th>
                <th className="py-3 px-4">Attendance %</th>
                <th className="py-3 px-4">Internal Score</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {myRecords.map((rec) => {
                const isAttLow = rec.attendancePercentage < 75;
                const isMarkLow = rec.normalizedMarkPercentage < 50;

                return (
                  <tr key={rec.id} className="hover:bg-slate-50/80">
                    <td className="py-3.5 px-4 font-bold">
                      {rec.courseCode} - {rec.courseName}
                    </td>
                    <td className="py-3.5 px-4 font-medium">
                      {rec.attendedClasses} / {rec.totalClasses} classes
                    </td>
                    <td className={`py-3.5 px-4 font-extrabold ${isAttLow ? 'text-red-600' : 'text-emerald-600'}`}>
                      {rec.attendancePercentage}%
                    </td>
                    <td className={`py-3.5 px-4 font-bold ${isMarkLow ? 'text-amber-600' : 'text-slate-900'}`}>
                      {rec.internalMark} / {rec.maxInternalMark} ({rec.normalizedMarkPercentage}%)
                    </td>
                    <td className="py-3.5 px-4">
                      {isAttLow ? (
                        <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 font-extrabold text-[10px]">
                          Below 75%
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-extrabold text-[10px]">
                          Good Standing
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
