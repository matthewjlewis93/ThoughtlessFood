import react, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../Providers/ContextProvider";
import Select from "react-select";
import DatePicker from "../DatePicker";
import createDateString from "../../createDateString";
import CloseButton from "../CloseButton";
import transitionControl from "../../transitionControl";

export default function LogFoodPage() {
  const {
    activePage,
    updateActivePage,
    addToMacros,
    APIUrl,
    setToastInfo,
    theme,
  } = useContext(AppContext);
  const [selection, setSelection] = useState(0);
  const [defaultDate, setDefaultDate] = useState("");
  const [saveAsFood, setSaveAsFood] = useState(false);
  const [log, setLog] = useState({
    name: "",
    meal: "",
    date: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    amount: "",
    unit: "gram",
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
    return formattedLog;
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
      unit: "gram",
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
    if (!saveAsFood) {
      setToastInfo({
        toastActivated: true,
        toastMessage: `${log.name} logged!`,
        positive: true,
      });
    }
    transitionControl("log-food");
    updateActivePage("HomePage");
  };

  const saveFood = async (logData) => {
    const foodToLog = { ...logData };
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
    setToastInfo({
      toastActivated: true,
      toastMessage: `Logged and saved ${foodToLog.name} to Foods!`,
      positive: true,
    });
  };

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
    const newAmount = e.target.form[11].value;

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
    e.target.form[11].value = '';
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
      id="log-food"
      className={"container-box main-page " + "subpage transition"}
    >
      <CloseButton functionList={[handleClear]} pageID="log-food" />
      <h1>Add Log</h1>
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

        <div
          className="form-div"
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "10px",
          }}
        >
          <div style={{ flexGrow: 1 }}>
            {" "}
            <label>Meal: </label>
            <br />
            <Select
              id="meal"
              isSearchable={false}
              options={selectOptions}
              value={selectOptions[selection]}
              styles={{
                menu: (baseStyles, state) => ({
                  ...baseStyles,
                  color: "black",
                }),
                container: (baseStyles) => ({
                  ...baseStyles,
                  width: "100%",
                  fontSize: "16px",
                }),
              }}
              onChange={(e) => {
                setLog({ ...log, meal: e.value });
                setSelection(e.index);
              }}
            ></Select>
          </div>
          <div>
            <DatePicker
              label={true}
              defaultDate={defaultDate}
              setDefaultDate={setDefaultDate}
              record={log}
              setRecord={setLog}
            />
          </div>
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
        <div className="form-div" style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <label>Amount: </label>
            <br />
            <div style={{ display: "flex", gap: "3px" }}>
              <input
                type="number"
                style={{ width: "60px" }}
                value={log.amount}
                onChange={(e) => setLog({ ...log, amount: e.target.value })}
              ></input>
              <select
                value={log.unit}
                onChange={(e) => {
                  setLog({ ...log, unit: e.target.value });
                }}
              >
                <option value="gram">gram(s)</option>
                <option value="oz">oz</option>
                <option value="mL">mL</option>
                <option value="unit">Unit(s)</option>
              </select>
            </div>
          </div>
          <div>
            <label>Scale Macros:</label>
            <br />
            <div style={{ display: "flex", gap: "3px" }}>
              <input style={{ width: "60px" }} type="number" />
              <button
                style={{
                  fontSize: "0.8em",
                }}
                onClick={(e) => convertMacros(e)}
              >
                Scale
              </button>
            </div>
          </div>
        </div>
      </form>
      <br />
      <label style={{ margin: "auto 0px" }}>
        Save as food{" "}
        <input
          type="checkbox"
          style={{ height: "14px" }}
          value={saveAsFood}
          onChange={(e) => {
            setSaveAsFood(e.target.checked);
          }}
        />
      </label>
      <br />
      <br />

      <div style={{ display: "flex", gap: "30px" }}>
        <button
          onClick={() => {
            recordLog(setupLog(log));
            if (saveAsFood) {
              saveFood(setupLog(log));
            }
          }}
          style={{
            backgroundColor: "#fcba40",
            borderRadius: "5px",
            height: "30px",
            fontSize: "20px",
          }}
        >
          Submit
        </button>

        <button
          onClick={handleClear}
          style={{
            backgroundColor: "#DD1D1D",
            borderRadius: "5px",
            color: "white",
          }}
        >
          Clear
        </button>
      </div>
    </div>
  );
}
