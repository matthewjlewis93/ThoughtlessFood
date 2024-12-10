import { useEffect, useState } from "react";
import { Chart } from "react-google-charts";

const goal = 1850;
const bgColor = document.body.style.backgroundColor;

export default function MacroChart({ calorieValue }) {
  const [calorieDifference, setCalorieDifference] = useState(0);
  const [ticks, setTicks] = useState([]);
  const [calorieLabel, setCalorieLabel] = useState("");
  const [differenceLabel, setDifferenceLabel] = useState("");

  const setLabels = () => {
    setCalorieDifference(goal - calorieValue);

    if (calorieDifference > 0) {
      setCalorieLabel(`${calorieValue} Calories`);
      setDifferenceLabel(`${calorieDifference} cals left`);
    }
  };
  const createTicks = () => {
    let ticklabels = [goal];
    let tickMax = calorieValue > goal ? calorieValue : goal;
    for (let i = 0; i < Math.floor(tickMax / 500) + 2; i++) {
      ticklabels.push(i * 500);
    }
    setTicks(ticklabels);
  };

  useEffect(() => {
    setLabels();
    createTicks();
  }, []);

  const options = {
    animation: {
      duration: 150,
      easing: "out",
      startup: true,
    },
    backgroundColor: "none",
    legend: "none",
    tooltip: { trigger: "none" },
    bar: { groupWidth: 35 },
    chart: {
      width: "100%",
    },
    hAxis: { ticks: ticks },
    diff: {
      newData: { widthFactor: 0.6 },
      oldData: { color: "#eee" },
    },
    title: `${goal - calorieValue} calories remaining`,
    titlePosition: "out",
    enableInteractivity: false,
    colors: ["#38E5BA"],
  };
  const goalData = [
    ["A", "Goal"],
    ["Goal", goal],
  ];

  const totalData = [
    ["A", "Today"],
    [`${calorieValue} / \n${goal} `, calorieValue],
  ];
  const diffData = {
    old: goalData,
    new: totalData,
  };

  return (
    <>
      <Chart
        chartType="BarChart"
        diffdata={diffData}
        options={options}
        width="100%"
        height="100px"
      />
    </>
  );
}
