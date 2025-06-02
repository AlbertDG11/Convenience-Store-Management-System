import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Stack, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, Grid,
  Select, MenuItem, InputLabel, FormControl } from '@mui/material';


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
      setLoading(true);
      const token = localStorage.getItem('token');
      fetch(`http://localhost:8000/employee/${employeeId}/`, {
        method: "GET",
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
          <Typography><strong>Id:</strong> {employee.employee_id}</Typography>
          <Typography><strong>Name:</strong> {employee.name}</Typography>
          <Typography><strong>Email:</strong> {employee.email}</Typography>
          <Typography><strong>Phone:</strong> {employee.phone_number}</Typography>
          {<Typography><strong>Address:</strong> {formatAddresses(employee.addresses)}</Typography>}
          <Typography><strong>Role:</strong>{' '}{getRole(employee.role)}</Typography>
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


function EmployeeContact() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detailEmployee, setDetailEmployee] = useState(null);
  const [filters, setFilters] = useState({
    name: '',
    phone: '',
    role: ''
  });
  
  useEffect(() => {
    const token = localStorage.getItem('token');
      fetch('http://localhost:8000/employee/', {
        method: "GET",
        headers: { 
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json' 
        },
      })
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
    const roleMatch = filters.role === '' || emp.role === parseInt(filters.role);
    return nameMatch && phoneMatch && roleMatch;
  });

  if (loading) return <p>Loading employees...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <Box sx={{
        minHeight: '100vh',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        py: 6}}>
        <Box sx={{ maxWidth: '93%', mx: 'auto', backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderRadius: 4, p: 4, backdropFilter: 'blur(5px)'}}>

          <Typography variant="h3" sx={{ mt: 2, mb: 4, fontWeight: 'bold' }} gutterBottom align="center">Contact List</Typography>
          
          <Grid container spacing={2} sx={{ maxWidth: '95%', mx: 'auto', mb: 3 }}>
            <Grid item xs={12} sm={6} md={2}>
              <TextField size="small" fullWidth label="Name" value={filters.name}
                onChange={(e) => setFilters({ ...filters, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField size="small" fullWidth label="Phone" value={filters.phone}
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
              <Button fullWidth variant="outlined" onClick={() => setFilterActive(true)}>
                Search
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Button fullWidth color="secondary" variant="outlined"
                onClick={() => {
                    setFilters({ name: '', phone: ''});
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
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>

      <EmployeeDetailDialog
        open={!!detailEmployee}
        employeeId={detailEmployee}
        onClose={() => setDetailEmployee(null)}
      />
    </div>
  );
}

export default EmployeeContact;