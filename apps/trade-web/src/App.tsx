import { useState } from 'react'
import { Container, Typography } from '@mui/material'
import './App.css'
import { Login, type AuthUser } from './Login'

function App() {
  const [user, userSet] = useState<AuthUser | null>(null)

  return (
    <Container>
      {user && <Typography>{JSON.stringify(user)}</Typography>}
      {!user && <Login onUserLogin={(user) => { userSet(user) }} />}
    </Container>
  )
}

export default App
