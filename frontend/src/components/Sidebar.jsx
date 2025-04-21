// src/components/Sidebar.jsx
import React from 'react';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Typography
} from '@mui/material';
import {
  Person as ProfileIcon,
  People as CustomerIcon,
  ShoppingCart as OrderIcon,
  Receipt as PurchaseIcon,
  Store as SupplierIcon,
  Category as ProductIcon,
  ContactMail as ContactIcon,
  BarChart as SalesReportIcon,
  AccountTree as PurchaseReportIcon,
  Inventory2 as InventoryIcon,
  SupervisorAccount as SubordinateIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 240;

const menuItems = [
  { text: 'Profile', path: '/profile', icon: <ProfileIcon /> },
  { text: 'Customers', path: '/customers', icon: <CustomerIcon /> },
  { text: 'Orders', path: '/orders', icon: <OrderIcon /> },
  { text: 'Purchases', path: '/purchases', icon: <PurchaseIcon /> },
  { text: 'Suppliers', path: '/supplier', icon: <SupplierIcon /> },
  { text: 'Products', path: '/product', icon: <ProductIcon /> },
  { text: 'Contact', path: '/contact', icon: <ContactIcon /> },
  { text: 'Sales Report', path: '/report/sales', icon: <SalesReportIcon /> },
  { text: 'Purchase Report', path: '/report/purchase', icon: <PurchaseReportIcon /> },
  { text: 'Inventory', path: '/inventory', icon: <InventoryIcon /> },
  { text: 'Subordinate', path: '/subordinate', icon: <SubordinateIcon /> }
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  // Retrieve logged in user's name from localStorage (or default)
  const username = localStorage.getItem('username') || 'User';

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: 'primary.main',
          color: 'white'
        }
      }}
    >
      <Toolbar />
      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
      <List>
        {menuItems.map(item => (
          <ListItemButton
            key={item.text}
            selected={pathname === item.path || pathname.startsWith(item.path + '/')}
            onClick={() => navigate(item.path)}
            sx={{
              '&.Mui-selected': { backgroundColor: 'rgba(255,255,255,0.25)' },
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.15)' }
            }}
          >
            <ListItemIcon sx={{ color: 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
}