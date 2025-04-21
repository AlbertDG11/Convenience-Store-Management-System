// ────────────────────────────────────────────────────────────
// src/pages/orders/OrderForm.jsx
// ────────────────────────────────────────────────────────────
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Paper, TextField, Typography, Button } from '@mui/material';
import {
  createOrder,
  updateOrder,
  fetchOrderById,
} from '../../api';

export default function OrderForm() {
  const { id } = useParams();
  const isNew = !id;
  const [form, setForm] = useState({ customer_id:'', total_price:'', order_date:'' });
  const navigate = useNavigate();

  useEffect(() => {
    if (!isNew) {
      fetchOrderById(id).then(res => setForm(res.data));
    }
  }, [id, isNew]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    const action = isNew ? createOrder(form) : updateOrder(id, form);
    action.then(()=>navigate('/orders')).catch(err=>alert(err.message));
  };

  return (
    <Paper sx={{ p:3, maxWidth:500 }}>
      <Typography variant="h6" gutterBottom>
        {isNew ? 'Create Order' : `Edit Order #${id}`}
      </Typography>
      <form onSubmit={handleSubmit} noValidate>
        <TextField label="Customer ID" name="customer_id" value={form.customer_id} onChange={handleChange} fullWidth required sx={{ mb:2 }}/>
        <TextField label="Order Date"   name="order_date"  type="date" value={form.order_date?.slice(0,10)} onChange={handleChange} fullWidth required sx={{ mb:2 }} InputLabelProps={{ shrink:true }}/>
        <TextField label="Total Price"  name="total_price" value={form.total_price} onChange={handleChange} fullWidth required sx={{ mb:2 }}/>
        <Button variant="contained" type="submit">Save</Button>
      </form>
    </Paper>
  );
}
