import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Stack, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField
} from '@mui/material';

const BASE_URL = 'http://localhost:8000/api/product/inventory';

function AddInventoryDialog({ open, onClose, onSave }) {
  const [form, setForm] = useState({
    product: '',
    inventory_id: '',
    location: '',
    quantity: '',
    status: ''
  });

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleSubmit = () => {
    const token = localStorage.getItem('token');
    fetch(`${BASE_URL}/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json',
        'Authorization': "Bearer" + token
       },
      body: JSON.stringify(form)
    })
      .then(async res => {
        const data = await res.json();
        if (!res.ok) {
          // show validation error
          const msg = data.product
            ? data.product.join(', ')
            : 'Failed to add inventory';
          alert(msg);
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
      <DialogTitle>Add Inventory</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Product ID"
            type="number"
            fullWidth
            value={form.product}
            onChange={handleChange('product')}
          />
          <TextField
            label="Inventory ID"
            type="number"
            fullWidth
            value={form.inventory_id}
            onChange={handleChange('inventory_id')}
          />
          <TextField
            label="Location"
            fullWidth
            value={form.location}
            onChange={handleChange('location')}
          />
          <TextField
            label="Quantity"
            fullWidth
            value={form.quantity}
            onChange={handleChange('quantity')}
          />
          <TextField
            label="Status"
            fullWidth
            value={form.status}
            onChange={handleChange('status')}
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

function UpdateInventoryDialog({ open, inventory, onClose, onSave }) {
  const [form, setForm] = useState({});

  useEffect(() => {
    if (inventory) {
      setForm({
        id:            inventory.id,
        product:       inventory.product,
        inventory_id:  inventory.inventory_id,
        location:      inventory.location,
        quantity:      inventory.quantity,
        status:        inventory.status
      });
    }
  }, [inventory]);

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleSubmit = () => {
    const token = localStorage.getItem('token');
    fetch(`${BASE_URL}/${form.id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json',
        'Authorization': "Bearer" + token
       },
      body: JSON.stringify(form)
    })
      .then(async res => {
        const data = await res.json();
        if (!res.ok) {
          const msg = data.product
            ? data.product.join(', ')
            : 'Failed to update inventory';
          alert(msg);
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

  if (!form.id) return null;
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Update Inventory</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Product ID"
            type="number"
            fullWidth
            value={form.product}
            onChange={handleChange('product')}
          />
          <TextField
            label="Inventory ID"
            type="number"
            fullWidth
            value={form.inventory_id}
            onChange={handleChange('inventory_id')}
          />
          <TextField
            label="Location"
            fullWidth
            value={form.location}
            onChange={handleChange('location')}
          />
          <TextField
            label="Quantity"
            fullWidth
            value={form.quantity}
            onChange={handleChange('quantity')}
          />
          <TextField
            label="Status"
            fullWidth
            value={form.status}
            onChange={handleChange('status')}
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

function DeleteInventoryDialog({ open, inventory, onClose, onConfirm }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Delete Inventory</DialogTitle>
      <DialogContent>
        <Typography>Are you sure you want to delete inventory #{inventory?.id}?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="error" variant="contained" onClick={onConfirm}>Delete</Button>
      </DialogActions>
    </Dialog>
  );
}

export default function Inventory() {
  const [inventories, setInventories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [editInv, setEditInv] = useState(null);
  const [deleteInv, setDeleteInv] = useState(null);

  useEffect(() => {
    fetch(`${BASE_URL}/`)
      .then(res => res.json())
      .then(data => setInventories(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = () => {
    fetch(`${BASE_URL}/${deleteInv.id}/`, { method: 'DELETE' })
      .then(() => {
        setInventories(inv => inv.filter(i => i.id !== deleteInv.id));
        setDeleteInv(null);
      });
  };

  if (loading) return <Typography sx={{ p: 4 }}>Loading inventory…</Typography>;

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>Inventory Management</Typography>
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Product</strong></TableCell>
              <TableCell><strong>Inventory ID</strong></TableCell>
              <TableCell><strong>Location</strong></TableCell>
              <TableCell><strong>Quantity</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inventories.map(inv => (
              <TableRow key={inv.id}>
                <TableCell>{inv.id}</TableCell>
                <TableCell>{inv.product}</TableCell>
                <TableCell>{inv.inventory_id}</TableCell>
                <TableCell>{inv.location}</TableCell>
                <TableCell sx={{ color: Number(inv.quantity) < 10 ? 'error.main' : 'inherit' }}>
                  {inv.quantity}
                </TableCell>
                <TableCell>{inv.status}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button size="small" onClick={() => setEditInv(inv)}>Edit</Button>
                    <Button size="small" color="error" onClick={() => setDeleteInv(inv)}>Delete</Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button variant="contained" onClick={() => setAddOpen(true)}>Add Inventory</Button>
      <AddInventoryDialog open={addOpen} onClose={() => setAddOpen(false)} onSave={item => setInventories([...inventories, item])} />
      <UpdateInventoryDialog open={!!editInv} inventory={editInv} onClose={() => setEditInv(null)} onSave={item => setInventories(inventories.map(i => i.id === item.id ? item : i))} />
      <DeleteInventoryDialog open={!!deleteInv} inventory={deleteInv} onClose={() => setDeleteInv(null)} onConfirm={handleDelete} />
    </Box>
  );
}
