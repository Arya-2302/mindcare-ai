import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ArrowRight, Lock, Mail, User, ShieldCheck, HeartHandshake, Key } from 'lucide-react';

export const LoginPage = ({ setCurrentView }) => {
  const { login, switchDemoRole } = useAuth();
  const [email, setEmail] = useState('patient@demo.com');
  const [password, setPassword] = useState('demo1234');
  const [role, setRole] = useState('patient');

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password, role);
    setCurrentView('dashboard');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #F8F7FF 0%, #EEEAFE 100%)',
      padding: '24px'
    }}>
      <div className="card-glass" style={{ maxWidth: '440px', width: '100%', padding: '40px' }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div 
            onClick={() => setCurrentView('landing')}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #8B7CF6 0%, #6C9BF2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              margin: '0 auto 12px',
              cursor: 'pointer'
            }}
          >
            <Sparkles size={24} />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-heading)' }}>Welcome back</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Log in to your private MindCare AI account
          </p>
        </div>

        {/* Instant Demo Quick Logins */}
        <div style={{
          background: 'var(--bg-lavender)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-sm)',
          padding: '12px',
          marginBottom: '24px'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary-lavender)', marginBottom: '8px', textTransform: 'uppercase' }}>
            ⚡ 1-Click Quick Demo Login
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => {
                switchDemoRole('patient');
                setCurrentView('dashboard');
              }}
              className="btn btn-secondary btn-sm"
              style={{ flex: 1, fontSize: '0.8rem' }}
            >
              Patient
            </button>
            <button
              type="button"
              onClick={() => {
                switchDemoRole('counselor');
                setCurrentView('dashboard');
              }}
              className="btn btn-mint btn-sm"
              style={{ flex: 1, fontSize: '0.8rem' }}
            >
              Counselor
            </button>
            <button
              type="button"
              onClick={() => {
                switchDemoRole('admin');
                setCurrentView('dashboard');
              }}
              className="btn btn-outline btn-sm"
              style={{ flex: 1, fontSize: '0.8rem' }}
            >
              Admin
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ paddingLeft: '40px' }}
              />
              <Mail size={18} color="#73738A" style={{ position: 'absolute', left: '12px', top: '14px' }} />
            </div>
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label">Password</label>
              <button 
                type="button"
                onClick={() => setCurrentView('forgot_password')} 
                style={{ fontSize: '0.8rem', color: 'var(--primary-lavender)', fontWeight: 600 }}
              >
                Forgot?
              </button>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingLeft: '40px' }}
              />
              <Lock size={18} color="#73738A" style={{ position: 'absolute', left: '12px', top: '14px' }} />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
            Log In <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Don't have an account?{' '}
          <button 
            onClick={() => setCurrentView('register')}
            style={{ color: 'var(--primary-lavender)', fontWeight: 700 }}
          >
            Create account
          </button>
        </div>
      </div>
    </div>
  );
};

export const RegisterPage = ({ setCurrentView }) => {
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('patient');

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email || 'newuser@demo.com', password, role);
    setCurrentView('dashboard');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #F8F7FF 0%, #EEEAFE 100%)',
      padding: '24px'
    }}>
      <div className="card-glass" style={{ maxWidth: '460px', width: '100%', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div 
            onClick={() => setCurrentView('landing')}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #8B7CF6 0%, #6C9BF2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              margin: '0 auto 12px',
              cursor: 'pointer'
            }}
          >
            <Sparkles size={24} />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-heading)' }}>Create your account</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Start your private mental wellness journey
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Role Selection Tabs */}
          <div style={{ marginBottom: '20px' }}>
            <label className="form-label">I am joining as a:</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '6px' }}>
              <button
                type="button"
                onClick={() => setRole('patient')}
                style={{
                  padding: '12px',
                  borderRadius: 'var(--radius-sm)',
                  border: role === 'patient' ? '2px solid var(--primary-lavender)' : '1.5px solid var(--border-light)',
                  background: role === 'patient' ? 'var(--light-lavender)' : '#FFFFFF',
                  fontWeight: role === 'patient' ? 700 : 500,
                  color: role === 'patient' ? 'var(--primary-lavender)' : 'var(--text-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <User size={18} /> Patient / User
              </button>

              <button
                type="button"
                onClick={() => setRole('counselor')}
                style={{
                  padding: '12px',
                  borderRadius: 'var(--radius-sm)',
                  border: role === 'counselor' ? '2px solid var(--soft-blue)' : '1.5px solid var(--border-light)',
                  background: role === 'counselor' ? 'var(--soft-blue-light)' : '#FFFFFF',
                  fontWeight: role === 'counselor' ? 700 : 500,
                  color: role === 'counselor' ? '#2E65C6' : 'var(--text-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <HeartHandshake size={18} /> Counselor
              </button>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
              * Admin accounts are provisioned separately by system administrators.
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Arya Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Create strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
            Create Account <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <button 
            onClick={() => setCurrentView('login')}
            style={{ color: 'var(--primary-lavender)', fontWeight: 700 }}
          >
            Log in
          </button>
        </div>
      </div>
    </div>
  );
};

export const ForgotPasswordPage = ({ setCurrentView }) => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #F8F7FF 0%, #EEEAFE 100%)',
      padding: '24px'
    }}>
      <div className="card-glass" style={{ maxWidth: '440px', width: '100%', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: 'var(--light-lavender)',
            color: 'var(--primary-lavender)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px'
          }}>
            <Key size={24} />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-heading)' }}>Reset Password</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Enter your email to receive password reset instructions
          </p>
        </div>

        {sent ? (
          <div style={{ textAlign: 'center', padding: '16px' }}>
            <div className="badge badge-mint" style={{ padding: '8px 16px', fontSize: '0.9rem', marginBottom: '16px' }}>
              Reset Link Sent!
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
              Check <strong>{email}</strong> for password reset link instructions.
            </p>
            <button 
              onClick={() => setCurrentView('login')}
              className="btn btn-primary btn-sm"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
            <div className="form-group">
              <label className="form-label">Registered Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
              Send Reset Instructions
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <button 
            onClick={() => setCurrentView('login')}
            style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}
          >
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};
