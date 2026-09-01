import React from 'react';
import { useAuth } from '../context/AuthContext';
import { UserCheck, Stethoscope, ShieldCheck, X } from 'lucide-react';

export const DemoSwitcherBar = () => {
  const { user, switchDemoRole, demoBannerVisible, setDemoBannerVisible } = useAuth();

  if (!demoBannerVisible) return null;

  return (
    <div style={{
      backgroundColor: '#25253A',
      color: '#FFFFFF',
      fontSize: '0.85rem',
      padding: '8px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '12px',
      zIndex: 9999,
      position: 'relative',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{
          background: '#8B7CF6',
          color: '#FFF',
          padding: '2px 8px',
          borderRadius: '12px',
          fontSize: '0.75rem',
          fontWeight: 700
        }}>DEMO MODE</span>
        <span>Switch active persona to test all 3 dashboards:</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          onClick={() => switchDemoRole('patient')}
          style={{
            background: user?.role === 'patient' ? '#8B7CF6' : 'rgba(255,255,255,0.1)',
            color: '#FFF',
            padding: '4px 12px',
            borderRadius: '16px',
            fontSize: '0.8rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s'
          }}
        >
          <UserCheck size={14} /> Patient (Arya)
        </button>

        <button
          onClick={() => switchDemoRole('counselor')}
          style={{
            background: user?.role === 'counselor' ? '#6C9BF2' : 'rgba(255,255,255,0.1)',
            color: '#FFF',
            padding: '4px 12px',
            borderRadius: '16px',
            fontSize: '0.8rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s'
          }}
        >
          <Stethoscope size={14} /> Counselor (Dr. Elena)
        </button>

        <button
          onClick={() => switchDemoRole('admin')}
          style={{
            background: user?.role === 'admin' ? '#8FD8C8' : 'rgba(255,255,255,0.1)',
            color: user?.role === 'admin' ? '#25253A' : '#FFF',
            padding: '4px 12px',
            borderRadius: '16px',
            fontSize: '0.8rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s'
          }}
        >
          <ShieldCheck size={14} /> Admin (Sarah)
        </button>

        <button
          onClick={() => setDemoBannerVisible(false)}
          style={{ color: '#A0A0B5', padding: '4px', marginLeft: '8px' }}
          title="Hide banner"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};
