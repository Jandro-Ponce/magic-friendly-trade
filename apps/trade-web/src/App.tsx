import { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Container } from '@mui/material'
import './App.css'
import { Login, type AuthUser } from './Login'
import {Dashboard} from './Dashboard'

function App() {
  const [user, userSet] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem('token')
    return stored ? { access_token: stored } : null
  })

  useEffect(() => {
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
  }, [])

  useEffect(() => {
    if (user) {
      localStorage.setItem('token', user.access_token)
    } else {
      localStorage.removeItem('token')
    }
  }, [user])

  return (
    <Container>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={
              !user ? (
                <Login onUserLogin={(u) => userSet(u)} />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          <Route
            path="/dashboard"
            element={
              user ? <Dashboard user={user} /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/auth/verify-email"
            element={<Navigate to={user ? '/dashboard' : '/login'} replace />}
          />
          <Route
            path="*"
            element={<Navigate to={user ? '/dashboard' : '/login'} replace />}
          />
          <Route
            path="/"
            element={<Navigate to={user ? '/dashboard' : '/login'} replace />}
          />
        </Routes>
      </BrowserRouter>
    </Container>
  )
}

export default App
