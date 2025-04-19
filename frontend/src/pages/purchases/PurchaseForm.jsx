import React, { useEffect, useState } from 'react';
import { Paper, Typography, TextField, Button } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { createPurchase, fetchPurchaseById, updatePurchase } from '../../api';

export default function PurchaseForm() {
  const { id } = useParams();
  const isNew = !id;
  const [form, setForm] = useState({ supplier_id: '', total_cost: '', date: '' });
  const nav = useNavigate();

  useEffect(() => {
    if (!isNew) {
      fetchPurchaseById(id).then(res => setForm(res.data)).catch(console.error);
    }
  }, [id]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = e => {
    e.preventDefault();
    const fn = isNew ? createPurchase : updatePurchase;
    fn(id, form).then(() => nav('/purchases')).catch(err => alert('保存失败: '+err.message));
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6">{isNew ? '新建采购' : `编辑采购 #${id}`}</Typography>
      <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
        <TextField name="supplier_id" label="供应商 ID" value={form.supplier_id} onChange={handleChange} fullWidth required sx={{ mb:2 }} />
        <TextField name="total_cost" label="总成本" type="number" value={form.total_cost} onChange={handleChange} fullWidth required sx={{ mb:2 }} />
        <TextField name="date" label="日期" type="date" InputLabelProps={{ shrink: true }} value={form.date} onChange={handleChange} fullWidth sx={{ mb:2 }} />
        <Button variant="contained" type="submit">保存</Button>
      </form>
    </Paper>)
}