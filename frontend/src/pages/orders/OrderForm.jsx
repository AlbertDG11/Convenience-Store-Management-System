import React, { useEffect, useState } from 'react';
import { TextField, Button, Paper, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { createOrder, fetchOrderById, updateOrder } from '../../api';

export default function OrderForm() {
  const { orderId } = useParams();
  const isNew = !orderId;
  const [form, setForm] = useState({ customer_id: '', total: 0, date: '' });
  const nav = useNavigate();

  useEffect(() => {
    if (!isNew) {
      fetchOrderById(orderId).then(res => setForm(res.data)).catch(console.error);
    }
  }, [orderId]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = e => {
    e.preventDefault();
    const action = isNew ? createOrder : updateOrder;
    action(orderId, form)
      .then(() => nav('/orders'))
      .catch(err => alert('保存失败: ' + err.message));
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6">{isNew ? '新建订单' : `编辑订单 #${orderId}`}</Typography>
      <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
        <TextField
          label="客户 ID"
          name="customer_id"
          value={form.customer_id}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="总价"
          type="number"
          name="total"
          value={form.total}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="日期"
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          fullWidth
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 2 }}
        />
        <Button type="submit" variant="contained" color="primary">
          保存
        </Button>
      </form>
    </Paper>
  );
}
