import React, { useEffect, useState } from 'react'
import { Box, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Stack, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, Grid } from '@mui/material';


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


function AddEmployeeDialog({ open, onClose, onSave}) {
  const [form, setForm] = useState({});

  const handleChange = (field) => (event) => {
    setForm({...form, [field]: event.target.value})
  }

  const handleSubmit = () => {
    fetch(`http://localhost:8000/api/employee/add/`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    .then(res => res.json())
    .then(data => {
      alert("Add Successfully");
      onSave(form);
      onclose();
    })
    .catch(err => {
      alert('Failed to Add');
    })
  }
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Employee</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <TextField fullWidth label="Name" value={form.name || ''} onChange={handleChange('name')}></TextField>
          <TextField fullWidth label="Email" value={form.email || ''} onChange={handleChange('email')}></TextField>
          <TextField fullWidth label="Phone" value={form.phone_number || ''} onChange={handleChange('phone_number')}></TextField>
          <TextField fullWidth label="Salary" value={form.salary || ''} onChange={handleChange('salary')}></TextField>
        </Stack>
        
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>Save</Button>
      </DialogActions>
    </Dialog>
  )
}


function EmployeeDetailDialog({ employee, open, onClose }) {
    if (!employee) return null;
  
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Employee Details</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <Typography><strong>Name:</strong> {employee.name}</Typography>
            <Typography><strong>Email:</strong> {employee.email}</Typography>
            <Typography><strong>Phone:</strong> {employee.phone_number}</Typography>
            <Typography><strong>Salary:</strong> ${employee.salary}</Typography>
            <Typography><strong>Addresses:</strong> {employee.addresses}</Typography>
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
            {employee.management && (
              <Typography><strong>Management:</strong> {employee.management}</Typography>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }


function UpdateEmployeeDialog({ open, employee, onClose, onSave }) {
  const [form, setForm] = useState({});

  useEffect(() => {
    if (employee) setForm(employee);
  }, [employee]);

  const handleChange = (field) => (event) => {
    setForm({ ...form, [field]: event.target.value });
  };

  const handleSubmit = () => {
    fetch(`http://localhost:8000/api/employee/update/${form.employee_id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
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
      <DialogContent>
        <TextField fullWidth label="Name" value={form.name || ''} onChange={handleChange('name')} sx={{ mt: 2 }} />
        <TextField fullWidth label="Email" value={form.email || ''} onChange={handleChange('email')} sx={{ mt: 2 }} />
        <TextField fullWidth label="Phone" value={form.phone_number || ''} onChange={handleChange('phone_number')} sx={{ mt: 2 }} />
        <TextField fullWidth label="Salary" type="number" value={form.salary || ''} onChange={handleChange('salary')} sx={{ mt: 2 }} />
      </DialogContent>
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
        //fetch('/api/employee/list/')
        fetch('http://localhost:8000/employee/')
        .then((response) => {
        console.log("After aksing")
        console.log("After aksing2")
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
      fetch(`http://localhost:8000/api/employee/delete/${employeeToDelete.employee_id}/`, {
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
                        <Button size="small" variant="outlined" onClick={() => setDetailEmployee(emp)}>View</Button>
                        <Button size="small" variant="outlined" onClick={() => setEditEmployee(emp)}>Update</Button>
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
        employee={detailEmployee}
        onClose={() => setDetailEmployee(null)}
      />

      <UpdateEmployeeDialog
        open={!!editEmployee}
        employee={editEmployee}
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

export default Employee