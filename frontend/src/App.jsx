import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Sidebar } from './components/Sidebar';
import { AuthPortalPage } from './pages/AuthPortalPage';
import { PatientDashboardHome } from './pages/PatientDashboard';
import { AICompanionPage } from './pages/AICompanionPage';
import { MoodTrackerPage } from './pages/MoodTrackerPage';
import { WellnessPage } from './pages/WellnessPage';
import { CounselorConnectPage } from './pages/CounselorConnectPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { CounselorDashboard } from './pages/CounselorDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { ProfileSettingsPage } from './pages/ProfileSettingsPage';
import { RiskAlertBanner } from './components/RiskAlertBanner';

const AppContent = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState('auth_portal');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [riskModalOpen, setRiskModalOpen] = useState(false);
  const [guideMode, setGuideMode] = useState(false);
  const [notificationCount, setNotificationCount] = useState(2);

  // Synchronize active tab based on authenticated user role
  useEffect(() => {
    if (user?.role === 'counselor') {
      setActiveTab('counselor_overview');
    } else if (user?.role === 'admin') {
      setActiveTab('admin_overview');
    } else if (user?.role === 'patient') {
      setActiveTab('dashboard');
    }
  }, [user?.role]);

  // View Router for Unauthenticated / Portal Mode
  if (!user || currentView === 'auth_portal' || currentView === 'login' || currentView === 'register') {
    return (
      <AuthPortalPage 
        setCurrentView={setCurrentView} 
        setActiveTab={setActiveTab}
      />
    );
  }

  // Active Dashboard Application View Router
  const renderDashboardTab = () => {
    switch (activeTab) {
      // Patient Tabs
      case 'dashboard':
        return (
          <PatientDashboardHome 
            setActiveTab={setActiveTab} 
            triggerRiskModal={() => setRiskModalOpen(true)} 
            guideMode={guideMode}
          />
        );
      case 'companion':
        return <AICompanionPage guideMode={guideMode} />;
      case 'mood':
        return <MoodTrackerPage guideMode={guideMode} />;
      case 'wellness':
        return <WellnessPage guideMode={guideMode} />;
      case 'counselors':
        return <CounselorConnectPage guideMode={guideMode} />;
      case 'notifications':
        return (
          <NotificationsPage 
            guideMode={guideMode} 
            onNotificationCountChange={setNotificationCount} 
          />
        );
      case 'profile':
      case 'settings':
        return <ProfileSettingsPage guideMode={guideMode} />;

      // Counselor Tabs
      case 'counselor_overview':
      case 'counselor_patients':
      case 'counselor_alerts':
      case 'counselor_appointments':
      case 'counselor_reports':
        return <CounselorDashboard activeTab={activeTab} guideMode={guideMode} />;

      // Admin Tabs
      case 'admin_overview':
      case 'admin_users':
      case 'admin_counselors':
      case 'admin_analytics':
      case 'admin_alerts':
        return <AdminDashboard guideMode={guideMode} />;

      default:
        return (
          <PatientDashboardHome 
            setActiveTab={setActiveTab} 
            triggerRiskModal={() => setRiskModalOpen(true)} 
            guideMode={guideMode}
          />
        );
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        setCurrentView={setCurrentView}
        guideMode={guideMode}
        setGuideMode={setGuideMode}
        notificationCount={notificationCount}
      />

      <main className="main-content">
        {renderDashboardTab()}
      </main>

      <RiskAlertBanner
        isOpen={riskModalOpen}
        onClose={() => setRiskModalOpen(false)}
        onConnectCounselor={() => setActiveTab('counselors')}
        onExploreWellness={() => setActiveTab('wellness')}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
