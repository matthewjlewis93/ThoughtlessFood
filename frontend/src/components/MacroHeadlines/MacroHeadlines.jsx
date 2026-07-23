import react, { useEffect, useContext, useState } from "react";
import MacroChart from "./MacroChart";
import MacroLabel from "./MacroLabel";
import CalorieAvg from "./CalorieAvg";
import { AppContext } from "../../Providers/ContextProvider";

export default function MacroHeadlines({ logIn }) {
  const { macroTotals, updateMacros, APIUrl, activePage } =
    useContext(AppContext);
  const [currentlyActive, setCurrentlyActive] = useState(0);

  const fetchDay = async (searchedDay) => {
    let query = `${APIUrl}log?date=${searchedDay.getFullYear()}-${String(
      searchedDay.getMonth() + 1,
    ).padStart(2, "0")}-${String(searchedDay.getDate()).padStart(
      2,
      "0",
    )}&range=day`;
    const res = await fetch(query);
    const data = await res.json();

    let daysCalories = 0,
      daysProtein = 0,
      daysCarbs = 0,
      daysFat = 0;

    if (data.data) {
      for (const log of data.data) {
        daysCalories += log.calories;
        daysProtein += log.protein;
        daysCarbs += log.carbs;
        daysFat += log.fat;
      }
    }
    // setCaloriesTotal(cal);
    updateMacros({
      calories: daysCalories,
      protein: daysProtein,
      carbs: daysCarbs,
      fat: daysFat,
      date: searchedDay,
    });
  };

  useEffect(() => {
    fetchDay(new Date());
  }, [currentlyActive, logIn]);
  useEffect(() => {
    if (activePage === "HomePage") {
      setCurrentlyActive(currentlyActive + 1);
    }
  }, [activePage]);

  return (
    <div style={{display: "flex", alignItems: "center", width: "100%", justifyContent: "space-between", gap: "10px", marginTop: "8px"}}>
      <div
        className="container-box"
        style={{flexGrow: 1 }}
      >
        <MacroChart calorieValue={macroTotals.calories} />
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            borderTop: "1px solid #aaa",
            width: "100%",
          }}
        >
          <MacroLabel macro="fat" macroValue={macroTotals.fat} />
          <MacroLabel macro="carbs" macroValue={macroTotals.carbs} />
          <MacroLabel macro="protein" macroValue={macroTotals.protein} />
        </div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center", width: "fit-content", alignItems: "stretch" }}>
        <CalorieAvg days="7" />
        <CalorieAvg days="30" />
      </div>
    </div>
  );
}
