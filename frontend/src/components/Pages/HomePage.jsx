import MacroHeadlines from "../MacroHeadlines/MacroHeadlines";
import AddButton from "../AddButton";
import SplitButton from "../SplitButton";
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
          gridTemplateColumns: "1fr 1fr",
          gap: "10px",
          marginTop: "15px",
        }}
      >
        <SplitButton title1={"Log Food"} title2={"View Log"} />
        <AddButton title={"Foods"} />
        <AddButton title={"Meals"} />
        <AddButton title={"See What Fits"} />
      </div>
    </div>
  );
}
