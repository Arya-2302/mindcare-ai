import React, { createContext, useContext, useState, useCallback } from 'react';
import { api } from '../services/api';

export const DEFAULT_PROFILES = {
  patient: {
    id: 'usr-patient',
    name: 'Arya Sharma',
    email: 'patient@demo.com',
    phone: '+1 (555) 234-5678',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
    role: 'patient',
    preferences: {
      dataSharing: true,
      counselorAccess: true,
      emailNotifs: true,
      pushNotifs: true
    }
  },
  counselor: {
    id: 'usr-counselor',
    name: 'Dr. Elena Vance',
    email: 'counselor@demo.com',
    phone: '+1 (555) 890-1234',
    licenseId: 'PSY-89412-CA',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=256&q=80',
    role: 'counselor',
    specialization: 'Cognitive Behavioral Therapy (CBT), Anxiety & Stress Management',
    preferences: {
      dataSharing: true,
      counselorAccess: true,
      emailNotifs: true,
      pushNotifs: true
    }
  },
  admin: {
    id: 'usr-admin',
    name: 'Marcus Lee (Admin)',
    email: 'admin@demo.com',
    phone: '+1 (555) 456-7890',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    role: 'admin',
    title: 'Chief Telehealth Administrator',
    preferences: {
      dataSharing: true,
      counselorAccess: true,
      emailNotifs: true,
      pushNotifs: true
    }
  }
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Load a specific role's profile from isolated localStorage
  const loadRoleProfile = useCallback((roleName) => {
    const roleKey = roleName === 'counsellor' ? 'counselor' : (roleName || 'patient');
    const defaultData = DEFAULT_PROFILES[roleKey] || DEFAULT_PROFILES.patient;
    try {
      const saved = localStorage.getItem(`mindcare_${roleKey}_profile`);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...defaultData, ...parsed, role: roleKey };
      }
    } catch (err) {
      console.warn(`Failed reading profile for ${roleKey}:`, err);
    }
    return { ...defaultData };
  }, []);

  // Determine initial role from localStorage
  const [activeRole, setActiveRole] = useState(() => {
    try {
      const saved = localStorage.getItem('mindcare_active_role');
      if (saved && ['patient', 'counselor', 'admin'].includes(saved)) return saved;
    } catch (e) { /* ignore */ }
    return 'patient';
  });

  const [user, setUser] = useState(() => loadRoleProfile(activeRole));
  const [token, setToken] = useState(() => localStorage.getItem('mindcare_token'));

  // Switch to another role — loads that role's isolated profile
  const switchRole = useCallback((newRole) => {
    const roleKey = newRole === 'counsellor' ? 'counselor' : (newRole || 'patient');
    setActiveRole(roleKey);
    localStorage.setItem('mindcare_active_role', roleKey);
    const profile = loadRoleProfile(roleKey);
    setUser(profile);
    return profile;
  }, [loadRoleProfile]);

  // Update ONLY the specified role's profile — never touches other roles
  const updateUserProfile = useCallback((updatedData, targetRole) => {
    const roleKey = targetRole
      ? (targetRole === 'counsellor' ? 'counselor' : targetRole)
      : activeRole || 'patient';

    try {
      const currentData = loadRoleProfile(roleKey);
      const merged = { ...currentData, ...updatedData, role: roleKey };
      localStorage.setItem(`mindcare_${roleKey}_profile`, JSON.stringify(merged));

      // Only update live user state if this is the active role
      if (roleKey === activeRole) {
        setUser(merged);
      }
      return merged;
    } catch (err) {
      console.warn(`Failed saving profile for ${roleKey}:`, err);
      return null;
    }
  }, [activeRole, loadRoleProfile]);

  const loginUser = async (email, password, role = 'patient') => {
    const roleKey = role === 'counsellor' ? 'counselor' : (role || 'patient');
    const res = await api.login(email, password, roleKey);
    switchRole(roleKey);

    if (res && res.access_token) {
      setToken(res.access_token);
      localStorage.setItem('mindcare_token', res.access_token);
    }
    return loadRoleProfile(roleKey);
  };

  const registerUser = async (name, email, password, role = 'patient') => {
    const roleKey = role === 'counsellor' ? 'counselor' : (role || 'patient');
    const res = await api.register(name, email, password, roleKey);
    if (name || email) {
      updateUserProfile({ name: name || undefined, email: email || undefined }, roleKey);
    }
    return res;
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('mindcare_token');
  };

  return (
    <AuthContext.Provider value={{
      user,
      activeRole,
      token,
      switchRole,
      updateUserProfile,
      loadRoleProfile,
      loginUser,
      registerUser,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
