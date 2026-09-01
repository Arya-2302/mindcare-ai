import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Mail, CheckCircle2, RefreshCw, ArrowLeft, ExternalLink, AlertCircle, Sparkles, ShieldCheck } from 'lucide-react';

export const VerificationPendingPage = ({ email, devVerificationUrl, setCurrentView }) => {
  const [cooldown, setCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleResend = async () => {
    if (cooldown > 0 || isResending) return;
    setIsResending(true);
    setStatusMsg('');
    setErrorMsg('');

    try {
      const res = await api.resendVerification(email);
      setStatusMsg(res.message || 'New verification email sent successfully!');
      setCooldown(60); // 60s rate-limit cooldown
    } catch (err) {
      setErrorMsg(err.message || 'Could not resend email. Please wait a moment.');
    } finally {
      setIsResending(false);
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
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <div style={{
          width: '52px',
          height: '52px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #8B7CF6 0%, #6C9BF2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          margin: '0 auto 12px',
          boxShadow: '0 8px 24px rgba(139, 124, 246, 0.3)'
        }}>
          <Sparkles size={28} />
        </div>
        <h1 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-heading)' }}>MindCare AI</h1>
      </div>

      {/* Main Pending Card */}
      <div className="card-glass" style={{ maxWidth: '520px', width: '100%', padding: '40px', textAlign: 'center', boxShadow: 'var(--shadow-md)' }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'var(--light-lavender)',
          color: 'var(--primary-lavender)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
          boxShadow: '0 4px 14px rgba(139, 124, 246, 0.2)'
        }}>
          <Mail size={32} />
        </div>

        <h2 style={{ fontSize: '1.8rem', marginBottom: '10px', fontFamily: 'var(--font-heading)' }}>
          Check your inbox 📩
        </h2>

        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '20px' }}>
          We've sent a verification link to your email address. Please verify your email to activate your MindCare AI account.
        </p>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 22px',
          borderRadius: 'var(--radius-pill)',
          background: 'var(--bg-lavender)',
          color: 'var(--text-dark)',
          fontWeight: 700,
          fontSize: '0.95rem',
          marginBottom: '28px',
          border: '1px solid var(--border-light)'
        }}>
          <Mail size={16} color="#8B7CF6" />
          <span>{email || 'user@example.com'}</span>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          <a
            href={`mailto:${email}`}
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary"
            style={{ width: '100%', padding: '14px' }}
          >
            <ExternalLink size={18} /> Open Email Application
          </a>

          <button
            onClick={handleResend}
            disabled={cooldown > 0 || isResending}
            className="btn btn-outline"
            style={{ width: '100%', padding: '12px' }}
          >
            <RefreshCw size={16} className={isResending ? 'animate-pulse-soft' : ''} />
            {cooldown > 0 ? `Resend Verification Email (${cooldown}s)` : isResending ? 'Sending Email...' : 'Resend Verification Email'}
          </button>
        </div>

        {statusMsg && (
          <div style={{ background: '#EBF7F4', color: '#117863', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px' }}>
            <CheckCircle2 size={16} style={{ display: 'inline', marginRight: '6px' }} /> {statusMsg}
          </div>
        )}

        {errorMsg && (
          <div style={{ background: 'var(--soft-coral-light)', color: '#B91C1C', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px' }}>
            <AlertCircle size={16} style={{ display: 'inline', marginRight: '6px' }} /> {errorMsg}
          </div>
        )}

        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '24px' }}>
          Didn't receive the email? Check your spam folder or resend the verification email above.
        </p>

        {/* Verification Link Shortcut Card */}
        {devVerificationUrl && (
          <div style={{
            background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
            border: '1.5px solid #F59E0B',
            borderRadius: 'var(--radius-sm)',
            padding: '16px',
            fontSize: '0.85rem',
            color: '#78350F',
            textAlign: 'left',
            marginBottom: '20px',
            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.15)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800 }}>
              <ShieldCheck size={18} color="#D97706" /> Instant Account Activation Link:
            </div>
            <div style={{ marginTop: '6px', fontSize: '0.8rem', color: '#92400E', lineHeight: 1.4 }}>
              Resend free test accounts restrict direct SMTP delivery to outside recipient domains. Click below to activate your account immediately:
            </div>
            <a 
              href={devVerificationUrl} 
              style={{
                display: 'inline-block',
                marginTop: '10px',
                background: '#D97706',
                color: '#FFFFFF',
                fontWeight: 700,
                padding: '8px 16px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '0.85rem'
              }}
            >
              👉 Click Here to Verify & Activate Account Now →
            </a>
          </div>
        )}

        <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
          <button
            onClick={() => setCurrentView('auth_portal')}
            style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <ArrowLeft size={16} /> Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};
