import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Stack,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, ToggleButtonGroup, ToggleButton
} from '@mui/material';

const BASE = 'http://localhost:8000/api/product';

function AddProductDialog({ open, onClose, onSave }) {
  const [form, setForm] = useState({
    discount: '',
    price: '',
    price_after_discount: ''
  });

  const handleChange = field => e =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = () => {
    fetch(`${BASE}/products/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
      .then(r => r.json())
      .then(data => {
        onSave(data);
        onClose();
      })
      .catch(() => alert('Failed to add product'));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Product</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 2 }}>
          <TextField
            label="Discount"
            value={form.discount}
            onChange={handleChange('discount')}
            fullWidth
          />
          <TextField
            label="Price"
            value={form.price}
            onChange={handleChange('price')}
            fullWidth
          />
          <TextField
            label="Price After Discount"
            value={form.price_after_discount}
            onChange={handleChange('price_after_discount')}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}

function UpdateProductDialog({ product, open, onClose, onSave }) {
  const [form, setForm] = useState(null);

  useEffect(() => {
    if (product) {
      setForm({
        discount: product.discount,
        price: product.price,
        price_after_discount: product.price_after_discount
      });
    }
  }, [product]);

  const handleChange = field => e =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = () => {
    fetch(`${BASE}/products/${product.product_id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
      .then(r => r.json())
      .then(data => {
        onSave(data);
        onClose();
      })
      .catch(() => alert('Failed to update product'));
  };

  if (!form) return null;
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Update Product</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 2 }}>
          <TextField
            label="Discount"
            value={form.discount}
            onChange={handleChange('discount')}
            fullWidth
          />
          <TextField
            label="Price"
            value={form.price}
            onChange={handleChange('price')}
            fullWidth
          />
          <TextField
            label="Price After Discount"
            value={form.price_after_discount}
            onChange={handleChange('price_after_discount')}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}

function DeleteProductDialog({ product, open, onClose, onConfirm }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Delete Product</DialogTitle>
      <DialogContent>
        Are you sure you want to delete product #{product?.product_id}?
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="error" variant="contained" onClick={onConfirm}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function Product() {
  const [mode, setMode] = useState('all');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [edit, setEdit] = useState(null);
  const [del, setDel] = useState(null);

  useEffect(() => {
    setLoading(true);
    let url = `${BASE}/products/`;
    if (mode === 'food') url = `${BASE}/foodproducts/`;
    if (mode === 'nonfood') url = `${BASE}/nonfoodproducts/`;
    fetch(url)
      .then(r => r.json())
      .then(data => {
        setItems(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [mode]);

  const handleDelete = () => {
    fetch(`${BASE}/products/${del.product_id}/`, { method: 'DELETE' })
      .then(() => {
        setItems(i => i.filter(x => x.product_id !== del.product_id));
        setDel(null);
      });
  };

  if (loading) return <Typography>Loading…</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h3" gutterBottom>Product List</Typography>

      <ToggleButtonGroup
        value={mode}
        exclusive
        onChange={(_, v) => v && setMode(v)}
        sx={{ mb: 2 }}
      >
        <ToggleButton value="all">All</ToggleButton>
        <ToggleButton value="food">Food</ToggleButton>
        <ToggleButton value="nonfood">Non‑Food</ToggleButton>
      </ToggleButtonGroup>

      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow>
              {mode === 'all' && (<>
                <TableCell>SKU</TableCell>
                <TableCell>Discount</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Price After</TableCell>
              </>)}
              {mode === 'food' && (<>
                <TableCell>Product ID</TableCell>
                <TableCell>Food Type</TableCell>
                <TableCell>Storage</TableCell>
                <TableCell>Expiration</TableCell>
              </>)}
              {mode === 'nonfood' && (<>
                <TableCell>Product ID</TableCell>
                <TableCell>Warranty</TableCell>
                <TableCell>Brand</TableCell>
              </>)}
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map(item => (
              <TableRow key={mode === 'all' ? item.product_id : item.product}>
                {mode === 'all' && (<>
                  <TableCell>{item.product_id}</TableCell>
                  <TableCell>{item.discount}</TableCell>
                  <TableCell>{item.price}</TableCell>
                  <TableCell>{item.price_after_discount}</TableCell>
                </>)}
                {mode === 'food' && (<>
                  <TableCell>{item.product}</TableCell>
                  <TableCell>{item.foodtype}</TableCell>
                  <TableCell>{item.storage_cond}</TableCell>
                  <TableCell>{item.expiration}</TableCell>
                </>)}
                {mode === 'nonfood' && (<>
                  <TableCell>{item.product}</TableCell>
                  <TableCell>{item.warranty_period}</TableCell>
                  <TableCell>{item.brand}</TableCell>
                </>)}
                <TableCell align="right">
                  {mode === 'all' ? (
                    <Stack direction="row" spacing={1}>
                      <Button size="small" onClick={() => setEdit(item)}>Edit</Button>
                      <Button size="small" color="error" onClick={() => setDel(item)}>Delete</Button>
                    </Stack>
                  ) : (
                    <em>—</em>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {mode === 'all' && (
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" onClick={() => setAddOpen(true)}>Add Product</Button>
        </Box>
      )}

      <AddProductDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={newProd => setItems(i => [...i, newProd])}
      />

      <UpdateProductDialog
        open={!!edit}
        product={edit}
        onClose={() => setEdit(null)}
        onSave={updated => setItems(i => i.map(x => x.product_id === updated.product_id ? updated : x))}
      />

      <DeleteProductDialog
        open={!!del}
        product={del}
        onClose={() => setDel(null)}
        onConfirm={handleDelete}
      />
    </Box>
  );
}
