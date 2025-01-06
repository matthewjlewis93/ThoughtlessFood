import react, { useEffect, useContext, useState } from "react";
import { AppContext } from "../../Providers/ContextProvider";
import CloseButton from "../CloseButton";

export default function SeeWhatFits() {
  const { activePage, macroTotals } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState("Foods");

  useEffect(() => {}, [macroTotals]);

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
                backgroundColor: activeTab == "Foods" ? "#ffffff" : "#00000030",
                borderTopLeftRadius: "4px",
                borderTopRightRadius: "4px",
                padding: "6px",
                margin: "0",
                borderLeft: "1px solid #00000080",
                borderRight:
                  activeTab == "Foods" ? "1px solid" : "1px solid #00000005",
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
                backgroundColor: activeTab == "Meals" ? "#ffffff" : "#00000030",
                borderTopLeftRadius: "4px",
                borderTopRightRadius: "4px",
                padding: "6px",
                margin: "0",
                borderRight: "1px solid #00000080",
                borderLeft:
                  activeTab == "Meals" ? "1px solid" : "1px solid #00000005",
                borderBottom: "1px solid",
              }}
            >
              Meals
            </h4>
          </div>
        </div>
        <div>{activeTab === "Foods" ? <p></p> : <p></p>}</div>
      </div>
    </div>
  );
}
