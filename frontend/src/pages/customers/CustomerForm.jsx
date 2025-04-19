// src/components/CustomerForm.jsx
import React, { useEffect, useState } from 'react';
import { Paper, Typography, TextField, Button } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { createCustomer, fetchCustomerById, updateCustomer } from '../../api';

export default function CustomerForm() {
  const { id } = useParams();
  const isNew = !id;
  const [form, setForm] = useState({ name: '', phone_number: '', email: '' });
  const navigate = useNavigate();

  useEffect(() => {
    if (!isNew) {
      fetchCustomerById(id).then((res) => setForm(res.data));
    }
  }, [id, isNew]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const action = isNew ? createCustomer : updateCustomer;
    action(id, form)
      .then(() => navigate('/customers'))
      .catch((err) => alert('Save failed: ' + err.message));
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6">
        {isNew ? 'Create Customer' : `Edit Customer #${id}`}
      </Typography>
      <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
        <TextField
          name="name"
          label="Name"
          value={form.name}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          name="phone_number"
          label="Phone Number"
          value={form.phone_number}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          name="email"
          label="Email"
          type="email"
          value={form.email}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <Button variant="contained" type="submit">
          Save
        </Button>
      </form>
    </Paper>
  );
}
