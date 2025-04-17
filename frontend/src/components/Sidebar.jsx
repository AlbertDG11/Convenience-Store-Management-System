import React from 'react';
import { List, ListItemButton, ListItemText } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

// 配置侧边菜单项：文本 + 路径
const menuItems = [
  { text: '仪表盘', path: '/' },
  { text: '订单管理', path: '/orders' },
  { text: '产品管理', path: '/products' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <List component="nav" sx={{ width: 200, borderRight: '1px solid #ddd' }}>
      {menuItems.map(item => (
        <ListItemButton
          key={item.path}
          selected={location.pathname === item.path}
          onClick={() => navigate(item.path)}
        >
          <ListItemText primary={item.text} />
        </ListItemButton>
      ))}
    </List>
  );
}