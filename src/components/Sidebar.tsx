import React from 'react';
import type { UserRole } from '../types';
import {
  LayoutDashboard,
  PanelsTopLeft,
  FileCheck2,
  UsersRound,
  ShieldCheck,
  BellRing,
  GraduationCap,
  UtensilsCrossed,
  ShoppingBag,
  ShoppingCart,
  Bot,
  QrCode,
  PackageCheck,
  FileSearch,
  MessageSquareText,
  CircleHelp,
  Settings,
  User,
  ClockAlert
} from 'lucide-react';

interface SidebarProps {
  currentRole: UserRole;
  currentPage: string;
  onNavigate: (page: string) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRole,
  currentPage,
  onNavigate,
  isOpenMobile = false,
  onCloseMobile
}) => {
  const getNavItems = () => {
    if (currentRole === 'student') {
      return [
        { id: 'student-dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'new-request', label: 'Apply for Service', icon: FileCheck2 },
        { id: 'my-requests', label: 'My Requests & Tracker', icon: ClockAlert },
        { id: 'student-documents', label: 'Document Centre', icon: FileSearch },
        { id: 'academic-alerts', label: 'Academic Alerts', icon: BellRing },
        { id: 'ai-assistant', label: 'Student Assist AI', icon: Bot, badge: 'AI' },
        { id: 'food-court', label: 'Food Court', icon: UtensilsCrossed, badgeColor: 'bg-emerald-100 text-emerald-800' },
        { id: 'stationery-store', label: 'Stationery Store', icon: ShoppingBag, badgeColor: 'bg-purple-100 text-purple-800' },
        { id: 'my-orders', label: 'My Orders & QR', icon: ShoppingCart },
        { id: 'feedback', label: 'Student Feedback', icon: MessageSquareText },
        { id: 'profile', label: 'Profile & Settings', icon: User },
        { id: 'support', label: 'Help & Support', icon: CircleHelp }
      ];
    }

    if (currentRole === 'hod') {
      return [
        { id: 'hod-approvals', label: 'HOD Approvals', icon: ShieldCheck, badge: 'Required' },
        { id: 'staff-dashboard', label: 'Department Analytics', icon: PanelsTopLeft },
        { id: 'request-management', label: 'All Requests Inbox', icon: FileCheck2 },
        { id: 'academic-monitoring', label: 'Academic Risk Monitor', icon: GraduationCap },
        { id: 'food-court', label: 'Food Court', icon: UtensilsCrossed },
        { id: 'stationery-store', label: 'Stationery Store', icon: ShoppingBag },
        { id: 'my-orders', label: 'My Orders', icon: ShoppingCart },
        { id: 'profile', label: 'Profile', icon: User }
      ];
    }

    if (currentRole === 'food_staff') {
      return [
        { id: 'food-staff', label: 'Food Court Orders', icon: UtensilsCrossed },
        { id: 'qr-scanner', label: 'Validate Collection QR', icon: QrCode, badge: 'Scanner' },
        { id: 'food-court', label: 'Browse Food Menu', icon: UtensilsCrossed },
        { id: 'my-orders', label: 'My Orders', icon: ShoppingCart },
        { id: 'profile', label: 'Profile', icon: User }
      ];
    }

    if (currentRole === 'stationery_staff') {
      return [
        { id: 'stationery-staff', label: 'Stationery Orders', icon: PackageCheck },
        { id: 'qr-scanner', label: 'Validate Collection QR', icon: QrCode, badge: 'Scanner' },
        { id: 'stationery-store', label: 'Store Catalogue', icon: ShoppingBag },
        { id: 'my-orders', label: 'My Orders', icon: ShoppingCart },
        { id: 'profile', label: 'Profile', icon: User }
      ];
    }

    if (currentRole === 'admin') {
      return [
        { id: 'admin-settings', label: 'Admin Settings', icon: Settings },
        { id: 'staff-dashboard', label: 'System Dashboard', icon: PanelsTopLeft },
        { id: 'request-management', label: 'Request Management', icon: FileCheck2 },
        { id: 'academic-monitoring', label: 'Academic Monitoring', icon: GraduationCap },
        { id: 'food-staff', label: 'Food Court Manager', icon: UtensilsCrossed },
        { id: 'stationery-staff', label: 'Stationery Manager', icon: ShoppingBag },
        { id: 'qr-scanner', label: 'QR Verification', icon: QrCode },
        { id: 'profile', label: 'Profile', icon: User }
      ];
    }

    // Default: Staff
    return [
      { id: 'staff-dashboard', label: 'Staff Dashboard', icon: PanelsTopLeft },
      { id: 'request-management', label: 'Request Inbox & Verifier', icon: FileCheck2 },
      { id: 'academic-monitoring', label: 'Academic Monitoring', icon: GraduationCap },
      { id: 'food-court', label: 'Campus Dining', icon: UtensilsCrossed },
      { id: 'stationery-store', label: 'Stationery Hub', icon: ShoppingBag },
      { id: 'my-orders', label: 'My Orders', icon: ShoppingCart },
      { id: 'qr-scanner', label: 'Scan Receipt QR', icon: QrCode },
      { id: 'profile', label: 'Profile', icon: User }
    ];
  };

  const navItems = getNavItems();

  const handleNavClick = (id: string) => {
    onNavigate(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 left-0 bottom-0 z-50 w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4 flex flex-col h-full">
          
          {/* Header Title */}
          <div className="mb-5 px-3 pt-2">
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-purple-700">
              {currentRole === 'student' ? 'Student Workspace' : 'Staff Workspace'}
            </div>
            <div className="text-sm font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
              <span>Navigation Menu</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-1 overflow-y-auto custom-scrollbar pr-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-700 to-blue-600 text-white shadow-md shadow-purple-900/15'
                      : 'text-slate-600 hover:text-purple-700 hover:bg-slate-100/70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : item.badgeColor || 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Footer Quick Info */}
          <div className="mt-4 pt-4 border-t border-slate-100 px-3 text-[11px] text-slate-400 flex items-center justify-between font-medium">
            <span>CampusConnect v2.4</span>
            <span className="flex items-center gap-1 text-purple-700 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
              Live System
            </span>
          </div>

        </div>
      </aside>
    </>
  );
};
