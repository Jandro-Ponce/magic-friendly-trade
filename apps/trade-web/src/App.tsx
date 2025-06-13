import { useState, type PropsWithChildren } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function Logos(){
  return <><a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a></>
}
function App() {
  const [username, setName] = useState("")

  function onclickHandler(){
    alert("Login with name: " + username)
  }

  return (
    <>
      <div>
        <Logos />
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <input type='text' placeholder='Username' value={username} onChange={(e)=>setName(e.target.value.toLowerCase())}></input>
      <button onClick={ onclickHandler }>
          Login
      </button>
    </>
  )
}

export default App

