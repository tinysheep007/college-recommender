import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const storedAdmin = JSON.parse(localStorage.getItem('admin'));
    if (storedUser) {
      setUser(storedUser);
      setIsAuthenticated(true);
    }
    if (storedAdmin) {
      setAdmin(storedAdmin);
      setIsAuthenticated(true);
    }
  }, []);

  const userLogin = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:8000/user/login', { username, password });
      if (response.data.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return { status: true, error: "none" }; // Login successful
      } else {
        console.error('User login failed:', response.data.error);
        return { status: false, error: response.data.error }; // Login failed
      }
    } catch (error) {
      console.error('Error:', error);
      return { status: false, error }; // Login failed due to error
    }
  };

  const adminLogin = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:8000/admin/login', { username, password });
      if (response.data.success) {
        setAdmin(response.data.admin);
        setIsAuthenticated(true);
        localStorage.setItem('admin', JSON.stringify(response.data.admin));
        return { status: true, error: "none" }; // Login successful
      } else {
        console.error('Admin login failed:', response.data.error);
        return { status: false, error: response.data.error }; // Login failed
      }
    } catch (error) {
      console.error('Error:', error);
      return { status: false, error: error }; // Login failed due to error
    }
  };

  const userLogout = async () => {
    try {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const adminLogout = async () => {
    try {
      setAdmin(null);
      setIsAuthenticated(false);
      localStorage.removeItem('admin');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, admin, isAuthenticated, userLogin, adminLogin, userLogout, adminLogout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
