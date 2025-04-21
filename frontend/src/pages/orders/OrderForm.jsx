// src/pages/orders/OrderForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Paper, Grid, TextField, Button, MenuItem, IconButton
} from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';
import { fetchOrderById, createOrder, updateOrder, fetchProducts, fetchCustomers } from '../../api';

export default function OrderForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const nav = useNavigate();

  const [form, setForm] = useState({ delivery_address: '', order_status: '', customer_notes: '', member: '', items: [] });
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    fetchProducts().then(r => setProducts(r.data));
    fetchCustomers().then(r => setCustomers(r.data));
    if (isEdit) {
      fetchOrderById(id).then(r => {
        const d = r.data;
        setForm({
          delivery_address: d.delivery_address || '',
          order_status: d.order_status || '',
          customer_notes: d.customer_notes || '',
          member: d.member || '',
          items: d.items.map(i => ({ product: i.product, quantity_ordered: i.quantity_ordered })),
        });
      });
    }
  }, [id]);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleItem = (i, key, val) => setForm(f => {
    const its = [...f.items]; its[i][key] = val; return { ...f, items: its };
  });
  const addItem = () => setForm(f => ({ ...f, items: [...f.items, { product: '', quantity_ordered: 1 }] }));
  const removeItem = i => setForm(f => ({ ...f, items: f.items.filter((_, j) => j!==i) }));

  const onSubmit = e => {
    e.preventDefault();
    const action = isEdit ? updateOrder : createOrder;
    action(isEdit? id : undefined, form).then(() => nav('/orders'));
  };

  return (
    <Paper sx={{ p:3, mt:2 }}>
      <form onSubmit={onSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField fullWidth select label="Customer" name="member" value={form.member} onChange={handleChange} disabled={isEdit}>
              <MenuItem value="">N/A</MenuItem>
              {customers.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Address" name="delivery_address" value={form.delivery_address} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Status" name="order_status" value={form.order_status} onChange={handleChange} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth multiline rows={3} label="Notes" name="customer_notes" value={form.customer_notes} onChange={handleChange} />
          </Grid>
          <Grid item xs={12}>
            <Button startIcon={<AddCircleOutline />} onClick={addItem}>Add Item</Button>
          </Grid>
          {form.items.map((it, i) => (
            <Grid container item spacing={1} key={i} alignItems="center">
              <Grid item xs={6} sm={5}>
                <TextField fullWidth select label="Product" value={it.product} onChange={e=>handleItem(i,'product',e.target.value)}>
                  {products.map(p=> <MenuItem key={p.product_id} value={p.product_id}>{p.name}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={4} sm={5}>
                <TextField fullWidth type="number" label="Qty" value={it.quantity_ordered} onChange={e=>handleItem(i,'quantity_ordered',parseInt(e.target.value,10))}/>
              </Grid>
              <Grid item xs={2} sm={2}>
                <IconButton onClick={()=>removeItem(i)}><RemoveCircleOutline/></IconButton>
              </Grid>
            </Grid>
          ))}
          <Grid item xs={12}>
            <Button variant="contained" type="submit">{isEdit? 'Update':'Create'} Order</Button>
            <Button sx={{ ml:2 }} variant="outlined" onClick={()=>nav('/orders')}>Cancel</Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}