import React from 'react';
import { Logo } from '../components/Logo';
import { ScrollReveal } from '../components/ScrollReveal';
import {
  BrainCircuit,
  Workflow,
  UsersRound,
  FileSearch,
  BellRing,
  Bot,
  FileCheck2,
  UtensilsCrossed,
  ShoppingBag,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Clock,
  Sparkles,
  Lock,
  Download
} from 'lucide-react';

interface LandingPageProps {
  onLogin: () => void;
  onExploreParentDemo?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onExploreParentDemo }) => {
  return (
    <div className="min-h-screen bg-theme-main text-slate-900 flex flex-col font-sans">
      
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Logo size="lg" />

          <div className="flex items-center gap-4">
            {onExploreParentDemo && (
              <button
                onClick={onExploreParentDemo}
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-xl border border-purple-200 transition-colors"
              >
                <UsersRound className="w-4 h-4 text-purple-600" />
                <span>Parent Portal Preview</span>
              </button>
            )}

            <button
              onClick={onLogin}
              className="px-6 py-2.5 bg-gradient-to-r from-purple-700 to-blue-600 hover:from-purple-800 hover:to-blue-700 text-white font-extrabold text-sm rounded-xl transition-all shadow-md shadow-purple-900/20 flex items-center gap-2"
            >
              <span>Sign In to Hub</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-28 bg-gradient-to-b from-white via-purple-50/40 to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          <ScrollReveal variant="fade-up" delayMs={0}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100/90 text-purple-800 font-extrabold text-xs tracking-wider uppercase mb-6 border border-purple-200 shadow-xs">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Next-Generation Smart Campus Hub</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
              AI-powered Student Administrative Management Platform
            </h1>

            <p className="mt-4 text-xl sm:text-2xl font-bold text-gradient-purple-blue tracking-wide">
              "Submit. Track. Predict. Complete."
            </p>

            <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
              One integrated platform for student certificates, parent verification, academic attendance alerts, AI turnaround predictions, Digital Food Court, and Stationery purchases.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onLogin}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-700 via-purple-600 to-blue-600 hover:from-purple-800 hover:to-blue-700 text-white font-extrabold text-base rounded-2xl transition-all shadow-lg shadow-purple-900/20 flex items-center justify-center gap-3"
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              {onExploreParentDemo && (
                <button
                  onClick={onExploreParentDemo}
                  className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-100 text-slate-800 font-bold text-base rounded-2xl transition-all border border-slate-300 shadow-xs flex items-center justify-center gap-2"
                >
                  <UsersRound className="w-5 h-5 text-purple-600" />
                  <span>Parent Portal Preview</span>
                </button>
              )}
            </div>
          </ScrollReveal>

          {/* Interactive Platform Mockup Preview */}
          <ScrollReveal variant="scale-fade" delayMs={200} className="mt-14 max-w-5xl mx-auto">
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-200/90 bg-white">
              <div className="bg-slate-900 text-white px-4 py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
                  <span className="text-xs font-mono text-slate-400 ml-2">campusconnect.university.edu/dashboard</span>
                </div>
                <span className="text-[11px] font-extrabold text-blue-400 uppercase tracking-wider">Live System Active</span>
              </div>

              <div className="p-6 bg-slate-50 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover-card-elevation">
                  <div className="flex items-center gap-3 text-purple-700 font-extrabold text-sm">
                    <BrainCircuit className="w-5 h-5" />
                    <span>AI Turnaround Prediction</span>
                  </div>
                  <div className="mt-3 text-2xl font-extrabold text-slate-900">2 Working Days</div>
                  <div className="text-xs text-slate-500 mt-1">Estimates completion date based on live HOD queue velocity.</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover-card-elevation">
                  <div className="flex items-center gap-3 text-blue-600 font-extrabold text-sm">
                    <ShieldCheck className="w-5 h-5" />
                    <span>Mandatory Parent Verification</span>
                  </div>
                  <div className="mt-3 text-2xl font-extrabold text-blue-600">Verified Securely</div>
                  <div className="text-xs text-slate-500 mt-1">HOD approval is locked on server until parent confirms.</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover-card-elevation">
                  <div className="flex items-center gap-3 text-amber-600 font-extrabold text-sm">
                    <BellRing className="w-5 h-5" />
                    <span>Academic Alert Engine</span>
                  </div>
                  <div className="mt-3 text-2xl font-extrabold text-amber-600">75% Attendance</div>
                  <div className="text-xs text-slate-500 mt-1">Automatic warnings when attendance or marks drop below threshold.</div>
                </div>
              </div>
            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* Feature Section */}
      <section className="py-16 lg:py-24 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <ScrollReveal variant="fade-up">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Comprehensive Smart Campus Features
              </h2>
              <p className="mt-3 text-slate-600 text-base">
                Eliminating paper delays, manual counter visits, and uncoordinated department approvals.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: BrainCircuit,
                title: 'AI Completion Prediction',
                color: 'text-purple-700',
                bg: 'bg-purple-100/80',
                desc: 'Machine learning predictive model analyzing departmental workload, staff capacity, and working day calendars.'
              },
              {
                icon: Workflow,
                title: 'Live Request Progress Tracker',
                color: 'text-blue-600',
                bg: 'bg-blue-100/80',
                desc: 'Real-time multi-stage visual timeline tracking from document upload to final digital seal.'
              },
              {
                icon: UsersRound,
                title: 'Mandatory Parent Verification',
                color: 'text-purple-700',
                bg: 'bg-purple-100/80',
                desc: 'Time-limited verification portal link or OTP for parents to independently confirm certificate applications.'
              },
              {
                icon: FileSearch,
                title: 'AI Document Pre-checks',
                color: 'text-blue-600',
                bg: 'bg-blue-100/80',
                desc: 'Optical character recognition (OCR) pre-checks verifying file format, image legibility, and identity seals.'
              },
              {
                icon: BellRing,
                title: 'Automatic Academic Alerts',
                color: 'text-amber-600',
                bg: 'bg-amber-100/80',
                desc: 'Instant student and staff notifications when attendance drops below 75% or internal test scores slip.'
              },
              {
                icon: Bot,
                title: 'Student Assist AI',
                color: 'text-purple-700',
                bg: 'bg-purple-100/80',
                desc: 'Intelligent grounded chatbot providing policy guidance, request updates, and instant platform navigation.'
              },
              {
                icon: UtensilsCrossed,
                title: 'Digital Food Court',
                color: 'text-emerald-700',
                bg: 'bg-emerald-100/80',
                desc: 'Browse food categories, order meals, complete digital payment, and receive single-use QR collection receipts.'
              },
              {
                icon: ShoppingBag,
                title: 'Digital Stationery Store',
                color: 'text-purple-700',
                bg: 'bg-purple-100/80',
                desc: 'Purchase lab record files, spiral notebooks, drawing kits, and printing services with QR collection.'
              },
              {
                icon: ShieldCheck,
                title: 'Role-Based Staff Workspace',
                color: 'text-slate-800',
                bg: 'bg-slate-200/80',
                desc: 'Dedicated portals for Administrative Staff, HOD Department Approvers, and Store Counter Staff.'
              }
            ].map((f, i) => {
              const IconComp = f.icon;
              return (
                <ScrollReveal key={i} variant="scale-fade" delayMs={i * 60}>
                  <div className="p-6 rounded-3xl bg-slate-50/70 border border-slate-200/80 hover-card-elevation h-full flex flex-col justify-between">
                    <div>
                      <div className={`w-12 h-12 rounded-2xl ${f.bg} ${f.color} flex items-center justify-center mb-4 shadow-2xs`}>
                        <IconComp className="w-6 h-6" />
                      </div>
                      <h3 className="font-extrabold text-slate-900 text-lg mb-2">{f.title}</h3>
                      <p className="text-slate-600 text-xs leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Journey */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal variant="fade-up">
            <h2 className="text-3xl font-extrabold text-slate-900">How It Works</h2>
            <p className="text-slate-600 text-sm mt-2">6 simple steps to complete any administrative service</p>
          </ScrollReveal>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-6 gap-4">
            {[
              { step: '01', title: 'Sign In', desc: 'Secure register ID login' },
              { step: '02', title: 'Choose Service', desc: 'Select from catalog' },
              { step: '03', title: 'Upload & Pre-check', desc: 'AI OCR document scan' },
              { step: '04', title: 'Parent Verify', desc: 'Parent approves request' },
              { step: '05', title: 'HOD Approval', desc: 'Department sanction' },
              { step: '06', title: 'Download Certificate', desc: 'Digital QR signed file' }
            ].map((s, idx) => (
              <ScrollReveal key={idx} variant="fade-up" delayMs={idx * 80}>
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover-card-elevation">
                  <span className="text-gradient-purple-blue font-extrabold text-xl">{s.step}</span>
                  <div className="font-extrabold text-slate-900 text-xs mt-1">{s.title}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{s.desc}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-slate-950 text-slate-400 py-12 border-t border-slate-900 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Logo size="md" className="text-white" />
            <p className="mt-3 text-slate-400 text-xs leading-relaxed">
              Digitizing college administrative services, eliminating unnecessary office visits, predicting processing times, and providing convenient campus shopping.
            </p>
          </div>

          <div>
            <div className="font-extrabold text-white uppercase tracking-wider text-xs mb-3">Services</div>
            <ul className="space-y-1.5">
              <li>Bonafide Certificate</li>
              <li>Study / Medium Certificate</li>
              <li>Conduct Certificate</li>
              <li>Educational Loan Breakdown</li>
              <li>Internship NOC</li>
            </ul>
          </div>

          <div>
            <div className="font-extrabold text-white uppercase tracking-wider text-xs mb-3">Campus Shopping</div>
            <ul className="space-y-1.5">
              <li>Digital Food Court Menu</li>
              <li>Stationery & Printing Supplies</li>
              <li>QR Code Receipt Verification</li>
              <li>Counter Order Fulfilment</li>
            </ul>
          </div>

          <div>
            <div className="font-extrabold text-white uppercase tracking-wider text-xs mb-3">Help & Support</div>
            <ul className="space-y-1.5">
              <li>Academic Registry Desk</li>
              <li>Controller of Examinations</li>
              <li>Parent Verification Portal</li>
              <li>Privacy Policy & Terms</li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center text-[11px] text-slate-500">
          <span>© 2026 CampusConnect Smart Education Platform. All rights reserved.</span>
          <span>Designed for modern colleges and universities.</span>
        </div>
      </footer>

    </div>
  );
};
