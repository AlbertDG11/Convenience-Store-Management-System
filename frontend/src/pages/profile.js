import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Stack, TextField, 
  Select, MenuItem, InputLabel, FormControl, 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Paper, Grid, List, ListItem, ListItemText, Divider } from '@mui/material';

function getRole(roleCode) {
    var role
    if (roleCode === 0) {
        role = "Salesperson"
    } 
    else if (roleCode === 1) {
        role = "Purchaseperson"
    }   
    else if (roleCode === 2) {
        role = "Manager"
    }  
    else {
        role = "Unknown"
    }
    return role
}

function ChangePasswordDialog({ open, onClose, employeeId }) {
  const [step, setStep] = useState(1);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerifyOldPassword = () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    fetch('http://localhost:8000/employee/password/', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        id: employeeId,
        password: oldPassword })
    })
      .then(res => {
        if (!res.ok) throw new Error('Incorrect password');
        setStep(2);
        setError('');
      })
      .catch(() => setError('Incorrect current password'))
      .finally(() => setLoading(false));
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const token = localStorage.getItem('token');
    fetch('http://localhost:8000/employee/password/', {
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        id: employeeId,
        password: newPassword })
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to change password');
        alert('Password changed successfully');
        onClose();
      })
      .catch(() => setError('Failed to change password'));
  };

  const handleClose = () => {
    setStep(1);
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Change Password</DialogTitle>
      <DialogContent>
        {step === 1 ? (
          <>
            <TextField
              label="Current Password"
              type="password"
              fullWidth
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              sx={{ mt: 1 }}
            />
            {error && <div style={{ color: 'red' }}>{error}</div>}
          </>
        ) : (
          <>
            <TextField
              label="New Password"
              type="password"
              fullWidth
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              sx={{ mt: 1 }}
            />
            <TextField
              label="Confirm New Password"
              type="password"
              fullWidth
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              sx={{ mt: 1 }}
            />
            {error && <div style={{ color: 'red' }}>{error}</div>}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        {step === 1 ? (
          <Button onClick={handleVerifyOldPassword} disabled={loading} variant="contained">
            Verify
          </Button>
        ) : (
          <Button onClick={handleChangePassword} variant="contained">
            Save
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}


function ShowProfile({ employeeId, onEdit }) {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPwdDialog, setShowPwdDialog] = useState(false);

  useEffect(() => {
    if (!employeeId) return;
    setLoading(true);
    const token = localStorage.getItem('token');
    fetch(`http://localhost:8000/employee/${employeeId}/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to load employee details');
        return res.json();
      })
      .then(data => {
        setEmployee(data);
        setError(null);
      })
      .catch(err => {
        console.error(err);
        setError('Unable to load employee details');
      })
      .finally(() => setLoading(false));
  }, [employeeId]);

  if (loading) return <Typography sx={{ p: 2 }}>Loading…</Typography>;
  if (error) return <Typography color="error" sx={{ p: 2 }}>{error}</Typography>;

  return (
    <Box sx={{ backgroundColor: '#f8f9fa', minHeight: '100vh', py: 4 }}>
      <Paper
        variant="outlined"
        sx={{
          p: 3,
          backgroundColor: 'white',
          borderColor: 'grey.300',
          borderRadius: 2  // 比默认圆润
        }}
      >
        <Box
          sx={{
            mb: 2,
            py: 1,
            px: 2,
            backgroundColor: 'grey.100',
            borderRadius: 1
          }}
        >
          <Typography variant="h6" color="text.primary">Employee Profile</Typography>
        </Box>

        {employee && (
          <Grid container spacing={2}>
            {/* Left Column: Basic Details */}
            <Grid item xs={12} md={6}>
              <Stack spacing={1}>
                <Typography variant="subtitle2" color="text.secondary">ID</Typography>
                <Typography>{employee.employee_id}</Typography>

                <Typography variant="subtitle2" color="text.secondary" mt={2}>Name</Typography>
                <Typography>{employee.name}</Typography>

                <Typography variant="subtitle2" color="text.secondary" mt={2}>Email</Typography>
                <Typography>{employee.email}</Typography>

                <Typography variant="subtitle2" color="text.secondary" mt={2}>Phone</Typography>
                <Typography>{employee.phone_number}</Typography>

                <Typography variant="subtitle2" color="text.secondary" mt={2}>Salary</Typography>
                <Typography>${employee.salary}</Typography>
              </Stack>
            </Grid>

            {/* Right Column: Addresses & Role */}
            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Addresses</Typography>
                  {Array.isArray(employee.addresses) && employee.addresses.length > 0 ? (
                    <List dense>
                      {employee.addresses.map((addr, idx) => (
                        <ListItem key={idx} disableGutters>
                          <ListItemText
                            primary={`Address ${idx + 1}`}
                            secondary={`${addr.street_address}, ${addr.city}, ${addr.province}, ${addr.post_code}`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body2" color="text.secondary">No address</Typography>
                  )}
                </Box>

                <Divider />

                <Typography variant="subtitle2" color="text.secondary">Role</Typography>
                <Typography>{getRole(employee.role)}</Typography>

                {employee.sales_target != null && (
                  <>
                    <Divider />
                    <Typography variant="subtitle2" color="text.secondary">Sales Target</Typography>
                    <Typography>{employee.sales_target}</Typography>
                  </>
                )}

                {employee.purchase_section && (
                  <>
                    <Divider />
                    <Typography variant="subtitle2" color="text.secondary">Purchase Section</Typography>
                    <Typography>{employee.purchase_section}</Typography>
                  </>
                )}

                {employee.management_level != null && (
                  <>
                    <Divider />
                    <Typography variant="subtitle2" color="text.secondary">Management Level</Typography>
                    <Typography>{employee.management_level}</Typography>
                  </>
                )}

                {Array.isArray(employee.management) && employee.management.length > 0 && (
                  <>
                    <Divider />
                    <Typography variant="subtitle2" color="text.secondary">Supervisor</Typography>
                    <List dense>
                      {employee.management.map((m, idx) => (
                        <ListItem key={idx} disableGutters>
                          <ListItemText
                            primary={`ID: ${m.employee_id} — ${m.name}`}
                            secondary={m.role != null ? `Role: ${getRole(m.role)}` : null}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </>
                )}
              </Stack>
            </Grid>
          </Grid>
        )}

        <Divider sx={{ my: 3 }} />

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button variant="outlined" onClick={onEdit}>Edit</Button>
          <Button variant="contained" onClick={() => setShowPwdDialog(true)}>
            Change Password
          </Button>
        </Stack>
      </Paper>

      <ChangePasswordDialog
        open={showPwdDialog}
        onClose={() => setShowPwdDialog(false)}
        employeeId={employeeId}
      />
    </Box>
  );}

function EditProfile({ employeeId, onSave, onCancel }) {
  const [form, setForm] = useState({});
  const [/*loading*/, setLoading] = useState(false);
  const [/*error*/, setError]   = useState(null);

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

  const handleChange = (field) => (event) => {
    let value = event.target.value;
  
    if (field === 'salary') {
      value = parseFloat(value);
    }
  
    setForm({ ...form, [field]: value });
  };
  
  const handleAddressChange = (index, field) => (event) => {
    const newAddresses = [...form.addresses];
    newAddresses[index] = {
      ...newAddresses[index],
      [field]: event.target.value,
    };
    setForm({ ...form, addresses: newAddresses });
  };

  const handleRemoveAddress = (index) => {
    const newAddresses = [...form.addresses];
    newAddresses.splice(index, 1);
    setForm({ ...form, addresses: newAddresses });
  };
  
  const handleAddAddress = () => {
    const newAddresses = [...(form.addresses || []), {
      employee_id: employeeId,
      province: '',
      city: '',
      street_address: '',
      post_code: ''
    }];
    setForm({ ...form, addresses: newAddresses });
  };

  const handleSubmit = () => {
    console.log("Submitting form:", form);
    const token = localStorage.getItem('token');
    fetch(`http://localhost:8000/employee/${employeeId}/`, {
      method: 'PUT',
      headers: { 
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
       },
      body: JSON.stringify(form),
    })
    .then(async res => {
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Update failed');
      }
      alert('Update Successfully');
      onSave();
    })
    .catch(err => {
      alert(`Fail to Update: ${err.message}`);
      onSave();
    });
  };

  return (
    <div>
        <Box>
        <TextField fullWidth label="Name" value={form.name || ''} onChange={handleChange('name')} sx={{ mt: 2 }} />
        <TextField fullWidth label="Email" value={form.email || ''} onChange={handleChange('email')} sx={{ mt: 2 }} />
        <TextField fullWidth label="Phone" value={form.phone_number || ''} onChange={handleChange('phone_number')} sx={{ mt: 2 }} />
        <TextField fullWidth label="Salary" type="number" value={form.salary || ''} onChange={handleChange('salary')} disabled sx={{ mt: 2 }} />
        <TextField fullWidth label="Supervisor" value={form.supervisor || ''} onChange={handleChange('supervisor')} disabled sx={{ mt: 2 }} />
        <FormControl fullWidth sx={{ mt: 2 }} disabled>
          <InputLabel>Role</InputLabel>
          <Select
            value={form.role ?? ''}
            label="Role"
            onChange={handleChange('role')}
          >
            <MenuItem value={0}>Salesperson</MenuItem>
            <MenuItem value={1}>Purchase</MenuItem>
            <MenuItem value={2}>Manager</MenuItem>
          </Select>
        </FormControl>

        {(form.addresses || []).map((addr, index) => (
          <Box key={index} sx={{ border: '1px solid #ccc', p: 2, borderRadius: 2, mt: 2 }}>
            <Typography variant="subtitle2">Address {index + 1}</Typography>
            <TextField fullWidth label="Province" value={addr.province} onChange={handleAddressChange(index, 'province')} sx={{ mt: 1 }} />
            <TextField fullWidth label="City" value={addr.city} onChange={handleAddressChange(index, 'city')} sx={{ mt: 1 }} />
            <TextField fullWidth label="Street Address" value={addr.street_address} onChange={handleAddressChange(index, 'street_address')} sx={{ mt: 1 }} />
            <TextField fullWidth label="Post Code" value={addr.post_code} onChange={handleAddressChange(index, 'post_code')} sx={{ mt: 1 }} />
            {(form.addresses || []).length > 1 && (
              <Button color="error" onClick={() => handleRemoveAddress(index)} sx={{ mt: 1 }}>
                ➖ Remove This Address
              </Button>
            )}
          </Box>          
        ))}
        <Button onClick={handleAddAddress} sx={{ mt: 2 }}>
          ➕ Add Address
        </Button>
        {form.role === 0 && (
            <TextField
              fullWidth
              label="Sales Target"
              value={form.sales_target || ''}
              onChange={handleChange('sales_target')}
              sx={{ mt: 2 }} disabled
            />
          )}

          {form.role === 1 && (
            <TextField
              fullWidth
              label="Purchase Section"
              value={form.purchase_section || ''}
              onChange={handleChange('purchase_section')}
              sx={{ mt: 2 }} disabled
            />
          )}

          {form.role === 2 && (
            <TextField
              fullWidth
              label="Management Level"
              value={form.management_level || ''}
              onChange={handleChange('management_level')}
              sx={{ mt: 2 }} disabled
            />
          )}
          </Box>
          <Button onClick={onCancel} sx={{ mt: 2, mr: 1 }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>
            Save
          </Button>
        </div>
  );
}


function Profile(props) {
  const [mode, setMode] = useState('view');
  const employeeId = JSON.parse(localStorage.getItem('user')).id;

  return (
    <div>
      
      {mode === 'view' ? (
        <ShowProfile
          employeeId={employeeId} 
          onEdit={() => setMode('edit')} 
        />
      ) : (
        <div>
        <h2>Profile</h2>
        <EditProfile 
          employeeId={employeeId} 
          onSave={() => setMode('view')} 
          onCancel={() => setMode('view')} 
        />
        </div>
      )}
    </div>
  );
}

export default Profile;