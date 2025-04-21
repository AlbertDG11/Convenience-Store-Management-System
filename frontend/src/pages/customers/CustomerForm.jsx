// src/pages/customers/CustomerForm.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import SaveIcon from '@mui/icons-material/Save';
import {
  fetchCustomerById,
  createCustomer,
  updateCustomer,
  createCustomerAddress,
  updateCustomerAddress,
  deleteCustomerAddress,
} from '../../api';





export default function CustomerForm() {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    phone_number: '',
    email: '',
    addresses: [],
  });
  const [removedIds, setRemovedIds] = useState([]);

  useEffect(() => {
    if (!isNew) {
      fetchCustomerById(id).then(res => {
        setForm({
          name: res.data.name,
          phone_number: res.data.phone_number,
          email: res.data.email,
          addresses: res.data.address || [],
        });
      });
    }
  }, [id, isNew]);

  const handleField = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleAddrField = (i, e) => {
    const addrs = [...form.addresses];
    addrs[i][e.target.name] = e.target.value;
    setForm({ ...form, addresses: addrs });
  };

  const addAddress = () =>
    setForm({
      ...form,
      addresses: [
        ...form.addresses,
        { id: null, street_address: '', city: '', province: '', postal_code: '' }
      ]
    });

  const removeAddress = i => {
    const addr = form.addresses[i];
    if (addr.id) setRemovedIds([...removedIds, addr.id]);
    setForm({
      ...form,
      addresses: form.addresses.filter((_, idx) => idx !== i)
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const customerPayload = {
        name: form.name,
        phone_number: form.phone_number,
        email: form.email,
      };
      const resp = isNew
        ? await createCustomer(customerPayload)
        : await updateCustomer(id, customerPayload);

      const memberId = resp.data.membership_id;

      await Promise.all(removedIds.map(aid => deleteCustomerAddress(aid)));

      await Promise.all(
        form.addresses.map(addr => {
          const data = {
            membership: memberId,
            street_address: addr.street_address,
            city: addr.city,
            province: addr.province,
            postal_code: addr.postal_code,
          };
          return addr.id
            ? updateCustomerAddress(addr.id, data)
            : createCustomerAddress(data);
        })
      );

      navigate('/customers');
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <Card sx={{ maxWidth: 800, mx: 'auto', my: 4, borderRadius: 2, boxShadow: 3 }}>
      <CardHeader
        avatar={<Avatar><PersonIcon /></Avatar>}
        title={isNew ? 'Create Customer' : `Edit Customer #${id}`}
        titleTypographyProps={{ variant: 'h6' }}
        sx={{ backgroundColor: 'primary.light', color: 'white' }}
      />
      <CardContent>
        <form onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            {/* Customer info */}
            <Grid item xs={12} md={4}>
              <TextField
                label="Name"
                name="name"
                value={form.name}
                onChange={handleField}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Phone Number"
                name="phone_number"
                value={form.phone_number}
                onChange={handleField}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleField}
                fullWidth
                required
              />
            </Grid>

            {/* Add Address Button */}
            <Grid item xs={12} md={6} textAlign="right">
              <Button onClick={addAddress}>+ Add Address</Button>
            </Grid>

            {/* Address blocks */}
            {form.addresses.map((addr, i) => (
              <Card
                key={i}
                variant="outlined"
                sx={{ width: '100%', borderRadius: 1, p: 2, mb: 2, boxShadow: 1 }}
              >
                <Grid container alignItems="center" spacing={1} sx={{ mb: 1 }}>
                  <Grid item>
                    <Avatar sx={{ bgcolor: 'secondary.main', width: 24, height: 24 }}>
                      <HomeIcon fontSize="small" />
                    </Avatar>
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle2">Address #{i + 1}</Typography>
                  </Grid>
                </Grid>

                {/* Street + City */}
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={8}>
                    <TextField
                      label="Street Address"
                      name="street_address"
                      value={addr.street_address}
                      onChange={e => handleAddrField(i, e)}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      label="City"
                      name="city"
                      value={addr.city}
                      onChange={e => handleAddrField(i, e)}
                      fullWidth
                      required
                    />
                  </Grid>
                </Grid>

                {/* Province + Postal + Remove */}
                <Grid container spacing={2} alignItems="center" sx={{ mt: 1 }}>
                  <Grid item xs={12} md={5}>
                    <TextField
                      label="Province"
                      name="province"
                      value={addr.province}
                      onChange={e => handleAddrField(i, e)}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={5}>
                    <TextField
                      label="Postal Code"
                      name="postal_code"
                      value={addr.postal_code}
                      onChange={e => handleAddrField(i, e)}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={2} textAlign="right">
                    <Button
                      size="small"
                      color="error"
                      onClick={() => removeAddress(i)}
                    >
                      Remove
                    </Button>
                  </Grid>
                </Grid>
              </Card>
            ))}

            {/* Save Button */}
            <Grid item xs={12} container justifyContent="flex-end">
              <Button
                variant="contained"
                type="submit"
                startIcon={<SaveIcon />}
                sx={{ px: 4 }}
              >
                Save
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
}
