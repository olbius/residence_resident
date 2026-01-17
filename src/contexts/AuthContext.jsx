import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('moquiSessionToken');
    const userInfo = localStorage.getItem('userInfo');
    if (token && userInfo) {
      setUser(JSON.parse(userInfo));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axios.post(
        '/rest/s1/residence/login',
        { username, password },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      const { moquiSessionToken, user: userInfo } = response.data;
      
      localStorage.setItem('moquiSessionToken', moquiSessionToken);
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      
      setUser(userInfo);
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.errors || 'Login failed. Please check your credentials.' 
      };
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('moquiSessionToken');
      if (token) {
        await axios.post(
          '/rest/s1/residence/logout',
          {},
          {
            headers: { 
              'Content-Type': 'application/json',
              'moquiSessionToken': token 
            },
            withCredentials: true,
          }
        );
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('moquiSessionToken');
      localStorage.removeItem('userInfo');
      setUser(null);
    }
  };

  const value = {
    user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
