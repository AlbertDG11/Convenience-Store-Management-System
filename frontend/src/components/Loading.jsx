// ────────────────────────────────────────────────────────────
// src/components/Loading.jsx
// ────────────────────────────────────────────────────────────
import React from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';

export default function Loading({ text = 'Loading…' }) {
  return (
    <Box sx={{ display:'flex', flexDirection:'column', alignItems:'center', mt:4 }}>
      <CircularProgress />
      <Typography sx={{ mt:2 }}>{text}</Typography>
    </Box>
  );
}