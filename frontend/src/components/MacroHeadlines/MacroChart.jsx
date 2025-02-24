import { useEffect, useState, useContext } from "react";
import HChart from "../HChart";
import { AppContext } from "../../Providers/ContextProvider";

export default function MacroChart({ calorieValue }) {
  const { calorieGoal } = useContext(AppContext);
  return (
    <div style={{ minHeight: "100px", width: "100%", marginBottom: "5px" }}>
      <h5
        style={{
          position: "relative",
          fontFamily: "sans-serif",
          left: "3%",
          margin: 0,
        }}
      ><span style={{fontSize:"18px"}}>{calorieValue}</span> calories today</h5>
      <HChart data={calorieValue} />
      <h5
        style={{
          position: "relative",
          fontFamily: "sans-serif",
          textAlign: "right",
          margin: 0,
          right: "2.5%",
        }}
      >
        <span style={{fontSize: "18px"}}>{calorieGoal > calorieValue
          ? calorieGoal - calorieValue : calorieValue - calorieGoal}</span>
        {calorieGoal > calorieValue
          ? " calories remaining"
          : " calories over"}
      </h5>
    </div>
  );
}
