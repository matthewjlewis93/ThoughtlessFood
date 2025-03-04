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
  const [viewingDate, setViewingDate] = useState(createDateString(new Date()));
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

  const formatDaysMacros = (data) => {
    setMealLog(Object.groupBy(data, ({ meal }) => meal));
    setDaysMacros(
      data.reduce(
        (acc, cur) => {
          return {
            calories: acc.calories + cur.calories,
            fat: acc.fat + cur.fat,
            carbs: acc.carbs + cur.carbs,
            protein: acc.protein + cur.protein,
          };
        },
        { calories: 0, fat: 0, carbs: 0, protein: 0 }
      )
    );
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
  }, [macroTotals])

  useEffect(() => {
    if (
      allFoods.length === 0 ||
      Number(viewingDate.split('-')[1]) - 1 !== new Date(allFoods[0].date).getMonth()
    ) {
        fetchLog(viewingDate);
    }
    setDisplayFoods(
      allFoods.filter((food) => {
        return new Date(food.date).getDate() === new Date(viewingDate).getDate();
      })
    );
  }, [viewingDate, allFoods]);

  useEffect(() => {
    formatDaysMacros(displayFoods);
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
          <DatePicker
            label={false}
            defaultDate={viewingDate}
            setDefaultDate={setViewingDate}
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
            {Number(daysMacros.calories)}
            <br /> calories
          </p>
          <p
            style={{
              borderLeft: "1px solid",
              borderBottom: "1px solid",
              margin: "5px",
              padding: "5px",
            }}
          >
            {Number(daysMacros.fat)}g<br /> fat
          </p>
          <p
            style={{
              borderLeft: "1px solid",
              borderBottom: "1px solid",
              margin: "5px",
              padding: "5px",
            }}
          >
            {Number(daysMacros.carbs)}g<br /> carbs
          </p>
          <p
            style={{
              borderLeft: "1px solid",
              borderBottom: "1px solid",
              margin: "5px",
              padding: "5px",
            }}
          >
            {Number(daysMacros.protein)}g<br /> protein
          </p>
        </div>
        <hr />
      </div>
      <div id="log-div">
        {Object.values(mealLog).length ? (
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
          <p>No logs recorded.</p>
        )}
      </div>
    </div>
  );
}
