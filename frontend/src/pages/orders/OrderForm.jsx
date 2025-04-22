// src/pages/orders/OrderForm.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Paper,
  Grid,
  TextField,
  Button,
  IconButton,
  Typography,
  Alert,
  Snackbar
} from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';
import {
  fetchOrderById,
  createOrder,
  updateOrder
} from '../../api';

export default function OrderForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    delivery_address: '',
    order_status: '',
    customer_notes: '',
    member: '',
    items: []
  });
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'error' });

  // 载入已有订单
  useEffect(() => {
    if (isEdit) {
      fetchOrderById(id)
        .then(res => {
          const d = res.data;
          setForm({
            delivery_address: d.delivery_address || '',
            order_status: d.order_status || '',
            customer_notes: d.customer_notes || '',
            member: d.member ?? '',
            items: d.items.map(i => ({
              product: i.product,              // 这里 product 即商品 ID
              quantity_ordered: i.quantity_ordered
            }))
          });
        })
        .catch(err => {
          setAlert({
            open: true,
            message: `Failed loading order: ${err.response?.data?.detail || err.message}`,
            severity: 'error'
          });
        });
    }
  }, [id, isEdit]);

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleItem = (idx, key, value) => {
    setForm(f => {
      const items = [...f.items];
      items[idx] = { ...items[idx], [key]: value };
      return { ...f, items };
    });
  };

  const addItem = () => {
    setForm(f => ({
      ...f,
      items: [...f.items, { product: '', quantity_ordered: 1 }]
    }));
  };

  const removeItem = idx => {
    setForm(f => ({
      ...f,
      items: f.items.filter((_, i) => i !== idx)
    }));
  };

  // 简单校验：至少一条明细，ID 和数量都有效
  const validate = () => {
    const errs = {};
    if (form.items.length === 0) {
      errs.items = 'At least one item required';
    }
    form.items.forEach((it, i) => {
      if (!it.product) {
        errs[`item-${i}-product`] = 'Product ID required';
      }
      if (!it.quantity_ordered || it.quantity_ordered < 1) {
        errs[`item-${i}-quantity`] = 'Qty must be ≥ 1';
      }
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const onSubmit = e => {
    e.preventDefault();
    if (!validate()) {
      setAlert({ open: true, message: 'Fix errors before submit', severity: 'error' });
      return;
    }
    const payload = {
      delivery_address: form.delivery_address,
      order_status: form.order_status,
      customer_notes: form.customer_notes,
      member: form.member === '' ? null : parseInt(form.member, 10),
      items: form.items.map(it => ({
        product: parseInt(it.product, 10),
        quantity_ordered: it.quantity_ordered
      }))
    };

    if (isEdit) {
      updateOrder(id, payload)
        .then(() => {
          setAlert({ open: true, message: 'Order updated', severity: 'success' });
          setTimeout(() => navigate('/orders'), 1000);
        })
        .catch(err => {
          const msg = err.response?.data?.detail || err.message;
          setAlert({ open: true, message: msg, severity: 'error' });
        });
    } else {
      createOrder(payload)
        .then(() => {
          setAlert({ open: true, message: 'Order created', severity: 'success' });
          setTimeout(() => navigate('/orders'), 1000);
        })
        .catch(err => {
          const msg = err.response?.data?.detail || err.message;
          setAlert({ open: true, message: msg, severity: 'error' });
        });
    }
  };

  return (
    <Paper sx={{ p: 3, mt: 2 }}>
      <Typography variant="h5" gutterBottom>
        {isEdit ? `Edit Order #${id}` : 'Create New Order'}
      </Typography>

      <form onSubmit={onSubmit} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Customer ID (optional)"
              name="member"
              value={form.member}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Delivery Address"
              name="delivery_address"
              value={form.delivery_address}
              onChange={handleChange}
              error={!!errors.delivery_address}
              helperText={errors.delivery_address}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Order Status"
              name="order_status"
              value={form.order_status}
              onChange={handleChange}
              error={!!errors.order_status}
              helperText={errors.order_status}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Customer Notes"
              name="customer_notes"
              value={form.customer_notes}
              onChange={handleChange}
              error={!!errors.customer_notes}
              helperText={errors.customer_notes}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              startIcon={<AddCircleOutline />}
              variant="outlined"
              onClick={addItem}
            >
              Add Item
            </Button>
            {!!errors.items && (
              <Typography color="error" variant="caption" sx={{ ml: 2 }}>
                {errors.items}
              </Typography>
            )}
          </Grid>

          {form.items.map((it, i) => (
            <Grid container item spacing={1} key={i} alignItems="center">
              <Grid item xs={6} sm={5}>
                <TextField
                  fullWidth
                  label="Product ID"
                  value={it.product}
                  onChange={e => handleItem(i, 'product', e.target.value)}
                  error={!!errors[`item-${i}-product`]}
                  helperText={errors[`item-${i}-product`]}
                />
              </Grid>
              <Grid item xs={4} sm={5}>
                <TextField
                  fullWidth
                  type="number"
                  label="Quantity"
                  value={it.quantity_ordered}
                  onChange={e =>
                    handleItem(i, 'quantity_ordered', parseInt(e.target.value, 10))
                  }
                  error={!!errors[`item-${i}-quantity`]}
                  helperText={errors[`item-${i}-quantity`]}
                  inputProps={{ min: 1 }}
                />
              </Grid>
              <Grid item xs={2} sm={2}>
                <IconButton onClick={() => removeItem(i)}>
                  <RemoveCircleOutline />
                </IconButton>
              </Grid>
            </Grid>
          ))}

          <Grid item xs={12} sx={{ mt: 2 }}>
            <Button type="submit" variant="contained">
              {isEdit ? 'Update Order' : 'Create Order'}
            </Button>
            <Button
              sx={{ ml: 2 }}
              variant="outlined"
              onClick={() => navigate('/orders')}
            >
              Cancel
            </Button>
          </Grid>
        </Grid>
      </form>

      <Snackbar
        open={alert.open}
        autoHideDuration={4000}
        onClose={() => setAlert(a => ({ ...a, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity={alert.severity}
          onClose={() => setAlert(a => ({ ...a, open: false }))}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
}
