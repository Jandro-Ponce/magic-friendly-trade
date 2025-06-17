import { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
  Box,
  Link,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import FondoLogin from "./images/FondoLogin.png";
import "./App.css";
import { login } from "./api";

export type AuthUser = {
  access_token: string;
};

type LoginProps = {
  onUserLogin: (user: AuthUser) => void;
};

export const Login = ({ onUserLogin }: LoginProps) => {
  const [email, emailSet] = useState("");
  const [password, passwordSet] = useState("");
  const [error, errorSet] = useState("");

  async function onclickHandler() {
    errorSet("");
    try {
      const data = await login(email, password);
      onUserLogin(data);
    } catch (ex) {
      console.warn(ex);
      errorSet("Login failed");
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: `url(${FondoLogin})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      <Container sx={{ maxWidth: 300 }}>
        <Card sx={{ backgroundColor: "rgba(0,0,0,0.6)", width: "100%" }}>
          <CardContent>
          <Box display="flex" flexDirection="column" gap={2} width="100%">
            <Typography variant="h5" align="center">
              Login
            </Typography>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => emailSet(e.target.value.toLowerCase())}
              fullWidth
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => passwordSet(e.target.value)}
              fullWidth
            />
            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}
            <Button
              variant="contained"
              onClick={onclickHandler}
              disabled={!email || !password}
            >
              Continue
            </Button>
            <Box display="flex" justifyContent="space-between">
              <Link component={RouterLink} to="/forgot-password">
                He olvidado la contraseña
              </Link>
              <Link component={RouterLink} to="/register">Registrarme</Link>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  </Box>
  );
};
