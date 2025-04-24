import React, { useEffect, useState, useCallback } from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Stack, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, Grid,
  Select, MenuItem, InputLabel, FormControl 
} from '@mui/material';


function getRole(roleCode) {
    var role
    if (roleCode === 0) {
        role = "Salesperson"
    } 
    else if (roleCode === 1) {
        role = "Purchase Person"
    }   
    else if (roleCode === 2) {
        role = "Manager"
    }  
    else {
        role = "Unknown"
    }
    return role
}


function AddEmployeeDialog({ open, onClose, onSave, managerId}) {
  const [form, setForm] = useState({});
  const [addresses, setAddresses] = useState([
    { province: '', city: '', street_address: '', post_code: '' }
  ]);

  const handleChange = (field) => (event) => {
    setForm({ ...form, [field]: event.target.value });
  };

  const handleAddressChange = (index, field) => (event) => {
    const updated = [...addresses];
    updated[index][field] = event.target.value;
    setAddresses(updated);
  };

  const handleAddAddress = () => {
    setAddresses([...addresses, { province: '', city: '', street_address: '', post_code: '' }]);
  };

  const handleRemoveAddress = (index) => {
    const updated = addresses.filter((_, i) => i !== index);
    setAddresses(updated);
  };

  const handleSubmit = () => {
    const payload = {
      ...form,
      supervisor: managerId,
      addresses: addresses,
    };
    const token = localStorage.getItem('token');
    fetch(`http://localhost:8000/employee/`, {
      method: "POST",
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
       },
      body: JSON.stringify(payload)
    })
    .then(async (res) => {
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Server returned error");
      }
      return data;
    })
    .then(data => {
      alert("Add Successfully");
      onSave(payload);
      setForm(null)
      onClose();
    })
    .catch(err => {
      console.error(err);
      alert("Failed to Add: " + err.message);
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Employee</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <TextField fullWidth label="Name" value={form.name || ''} onChange={handleChange('name')} />
          <TextField fullWidth label="Email" value={form.email || ''} onChange={handleChange('email')} />
          <TextField fullWidth label="Phone" value={form.phone_number || ''} onChange={handleChange('phone_number')} />
          <TextField fullWidth label="Salary" value={form.salary || ''} onChange={handleChange('salary')} />
          <TextField fullWidth label="Password" type="password" value={form.login_password || ''} onChange={handleChange('login_password')} />
          {addresses.map((addr, index) => (
            <Box key={index} sx={{ border: '1px solid #ccc', p: 2, borderRadius: 2 }}>
              <Typography variant="subtitle2">Address {index + 1}</Typography>
              <TextField fullWidth label="Province" value={addr.province} onChange={handleAddressChange(index, 'province')} sx={{ mt: 1 }} />
              <TextField fullWidth label="City" value={addr.city} onChange={handleAddressChange(index, 'city')} sx={{ mt: 1 }} />
              <TextField fullWidth label="Street Address" value={addr.street_address} onChange={handleAddressChange(index, 'street_address')} sx={{ mt: 1 }} />
              <TextField fullWidth label="Post Code" value={addr.post_code} onChange={handleAddressChange(index, 'post_code')} sx={{ mt: 1 }} />
              {addresses.length > 1 && (
                <Button color="error" onClick={() => handleRemoveAddress(index)} sx={{ mt: 1 }}>
                  ➖ Remove This Address
                </Button>
              )}
            </Box>
          ))}
          <Button onClick={handleAddAddress}>➕ Add Address</Button>
          <FormControl fullWidth>
            <InputLabel>Role</InputLabel>
            <Select
              value={form.role ?? ''}
              label="Role"
              onChange={handleChange('role')}
            >
              <MenuItem value={0}>Salesperson</MenuItem>
              <MenuItem value={1}>Purchase Person</MenuItem>
              <MenuItem value={2}>Manager</MenuItem>
            </Select>
          </FormControl>
          {form.role === 0 && (
            <TextField
              fullWidth
              label="Sales Target"
              value={form.sales_target || ''}
              onChange={handleChange('sales_target')}
              sx={{ mt: 2 }}
            />
          )}
          {form.role === 1 && (
            <TextField
              fullWidth
              label="Purchase Section"
              value={form.purchase_section || ''}
              onChange={handleChange('purchase_section')}
              sx={{ mt: 2 }}
            />
          )}

          {form.role === 2 && (
            <TextField
              fullWidth
              label="Management Level"
              value={form.management_level || ''}
              onChange={handleChange('management_level')}
              sx={{ mt: 2 }}
            />
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}

function AddSubordinateDialog({ open, managerId, onClose, onSave }) {
  const [subordinateId, setSubordinateId] = useState('');

  const handleSubmit = () => {
    const token = localStorage.getItem('token');
    fetch(`http://localhost:8000/employee/subordinate/${managerId}/`, {
      method: 'POST',
      
      headers: { 'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
       },
      body: JSON.stringify({ subordinate_id: parseInt(subordinateId, 10) }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Server error');
        return data;
      })
      .then(() => {
        onSave();
      })
      .catch((err) => {
        console.error(err);
        alert('Failed to add subordinate: ' + err.message);
      });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Subordinate Relationship</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <TextField fullWidth label="Subordinate Id" value={subordinateId} onChange={e => setSubordinateId(e.target.value)} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}

function formatAddresses(addresses) {
  if (!Array.isArray(addresses)) return 'No address';
  return addresses.map((addr, idx) => (
    <div key={idx}>
      Address {idx + 1}: {addr.street_address}, {addr.city}, {addr.province}, {addr.post_code}
    </div>
  ));
}

function EmployeeDetailDialog({ employeeId, open, onClose }) {
  const [employee, setEmployee] = useState(null);
  const [/*loading*/, setLoading] = useState(false);
  const [/*error*/, setError] = useState(null);

  useEffect(() => {
    if (open && employeeId) {
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
    } else {
      setEmployee(null);
    }
  }, [open, employeeId]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Employee Details</DialogTitle>
      <DialogContent dividers>
      {employee && (
        <Stack spacing={2}>
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
              <strong>Supervisor:</strong>
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}


function UpdateEmployeeDialog({ open, employeeId, onClose, onSave }) {
  const [form, setForm] = useState({});
  const [employee, setEmployee] = useState(null);
  const [/*loading*/, setLoading] = useState(false);
  const [/*error*/, setError] = useState(null);

  useEffect(() => {
    if (open && employeeId) {
      const token = localStorage.getItem('token');
      setLoading(true);
      fetch(`http://localhost:8000/employee/${employeeId}/`, 
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
          },
        })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch employee details");
          return res.json();
        })
        .then((data) => {
          console.log("Loaded employee data:", data);
          setEmployee(data);
          setForm(data)
          setError(null);
        })
        .catch((err) => {
          console.error(err);
          setError("Unable to load employee details");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setEmployee(null);
    }
  }, [open, employeeId]);

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
      province: '',
      city: '',
      street_address: '',
      post_code: '',
      employee_id: employeeId,
    }];
    setForm({ ...form, addresses: newAddresses });
  };
  

  const handleSubmit = () => {
    const token = localStorage.getItem('token');
    fetch(`http://localhost:8000/employee/${employeeId}/`,
      {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form),
        credentials: 'include'
      })
    .then(async res => {
      const text = await res.text();
      const data = text ? JSON.parse(text) : null;
    
      if (!res.ok) {
        throw new Error(data?.error || 'Update failed');
      }
    
      if (data?.warning) {
        alert("Updated with warning: " + data.warning);
      } else {
        alert("Update Successful");
      }
    
      onSave(form);
      onClose();
    })
    .catch(err => {
      console.error(err);
      alert("Error: " + err.message);
    });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Update Employee</DialogTitle>
      {employee && (
      <DialogContent>
        <TextField fullWidth label="Name" value={form.name || ''} onChange={handleChange('name')} sx={{ mt: 2 }} />
        <TextField fullWidth label="Email" value={form.email || ''} onChange={handleChange('email')} sx={{ mt: 2 }} />
        <TextField fullWidth label="Phone" value={form.phone_number || ''} onChange={handleChange('phone_number')} sx={{ mt: 2 }} />
        <TextField fullWidth label="Salary" type="number" value={form.salary || ''} onChange={handleChange('salary')} sx={{ mt: 2 }} />
        <TextField fullWidth label="Supervisor" value={form.supervisor || ''} onChange={handleChange('supervisor')} disabled sx={{ mt: 2 }} />
        <FormControl fullWidth sx={{ mt: 2 }} >
          <InputLabel>Role</InputLabel>
          <Select
            value={form.role ?? ''}
            label="Role"
            onChange={handleChange('role')}
          >
            <MenuItem value={0}>Salesperson</MenuItem>
            <MenuItem value={1}>Purchase Person</MenuItem>
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
              sx={{ mt: 2 }}
            />
          )}

          {form.role === 1 && (
            <TextField
              fullWidth
              label="Purchase Section"
              value={form.purchase_section || ''}
              onChange={handleChange('purchase_section')}
              sx={{ mt: 2 }}
            />
          )}

          {form.role === 2 && (
            <TextField
              fullWidth
              label="Management Level"
              value={form.management_level || ''}
              onChange={handleChange('management_level')}
              sx={{ mt: 2 }}
            />
          )}
      </DialogContent>)}
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}


function DeleteEmployeeDialog({ open, employee, onClose, onConfirm }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete employee "{employee?.name}"?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// Dialog to confirm and delete a subordinate
function DeleteSubordinateDialog({ open, managerId, subordinate, onClose, onConfirm }) {
  const handleDelete = () => {
    const token = localStorage.getItem('token');
    fetch(`http://localhost:8000/employee/subordinate/${managerId}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ subordinate_id: parseInt(subordinate.employee_id, 10) }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Delete failed');
        onConfirm();
      })
      .catch((err) => {
        console.error(err);
        alert('Failed to delete subordinate: ' + err.message);
      });
  };
  
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete the relationship with "{subordinate?.name}"?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleDelete} color="error" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}


function Subordinate(props) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, /*setError*/] = useState(null);
  const [detailEmployee, setDetailEmployee] = useState(null);
  const [editEmployee, setEditEmployee] = useState(null);
  const [addEmployee, setAddEmployee] = useState(null);
  const [addSubordinate, SetAddSubordinate] = useState(null);
  const [filters, setFilters] = useState({
    name: '',
    phone: '',
    role: '',
    minSalary: '',
    maxSalary: ''
  });
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [subordinateToDelete, setSubordinateToDelete] = useState(null);
  const [/*subordinates*/, setSubordinates] = useState([]);
  const managerId = JSON.parse(localStorage.getItem('user')).id;

  const loadSubordinates = useCallback(() => {
    setLoading(true);
    const token = localStorage.getItem('token');
    fetch(`http://localhost:8000/employee/subordinate/${managerId}/`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
      .then(res => res.json())
      .then((data) => {
        setSubordinates(data);
        setEmployees(data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [managerId]);

  useEffect(() => {
    if (managerId) loadSubordinates();
  }, [managerId, loadSubordinates]);

  const handleAddEmployeeSave = () => {
    loadSubordinates();
    setAddEmployee(null);
  };

  const handleAddSave = () => {
    loadSubordinates();
    SetAddSubordinate(null);
  };
  const handleDeleteSubordinateConfirm = () => {
    loadSubordinates();
    setSubordinateToDelete(null);
  };

  const [filterActive, setFilterActive] = useState(false);

  const filteredEmployees = !filterActive ? employees : employees.filter(emp => {
    const nameMatch = filters.name === '' || emp.name.toLowerCase().includes(filters.name.toLowerCase());
    const phoneMatch = filters.phone === '' || emp.phone_number.includes(filters.phone);
    const roleMatch = filters.role === '' || emp.role === parseInt(filters.role);
    const minSalaryMatch = filters.minSalary === '' || emp.salary >= parseFloat(filters.minSalary);
    const maxSalaryMatch = filters.maxSalary === '' || emp.salary <= parseFloat(filters.maxSalary);
    return nameMatch && phoneMatch && roleMatch && minSalaryMatch && maxSalaryMatch;
  });

  const handleConfirmDelete = () => {
    const token = localStorage.getItem('token');
    fetch(`http://localhost:8000/employee/${employeeToDelete.employee_id}/`, 
      {
        method: 'Delete',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        }
      })
      .then((res) => {
        if (res.ok) {
          setEmployees((prev) =>
            prev.filter((e) => e.employee_id !== employeeToDelete.employee_id)
          );
        }
      })
      .finally(() => setEmployeeToDelete(null));
  };

  if (loading) return <p>Loading employees...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>    
    <Box sx={{
      minHeight: '100vh',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      py: 6}}>
      <Box
        sx={{
          maxWidth: '93%',
          mx: 'auto',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderRadius: 4,
          p: 4,
          backdropFilter: 'blur(5px)',
        }}
        >

        <Typography variant="h3" sx={{ mt: 2, mb: 4, fontWeight: 'bold' }} gutterBottom align="center">Subordinate List</Typography>
        
        <Grid
          container
          spacing={2}
          sx={{ maxWidth: '95%', mx: 'auto', mb: 3 }}
        >
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              size="small"
              fullWidth
              label="Name"
              value={filters.name}
              onChange={(e) => setFilters({ ...filters, name: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              size="small"
              fullWidth
              label="Phone"
              value={filters.phone}
              onChange={(e) => setFilters({ ...filters, phone: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Role</InputLabel>
              <Select
                value={filters.role}
                label="Role"
                onChange={(e) => setFilters({ ...filters, role: e.target.value === '' ? '' : Number(e.target.value) })}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value={'0'}>Salesperson</MenuItem>
                <MenuItem value={'1'}>Purchase Person</MenuItem>
                <MenuItem value={'2'}>Manager</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              size="small"
              fullWidth
              label="Min Salary"
              type="number"
              value={filters.minSalary}
              onChange={(e) => setFilters({ ...filters, minSalary: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              size="small"
              fullWidth
              label="Max Salary"
              type="number"
              value={filters.maxSalary}
              onChange={(e) => setFilters({ ...filters, maxSalary: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => setFilterActive(true)}
            >
              Search
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Button
              fullWidth
              color="secondary"
              variant="outlined"
              onClick={() => {
                setFilters({ name: '', phone: '', role:'', minSalary: '', maxSalary: '' });
                setFilterActive(false);
              }}
            >
              Clear
            </Button>
          </Grid>
        </Grid>

        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead>
                <TableRow>
                <TableCell align="center"><strong>Id</strong></TableCell>
                  <TableCell align="center"><strong>Name</strong></TableCell>
                  <TableCell align="center"><strong>Email</strong></TableCell>
                  <TableCell align="center"><strong>Phone</strong></TableCell>
                  <TableCell align="center"><strong>Role</strong></TableCell>
                  <TableCell align="center"><strong>Actions</strong></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
              {filteredEmployees.map((emp) => (
                <TableRow key={emp.employee_id}>
                  <TableCell align="center">{emp.employee_id}</TableCell>
                  <TableCell align="center">{emp.name}</TableCell>
                  <TableCell align="center">{emp.email}</TableCell>
                  <TableCell align="center">{emp.phone_number}</TableCell>
                  <TableCell align="center">{getRole(emp.role)}</TableCell>
                  <TableCell align="center">
                    <Stack spacing={1} direction="column">
                      <Button size="small" variant="outlined" onClick={() => setDetailEmployee(emp.employee_id)}>View</Button>
                      <Button size="small" variant="outlined" onClick={() => setEditEmployee(emp.employee_id)}>Update</Button>
                      <Button size="small" variant="outlined" color="error" onClick={() => setEmployeeToDelete(emp)}>Delete</Button>
                      <Button size="small" variant="outlined" color="error" onClick={() => setSubordinateToDelete(emp)}>Delete Relationship</Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
            <Button variant="contained" onClick={() => setAddEmployee(true)}>Add Employee</Button>
            <Button variant="contained" onClick={() => SetAddSubordinate(true)}>Add Subordinate</Button>
        </Box>
      </Box>
    </Box>
    
    <AddEmployeeDialog
      managerId={managerId}
      open={!!addEmployee}
      onClose={() => setAddEmployee(null)}
      onSave={handleAddEmployeeSave}
    />

    <AddSubordinateDialog
      managerId={managerId}
      open={!!addSubordinate}
      onClose={() => SetAddSubordinate(null)}
      onSave={handleAddSave}
    />

    <EmployeeDetailDialog
      open={!!detailEmployee}
      employeeId={detailEmployee}
      onClose={() => setDetailEmployee(null)}
    />

    <UpdateEmployeeDialog
      open={!!editEmployee}
      employeeId={editEmployee}
      onClose={() => setEditEmployee(null)}
      onSave={(updatedEmp) => {
        setEmployees((prev) =>
          prev.map((e) => e.employee_id === updatedEmp.employee_id ? updatedEmp : e)
        );
      }}
    />

    <DeleteEmployeeDialog
      open={!!employeeToDelete}
      employee={employeeToDelete}
      onClose={() => setEmployeeToDelete(null)}
      onConfirm={handleConfirmDelete}
    />

    <DeleteSubordinateDialog
      managerId={managerId}
      open={!!subordinateToDelete}
      subordinate={subordinateToDelete}
      onClose={() => setSubordinateToDelete(null)}
      onConfirm={handleDeleteSubordinateConfirm}
    />
    </div>
  );
}

export default Subordinate;