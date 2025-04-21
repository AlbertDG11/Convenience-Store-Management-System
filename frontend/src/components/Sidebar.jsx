// src/components/Sidebar.jsx
// Permanent left‑hand navigation for all functional modules
// ------------------------------------------------------------------
import React from 'react';
import { Drawer, List, ListItemButton, ListItemText } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 220;

// Full menu based on project spec
const menu = [
  { text: 'Dashboard',           path: '/' },          // (optional landing)
  { text: 'Orders',              path: '/orders' },
  { text: 'Products',            path: '/products' },  // future module
  { text: 'Purchases',           path: '/purchases' },
  { text: 'Suppliers',           path: '/suppliers' }, // future module
  { text: 'Customers',           path: '/customers' },
  { text: 'Employees',           path: '/employees' }, // future module
  { text: 'Reports & Analytics', path: '/reports' },   // future module
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{ width: drawerWidth, flexShrink: 0,
            '& .MuiDrawer-paper': { width: drawerWidth } }}
    >
      <List>
        {menu.map(item => (
          <ListItemButton
            key={item.text}
            selected={pathname === item.path || pathname.startsWith(item.path + '/')}
            onClick={() => navigate(item.path)}
          >
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
}
