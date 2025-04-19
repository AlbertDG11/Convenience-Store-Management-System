// src/components/PurchaseList.jsx
import React, { useEffect, useState } from 'react';
import { fetchPurchases, deletePurchase } from '../../api';
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

export default function PurchaseList() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadPurchases = () => {
    setLoading(true);
    fetchPurchases()
      .then((res) => setPurchases(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(loadPurchases, []);

  const handleDelete = (id) => {
    deletePurchase(id)
      .then(() => loadPurchases())
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
        onClick={() => navigate('/purchases/new')}
      >
        Add Purchase
      </Button>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Supplier</TableCell>
              <TableCell>Total Cost</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {purchases.map((p) => (
              <TableRow key={p.id} hover>
                <TableCell>{p.id}</TableCell>
                <TableCell>{p.supplier_name}</TableCell>
                <TableCell>{p.total_cost}</TableCell>
                <TableCell>{new Date(p.date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => navigate(`/purchases/${p.id}`)}>
                    View
                  </Button>
                  <Button size="small" onClick={() => navigate(`/purchases/${p.id}/edit`)}>
                    Edit
                  </Button>
                  <Button size="small" color="error" onClick={() => handleDelete(p.id)}>
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
