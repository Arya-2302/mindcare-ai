import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Lock, Bell, Shield, CheckCircle2, Save, Upload, AlertCircle, Camera } from 'lucide-react';

const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80";

export const ProfileSettingsPage = () => {
  const { user, updateUserProfile } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState('personal');

  // Personal Information state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState(DEFAULT_AVATAR);

  // Status & Feedback states
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Privacy & Notifications state
  const [dataSharing, setDataSharing] = useState(true);
  const [counselorAccess, setCounselorAccess] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);

  // Security passwords state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const fileInputRef = useRef(null);

  // Initialize and synchronize with user context whenever user data changes
  useEffect(() => {
    if (user) {
      setName(user.name || 'Arya Sharma');
      setEmail(user.email || 'patient@demo.com');
      setPhone(user.phone || '+1 (555) 234-5678');
      setAvatar(user.avatar || DEFAULT_AVATAR);
      if (user.preferences) {
        if (typeof user.preferences.dataSharing === 'boolean') setDataSharing(user.preferences.dataSharing);
        if (typeof user.preferences.counselorAccess === 'boolean') setCounselorAccess(user.preferences.counselorAccess);
        if (typeof user.preferences.emailNotifs === 'boolean') setEmailNotifs(user.preferences.emailNotifs);
        if (typeof user.preferences.pushNotifs === 'boolean') setPushNotifs(user.preferences.pushNotifs);
      }
    }
  }, [user]);

  // Handle Photo Upload & Optimization
  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg('');
    setSuccessMsg('');

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (JPG, PNG, or WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Optimize avatar to a high-quality 250x250 canvas representation
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
        setSuccessMsg('Profile photo updated and saved successfully!');
        setTimeout(() => setSuccessMsg(''), 4000);
      };
      img.onerror = () => {
        setErrorMsg('Failed to process the selected image. Please try another image.');
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Handle Personal Info Save
  const handleSavePersonalInfo = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();

    // Validations
    if (!cleanName) {
      setErrorMsg('Full name cannot be empty.');
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
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    }, 250);
  };

  // Handle Privacy / Notification Preferences Save
  const handleSavePreferences = (type) => {
    setErrorMsg('');
    const prefs = {
      dataSharing,
      counselorAccess,
      emailNotifs,
      pushNotifs
    };
    updateUserProfile({ preferences: prefs });
    setSuccessMsg(`${type} updated successfully!`);
    setTimeout(() => setSuccessMsg(''), 4000);
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

    setSuccessMsg('Password updated successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setTimeout(() => setSuccessMsg(''), 4000);
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
                setSuccessMsg('');
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
      <div className="card-glass" style={{ padding: '32px' }}>
        {/* Success Banner */}
        {successMsg && (
          <div className="badge badge-mint animate-fade-in" style={{ padding: '12px 18px', fontSize: '0.9rem', marginBottom: '20px', width: '100%', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={18} /> {successMsg}
          </div>
        )}

        {/* Error Banner */}
        {errorMsg && (
          <div className="badge badge-coral animate-fade-in" style={{ padding: '12px 18px', fontSize: '0.9rem', marginBottom: '20px', width: '100%', display: 'flex', alignItems: 'center', gap: '8px', color: '#B91C1C' }}>
            <AlertCircle size={18} /> {errorMsg}
          </div>
        )}

        {/* PERSONAL INFORMATION TAB */}
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
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
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
                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                  }}
                  title="Upload new photo"
                >
                  <Camera size={14} />
                </button>
              </div>

              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  style={{ display: 'none' }}
                  onChange={handlePhotoSelect}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn btn-outline btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Upload size={14} /> Change Photo
                </button>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
                  Supports JPG, PNG, or WebP. Saved automatically to your profile.
                </div>
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
                placeholder="e.g. patient@demo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
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
                style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: '130px', justifyContent: 'center' }}
              >
                <Save size={16} /> {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}

        {/* PRIVACY TAB */}
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
                    setDataSharing(e.target.checked);
                    handleSavePreferences('Privacy settings');
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
                    setCounselorAccess(e.target.checked);
                    handleSavePreferences('Privacy settings');
                  }}
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* NOTIFICATIONS TAB */}
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
                    setEmailNotifs(e.target.checked);
                    handleSavePreferences('Notification preferences');
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
                    setPushNotifs(e.target.checked);
                    handleSavePreferences('Notification preferences');
                  }}
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* SECURITY TAB */}
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
