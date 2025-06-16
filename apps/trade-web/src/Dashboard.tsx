import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Container,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
} from "@mui/material";
import type { AuthUser } from "./Login";
import { getProfile } from "./api";
import "./Dashboard.css";

type DashboardProps = {
  user: AuthUser;
  onLogout: () => void;
};

type UserProfile = {
  firstName: string;
  lastName: string;
  username: string;
  avatar?: string;
};

export const Dashboard = ({ user, onLogout }: DashboardProps) => {
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getProfile(user.access_token)
      .then(setProfile)
      .catch((err) => console.warn(err));
  }, [user.access_token]);

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuItems = [
    "Inventario",
    "Lista de deseos",
    "Notificaciones",
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            aria-label="menu"
            sx={{ mr: 2, borderRadius: 1, width: 32, height: 32, border: "1px solid", color: "whitesmoke", p: 0.5 }}
            onClick={() => setOpen(!open)}
            className={open ? "hamburger open" : "hamburger"}
          >
            <span className="hamburger-line line1" />
            <span className="hamburger-line line2" />
            <span className="hamburger-line line3" />
          </IconButton>
          <Typography variant="h6" component="div">
            Dashboard
          </Typography>
          <Box sx={{ ml: "auto", display: "flex", alignItems: "center" }} onClick={handleMenuOpen} className="user-menu-button">
            <Avatar src={profile?.avatar} sx={{ width: 32, height: 32, mr: 1 }} />
            <Typography>{profile?.firstName || profile?.username}</Typography>
          </Box>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem onClick={handleMenuClose}>Perfil</MenuItem>
            <MenuItem
              onClick={() => {
                handleMenuClose();
                onLogout();
                navigate('/login', { replace: true });
              }}
            >
              Cerrar sesión
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{ sx: { top: 64, height: "calc(100% - 64px)" } }}
      >
        <Box sx={{ width: 250 }} role="presentation">
          <List>
            {menuItems.map((text) => (
              <ListItem key={text} disablePadding>
                <ListItemButton onClick={() => setOpen(false)}>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Container sx={{ mt: 2, flexGrow: 1 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <Typography>Your token: {user.access_token}</Typography>
      </Container>
    </Box>
  );
};
