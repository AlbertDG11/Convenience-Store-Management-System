import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Stack, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField
} from '@mui/material';

const BASE_URL = 'http://localhost:8000/api/supplier/suppliers';

function AddSupplierDialog({ open, onClose, onSave }) {
  const [form, setForm] = useState({});

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleSubmit = () => {
    fetch(BASE_URL + '/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    .then(res => res.json())
    .then(data => {
      alert('Supplier added');
      onSave(data);
      onClose();
    })
    .catch(() => alert('Failed to add supplier'));
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Supplier</DialogTitle>
      <DialogContent>
        <TextField label="Name" fullWidth margin="dense" onChange={handleChange('name')} />
        <TextField label="Status" fullWidth margin="dense" onChange={handleChange('status')} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}

function UpdateSupplierDialog({ open, supplier, onClose, onSave }) {
  const [form, setForm] = useState({});

  useEffect(() => {
    if (supplier) setForm(supplier);
  }, [supplier]);

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleSubmit = () => {
    fetch(`${BASE_URL}/${form.supplier_id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    .then(res => res.json())
    .then(data => {
      alert('Updated successfully');
      onSave(data);
      onClose();
    })
    .catch(() => alert('Update failed'));
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Update Supplier</DialogTitle>
      <DialogContent>
        <TextField label="Name" fullWidth margin="dense" value={form.name || ''} onChange={handleChange('name')} />
        <TextField label="Status" fullWidth margin="dense" value={form.status || ''} onChange={handleChange('status')} />
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
        Are you sure you want to delete supplier "{supplier?.name}"?
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="error" variant="contained" onClick={onConfirm}>Delete</Button>
      </DialogActions>
    </Dialog>
  );
}

function Supplier() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [editSupplier, setEditSupplier] = useState(null);
  const [deleteSupplier, setDeleteSupplier] = useState(null);

  useEffect(() => {
    fetch(BASE_URL + '/')
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

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>Supplier Management</Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {suppliers.map(supplier => (
              <TableRow key={supplier.supplier_id}>
                <TableCell>{supplier.supplier_id}</TableCell>
                <TableCell>{supplier.name}</TableCell>
                <TableCell>{supplier.status}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button size="small" onClick={() => setEditSupplier(supplier)}>Edit</Button>
                    <Button size="small" color="error" onClick={() => setDeleteSupplier(supplier)}>Delete</Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box mt={3}>
        <Button variant="contained" onClick={() => setAddOpen(true)}>Add Supplier</Button>
      </Box>

      <AddSupplierDialog open={addOpen} onClose={() => setAddOpen(false)} onSave={(s) => setSuppliers([...suppliers, s])} />

      <UpdateSupplierDialog
        open={!!editSupplier}
        supplier={editSupplier}
        onClose={() => setEditSupplier(null)}
        onSave={(updated) =>
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

export default Supplier;
