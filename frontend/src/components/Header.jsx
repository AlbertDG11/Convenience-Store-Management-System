import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();

  // Logout: remove token and navigate to the login page
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        {/* Left-side title */}
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Convenience Store Management System
        </Typography>
        {/* Right-side logout button */}
        <Button color="inherit" onClick={handleLogout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}
