import { useState } from "react";
import "./App.css";
import { login } from "./api";


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
    <>
      <h1>Login</h1>
      <div className="card">
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => emailSet(e.target.value.toLowerCase())}
          ></input>
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => passwordSet(e.target.value)}
          ></input>
          {
            error && <span className="text-error">{error}</span>
          }
          
          <button onClick={onclickHandler} disabled={!email || !password}>
            Continue
          </button>
        </div>
      </div>
    </>
  );
}
