import React, { useState, useEffect } from 'react';
import { store } from '../services/store';
import type { UserRole } from '../types';
import { Logo } from './Logo';
import { 
  Bell, 
  ShoppingCart, 
  User, 
  RotateCcw, 
  Shield, 
  GraduationCap, 
  FileCheck2, 
  UtensilsCrossed, 
  ShoppingBag, 
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  Menu,
  X
} from 'lucide-react';

interface NavbarProps {
  onToggleSidebar?: () => void;
  onOpenCart?: () => void;
  onNavigate?: (page: string) => void;
  currentPage?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onToggleSidebar, 
  onOpenCart, 
  onNavigate,
  currentPage 
}) => {
  const [state, setState] = useState(store.getState());
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    return store.subscribe(() => {
      setState(store.getState());
    });
  }, []);

  const currentUser = state.currentUser;
  const unreadCount = state.notifications.filter(n => !n.isRead && n.userId === currentUser.id).length;
  const cartCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);

  const roleLabels: Record<UserRole, { label: string; badgeBg: string; badgeText: string; icon: React.ReactNode }> = {
    student: { label: 'Student', badgeBg: 'bg-purple-100', badgeText: 'text-purple-800', icon: <GraduationCap className="w-3.5 h-3.5" /> },
    staff: { label: 'Admin Staff', badgeBg: 'bg-blue-100', badgeText: 'text-blue-800', icon: <FileCheck2 className="w-3.5 h-3.5" /> },
    hod: { label: 'HOD', badgeBg: 'bg-purple-100', badgeText: 'text-purple-800', icon: <Shield className="w-3.5 h-3.5" /> },
    admin: { label: 'Institutional Admin', badgeBg: 'bg-indigo-100', badgeText: 'text-indigo-800', icon: <Shield className="w-3.5 h-3.5" /> },
    food_staff: { label: 'Food Court Staff', badgeBg: 'bg-emerald-100', badgeText: 'text-emerald-800', icon: <UtensilsCrossed className="w-3.5 h-3.5" /> },
    stationery_staff: { label: 'Stationery Staff', badgeBg: 'bg-purple-100', badgeText: 'text-purple-800', icon: <ShoppingBag className="w-3.5 h-3.5" /> }
  };

  const handleRoleSwitch = (role: UserRole) => {
    store.switchUserByRole(role);
    setShowRoleDropdown(false);
    if (onNavigate) {
      if (role === 'student') onNavigate('student-dashboard');
      else if (role === 'staff') onNavigate('staff-dashboard');
      else if (role === 'hod') onNavigate('hod-approvals');
      else if (role === 'admin') onNavigate('admin-settings');
      else if (role === 'food_staff') onNavigate('food-staff');
      else if (role === 'stationery_staff') onNavigate('stationery-staff');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left Section: Mobile Menu Toggle & Logo */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Toggle Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div 
            className="cursor-pointer"
            onClick={() => onNavigate && onNavigate(currentUser.role === 'student' ? 'student-dashboard' : 'staff-dashboard')}
          >
            <Logo size="md" />
          </div>
        </div>

        {/* Center Section: Quick Role Switcher Pill Bar */}
        <div className="hidden md:flex items-center gap-1 bg-slate-100/90 p-1 rounded-full border border-slate-200 text-xs">
          <span className="px-2.5 py-1 text-slate-500 font-semibold tracking-wider uppercase text-[10px]">
            Switch Persona:
          </span>
          {(['student', 'staff', 'hod', 'food_staff', 'stationery_staff'] as UserRole[]).map((r) => {
            const active = currentUser.role === r;
            return (
              <button
                key={r}
                onClick={() => handleRoleSwitch(r)}
                className={`px-3 py-1 rounded-full font-bold transition-all flex items-center gap-1.5 ${
                  active
                    ? 'bg-gradient-to-r from-purple-700 to-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-purple-700 hover:bg-slate-200/60'
                }`}
              >
                {roleLabels[r].icon}
                <span>{roleLabels[r].label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Section: Actions, Notifications, Cart & User Menu */}
        <div className="flex items-center gap-3">

          {/* Reset Demo Data Button */}
          <button
            onClick={() => {
              if (window.confirm('Reset application store to original seed data?')) {
                store.resetToDefaultDemo();
              }
            }}
            title="Reset Store Data"
            className="p-2 text-slate-400 hover:text-purple-600 hover:bg-slate-100 rounded-xl transition-colors hidden sm:flex items-center gap-1 text-xs font-semibold"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden xl:inline">Reset Demo</span>
          </button>

          {/* Cart Icon */}
          <button
            onClick={onOpenCart}
            className="relative p-2 text-slate-600 hover:text-purple-600 hover:bg-slate-100 rounded-xl transition-colors"
            title="Shopping Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-bounce">
                {cartCount}
              </span>
            )}
          </button>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-slate-600 hover:text-purple-600 hover:bg-slate-100 rounded-xl transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-purple-600 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown Drawer */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 p-4 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Bell className="w-4 h-4 text-purple-600" />
                    Notifications ({unreadCount} unread)
                  </h3>
                  <button 
                    onClick={() => setShowNotifications(false)}
                    className="text-slate-400 hover:text-slate-600 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="max-h-72 overflow-y-auto custom-scrollbar my-2 divide-y divide-slate-100">
                  {state.notifications.filter(n => n.userId === currentUser.id).length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-6">No notifications yet.</p>
                  ) : (
                    state.notifications
                      .filter(n => n.userId === currentUser.id)
                      .map((n) => (
                        <div 
                          key={n.id} 
                          onClick={() => store.markNotificationAsRead(n.id)}
                          className={`p-3 text-xs cursor-pointer hover:bg-slate-50 transition-colors ${!n.isRead ? 'bg-purple-50/50 font-medium' : ''}`}
                        >
                          <div className="flex items-start gap-2">
                            {n.type === 'error' ? (
                              <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                            ) : n.type === 'success' ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            ) : (
                              <Bell className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                            )}
                            <div>
                              <div className="font-semibold text-slate-800">{n.title}</div>
                              <div className="text-slate-600 mt-0.5 leading-snug">{n.message}</div>
                              <div className="text-[10px] text-slate-400 mt-1">
                                {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
            >
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-purple-600/30"
              />
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-semibold text-slate-800 leading-tight">
                  {currentUser.name}
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${roleLabels[currentUser.role].badgeBg} ${roleLabels[currentUser.role].badgeText}`}>
                  {roleLabels[currentUser.role].label}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {/* Role Dropdown */}
            {showRoleDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 p-2 animate-in fade-in zoom-in-95">
                <div className="p-3 border-b border-slate-100 mb-1">
                  <div className="font-semibold text-sm text-slate-900">{currentUser.name}</div>
                  <div className="text-xs text-slate-500">{currentUser.email}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{currentUser.department}</div>
                </div>

                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1">
                  Switch Active Persona
                </div>

                {state.demoUsers.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => handleRoleSwitch(u.role)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
                      currentUser.role === u.role ? 'bg-purple-50 text-purple-700 font-bold' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <img src={u.avatarUrl} className="w-5 h-5 rounded-full object-cover" alt="" />
                      <span>{u.name}</span>
                    </div>
                    <span className="text-[10px] uppercase opacity-75">{u.role}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
