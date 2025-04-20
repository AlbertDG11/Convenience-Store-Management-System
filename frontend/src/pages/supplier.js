import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, Grid, TextField,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Stack,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';

const BASE_URL = 'http://localhost:8000/api/supplier/suppliers';

function AddSupplierDialog({ open, onClose, onSave }) {
  const [form, setForm] = useState({
    supplier_name: '',
    supplier_status: '',
    contact_name: '',
    contact_email: '',
    phone_number: '',
  });

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleSubmit = () => {
    fetch(`${BASE_URL}/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
      .then(res => res.json())
      .then(data => {
        onSave(data);
        onClose();
      })
      .catch(() => alert('Failed to add supplier'));
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Supplier</DialogTitle>
      <DialogContent>
        <TextField
          label="Name"
          fullWidth margin="dense"
          value={form.supplier_name}
          onChange={handleChange('supplier_name')}
        />
        <TextField
          label="Status"
          fullWidth margin="dense"
          value={form.supplier_status}
          onChange={handleChange('supplier_status')}
        />
        <TextField
          label="Contact Name"
          fullWidth margin="dense"
          value={form.contact_name}
          onChange={handleChange('contact_name')}
        />
        <TextField
          label="Contact Email"
          fullWidth margin="dense"
          value={form.contact_email}
          onChange={handleChange('contact_email')}
        />
        <TextField
          label="Phone Number"
          fullWidth margin="dense"
          value={form.phone_number}
          onChange={handleChange('phone_number')}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}

function UpdateSupplierDialog({ open, supplier, onClose, onSave }) {
  const [form, setForm] = useState({
    supplier_id: null,
    supplier_name: '',
    supplier_status: '',
    contact_name: '',
    contact_email: '',
    phone_number: '',
  });

  useEffect(() => {
    if (supplier) {
      setForm({
        supplier_id: supplier.supplier_id,
        supplier_name: supplier.supplier_name,
        supplier_status: supplier.supplier_status,
        contact_name: supplier.contact_name || '',
        contact_email: supplier.contact_email || '',
        phone_number: supplier.phone_number || '',
      });
    }
  }, [supplier]);

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleSubmit = () => {
    fetch(`${BASE_URL}/${form.supplier_id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
      .then(res => res.json())
      .then(data => {
        onSave(data);
        onClose();
      })
      .catch(() => alert('Update failed'));
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Update Supplier</DialogTitle>
      <DialogContent>
        <TextField
          label="Name"
          fullWidth margin="dense"
          value={form.supplier_name}
          onChange={handleChange('supplier_name')}
        />
        <TextField
          label="Status"
          fullWidth margin="dense"
          value={form.supplier_status}
          onChange={handleChange('supplier_status')}
        />
        <TextField
          label="Contact Name"
          fullWidth margin="dense"
          value={form.contact_name}
          onChange={handleChange('contact_name')}
        />
        <TextField
          label="Contact Email"
          fullWidth margin="dense"
          value={form.contact_email}
          onChange={handleChange('contact_email')}
        />
        <TextField
          label="Phone Number"
          fullWidth margin="dense"
          value={form.phone_number}
          onChange={handleChange('phone_number')}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}

function DeleteSupplierDialog({ open, supplier, onClose, onConfirm }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete Supplier</DialogTitle>
      <DialogContent>
        Are you sure you want to delete supplier "{supplier?.supplier_name}"?
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="error" variant="contained" onClick={onConfirm}>Delete</Button>
      </DialogActions>
    </Dialog>
  );
}

export default function Supplier() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  // filter state
  const [filters, setFilters] = useState({ name: '', status: '' });
  const [filterActive, setFilterActive] = useState(false);

  // dialog state
  const [addOpen, setAddOpen] = useState(false);
  const [editSupplier, setEditSupplier] = useState(null);
  const [deleteSupplier, setDeleteSupplier] = useState(null);

  useEffect(() => {
    fetch(`${BASE_URL}/`)
      .then(res => res.json())
      .then(data => {
        setSuppliers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleDelete = () => {
    fetch(`${BASE_URL}/${deleteSupplier.supplier_id}/`, { method: 'DELETE' })
      .then(() => {
        setSuppliers(prev => prev.filter(s => s.supplier_id !== deleteSupplier.supplier_id));
        setDeleteSupplier(null);
      });
  };

  // apply local filter
  const displayed = !filterActive
    ? suppliers
    : suppliers.filter(s =>
        (filters.name === '' || s.supplier_name.toLowerCase().includes(filters.name.toLowerCase()))
        && (filters.status === '' || s.supplier_status.toLowerCase().includes(filters.status.toLowerCase()))
      );

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Supplier Management
      </Typography>

      {/* filter row */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Name"
            fullWidth size="small"
            value={filters.name}
            onChange={e => setFilters(f => ({ ...f, name: e.target.value }))}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Status"
            fullWidth size="small"
            value={filters.status}
            onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Button
            fullWidth variant="outlined"
            onClick={() => setFilterActive(true)}
          >
            Search
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Button
            fullWidth variant="outlined" color="secondary"
            onClick={() => {
              setFilters({ name: '', status: '' });
              setFilterActive(false);
            }}
          >
            Clear
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Button
            fullWidth variant="contained"
            onClick={() => setAddOpen(true)}
          >
            Add Supplier
          </Button>
        </Grid>
      </Grid>

      {/* data table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Contact Name</strong></TableCell>
              <TableCell><strong>Contact Email</strong></TableCell>
              <TableCell><strong>Phone</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayed.map(s => (
              <TableRow key={s.supplier_id}>
                <TableCell>{s.supplier_id}</TableCell>
                <TableCell>{s.supplier_name}</TableCell>
                <TableCell>{s.supplier_status}</TableCell>
                <TableCell>{s.contact_name}</TableCell>
                <TableCell>{s.contact_email}</TableCell>
                <TableCell>{s.phone_number}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button size="small" onClick={() => setEditSupplier(s)}>
                      Edit
                    </Button>
                    <Button size="small" color="error" onClick={() => setDeleteSupplier(s)}>
                      Delete
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* dialogs */}
      <AddSupplierDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={newS => setSuppliers([...suppliers, newS])}
      />

      <UpdateSupplierDialog
        open={!!editSupplier}
        supplier={editSupplier}
        onClose={() => setEditSupplier(null)}
        onSave={updated =>
          setSuppliers(suppliers.map(s =>
            s.supplier_id === updated.supplier_id ? updated : s
          ))
        }
      />

      <DeleteSupplierDialog
        open={!!deleteSupplier}
        supplier={deleteSupplier}
        onClose={() => setDeleteSupplier(null)}
        onConfirm={handleDelete}
      />
    </Box>
  );
}
