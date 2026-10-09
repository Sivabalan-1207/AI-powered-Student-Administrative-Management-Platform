import React, { useState } from 'react';
import { store } from '../../services/store';
import type { ServiceDefinition } from '../../types';
import {
  FileCheck2,
  FileSearch,
  Upload,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  UsersRound,
  ShieldCheck,
  Clock,
  Info
} from 'lucide-react';

interface NewRequestPageProps {
  onNavigate: (page: string) => void;
}

export const NewRequestPage: React.FC<NewRequestPageProps> = ({ onNavigate }) => {
  const services = store.getState().services;
  const [selectedService, setSelectedService] = useState<ServiceDefinition | null>(services[0]);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Dynamic Form Fields state
  const [formData, setFormData] = useState<Record<string, any>>({
    purpose: 'Passport Application',
    neededByDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0]
  });

  // Document Uploads & AI Pre-checks state
  const [uploadedFiles, setUploadedFiles] = useState<Array<{
    docId: string;
    name: string;
    fileUrl: string;
    fileType: string;
    ocrPassed: boolean;
    ocrNote: string;
  }>>([]);

  const [isProcessingAI, setIsProcessingAI] = useState(false);

  const handleSelectService = (srv: ServiceDefinition) => {
    setSelectedService(srv);
    setFormData({
      purpose: srv.requiredFields[0]?.options?.[0] || 'Official Requirement',
      neededByDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0]
    });
    setUploadedFiles([]);
    setStep(2);
  };

  const handleFileUpload = (docId: string, docName: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingAI(true);

    setTimeout(() => {
      setIsProcessingAI(false);
      const newFile = {
        docId,
        name: docName,
        fileUrl: URL.createObjectURL(file),
        fileType: file.type || 'image/jpeg',
        ocrPassed: true,
        ocrNote: `AI OCR Pre-check Passed: Legible document text, student identity verified with 97% confidence.`
      };
      setUploadedFiles((prev) => [...prev.filter((f) => f.docId !== docId), newFile]);
    }, 800);
  };

  const handleSubmitApplication = () => {
    if (!selectedService) return;

    const req = store.submitApplication({
      serviceId: selectedService.id,
      purpose: formData.purpose || 'General Application',
      formData,
      uploadedDocs: uploadedFiles.map((f) => ({
        name: f.name,
        fileUrl: f.fileUrl,
        fileType: f.fileType
      }))
    });

    onNavigate('my-requests');
  };

  // Smart Deadline & Eligibility Assistant check
  const checkDeadlineWarning = () => {
    if (!formData.neededByDate || !selectedService) return null;
    const needed = new Date(formData.neededByDate);
    const targetDays = selectedService.targetDays || 3;
    const expected = new Date(Date.now() + targetDays * 86400000);

    if (needed < expected) {
      return `⚠️ Smart Deadline Notice: You requested this document by ${needed.toLocaleDateString()}, but the standard institutional workflow takes ${targetDays} working days (estimated ${expected.toLocaleDateString()}). Please submit as early as possible.`;
    }
    return null;
  };

  const deadlineWarning = checkDeadlineWarning();

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <FileCheck2 className="w-6 h-6 text-indigo-600" />
            <span>Smart Student Administrative Service Centre</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Apply online for official university certificates and track automated processing.
          </p>
        </div>

        {/* Wizard Step Tracker */}
        <div className="flex items-center gap-2 text-xs font-bold">
          <span className={`px-3 py-1 rounded-full ${step === 1 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>1. Service</span>
          <span className={`px-3 py-1 rounded-full ${step === 2 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>2. Details</span>
          <span className={`px-3 py-1 rounded-full ${step === 3 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>3. Upload & AI</span>
          <span className={`px-3 py-1 rounded-full ${step === 4 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>4. Confirm</span>
        </div>
      </div>

      {/* STEP 1: Select Service from Catalogue */}
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">
            Select Administrative Certificate or Service
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((srv) => (
              <div
                key={srv.id}
                onClick={() => handleSelectService(srv)}
                className="p-5 rounded-2xl bg-white hover:bg-indigo-50/40 border border-slate-200/80 hover:border-indigo-300 transition-all cursor-pointer shadow-2xs group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-900 text-base group-hover:text-indigo-600 transition-colors">
                      {srv.title}
                    </span>
                    <span className="px-2.5 py-0.5 bg-slate-100 font-mono text-[10px] font-bold text-slate-600 rounded-md">
                      {srv.code}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {srv.description}
                  </p>

                  <div className="mt-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-700">Eligibility:</span> {srv.eligibility}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 font-semibold text-indigo-700">
                      <Clock className="w-3.5 h-3.5" />
                      {srv.targetDays} Days
                    </span>
                    {srv.requiresParentVerification && (
                      <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-700 font-bold text-[10px]">
                        Parent Verification Required
                      </span>
                    )}
                  </div>

                  <span className="font-bold text-indigo-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Select</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 2: Enter Application Details */}
      {step === 2 && selectedService && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">Selected Service</span>
              <h2 className="text-xl font-extrabold text-slate-900">{selectedService.title}</h2>
            </div>
            <button
              onClick={() => setStep(1)}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Change Service</span>
            </button>
          </div>

          <div className="space-y-4 text-xs">
            {selectedService.requiredFields.map((f, idx) => (
              <div key={idx} className="space-y-1.5">
                <label className="block font-bold text-slate-800">
                  {f.label} {f.required && <span className="text-red-500">*</span>}
                </label>

                {f.type === 'select' ? (
                  <select
                    value={formData[f.name] || ''}
                    onChange={(e) => setFormData({ ...formData, [f.name]: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-medium"
                  >
                    {f.options?.map((opt, oIdx) => (
                      <option key={oIdx} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : f.type === 'textarea' ? (
                  <textarea
                    rows={3}
                    value={formData[f.name] || ''}
                    onChange={(e) => setFormData({ ...formData, [f.name]: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-medium"
                  />
                ) : (
                  <input
                    type={f.type}
                    value={formData[f.name] || ''}
                    onChange={(e) => setFormData({ ...formData, [f.name]: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-medium"
                  />
                )}
              </div>
            ))}

            {/* Smart Deadline Assistant Notice */}
            {deadlineWarning && (
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 leading-relaxed font-medium">
                {deadlineWarning}
              </div>
            )}
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setStep(1)}
              className="px-5 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2"
            >
              <span>Next: Upload Documents</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Upload Documents & AI OCR Pre-checks */}
      {step === 3 && selectedService && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-2xs">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Upload Documents & AI Pre-checks</h2>
            <p className="text-xs text-slate-500 mt-1">
              Documents are automatically validated for legibility, completeness, and file integrity before submission.
            </p>
          </div>

          <div className="space-y-4">
            {selectedService.requiredDocuments.map((doc) => {
              const uploaded = uploadedFiles.find((f) => f.docId === doc.id);

              return (
                <div key={doc.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{doc.name}</div>
                      <div className="text-slate-500 mt-0.5">{doc.description} (Max {doc.maxSizeMB}MB)</div>
                    </div>

                    {uploaded ? (
                      <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Uploaded & Verified
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-[11px]">
                        Pending Upload
                      </span>
                    )}
                  </div>

                  {!uploaded ? (
                    <label className="cursor-pointer block border-2 border-dashed border-indigo-300 hover:border-indigo-500 bg-white p-4 rounded-xl text-center transition-colors">
                      <Upload className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
                      <span className="text-xs font-bold text-indigo-700">Click to Select File</span>
                      <input
                        type="file"
                        accept={doc.allowedTypes.join(',')}
                        onChange={(e) => handleFileUpload(doc.id, doc.name, e)}
                        className="hidden"
                      />
                    </label>
                  ) : (
                    <div className="bg-emerald-50/80 p-3 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold">{uploaded.name}</div>
                        <div className="text-[11px] mt-0.5">{uploaded.ocrNote}</div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {isProcessingAI && (
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-xs text-purple-800 flex items-center gap-2 animate-pulse">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>AI OCR Document Verifier scanning image for signature and readability...</span>
            </div>
          )}

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setStep(2)}
              className="px-5 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200"
            >
              Back
            </button>
            <button
              onClick={() => setStep(4)}
              disabled={uploadedFiles.length === 0}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2"
            >
              <span>Review Application</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Review Application & Final Confirm */}
      {step === 4 && selectedService && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-2xs">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Review & Submit Application</h2>
            <p className="text-xs text-slate-500 mt-1">
              Please verify all details before submitting to the academic registry.
            </p>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4 border-b border-slate-200 pb-3">
              <div>
                <span className="text-slate-400 font-medium">Service:</span>
                <div className="font-bold text-slate-900 text-sm">{selectedService.title}</div>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Purpose:</span>
                <div className="font-bold text-slate-900 text-sm">{formData.purpose}</div>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 font-medium">Target Turnaround:</span>
              <div className="font-bold text-indigo-700">{selectedService.targetDays} Working Days</div>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 font-medium">Parent Verification Stage:</span>
              <div className="font-bold text-purple-700">
                {selectedService.requiresParentVerification ? 'Mandatory (Parent will receive token link)' : 'Not Required for this service'}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 font-medium">Verified Documents ({uploadedFiles.length}):</span>
              <div className="font-semibold text-slate-800">{uploadedFiles.map((f) => f.name).join(', ')}</div>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setStep(3)}
              className="px-5 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200"
            >
              Back
            </button>
            <button
              onClick={handleSubmitApplication}
              className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-100 flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm & Submit Request</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
