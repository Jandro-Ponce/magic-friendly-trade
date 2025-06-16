import { useState } from "react";
import {
  Typography,
  Container,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import type { AuthUser } from "./Login";

type DashboardProps = {
  user: AuthUser;
};

export const Dashboard = ({ user }: DashboardProps) => {
  const [open, setOpen] = useState(false);

  const menuItems = [
    "Inventario",
    "Lista de deseos",
    "Notificaciones",
  ];

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => setOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div">
            Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
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
      <Container sx={{ mt: 2 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <Typography>Your token: {user.access_token}</Typography>
      </Container>
    </Box>
  );
};
