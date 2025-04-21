// src/pages/customers/CustomerList.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem
} from '@mui/material';
import {
  fetchCustomers,
  deleteCustomer,
  deleteCustomerAddress,
  fetchCustomerById,
  fetchAddressesByMembershipId
} from '../../api';

export default function CustomerList() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedName, setSelectedName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetchCustomers()
      .then(res => setRows(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleViewAddresses = async (membershipId, name) => {
    try {
      const res = await fetchAddressesByMembershipId(membershipId);
      setAddresses(res.data || []);
      setSelectedName(name);
      setOpenDialog(true);
    } catch (err) {
      alert(`Error fetching addresses: ${err.message}`);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setAddresses([]);
  };

  const handleDelete = async membershipId => {
    if (!window.confirm('Delete this customer and all addresses?')) return;
    try {
      const res = await fetchCustomerById(membershipId);
      const existing = res.data.address || [];
      await Promise.all(existing.map(a => deleteCustomerAddress(a.id)));
      await deleteCustomer(membershipId);
      fetchCustomers().then(res => setRows(res.data || []));
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: 40 }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading…</Typography>
      </div>
    );
  }

  return (
    <>
      <Button variant="contained" onClick={() => navigate('/customers/new')}>
        Add Customer
      </Button>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Addresses</TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Email</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map(row => (
              <TableRow key={row.membership_id} hover>
                {/* Show Addresses button on the left */}
                <TableCell>
                  <Button
                    size="small"
                    onClick={() => handleViewAddresses(row.membership_id, row.name)}
                  >
                    Show Addresses
                  </Button>
                </TableCell>
                <TableCell>{row.membership_id}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.phone_number}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell align="right">
                  <Button
                    size="small"
                    onClick={() => navigate(`/customers/${row.membership_id}/edit`)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleDelete(row.membership_id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>{`Addresses for ${selectedName}`}</DialogTitle>
        <DialogContent>
          {addresses.length === 0 ? (
            <Typography>No addresses found.</Typography>
          ) : (
            <List>
              {addresses.map(addr => (
                <ListItem key={addr.id}>
                  {`${addr.street_address}, ${addr.city}, ${addr.province}, ${addr.postal_code}`}
                </ListItem>
              ))}
            </List>
          )}
          <Button onClick={handleCloseDialog} sx={{ mt: 2 }}>
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
