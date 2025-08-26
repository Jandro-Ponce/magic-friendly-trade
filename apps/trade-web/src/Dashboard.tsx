import { Box, Typography, Grid, Card, CardMedia, CardContent } from "@mui/material";
import { useEffect, useState } from "react";
import { getLatestListed } from "./api";
import type { AuthUser } from "./Login";
import FondoDashboard from "./images/FondoDashboard.png";
import NavBar from "./NavBar";

type DashboardProps = {
  user: AuthUser;
  onLogout: () => void;
};

export const Dashboard = ({ user, onLogout }: DashboardProps) => {
  const [listed, setListed] = useState<any[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    getLatestListed(user.access_token)
      .then(setListed)
      .catch(() => setError("No se pudieron cargar las últimas ofertas"));
  }, [user.access_token]);

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <NavBar user={user} onLogout={onLogout} />
      <Box
        sx={{
          flexGrow: 1,
          backgroundImage: `url(${FondoDashboard})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          p: 4,
        }}
      >
        {error && <Typography color="error">{error}</Typography>}
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={8}>
            <Typography variant="h5" gutterBottom>Últimas ofertas</Typography>
            <Grid container spacing={2}>
              {listed.map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item.id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ position: 'relative', width: '100%', pt: '150%', overflow: 'hidden' }}>
                      <CardMedia
                        component="img"
                        image={item.card?.imageUrl || "https://via.placeholder.com/300x420?text=Sin+Imagen"}
                        alt={item.card?.name}
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          background: '#fff',
                        }}
                      />
                    </Box>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle1" noWrap>{item.card?.name}</Typography>
                      <Typography variant="body2">Cantidad: {item.quantity}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
