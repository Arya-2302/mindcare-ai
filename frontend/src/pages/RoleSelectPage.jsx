import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, User, HeartHandshake, ShieldCheck, ArrowRight, Bot, Activity, Lock } from 'lucide-react';

export const RoleSelectPage = ({ setCurrentView, setActiveTab }) => {
  const { login } = useAuth();

  const handleSelectRole = (role) => {
    if (role === 'patient') {
      login('patient@demo.com', 'demo1234', 'patient');
      if (setActiveTab) setActiveTab('dashboard');
      setCurrentView('dashboard');
    } else if (role === 'counselor') {
      login('counselor@demo.com', 'demo1234', 'counselor');
      if (setActiveTab) setActiveTab('counselor_overview');
      setCurrentView('dashboard');
    } else if (role === 'admin') {
      login('admin@demo.com', 'demo1234', 'admin');
      if (setActiveTab) setActiveTab('admin_overview');
      setCurrentView('dashboard');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #F8F7FF 0%, #EEEAFE 100%)',
      padding: '24px'
    }}>
      {/* Brand Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #8B7CF6 0%, #6C9BF2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          margin: '0 auto 16px',
          boxShadow: '0 8px 24px rgba(139, 124, 246, 0.3)'
        }}>
          <Sparkles size={30} />
        </div>
        <h1 style={{ fontSize: '2.4rem', fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em' }}>
          MindCare <span style={{ color: 'var(--primary-lavender)' }}>AI</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginTop: '6px', maxWidth: '480px' }}>
          Select your role to access your private portal
        </p>
      </div>

      {/* Role Portal Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px',
        maxWidth: '720px',
        width: '100%',
        marginBottom: '32px'
      }}>
        {/* Patient Portal Card */}
        <div 
          onClick={() => handleSelectRole('patient')}
          className="card-glass"
          style={{
            padding: '36px 28px',
            cursor: 'pointer',
            border: '2px solid transparent',
            display: 'flex',
            flexDirection: 'column',
            justify: 'space-between',
            transition: 'var(--transition-normal)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary-lavender)'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
        >
          <div>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '16px',
              background: 'var(--light-lavender)',
              color: 'var(--primary-lavender)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px'
            }}>
              <User size={28} />
            </div>

            <span className="badge badge-lavender" style={{ marginBottom: '8px' }}>
              Patient Portal
            </span>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '8px', fontFamily: 'var(--font-heading)' }}>
              I am a Patient
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: 1.6, marginBottom: '24px' }}>
              Access 24/7 AI Companion chat, daily mood check-ins, wellness score analytics, and counselor bookings.
            </p>
          </div>

          <button className="btn btn-primary" style={{ width: '100%' }}>
            Enter Patient Workspace <ArrowRight size={18} />
          </button>
        </div>

        {/* Counselor Portal Card */}
        <div 
          onClick={() => handleSelectRole('counselor')}
          className="card-glass"
          style={{
            padding: '36px 28px',
            cursor: 'pointer',
            border: '2px solid transparent',
            display: 'flex',
            flexDirection: 'column',
            justify: 'space-between',
            transition: 'var(--transition-normal)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--soft-blue)'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
        >
          <div>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '16px',
              background: 'var(--soft-blue-light)',
              color: '#2E65C6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px'
            }}>
              <HeartHandshake size={28} />
            </div>

            <span className="badge badge-blue" style={{ marginBottom: '8px' }}>
              Telehealth Professional
            </span>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '8px', fontFamily: 'var(--font-heading)' }}>
              I am a Counselor
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: 1.6, marginBottom: '24px' }}>
              Monitor assigned patient wellness trends, triage clinical alert notifications, and review appointment requests.
            </p>
          </div>

          <button className="btn btn-mint" style={{ width: '100%' }}>
            Enter Counselor Portal <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* Admin Link & Security Footer */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
        <button 
          onClick={() => handleSelectRole('admin')}
          style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <ShieldCheck size={16} color="#8FD8C8" /> Access Administrator Portal
        </button>

        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Lock size={12} /> HIPAA-Ready Architecture • End-to-End Encrypted Telehealth
        </div>
      </div>
    </div>
  );
};
