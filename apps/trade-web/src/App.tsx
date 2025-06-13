import { useState } from 'react'
import './App.css'
import { Login, type AuthUser } from './Login'

function App() {
  const [user, userSet] = useState<AuthUser | null>(null)

  return (
    <>

      {
        user && JSON.stringify(user)
      }
      {
        !user && <Login onUserLogin={(user) => { userSet(user)}} />
      }

      
    </>
  )
}

export default App
