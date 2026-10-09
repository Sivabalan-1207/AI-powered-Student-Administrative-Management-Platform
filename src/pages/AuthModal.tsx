import React, { useState } from 'react';
import { store } from '../services/store';
import type { UserRole } from '../types';
import { Logo } from '../components/Logo';
import { Lock, Mail, Eye, EyeOff, User, ArrowRight, ShieldCheck, CheckCircle2, GraduationCap, Utensils, ShoppingBag } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (role: UserRole) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [registerNo, setRegisterNo] = useState('2023CSE1042');
  const [email, setEmail] = useState('alex.morgan@campus.edu');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      setIsLoading(false);
      const demoUsers = store.getState().demoUsers;
      const matched = demoUsers.find((u) => u.email.toLowerCase() === email.toLowerCase()) || demoUsers[0];
      store.setCurrentUser(matched);
      onLoginSuccess(matched.role);
    }, 600);
  };

  const handleQuickRoleLogin = (role: UserRole) => {
    store.switchUserByRole(role);
    onLoginSuccess(role);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Header with Purple & Electric Blue Gradient */}
        <div className="bg-gradient-to-r from-purple-900 via-purple-800 to-blue-900 p-6 text-white text-center relative">
          <div className="flex justify-center mb-2">
            <Logo iconOnly size="lg" />
          </div>
          <h2 className="text-xl font-extrabold tracking-tight">CampusConnect Hub Login</h2>
          <p className="text-purple-200 text-xs mt-1">Smart Administrative & Education Services</p>
        </div>

        <div className="p-6 space-y-5">

          {/* Quick Demo Persona Selectors */}
          <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl">
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-2 flex items-center justify-between">
              <span>Instant One-Click Sign In:</span>
              <span className="text-purple-700 font-bold">Select Role</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickRoleLogin('student')}
                className="p-2.5 rounded-xl bg-white hover:bg-purple-50 text-slate-800 font-bold border border-slate-200 text-left transition-colors flex items-center gap-2 shadow-2xs hover:border-purple-300"
              >
                <GraduationCap className="w-4 h-4 text-purple-700 shrink-0" />
                <div>
                  <div>Student</div>
                  <div className="text-[10px] text-slate-400 font-normal">Alex Morgan</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickRoleLogin('staff')}
                className="p-2.5 rounded-xl bg-white hover:bg-blue-50 text-slate-800 font-bold border border-slate-200 text-left transition-colors flex items-center gap-2 shadow-2xs hover:border-blue-300"
              >
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <div>
                  <div>Admin Staff</div>
                  <div className="text-[10px] text-slate-400 font-normal">Sarah Jenkins</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickRoleLogin('hod')}
                className="p-2.5 rounded-xl bg-white hover:bg-purple-50 text-slate-800 font-bold border border-slate-200 text-left transition-colors flex items-center gap-2 shadow-2xs hover:border-purple-300"
              >
                <ShieldCheck className="w-4 h-4 text-purple-700 shrink-0" />
                <div>
                  <div>HOD Approver</div>
                  <div className="text-[10px] text-slate-400 font-normal">Dr. Vance</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickRoleLogin('food_staff')}
                className="p-2.5 rounded-xl bg-white hover:bg-emerald-50 text-slate-800 font-bold border border-slate-200 text-left transition-colors flex items-center gap-2 shadow-2xs hover:border-emerald-300"
              >
                <Utensils className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <div>Food Counter</div>
                  <div className="text-[10px] text-slate-400 font-normal">Chef Mario</div>
                </div>
              </button>
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Or Standard Auth</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Register Number / Staff ID
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={registerNo}
                  onChange={(e) => setRegisterNo(e.target.value)}
                  placeholder="2023CSE1042"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-purple-600 focus:bg-white transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Institutional Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@campus.edu"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-purple-600 focus:bg-white transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-purple-600 focus:bg-white transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-purple-700 via-purple-600 to-blue-600 hover:from-purple-800 hover:to-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-purple-900/20 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In to Platform</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};
