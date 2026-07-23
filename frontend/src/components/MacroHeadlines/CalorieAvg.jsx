import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../Providers/ContextProvider";
import createDateString from "../../createDateString";

export default function CalorieAvg ({ days }) {
    const {APIUrl, macroTotals} = useContext(AppContext);
    const [averageCals, setAverageCals] = useState(0)
    const fetchAverageCalories = async () => {
        let logs = await fetch(`${APIUrl}log/?date=${createDateString(new Date())}&range=${days}`);
        logs = await logs.json();
        // console.log(await logs.json());

        setAverageCals(logs.data.calorieAverage);
    }
    useEffect(() => {fetchAverageCalories()}, [macroTotals]);
    return (
      <div
        style={{
          width: "90px",
          backgroundColor: "var(--macro-background)",
          padding: "5px",
          border: "2px solid var(--home-button)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around"
        }}
      >
        <h2 style={{ fontSize: "1.8rem", margin: "4px 0px", textAlign: "right" }}>
          {averageCals}
        </h2>
        <p style={{ fontSize: "0.6rem", margin: 0 }}>
          <span style={{fontSize: "1.2rem", paddingRight: "2px", fontWeight: "bold"}}>{days}</span> day cal avg.
        </p>
      </div>
    );
}