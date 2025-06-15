import { useEffect, useState } from 'react'
import { Container } from '@mui/material'
import './App.css'
import { Login, type AuthUser } from './Login'
import Dashboard from './Dashboard'

function App() {
  const [user, userSet] = useState<AuthUser | null>(null)

  useEffect(() => {
    if (!user) {
      const params = new URLSearchParams(window.location.search)
      const token = params.get('token')
      if (token) {
        userSet({ access_token: token })
        params.delete('token')
        const url = window.location.pathname
        const newSearch = params.toString()
        const newUrl = newSearch ? `${url}?${newSearch}` : url
        window.history.replaceState({}, '', newUrl)
      }
    }
  }, [user])

  return (
    <Container>
      {user && <Dashboard user={user} />}
      {!user && <Login onUserLogin={(user) => { userSet(user) }} />}
    </Container>
  )
}

export default App
