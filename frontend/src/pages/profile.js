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


function formatAddresses(addresses) {
  if (!Array.isArray(addresses)) return 'No address';
  return addresses.map((addr, idx) => (
    <div key={idx}>
      Address {idx + 1}: {addr.street_address}, {addr.city}, {addr.province}, {addr.post_code}
    </div>
  ));
}

function EmployeeDetail({ employeeId, open, onClose }) {
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    if (open && employeeId) {
      setLoading(true);
      fetch(`http://localhost:8000/employee/${employeeId}/`)
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