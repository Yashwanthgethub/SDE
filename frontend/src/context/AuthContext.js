import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as loginApi, register as registerApi } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      // Optionally decode token for user info
      // For now, just set user as logged in
      setUser({});
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await loginApi(email, password);
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('token', data.token);
  };

  const register = async (name, email, password) => {
    const data = await registerApi(name, email, password);
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('token', data.token);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading, setUser, setToken }}>
      {children}
    </AuthContext.Provider>
  );
}; 