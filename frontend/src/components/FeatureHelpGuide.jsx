import React from 'react';
import { HelpCircle, Info, Sparkles, CheckCircle2 } from 'lucide-react';

export const FeatureHelpCallout = ({ title, description, tip, guideMode }) => {
  if (!guideMode) return null;

  return (
    <div className="animate-fade-in" style={{
      background: 'linear-gradient(135deg, #FFF9E6 0%, #FEF3C7 100%)',
      border: '1.5px solid #F59E0B',
      borderRadius: 'var(--radius-sm)',
      padding: '12px 16px',
      marginBottom: '16px',
      boxShadow: '0 4px 12px rgba(245, 158, 11, 0.12)',
      position: 'relative',
      zIndex: 10
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#B45309', fontWeight: 700, fontSize: '0.85rem' }}>
        <HelpCircle size={16} />
        <span>FEATURE GUIDE: {title}</span>
      </div>
      <p style={{ color: '#78350F', fontSize: '0.875rem', marginTop: '4px', lineHeight: 1.5 }}>
        {description}
      </p>
      {tip && (
        <div style={{ fontSize: '0.78rem', color: '#92400E', marginTop: '6px', fontWeight: 600 }}>
          💡 <strong>Pro Tip:</strong> {tip}
        </div>
      )}
    </div>
  );
};

export const GuideToggleButton = ({ guideMode, setGuideMode }) => {
  return (
    <button
      type="button"
      onClick={() => setGuideMode(!guideMode)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 16px',
        borderRadius: 'var(--radius-pill)',
        fontSize: '0.85rem',
        fontWeight: 700,
        backgroundColor: guideMode ? '#FEF3C7' : 'var(--light-lavender)',
        color: guideMode ? '#B45309' : 'var(--primary-lavender)',
        border: guideMode ? '1.5px solid #F59E0B' : '1.5px solid var(--primary-lavender)',
        cursor: 'pointer',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
      title="Toggle interactive explanations for all page features"
    >
      <HelpCircle size={16} />
      <span>{guideMode ? '💡 Feature Guide: ON' : '❓ What does everything do?'}</span>
    </button>
  );
};
