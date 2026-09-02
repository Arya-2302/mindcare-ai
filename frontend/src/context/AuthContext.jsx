import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const DEFAULT_PROFILE = {
  id: 'usr-default',
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
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const getInitialUser = () => {
    try {
      const savedProfile = localStorage.getItem('mindcare_profile');
      const savedUser = localStorage.getItem('mindcare_user');
      
      const profileData = savedProfile ? JSON.parse(savedProfile) : null;
      const userData = savedUser ? JSON.parse(savedUser) : null;
      
      if (profileData || userData) {
        return {
          id: userData?.id || profileData?.id || DEFAULT_PROFILE.id,
          name: profileData?.name || userData?.name || DEFAULT_PROFILE.name,
          email: profileData?.email || userData?.email || DEFAULT_PROFILE.email,
          phone: profileData?.phone || userData?.phone || DEFAULT_PROFILE.phone,
          avatar: profileData?.avatar || userData?.avatar || DEFAULT_PROFILE.avatar,
          role: userData?.role || DEFAULT_PROFILE.role,
          preferences: profileData?.preferences || userData?.preferences || DEFAULT_PROFILE.preferences
        };
      }
      return DEFAULT_PROFILE;
    } catch (e) {
      console.warn('Error reading stored user profile:', e);
      return DEFAULT_PROFILE;
    }
  };

  const [user, setUser] = useState(getInitialUser);
  const [token, setToken] = useState(() => localStorage.getItem('mindcare_token'));
  const [activeRole, setActiveRole] = useState(user ? user.role : 'patient');

  useEffect(() => {
    if (user) {
      try {
        localStorage.setItem('mindcare_user', JSON.stringify(user));
        localStorage.setItem('mindcare_profile', JSON.stringify({
          name: user.name,
          email: user.email,
          phone: user.phone,
          avatar: user.avatar,
          preferences: user.preferences
        }));
      } catch (e) {
        console.warn('Failed to sync user to localStorage:', e);
      }
      setActiveRole(user.role);
    }

    if (token) {
      localStorage.setItem('mindcare_token', token);
    } else {
      localStorage.removeItem('mindcare_token');
    }
  }, [user, token]);

  const loginUser = async (email, password, role = 'patient') => {
    const res = await api.login(email, password, role);
    if (res && res.user) {
      const savedProfile = localStorage.getItem('mindcare_profile');
      const profileData = savedProfile ? JSON.parse(savedProfile) : null;

      const mergedUser = {
        ...res.user,
        name: profileData?.name || res.user.name || DEFAULT_PROFILE.name,
        email: res.user.email || profileData?.email || DEFAULT_PROFILE.email,
        phone: profileData?.phone || DEFAULT_PROFILE.phone,
        avatar: profileData?.avatar || DEFAULT_PROFILE.avatar,
        preferences: profileData?.preferences || DEFAULT_PROFILE.preferences
      };

      setUser(mergedUser);
      localStorage.setItem('mindcare_user', JSON.stringify(mergedUser));
      if (res.access_token) setToken(res.access_token);
      return mergedUser;
    }
    return null;
  };

  const registerUser = async (name, email, password, role = 'patient') => {
    const res = await api.register(name, email, password, role);
    return res;
  };

  const updateUserProfile = (updatedData) => {
    setUser(prevUser => {
      const newUser = {
        ...(prevUser || DEFAULT_PROFILE),
        ...updatedData
      };
      try {
        localStorage.setItem('mindcare_user', JSON.stringify(newUser));
        localStorage.setItem('mindcare_profile', JSON.stringify({
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          avatar: newUser.avatar,
          preferences: newUser.preferences
        }));
      } catch (err) {
        console.warn('Failed to save updated profile to localStorage:', err);
      }
      return newUser;
    });
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('mindcare_user');
    localStorage.removeItem('mindcare_token');
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      activeRole,
      loginUser,
      registerUser,
      updateUserProfile,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
