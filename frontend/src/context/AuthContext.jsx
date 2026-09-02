import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('mindcare_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('mindcare_token'));
  const [activeRole, setActiveRole] = useState(user ? user.role : 'patient');

  useEffect(() => {
    if (user) {
      localStorage.setItem('mindcare_user', JSON.stringify(user));
      setActiveRole(user.role);
    } else {
      localStorage.removeItem('mindcare_user');
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
      setUser(res.user);
      if (res.access_token) setToken(res.access_token);
      return res.user;
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
        ...(prevUser || {}),
        ...updatedData
      };
      localStorage.setItem('mindcare_user', JSON.stringify(newUser));
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
