import react, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../Providers/ContextProvider";
import FoodDisplay from "../FoodDisplay";
import CloseButton from "../CloseButton";
import createDateString from "../../createDateString";
import DatePicker from "../DatePicker";

export default function ViewLog() {
  const { activePage, APIUrl, macroTotals } = useContext(AppContext);
  const [daysMacros, setDaysMacros] = useState({});
  const [allFoods, setAllFoods] = useState([]);
  const [displayFoods, setDisplayFoods] = useState([]);
  const [mealLog, setMealLog] = useState([]);
  const [viewRange, setViewRange] = useState("daily");
  const [dateInterval, setDateInterval] = useState({ f: 1, b: 1 });
  const [viewingDate, setViewingDate] = useState(createDateString(new Date()));
  const [touchScroll, setTouchScroll] = useState({
    touchStart: 0,
    touchEnd: 0,
  });

  const [itemStates, setItemStates] = useState({
    item: "",
    option: "",
  });

  const meals = [
    "Breakfast",
    "Morning Snack",
    "Lunch",
    "Afternoon Snack",
    "Dinner",
    "Evening Snack",
  ];

  const formatTotalMacros = (data) => {
    let groupedData;
    let reducedData = {};
    if (viewRange === "daily") {
      groupedData = Object.groupBy(data, ({ meal }) => meal);
      reducedData = data.reduce(
        (acc, cur) => {
          return {
            calories: acc.calories + cur.calories,
            fat: acc.fat + cur.fat,
            carbs: acc.carbs + cur.carbs,
            protein: acc.protein + cur.protein,
          };
        },
        { calories: 0, fat: 0, carbs: 0, protein: 0 }
      );
    } else {
      groupedData = Object.groupBy(data, ({ date }) => date);
      Object.keys(groupedData).forEach(
        (date) =>
          (reducedData[date] = groupedData[date].reduce(
            (acc, cur) => {
              return {
                calories: acc.calories + cur.calories,
                fat: acc.fat + cur.fat,
                carbs: acc.carbs + cur.carbs,
                protein: acc.protein + cur.protein,
              };
            },
            { calories: 0, fat: 0, carbs: 0, protein: 0 }
          ))
      );
      reducedData = Object.keys(reducedData).reduce(
        (acc, cur) => {
          return {
            calories:
              acc.calories +
              Math.round(
                reducedData[cur].calories / Object.keys(reducedData).length
              ),
            fat:
              acc.fat +
              Math.round(
                reducedData[cur].fat / Object.keys(reducedData).length
              ),
            carbs:
              acc.carbs +
              Math.round(
                reducedData[cur].carbs / Object.keys(reducedData).length
              ),
            protein:
              acc.protein +
              Math.round(
                reducedData[cur].protein / Object.keys(reducedData).length
              ),
          };
        },
        { calories: 0, fat: 0, carbs: 0, protein: 0 }
      );
    }
    setMealLog(groupedData);
    setDaysMacros(reducedData);
  };

  const fetchLog = async (date) => {
    const res = await fetch(`${APIUrl}log/?date=${date}&range=month`);
    const data = await res.json();
    setAllFoods(data.data);
  };

  useEffect(() => {
    fetchLog(viewingDate);
    setDisplayFoods(
      allFoods.filter((food) => {
        return (
          new Date(food.date).getDate() === new Date(viewingDate).getDate()
        );
      })
    );
  }, [macroTotals]);

  useEffect(() => {
    switch (viewRange) {
      case "daily":
        document.querySelector("#view-log input#date").readOnly = false;
        setViewingDate(createDateString(new Date()));
        setDateInterval({ f: 1, b: 1 });
        break;
      case "weekly":
        document.querySelector("#view-log input#date").readOnly = true;
        const firstDayofWeek = new Date(viewingDate);
        firstDayofWeek.setDate(firstDayofWeek.getDate() + 1);
        firstDayofWeek.setDate(
          firstDayofWeek.getDate() - firstDayofWeek.getDay()
        );
        setViewingDate(createDateString(firstDayofWeek));
        setDateInterval({ f: 7, b: 7 });
        break;
      case "monthly":
        document.querySelector("#view-log input#date").readOnly = true;
        const firstDayOfMonth = new Date(viewingDate);
        firstDayOfMonth.setDate(firstDayOfMonth.getDate() + 1);
        firstDayOfMonth.setDate(1);
        setViewingDate(createDateString(firstDayOfMonth));

        break;
    }
  }, [viewRange]);

  useEffect(() => {
    if (
      allFoods.length === 0 ||
      Number(viewingDate.split("-")[1]) - 1 !==
        new Date(allFoods[0].date).getMonth()
    ) {
      fetchLog(viewingDate);
    }
    switch (viewRange) {
      case "daily":
        setDisplayFoods(
          allFoods.filter((food) => {
            return (
              new Date(food.date).getDate() === new Date(viewingDate).getDate()
            );
          })
        );
        break;
      case "weekly":
        const lastDate = new Date(viewingDate);
        lastDate.setDate(lastDate.getDate() + dateInterval.f);
        setDisplayFoods(
          allFoods.filter((food) => {
            return (
              new Date(food.date).getDate() >=
                new Date(viewingDate).getDate() &&
              new Date(food.date).getDate() <= lastDate.getDate()
            );
          })
        );
        break;
      case "monthly":
        let monthLength = new Date(viewingDate);
        monthLength.setDate(monthLength.getDate() + 1);
        monthLength.setDate(32);
        monthLength.setDate(0);
        monthLength = monthLength.getDate();
        let prevMonthLength = new Date(viewingDate);
        prevMonthLength.setDate(prevMonthLength.getDate() + 1);
        prevMonthLength.setDate(0);
        prevMonthLength = prevMonthLength.getDate();
        setDateInterval({ f: monthLength, b: prevMonthLength });
        break;
    }
  }, [viewingDate, allFoods]);

  useEffect(() => {
    formatTotalMacros(displayFoods);
  }, [displayFoods]);

  return (
    <div
      id="view-log"
      className={"container-box main-page " + "subpage transition"}
    >
      <CloseButton
        pageID="view-log"
        functionList={[
          () => setViewingDate(createDateString(new Date())),
          () => document.getElementById("log-div").scroll(0, "smooth"),
          () => setViewRange("daily"),
        ]}
      />
      <div style={{ height: "160px" }}>
        <h1 style={{ margin: "5px" }}>Food Log</h1>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            margin: "10px",
          }}
        >
          <select
            style={{ width: "75px" }}
            onChange={(e) => setViewRange(e.target.value)}
            value={viewRange}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          <DatePicker
            label={false}
            defaultDate={viewingDate}
            setDefaultDate={setViewingDate}
            interval={dateInterval}
          />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
          <p
            style={{
              borderLeft: "1px solid",
              borderBottom: "1px solid",
              margin: "5px",
              padding: "5px",
            }}
          >
            {Number(daysMacros.calories)} <br />
            {viewRange !== "daily" && "daily avg \n"}
            calories
          </p>
          <p
            style={{
              borderLeft: "1px solid",
              borderBottom: "1px solid",
              margin: "5px",
              padding: "5px",
            }}
          >
            {Number(daysMacros.fat)}g<br />
            {viewRange !== "daily" && "daily avg \n"} fat
          </p>
          <p
            style={{
              borderLeft: "1px solid",
              borderBottom: "1px solid",
              margin: "5px",
              padding: "5px",
            }}
          >
            {Number(daysMacros.carbs)}g<br />
            {viewRange !== "daily" && "daily avg \n"} carbs
          </p>
          <p
            style={{
              borderLeft: "1px solid",
              borderBottom: "1px solid",
              margin: "5px",
              padding: "5px",
            }}
          >
            {Number(daysMacros.protein)}g<br />
            {viewRange !== "daily" && "daily avg \n"} protein
          </p>
        </div>
        <hr />
      </div>
      <div id="log-div">
        {Object.values(mealLog).length ? (
          viewRange === "daily" ? (
            meals.map((m, index) => {
              let componentList = [];
              if (mealLog[m]) {
                componentList = componentList.concat(
                  <h3 style={{ margin: "5px 0px 5px 0px" }} key={m}>
                    {m}
                  </h3>
                );
                componentList = componentList.concat(
                  mealLog[m].map((food, i) => (
                    <div key={i}>
                      <FoodDisplay
                        food={food}
                        allFoods={allFoods}
                        setAllFoods={setAllFoods}
                        buttons={["edit", "trash"]}
                        itemState={itemStates}
                        setItemState={setItemStates}
                        link={"log"}
                      />
                    </div>
                  ))
                );
                return <div key={index}>{componentList}</div>;
              }
            })
          ) : (
            ""
          )
        ) : (
          <p style={{ width: "1000px" }}>No logs recorded.</p>
        )}
      </div>
    </div>
  );
}
