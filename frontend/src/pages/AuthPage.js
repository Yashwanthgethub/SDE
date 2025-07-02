import React, { useState, useEffect } from 'react';
import {
  Box, Paper, Tabs, Tab, Typography, TextField, Button, InputAdornment, Alert
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import GoogleIcon from '@mui/icons-material/Google';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getMe } from '../services/authService';

const AuthPage = () => {
  const [tab, setTab] = useState(0);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirm, setRegisterConfirm] = useState('');
  const [error, setError] = useState('');
  const { login, register, setUser, setToken } = useAuth();
  const navigate = useNavigate();

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
    }
  }, [navigate, setUser, setToken]);

  const handleTabChange = (e, newValue) => {
    setTab(newValue);
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(loginEmail, loginPassword);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (registerPassword !== registerConfirm) {
      setError('Passwords do not match');
      return;
    }
    try {
      await register(registerName, registerEmail, registerPassword);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <Box minHeight="100vh" display="flex" flexDirection="column" alignItems="center" justifyContent="center" sx={{ background: 'linear-gradient(135deg, #e3eefd 0%, #f5f7fa 100%)' }}>
      <Box textAlign="center" mb={4}>
        <Box mb={1}>
          <PersonIcon sx={{ fontSize: 48, color: '#1976d2' }} />
        </Box>
        <Typography variant="h4" fontWeight={700} mb={1}>KnowIt Nexus Hub</Typography>
        <Typography variant="subtitle1" color="text.secondary">Your collaborative knowledge platform</Typography>
      </Box>
      <Paper elevation={3} sx={{ p: 4, minWidth: 350, maxWidth: 400 }}>
        <Typography variant="h5" mb={2} fontWeight={600}>Welcome</Typography>
        <Typography mb={2} color="text.secondary">
          Sign in to your account or create a new one
        </Typography>
        <Tabs value={tab} onChange={handleTabChange} variant="fullWidth" sx={{ mb: 2 }}>
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {tab === 0 && (
          <form onSubmit={handleLogin}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              value={loginEmail}
              onChange={e => setLoginEmail(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              value={loginPassword}
              onChange={e => setLoginPassword(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
              Sign In
            </Button>
            <Typography mt={2} align="center">
              <Button variant="text" size="small" color="primary" onClick={() => navigate('/forgot-password')}>
                Forgot your password?
              </Button>
            </Typography>
          </form>
        )}
        {tab === 1 && (
          <form onSubmit={handleRegister}>
            <TextField
              label="Full Name"
              fullWidth
              margin="normal"
              value={registerName}
              onChange={e => setRegisterName(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              value={registerEmail}
              onChange={e => setRegisterEmail(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              value={registerPassword}
              onChange={e => setRegisterPassword(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Confirm Password"
              type="password"
              fullWidth
              margin="normal"
              value={registerConfirm}
              onChange={e => setRegisterConfirm(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
              Create Account
            </Button>
          </form>
        )}
        <Button
          variant="outlined"
          fullWidth
          startIcon={<GoogleIcon sx={{ color: '#EA4335' }} />}
          onClick={() => window.location.href = 'http://localhost:5000/api/auth/google'}
          sx={{
            mt: 2,
            backgroundColor: '#fff',
            color: 'rgba(0,0,0,0.54)',
            borderColor: '#ddd',
            textTransform: 'none',
            fontWeight: 500,
            fontSize: 16,
            boxShadow: '0 1px 2px rgba(60,64,67,.08)',
            '&:hover': {
              backgroundColor: '#f7f7f7',
              borderColor: '#ccc',
            },
          }}
        >
          Sign in with Google
        </Button>
      </Paper>
    </Box>
  );
};

export default AuthPage; 