import React from 'react';
import { Sparkles, ArrowRight, HelpCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { GuideToggleButton } from './FeatureHelpGuide';

export const Navbar = ({ currentView, setCurrentView, setActiveTab, guideMode, setGuideMode }) => {
  const { user, logout } = useAuth();

  const handleNavClick = (view, tab = null) => {
    setCurrentView(view);
    if (tab && setActiveTab) {
      setActiveTab(tab);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav style={{
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-light)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '14px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* Brand Logo */}
        <div 
          onClick={() => handleNavClick('landing')} 
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
        >
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #8B7CF6 0%, #6C9BF2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            boxShadow: '0 4px 12px rgba(139, 124, 246, 0.25)'
          }}>
            <Sparkles size={22} />
          </div>
          <div>
            <span style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.4rem',
              fontWeight: 800,
              color: 'var(--text-dark)',
              letterSpacing: '-0.02em'
            }}>
              MindCare <span style={{ color: 'var(--primary-lavender)' }}>AI</span>
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => handleNavClick('landing')}
            style={{ 
              fontWeight: currentView === 'landing' ? 700 : 500, 
              color: currentView === 'landing' ? 'var(--primary-lavender)' : 'var(--text-secondary)'
            }}
          >
            Home
          </button>
          
          <button 
            onClick={() => handleNavClick('dashboard', 'wellness')}
            style={{ 
              fontWeight: currentView === 'dashboard' && setActiveTab ? 600 : 500, 
              color: 'var(--text-secondary)'
            }}
          >
            Wellness Discovery
          </button>

          <button 
            onClick={() => handleNavClick('dashboard', 'counselors')}
            style={{ fontWeight: 500, color: 'var(--text-secondary)' }}
          >
            Counselor Telehealth
          </button>

          <button 
            onClick={() => handleNavClick('dashboard', 'companion')}
            style={{ fontWeight: 600, color: 'var(--primary-lavender)', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <Sparkles size={14} /> AI Companion
          </button>
        </div>

        {/* Right CTA & Feature Guide Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <GuideToggleButton guideMode={guideMode} setGuideMode={setGuideMode} />

          {user ? (
            <button 
              onClick={() => handleNavClick('dashboard', 'dashboard')}
              className="btn btn-primary btn-sm"
            >
              Open Workspace <ArrowRight size={16} />
            </button>
          ) : (
            <>
              <button 
                onClick={() => handleNavClick('login')}
                className="btn btn-outline btn-sm"
              >
                Log In
              </button>
              <button 
                onClick={() => handleNavClick('register')}
                className="btn btn-primary btn-sm"
              >
                Get Started
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
