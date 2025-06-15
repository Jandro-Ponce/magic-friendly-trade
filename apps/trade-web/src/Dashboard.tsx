import { Typography, Container } from '@mui/material'
import { AuthUser } from './Login'

export default function Dashboard({ user }: { user: AuthUser }) {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography>Your token: {user.access_token}</Typography>
    </Container>
  )
}
