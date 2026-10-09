import React, { useState, useEffect } from 'react';
import { store } from '../../services/store';
import { ShieldCheck, CheckCircle2, XCircle, AlertTriangle, Lock, UsersRound } from 'lucide-react';

export const HODApprovalPage: React.FC = () => {
  const [state, setState] = useState(store.getState());
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null);

  useEffect(() => {
    return store.subscribe(() => {
      setState(store.getState());
    });
  }, []);

  const hodUser = state.currentUser;
  const hodPendingRequests = state.applications.filter((a) => a.serviceId === 'srv-bonafide' || a.serviceId === 'srv-loan' || a.serviceId === 'srv-conduct' || a.serviceId === 'srv-noc-internship');

  const handleApprove = (reqId: string) => {
    try {
      store.hodApproveRequest(reqId, true);
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleReject = (reqId: string) => {
    try {
      store.hodApproveRequest(reqId, false, rejectionReason || 'Declined by HOD.');
      setShowRejectModal(null);
      setRejectionReason('');
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-500/20 rounded-2xl border border-purple-400/30">
            <ShieldCheck className="w-8 h-8 text-purple-300" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold">Department HOD Approval Workspace</h1>
            <p className="text-purple-200 text-xs mt-1">
              Reviewing applications for {hodUser.department}. Mandatory prerequisite: Parent verification must be verified.
            </p>
          </div>
        </div>
      </div>

      {/* Mandatory Control Notice */}
      <div className="bg-purple-50 border border-purple-200 p-4 rounded-2xl text-xs text-purple-900 flex items-start gap-3">
        <Lock className="w-5 h-5 text-purple-700 shrink-0 mt-0.5" />
        <div>
          <div className="font-bold text-sm">Server-Side Security Enforcement</div>
          <div className="mt-0.5 leading-relaxed">
            Requests requiring parent verification are strictly locked until the parent confirms verification independently. HOD approval controls are enabled automatically upon parent verification completion.
          </div>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {hodPendingRequests.map((req) => {
          const isParentVerified = req.parentVerificationStatus === 'verified';
          const isHodApproved = req.hodApprovalStatus === 'approved';
          const isHodRejected = req.hodApprovalStatus === 'rejected';

          return (
            <div
              key={req.id}
              className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <span className="font-mono text-xs font-extrabold text-indigo-600">{req.requestNumber}</span>
                  <h3 className="text-base font-extrabold text-slate-900">{req.serviceTitle}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                      isParentVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    Parent: {req.parentVerificationStatus.toUpperCase()}
                  </span>

                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                      isHodApproved
                        ? 'bg-emerald-600 text-white'
                        : isHodRejected
                        ? 'bg-red-600 text-white'
                        : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    HOD: {req.hodApprovalStatus.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-slate-400 font-medium">Student Name:</span>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">{req.studentName}</div>
                  <div className="text-[11px] text-slate-500">{req.registerNumber} • Year {req.yearOfStudy}</div>
                </div>

                <div>
                  <span className="text-slate-400 font-medium">Purpose:</span>
                  <div className="font-bold text-slate-800 mt-0.5">{req.purpose}</div>
                </div>

                <div>
                  <span className="text-slate-400 font-medium">Submission Date:</span>
                  <div className="font-bold text-slate-800 mt-0.5">{new Date(req.submittedAt).toLocaleString()}</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                {!isParentVerified && req.parentVerificationStatus === 'pending' ? (
                  <div className="text-xs font-bold text-amber-700 bg-amber-50 px-4 py-2 rounded-xl border border-amber-200 flex items-center gap-1.5">
                    <Lock className="w-4 h-4" />
                    <span>HOD Approval Locked (Awaiting Parent Verification)</span>
                  </div>
                ) : isHodApproved ? (
                  <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Approved by HOD ({new Date(req.hodApprovedAt!).toLocaleDateString()})</span>
                  </div>
                ) : isHodRejected ? (
                  <div className="text-xs font-bold text-red-700 bg-red-50 px-4 py-2 rounded-xl border border-red-200">
                    Rejected by HOD
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleApprove(req.id)}
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Grant HOD Approval</span>
                    </button>

                    <button
                      onClick={() => setShowRejectModal(req.id)}
                      className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs rounded-xl border border-red-200"
                    >
                      Reject Request
                    </button>
                  </div>
                )}
              </div>

              {/* Reject Form Modal / Expansion */}
              {showRejectModal === req.id && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs space-y-3">
                  <label className="block font-bold text-red-900">Reason for HOD Rejection:</label>
                  <textarea
                    rows={2}
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Provide reason for declining department sanction..."
                    className="w-full p-2 bg-white border border-red-300 rounded-xl"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleReject(req.id)}
                      className="px-4 py-2 bg-red-600 text-white font-bold rounded-xl"
                    >
                      Confirm Rejection
                    </button>
                    <button
                      onClick={() => setShowRejectModal(null)}
                      className="px-4 py-2 bg-slate-200 text-slate-700 font-bold rounded-xl"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
};
