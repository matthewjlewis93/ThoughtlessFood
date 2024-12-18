import MacroHeadlines from "../MacroHeadlines/MacroHeadlines";
import AddButton from "../AddButton";
import SplitButton from "../SplitButton";
import Food from "../../assets/food.svg";
import Meal from "../../assets/meal.svg";
import { AppContext } from "../../Providers/ContextProvider.jsx";
import { useContext } from "react";

export default function HomePage() {
  const {activePage, updateActivePage} = useContext(AppContext);
  
  return (
    <div
      className={
        "container-box main-page " +
        (activePage === "HomePage" ? "active-home" : "inactive-home")
      }
    >
      <MacroHeadlines />
      <div
        className="container-box"
        style={{
          display: "grid",
          gridTemplateColumns: "165px 165px",
          gap: "10px",
          marginTop: "15px",
          justifyContent:"center"
        }}
      >
        <SplitButton title1={"Log Food"} title2={"View Log"} />
        <AddButton title={"Foods"} icon={Food} />
        <AddButton title={"Meals"} icon={Meal}/>
        <AddButton title={"See What Fits"} />
      </div>
    </div>
  );
}
