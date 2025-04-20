import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  Container
} from '@mui/material';
import { toast } from 'react-hot-toast';

export default function Login() {
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    console.log(account)
    try {
      const response = await fetch('http://localhost:8000/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ account, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();
      toast.success('Login successful');
      navigate('/employee');
    } catch (error) {
      toast.error(error.message || 'Login failed');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', justifyContent: 'center' }}>
      <Typography variant="h4" gutterBottom fontWeight="bold" textAlign="center">
        Convenience Store Management System
      </Typography>
      <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: 3 }}>
        <Stack spacing={3}>
          <Typography variant="h5" textAlign="center">Login</Typography>
          <TextField
            label="Account"
            variant="outlined"
            fullWidth
            value={account}
            onChange={(e) => setAccount(e.target.value)}
          />
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button variant="contained" fullWidth onClick={handleLogin}>
            Log In
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}