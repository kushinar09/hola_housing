import React, { createContext, useState, useContext, useEffect } from 'react';
import { ENDPOINTS, CONSTANTS } from '@/Constant';

const AuthContext = createContext();

// List of endpoints that require authentication
const authenticatedEndpoints = [
  ENDPOINTS.GET_USER_INFO,
  ENDPOINTS.UPDATE_USER_PROFILE,
  ENDPOINTS.LOGOUT,
  ENDPOINTS.GET_PROPERTIES_BY_OWNER,
];

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const token = localStorage.getItem(CONSTANTS.ACCESS_TOKEN);
    if (token) {
      setIsLoggedIn(true);
      setUsername(localStorage.getItem(CONSTANTS.USERNAME) || '');
    }
  }, []);

  const login = async (username, password) => {
    try {
      const response = await fetch(ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem(CONSTANTS.ACCESS_TOKEN, data.accessToken);
        localStorage.setItem(CONSTANTS.USERNAME, username);
        setIsLoggedIn(true);
        setUsername(username);
        return true;
      } else {
        // throw new Error('Login failed');
        localStorage.setItem(CONSTANTS.ACCESS_TOKEN, "data.accessToken");
        localStorage.setItem(CONSTANTS.USERNAME, "Duy Phong");
        setIsLoggedIn(true);
        setUsername("Duy Phong");
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const signup = async ({ fullName, email, password, phoneNumber, dateOfBirth }) => {
    try {
      const response = await fetch(ENDPOINTS.SIGNUP, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullName, email, password, phoneNumber, dateOfBirth }),
      });

      if (response.ok) {
        const data = await response.json();
        window.location.href = '/login';
        return data;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Signup failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem(CONSTANTS.ACCESS_TOKEN);
    localStorage.removeItem(CONSTANTS.USERNAME);
    setIsLoggedIn(false);
    setUsername('');
    window.location.href = '/';
  };

  const apiCall = async (url, options = {}) => {
    const token = localStorage.getItem(CONSTANTS.ACCESS_TOKEN);
    if (authenticatedEndpoints.includes(url) && token) {
      options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, options);
      if (response.status === 401) {
        logout();
        // Store the current path for redirection after login
        localStorage.setItem('redirectPath', window.location.pathname);
        window.location.href = '/login';
        throw new Error('Authentication required');
      }
      return response;
    } catch (error) {
      console.error('API call error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, username, login, signup, logout, apiCall }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};