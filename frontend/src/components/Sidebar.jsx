import React from 'react';
import { useAuth } from '../context/AuthContext';
import { GuideToggleButton } from './FeatureHelpGuide';
import {
  LayoutDashboard,
  Bot,
  Smile,
  Sparkles,
  UserCheck,
  Bell,
  User,
  LogOut,
  Users,
  AlertTriangle,
  Calendar,
  FileText,
  Activity,
  Repeat
} from 'lucide-react';

export const Sidebar = ({ activeTab, setActiveTab, setCurrentView, guideMode, setGuideMode, notificationCount = 2 }) => {
  const { user, logout } = useAuth();
  const role = user?.role || 'patient';

  const handleTabClick = (tabId) => {
    if (setActiveTab) {
      setActiveTab(tabId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Patient Navigation (Removed duplicate Insights & Analytics)
  const patientNav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'companion', label: 'AI Companion', icon: Bot, badge: '24/7 AI' },
    { id: 'mood', label: 'Mood Tracker', icon: Smile },
    { id: 'wellness', label: 'Wellness Center', icon: Sparkles },
    { id: 'counselors', label: 'Counselor Connect', icon: UserCheck },
    { id: 'notifications', label: 'Notifications', icon: Bell, count: notificationCount > 0 ? notificationCount : undefined },
    { id: 'profile', label: 'Profile & Settings', icon: User },
  ];

  const counselorNav = [
    { id: 'counselor_overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'counselor_patients', label: 'Patients', icon: Users },
    { id: 'counselor_alerts', label: 'Alert Center', icon: AlertTriangle, count: 2, badgeColor: 'coral' },
    { id: 'counselor_appointments', label: 'Appointments', icon: Calendar },
    { id: 'counselor_reports', label: 'Clinical Reports', icon: FileText },
    { id: 'profile', label: 'Profile & Settings', icon: User },
  ];

  const adminNav = [
    { id: 'admin_overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'admin_users', label: 'User Management', icon: Users },
    { id: 'admin_counselors', label: 'Counselors Directory', icon: UserCheck },
    { id: 'admin_analytics', label: 'System Analytics', icon: Activity },
    { id: 'admin_alerts', label: 'Risk Logs', icon: AlertTriangle },
    { id: 'profile', label: 'Profile & Settings', icon: User },
  ];

  const getNavItems = () => {
    if (role === 'counselor') return counselorNav;
    if (role === 'admin') return adminNav;
    return patientNav;
  };

  const navItems = getNavItems();

  return (
    <aside style={{
      width: '270px',
      backgroundColor: '#FFFFFF',
      borderRight: '1px solid var(--border-light)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'sticky',
      top: 0,
      overflowY: 'auto',
      flexShrink: 0,
      zIndex: 90
    }}>
      {/* Sidebar Brand Header */}
      <div style={{
        padding: '20px 24px',
        borderBottom: '1px solid var(--border-light)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <div 
          onClick={() => setCurrentView('auth_portal')}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
        >
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #8B7CF6 0%, #6C9BF2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF'
          }}>
            <Sparkles size={20} />
          </div>
          <div>
            <span style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.25rem',
              fontWeight: 800,
              color: 'var(--text-dark)'
            }}>
              MindCare <span style={{ color: 'var(--primary-lavender)' }}>AI</span>
            </span>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>
              {role} workspace
            </div>
          </div>
        </div>

        {/* Feature Guide Toggle Button */}
        <GuideToggleButton guideMode={guideMode} setGuideMode={setGuideMode} />
      </div>

      {/* Navigation Links */}
      <nav style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <button
          onClick={() => {
            logout();
            setCurrentView('auth_portal');
          }}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: 'var(--primary-lavender)',
            backgroundColor: 'var(--light-lavender)',
            marginBottom: '12px'
          }}
        >
          <Repeat size={16} />
          <span>Switch Auth Portal</span>
        </button>

        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', padding: '4px 14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          MAIN MENU
        </div>

        {navItems.map(item => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.9rem',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? 'var(--primary-lavender)' : 'var(--text-dark)',
                backgroundColor: isActive ? 'var(--light-lavender)' : 'transparent',
                transition: 'var(--transition-fast)',
                textAlign: 'left'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <IconComponent size={18} color={isActive ? '#8B7CF6' : '#73738A'} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className="badge badge-lavender" style={{ fontSize: '0.7rem' }}>
                  {item.badge}
                </span>
              )}

              {item.count !== undefined && item.count > 0 && (
                <span 
                  className={`badge ${item.badgeColor === 'coral' ? 'badge-coral' : 'badge-lavender'}`} 
                  style={{ fontSize: '0.7rem' }}
                >
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Mini Profile */}
      <div style={{
        padding: '16px 20px',
        borderTop: '1px solid var(--border-light)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div 
          onClick={() => handleTabClick('profile')}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', flex: 1 }}
        >
          <img
            src={user?.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80"}
            alt={user?.name || "User"}
            style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-dark)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name || "Arya Sharma"}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              {user?.email || "patient@demo.com"}
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            logout();
            setCurrentView('auth_portal');
          }}
          style={{ color: 'var(--text-secondary)', padding: '6px' }}
          title="Log Out"
        >
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
};
