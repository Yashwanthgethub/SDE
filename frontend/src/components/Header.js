import React from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton, Avatar, Menu, MenuItem } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();
  const [profileAnchorEl, setProfileAnchorEl] = React.useState(null);
  const handleProfileMenuOpen = (event) => setProfileAnchorEl(event.currentTarget);
  const handleProfileMenuClose = () => setProfileAnchorEl(null);
  const handleLogout = () => {
    logout();
    setProfileAnchorEl(null);
    navigate('/login');
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Knowledge Base Platform
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton color="inherit">
            <NotificationsIcon />
          </IconButton>
          <IconButton color="inherit" onClick={handleProfileMenuOpen}>
            <Avatar sx={{ bgcolor: '#1976d2', color: '#fff' }}>{user?.name ? user.name[0] : 'U'}</Avatar>
          </IconButton>
          <Menu anchorEl={profileAnchorEl} open={Boolean(profileAnchorEl)} onClose={handleProfileMenuClose}>
            <MenuItem disabled>{user?.name || 'User'}</MenuItem>
            <MenuItem disabled>{user?.email || 'user@email.com'}</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 