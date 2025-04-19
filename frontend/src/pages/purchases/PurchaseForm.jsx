// src/components/PurchaseForm.jsx
import React, { useEffect, useState } from 'react';
import { Paper, Typography, TextField, Button } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { createPurchase, fetchPurchaseById, updatePurchase } from '../../api';

export default function PurchaseForm() {
  const { id } = useParams();
  const isNew = !id;
  const [form, setForm] = useState({ supplier_id: '', total_cost: '', date: '' });
  const navigate = useNavigate();

  useEffect(() => {
    if (!isNew) {
      fetchPurchaseById(id)
        .then((res) => setForm(res.data))
        .catch((err) => console.error(err));
    }
  }, [id, isNew]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const action = isNew ? createPurchase : updatePurchase;
    action(id, form)
      .then(() => navigate('/purchases'))
      .catch((err) => alert('Save failed: ' + err.message));
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6">
        {isNew ? 'Create Purchase' : `Edit Purchase #${id}`}
      </Typography>
      <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
        <TextField
          name="supplier_id"
          label="Supplier ID"
          value={form.supplier_id}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          name="total_cost"
          label="Total Cost"
          type="number"
          value={form.total_cost}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          name="date"
          label="Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={form.date}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        <Button variant="contained" type="submit">
          Save
        </Button>
      </form>
    </Paper>
  );
}
