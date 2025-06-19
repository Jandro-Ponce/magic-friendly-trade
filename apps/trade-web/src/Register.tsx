import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import RegistroImg from "./images/Registro.png";
import Logo from "./images/Logo.png";
import "./App.css";
import { registerUser } from "./api";

export const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const disabled =
    !username ||
    !email ||
    !password ||
    !confirmPassword ||
    !firstName ||
    !lastName;

  async function handleRegister() {
    setError("");
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    try {
      await registerUser({ username, email, password, firstName, lastName });
      setMessage("Te enviamos un correo para verificar tu cuenta");
      setTimeout(() => navigate("/login?verifyEmail=1"), 500);
    } catch (ex) {
      console.warn(ex);
      setError("Registro fallido");
    }
  }

  return (
    <Box
      sx={{ minHeight: "100vh", width: "100%", display: "flex" }}
    >
      <Box
        sx={{
          flex: 1,
          backgroundImage: `url(${RegistroImg})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "left center",
        }}
      />
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.default",
        }}
      >
        <Box sx={{ width: 280, mx: "auto", p: 3 }}>
          <Box display="flex" flexDirection="column" gap={2} width="100%">
            <Box textAlign="center">
              <img src={Logo} alt="Magic Friendly Trade logo" style={{ maxWidth: "200px", width: "100%" }} />
            </Box>
            <TextField
              label="Nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
            />
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value.toLowerCase())}
              fullWidth
            />
            <TextField
              label="Contraseña"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((v) => !v)}
                      edge="end"
                      disableRipple
                      disableFocusRipple
                      sx={{ '&:focus': { outline: 'none' } }}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Repite la contraseña"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      edge="end"
                      disableRipple
                      disableFocusRipple
                      sx={{ '&:focus': { outline: 'none' } }}
                    >
                      {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Nombre"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              fullWidth
            />
            <TextField
              label="Apellido"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              fullWidth
            />
            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}
            {message && (
              <Typography color="primary" variant="body2">
                {message}
              </Typography>
            )}
            <Box display="flex" justifyContent="space-between" mt={1}>
              <Link component={RouterLink} to="/login" sx={{ fontSize: "0.8rem" }}>
                Atrás
              </Link>
              <Button variant="contained" onClick={handleRegister} disabled={disabled}>
                Registrarme
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Register;
