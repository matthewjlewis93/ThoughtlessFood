import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../Providers/ContextProvider";
import useLocalStorage from "../../useLocalStorage";

export default function Login({ setLogIn, setLogInConfirmed, setDisplayName }) {
  const { APIUrl, setCalorieGoal, setToastInfo } = useContext(AppContext);
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

    logData = await logData.json();

    if (logData.success && logData.existingUser) {
      // successful log in
      setLogIn(false);
      setLogInConfirmed(true);
      setDisplayName(username);
      setCalorieGoal(logData.goal);
      setToastInfo({
        toastActivated: true,
        toastMessage: `Welcome back, ${username}!`,
        positive: true,
      });
    } else if (logData.existingUser) {
      // user found but password incorrect
      setToastInfo({
        toastActivated: true,
        toastMessage: "Incorrect password.",
        positive: false,
      });
    } else {
      // username not found
      setToastInfo({
        toastActivated: true,
        toastMessage: "User not found. Please register.",
        positive: false,
      });
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
      setToastInfo({
        toastActivated: true,
        toastMessage: `Welcome, ${username}`,
        positive: true,
      });
    }
  };

  const guestLogin = async (e) => {
    e.preventDefault();
    let res = await fetch(`${APIUrl}auth/guest`, { method: "POST" });
    res = await res.json();
    setDisplayName(res.username);
    setLogIn(false);
    setLogInConfirmed(true);
    setToastInfo({
      toastActivated: true,
      toastMessage: "Welcome! Feel free to play around!",
      positive: true,
    });
  };

  return (
    <div id="login-page" className="popup-screen">
      <form className="popup-box">
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
        <br />
        <br />
        <p
          style={{
            margin: "0",
            fontSize: "14px",
            display: "flex",
            alignContent: "center",
            justifyContent: "center",
            textAlign: "left",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="32px"
            viewBox="0 -960 960 960"
            width="32px"
            fill="#DD1D1D"
          >
            <path d="M444-288h72v-240h-72v240Zm35.79-312q15.21 0 25.71-10.29t10.5-25.5q0-15.21-10.29-25.71t-25.5-10.5q-15.21 0-25.71 10.29t-10.5 25.5q0 15.21 10.29 25.71t25.5 10.5Zm.49 504Q401-96 331-126t-122.5-82.5Q156-261 126-330.96t-30-149.5Q96-560 126-629.5q30-69.5 82.5-122T330.96-834q69.96-30 149.5-30t149.04 30q69.5 30 122 82.5T834-629.28q30 69.73 30 149Q864-401 834-331t-82.5 122.5Q699-156 629.28-126q-69.73 30-149 30Zm-.28-72q130 0 221-91t91-221q0-130-91-221t-221-91q-130 0-221 91t-91 221q0 130 91 221t221 91Zm0-312Z" />
          </svg>
          Guest profiles and associated data are deleted after 24 hours.
        </p>
      </form>
    </div>
  );
}
