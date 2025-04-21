// src/components/Header.jsx
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { deepPurple } from '@mui/material/colors';

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const today = new Date().toLocaleDateString();

  return (
    <AppBar
      position="static"
      elevation={3}
      sx={{
        background: 'linear-gradient(to right, #3f51b5, #5c6bc0)',
        color: '#fff',
      }}
    >
      <Toolbar sx={{ position: 'relative' }}>
        {/* Centered title */}
        <Box sx={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
          <Typography variant="h4" component="div">
            Convenience Store Management System
          </Typography>
        </Box>

        {/* Right-side area: date, avatar, logout */}
        <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body1">{today}</Typography>
          <Avatar sx={{ bgcolor: deepPurple[500], width: 32, height: 32 }}>
            {localStorage.getItem('username')?.[0]?.toUpperCase() || 'U'}
          </Avatar>
          <Button color="inherit" onClick={handleLogout} sx={{ textTransform: 'none' }}>
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
