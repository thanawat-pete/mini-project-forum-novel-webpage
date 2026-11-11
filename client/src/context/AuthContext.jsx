import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('storycraft_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('storycraft_token'));
  const [loading, setLoading] = useState(true);

  // Validate session on load
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const res = await authService.getMe();
          setUser(res.user);
          localStorage.setItem('storycraft_user', JSON.stringify(res.user));
        } catch (error) {
          console.warn('Session expired or invalid token');
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  const login = async (credential, password) => {
    const res = await authService.login({ credential, password });
    setUser(res.user);
    setToken(res.token);
    localStorage.setItem('storycraft_token', res.token);
    localStorage.setItem('storycraft_user', JSON.stringify(res.user));
    return res.user;
  };

  const register = async (userData) => {
    const res = await authService.register(userData);
    setUser(res.user);
    setToken(res.token);
    localStorage.setItem('storycraft_token', res.token);
    localStorage.setItem('storycraft_user', JSON.stringify(res.user));
    return res.user;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('storycraft_token');
    localStorage.removeItem('storycraft_user');
  };

  const updateProfileState = (updatedUser) => {
    setUser((prev) => {
      const merged = { ...prev, ...updatedUser };
      localStorage.setItem('storycraft_user', JSON.stringify(merged));
      return merged;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfileState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
