import React, { useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Sparkles, User, HeartHandshake, ShieldCheck, Lock, Mail, ArrowRight, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';

export const AuthPortalPage = ({ setCurrentView, setActiveTab }) => {
  const { loginUser, registerUser } = useAuth();
  const [selectedRole, setSelectedRole] = useState('patient'); // 'patient', 'counselor', 'admin'
  const [mode, setMode] = useState('login'); // 'login' or 'register'

  // Input states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [licenseId, setLicenseId] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Registration Success Card state
  const [registeredSuccess, setRegisteredSuccess] = useState(null);

  // Status & Error states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRoleTab = (role) => {
    setSelectedRole(role);
    setErrorMsg('');
    setRegisteredSuccess(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setRegisteredSuccess(null);
    setIsLoading(true);

    const cleanEmail = email.trim().toLowerCase();

    try {
      if (mode === 'register') {
        const fullName = name.trim() || `${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} User`;
        const res = await registerUser(fullName, cleanEmail, password, selectedRole);

        if (res && res.success) {
          // Show inline registration success card
          setRegisteredSuccess({
            email: cleanEmail,
            message: res.message || 'Account created successfully'
          });
        }
      } else {
        // Mode: Login
        const authUser = await loginUser(cleanEmail, password, selectedRole);
        if (authUser) {
          if (setActiveTab) {
            if (selectedRole === 'counselor') setActiveTab('counselor_overview');
            else if (selectedRole === 'admin') setActiveTab('admin_overview');
            else setActiveTab('dashboard');
          }
          setCurrentView('dashboard');
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToLogin = () => {
    setRegisteredSuccess(null);
    setMode('login');
    setPassword('');
    setErrorMsg('');
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
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{
          width: '56px',
          height: '56px',
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
        <h1 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em' }}>
          MindCare <span style={{ color: 'var(--primary-lavender)' }}>AI</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '4px' }}>
          Intelligent Telehealth & Mental Wellness Platform
        </p>
      </div>

      {/* Auth Card Container */}
      <div className="card-glass" style={{ maxWidth: '480px', width: '100%', padding: '36px', boxShadow: 'var(--shadow-md)' }}>
        
        {/* Registration Success Screen */}
        {registeredSuccess ? (
          <div style={{ textAlign: 'center', padding: '10px 0' }} className="animate-fade-in">
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#EBF7F4',
              color: '#117863',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              boxShadow: '0 4px 14px rgba(143, 216, 200, 0.3)'
            }}>
              <CheckCircle2 size={36} />
            </div>

            <h2 style={{ fontSize: '1.6rem', marginBottom: '10px', fontFamily: 'var(--font-heading)' }}>
              Account Created Successfully! 🎉
            </h2>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '20px' }}>
              Your MindCare AI {selectedRole} account is ready. A confirmation email has been sent to <strong>{registeredSuccess.email}</strong>.
            </p>

            <button
              onClick={handleGoToLogin}
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px' }}
            >
              Go to {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Login <ArrowRight size={18} />
            </button>
          </div>
        ) : (
          <>
            {/* Role Portal Selector Tabs */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                SELECT ACCESS PORTAL
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => handleRoleTab('patient')}
                  style={{
                    padding: '10px 8px',
                    borderRadius: 'var(--radius-sm)',
                    border: selectedRole === 'patient' ? '2px solid var(--primary-lavender)' : '1px solid var(--border-light)',
                    background: selectedRole === 'patient' ? 'var(--light-lavender)' : '#FFFFFF',
                    color: selectedRole === 'patient' ? 'var(--primary-lavender)' : 'var(--text-secondary)',
                    fontWeight: selectedRole === 'patient' ? 700 : 500,
                    fontSize: '0.825rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <User size={15} /> Patient
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleTab('counselor')}
                  style={{
                    padding: '10px 8px',
                    borderRadius: 'var(--radius-sm)',
                    border: selectedRole === 'counselor' ? '2px solid var(--soft-blue)' : '1px solid var(--border-light)',
                    background: selectedRole === 'counselor' ? 'var(--soft-blue-light)' : '#FFFFFF',
                    color: selectedRole === 'counselor' ? '#2E65C6' : 'var(--text-secondary)',
                    fontWeight: selectedRole === 'counselor' ? 700 : 500,
                    fontSize: '0.825rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <HeartHandshake size={15} /> Counselor
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleTab('admin')}
                  style={{
                    padding: '10px 8px',
                    borderRadius: 'var(--radius-sm)',
                    border: selectedRole === 'admin' ? '2px solid var(--mint-green)' : '1px solid var(--border-light)',
                    background: selectedRole === 'admin' ? 'var(--mint-green-light)' : '#FFFFFF',
                    color: selectedRole === 'admin' ? '#117863' : 'var(--text-secondary)',
                    fontWeight: selectedRole === 'admin' ? 700 : 500,
                    fontSize: '0.825rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <ShieldCheck size={15} /> Admin
                </button>
              </div>
            </div>

            {/* Form Title */}
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-heading)' }}>
                {mode === 'login' ? `Log In to ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Portal` : `Register New ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Account`}
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {mode === 'register' ? 'Create your account to start your mental wellness journey.' : 'Sign in using your registered email address and password.'}
              </p>
            </div>

            {/* Error Alert Box */}
            {errorMsg && (
              <div style={{ background: 'var(--soft-coral-light)', color: '#B91C1C', padding: '12px 16px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={16} /> {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {mode === 'register' && (
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder={selectedRole === 'counselor' ? 'Dr. Full Name' : 'e.g. Test Patient'}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              )}

              {mode === 'register' && selectedRole === 'counselor' && (
                <div className="form-group">
                  <label className="form-label">Psychology License ID</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. PSY-89412-CA"
                    value={licenseId}
                    onChange={(e) => setLicenseId(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ paddingLeft: '40px' }}
                  />
                  <Mail size={18} color="#73738A" style={{ position: 'absolute', left: '12px', top: '14px' }} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-input"
                    placeholder={mode === 'login' ? "Enter password" : "Create password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ paddingLeft: '40px', paddingRight: '40px' }}
                  />
                  <Lock size={18} color="#73738A" style={{ position: 'absolute', left: '12px', top: '14px' }} />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '12px', top: '14px', color: '#73738A' }}
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`btn ${selectedRole === 'counselor' ? 'btn-mint' : 'btn-primary'}`}
                style={{ width: '100%', marginTop: '12px', padding: '14px' }}
              >
                {isLoading ? 'Processing...' : (mode === 'login' ? `Log In to ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Portal` : `Create ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Account`)} <ArrowRight size={16} />
              </button>
            </form>

            {/* Mode Switcher */}
            <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {mode === 'login' ? (
                <>
                  Need to create a new account?{' '}
                  <button 
                    type="button" 
                    onClick={() => { setMode('register'); setErrorMsg(''); }} 
                    style={{ color: 'var(--primary-lavender)', fontWeight: 700 }}
                  >
                    Sign Up as {selectedRole}
                  </button>
                </>
              ) : (
                <>
                  Already registered?{' '}
                  <button 
                    type="button" 
                    onClick={() => { setMode('login'); setErrorMsg(''); }} 
                    style={{ color: 'var(--primary-lavender)', fontWeight: 700 }}
                  >
                    Log into {selectedRole} portal
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>

      {/* Security Note Footer */}
      <div style={{ marginTop: '24px', fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center', maxWidth: '420px' }}>
        🔐 Bcrypt password encryption • Instant active account authentication.
      </div>
    </div>
  );
};
