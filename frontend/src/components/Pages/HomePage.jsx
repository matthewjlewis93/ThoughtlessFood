import MacroHeadlines from "../MacroHeadlines/MacroHeadlines";
import AddButton from "../AddButton";
import SplitButton from "../SplitButton";
import Food from "../../assets/food.svg";
import Meal from "../../assets/meal.svg";
import AddToLog from "../../assets/addlog.svg";
import ViewLog from "../../assets/viewlog.svg";
import SeeWhatFits from "../../assets/seewhatfits.svg";
import { AppContext } from "../../Providers/ContextProvider.jsx";
import { useContext, useEffect, useState } from "react";
import SquareButton from "../SquareButton.jsx";
import Login from "./Login.jsx";
import transitionControl from "../../transitionControl.js";
import FDALookup from "../FDALookup.jsx";

export default function HomePage({ setLogInConfirmed }) {
  const { activePage, updateActivePage, setToastInfo, APIUrl } =
    useContext(AppContext);
  const [logIn, setLogIn] = useState(false);
  const [displayName, setDisplayName] = useState("");

  const verifyLogin = async () => {
    let response = await fetch(`${APIUrl}auth/verify`);
    response = await response.json();

    if (response.success) {
      setLogIn(false);
      setLogInConfirmed(true);
      setDisplayName(response.data.username);
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
      <h1>Thoughtless Food</h1>
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
              style={{
                margin: 0,
                color: "#0C335A",
                fontFamily: "sans",
                fontSize: "15px",
                cursor: "default"
                // cursor: "pointer" uncomment for user settings
              }}
            >
              {displayName}
            </p>
            <p
              style={{
                margin: 0,
                color: "#DD1D1D",
                fontFamily: "sans",
                fontSize: "15px",
                cursor: "pointer"
              }}
              onClick={() => {
                fetch(`${APIUrl}auth/logout`, {
                  method: "POST",
                  credentials: "include",
                });
                setLogInConfirmed(false);
                setLogIn(true);
                setDisplayName('');
              }}
            >
              Logout
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
          gap: "10px",
          marginTop: "15px",
          justifyContent: "center",
        }}
      >
        <AddButton title={"Foods"} icon={Food} pageID="foods" />
        <AddButton title={"Meals"} icon={Meal} pageID="meals" />
        <SplitButton
          title1={"Log Food"}
          icon1={AddToLog}
          title2={"View Log"}
          icon2={ViewLog}
          pageID1={"log-food"}
          pageID2={"view-log"}
        />
        <AddButton
          title={"See What Fits"}
          icon={SeeWhatFits}
          pageID="see-what-fits"
        />
      </div>
    </div>
  );
}
