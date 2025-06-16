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
import type { AuthUser } from "./Login";
import "./Dashboard.css";

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
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => setOpen(true)}
            className={open ? "hamburger open" : "hamburger"}
          >
            <span className="hamburger-line line1" />
            <span className="hamburger-line line2" />
            <span className="hamburger-line line3" />
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
      <Container sx={{ mt: 2, flexGrow: 1 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <Typography>Your token: {user.access_token}</Typography>
      </Container>
    </Box>
  );
};
