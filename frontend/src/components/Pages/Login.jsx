import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../Providers/ContextProvider";

export default function Login({ setLogIn, setLogInConfirmed, setDisplayName }) {
  const { APIUrl } = useContext(AppContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const submitLogin = async (e) => {
    e.preventDefault();
    let logData = await fetch(`${APIUrl}auth/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username, password: password }),
    });

    switch (logData.status) {
      case 200: // successful log in
        logData = await logData.json();
        setLogIn(false);
        setLogInConfirmed(true);
        setDisplayName(username);
        break;
      case 401: // user found but password incorrect
        break;
      case 500: // username not found
        break;
      default: // unknown error
        break;
    }
  };

  const submitRegister = async (e) => {
    e.preventDefault();
    let logData = await fetch(`${APIUrl}auth/register`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username, password: password }),
    });
    // console.log(logData);
    if (logData.status === 200) {
      setLogIn(false);
      setLogInConfirmed(true);
      setDisplayName(username);
    }
  };

  const guestLogin = async (e) => {
    e.preventDefault();
    let res = await fetch(`${APIUrl}auth/guest`, { method: "POST" });
    res = await res.json();
    setDisplayName(res.username);
    setLogIn(false);
    setLogInConfirmed(true);
  };

  return (
    <div id="login-page">
      <form>
        <h1 style={{ margin: 0 }}>Login</h1> <br />
        <label htmlFor="username">
          Username:
          <br />
          <input
            name="username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <br />
        <br />
        <label htmlFor="password">
          Password:
          <br />
          <input
            type="password"
            name="password"
            autoComplete="on"
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <br />
        <br />
        <div>
          <button onClick={(e) => submitLogin(e)}>Login</button>{" "}
          <button onClick={(e) => submitRegister(e)}>Register</button>
          <br />
          <hr />
        </div>
        <button onClick={(e) => guestLogin(e)}>Log In as Guest</button>
      </form>
    </div>
  );
}
