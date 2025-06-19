import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Container,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Logo from "./images/Logo.png";
import type { AuthUser } from "./Login";
import { getProfile, searchCards } from "./api";
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
  const [profileDrawerOpen, setProfileDrawerOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getProfile(user.access_token)
      .then(setProfile)
      .catch((err) => console.warn(err));
  }, [user.access_token]);

  const handleProfileDrawerClose = () => {
    setProfileDrawerOpen(false);
  };

  const handleSearch = async () => {
    if (!query.trim()) return;
    try {
      const data = await searchCards(query.trim());
      setResults(data.data || []);
    } catch (err) {
      console.warn(err);
    }
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
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={Logo}
              alt="Magic Friendly Trade logo"
              style={{ height: 48 }}
            />
            <TextField
              placeholder="Search cards"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleSearch}
                      edge="end"
                      disableRipple
                      disableFocusRipple
                      sx={{ "&:focus": { outline: "none" } }}
                    >
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ maxWidth: 400, width: "100%", ml: 2 }}
            />
          </Box>
          <Box
            sx={{ ml: "auto", display: "flex", alignItems: "center" }}
            onClick={() => setProfileDrawerOpen(true)}
            className="user-menu-button"
          >
            <Avatar src={profile?.avatar} sx={{ width: 32, height: 32, mr: 1 }} />
            <Typography>{profile?.username}</Typography>
          </Box>
          <Drawer
            anchor="right"
            open={profileDrawerOpen}
            onClose={handleProfileDrawerClose}
            PaperProps={{ sx: { top: 64, height: 'auto' } }}
            className="right-drawer"
          >
            <Box sx={{ width: 200 }} role="presentation">
              <List>
                <ListItem disablePadding>
                  <ListItemButton onClick={handleProfileDrawerClose}>
                    <ListItemText primary="Perfil" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => {
                      handleProfileDrawerClose();
                      onLogout();
                      navigate('/login', { replace: true });
                    }}
                  >
                    <ListItemText primary="Cerrar sesión" />
                  </ListItemButton>
                </ListItem>
              </List>
            </Box>
          </Drawer>
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
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 0.25,
          }}
        >
          {results.map((card) => {
            const imgSrc =
              card.image_uris?.normal ||
              card.card_faces?.[0]?.image_uris?.normal ||
              null;

              return (
                <Box
                  key={card.id}
                  sx={{
                    mb: 0.25,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    maxWidth: 240,
                    maxHeight: 336,
                    width: '100%',
                    overflow: 'hidden',
                  }}
                >
                {imgSrc && (
                  <Box
                    component="img"
                    src={imgSrc}
                    alt={card.name}
                    sx={{ display: 'block', maxWidth: 240, width: '100%' }}
                  />
                )}
              </Box>
            );
          })}
        </Box>
      </Container>
    </Box>
  );
};
