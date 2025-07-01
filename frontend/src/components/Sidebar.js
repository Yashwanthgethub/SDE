import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, ListItemButton } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SearchIcon from '@mui/icons-material/Search';
import DescriptionIcon from '@mui/icons-material/Description';
import PeopleIcon from '@mui/icons-material/People';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/dashboard', icon: <DashboardIcon />, label: 'Dashboard' },
  { to: '/my-documents', icon: <DescriptionIcon />, label: 'My Documents' },
  { to: '/shared', icon: <PeopleIcon />, label: 'Shared with Me' },
  { to: '/trash', icon: <DeleteIcon />, label: 'Trash' },
];

const Sidebar = () => {
  const drawerWidth = 240;

  return (
    <Drawer 
      variant="permanent" 
      anchor="left" 
      sx={{ 
        width: drawerWidth, 
        flexShrink: 0, 
        '& .MuiDrawer-paper': { 
          width: drawerWidth, 
          boxSizing: 'border-box',
          mt: '64px',
        } 
      }}
    >
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.to} disablePadding>
            <ListItemButton
              component={NavLink}
              to={item.to}
              style={({ isActive }) => ({ 
                background: isActive ? '#f5f5f5' : 'inherit',
                color: isActive ? '#333' : '#666'
              })}
            >
              <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton 
            component={NavLink} 
            to="/settings" 
            style={({ isActive }) => ({ 
              background: isActive ? '#f5f5f5' : 'inherit',
              color: isActive ? '#333' : '#666'
            })}
          >
            <ListItemIcon sx={{ color: 'inherit' }}><SettingsIcon /></ListItemIcon>
            <ListItemText primary="Account Settings" />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar; 