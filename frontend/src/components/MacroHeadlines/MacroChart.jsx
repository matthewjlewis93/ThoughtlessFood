import { useEffect, useState } from "react";
// import { Chart } from "react-google-charts";
import HChart from "../HChart";

const goal = 1850;
const bgColor = document.body.style.backgroundColor;

export default function MacroChart({ calorieValue }) {

  return (
    <div style={{ minHeight: "100px", width: "100%", marginBottom: "5px" }}>
      <h5
        style={{ position: "relative",fontFamily:"sans-serif", left: "3%", margin: 0 }}
      >{`${calorieValue} calories today`}</h5>
      <HChart data={calorieValue} />
      <h5
        style={{ position: "relative",fontFamily:"sans-serif", textAlign: "right", margin: 0, right: "2.5%" }}
      >{ goal > calorieValue ? `${goal - calorieValue} calories remaining` : `${calorieValue - goal} calories over`}</h5>
    </div>
  );
}
