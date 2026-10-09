import React, { useState, useEffect } from 'react';
import { store } from '../../services/store';
import { GraduationCap, BellRing, Settings, CheckCircle2, AlertTriangle, Download, Search } from 'lucide-react';

export const AcademicMonitoringPage: React.FC = () => {
  const [state, setState] = useState(store.getState());
  const [selectedDepartment, setSelectedDepartment] = useState('Computer Science & Engineering');
  const [minAttendanceInput, setMinAttendanceInput] = useState(75);
  const [minMarkInput, setMinMarkInput] = useState(50);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  useEffect(() => {
    return store.subscribe(() => {
      setState(store.getState());
    });
  }, []);

  const thresholds = state.thresholds;
  const currentThresh = thresholds.find((t) => t.department === selectedDepartment) || {
    minAttendancePercentage: 75.0,
    minInternalMarkPercentage: 50.0
  };

  useEffect(() => {
    setMinAttendanceInput(currentThresh.minAttendancePercentage);
    setMinMarkInput(currentThresh.minInternalMarkPercentage);
  }, [selectedDepartment, currentThresh]);

  const handleSaveThreshold = (e: React.FormEvent) => {
    e.preventDefault();
    store.updateAcademicThreshold(selectedDepartment, minAttendanceInput, minMarkInput);
    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 3000);
  };

  const academicRecords = state.academicRecords;
  const activeAlerts = state.academicAlerts.filter((a) => a.status === 'active');

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-amber-600" />
            <span>Staff Academic Monitoring & Threshold Control Hub</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure institutional attendance/mark thresholds and inspect automated low-attendance warnings.
          </p>
        </div>
      </div>

      {/* Threshold Configuration Panel */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
        <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
          <Settings className="w-5 h-5 text-indigo-600" />
          <span>Configure Department Academic Alert Thresholds</span>
        </h2>

        {saveSuccessMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Thresholds updated successfully! Automatic student alerts re-evaluated.</span>
          </div>
        )}

        <form onSubmit={handleSaveThreshold} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Target Department:</label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium"
            >
              <option value="Computer Science & Engineering">Computer Science & Engineering</option>
              <option value="Electronics & Communication">Electronics & Communication</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Min Attendance Threshold (%):</label>
            <input
              type="number"
              min="50"
              max="95"
              value={minAttendanceInput}
              onChange={(e) => setMinAttendanceInput(Number(e.target.value))}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-indigo-600"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Min Internal Mark Target (%):</label>
            <input
              type="number"
              min="30"
              max="80"
              value={minMarkInput}
              onChange={(e) => setMinMarkInput(Number(e.target.value))}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-teal-600"
            />
          </div>

          <div className="sm:col-span-3 pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
            >
              Save Thresholds & Re-evaluate Alerts
            </button>
          </div>
        </form>
      </div>

      {/* Active Academic Risk Table */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <BellRing className="w-5 h-5 text-amber-600" />
            <span>Students Below Academic Thresholds ({activeAlerts.length})</span>
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase text-[10px] font-bold">
                <th className="py-3 px-4">Student Name & Reg No</th>
                <th className="py-3 px-4">Course</th>
                <th className="py-3 px-4">Condition Type</th>
                <th className="py-3 px-4">Current Value</th>
                <th className="py-3 px-4">Threshold</th>
                <th className="py-3 px-4">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activeAlerts.map((alert) => (
                <tr key={alert.id} className="hover:bg-amber-50/40">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    <div>{alert.studentName}</div>
                    <div className="font-mono text-[10px] text-slate-400 font-normal">{alert.registerNumber}</div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">
                    {alert.courseCode} - {alert.courseName}
                  </td>
                  <td className="py-3.5 px-4 uppercase text-[10px] font-bold">
                    {alert.type === 'attendance' ? 'Attendance' : 'Internal Mark'}
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-red-600">
                    {alert.currentValue}%
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-700">
                    {alert.thresholdValue}%
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-extrabold text-[10px] uppercase">
                      {alert.severity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
