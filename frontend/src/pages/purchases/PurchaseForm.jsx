// src/pages/purchases/PurchaseForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Paper,
  Grid,
  TextField,
  Button,
  IconButton,
  Typography,
  Snackbar,
  Alert
} from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';
import {
  fetchPurchaseById,
  createPurchase,
  updatePurchase
} from '../../api';

export default function PurchaseForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    supplier: '',
    items: []
  });
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ open:false, message:'', severity:'error' });

  useEffect(() => {
    if (isEdit) {
      fetchPurchaseById(id)
        .then(res => {
          const d = res.data;
          setForm({
            supplier: d.supplier,
            items: d.items.map(i => ({
              product: i.product,
              quantity_purchased: i.quantity_purchased
            }))
          });
        })
        .catch(err => {
          setAlert({
            open:true,
            message:`Load failed: ${err.response?.data?.detail||err.message}`,
            severity:'error'
          });
        });
    }
  }, [id, isEdit]);

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleItem = (idx, key, val) => {
    setForm(f => {
      const items = [...f.items];
      items[idx] = { ...items[idx], [key]: val };
      return { ...f, items };
    });
  };

  const addItem = () => {
    setForm(f => ({
      ...f,
      items: [...f.items, { product:'', quantity_purchased:1 }]
    }));
  };

  const removeItem = idx => {
    setForm(f => ({
      ...f,
      items: f.items.filter((_,i)=>i!==idx)
    }));
  };

  const validate = () => {
    const errs = {};
    if (!form.supplier) errs.supplier = 'Supplier ID required';
    if (form.items.length===0) errs.items = 'At least one item';
    form.items.forEach((it,i)=>{
      if (!it.product) errs[`prod-${i}`]='Product ID required';
      if (!it.quantity_purchased || it.quantity_purchased<1)
        errs[`qty-${i}`]='Qty ≥1';
    });
    setErrors(errs);
    return !Object.keys(errs).length;
  };

  const onSubmit = e => {
    e.preventDefault();
    if (!validate()) {
      setAlert({ open:true, message:'Fix errors', severity:'error' });
      return;
    }
    const payload = {
      supplier: parseInt(form.supplier,10),
      items: form.items.map(it=>({
        product: parseInt(it.product,10),
        quantity_purchased: it.quantity_purchased
      }))
    };
    const action = isEdit
      ? updatePurchase(id, payload)
      : createPurchase(payload);

    action
      .then(()=>{
        setAlert({ open:true, message:`Purchase ${isEdit?'updated':'created'}`, severity:'success' });
        setTimeout(()=>navigate('/purchases'),1000);
      })
      .catch(err=>{
        const msg = err.response?.data?.detail || err.message;
        setAlert({ open:true, message:msg, severity:'error' });
      });
  };

  return (
    <Paper sx={{ p:3, mt:2 }}>
      <Typography variant="h5" gutterBottom>
        {isEdit? `Edit Purchase #${id}` : 'Create New Purchase'}
      </Typography>

      <form onSubmit={onSubmit} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Supplier ID"
              name="supplier"
              value={form.supplier}
              onChange={handleChange}
              error={!!errors.supplier}
              helperText={errors.supplier}
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
              <Typography color="error" variant="caption" sx={{ ml:2 }}>
                {errors.items}
              </Typography>
            )}
          </Grid>

          {form.items.map((it,i) => (
            <Grid container item spacing={1} key={i} alignItems="center">
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Product ID"
                  value={it.product}
                  onChange={e=>handleItem(i,'product',e.target.value)}
                  error={!!errors[`prod-${i}`]}
                  helperText={errors[`prod-${i}`]}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Quantity"
                  value={it.quantity_purchased}
                  onChange={e=>handleItem(i,'quantity_purchased',parseInt(e.target.value,10))}
                  error={!!errors[`qty-${i}`]}
                  helperText={errors[`qty-${i}`]}
                  inputProps={{min:1}}
                />
              </Grid>
              <Grid item xs={2}>
                <IconButton onClick={()=>removeItem(i)}>
                  <RemoveCircleOutline/>
                </IconButton>
              </Grid>
            </Grid>
          ))}

          <Grid item xs={12} sx={{ mt:2 }}>
            <Button type="submit" variant="contained">
              {isEdit?'Update Purchase':'Create Purchase'}
            </Button>
            <Button
              sx={{ ml:2 }}
              variant="outlined"
              onClick={()=>navigate('/purchases')}
            >
              Cancel
            </Button>
          </Grid>
        </Grid>
      </form>

      <Snackbar
        open={alert.open}
        autoHideDuration={4000}
        onClose={()=>setAlert(a=>({...a,open:false}))}
        anchorOrigin={{vertical:'top',horizontal:'center'}}
      >
        <Alert
          severity={alert.severity}
          onClose={()=>setAlert(a=>({...a,open:false}))}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
}
