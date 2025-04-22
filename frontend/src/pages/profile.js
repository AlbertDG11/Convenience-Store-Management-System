import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Avatar,
  Typography,
  Grid,
  TextField,
  Button,
  IconButton,
  Box,
  Divider,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';


const ROLE_MAP = {
  0: 'Salesperson',
  1: 'Purchaseperson',
  2: 'Manager',
};

export default function Profile() {
  const [mode, setMode] = useState('view'); // 'view' | 'edit'
  const [employee, setEmployee] = useState(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone_number: '',
    role: null,
    addresses: []
  });
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });
  const employeeId = JSON.parse(localStorage.getItem('user') || '{}').id;
  const token = localStorage.getItem('token');

  useEffect(() => {
      setLoading(true);
      const token = localStorage.getItem('token');
      console.log("token", token);
      fetch(`http://localhost:8000/employee/${employeeId}/`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch employee details");
          return res.json();
        })
        .then((data) => {
          setEmployee(data);
          setError(null);
        })
        .catch((err) => {
          console.error(err);
          setError("Unable to load employee details");
        })
        .finally(() => {
          setLoading(false);
        });
  }, [employeeId]);

  if (loading) return <div>Loading…</div>;
  if (error)   return <div>{error}</div>;

  return (
    <div>
      {employee && (
        <Stack spacing={2}>
          <Typography><strong>Employee Id:</strong> {employee.employee_id}</Typography>
          <Typography><strong>Name:</strong> {employee.name}</Typography>
          <Typography><strong>Email:</strong> {employee.email}</Typography>
          <Typography><strong>Phone:</strong> {employee.phone_number}</Typography>
          <Typography><strong>Salary:</strong> ${employee.salary}</Typography>
          {<Typography><strong>Address:</strong> {formatAddresses(employee.addresses)}</Typography>}
          <Typography>
            <strong>Role:</strong>{' '}
            {getRole(employee.role)}
          </Typography>
          {employee.sales_target && (
            <Typography><strong>Sales Target:</strong> {employee.sales_target}</Typography>
          )}
          {employee.purchase_section && (
            <Typography><strong>Purchase Section:</strong> {employee.purchase_section}</Typography>
          )}
          {employee.management_level && (
            <Typography><strong>Management Level:</strong> {employee.management_level}</Typography>
          )}
          {employee.management && employee.management.length > 0 && (
            <Typography>
              <strong>Supervisor: </strong>
              {employee.management.map((m, idx) => (
                <div key={idx}>
                  ID: {m.employee_id}<br />
                  Name: {m.name}<br />
                  {m.role && <>Role: {getRole(m.role)}</>}
                </div>
              ))}
            </Typography>
          )}
        </Stack>
      )}
      <Button variant="contained" onClick={onEdit}>Edit</Button>
    </div>
  );
}

function EditProfile({ employeeId, onSave, onCancel }) {
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setLoading(true);
    fetch(`http://localhost:8000/employee/${employeeId}/`,
      {method: "GET",
        headers: { 
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json' 
      }})
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch employee details");
        return res.json();
      })
      .then((data) => {
        console.log("Loaded employee data:", data);
        setForm(data)
        setError(null);
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to load employee details");
      })
      .finally(() => {setLoading(false);});
  }, [employeeId]);

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setForm({ ...form, [field]: value });
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`http://localhost:8000/employee/${employeeId}/`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Update failed');
      const updated = await res.json();
      setEmployee(updated);
      setMode('view');
      setAlert({ open: true, message: 'Profile updated', severity: 'success' });
    } catch (err) {
      setAlert({ open: true, message: err.message, severity: 'error' });
    }
  };

  const handleCancel = () => {
    setForm({
      name: employee?.name || '',
      email: employee?.email || '',
      phone_number: employee?.phone_number || '',
      role: employee?.role,
      addresses: employee?.addresses || []
    });
    setMode('view');
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Card component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} elevation={4}>
        <CardHeader
          avatar={<Avatar sx={{ bgcolor: 'primary.main' }}>{employee?.name?.[0] || ''}</Avatar>}
          title={<Typography variant="h6">{mode === 'view' ? (employee?.name || 'Profile') : 'Edit Profile'}</Typography>}
          action={
            mode === 'view' ? (
              <IconButton onClick={() => setMode('edit')}>
                <EditIcon />
              </IconButton>
            ) : (
              <>
                <IconButton color="success" onClick={handleSave} disabled={!form.name.trim()}>
                  <SaveIcon />
                </IconButton>
                <IconButton color="error" onClick={handleCancel}>
                  <CancelIcon />
                </IconButton>
              </>
            )
          }
        />
        <Divider />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={form.name}
                onChange={handleChange('name')}
                disabled={mode === 'view'}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={form.email}
                onChange={handleChange('email')}
                disabled={mode === 'view'}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                name="phone_number"
                value={form.phone_number}
                onChange={handleChange('phone_number')}
                disabled={mode === 'view'}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Role"
                value={ROLE_MAP[form.role] || ''}
                disabled
              />
            </Grid>
            {mode === 'view' && (
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">Addresses:</Typography>
                {(employee?.addresses || []).length > 0 ? (
                  (employee.addresses || []).map((a, i) => (
                    <Typography key={i} variant="body2">
                      {i + 1}. {a.street_address || ''}, {a.city || ''}, {a.province || ''}, {a.post_code || ''}
                    </Typography>
                  ))
                ) : (
                  <Typography variant="body2">No addresses</Typography>
                )}
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={() => setAlert(a => ({ ...a, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={alert.severity} onClose={() => setAlert(a => ({ ...a, open: false }))}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
