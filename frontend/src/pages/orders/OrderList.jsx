// src/components/OrderList.jsx
import React, { useEffect, useState } from 'react';
import { fetchOrders, deleteOrder } from '../../api';
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

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadOrders = () => {
    setLoading(true);
    fetchOrders()
      .then((res) => setOrders(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(loadOrders, []);

  const handleDelete = (id) => {
    deleteOrder(id)
      .then(() => loadOrders())
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
        onClick={() => navigate('/orders/new')}
      >
        Add Order
      </Button>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id} hover>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.customer_name}</TableCell>
                <TableCell>{order.total}</TableCell>
                <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    onClick={() => navigate(`/orders/${order.id}`)}
                  >
                    View
                  </Button>
                  <Button
                    size="small"
                    onClick={() => navigate(`/orders/${order.id}/edit`)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleDelete(order.id)}
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