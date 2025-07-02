import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMe } from '../services/authService';

const GoogleAuthHandler = () => {
  const navigate = useNavigate();
  const { setUser, setToken } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
      setToken(token);
      getMe().then(user => {
        setUser(user);
        navigate('/dashboard');
      }).catch(() => {
        navigate('/dashboard');
      });
    } else {
      navigate('/');
    }
  }, [navigate, setUser, setToken]);

  return null;
};

export default GoogleAuthHandler; 