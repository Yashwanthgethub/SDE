import React, { useState, useEffect } from 'react';
import { Box, Typography, Tabs, Tab, TextField, Button, Paper } from '@mui/material';
import { getMe, updateMe, changePassword } from '../services/authService';

const AccountSettingsPage = () => {
  const [tab, setTab] = useState(0);
  const [profile, setProfile] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '' });
  const [pwSuccess, setPwSuccess] = useState('');
  const [pwError, setPwError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const data = await getMe();
        setProfile({ name: data.name, email: data.email });
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleProfileChange = e => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleProfileSave = async () => {
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      await updateMe(profile);
      setSuccess('Profile updated');
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = e => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handlePasswordSave = async () => {
    setPwSuccess('');
    setPwError('');
    try {
      await changePassword(passwords.oldPassword, passwords.newPassword);
      setPwSuccess('Password changed successfully');
      setPasswords({ oldPassword: '', newPassword: '' });
    } catch (err) {
      setPwError(err?.response?.data?.message || 'Failed to change password');
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h4" fontWeight={700} mb={1}>Account Settings</Typography>
      <Typography color="text.secondary" mb={3}>Manage your account preferences and settings</Typography>
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} aria-label="settings tabs" variant="fullWidth">
          <Tab label="Profile" />
          <Tab label="Change Password" />
          <Tab label="Notifications" />
          <Tab label="Privacy" />
          <Tab label="Appearance" />
        </Tabs>
      </Paper>
      {tab === 0 && (
        <Box mt={3} maxWidth={400}>
          <TextField
            label="Name"
            name="name"
            value={profile.name}
            onChange={handleProfileChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            name="email"
            value={profile.email}
            onChange={handleProfileChange}
            fullWidth
            margin="normal"
          />
          {success && <Typography color="success.main" mt={1}>{success}</Typography>}
          {error && <Typography color="error.main" mt={1}>{error}</Typography>}
          <Box mt={2}>
            <Button variant="contained" onClick={handleProfileSave} disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        </Box>
      )}
      {tab === 1 && (
        <Box mt={3} maxWidth={400}>
          <TextField
            label="Old Password"
            name="oldPassword"
            type="password"
            value={passwords.oldPassword}
            onChange={handlePasswordChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="New Password"
            name="newPassword"
            type="password"
            value={passwords.newPassword}
            onChange={handlePasswordChange}
            fullWidth
            margin="normal"
          />
          {pwSuccess && <Typography color="success.main" mt={1}>{pwSuccess}</Typography>}
          {pwError && <Typography color="error.main" mt={1}>{pwError}</Typography>}
          <Box mt={2}>
            <Button variant="contained" onClick={handlePasswordSave}>
              Change Password
            </Button>
          </Box>
        </Box>
      )}
      {tab === 2 && <Typography>Notifications settings coming soon.</Typography>}
      {tab === 3 && <Typography>Privacy settings coming soon.</Typography>}
      {tab === 4 && <Typography>Appearance settings coming soon.</Typography>}
    </Box>
  );
};

export default AccountSettingsPage; 