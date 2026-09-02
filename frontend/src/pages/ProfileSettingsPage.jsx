import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Lock, Bell, Shield, CheckCircle2, Save, Upload, AlertCircle, Camera } from 'lucide-react';

const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80";

export const ProfileSettingsPage = () => {
  const { user, updateUserProfile } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState('personal');

  // Controlled Personal Information state initialized directly from context
  const [name, setName] = useState(() => user?.name || 'Arya Sharma');
  const [email, setEmail] = useState(() => user?.email || 'patient@demo.com');
  const [phone, setPhone] = useState(() => user?.phone || '+1 (555) 234-5678');
  const [avatar, setAvatar] = useState(() => user?.avatar || DEFAULT_AVATAR);

  // Status & Feedback states
  const [isSaving, setIsSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Privacy & Notifications state
  const [dataSharing, setDataSharing] = useState(() => user?.preferences?.dataSharing ?? true);
  const [counselorAccess, setCounselorAccess] = useState(() => user?.preferences?.counselorAccess ?? true);
  const [emailNotifs, setEmailNotifs] = useState(() => user?.preferences?.emailNotifs ?? true);
  const [pushNotifs, setPushNotifs] = useState(() => user?.preferences?.pushNotifs ?? true);

  // Security passwords state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Synchronize when active user changes (e.g. initial login / restore)
  useEffect(() => {
    if (user) {
      if (user.name) setName(user.name);
      if (user.email) setEmail(user.email);
      if (user.phone) setPhone(user.phone);
      if (user.avatar) setAvatar(user.avatar);
      if (user.preferences) {
        if (typeof user.preferences.dataSharing === 'boolean') setDataSharing(user.preferences.dataSharing);
        if (typeof user.preferences.counselorAccess === 'boolean') setCounselorAccess(user.preferences.counselorAccess);
        if (typeof user.preferences.emailNotifs === 'boolean') setEmailNotifs(user.preferences.emailNotifs);
        if (typeof user.preferences.pushNotifs === 'boolean') setPushNotifs(user.preferences.pushNotifs);
      }
    }
  }, [user?.id]);

  // Handle Photo Upload & Optimization via Native File Input
  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg('');
    setToastMsg('');

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (JPG, JPEG, PNG, or WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Draw to a clean 250x250 square canvas
        const canvas = document.createElement('canvas');
        const MAX_DIM = 250;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_DIM) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
        setAvatar(optimizedDataUrl);

        // Instantly persist the avatar in AuthContext and localStorage
        updateUserProfile({ avatar: optimizedDataUrl });
        setToastMsg('Changes saved successfully');
        setTimeout(() => setToastMsg(''), 4500);
      };
      img.onerror = () => {
        setErrorMsg('Failed to process the selected image. Please try another image.');
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
    // Reset file input value so selecting the same file again triggers onChange
    e.target.value = '';
  };

  // Handle Personal Info Save
  const handleSavePersonalInfo = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setToastMsg('');

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();

    // Validations
    if (!cleanName) {
      setErrorMsg('Full Name cannot be empty.');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailPattern.test(cleanEmail)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (!cleanPhone) {
      setErrorMsg('Please enter a valid phone number.');
      return;
    }

    setIsSaving(true);

    // Save updated data to context and localStorage
    setTimeout(() => {
      updateUserProfile({
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        avatar: avatar
      });

      setIsSaving(false);
      setToastMsg('Changes saved successfully');
      setTimeout(() => setToastMsg(''), 4500);
    }, 150);
  };

  // Handle Privacy / Notification Preferences Save
  const handleSavePreferences = (type, updatedPrefs) => {
    setErrorMsg('');
    const prefs = {
      dataSharing,
      counselorAccess,
      emailNotifs,
      pushNotifs,
      ...updatedPrefs
    };
    updateUserProfile({ preferences: prefs });
    setToastMsg('Changes saved successfully');
    setTimeout(() => setToastMsg(''), 4500);
  };

  // Handle Security Password Update
  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (!currentPassword) {
      setErrorMsg('Please enter your current password.');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters long.');
      return;
    }

    setToastMsg('Changes saved successfully');
    setCurrentPassword('');
    setNewPassword('');
    setTimeout(() => setToastMsg(''), 4500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '900px' }}>
      <div>
        <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)' }}>Account & Settings</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '4px' }}>
          Manage your personal details, profile avatar, data privacy preferences, and notifications
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
              onClick={() => {
                setActiveSubTab(tab.id);
                setErrorMsg('');
                setToastMsg('');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: 'var(--radius-sm)',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? 'var(--primary-lavender)' : 'var(--text-secondary)',
                backgroundColor: isActive ? 'var(--light-lavender)' : 'transparent',
                transition: 'var(--transition-fast)'
              }}
            >
              <Icon size={16} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Settings Form Container */}
      <div className="card-glass" style={{ padding: '32px', position: 'relative' }}>
        
        {/* Prominent Saved Changes Toast / Bar */}
        {toastMsg && (
          <div 
            className="animate-fade-in"
            style={{
              padding: '14px 20px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: '#EBF7F4',
              border: '1.5px solid #8FD8C8',
              color: '#117863',
              fontWeight: 700,
              fontSize: '0.95rem',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 4px 16px rgba(143, 216, 200, 0.25)'
            }}
          >
            <CheckCircle2 size={20} color="#117863" />
            <span>✓ {toastMsg}</span>
          </div>
        )}

        {/* Error Alert Box */}
        {errorMsg && (
          <div 
            className="animate-fade-in" 
            style={{
              padding: '14px 20px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: '#FEE2E2',
              border: '1.5px solid #F87171',
              color: '#B91C1C',
              fontWeight: 600,
              fontSize: '0.9rem',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <AlertCircle size={18} color="#B91C1C" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Hidden File Input for Avatar Selection */}
        <input
          id="profile-photo-upload-input"
          type="file"
          accept="image/png, image/jpeg, image/jpg, image/webp"
          style={{ display: 'none' }}
          onChange={handlePhotoSelect}
        />

        {/* TAB 1: PERSONAL INFORMATION */}
        {activeSubTab === 'personal' && (
          <form onSubmit={handleSavePersonalInfo}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>Personal Information</h3>

            {/* Profile Photo Upload Section */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
              <div style={{ position: 'relative' }}>
                <img
                  src={avatar}
                  alt="Avatar"
                  style={{
                    width: '84px',
                    height: '84px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    boxShadow: '0 4px 14px rgba(139, 124, 246, 0.2)',
                    border: '3px solid #FFFFFF'
                  }}
                />
                <label
                  htmlFor="profile-photo-upload-input"
                  style={{
                    position: 'absolute',
                    bottom: '0',
                    right: '0',
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary-lavender)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                    cursor: 'pointer'
                  }}
                  title="Upload new photo"
                >
                  <Camera size={14} />
                </label>
              </div>

              <div>
                <label
                  htmlFor="profile-photo-upload-input"
                  className="btn btn-outline btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                >
                  <Upload size={14} /> Change Photo
                </label>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
                  Supports JPG, JPEG, PNG, or WEBP. Persists automatically after selection.
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="profile-full-name-input">Full Name</label>
              <input
                id="profile-full-name-input"
                type="text"
                className="form-input"
                placeholder="e.g. Arya Mishra"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="profile-email-input">Email Address</label>
              <input
                id="profile-email-input"
                type="email"
                className="form-input"
                placeholder="e.g. patient@demo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="profile-phone-input">Phone Number</label>
              <input
                id="profile-phone-input"
                type="tel"
                className="form-input"
                placeholder="e.g. +1 (555) 234-5678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button
                type="submit"
                disabled={isSaving}
                className="btn btn-primary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: '140px', justifyContent: 'center' }}
              >
                <Save size={16} /> {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: PRIVACY & CONSENT */}
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
                <input
                  type="checkbox"
                  checked={dataSharing}
                  onChange={(e) => {
                    const val = e.target.checked;
                    setDataSharing(val);
                    handleSavePreferences('Privacy settings', { dataSharing: val });
                  }}
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'var(--bg-lavender)', borderRadius: '8px' }}>
                <div>
                  <div style={{ fontWeight: 700 }}>Grant Assigned Counselor Access</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Allow licensed counselors to view high-level wellness score trends.</div>
                </div>
                <input
                  type="checkbox"
                  checked={counselorAccess}
                  onChange={(e) => {
                    const val = e.target.checked;
                    setCounselorAccess(val);
                    handleSavePreferences('Privacy settings', { counselorAccess: val });
                  }}
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: NOTIFICATIONS */}
        {activeSubTab === 'notifications' && (
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>Notification Preferences</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'var(--bg-lavender)', borderRadius: '8px' }}>
                <div>
                  <div style={{ fontWeight: 700 }}>Email Reminders</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Receive daily mood check-in prompts & appointment updates.</div>
                </div>
                <input
                  type="checkbox"
                  checked={emailNotifs}
                  onChange={(e) => {
                    const val = e.target.checked;
                    setEmailNotifs(val);
                    handleSavePreferences('Notification preferences', { emailNotifs: val });
                  }}
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'var(--bg-lavender)', borderRadius: '8px' }}>
                <div>
                  <div style={{ fontWeight: 700 }}>Browser Push Notifications</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Real-time alerts for session bookings and AI reflections.</div>
                </div>
                <input
                  type="checkbox"
                  checked={pushNotifs}
                  onChange={(e) => {
                    const val = e.target.checked;
                    setPushNotifs(val);
                    handleSavePreferences('Notification preferences', { pushNotifs: val });
                  }}
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SECURITY */}
        {activeSubTab === 'security' && (
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>Security Settings</h3>
            <form onSubmit={handleUpdatePassword}>
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
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
