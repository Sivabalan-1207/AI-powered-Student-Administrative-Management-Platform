import React, { useState } from 'react';
import { store } from '../services/store';
import { Logo } from '../components/Logo';
import { ShieldCheck, CheckCircle2, XCircle, AlertTriangle, UsersRound, Calendar, FileText, ArrowLeft } from 'lucide-react';

interface ParentVerificationPageProps {
  onBackToApp?: () => void;
}

export const ParentVerificationPage: React.FC<ParentVerificationPageProps> = ({ onBackToApp }) => {
  const [tokenInput, setTokenInput] = useState('token-parent-99218');
  const [activeRecord, setActiveRecord] = useState(
    store.getState().parentVerifications.find((p) => p.token === 'token-parent-99218') || store.getState().parentVerifications[0]
  );
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [actionDoneMsg, setActionDoneMsg] = useState<{ success: boolean; text: string } | null>(null);

  const handleSearchToken = () => {
    const found = store.getState().parentVerifications.find((p) => p.token === tokenInput.trim() || p.applicationId === tokenInput.trim());
    if (found) {
      setActiveRecord(found);
      setActionDoneMsg(null);
    } else {
      alert('Verification record not found for this token.');
    }
  };

  const handleApprove = () => {
    if (!activeRecord) return;
    const updated = store.verifyParentRequest(activeRecord.token, true);
    if (updated) {
      setActiveRecord({ ...updated });
      setActionDoneMsg({
        success: true,
        text: `Parent Verification Approved! The certificate request for ${updated.studentName} has now been forwarded to the HOD for final department approval.`
      });
    }
  };

  const handleReject = () => {
    if (!activeRecord) return;
    const updated = store.verifyParentRequest(activeRecord.token, false, rejectionReason || 'Declined by parent.');
    if (updated) {
      setActiveRecord({ ...updated });
      setActionDoneMsg({
        success: false,
        text: `Parent Verification Declined. Request has been stopped and marked as rejected.`
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-700 via-indigo-700 to-purple-800 text-white p-6 relative">
          <div className="flex items-center justify-between">
            <Logo iconOnly size="md" />
            <div className="px-3 py-1 bg-white/20 backdrop-blur-xs rounded-full text-[11px] font-bold uppercase tracking-wider">
              Independent Parent Portal
            </div>
          </div>
          <h1 className="text-xl font-extrabold mt-3">Mandatory Parent Certificate Verification</h1>
          <p className="text-teal-100 text-xs mt-1">Secure OTP / Time-Limited Link Endpoint</p>
        </div>

        <div className="p-6 space-y-6">

          {/* Token Search Bar */}
          <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Enter Verification Token / Request ID:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="token-parent-99218"
                className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono text-slate-800"
              />
              <button
                onClick={handleSearchToken}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-colors"
              >
                Load Details
              </button>
            </div>
          </div>

          {actionDoneMsg && (
            <div
              className={`p-4 rounded-xl border text-xs leading-relaxed animate-in fade-in ${
                actionDoneMsg.success ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-red-50 border-red-200 text-red-900'
              }`}
            >
              <div className="font-bold mb-1 flex items-center gap-2">
                {actionDoneMsg.success ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <XCircle className="w-5 h-5 text-red-600" />}
                <span>{actionDoneMsg.success ? 'Verification Confirmed' : 'Verification Rejected'}</span>
              </div>
              <p>{actionDoneMsg.text}</p>
            </div>
          )}

          {activeRecord ? (
            <div className="space-y-4 border border-slate-200 rounded-2xl p-5 bg-white shadow-2xs">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Application Reference</span>
                <span className="font-mono text-xs font-extrabold text-indigo-600">{activeRecord.applicationId}</span>
              </div>

              {/* Request Details Grid */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-slate-400 font-medium">Student Name:</div>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">{activeRecord.studentName}</div>
                </div>

                <div>
                  <div className="text-slate-400 font-medium">Register Number:</div>
                  <div className="font-bold text-slate-900 text-sm mt-0.5 font-mono">{activeRecord.registerNumber}</div>
                </div>

                <div>
                  <div className="text-slate-400 font-medium">Certificate Requested:</div>
                  <div className="font-bold text-indigo-700 text-sm mt-0.5">{activeRecord.serviceTitle}</div>
                </div>

                <div>
                  <div className="text-slate-400 font-medium">Stated Purpose:</div>
                  <div className="font-bold text-slate-800 text-xs mt-0.5">{activeRecord.purpose}</div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Verification Status:</span>
                <span
                  className={`font-extrabold px-2.5 py-1 rounded-md uppercase text-[10px] ${
                    activeRecord.status === 'verified'
                      ? 'bg-emerald-100 text-emerald-800'
                      : activeRecord.status === 'rejected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-amber-100 text-amber-800 animate-pulse'
                  }`}
                >
                  {activeRecord.status}
                </span>
              </div>

              {/* Action Buttons if Pending */}
              {activeRecord.status === 'pending' && (
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="text-xs text-slate-600 bg-teal-50 p-3 rounded-xl border border-teal-100">
                    🔒 **Mandatory Verification Notice:** HOD approval is locked until parent confirmation. By clicking Approve, you certify that this certificate request was requested with your knowledge.
                  </div>

                  {!showRejectForm ? (
                    <div className="flex gap-3">
                      <button
                        onClick={handleApprove}
                        className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors shadow-md shadow-emerald-100 flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Approve Certificate Request</span>
                      </button>

                      <button
                        onClick={() => setShowRejectForm(true)}
                        className="px-4 py-3 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs rounded-xl transition-colors border border-red-200"
                      >
                        Decline Request
                      </button>
                    </div>
                  ) : (
                    <div className="bg-red-50 p-4 rounded-xl border border-red-200 space-y-3">
                      <label className="block text-xs font-bold text-red-900">
                        Reason for Declining Verification:
                      </label>
                      <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Please state why this request is declined..."
                        className="w-full p-2 bg-white border border-red-300 rounded-lg text-xs"
                        rows={2}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleReject}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg"
                        >
                          Confirm Rejection
                        </button>
                        <button
                          onClick={() => setShowRejectForm(false)}
                          className="px-4 py-2 bg-slate-200 text-slate-700 text-xs font-bold rounded-lg"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          ) : (
            <div className="text-center py-8 text-slate-400 text-xs">
              No verification record loaded. Use the search bar above.
            </div>
          )}

          {onBackToApp && (
            <div className="pt-2 text-center">
              <button
                onClick={onBackToApp}
                className="text-xs text-indigo-600 font-bold hover:underline inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Main CampusConnect Platform</span>
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
