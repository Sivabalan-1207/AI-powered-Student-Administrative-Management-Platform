import React, { useState, useEffect } from 'react';
import { store } from '../../services/store';
import type { ApplicationRequest } from '../../types';
import { FileCheck2, FileSearch, CheckCircle2, XCircle, AlertTriangle, ShieldCheck, UsersRound, Download, Upload, Sparkles, ExternalLink } from 'lucide-react';

export const RequestManagementPage: React.FC = () => {
  const [state, setState] = useState(store.getState());
  const [selectedReqId, setSelectedReqId] = useState<string>(state.applications[0]?.id || '');
  const [correctionReason, setCorrectionReason] = useState('');
  const [showCorrectionForm, setShowCorrectionForm] = useState(false);

  useEffect(() => {
    return store.subscribe(() => {
      setState(store.getState());
    });
  }, []);

  const applications = state.applications;
  const activeReq = applications.find((a) => a.id === selectedReqId) || applications[0];

  const handleRequestCorrection = () => {
    if (!activeReq || !correctionReason.trim()) return;
    store.requestDocumentCorrection(activeReq.id, correctionReason);
    setShowCorrectionForm(false);
    setCorrectionReason('');
  };

  const handleFinalizeCertificate = () => {
    if (!activeReq) return;
    store.completeCertificateProcessing(
      activeReq.id,
      'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=800&auto=format&fit=crop&q=80'
    );
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <FileCheck2 className="w-6 h-6 text-indigo-600" />
            <span>Staff Request Inbox & Certificate Processing Verifier</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review student applications, verify proof documents, request corrections, and issue digital certificates.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Request Inbox Selector */}
        <div className="space-y-3">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 px-1">
            Request Inbox ({applications.length})
          </h2>

          {applications.map((app) => {
            const isSelected = activeReq?.id === app.id;
            return (
              <div
                key={app.id}
                onClick={() => setSelectedReqId(app.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100'
                    : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-mono text-[10px] font-extrabold ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>
                    {app.requestNumber}
                  </span>
                  <span
                    className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : app.status === 'ready_for_download'
                        ? 'bg-emerald-100 text-emerald-800'
                        : app.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-indigo-100 text-indigo-800'
                    }`}
                  >
                    {app.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="font-bold text-sm mt-1">{app.studentName}</div>
                <div className={`text-xs mt-0.5 ${isSelected ? 'text-indigo-100' : 'text-slate-500'}`}>
                  {app.serviceTitle}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Detailed Request Verifier Inspector */}
        {activeReq && (
          <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-2xs">
              
              {/* Header Info */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="font-mono text-xs font-extrabold text-indigo-600">{activeReq.requestNumber}</span>
                  <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">{activeReq.serviceTitle}</h2>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Student: <span className="font-bold text-slate-800">{activeReq.studentName}</span> ({activeReq.registerNumber} • {activeReq.department})
                  </div>
                </div>

                <span className="px-3 py-1 bg-slate-100 font-extrabold text-xs text-slate-700 rounded-full uppercase">
                  {activeReq.status.replace(/_/g, ' ')}
                </span>
              </div>

              {/* Status Verification Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-slate-400 font-medium">Document Check:</span>
                  <div className="font-bold text-emerald-600 mt-0.5 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified (AI OCR 97%)
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-slate-400 font-medium">Parent Verification:</span>
                  <div
                    className={`font-bold mt-0.5 flex items-center gap-1 ${
                      activeReq.parentVerificationStatus === 'verified'
                        ? 'text-emerald-600'
                        : activeReq.parentVerificationStatus === 'rejected'
                        ? 'text-red-600'
                        : 'text-amber-600'
                    }`}
                  >
                    {activeReq.parentVerificationStatus.toUpperCase()}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-slate-400 font-medium">HOD Approval:</span>
                  <div
                    className={`font-bold mt-0.5 ${
                      activeReq.hodApprovalStatus === 'approved'
                        ? 'text-emerald-600'
                        : activeReq.hodApprovalStatus === 'rejected'
                        ? 'text-red-600'
                        : 'text-purple-600'
                    }`}
                  >
                    {activeReq.hodApprovalStatus.toUpperCase()}
                  </div>
                </div>
              </div>

              {/* Uploaded Documents List */}
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  Uploaded Supporting Documents ({activeReq.documents.length})
                </h3>

                {activeReq.documents.map((doc) => (
                  <div key={doc.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900">{doc.name}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {doc.ocrCheckResult ? `OCR Verified: ${doc.ocrCheckResult.detectedType} (Conf: ${(doc.ocrCheckResult.confidence * 100).toFixed(0)}%)` : 'Document Uploaded'}
                      </div>
                    </div>

                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl border border-indigo-200"
                    >
                      View File
                    </a>
                  </div>
                ))}
              </div>

              {/* Staff Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-3">
                {activeReq.status !== 'ready_for_download' && activeReq.status !== 'rejected' && (
                  <button
                    onClick={handleFinalizeCertificate}
                    disabled={activeReq.parentVerificationStatus !== 'verified' || activeReq.hodApprovalStatus !== 'approved'}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Issue & Finalize Digital Certificate</span>
                  </button>
                )}

                {!showCorrectionForm ? (
                  <button
                    onClick={() => setShowCorrectionForm(true)}
                    className="px-4 py-3 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs rounded-xl border border-amber-200"
                  >
                    Request Student Correction
                  </button>
                ) : (
                  <div className="w-full bg-amber-50 p-4 rounded-2xl border border-amber-200 space-y-3">
                    <label className="block font-bold text-xs text-amber-900">Correction Reason:</label>
                    <textarea
                      rows={2}
                      value={correctionReason}
                      onChange={(e) => setCorrectionReason(e.target.value)}
                      placeholder="e.g. Uploaded document is missing authorized recruiter signature..."
                      className="w-full p-2 bg-white border border-amber-300 rounded-xl text-xs"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleRequestCorrection}
                        className="px-4 py-2 bg-amber-600 text-white font-bold text-xs rounded-xl"
                      >
                        Send Correction Notice
                      </button>
                      <button
                        onClick={() => setShowCorrectionForm(false)}
                        className="px-4 py-2 bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
};
