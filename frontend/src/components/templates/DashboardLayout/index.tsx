'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  AppBar, Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  Toolbar, Typography,
} from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import WarningIcon from '@mui/icons-material/Warning';
import CategoryIcon from '@mui/icons-material/Category';
import LogoutIcon from '@mui/icons-material/Logout';
import Button from '@/components/atoms/Button';
import { useAuth } from '@/context/AuthContext';

const drawerWidth = 240;

const navItems = [
  { href: '/products', label: 'Productos', icon: <CategoryIcon /> },
  { href: '/inventory', label: 'Inventario', icon: <InventoryIcon /> },
  { href: '/alerts', label: 'Alertas', icon: <WarningIcon /> },
  { href: '/purchase-orders', label: 'Órdenes de compra', icon: <ShoppingCartIcon /> },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>MercadoExpress Inventario</Typography>
          <Typography variant="body2" sx={{ mr: 2 }}>{user?.nombre}</Typography>
          <Button color="inherit" startIcon={<LogoutIcon />} onClick={logout}>Salir</Button>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', mt: 8 },
        }}
      >
        <List>
          {navItems.map((item) => (
            <ListItemButton
              key={item.href}
              component={Link}
              href={item.href}
              selected={pathname.startsWith(item.href)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8, minWidth: 0 }}>
        <Box sx={{ maxWidth: 1200, mx: 'auto', width: '100%' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
