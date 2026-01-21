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
      // Use Basic Auth with Moqui's login endpoint
      const response = await axios.get(
        '/rest/s1/moqui/login',
        {
          headers: {
            'Authorization': `Basic ${btoa(`${username}:${password}`)}`,
          },
          withCredentials: true,
        }
      );

      // Extract token from response headers
      const moquiSessionToken = response.headers['moquisessiontoken'] || response.headers['moquiSessionToken'];
      
      // Store session token
      localStorage.setItem('moquiSessionToken', moquiSessionToken);
      
      // Fetch user's family info to verify resident status
      try {
        const familyResponse = await axios.get('/rest/s1/residence/my/family', {
          headers: {
            'Content-Type': 'application/json',
            'moquiSessionToken': moquiSessionToken
          },
          withCredentials: true,
        });
        
        const userInfo = {
          username,
          family: familyResponse.data
        };
        
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        setUser(userInfo);
        
        return { success: true };
      } catch (familyError) {
        // If can't access family info, user is not a resident
        console.error('Family access error:', familyError);
        console.error('Response data:', familyError.response?.data);
        
        localStorage.removeItem('moquiSessionToken');
        
        // Provide more specific error message
        let errorMsg = 'Access denied. ';
        if (familyError.response?.data?.errors) {
          errorMsg += familyError.response.data.errors;
        } else if (familyError.response?.status === 403) {
          errorMsg += 'You do not have permission to access this portal. Please contact the administrator to be added as a resident.';
        } else if (familyError.response?.status === 404) {
          errorMsg += 'Family information not found. Please contact the administrator.';
        } else {
          errorMsg += 'This portal is for residents only.';
        }
        
        return {
          success: false,
          error: errorMsg
        };
      }
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
        // Use Moqui's standard logout endpoint
        await axios.post(
          '/rest/s1/moqui/logout',
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
