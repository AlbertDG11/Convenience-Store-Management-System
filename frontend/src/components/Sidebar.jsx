// ────────────────────────────────────────────────────────────
// src/components/Sidebar.jsx
// ────────────────────────────────────────────────────────────
import React from 'react';
import { Drawer, List, ListItemButton, ListItemText } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const menu = [
  { text: 'Customers', path: '/customers' },
  // Future modules
  // { text: 'Orders',    path: '/orders'   },
  // { text: 'Products',  path: '/products' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <Drawer variant="permanent" sx={{ width: 220, '& .MuiDrawer-paper': { width: 220 } }}>
      <List>
        {menu.map(item => (
          <ListItemButton
            key={item.text}
            selected={pathname.startsWith(item.path)}
            onClick={() => navigate(item.path)}
          >
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
}
