import react, { useContext, useState } from "react";
import { AppContext } from "../../Providers/ContextProvider";
import CloseButton from "../CloseButton";

export default function SeeWhatFits() {
  const { activePage } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState("Foods");

  return (
    <div
      style={{}}
      className={
        "container-box main-page " +
        (activePage === "See What Fits" ? "active" : "inactive")
      }
    >
      <CloseButton functionList={[() => {}]} />

      <h1>
        See What Fits
        <hr />
      </h1>

      <div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
          <div>
            <h4
              onClick={() => setActiveTab("Foods")}
              style={{
                textAlign: "center",
                backgroundColor:
                  activeTab == "Foods" ? "#00000025" : "#00000008",
                borderRadius: "4px",
                padding: "6px",
                margin: "0",
                borderRight: activeTab == "Foods" ? "1px solid" : "0px",
                borderBottom: "1px solid",
              }}
            >
              Foods
            </h4>
          </div>
          <div>
            <h4
              onClick={() => setActiveTab("Meals")}
              style={{
                textAlign: "center",
                backgroundColor:
                  activeTab == "Meals" ? "#00000025" : "#00000008",
                borderRadius: "4px",
                padding: "6px",
                margin: "0",
                borderLeft: activeTab == "Meals" ? "1px solid" : "0px",
                borderBottom: "1px solid",
              }}
            >
              Meals
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
}
