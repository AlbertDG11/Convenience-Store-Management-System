// ────────────────────────────────────────────────────────────
// src/pages/orders/OrderList.jsx
// ────────────────────────────────────────────────────────────
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, CircularProgress, Typography
} from '@mui/material';
import {
  fetchOrders,
  deleteOrder,
} from '../../api';

export default function OrderList() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = () => {
    setLoading(true);
    fetchOrders()
      .then(res => setRows(Array.isArray(res.data) ? res.data : []))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = (id) => {
    if (!window.confirm('Delete this order?')) return;
    deleteOrder(id).then(load);
  };

  if (loading) {
    return (
      <div style={{ textAlign:'center', marginTop:40 }}>
        <CircularProgress />
        <Typography sx={{ mt:2 }}>Loading…</Typography>
      </div>
    );
  }

  return (
    <>
      <Button variant="contained" onClick={()=>navigate('/orders/new')}>Add Order</Button>
      <TableContainer component={Paper} sx={{ mt:2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Total Price</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow key={row.id} hover>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.customer_name || row.customer_id}</TableCell>
                <TableCell>{row.order_date?.slice(0,10)}</TableCell>
                <TableCell>{row.total_price}</TableCell>
                <TableCell align="right">
                  <Button size="small" onClick={()=>navigate(`/orders/${row.id}/edit`)}>Edit</Button>
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
