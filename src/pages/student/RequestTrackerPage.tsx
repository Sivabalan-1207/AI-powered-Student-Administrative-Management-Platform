import React, { useState, useEffect } from 'react';
import { store } from '../../services/store';
import type { ApplicationRequest } from '../../types';
import { ScrollReveal } from '../../components/ScrollReveal';
import {
  ClockAlert,
  BrainCircuit,
  Workflow,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileCheck2,
  ShieldCheck,
  UsersRound,
  Download,
  Upload,
  Sparkles,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface RequestTrackerPageProps {
  onNavigate: (page: string) => void;
  onOpenParentPortalDemo?: () => void;
}

export const RequestTrackerPage: React.FC<RequestTrackerPageProps> = ({ onNavigate, onOpenParentPortalDemo }) => {
  const [state, setState] = useState(store.getState());

  useEffect(() => {
    return store.subscribe(() => {
      setState(store.getState());
    });
  }, []);

  const myRequests = state.applications.filter((a) => a.studentId === state.currentUser.id);
  const [selectedReqId, setSelectedReqId] = useState<string>(myRequests[0]?.id || '');

  const activeRequest = myRequests.find((a) => a.id === selectedReqId) || myRequests[0];

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // Timeline Stage Builder
  const getTimelineStages = (req: ApplicationRequest) => {
    return [
      {
        id: 'stage-1',
        title: 'Request Submitted',
        desc: `Submitted on ${new Date(req.submittedAt).toLocaleDateString()}`,
        status: 'completed'
      },
      {
        id: 'stage-2',
        title: 'Document Verification',
        desc: 'AI OCR pre-checks completed',
        status: req.status === 'doc_correction_required' ? 'failed' : 'completed'
      },
      {
        id: 'stage-3',
        title: 'Parent Verification',
        desc: req.parentVerificationStatus === 'verified'
          ? 'Approved independently by parent'
          : req.parentVerificationStatus === 'rejected'
          ? 'Declined by parent'
          : 'Awaiting parent response token',
        status: req.parentVerificationStatus === 'verified'
          ? 'completed'
          : req.parentVerificationStatus === 'rejected'
          ? 'failed'
          : 'current'
      },
      {
        id: 'stage-4',
        title: 'Department HOD Approval',
        desc: req.hodApprovalStatus === 'approved'
          ? 'Approved by Dr. Vance (HOD)'
          : req.hodApprovalStatus === 'rejected'
          ? 'Rejected by HOD'
          : req.parentVerificationStatus !== 'verified'
          ? 'Locked until parent verification succeeds'
          : 'Pending HOD review',
        status: req.hodApprovalStatus === 'approved'
          ? 'completed'
          : req.hodApprovalStatus === 'rejected'
          ? 'failed'
          : req.parentVerificationStatus === 'verified' && req.hodApprovalStatus === 'pending'
          ? 'current'
          : 'pending'
      },
      {
        id: 'stage-5',
        title: 'Administrative Seal & Processing',
        desc: 'Registry verification & embossing',
        status: req.status === 'ready_for_download' || req.status === 'completed'
          ? 'completed'
          : req.status === 'processing'
          ? 'current'
          : 'pending'
      },
      {
        id: 'stage-6',
        title: 'Ready for Download',
        desc: 'Digital signed certificate generated',
        status: req.status === 'ready_for_download' || req.status === 'completed' ? 'completed' : 'pending'
      }
    ];
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <ScrollReveal variant="fade-up" delayMs={0}>
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <Workflow className="w-6 h-6 text-purple-700" />
              <span>Live Request Progress Tracker & AI Estimator</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Real-time status tracking, predictive completion date calculation, and automatic delay monitoring.
            </p>
          </div>

          <button
            onClick={() => onNavigate('new-request')}
            className="px-4 py-2 bg-gradient-to-r from-purple-700 to-blue-600 hover:from-purple-800 hover:to-blue-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors"
          >
            + New Request
          </button>
        </div>
      </ScrollReveal>

      {myRequests.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 text-slate-400 text-xs">
          No application requests found. Click "+ New Request" to create one.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Request List Selector */}
          <div className="space-y-3">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 px-1">
              Select Active Request ({myRequests.length})
            </h2>

            {myRequests.map((req) => {
              const isSelected = activeRequest?.id === req.id;
              return (
                <div
                  key={req.id}
                  onClick={() => setSelectedReqId(req.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-purple-700 to-blue-600 text-white border-purple-700 shadow-md shadow-purple-900/15'
                      : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-mono text-[10px] font-extrabold ${isSelected ? 'text-purple-200' : 'text-slate-400'}`}>
                      {req.requestNumber}
                    </span>
                    <span
                      className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : req.status === 'ready_for_download'
                          ? 'bg-emerald-100 text-emerald-800'
                          : req.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {req.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="font-bold text-sm mt-1">{req.serviceTitle}</div>
                  <div className={`text-xs mt-1 ${isSelected ? 'text-purple-100' : 'text-slate-500'}`}>
                    {req.currentStage}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Detailed Timeline & AI Prediction Card */}
          {activeRequest && (
            <div className="lg:col-span-2 space-y-6">
              
              {/* AI Turnaround Prediction Card in Purple & Electric Blue Gradient */}
              <ScrollReveal variant="fade-up" delayMs={100}>
                <div className="bg-gradient-to-br from-purple-950 via-purple-900 to-blue-900 rounded-3xl p-6 text-white shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-purple-500/30 flex items-center justify-center border border-purple-400/30">
                        <BrainCircuit className="w-4 h-4 text-purple-200" />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-purple-100">AI Completion Turnaround Estimate</div>
                        <div className="text-[10px] text-purple-300">Machine Learning Predictive Model</div>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-full bg-emerald-400/20 text-emerald-300 font-extrabold text-[10px] border border-emerald-400/30">
                      {(activeRequest.confidenceScore * 100).toFixed(0)}% Confidence
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                    <div>
                      <div className="text-[11px] text-purple-300 font-medium">Estimated Completion:</div>
                      <div className="text-xl font-extrabold text-white mt-0.5">
                        {new Date(activeRequest.predictedCompletionDate).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                    </div>

                    <div>
                      <div className="text-[11px] text-purple-300 font-medium">Target Standard Days:</div>
                      <div className="text-xl font-extrabold text-blue-300 mt-0.5">
                        {new Date(activeRequest.targetCompletionDate).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Prediction Factors */}
                  <div className="space-y-1 text-xs">
                    <div className="text-[11px] font-bold text-purple-200 uppercase tracking-wider">Influencing Factors:</div>
                    <ul className="space-y-1 text-purple-100 text-[11px]">
                      {activeRequest.predictionFactors.map((f, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <Sparkles className="w-3 h-3 text-purple-300 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </ScrollReveal>

              {/* Automatic Delay Detection Alert Banner */}
              {activeRequest.isDelayed && (
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-xs text-amber-900 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-sm">Potential Delay Detected</div>
                    <div className="mt-0.5 leading-relaxed">
                      {activeRequest.delayReason || 'Your request may require additional processing time due to departmental workload.'}
                    </div>
                  </div>
                </div>
              )}

              {/* Parent Verification Quick Action Demo Banner */}
              {activeRequest.parentVerificationStatus === 'pending' && (
                <div className="bg-purple-50 border border-purple-200 p-4 rounded-2xl text-xs text-purple-900 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <UsersRound className="w-5 h-5 text-purple-700 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-sm">Parent Verification Required</div>
                      <div className="mt-0.5 text-purple-800">
                        Token link sent to parent contact. HOD approval will unlock automatically once verified.
                      </div>
                    </div>
                  </div>

                  {onOpenParentPortalDemo && (
                    <button
                      onClick={onOpenParentPortalDemo}
                      className="px-3.5 py-1.5 bg-purple-700 text-white font-bold text-xs rounded-xl hover:bg-purple-800 transition-colors shrink-0 shadow-2xs flex items-center gap-1"
                    >
                      <span>Parent Portal</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}

              {/* Rejection Section */}
              {activeRequest.status === 'rejected' && activeRequest.rejectionReason && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-2xl text-xs text-red-900 space-y-2">
                  <div className="font-bold text-sm flex items-center gap-2 text-red-700">
                    <XCircle className="w-5 h-5 text-red-600" />
                    <span>Application Rejected</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-red-200 font-medium">
                    Reason: {activeRequest.rejectionReason}
                  </div>
                </div>
              )}

              {/* Ready for Download Banner */}
              {activeRequest.status === 'ready_for_download' && (
                <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-3xl text-xs text-emerald-900 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      <FileCheck2 className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-extrabold text-base text-emerald-900">Certificate Ready for Download!</div>
                      <div className="text-emerald-700 text-xs">Official digitally signed PDF with institutional seal.</div>
                    </div>
                  </div>

                  <a
                    href={activeRequest.issuedCertificateUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={triggerConfetti}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl shadow-lg shadow-emerald-200 transition-all flex items-center gap-2 shrink-0"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Certificate PDF</span>
                  </a>
                </div>
              )}

              {/* Visual Timeline Tracker */}
              <ScrollReveal variant="fade-up" delayMs={200}>
                <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-2xs">
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <Workflow className="w-5 h-5 text-purple-700" />
                    <span>Request Stage Timeline ({activeRequest.requestNumber})</span>
                  </h3>

                  <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                    {getTimelineStages(activeRequest).map((stg, idx) => (
                      <div key={stg.id} className="relative flex items-start gap-4">
                        {/* Stage Circle */}
                        <div
                          className={`absolute -left-6 top-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${
                            stg.status === 'completed'
                              ? 'bg-emerald-500 border-emerald-500 text-white'
                              : stg.status === 'failed'
                              ? 'bg-red-500 border-red-500 text-white'
                              : stg.status === 'current'
                              ? 'bg-purple-700 border-purple-700 text-white animate-pulse'
                              : 'bg-white border-slate-300 text-slate-400'
                          }`}
                        >
                          {stg.status === 'completed' ? '✓' : idx + 1}
                        </div>

                        <div className="flex-1 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80">
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-slate-900 text-xs">{stg.title}</span>
                            <span
                              className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                                stg.status === 'completed'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : stg.status === 'failed'
                                  ? 'bg-red-100 text-red-800'
                                  : stg.status === 'current'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-slate-200 text-slate-600'
                              }`}
                            >
                              {stg.status}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-1">{stg.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

            </div>
          )}

        </div>
      )}

    </div>
  );
};
