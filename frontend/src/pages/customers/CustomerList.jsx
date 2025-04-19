// src/components/CustomerList.jsx
import React, { useEffect, useState } from 'react';
import { fetchCustomers, deleteCustomer } from '../../api';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Typography
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadCustomers = () => {
    setLoading(true);
    fetchCustomers()
      .then((res) => setCustomers(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(loadCustomers, []);

  const handleDelete = (id) => {
    deleteCustomer(id)
      .then(() => loadCustomers())
      .catch((err) => alert('Delete failed: ' + err.message));
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: 40 }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading...
        </Typography>
      </div>
    );
  }

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate('/customers/new')}
      >
        Add Customer
      </Button>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id} hover>
                <TableCell>{customer.id}</TableCell>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.phone_number}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    onClick={() => navigate(`/customers/${customer.id}`)}
                  >
                    View
                  </Button>
                  <Button
                    size="small"
                    onClick={() => navigate(`/customers/${customer.id}/edit`)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleDelete(customer.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
