// src/components/Sidebar.jsx
import React from 'react';
import { Drawer, List, ListItem, ListItemText } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const menuItems = [
  { text: 'Dashboard', path: '/' },
  { text: 'Order Management', path: '/orders' },
  { text: 'Product Management', path: '/products' },
  { text: 'Purchase Management', path: '/purchases' },
  { text: 'Supplier Management', path: '/suppliers' },
  { text: 'Customer Management', path: '/customers' },
  { text: 'Employee Management', path: '/employees' },
  { text: 'Report Analysis', path: '/reports' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Drawer variant="permanent" sx={{ width: 240, flexShrink: 0 }}>
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            selected={location.pathname === item.path}
            onClick={() => navigate(item.path)}
          >
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
