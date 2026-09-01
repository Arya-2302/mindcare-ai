import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Lock, Bell, Shield, CheckCircle2, Save } from 'lucide-react';

export const ProfileSettingsPage = () => {
  const { user } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState('personal');

  const [name, setName] = useState(user?.name || 'Arya Sharma');
  const [email, setEmail] = useState(user?.email || 'patient@demo.com');
  const [phone, setPhone] = useState('+1 (555) 234-5678');

  const [dataSharing, setDataSharing] = useState(true);
  const [counselorAccess, setCounselorAccess] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);

  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '900px' }}>
      <div>
        <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)' }}>Account & Settings</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '4px' }}>
          Manage your personal details, data privacy preferences, and notifications
        </p>
      </div>

      {/* Subtabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
        {[
          { id: 'personal', label: 'Personal Info', icon: User },
          { id: 'privacy', label: 'Privacy & Consent', icon: Shield },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'security', label: 'Security', icon: Lock }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: 'var(--radius-sm)',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? 'var(--primary-lavender)' : 'var(--text-secondary)',
                backgroundColor: isActive ? 'var(--light-lavender)' : 'transparent'
              }}
            >
              <Icon size={16} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Settings Form Container */}
      <div className="card-glass" style={{ padding: '32px' }}>
        {saved && (
          <div className="badge badge-mint animate-fade-in" style={{ padding: '10px 16px', fontSize: '0.9rem', marginBottom: '20px', width: '100%' }}>
            <CheckCircle2 size={16} /> Preferences updated successfully!
          </div>
        )}

        {activeSubTab === 'personal' && (
          <form onSubmit={handleSave}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>Personal Information</h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
              <img
                src={user?.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80"}
                alt="Avatar"
                style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <button type="button" className="btn btn-outline btn-sm">Change Photo</button>
            </div>

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                className="form-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button type="submit" className="btn btn-primary btn-sm">
                <Save size={16} /> Save Changes
              </button>
            </div>
          </form>
        )}

        {activeSubTab === 'privacy' && (
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Privacy & Data Control</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>
              Your conversations are private and end-to-end encrypted. Control how your telemetry is shared.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'var(--bg-lavender)', borderRadius: '8px' }}>
                <div>
                  <div style={{ fontWeight: 700 }}>Allow Anonymous AI Model Improvement</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Share anonymized sentiment signals to fine-tune emotion classification.</div>
                </div>
                <input type="checkbox" checked={dataSharing} onChange={(e) => setDataSharing(e.target.checked)} style={{ width: '20px', height: '20px' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'var(--bg-lavender)', borderRadius: '8px' }}>
                <div>
                  <div style={{ fontWeight: 700 }}>Grant Assigned Counselor Access</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Allow licensed counselors to view high-level wellness score trends.</div>
                </div>
                <input type="checkbox" checked={counselorAccess} onChange={(e) => setCounselorAccess(e.target.checked)} style={{ width: '20px', height: '20px' }} />
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'notifications' && (
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>Notification Preferences</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'var(--bg-lavender)', borderRadius: '8px' }}>
                <div>
                  <div style={{ fontWeight: 700 }}>Email Reminders</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Receive daily mood check-in prompts & appointment updates.</div>
                </div>
                <input type="checkbox" checked={emailNotifs} onChange={(e) => setEmailNotifs(e.target.checked)} style={{ width: '20px', height: '20px' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'var(--bg-lavender)', borderRadius: '8px' }}>
                <div>
                  <div style={{ fontWeight: 700 }}>Browser Push Notifications</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Real-time alerts for session bookings and AI reflections.</div>
                </div>
                <input type="checkbox" checked={pushNotifs} onChange={(e) => setPushNotifs(e.target.checked)} style={{ width: '20px', height: '20px' }} />
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'security' && (
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>Security Settings</h3>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input type="password" className="form-input" placeholder="••••••••" />
              </div>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <input type="password" className="form-input" placeholder="••••••••" />
              </div>
              <button type="submit" className="btn btn-primary btn-sm" style={{ marginTop: '12px' }}>
                Update Password
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
