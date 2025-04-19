import React, { useEffect, useState } from 'react';
import { fetchPurchases, deletePurchase } from '../../api';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function PurchaseList() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  const load = () => {
    setLoading(true);
    fetchPurchases()
      .then(res => setPurchases(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);
  const handleDelete = id => deletePurchase(id).then(load).catch(err => alert('删除失败: '+err.message));
  if (loading) return <p>加载中…</p>;
  return (
    <>
      <Button variant="contained" onClick={() => nav('/purchases/new')}>新增采购</Button>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>供应商</TableCell>
              <TableCell>总成本</TableCell>
              <TableCell>日期</TableCell>
              <TableCell>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {purchases.map(p => (
              <TableRow key={p.id} hover>
                <TableCell>{p.id}</TableCell>
                <TableCell>{p.supplier_name}</TableCell>
                <TableCell>{p.total_cost}</TableCell>
                <TableCell>{new Date(p.date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => nav(`/purchases/${p.id}`)}>查看</Button>
                  <Button size="small" onClick={() => nav(`/purchases/${p.id}/edit`)}>编辑</Button>
                  <Button size="small" color="error" onClick={() => handleDelete(p.id)}>删除</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}