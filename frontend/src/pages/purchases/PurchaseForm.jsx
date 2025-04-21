// ────────────────────────────────────────────────────────────
// src/pages/purchases/PurchaseForm.jsx
// ────────────────────────────────────────────────────────────
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Paper, TextField, Typography, Button } from '@mui/material';
import {
  createPurchase,
  updatePurchase,
  fetchPurchaseById,
} from '../../api';

export default function PurchaseForm() {
  const { id } = useParams();
  const isNew = !id;
  const [form, setForm] = useState({ supplier_id:'', total_amount:'', purchase_date:'' });
  const navigate = useNavigate();

  useEffect(()=>{
    if (!isNew) fetchPurchaseById(id).then(res=>setForm(res.data));
  },[id,isNew]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    const action = isNew ? createPurchase(form) : updatePurchase(id, form);
    action.then(()=>navigate('/purchases')).catch(err=>alert(err.message));
  };

  return (
    <Paper sx={{ p:3, maxWidth:500 }}>
      <Typography variant="h6" gutterBottom>
        {isNew ? 'Create Purchase' : `Edit Purchase #${id}`}
      </Typography>
      <form onSubmit={handleSubmit} noValidate>
        <TextField label="Supplier ID" name="supplier_id" value={form.supplier_id} onChange={handleChange} fullWidth required sx={{ mb:2 }}/>
        <TextField label="Purchase Date" name="purchase_date" type="date" value={form.purchase_date?.slice(0,10)} onChange={handleChange} fullWidth required sx={{ mb:2 }} InputLabelProps={{ shrink:true }}/>
        <TextField label="Total Amount" name="total_amount" value={form.total_amount} onChange={handleChange} fullWidth required sx={{ mb:2 }}/>
        <Button variant="contained" type="submit">Save</Button>
      </form>
    </Paper>
  );
}
