import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Grid, TextField, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Stack,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';

const BASE_URL = 'http://localhost:8000/api/supplier/suppliers';

function AddSupplierDialog({ open, onClose, onSave }) {
  const [form, setForm] = useState({
    supplier_name: '', supplier_status: '', contact_name: '', contact_email: '', phone_number: ''
  });
  const [addresses, setAddresses] = useState([
    { province: '', city: '', street_address: '', postal_code: '' }
  ]);

  const handleChange = field => e => setForm({ ...form, [field]: e.target.value });
  const handleAddrChange = (idx, field) => e => {
    const a = [...addresses]; a[idx][field] = e.target.value; setAddresses(a);
  };
  const addAddress = () => setAddresses([...addresses, { province: '', city: '', street_address: '', postal_code: '' }]);
  const removeAddress = idx => setAddresses(addresses.filter((_,i)=>i!==idx));

  const handleSubmit = () => {
    const payload = { ...form, addresses };
    fetch(`${BASE_URL}/`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(data => { onSave(data); onClose(); })
    .catch(() => alert('Failed to add supplier'));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Supplier</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <TextField label="Name" fullWidth value={form.supplier_name} onChange={handleChange('supplier_name')} />
          <TextField label="Status" fullWidth value={form.supplier_status} onChange={handleChange('supplier_status')} />
          <TextField label="Contact Name" fullWidth value={form.contact_name} onChange={handleChange('contact_name')} />
          <TextField label="Contact Email" fullWidth value={form.contact_email} onChange={handleChange('contact_email')} />
          <TextField label="Phone Number" fullWidth value={form.phone_number} onChange={handleChange('phone_number')} />
          {addresses.map((addr, idx) => (
            <Box key={idx} sx={{ border: '1px solid #ccc', p:2, borderRadius:2 }}>
              <Typography variant="subtitle2">Address {idx+1}</Typography>
              <Grid container spacing={1}>
                <Grid item xs={6}><TextField fullWidth label="Province" value={addr.province} onChange={handleAddrChange(idx,'province')} /></Grid>
                <Grid item xs={6}><TextField fullWidth label="City" value={addr.city} onChange={handleAddrChange(idx,'city')} /></Grid>
                <Grid item xs={6}><TextField fullWidth label="Street Address" value={addr.street_address} onChange={handleAddrChange(idx,'street_address')} /></Grid>
                <Grid item xs={6}><TextField fullWidth label="Postal Code" value={addr.postal_code} onChange={handleAddrChange(idx,'postal_code')} /></Grid>
              </Grid>
              {addresses.length>1 && <Button color="error" onClick={()=>removeAddress(idx)}>Remove Address</Button>}
            </Box>
          ))}
          <Button onClick={addAddress}>Add Address</Button>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}

function UpdateSupplierDialog({ open, supplier, onClose, onSave }) {
  const [form, setForm] = useState(null);

  useEffect(() => {
    if (supplier) {
      // strip nested fields
      setForm({
        ...supplier,
        addresses: supplier.addresses.map(a => ({
          province: a.province, city: a.city,
          street_address: a.street_address, postal_code: a.postal_code
        }))
      });
    }
  }, [supplier]);

  if (!form) return null;
  const handleChange = field => e => setForm({ ...form, [field]: e.target.value });
  const handleAddrChange = (idx, field) => e => {
    const a = [...form.addresses]; a[idx][field]=e.target.value; setForm({ ...form, addresses: a });
  };
  const addAddress = () => setForm({ ...form, addresses: [...form.addresses, { province:'',city:'',street_address:'',postal_code:'' }] });
  const removeAddress = idx => {
    const a = form.addresses.filter((_,i)=>i!==idx);
    setForm({ ...form, addresses: a });
  };

  const handleSubmit = () => {
    const payload = {
      supplier_name: form.supplier_name,
      supplier_status: form.supplier_status,
      contact_name: form.contact_name,
      contact_email: form.contact_email,
      phone_number: form.phone_number,
      addresses: form.addresses
    };
    fetch(`${BASE_URL}/${form.supplier_id}/`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
    })
    .then(res=>res.json())
    .then(data=> { onSave(data); onClose(); })
    .catch(()=>alert('Update failed'));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Update Supplier</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <TextField label="Name" fullWidth value={form.supplier_name} onChange={handleChange('supplier_name')} />
          <TextField label="Status" fullWidth value={form.supplier_status} onChange={handleChange('supplier_status')} />
          <TextField label="Contact Name" fullWidth value={form.contact_name} onChange={handleChange('contact_name')} />
          <TextField label="Contact Email" fullWidth value={form.contact_email} onChange={handleChange('contact_email')} />
          <TextField label="Phone Number" fullWidth value={form.phone_number} onChange={handleChange('phone_number')} />
          {form.addresses.map((addr, idx) => (
            <Box key={idx} sx={{ border:'1px solid #ccc', p:2, borderRadius:2 }}>
              <Typography variant="subtitle2">Address {idx+1}</Typography>
              <Grid container spacing={1}>
                <Grid item xs={6}><TextField fullWidth label="Province" value={addr.province} onChange={handleAddrChange(idx,'province')} /></Grid>
                <Grid item xs={6}><TextField fullWidth label="City" value={addr.city} onChange={handleAddrChange(idx,'city')} /></Grid>
                <Grid item xs={6}><TextField fullWidth label="Street Address" value={addr.street_address} onChange={handleAddrChange(idx,'street_address')} /></Grid>
                <Grid item xs={6}><TextField fullWidth label="Postal Code" value={addr.postal_code} onChange={handleAddrChange(idx,'postal_code')} /></Grid>
              </Grid>
              {form.addresses.length>1 && <Button color="error" onClick={()=>removeAddress(idx)}>Remove Address</Button>}
            </Box>
          ))}
          <Button onClick={addAddress}>Add Address</Button>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}

function SupplierDetailDialog({ open, supplier, onClose }) {
  if (!supplier) return null;
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Supplier Details</DialogTitle>
      <DialogContent dividers>
        <Typography>ID: {supplier.supplier_id}</Typography>
        <Typography>Name: {supplier.supplier_name}</Typography>
        <Typography>Status: {supplier.supplier_status}</Typography>
        <Typography>Contact: {supplier.contact_name} ({supplier.contact_email})</Typography>
        <Typography>Phone: {supplier.phone_number}</Typography>
        <Typography>Addresses:</Typography>
        {supplier.addresses.map((a, i) => (
          <Typography key={i} sx={{ pl:2 }}>Address {i+1}: {a.street_address}, {a.city}, {a.province}, {a.postal_code}</Typography>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
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
  const [filters, setFilters] = useState({ name:'', status:'' });
  const [filterActive, setFilterActive] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [editSupp, setEditSupp] = useState(null);
  const [detailSupp, setDetailSupp] = useState(null);
  const [delSupp, setDelSupp] = useState(null);

  useEffect(() => {
    fetch(`${BASE_URL}/`)
      .then(res => res.json())
      .then(data => { setSuppliers(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const displayed = !filterActive
    ? suppliers
    : suppliers.filter(s =>
        (filters.name === '' || s.supplier_name.toLowerCase().includes(filters.name.toLowerCase())) &&
        (filters.status === '' || s.supplier_status.toLowerCase().includes(filters.status.toLowerCase()))
      );

  const handleDelete = () => {
    fetch(`${BASE_URL}/${delSupp.supplier_id}/`, { method:'DELETE' })
      .then(() => setSuppliers(suppliers.filter(s => s.supplier_id !== delSupp.supplier_id)))
      .finally(() => setDelSupp(null));
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ p:4 }}>
      <Typography variant="h4" gutterBottom>Supplier Management</Typography>
      <Grid container spacing={2} sx={{ mb:2 }}>
        <Grid item xs={6} md={3}>
          <TextField label="Name" size="small" fullWidth value={filters.name} onChange={e=>setFilters(f=>({...f,name:e.target.value}))} />
        </Grid>
        <Grid item xs={6} md={3}>
          <TextField label="Status" size="small" fullWidth value={filters.status} onChange={e=>setFilters(f=>({...f,status:e.target.value}))} />
        </Grid>
        <Grid item xs={6} md={2}><Button fullWidth variant="outlined" onClick={()=>setFilterActive(true)}>Search</Button></Grid>
        <Grid item xs={6} md={2}><Button fullWidth variant="outlined" color="secondary" onClick={()=>{setFilters({name:'',status:''});setFilterActive(false);}}>Clear</Button></Grid>
        <Grid item xs={12} md={2}><Button fullWidth variant="contained" onClick={()=>setAddOpen(true)}>Add Supplier</Button></Grid>
      </Grid>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell><TableCell>Name</TableCell><TableCell>Status</TableCell>
              <TableCell>Contact Name</TableCell><TableCell>Contact Email</TableCell><TableCell>Phone</TableCell><TableCell>Actions</TableCell>
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
                    <Button size="small" onClick={()=>setDetailSupp(s)}>View</Button>
                    <Button size="small" onClick={()=>setEditSupp(s)}>Edit</Button>
                    <Button size="small" color="error" onClick={()=>setDelSupp(s)}>Delete</Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialogs */}
      <AddSupplierDialog open={addOpen} onClose={()=>setAddOpen(false)} onSave={s=>setSuppliers([...suppliers,s])} />
      <UpdateSupplierDialog open={!!editSupp} supplier={editSupp} onClose={()=>setEditSupp(null)} onSave={upd=>setSuppliers(suppliers.map(s=>s.supplier_id===upd.supplier_id?upd:s))} />
      <SupplierDetailDialog open={!!detailSupp} supplier={detailSupp} onClose={()=>setDetailSupp(null)} />
      <DeleteSupplierDialog open={!!delSupp} supplier={delSupp} onClose={()=>setDelSupp(null)} onConfirm={handleDelete} />
    </Box>
  );
}
