import React, { useState, useEffect } from 'react';
import { store } from '../../services/store';
import { FileSearch, Download, CheckCircle2, Shield, Eye, FileText, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export const DocumentsPage: React.FC = () => {
  const [state, setState] = useState(store.getState());

  useEffect(() => {
    return store.subscribe(() => {
      setState(store.getState());
    });
  }, []);

  const student = state.currentUser;
  const myApps = state.applications.filter((a) => a.studentId === student.id);
  const issuedCertificates = myApps.filter((a) => a.issuedCertificateUrl);

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <FileSearch className="w-6 h-6 text-indigo-600" />
          <span>Student Document Centre & Verified Vault</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Secure authorized document vault, uploaded proof files, and issued digital certificates.
        </p>
      </div>

      {/* Issued Certificates Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-2xs">
        <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-600" />
          <span>Issued Official Certificates ({issuedCertificates.length})</span>
        </h2>

        {issuedCertificates.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">
            No certificates issued yet. Submit an application in the Service Centre to get started.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {issuedCertificates.map((cert) => (
              <div
                key={cert.id}
                className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-extrabold text-slate-900 text-sm">{cert.serviceTitle}</span>
                    <div className="font-mono text-[10px] text-emerald-700 font-bold mt-0.5">{cert.requestNumber}</div>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-600 text-white font-extrabold text-[9px] uppercase rounded-md">
                    Verified Digital Seal
                  </span>
                </div>

                <div className="text-xs text-slate-600">
                  Issued for: <span className="font-semibold text-slate-800">{cert.purpose}</span>
                </div>

                <div className="pt-3 border-t border-emerald-200/60 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">Issued: {new Date(cert.updatedAt).toLocaleDateString()}</span>
                  
                  <a
                    href={cert.issuedCertificateUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={triggerConfetti}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Uploaded Documents Vault */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-2xs">
        <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
          <Shield className="w-5 h-5 text-indigo-600" />
          <span>Uploaded Supporting Identity Proofs</span>
        </h2>

        <div className="space-y-3">
          {myApps.flatMap((a) => a.documents).length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-400">No uploaded proof documents.</div>
          ) : (
            myApps.flatMap((a) => a.documents).map((doc) => (
              <div
                key={doc.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{doc.name}</div>
                    <div className="text-slate-500 text-[11px] mt-0.5">
                      Uploaded on {new Date(doc.uploadedAt).toLocaleDateString()} • {doc.fileType}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full font-bold text-[10px] uppercase ${
                      doc.status === 'verified'
                        ? 'bg-emerald-100 text-emerald-800'
                        : doc.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {doc.status}
                  </span>

                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 text-slate-500 hover:text-indigo-600 rounded-lg hover:bg-slate-200/60"
                  >
                    <Eye className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};
