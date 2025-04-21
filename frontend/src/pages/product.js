import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button,
  Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow,
  Paper, Stack,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, ToggleButtonGroup, ToggleButton,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';

const BASE = 'http://localhost:8000/api/product';

// ─── Add Product Dialog ─────────────────────────────────────────────────────
function AddProductDialog({ mode, open, onClose, onSave }) {
  const [form, setForm] = useState({
    product_id: '',
    name: '',
    type: mode === 'food' ? 'food' : 'nonfood',
    discount: '', price: '', price_after_discount: '',
    food_type: '', storage_condition: '', expiration_date: '',
    warranty_period: '', brand: ''
  });

  const handle = field => e => setForm(f => ({ ...f, [field]: e.target.value }));

  const submit = () => {
    const payload = {
      product_id: form.product_id === '' ? null : parseInt(form.product_id, 10),
      name: form.name || null,
      type: form.type,
      discount: form.discount === '' ? null : parseFloat(form.discount),
      price: form.price === '' ? null : parseFloat(form.price),
      price_after_discount: form.price_after_discount === '' ? null : parseFloat(form.price_after_discount),
      food_type: form.type === 'food' ? (form.food_type || null) : null,
      storage_condition: form.type === 'food' ? (form.storage_condition || null) : null,
      expiration_date: form.type === 'food' ? (form.expiration_date || null) : null,
      warranty_period: form.type === 'nonfood' ? (form.warranty_period || null) : null,
      brand: form.type === 'nonfood' ? (form.brand || null) : null,
    };

    console.log('Creating product payload:', payload);

    const token = localStorage.getItem('token');
    fetch(`${BASE}/products/`, {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(async res => {
        const data = await res.json();
        if (!res.ok) {
          console.error('Errors:', data);
          alert('Failed to add product');
          return;
        }
        onSave(data);
        onClose();
      })
      .catch(err => {
        console.error('Network error', err);
        alert('Network error');
      });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Product</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 2 }}>
          <TextField
            label="ID"
            type="number"
            value={form.product_id}
            onChange={handle('product_id')}
            fullWidth
          />
          <TextField label="Name" value={form.name} onChange={handle('name')} fullWidth />

          <FormControl fullWidth>
            <InputLabel>Type</InputLabel>
            <Select
              value={form.type}
              label="Type"
              onChange={e => {
                const newType = e.target.value;
                setForm(f => ({
                  ...f,
                  type: newType,
                  // clear subtype fields
                  food_type: '', storage_condition: '', expiration_date: '',
                  warranty_period: '', brand: ''
                }));
              }}
            >
              <MenuItem value="food">Food</MenuItem>
              <MenuItem value="nonfood">Non‑Food</MenuItem>
            </Select>
          </FormControl>

          <TextField label="Discount" value={form.discount} onChange={handle('discount')} fullWidth />
          <TextField label="Price" value={form.price} onChange={handle('price')} fullWidth />
          <TextField label="Price After Discount" value={form.price_after_discount} onChange={handle('price_after_discount')} fullWidth />

          {form.type === 'food' && (
            <>
              <TextField label="Food Type" value={form.food_type} onChange={handle('food_type')} fullWidth />
              <TextField label="Storage Condition" value={form.storage_condition} onChange={handle('storage_condition')} fullWidth />
              <TextField label="Expiration (YYYY-MM-DD)" value={form.expiration_date} onChange={handle('expiration_date')} fullWidth />
            </>
          )}

          {form.type === 'nonfood' && (
            <>
              <TextField label="Warranty Period" value={form.warranty_period} onChange={handle('warranty_period')} fullWidth />
              <TextField label="Brand" value={form.brand} onChange={handle('brand')} fullWidth />
            </>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={submit}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}

// ─── Update Product Dialog ──────────────────────────────────────────────────
function UpdateProductDialog({ product, open, onClose, onSave }) {
  const [form, setForm] = useState(null);

  useEffect(() => {
    if (product) {
      setForm({
        product_id:          product.product_id,
        name:                product.name || '',
        type:                product.type || 'food',
        discount:            product.discount != null ? product.discount : '',
        price:               product.price != null ? product.price : '',
        price_after_discount:product.price_after_discount != null ? product.price_after_discount : '',
        food_type:           product.food_type || '',
        storage_condition:   product.storage_condition || '',
        expiration_date:     product.expiration_date || '',
        warranty_period:     product.warranty_period || '',
        brand:               product.brand || ''
      });
    }
  }, [product]);

  const handle = field => e => setForm(f => ({ ...f, [field]: e.target.value }));

  const submit = () => {
    const payload = {
      product_id: form.product_id,
      name: form.name || null,
      type: form.type,
      discount: form.discount === '' ? null : parseFloat(form.discount),
      price: form.price === '' ? null : parseFloat(form.price),
      price_after_discount: form.price_after_discount === '' ? null : parseFloat(form.price_after_discount),
      food_type: form.type === 'food' ? (form.food_type || null) : null,
      storage_condition: form.type === 'food' ? (form.storage_condition || null) : null,
      expiration_date: form.type === 'food' ? (form.expiration_date || null) : null,
      warranty_period: form.type === 'nonfood' ? (form.warranty_period || null) : null,
      brand: form.type === 'nonfood' ? (form.brand || null) : null,
    };

    console.log('Updating product payload:', payload);

    const token = localStorage.getItem('token');
    fetch(`${BASE}/products/${product.product_id}/`, {
      method: 'PUT',
      headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(async res => {
        const data = await res.json();
        if (!res.ok) {
          console.error('Errors:', data);
          alert('Failed to update product');
          return;
        }
        onSave(data);
        onClose();
      })
      .catch(err => {
        console.error('Network error', err);
        alert('Network error');
      });
  };

  if (!form) return null;
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Update Product</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 2 }}>
          <TextField
            label="ID"
            type="number"
            value={form.product_id}
            onChange={handle('product_id')}
            fullWidth
          />
          <TextField label="Name" value={form.name} onChange={handle('name')} fullWidth />

          <FormControl fullWidth>
            <InputLabel>Type</InputLabel>
            <Select
              value={form.type}
              label="Type"
              onChange={e => {
                const newType = e.target.value;
                setForm(f => ({
                  ...f,
                  type: newType,
                  food_type: '', storage_condition: '', expiration_date: '',
                  warranty_period: '', brand: ''
                }));
              }}
            >
              <MenuItem value="food">Food</MenuItem>
              <MenuItem value="nonfood">Non‑Food</MenuItem>
            </Select>
          </FormControl>

          <TextField label="Discount" value={form.discount} onChange={handle('discount')} fullWidth />
          <TextField label="Price" value={form.price} onChange={handle('price')} fullWidth />
          <TextField label="Price After Discount" value={form.price_after_discount} onChange={handle('price_after_discount')} fullWidth />

          {form.type === 'food' && (
            <>
              <TextField label="Food Type" value={form.food_type} onChange={handle('food_type')} fullWidth />
              <TextField label="Storage Condition" value={form.storage_condition} onChange={handle('storage_condition')} fullWidth />
              <TextField label="Expiration (YYYY-MM-DD)" value={form.expiration_date} onChange={handle('expiration_date')} fullWidth />
            </>
          )}

          {form.type === 'nonfood' && (
            <>
              <TextField label="Warranty Period" value={form.warranty_period} onChange={handle('warranty_period')} fullWidth />
              <TextField label="Brand" value={form.brand} onChange={handle('brand')} fullWidth />
            </>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={submit}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}

// ─── Delete Product Dialog ──────────────────────────────────────────────────
function DeleteProductDialog({ product, open, onClose, onConfirm }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Delete Product</DialogTitle>
      <DialogContent>
        <Typography>Are you sure you want to delete product #{product?.product_id}?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="error" variant="contained" onClick={onConfirm}>Delete</Button>
      </DialogActions>
    </Dialog>
  );
}

// ─── Detail Dialog ───────────────────────────────────────────────────────────
function ProductDetailDialog({ id, data, loading, error, onClose }) {
  return (
    <Dialog open={!!id} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Product Details</DialogTitle>
      <DialogContent dividers>
        {loading && <Typography>Loading…</Typography>}
        {error && <Typography color="error">{error}</Typography>}
        {data && (
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Typography><strong>ID:</strong> {data.product_id}</Typography>
            <Typography><strong>Name:</strong> {data.name}</Typography>
            <Typography><strong>Type:</strong> {data.type}</Typography>
            <Typography><strong>Discount:</strong> {data.discount}</Typography>
            <Typography><strong>Price:</strong> {data.price}</Typography>
            <Typography><strong>Price After:</strong> {data.price_after_discount}</Typography>
            {data.type === 'food' && (
              <>
                <Typography><strong>Food Type:</strong> {data.food_type}</Typography>
                <Typography><strong>Storage Condition:</strong> {data.storage_condition}</Typography>
                <Typography><strong>Expiration Date:</strong> {data.expiration_date}</Typography>
              </>
            )}
            {data.type === 'nonfood' && (
              <>
                <Typography><strong>Warranty Period:</strong> {data.warranty_period}</Typography>
                <Typography><strong>Brand:</strong> {data.brand}</Typography>
              </>
            )}
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

// ─── Main Product Component ─────────────────────────────────────────────────
export default function Product() {
  const [mode, setMode] = useState('all');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [delProduct, setDelProduct] = useState(null);
  const [detailId, setDetailId] = useState(null);
  const [detailData, setDetailData] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(null);

  // fetch list
  useEffect(() => {
    setLoading(true);
    let url = `${BASE}/products/`;
    if (mode !== 'all') url += `?type=${mode}`;
    fetch(url)
      .then(r => r.json())
      .then(data => setItems(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [mode]);

  // fetch detail
  useEffect(() => {
    if (!detailId) {
      setDetailData(null);
      return;
    }
    setDetailLoading(true);
    fetch(`${BASE}/products/${detailId}/`)
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => { setDetailData(data); setDetailError(null); })
      .catch(() => setDetailError('Unable to load'))
      .finally(() => setDetailLoading(false));
  }, [detailId]);

  const handleDel = () => {
    fetch(`${BASE}/products/${delProduct.product.product_id}/`, { method: 'DELETE' })
      .then(() => setItems(i => i.filter(x => x.product_id !== delProduct.product.product_id)))
      .finally(() => setDelProduct(null));
  };

  if (loading) return <Typography>Loading…</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h3" gutterBottom>Product Management</Typography>
      <ToggleButtonGroup value={mode} exclusive onChange={(_, v) => v && setMode(v)} sx={{ mb: 2 }}>
        <ToggleButton value="all">All</ToggleButton>
        <ToggleButton value="food">Food</ToggleButton>
        <ToggleButton value="nonfood">Non‑Food</ToggleButton>
      </ToggleButtonGroup>
      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow>
              {mode==='all' && <> <TableCell>ID</TableCell><TableCell>Name</TableCell><TableCell>Type</TableCell><TableCell>Discount</TableCell><TableCell>Price</TableCell><TableCell>Price After</TableCell> </>}
              {mode==='food' && <> <TableCell>ID</TableCell><TableCell>Food Type</TableCell><TableCell>Storage</TableCell><TableCell>Expiration</TableCell> </>}
              {mode==='nonfood' && <> <TableCell>ID</TableCell><TableCell>Warranty</TableCell><TableCell>Brand</TableCell> </>}
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item, idx) => (
              <TableRow key={item.product_id}>
                {mode==='all' && <> <TableCell>{idx+1}</TableCell><TableCell>{item.name}</TableCell><TableCell>{item.type}</TableCell><TableCell>{item.discount}</TableCell><TableCell>{item.price}</TableCell><TableCell>{item.price_after_discount}</TableCell> </>}
                {mode==='food' && <> <TableCell>{idx+1}</TableCell><TableCell>{item.food_type}</TableCell><TableCell>{item.storage_condition}</TableCell><TableCell>{item.expiration_date}</TableCell> </>}
                {mode==='nonfood' && <> <TableCell>{idx+1}</TableCell><TableCell>{item.warranty_period}</TableCell><TableCell>{item.brand}</TableCell> </>}
                <TableCell align="right">
                  <Stack direction="row" spacing={1}>
                    <Button size="small" onClick={() => setDetailId(item.product_id)}>View</Button>
                    <Button size="small" onClick={() => setEditProduct(item)}>Edit</Button>
                    <Button size="small" color="error" onClick={() => setDelProduct({ product: item })}>Delete</Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ mt: 2 }}>
        <Button variant="contained" onClick={() => setAddOpen(true)}>
          Add {mode==='all'? 'Product': mode==='food'? 'Food':'Non‑Food'}
        </Button>
      </Box>

      <AddProductDialog mode={mode} open={addOpen} onClose={() => setAddOpen(false)} onSave={d => setItems(i => [...i, d])} />
      <UpdateProductDialog product={editProduct} open={!!editProduct} onClose={() => setEditProduct(null)} onSave={d => setItems(i => i.map(x => x.product_id===d.product_id? d : x))} />
      <DeleteProductDialog product={delProduct?.product} open={!!delProduct} onClose={() => setDelProduct(null)} onConfirm={handleDel} />
      <ProductDetailDialog id={detailId} data={detailData} loading={detailLoading} error={detailError} onClose={() => setDetailId(null)} />
    </Box>
  );
}
