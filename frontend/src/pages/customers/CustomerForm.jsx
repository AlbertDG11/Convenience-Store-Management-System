// ────────────────────────────────────────────────────────────
// src/pages/customers/CustomerForm.jsx
// ────────────────────────────────────────────────────────────

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Paper, Typography, TextField, Button } from '@mui/material';
import {
  fetchCustomerById,
  createCustomer,
  updateCustomer,
} from '../../api';

export default function CustomerForm() {
  const { id } = useParams();
  const isNew  = !id;
  const [form, setForm] = useState({ name:'', phone_number:'', email:'' });
  const navigate = useNavigate();

  useEffect(() => {
    if (!isNew) {
      fetchCustomerById(id).then(res => setForm(res.data));
    }
  }, [id, isNew]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const action = isNew ? createCustomer(form) : updateCustomer(id, form);
    action
      .then(() => navigate('/customers'))
      .catch(err => alert(err.message));
  };

  return (
    <Paper sx={{p:3,maxWidth:500}}>
      <Typography variant="h6" gutterBottom>
        {isNew ? 'Create Customer' : `Edit Customer #${id}`}
      </Typography>

      <form onSubmit={handleSubmit} noValidate>
        <TextField
          label="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          fullWidth required sx={{mb:2}}
        />
        <TextField
          label="Phone Number"
          name="phone_number"
          value={form.phone_number}
          onChange={handleChange}
          fullWidth required sx={{mb:2}}
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          fullWidth required sx={{mb:2}}
        />
        <Button variant="contained" type="submit">Save</Button>
      </form>
    </Paper>
  );
}
