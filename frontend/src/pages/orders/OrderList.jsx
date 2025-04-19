import React, { useEffect, useState } from 'react';
import { fetchOrders, deleteOrder } from '../../api';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  const loadOrders = () => {
    setLoading(true);
    fetchOrders()
      .then(res => setOrders(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(loadOrders, []);

  const handleDelete = id => {
    deleteOrder(id)
      .then(() => loadOrders())
      .catch(err => alert('删除失败: ' + err.message));
  };

  if (loading) return <p>加载中…</p>;

  return (
    <>
      <Button variant="contained" color="primary" onClick={() => nav('/orders/new')}>新增订单</Button>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>客户</TableCell>
              <TableCell>总价</TableCell>
              <TableCell>日期</TableCell>
              <TableCell>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map(o => (
              <TableRow key={o.id} hover>
                <TableCell>{o.id}</TableCell>
                <TableCell>{o.customer_name}</TableCell>
                <TableCell>{o.total}</TableCell>
                <TableCell>{new Date(o.date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => nav(`/orders/${o.id}`)}>查看</Button>
                  <Button size="small" onClick={() => nav(`/orders/${o.id}/edit`)}>编辑</Button>
                  <Button size="small" color="error" onClick={() => handleDelete(o.id)}>删除</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
