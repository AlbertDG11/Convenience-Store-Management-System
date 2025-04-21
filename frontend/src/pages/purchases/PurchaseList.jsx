// ────────────────────────────────────────────────────────────
// src/pages/purchases/PurchaseList.jsx
// ────────────────────────────────────────────────────────────
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, CircularProgress, Typography
} from '@mui/material';
import {
  fetchPurchases,
  deletePurchase,
} from '../../api';

export default function PurchaseList() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = () => {
    setLoading(true);
    fetchPurchases()
      .then(res => setRows(Array.isArray(res.data) ? res.data : []))
      .finally(()=>setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = id => {
    if (!window.confirm('Delete this purchase?')) return;
    deletePurchase(id).then(load);
  };

  if (loading) return (
    <div style={{ textAlign:'center', marginTop:40 }}>
      <CircularProgress />
      <Typography sx={{ mt:2 }}>Loading…</Typography>
    </div>
  );

  return (
    <>
      <Button variant="contained" onClick={()=>navigate('/purchases/new')}>Add Purchase</Button>
      <TableContainer component={Paper} sx={{ mt:2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Supplier</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(r => (
              <TableRow key={r.id} hover>
                <TableCell>{r.id}</TableCell>
                <TableCell>{r.supplier_name || r.supplier_id}</TableCell>
                <TableCell>{r.purchase_date?.slice(0,10)}</TableCell>
                <TableCell>{r.total_amount}</TableCell>
                <TableCell align="right">
                  <Button size="small" onClick={()=>navigate(`/purchases/${r.id}/edit`)}>Edit</Button>
                  <Button size="small" color="error" onClick={()=>handleDelete(r.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}