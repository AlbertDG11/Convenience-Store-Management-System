// src/components/OrderForm.jsx
import React, { useEffect, useState } from 'react';
import { TextField, Button, Paper, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { createOrder, fetchOrderById, updateOrder } from '../../api';

export default function OrderForm() {
  const { orderId } = useParams();
  const isNew = !orderId;
  const [form, setForm] = useState({ customer_id: '', total: 0, date: '' });
  const navigate = useNavigate();

  useEffect(() => {
    if (!isNew) {
      fetchOrderById(orderId)
        .then((res) => setForm(res.data))
        .catch((err) => console.error(err));
    }
  }, [orderId, isNew]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const action = isNew ? createOrder : updateOrder;
    action(orderId, form)
      .then(() => navigate('/orders'))
      .catch((err) => alert('Save failed: ' + err.message));
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6">
        {isNew ? 'Create Order' : `Edit Order #${orderId}`}
      </Typography>
      <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
        <TextField
          label="Customer ID"
          name="customer_id"
          value={form.customer_id}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Total Amount"
          type="number"
          name="total"
          value={form.total}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Date"
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          fullWidth
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 2 }}
        />
        <Button type="submit" variant="contained" color="primary">
          Save
        </Button>
      </form>
    </Paper>
  );
}
