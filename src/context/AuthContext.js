import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

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
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        // Set authorization header for all requests
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + userData.token;
        console.log('User loaded from localStorage:', userData);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    console.log('Logging in user:', userData);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    // Set authorization header for all requests
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + userData.token;
  };

  const logout = () => {
    console.log('Logging out user');
    setUser(null);
    localStorage.removeItem('user');
    // Remove authorization header
    delete axios.defaults.headers.common['Authorization'];
  };

  const isStudent = () => user?.role === 'student';
  const isTeacher = () => user?.role === 'teacher';
  const isAdmin = () => user?.role === 'admin';

  // Check if user is authenticated
  const isAuthenticated = () => !!user;

  const value = {
    user,
    login,
    logout,
    isStudent,
    isTeacher,
    isAdmin,
    isAuthenticated,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};