// ────────────────────────────────────────────────────────────
// src/pages/customers/CustomerList.jsx
// ────────────────────────────────────────────────────────────

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, CircularProgress, Typography
} from '@mui/material';
import {
  fetchCustomers,
  deleteCustomer,
} from '../../api';

export default function CustomerList() {
  const [rows, setRows]   = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadData = () => {
    setLoading(true);
    fetchCustomers()
      .then(res => setRows(Array.isArray(res.data) ? res.data : []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(loadData, []);

  const handleDelete = (id) => {
    if (!window.confirm('Delete this customer?')) return;
    deleteCustomer(id).then(loadData).catch(err => alert(err.message));
  };

  if (loading) {
    return (
      <div style={{textAlign:'center',marginTop:40}}>
        <CircularProgress/>
        <Typography sx={{mt:2}}>Loading…</Typography>
      </div>
    );
  }

  return (
    <>
      <Button variant="contained" onClick={()=>navigate('/customers/new')}>
        Add Customer
      </Button>

      <TableContainer component={Paper} sx={{mt:2}}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Email</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow key={row.id} hover>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.phone_number}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell align="right">
                  <Button size="small" onClick={()=>navigate(`/customers/${row.id}/edit`)}>Edit</Button>
                  <Button size="small" color="error" onClick={()=>handleDelete(row.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
