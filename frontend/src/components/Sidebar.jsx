// src/components/Sidebar.jsx
import React from 'react';
import { Drawer, List, ListItemButton, ListItemText } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 220;

// Updated menu without Dashboard
const menu = [
  { text: 'Profile',        path: '/profile' },
  { text: 'Customers',      path: '/customers' },
  { text: 'Orders',         path: '/orders' },
  { text: 'Purchases',      path: '/purchases' },
  { text: 'Suppliers',      path: '/supplier' },
  { text: 'Products',       path: '/product' },
  { text: 'Contact',        path: '/contact' },
  { text: 'Sales Report',   path: '/report/sales' },
  { text: 'Purchase Report',path: '/report/purchase' },
  { text: 'Inventory',      path: '/inventory' },
  { text: 'Subordinate',    path: '/subordinate' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{ width: drawerWidth, flexShrink: 0, '& .MuiDrawer-paper': { width: drawerWidth } }}
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
