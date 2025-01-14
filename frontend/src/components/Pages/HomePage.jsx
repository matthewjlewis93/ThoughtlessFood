import MacroHeadlines from "../MacroHeadlines/MacroHeadlines";
import AddButton from "../AddButton";
import SplitButton from "../SplitButton";
import Food from "../../assets/food.svg";
import Meal from "../../assets/meal.svg";
import AddToLog from "../../assets/addlog.svg";
import ViewLog from "../../assets/viewlog.svg";
import SeeWhatFits from "../../assets/seewhatfits.svg";
import { AppContext } from "../../Providers/ContextProvider.jsx";
import { useContext, useState } from "react";
import SquareButton from "../SquareButton.jsx";
import Login from "./Login.jsx";

export default function HomePage() {
  const { activePage, updateActivePage, setToastInfo } = useContext(AppContext);
  const [logIn, setLogIn] = useState(true);
  return (
    <div id="homepage" className={"container-box main-page " + "active-home"}>
      {logIn && <Login setLogIn={setLogIn} />}
      <MacroHeadlines />
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
