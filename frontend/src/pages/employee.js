import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Stack, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, Grid,
  Select, MenuItem, InputLabel, FormControl} from '@mui/material';


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


function AddEmployeeDialog({ open, onClose, onSave }) {
  const token = localStorage.getItem('token');
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
      addresses: addresses,
    };

    fetch(`http://localhost:8000/employee/`, {
      method: "POST",
      headers: { 
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json' 
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
      onSave(payload);  // 或 data，看后端返回结构
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
          <TextField fullWidth label="Supervisor" value={form.supervisor || ''} onChange={handleChange('supervisor')} />
          <FormControl fullWidth>
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (open && employeeId) {
      setLoading(true);

      fetch(`http://localhost:8000/employee/${employeeId}/`,
        {method: "POST",
        headers: { 
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json' 
        }}
      )
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
      setEmployee(null); // reset when closed
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (open && employeeId) {
      setLoading(true);
      fetch(`http://localhost:8000/employee/${employeeId}/`,
        {method: "POST",
        headers: { 
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json' 
      }}
      )
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
      setEmployee(null); // reset when closed
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
    console.log("Submitting form:", form);
    fetch(`http://localhost:8000/employee/${employeeId}/`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
       },
      body: JSON.stringify(form),
    })
    .then(res => res.json())
    .then(data => {
      alert('Update Successfully');
      onSave(form);
      onClose();
    })
    .catch(err => {
      alert('Fail to Update');
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
        <TextField fullWidth label="Supervisor" value={form.supervisor || ''} onChange={handleChange('supervisor')} sx={{ mt: 2 }} />
        <FormControl fullWidth sx={{ mt: 2 }} >
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


// function UpdateEmployeeDialog({ open, employeeId, onClose, onSave }) {
//   const [form, setForm] = useState({});
//   const [employee, setEmployee] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (open && employeeId) {
//       setLoading(true);
//       fetch(`http://localhost:8000/employee/${employeeId}/`)
//         .then((res) => {
//           if (!res.ok) throw new Error("Failed to fetch employee details");
//           return res.json();
//         })
//         .then((data) => {
//           setEmployee(data);
//           setError(null);
//         })
//         .catch((err) => {
//           console.error(err);
//           setError("Unable to load employee details");
//         })
//         .finally(() => {
//           setLoading(false);
//         });
//     } else {
//       setEmployee(null); // reset when closed
//     }
//   }, [open, employeeId]);

//   // useEffect(() => {
//   //   if (employee) setForm(employee);
//   // }, [employee]);

//   const handleChange = (field) => (event) => {
//     setForm({ ...form, [field]: event.target.value });
//   };

//   const handleSubmit = () => {
//     fetch(`http://localhost:8000/api/employee/update/${form.employee_id}/`, {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(form),
//     })
//     .then(res => res.json())
//     .then(data => {
//       alert('Update Successfully');
//       onSave(form);
//       onClose();
//     })
//     .catch(err => {
//       alert('Fail to Update');
//     });
//   };

//   return (
//     <Dialog open={open} onClose={onClose}>
//       <DialogTitle>Update Employee</DialogTitle>
//       <DialogContent>
//         <TextField fullWidth label="Name" value={form.name || ''} onChange={handleChange('name')} sx={{ mt: 2 }} />
//         <TextField fullWidth label="Email" value={form.email || ''} onChange={handleChange('email')} sx={{ mt: 2 }} />
//         <TextField fullWidth label="Phone" value={form.phone_number || ''} onChange={handleChange('phone_number')} sx={{ mt: 2 }} />
//         <TextField fullWidth label="Salary" type="number" value={form.salary || ''} onChange={handleChange('salary')} sx={{ mt: 2 }} />
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose}>Cancel</Button>
//         <Button variant="contained" onClick={handleSubmit}>Save</Button>
//       </DialogActions>
//     </Dialog>
//   );
// }


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


function Employee(props) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detailEmployee, setDetailEmployee] = useState(null);
  const [editEmployee, setEditEmployee] = useState(null);
  const [addEmployee, setAddEmployee] = useState(null);
  const [filters, setFilters] = useState({
    name: '',
    phone: '',
    minSalary: '',
    maxSalary: '',
  });
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  
  useEffect(() => {
      fetch('http://localhost:8000/employee/')
      .then((response) => {
      if (!response.ok) {
          throw new Error('Network response was not OK');
      }
      return response.json();
      })
      .then((data) => {
          console.log("Received:", data);
          setEmployees(data);
          setLoading(false);
      })
      .catch((err) => {
      setError(err.message);
      setLoading(false);
      });
  }, []);

  const [filterActive, setFilterActive] = useState(false);

  const filteredEmployees = !filterActive ? employees : employees.filter(emp => {
    const nameMatch = filters.name === '' || emp.name.toLowerCase().includes(filters.name.toLowerCase());
    const phoneMatch = filters.phone === '' || emp.phone_number.includes(filters.phone);
    const minSalaryMatch = filters.minSalary === '' || emp.salary >= parseFloat(filters.minSalary);
    const maxSalaryMatch = filters.maxSalary === '' || emp.salary <= parseFloat(filters.maxSalary);
    return nameMatch && phoneMatch && minSalaryMatch && maxSalaryMatch;
  });

  const handleConfirmDelete = () => {
    fetch(`http://localhost:8000/employee/${employeeToDelete.employee_id}/`, {
      method: 'DELETE',
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
      backgroundImage: 'url(https://source.unsplash.com/random/1600x900?business)',
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

        <Typography variant="h3" sx={{ mt: 2, mb: 4, fontWeight: 'bold' }} gutterBottom align="center">Employee List</Typography>
        
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
                setFilters({ name: '', phone: '', minSalary: '', maxSalary: '' });
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
                  <TableCell align="center"><strong>Name</strong></TableCell>
                  <TableCell align="center"><strong>Email</strong></TableCell>
                  <TableCell align="center"><strong>Phone</strong></TableCell>
                  <TableCell align="center"><strong>Salary</strong></TableCell>
                  <TableCell align="center"><strong>Role</strong></TableCell>
                  <TableCell align="center"><strong>Actions</strong></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
              {filteredEmployees.map((emp) => (
                <TableRow key={emp.employee_id}>
                  <TableCell align="center">{emp.name}</TableCell>
                  <TableCell align="center">{emp.email}</TableCell>
                  <TableCell align="center">{emp.phone_number}</TableCell>
                  <TableCell align="center">${emp.salary}</TableCell>
                  <TableCell align="center">{getRole(emp.role)}</TableCell>
                  <TableCell align="center">
                    <Stack spacing={1} direction="column">
                      <Button size="small" variant="outlined" onClick={() => setDetailEmployee(emp.employee_id)}>View</Button>
                      <Button size="small" variant="outlined" onClick={() => setEditEmployee(emp.employee_id)}>Update</Button>
                      <Button size="small" variant="outlined" color="error" onClick={() => setEmployeeToDelete(emp)}>Delete</Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
            <Button variant="contained" onClick={() => setAddEmployee(true)}>Add Employee</Button>
        </Box>
      </Box>
    </Box>
    
    <AddEmployeeDialog
      open={!!addEmployee}
      onClose={() => setAddEmployee(null)}
      onSave={(newEmp) => setEmployees([...employees, newEmp])}
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
    </div>
  );
}

export default Employee;