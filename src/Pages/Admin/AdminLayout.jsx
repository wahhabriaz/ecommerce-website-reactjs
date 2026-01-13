import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  IconButton,
  Divider,
  Container,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const drawerWidth = 260;

export default function AdminLayout() {
  const [open, setOpen] = React.useState(false);
  const isMdUp = useMediaQuery("(min-width:900px)");
  const location = useLocation();

  const nav = [
    { label: "Products", to: "/admin/products" },
    { label: "New Product", to: "/admin/products/new" },
  ];

  const drawer = (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
        Admin Panel
      </Typography>
      <Typography variant="body2" sx={{ opacity: 0.7, mb: 2 }}>
        Manage products & inventory
      </Typography>
      <Divider sx={{ mb: 1 }} />
      <List disablePadding>
        {nav.map((item) => (
          <ListItemButton
            key={item.to}
            component={Link}
            to={item.to}
            selected={location.pathname === item.to}
            onClick={() => setOpen(false)}
            sx={{ borderRadius: 2, mb: 0.5 }}
          >
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AppBar position="fixed" elevation={0} sx={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <Toolbar sx={{ gap: 2 }}>
          {!isMdUp && (
            <IconButton color="inherit" edge="start" onClick={() => setOpen(true)}>
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Uomo Admin
          </Typography>
          <Box sx={{ flex: 1 }} />
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            Local Dev
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      {isMdUp ? (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
          }}
        >
          <Toolbar />
          {drawer}
        </Drawer>
      ) : (
        <Drawer
          open={open}
          onClose={() => setOpen(false)}
          sx={{
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
          }}
        >
          {drawer}
        </Drawer>
      )}

      {/* Content */}
      <Box component="main" sx={{ flex: 1 }}>
        <Toolbar />
        <Container maxWidth="lg" sx={{ py: 3 }}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
}
