import { useState } from 'react'
import {
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
  Box,
} from '@mui/material'
import './App.css'
import { login } from './api'


export type AuthUser = {
  access_token: string
}

type LoginProps = {
  onUserLogin: (user: AuthUser) => void
}

export function Login(props: LoginProps) {
  const [email, emailSet] = useState("");
  const [password, passwordSet] = useState("");
  const [error, errorSet] = useState("");

  async function onclickHandler() {
    errorSet("")
    try {
      const data = await login(email, password);
      props.onUserLogin(data)
    } catch (ex) {
      console.warn(ex)
      errorSet("Login failed");
    }
  }

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        Login
      </Typography>
      <Card variant="outlined">
        <CardContent>
          <Box display="flex" flexDirection="column" gap={2}>
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
          </Box>
        </CardContent>
      </Card>
    </Container>
  )
}
