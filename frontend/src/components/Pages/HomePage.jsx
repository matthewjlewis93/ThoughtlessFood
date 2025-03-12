import MacroHeadlines from "../MacroHeadlines/MacroHeadlines";
import HomeButton from "../HomeButton";
import SplitButton from "../SplitButton";
import Food from "../../assets/food.svg";
import Meal from "../../assets/meal.svg";
import AddToLog from "../../assets/addlog.svg";
import ViewLog from "../../assets/viewlog.svg";
import SeeWhatFits from "../../assets/seewhatfits.svg";
import { AppContext } from "../../Providers/ContextProvider.jsx";
import { useContext, useEffect, useState } from "react";
import Login from "./Login.jsx";
import transitionControl from "../../transitionControl.js";
import UserSettings from "./UserSettings.jsx";
import useLocalStorage from "../../useLocalStorage.js";

export default function HomePage({ setLogInConfirmed }) {
  const { activePage, updateActivePage, setToastInfo, APIUrl, setCalorieGoal, theme } =
    useContext(AppContext);
  const [logIn, setLogIn] = useState(false);
  const [displayName, setDisplayName] = useLocalStorage("username", '');
  const [settingsDisplay, setSettingsDisplay] = useState(false);

  const verifyLogin = async () => {
    let response = await fetch(`${APIUrl}auth/verify`);
    response = await response.json();

    if (response.success) {
      setLogIn(false);
      setLogInConfirmed(true);
      setDisplayName(response.data.username);
      setCalorieGoal(response.data.goal);
    } else {
      setLogInConfirmed(false);
      setLogIn(true);
      transitionControl("homepage");
    }
  };

  useEffect(() => verifyLogin, []);

  return (
    <div id="homepage" className={"container-box main-page " + "active-home"}>
      {logIn && (
        <Login
          setLogIn={setLogIn}
          setLogInConfirmed={setLogInConfirmed}
          setDisplayName={setDisplayName}
        />
      )}
      {settingsDisplay && <UserSettings username={displayName} setSettingsDisplay={setSettingsDisplay} />}
      <h1>Thoughtless Food<p style={{margin: 0, fontSize: "8px", fontFamily: "sans", opacity: "75%" , marginLeft: "12px"}}>The no-thoughts-required macro tracker</p></h1>
      
      <div
        style={{
          display: "flex",
          gap: "10px",
          height: "18px",
          justifyContent: "right",
          marginRight: "5px",
        }}
      >
        {!logIn && (
          <>
            <p
              onClick={() => setSettingsDisplay(true)}
              style={{
                margin: 0,
                color: "var(--username-color)",
                fontFamily: "sans",
                fontSize: "15px",
                cursor: "pointer",
              }}
            >
              <u>{displayName}</u>
            </p>
            <p
              style={{
                margin: 0,
                color: "#DD1D1D",
                fontFamily: "sans",
                fontSize: "15px",
                cursor: "pointer",
              }}
              onClick={() => {
                fetch(`${APIUrl}auth/logout`, {
                  method: "POST",
                  credentials: "include",
                });
                setLogInConfirmed(false);
                setLogIn(true);
                setDisplayName("");
              }}
            >
              <u>Logout</u>
            </p>
          </>
        )}
      </div>
      <MacroHeadlines logIn={logIn} />
      <div
        className="container-box"
        style={{
          display: "grid",
          gridTemplateColumns: "165px 165px",
          gap: "7px",
          marginTop: "5px",
          justifyContent: "center",
        }}
      >
        <HomeButton title={"Foods"} icon={Food} pageID="foods" />
        <HomeButton title={"Meals"} icon={Meal} pageID="meals" />
        <SplitButton
          title1={"Log Food"}
          icon1={AddToLog}
          title2={"View Log"}
          icon2={ViewLog}
          pageID1={"log-food"}
          pageID2={"view-log"}
        />
        <HomeButton
          title={"See What Fits"}
          icon={SeeWhatFits}
          pageID="see-what-fits"
        />
      </div>
    </div>
  );
}
