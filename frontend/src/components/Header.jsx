import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();

  // 登出：移除 token 并跳转登录页
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        {/* 左侧标题 */}
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          便利店管理系统
        </Typography>
        {/* 右侧登出按钮 */}
        <Button color="inherit" onClick={handleLogout}>
          登出
        </Button>
      </Toolbar>
    </AppBar>
  );
}