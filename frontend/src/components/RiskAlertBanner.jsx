import React from 'react';
import { HeartHandshake, Sparkles, PhoneCall, X, Shield } from 'lucide-react';

export const RiskAlertBanner = ({ isOpen, onClose, onConnectCounselor, onExploreWellness }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card animate-fade-in" style={{ borderTop: '4px solid var(--soft-peach)', textAlign: 'center' }}>
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '16px', right: '16px', color: 'var(--text-secondary)' }}
        >
          <X size={20} />
        </button>

        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'var(--soft-peach-light)',
          color: '#C04E30',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px'
        }}>
          <HeartHandshake size={32} />
        </div>

        <h3 style={{ fontSize: '1.4rem', marginBottom: '8px', fontFamily: 'var(--font-heading)' }}>
          We noticed you may be going through a difficult moment.
        </h3>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '24px', lineHeight: 1.6 }}>
          It's completely okay to feel overwhelmed sometimes. MindCare AI is here to support you, and human professionals are ready if you'd like someone to talk with.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            onClick={() => {
              onClose();
              if (onConnectCounselor) onConnectCounselor();
            }}
            className="btn btn-primary"
            style={{ width: '100%' }}
          >
            <HeartHandshake size={18} /> Talk to a Counselor
          </button>

          <button
            onClick={() => {
              onClose();
              if (onExploreWellness) onExploreWellness();
            }}
            className="btn btn-secondary"
            style={{ width: '100%' }}
          >
            <Sparkles size={18} /> Explore Relaxation & Wellness
          </button>

          <button
            onClick={onClose}
            className="btn btn-outline"
            style={{ width: '100%', border: 'none', color: 'var(--text-secondary)' }}
          >
            I'm Okay Right Now
          </button>
        </div>

        <div style={{
          marginTop: '20px',
          paddingTop: '16px',
          borderTop: '1px solid var(--border-light)',
          fontSize: '0.8rem',
          color: 'var(--text-muted)'
        }}>
          If you are experiencing an urgent medical emergency, please call 988 (Lifeline) or your local emergency service.
        </div>
      </div>
    </div>
  );
};
