import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../Providers/ContextProvider";

export default function Login({ setLogIn, setLogInConfirmed }) {
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
        console.dir(logData);
        // localStorage.setItem('userInfo',JSON.stringify(logData));
        setLogIn(false);
        setLogInConfirmed(true);
        break;
      case 401: // user found but password incorrect
        break;
      case 500: // username not found
        break;
      default: // unknown error
        break;
    }
  };

  return (
    <div id="login-page">
      <h1>Login</h1> <br />
      <form>
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
        <button onClick={(e) => submitLogin(e)}>Login</button>
      </form>
    </div>
  );
}
