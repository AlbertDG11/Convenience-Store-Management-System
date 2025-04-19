import React, { useEffect, useState } from 'react';
import { Paper, Typography, TextField, Button } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { createCustomer, fetchCustomerById, updateCustomer } from '../../api';

export default function CustomerForm() {
  const { id } = useParams();
  const isNew = !id;
  const [form, setForm] = useState({ name: '', phone_number: '', email: '' });
  const nav = useNavigate();

  useEffect(() => { if (!isNew) fetchCustomerById(id).then(res=>setForm(res.data)); }, [id]);
  const handleChange = e => setForm({...form, [e.target.name]: e.target.value});
  const handleSubmit = e => {
    e.preventDefault();
    const fn = isNew ? createCustomer : updateCustomer;
    fn(id, form).then(()=>nav('/customers')).catch(err=>alert('保存失败:'+err.message));
  };

  return (
    <Paper sx={{p:3}}>
      <Typography variant="h6">{isNew?'新建会员':`编辑会员 #${id}`}</Typography>
      <form onSubmit={handleSubmit} style={{marginTop:16}}>
        <TextField name="name" label="姓名" value={form.name} onChange={handleChange} fullWidth required sx={{mb:2}} />
        <TextField name="phone_number" label="电话" value={form.phone_number} onChange={handleChange} fullWidth required sx={{mb:2}} />
        <TextField name="email" label="邮箱" type="email" value={form.email} onChange={handleChange} fullWidth required sx={{mb:2}} />
        <Button variant="contained" type="submit">保存</Button>
      </form>
    </Paper>)
}
