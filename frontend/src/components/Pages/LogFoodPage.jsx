import react, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../Providers/ContextProvider";
import Select from "react-select";
import DatePicker from "../DatePicker";
import createDateString from "../../createDateString";
import CloseButton from "../CloseButton";

export default function LogFoodPage() {
  const { activePage, updateActivePage, addToMacros, APIUrl } =
    useContext(AppContext);
  const [selection, setSelection] = useState(0);
  const [defaultDate, setDefaultDate] = useState("");
  const [log, setLog] = useState({
    name: "",
    meal: "",
    date: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    amount: "",
    unit: "grams",
  });

  const setupLog = () => {
    let formattedLog = structuredClone(log);

    if (formattedLog.name === "") {
      formattedLog.name = formattedLog.meal;
    }
    if (formattedLog.amount === "") {
      formattedLog.unit = "";
    }
    for (let macro in formattedLog) {
      if (formattedLog[macro] === "") {
        formattedLog[macro] = 0;
      }
    }
    // setLog(formattedLog);
    // recordLog(formattedLog);
    return formattedLog
  };

  const handleClear = () => {
    const dateString = createDateString(new Date());
    setLog({
      name: "",
      meal: "",
      date: dateString,
      calories: "",
      protein: "",
      carbs: "",
      fat: "",
      amount: "",
      unit: "grams",
    });
  };

  const recordLog = async (logData) => {
    const res = await fetch(`${APIUrl}log`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(logData),
    });
    addToMacros(log);
    handleClear();
    updateActivePage("HomePage");
  };

  const saveFood = async (logData) => {
    const foodToLog = {...logData}
    delete foodToLog.meal;
    foodToLog.category = "food";
    foodToLog.favorite = false;
    foodToLog.lastLogged = new Date().toJSON();
    const res = await fetch(`${APIUrl}foods`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(foodToLog),
    });
  }

  const getDefaults = (date) => {
    const dateString = createDateString(date);
    setDefaultDate(dateString);
    const currentHour = date.getHours();
    if (currentHour < 12) {
      setSelection(0);
      setLog({ ...log, date: dateString, meal: "Breakfast" });
    } else if (currentHour < 17) {
      setSelection(2);
      setLog({ ...log, date: dateString, meal: "Lunch" });
    } else {
      setSelection(4);
      setLog({ ...log, date: dateString, meal: "Dinner" });
    }
  };

  const convertMacros = (e) => {
    e.preventDefault();
    const newAmount = Number(prompt("Enter new amount"));
    // let newLog = structuredClone(log)
    setLog({
      ...log,
      calories: Math.round(
        (Number(log.calories) / Number(log.amount)) * newAmount
      ),
      protein: Math.round(
        (Number(log.protein) / Number(log.amount)) * newAmount
      ),
      carbs: Math.round((Number(log.carbs) / Number(log.amount)) * newAmount),
      fat: Math.round((Number(log.fat) / Number(log.amount)) * newAmount),
      amount: newAmount,
    });
    // console.log(newLog);
  };

  useEffect(() => {
    getDefaults(new Date());
  }, [activePage]);

  const selectOptions = [
    { value: "Breakfast", label: "Breakfast", index: 0 },
    { value: "Morning Snack", label: "Morning Snack", index: 1 },
    { value: "Lunch", label: "Lunch", index: 2 },
    { value: "Afternoon Snack", label: "Afternoon Snack", index: 3 },
    { value: "Dinner", label: "Dinner", index: 4 },
    { value: "Evening Snack", label: "Evening Snack", index: 5 },
  ];

  return (
    <div
      className={
        "container-box main-page " +
        (activePage === "Log Food" ? "active" : "inactive")
      }
    >
      <CloseButton functionList={[handleClear]} />
      <h1 style={{ paddingLeft: "10px", color: "#6798c0" }}>Add Log</h1>
      <form autoComplete="off">
        <div className="form-div">
          <label htmlFor="food-name">Food: </label>
          <br />
          <input
            id="food-name"
            style={{ width: "95%", fontSize: "1.2em" }}
            onChange={(e) => setLog({ ...log, name: e.target.value })}
            value={log.name}
          ></input>
        </div>

        <div className="form-div">
          <label>Meal: </label>
          <br />
          <Select
            id="meal"
            isSearchable={false}
            options={selectOptions}
            value={selectOptions[selection]}
            style={{ width: "50%", fontSize: "0.9em" }}
            onChange={(e) => {
              setLog({ ...log, meal: e.value });
              setSelection(e.index);
            }}
          ></Select>
        </div>

        <div className="form-div">
          <DatePicker
            defaultDate={defaultDate}
            setDefaultDate={setDefaultDate}
            record={log}
            setRecord={setLog}
          />
        </div>

        <div
          className="form-div"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "5px",
          }}
        >
          <div>
            <label htmlFor="calories">Calories: </label>
            <br />
            <input
              id="calories"
              style={{ width: "90%", fontSize: "1.2em" }}
              type="number"
              maxLength={5}
              value={log.calories}
              onChange={(e) => setLog({ ...log, calories: e.target.value })}
            ></input>
          </div>

          <div>
            <label htmlFor="fat">Fat: </label>
            <br />
            <input
              id="fat"
              style={{ width: "90%", fontSize: "1.2em" }}
              type="number"
              maxLength={5}
              value={log.fat}
              onChange={(e) => setLog({ ...log, fat: e.target.value })}
            ></input>
          </div>

          <div>
            <label htmlFor="carbs">Carbs: </label>
            <br />
            <input
              id="carbs"
              style={{ width: "90%", fontSize: "1.2em" }}
              type="number"
              maxLength={5}
              value={log.carbs}
              onChange={(e) => setLog({ ...log, carbs: e.target.value })}
            ></input>
          </div>

          <div>
            <label htmlFor="protein">Protein: </label>
            <br />
            <input
              id="protein"
              style={{ width: "90%", fontSize: "1.2em" }}
              type="number"
              maxLength={5}
              value={log.protein}
              onChange={(e) => setLog({ ...log, protein: e.target.value })}
            ></input>
          </div>
        </div>
        <div className="form-div">
          <label>Amount: </label>
          <br />
          <div style={{ display: "flex" }}>
            <input
              type="number"
              style={{ width: "5em" }}
              value={log.amount}
              onChange={(e) => setLog({ ...log, amount: e.target.value })}
            ></input>
            <select
              style={{ marginLeft: "3px" }}
              value={log.unit}
              onChange={(e) => {
                setLog({ ...log, unit: e.target.value });
              }}
            >
              <option value="grams">grams</option>
              <option value="oz">oz</option>
              <option value="mL">mL</option>
              <option value="unit">Unit(s)</option>
            </select>
            <button
              style={{ marginLeft: "15px", height: "25px", fontSize: "0.8em" }}
              onClick={(e) => convertMacros(e)}
            >
              Scale Macros
            </button>
          </div>
        </div>
      </form>
      <br />
      <br />
      <button
        onClick={() => {
          recordLog(setupLog(log)) //setupLog();
        }}
        className="blue-button"
      >
        Submit
      </button>
      <button onClick={() => {saveFood(setupLog(log));recordLog(setupLog(log))}}>Submit and Save food</button>

      <br />
      <br />
      <button onClick={handleClear}>Clear</button>
    </div>
  );
}
