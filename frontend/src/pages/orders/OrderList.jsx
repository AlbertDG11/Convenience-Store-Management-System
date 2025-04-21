// src/pages/orders/OrderList.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchOrders, cancelOrder, fetchProducts, fetchCustomers } from '../../api';
import {
  Table, TableHead, TableBody, TableRow, TableCell,
  TableContainer, Paper, Button, IconButton, Collapse, Box,
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp, Edit, Cancel } from '@mui/icons-material';

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [openRow, setOpenRow] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts().then(res => setProducts(res.data)).catch(console.error);
    fetchCustomers().then(res => setCustomers(res.data)).catch(console.error);
    loadOrders();
  }, []);

  const loadOrders = () => {
    fetchOrders().then(res => setOrders(res.data)).catch(console.error);
  };

  const handleCancel = id => {
    cancelOrder(id)
      .then(() => loadOrders())
      .catch(console.error);
  };

  const getProduct = pid => products.find(p => p.product_id === pid) || {};
  const getCustomer = cid => customers.find(c => c.id === cid) || null;

  return (
    <TableContainer component={Paper} sx={{ mt: 2, p: 2 }}>
      <Button variant="contained" onClick={() => navigate('/orders/new')} sx={{ mb: 2 }}>
        New Order
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Order ID</TableCell>
            <TableCell>Create Time</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell>Total Price</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map(order => {
            const cust = getCustomer(order.member);
            return (
              <React.Fragment key={order.order_id}>
                <TableRow>
                  <TableCell>
                    <IconButton size="small" onClick={() => setOpenRow(openRow === order.order_id ? null : order.order_id)}>
                      {openRow === order.order_id ? <KeyboardArrowUp/> : <KeyboardArrowDown/>}
                    </IconButton>
                  </TableCell>
                  <TableCell>{order.order_id}</TableCell>
                  <TableCell>{order.create_time.replace('Z','').replace('T',' ')}</TableCell>
                  <TableCell>{order.delivery_address}</TableCell>
                  <TableCell>{order.order_status}</TableCell>
                  <TableCell>{cust ? cust.name : 'N/A'}</TableCell>
                  <TableCell>{order.total_price}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => navigate(`/orders/${order.order_id}/edit`)}><Edit/></IconButton>
                    <IconButton onClick={() => handleCancel(order.order_id)}><Cancel/></IconButton>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                    <Collapse in={openRow === order.order_id} timeout="auto" unmountOnExit>
                      <Box margin={1}>
                        <strong>Items:</strong>
                        {order.items.map(item => {
                          const prod = getProduct(item.product);
                          return (
                            <Box key={item.id} sx={{ ml: 2 }}>
                              ID: {item.id}, Name: {item.product_name}, Qty: {item.quantity_ordered}, Price: {prod.price ?? 'N/A'}
                            </Box>
                          );
                        })}
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}