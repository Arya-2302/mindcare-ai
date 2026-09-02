import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  User, Lock, Bell, Shield, CheckCircle2, Save, Upload,
  AlertCircle, Camera, HeartHandshake, ShieldCheck
} from 'lucide-react';

export const ProfileSettingsPage = () => {
  const { user, activeRole, updateUserProfile } = useAuth();
  const currentRole = activeRole || user?.role || 'patient';

  const [activeSubTab, setActiveSubTab] = useState('personal');
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [licenseId, setLicenseId] = useState(user?.licenseId || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [isSaving, setIsSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [dataSharing, setDataSharing] = useState(user?.preferences?.dataSharing ?? true);
  const [counselorAccess, setCounselorAccess] = useState(user?.preferences?.counselorAccess ?? true);
  const [emailNotifs, setEmailNotifs] = useState(user?.preferences?.emailNotifs ?? true);
  const [pushNotifs, setPushNotifs] = useState(user?.preferences?.pushNotifs ?? true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Re-sync fields when user/role changes
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setLicenseId(user.licenseId || '');
      setAvatar(user.avatar || '');
      if (user.preferences) {
        if (typeof user.preferences.dataSharing === 'boolean') setDataSharing(user.preferences.dataSharing);
        if (typeof user.preferences.counselorAccess === 'boolean') setCounselorAccess(user.preferences.counselorAccess);
        if (typeof user.preferences.emailNotifs === 'boolean') setEmailNotifs(user.preferences.emailNotifs);
        if (typeof user.preferences.pushNotifs === 'boolean') setPushNotifs(user.preferences.pushNotifs);
      }
    }
  }, [user, currentRole]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4500);
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrorMsg('');
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (JPG, PNG, or WEBP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX = 250;
        let w = img.width, h = img.height;
        if (w > h) { if (w > MAX) { h = Math.round(h * MAX / w); w = MAX; } }
        else { if (h > MAX) { w = Math.round(w * MAX / h); h = MAX; } }
        canvas.width = w;
        canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
        setAvatar(dataUrl);
        updateUserProfile({ avatar: dataUrl }, currentRole);
        showToast('Changes saved successfully');
      };
      img.onerror = () => setErrorMsg('Failed to process image. Please try another.');
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSavePersonalInfo = (e) => {
    e.preventDefault();
    setErrorMsg('');
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();
    if (!cleanName) { setErrorMsg('Full Name cannot be empty.'); return; }
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setErrorMsg('Please enter a valid email address.'); return;
    }
    if (!cleanPhone) { setErrorMsg('Phone number is required.'); return; }

    setIsSaving(true);
    setTimeout(() => {
      updateUserProfile({
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        ...(currentRole === 'counselor' ? { licenseId: licenseId.trim() } : {}),
        avatar
      }, currentRole);
      setIsSaving(false);
      showToast('Changes saved successfully');
    }, 150);
  };

  const handleSavePreferences = (updatedPrefs) => {
    const prefs = { dataSharing, counselorAccess, emailNotifs, pushNotifs, ...updatedPrefs };
    updateUserProfile({ preferences: prefs }, currentRole);
    showToast('Changes saved successfully');
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (!currentPassword) { setErrorMsg('Please enter your current password.'); return; }
    if (!newPassword || newPassword.length < 6) { setErrorMsg('New password must be at least 6 characters.'); return; }
    setCurrentPassword('');
    setNewPassword('');
    showToast('Changes saved successfully');
  };

  const getRoleBadge = () => {
    if (currentRole === 'counselor') return <span className="badge badge-blue" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><HeartHandshake size={13} /> Counselor Portal</span>;
    if (currentRole === 'admin') return <span className="badge badge-mint" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><ShieldCheck size={13} /> Admin Portal</span>;
    return <span className="badge badge-lavender" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><User size={13} /> Patient Portal</span>;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '900px' }}>
      <div>
        <div style={{ marginBottom: '8px' }}>{getRoleBadge()}</div>
        <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)' }}>
          {currentRole.charAt(0).toUpperCase() + currentRole.slice(1)} Account & Settings
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '4px' }}>
          Manage profile details, avatar, privacy preferences and notifications for this portal only
        </p>
      </div>

      {/* Sub-tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px', flexWrap: 'wrap' }}>
        {[
          { id: 'personal', label: 'Personal Info', Icon: User },
          { id: 'privacy', label: 'Privacy & Consent', Icon: Shield },
          { id: 'notifications', label: 'Notifications', Icon: Bell },
          { id: 'security', label: 'Security', Icon: Lock }
        ].map(({ id, label, Icon }) => {
          const isActive = activeSubTab === id;
          return (
            <button
              key={id}
              onClick={() => { setActiveSubTab(id); setErrorMsg(''); setToastMsg(''); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px',
                borderRadius: 'var(--radius-sm)',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? 'var(--primary-lavender)' : 'var(--text-secondary)',
                backgroundColor: isActive ? 'var(--light-lavender)' : 'transparent',
                transition: 'var(--transition-fast)'
              }}
            >
              <Icon size={16} /> {label}
            </button>
          );
        })}
      </div>

      <div className="card-glass" style={{ padding: '32px' }}>
        {/* Toast */}
        {toastMsg && (
          <div className="animate-fade-in" style={{
            padding: '14px 20px', borderRadius: 'var(--radius-sm)',
            backgroundColor: '#EBF7F4', border: '1.5px solid #8FD8C8',
            color: '#117863', fontWeight: 700, fontSize: '0.95rem',
            marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px',
            boxShadow: '0 4px 16px rgba(143,216,200,0.25)'
          }}>
            <CheckCircle2 size={20} color="#117863" />
            <span>✓ {toastMsg}</span>
          </div>
        )}

        {/* Error */}
        {errorMsg && (
          <div className="animate-fade-in" style={{
            padding: '14px 20px', borderRadius: 'var(--radius-sm)',
            backgroundColor: '#FEE2E2', border: '1.5px solid #F87171',
            color: '#B91C1C', fontWeight: 600, fontSize: '0.9rem',
            marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px'
          }}>
            <AlertCircle size={18} color="#B91C1C" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Hidden file input */}
        <input
          id="profile-photo-upload-input"
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          style={{ display: 'none' }}
          onChange={handlePhotoSelect}
        />

        {/* PERSONAL INFO */}
        {activeSubTab === 'personal' && (
          <form onSubmit={handleSavePersonalInfo}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem' }}>Personal Information</h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', background: 'var(--bg-lavender)', padding: '4px 10px', borderRadius: '6px' }}>
                Portal: <strong style={{ textTransform: 'capitalize' }}>{currentRole}</strong>
              </span>
            </div>

            {/* Avatar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
              <div style={{ position: 'relative' }}>
                <img
                  src={avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80'}
                  alt="Profile Avatar"
                  style={{ width: '84px', height: '84px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #fff', boxShadow: '0 4px 14px rgba(139,124,246,0.2)' }}
                />
                <label
                  htmlFor="profile-photo-upload-input"
                  style={{
                    position: 'absolute', bottom: 0, right: 0,
                    width: '28px', height: '28px', borderRadius: '50%',
                    backgroundColor: 'var(--primary-lavender)', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
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
                  JPG, JPEG, PNG or WEBP. Saved only for the <strong style={{ textTransform: 'capitalize' }}>{currentRole}</strong> portal.
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="pf-name">Full Name</label>
              <input id="pf-name" type="text" className="form-input" value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" required />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="pf-email">Email Address</label>
              <input id="pf-email" type="email" className="form-input" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="pf-phone">Phone Number</label>
              <input id="pf-phone" type="tel" className="form-input" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 (555) 234-5678" required />
            </div>

            {currentRole === 'counselor' && (
              <div className="form-group">
                <label className="form-label" htmlFor="pf-license">Psychology License ID</label>
                <input id="pf-license" type="text" className="form-input" value={licenseId} onChange={e => setLicenseId(e.target.value)} placeholder="e.g. PSY-89412-CA" />
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button type="submit" disabled={isSaving} className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: '140px', justifyContent: 'center' }}>
                <Save size={16} /> {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}

        {/* PRIVACY */}
        {activeSubTab === 'privacy' && (
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>Privacy & Data Control</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { label: 'Allow Anonymous AI Model Improvement', desc: 'Share anonymised emotion signals to fine-tune detection.', val: dataSharing, set: (v) => { setDataSharing(v); handleSavePreferences({ dataSharing: v }); } },
                { label: 'Grant Counselor Access', desc: 'Allow your assigned counselor to view your wellness score trend.', val: counselorAccess, set: (v) => { setCounselorAccess(v); handleSavePreferences({ counselorAccess: v }); } }
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'var(--bg-lavender)', borderRadius: '8px' }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{item.label}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.desc}</div>
                  </div>
                  <input type="checkbox" checked={item.val} onChange={e => item.set(e.target.checked)} style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* NOTIFICATIONS */}
        {activeSubTab === 'notifications' && (
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>Notification Preferences</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { label: 'Email Reminders', desc: 'Daily mood check-in prompts & appointment updates.', val: emailNotifs, set: (v) => { setEmailNotifs(v); handleSavePreferences({ emailNotifs: v }); } },
                { label: 'Browser Push Notifications', desc: 'Real-time alerts for session bookings and AI reflections.', val: pushNotifs, set: (v) => { setPushNotifs(v); handleSavePreferences({ pushNotifs: v }); } }
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'var(--bg-lavender)', borderRadius: '8px' }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{item.label}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.desc}</div>
                  </div>
                  <input type="checkbox" checked={item.val} onChange={e => item.set(e.target.checked)} style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECURITY */}
        {activeSubTab === 'security' && (
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>Security Settings</h3>
            <form onSubmit={handleUpdatePassword}>
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input type="password" className="form-input" placeholder="••••••••" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <input type="password" className="form-input" placeholder="••••••••" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
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
