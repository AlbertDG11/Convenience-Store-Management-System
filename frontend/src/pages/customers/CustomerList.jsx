import React, { useEffect, useState } from 'react';
import { fetchCustomers, deleteCustomer } from '../../api';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  const load = () => {
    setLoading(true);
    fetchCustomers().then(res => setCustomers(res.data)).catch(console.error).finally(()=>setLoading(false));
  };
  useEffect(load, []);
  const handleDelete = id => deleteCustomer(id).then(load).catch(err=>alert('删除失败:'+err.message));
  if (loading) return <p>加载中…</p>;
  return (
    <>
      <Button variant="contained" onClick={()=>nav('/customers/new')}>新增会员</Button>
      <TableContainer component={Paper} sx={{mt:2}}>
        <Table>
          <TableHead><TableRow>
            <TableCell>ID</TableCell><TableCell>姓名</TableCell><TableCell>电话</TableCell><TableCell>邮箱</TableCell><TableCell>操作</TableCell>
          </TableRow></TableHead>
          <TableBody>
            {customers.map(c=>(<TableRow key={c.id} hover>
              <TableCell>{c.id}</TableCell>
              <TableCell>{c.name}</TableCell>
              <TableCell>{c.phone_number}</TableCell>
              <TableCell>{c.email}</TableCell>
              <TableCell>
                <Button size="small" onClick={()=>nav(`/customers/${c.id}`)}>查看</Button>
                <Button size="small" onClick={()=>nav(`/customers/${c.id}/edit`)}>编辑</Button>
                <Button size="small" color="error" onClick={()=>handleDelete(c.id)}>删除</Button>
              </TableCell>
            </TableRow>))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
