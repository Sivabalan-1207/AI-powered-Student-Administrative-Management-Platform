import React, { useState, useEffect } from 'react';
import { store } from './services/store';
import type { UserRole } from './types';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { StudentAssistAI } from './components/StudentAssistAI';
import { CartDrawer } from './components/CartDrawer';
import { QRScannerModal } from './components/QRScannerModal';
import { AuthModal } from './pages/AuthModal';
import { LandingPage } from './pages/LandingPage';
import { ParentVerificationPage } from './pages/ParentVerificationPage';

// Student Portal Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { NewRequestPage } from './pages/student/NewRequestPage';
import { RequestTrackerPage } from './pages/student/RequestTrackerPage';
import { DocumentsPage } from './pages/student/DocumentsPage';
import { AcademicAlertsPage } from './pages/student/AcademicAlertsPage';
import { FoodCourtPage } from './pages/student/FoodCourtPage';
import { StationeryStorePage } from './pages/student/StationeryStorePage';
import { MyOrdersPage } from './pages/student/MyOrdersPage';
import { FeedbackPage } from './pages/student/FeedbackPage';
import { ProfilePage } from './pages/student/ProfilePage';

// Staff & Admin Portal Pages
import { StaffDashboard } from './pages/staff/StaffDashboard';
import { RequestManagementPage } from './pages/staff/RequestManagementPage';
import { HODApprovalPage } from './pages/staff/HODApprovalPage';
import { AcademicMonitoringPage } from './pages/staff/AcademicMonitoringPage';
import { FoodCourtStaffPage } from './pages/staff/FoodCourtStaffPage';
import { StationeryStaffPage } from './pages/staff/StationeryStaffPage';
import { AdminSettingsPage } from './pages/staff/AdminSettingsPage';

import { Bot, MessageSquare } from 'lucide-react';

export function App() {
  const [state, setState] = useState(store.getState());
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [isAIFloatingOpen, setIsAIFloatingOpen] = useState(false);

  useEffect(() => {
    return store.subscribe(() => {
      setState(store.getState());
    });
  }, []);

  const currentUser = state.currentUser;

  // Auto-switch initial view based on role when coming from landing/auth
  const handleLoginSuccess = (role: UserRole) => {
    setIsAuthModalOpen(false);
    if (role === 'student') setCurrentPage('student-dashboard');
    else if (role === 'staff') setCurrentPage('staff-dashboard');
    else if (role === 'hod') setCurrentPage('hod-approvals');
    else if (role === 'admin') setCurrentPage('admin-settings');
    else if (role === 'food_staff') setCurrentPage('food-staff');
    else if (role === 'stationery_staff') setCurrentPage('stationery-staff');
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 1. Landing Page View
  if (currentPage === 'landing') {
    return (
      <>
        <LandingPage
          onLogin={() => setIsAuthModalOpen(true)}
          onExploreParentDemo={() => setCurrentPage('parent-verification-portal')}
        />

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      </>
    );
  }

  // 2. Parent Verification Portal Public Endpoint View
  if (currentPage === 'parent-verification-portal') {
    return (
      <ParentVerificationPage
        onBackToApp={() => setCurrentPage('student-dashboard')}
      />
    );
  }

  // 3. Main Authenticated Platform View
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Navbar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onToggleSidebar={() => setIsSidebarMobileOpen(!isSidebarMobileOpen)}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        
        {/* Role-Based Sidebar Navigation */}
        <Sidebar
          currentRole={currentUser.role}
          currentPage={currentPage}
          onNavigate={handleNavigate}
          isOpenMobile={isSidebarMobileOpen}
          onCloseMobile={() => setIsSidebarMobileOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          
          {/* Student Portal Views */}
          {currentPage === 'student-dashboard' && (
            <StudentDashboard
              onNavigate={handleNavigate}
              onOpenAI={() => setIsAIFloatingOpen(true)}
            />
          )}

          {currentPage === 'new-request' && (
            <NewRequestPage onNavigate={handleNavigate} />
          )}

          {currentPage === 'my-requests' && (
            <RequestTrackerPage
              onNavigate={handleNavigate}
              onOpenParentPortalDemo={() => setCurrentPage('parent-verification-portal')}
            />
          )}

          {currentPage === 'student-documents' && <DocumentsPage />}
          {currentPage === 'academic-alerts' && <AcademicAlertsPage />}

          {currentPage === 'ai-assistant' && (
            <StudentAssistAI onNavigate={handleNavigate} isEmbedded={true} />
          )}

          {currentPage === 'food-court' && (
            <FoodCourtPage
              onOpenCart={() => setIsCartOpen(true)}
              onNavigate={handleNavigate}
            />
          )}

          {currentPage === 'stationery-store' && (
            <StationeryStorePage
              onOpenCart={() => setIsCartOpen(true)}
              onNavigate={handleNavigate}
            />
          )}

          {currentPage === 'my-orders' && <MyOrdersPage />}
          {currentPage === 'feedback' && <FeedbackPage />}
          {currentPage === 'profile' && <ProfilePage />}

          {/* Staff & HOD Portal Views */}
          {currentPage === 'staff-dashboard' && (
            <StaffDashboard onNavigate={handleNavigate} />
          )}

          {currentPage === 'request-management' && <RequestManagementPage />}
          {currentPage === 'hod-approvals' && <HODApprovalPage />}
          {currentPage === 'academic-monitoring' && <AcademicMonitoringPage />}

          {currentPage === 'food-staff' && (
            <FoodCourtStaffPage onOpenQRScanner={() => setIsQRScannerOpen(true)} />
          )}

          {currentPage === 'stationery-staff' && (
            <StationeryStaffPage onOpenQRScanner={() => setIsQRScannerOpen(true)} />
          )}

          {currentPage === 'qr-scanner' && (
            <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-4">
              <h2 className="text-xl font-bold text-slate-900">QR Collection Verification Counter</h2>
              <p className="text-xs text-slate-500">Scan student food or stationery collection receipts</p>
              <button
                onClick={() => setIsQRScannerOpen(true)}
                className="px-6 py-3 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-md"
              >
                Launch QR Camera Scanner
              </button>
            </div>
          )}

          {currentPage === 'admin-settings' && <AdminSettingsPage />}
          {currentPage === 'support' && <ProfilePage />}

        </main>
      </div>

      {/* Floating Student Assist AI Trigger Button */}
      <button
        onClick={() => setIsAIFloatingOpen(!isAIFloatingOpen)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white shadow-2xl flex items-center justify-center hover:scale-110 transition-transform ring-4 ring-white"
        title="Student Assist AI"
      >
        <Bot className="w-7 h-7" />
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-teal-500 border-2 border-white"></span>
        </span>
      </button>

      {/* Floating Student Assist AI Widget */}
      <StudentAssistAI
        onNavigate={handleNavigate}
        isOpenFloating={isAIFloatingOpen}
        onCloseFloating={() => setIsAIFloatingOpen(false)}
      />

      {/* Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* Staff QR Collection Scanner Modal */}
      <QRScannerModal
        isOpen={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
      />

    </div>
  );
}

export default App;
