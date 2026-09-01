import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { CheckCircle2, Clock, XCircle, Sparkles, ArrowRight, RefreshCw, Mail } from 'lucide-react';

export const VerifyEmailPage = ({ token, setCurrentView, setVerificationPendingEmail }) => {
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'expired', 'invalid'
  const [message, setMessage] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [resendStatus, setResendStatus] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('invalid');
      setMessage('No verification token provided in URL.');
      return;
    }

    const verify = async () => {
      try {
        const res = await api.verifyEmailToken(token);
        setStatus('success');
        setMessage(res.message || 'Email verified successfully 🎉');
        if (res.email) setUserEmail(res.email);
      } catch (err) {
        if (err.code === 'token_expired') {
          setStatus('expired');
          setMessage('This verification link has expired. Please request a new verification email.');
        } else {
          setStatus('invalid');
          setMessage(err.message || 'Invalid or already used verification link.');
        }
      }
    };

    verify();
  }, [token]);

  const handleResendNew = async () => {
    if (!userEmail) {
      setCurrentView('auth_portal');
      return;
    }
    setIsResending(true);
    setResendStatus('');

    try {
      const res = await api.resendVerification(userEmail);
      setResendStatus(res.message || 'New verification email dispatched!');
      if (setVerificationPendingEmail) setVerificationPendingEmail(userEmail);
      setTimeout(() => {
        setCurrentView('verification_pending');
      }, 1500);
    } catch (err) {
      setResendStatus(err.message || 'Could not resend verification email.');
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

      <div className="card-glass" style={{ maxWidth: '480px', width: '100%', padding: '40px', textAlign: 'center' }}>
        
        {/* State 1: Verifying */}
        {status === 'verifying' && (
          <div style={{ padding: '20px 0' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'var(--light-lavender)',
              color: 'var(--primary-lavender)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <RefreshCw size={28} className="animate-pulse-soft" />
            </div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Verifying your token...</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem' }}>
              Validating security token with MindCare backend engine.
            </p>
          </div>
        )}

        {/* State 2: Success 🎉 */}
        {status === 'success' && (
          <div className="animate-fade-in">
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'var(--mint-green-light)',
              color: '#117863',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              boxShadow: '0 4px 14px rgba(143, 216, 200, 0.3)'
            }}>
              <CheckCircle2 size={36} />
            </div>

            <h2 style={{ fontSize: '1.8rem', marginBottom: '10px', fontFamily: 'var(--font-heading)' }}>
              Email verified successfully 🎉
            </h2>

            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '28px' }}>
              Your MindCare AI account is now active. You can log in to access your private telehealth portal.
            </p>

            <button
              onClick={() => setCurrentView('auth_portal')}
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px' }}
            >
              Continue to Login <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* State 3: Expired ⏰ */}
        {status === 'expired' && (
          <div className="animate-fade-in">
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'var(--amber-light)',
              color: '#B45309',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              <Clock size={36} />
            </div>

            <h2 style={{ fontSize: '1.8rem', marginBottom: '10px', fontFamily: 'var(--font-heading)' }}>
              Verification link expired
            </h2>

            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '28px' }}>
              This verification link is no longer valid. Please request a new verification email to activate your account.
            </p>

            <button
              onClick={handleResendNew}
              disabled={isResending}
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px' }}
            >
              <Mail size={18} /> {isResending ? 'Sending New Email...' : 'Send New Verification Email'}
            </button>

            {resendStatus && (
              <div style={{ marginTop: '14px', fontSize: '0.85rem', color: '#117863' }}>{resendStatus}</div>
            )}
          </div>
        )}

        {/* State 4: Invalid ❌ */}
        {status === 'invalid' && (
          <div className="animate-fade-in">
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'var(--soft-coral-light)',
              color: '#B91C1C',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              <XCircle size={36} />
            </div>

            <h2 style={{ fontSize: '1.8rem', marginBottom: '10px', fontFamily: 'var(--font-heading)' }}>
              Invalid verification link
            </h2>

            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '28px' }}>
              {message || 'This verification link is invalid or has already been used. Please request a new link.'}
            </p>

            <button
              onClick={() => setCurrentView('auth_portal')}
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px' }}
            >
              Back to Login & Request New Link
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
