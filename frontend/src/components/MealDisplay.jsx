import { useEffect, useState, useContext } from "react";
import MealFood from "./MealFood";
import { AppContext } from "../Providers/ContextProvider";
import DatePicker from "./DatePicker";
import createDateString from "../createDateString";
import SquareButton from "./SquareButton";

export default function MealDisplay({
  meal,
  mealEdits,
  setMealEdits,
  updateMeals,
  mealStatus,
  mealIndex,
  setMealStatus,
  setMeals,
  buttons,
}) {
  const [macros, setMacros] = useState({});
  const [mealDate, setMealDate] = useState(createDateString(new Date()));
  const { APIUrl, setToastInfo } = useContext(AppContext);
  const [mealFoodAmounts, setMealFoodAmounts] = useState({});

  useEffect(() => {
    setMealDate(createDateString(new Date()));
  }, [mealStatus]);

  const handleAddIngredient = () => {
    setMeals([
      {
        ...mealEdits[0],
        ingredients: [
          ...mealEdits[0].ingredients,
          { calories: 0, fat: 0, carbs: 0, protein: 0, unit: "gram" },
        ],
      },
      ...mealEdits.slice(1),
    ]);
    setMealEdits([
      {
        ...mealEdits[0],
        ingredients: [
          ...mealEdits[0].ingredients,
          { calories: 0, fat: 0, carbs: 0, protein: 0, unit: "gram" },
        ],
      },
      ...mealEdits.slice(1),
    ]);
  };

  const deleteMeal = () => {
    fetch(`${APIUrl}meals/${meal._id}`, {
      method: "DELETE",
    });
    updateMeals(mealEdits.filter((m) => m._id !== meal._id));
    setToastInfo({
      toastActivated: true,
      toastMessage: `${mealEdits[mealIndex].name} deleted!`,
      positive: true,
    });
  };

  const sendNewMeal = async () => {
    setMealStatus({ id: "", expanded: false, option: "" });
    let mealToSend = structuredClone(mealEdits[0]);
    delete mealToSend.complete;
    delete mealToSend._id;
    let res = await fetch(`${APIUrl}meals`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mealToSend),
    });
    res = await res.json();
    const data = res.data;
    updateMeals([data, ...mealEdits.slice(1)]);
    setToastInfo({
      toastActivated: true,
      toastMessage: `${mealEdits[mealIndex].name} created!`,
      positive: true,
    });
  };

  const logMeal = async (loggedMeal) => {
    setMealStatus({ id: "", expanded: false, option: "" });
    let logMacros = meal.ingredients.reduce(
      (acc, curr, i) => {
        if (Object.keys(mealFoodAmounts).includes(String(i))) {
          return {
            calories:
              acc.calories +
              Math.round((curr.calories / curr.amount) * mealFoodAmounts[i]),
            fat:
              acc.fat +
              Math.round((curr.fat / curr.amount) * mealFoodAmounts[i]),
            carbs:
              acc.carbs +
              Math.round((curr.carbs / curr.amount) * mealFoodAmounts[i]),
            protein:
              acc.protein +
              Math.round((curr.protein / curr.amount) * mealFoodAmounts[i]),
          };
        } else {
          return {
            calories: acc.calories + curr.calories,
            fat: acc.fat + curr.fat,
            carbs: acc.carbs + curr.carbs,
            protein: acc.protein + curr.protein,
          };
        }
      },
      { calories: 0, fat: 0, carbs: 0, protein: 0 }
    );
    logMacros["name"] = meal.name;
    logMacros["meal"] = loggedMeal;
    logMacros["date"] = mealDate;
    logMacros["unit"] = "Meal";
    logMacros["amount"] = 1;
    await fetch(`${APIUrl}log`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(logMacros),
    });
    await fetch(`${APIUrl}meals/${meal._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ lastLogged: createDateString(new Date()) }),
    });
    setToastInfo({
      toastActivated: true,
      toastMessage: `${mealEdits[mealIndex].name} logged!`,
      positive: true,
    });
  };

  const sumTotals = () => {
    setMacros({
      calories: meal.ingredients.reduce((a, b) => b.calories + a, 0),
      fat: meal.ingredients.reduce((a, b) => b.fat + a, 0),
      carbs: meal.ingredients.reduce((a, b) => b.carbs + a, 0),
      protein: meal.ingredients.reduce((a, b) => b.protein + a, 0),
    });
  };

  const submitEdit = async () => {
    setMealStatus({ id: meal._id, expanded: true, option: "" });
    await fetch(`${APIUrl}meals/${meal._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mealEdits[mealIndex]),
    });
    updateMeals(mealEdits);
    setToastInfo({
      toastActivated: true,
      toastMessage: `${mealEdits[mealIndex].name} edited!`,
      positive: true,
    });
  };

  useEffect(() => {
    sumTotals();
  }, [mealStatus]);

  if (mealStatus.id === meal._id) {
    switch (mealStatus.option) {
      case "log":
        let loggedMeal;
        const currentHour = new Date().getHours();
        if (currentHour < 12) {
          loggedMeal = "Breakfast";
        } else if (currentHour < 17) {
          loggedMeal = "Lunch";
        } else {
          loggedMeal = "Dinner";
        }
        return (
          <div className="meal">
            <div
              className={"item-container meal-container expanded"}
              style={{ position: "relative" }}
            >
              <div className="meal-header">
                <h4>{meal.name}</h4>
                <select
                  defaultValue={loggedMeal}
                  style={{ marginTop: "2px" }}
                  onChange={(e) => (loggedMeal = e.target.value)}
                >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Morning Snack">Morning Snack</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Afternoon Snack">Afternoon Snack</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Evening Snack">Evening Snack</option>
                </select>{" "}
                <br />
                <DatePicker
                  defaultDate={mealDate}
                  setDefaultDate={setMealDate}
                />
              </div>
              <div className="grid-buttons" style={{ borderTop: "1px solid" }}>
                <SquareButton
                  icon="check"
                  onClickFunction={() => logMeal(loggedMeal)}
                />
                <SquareButton
                  icon="x"
                  onClickFunction={() =>
                    setMealStatus({ ...mealStatus, option: "" })
                  }
                />
              </div>
              {mealStatus.id === meal._id && mealStatus.expanded && (
                <div
                  style={{
                    display: "inline-block",
                    margin: "auto",
                    gridColumn: "span 4",
                  }}
                >
                  {meal.ingredients.map((m, i) => (
                    <div key={i}>
                      <MealFood
                        food={m}
                        mealIndex={mealIndex}
                        mealEdits={mealEdits}
                        setMealEdits={setMealEdits}
                        index={i}
                        updateMeals={updateMeals}
                        status={"log"}
                        mealFoodAmount={mealFoodAmounts}
                        setMealFoodAmount={setMealFoodAmounts}
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="meal-macro" style={{ borderRight: "1px solid" }}>
                <h2 style={{ margin: 0 }}>{macros.calories}</h2>
                <p style={{ margin: 0 }}>calories</p>
              </div>
              <div className="meal-macro" style={{ borderRight: "1px solid" }}>
                <h2 style={{ margin: 0 }}>{macros.fat}</h2>
                <p style={{ margin: 0 }}>fat</p>
              </div>
              <div className="meal-macro" style={{ borderRight: "1px solid" }}>
                <h2 style={{ margin: 0 }}>{macros.carbs}</h2>
                <p style={{ margin: 0 }}>carbs</p>
              </div>
              <div className="meal-macro">
                <h2 style={{ margin: 0 }}>{macros.protein}</h2>
                <p style={{ margin: 0 }}>protein</p>
              </div>
            </div>
          </div>
        );
      case "edit":
        return (
          <div className="meal">
            <div
              className={"item-container meal-container expanded"}
              style={{ position: "relative" }}
            >
              <div className="meal-header">
                <h4>{meal.name}</h4>
              </div>
              <div className="grid-buttons" style={{ borderTop: "1px solid" }}>
                <SquareButton icon="check" onClickFunction={submitEdit} />
                <SquareButton
                  icon="x"
                  onClickFunction={() =>
                    setMealStatus({ ...mealStatus, option: "" })
                  }
                />
              </div>
              {mealStatus.id === meal._id && mealStatus.expanded && (
                <div
                  style={{
                    display: "inline-block",
                    margin: "auto",
                    gridColumn: "span 4",
                    width: "100%",
                  }}
                >
                  {meal.ingredients.map((m, i) => (
                    <MealFood
                      meal={meal}
                      key={i}
                      food={m}
                      mealIndex={mealIndex}
                      mealEdits={mealEdits}
                      status="edit"
                      setMealEdits={setMealEdits}
                      index={i}
                      updateMeals={updateMeals}
                    />
                  ))}
                  <div
                    onClick={handleAddIngredient}
                    style={{
                      width: "calc(100% - 16px)",
                      height: "22px",
                      margin: "3px auto 3px auto",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "#eee",
                      borderRadius: "5px",
                      border: "1px solid",
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="#000"
                      className="bi bi-plus-lg"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"
                      />
                    </svg>
                  </div>
                </div>
              )}

              <div className="meal-macro" style={{ borderRight: "1px solid" }}>
                <h2 style={{ margin: 0 }}>{macros.calories}</h2>
                <p style={{ margin: 0 }}>calories</p>
              </div>
              <div className="meal-macro" style={{ borderRight: "1px solid" }}>
                <h2 style={{ margin: 0 }}>{macros.fat}</h2>
                <p style={{ margin: 0 }}>fat</p>
              </div>
              <div className="meal-macro" style={{ borderRight: "1px solid" }}>
                <h2 style={{ margin: 0 }}>{macros.carbs}</h2>
                <p style={{ margin: 0 }}>carbs</p>
              </div>
              <div className="meal-macro">
                <h2 style={{ margin: 0 }}>{macros.protein}</h2>
                <p style={{ margin: 0 }}>protein</p>
              </div>
            </div>
          </div>
        );
      case "delete":
        return (
          <div className="meal">
            <div
              className={"item-container meal-container collapsed"}
              style={{ position: "relative" }}
            >
              <div className="meal-header">
                <h4 style={{ color: "#DD1D1D" }}>Delete {meal.name}?</h4>
              </div>
              <div className="grid-buttons" style={{ borderTop: "1px solid" }}>
                <SquareButton
                  icon="check"
                  onClickFunction={() => {
                    deleteMeal();
                    setMealStatus({
                      id: "",
                      expanded: false,
                      option: "",
                    });
                  }}
                />
                <SquareButton
                  icon="x"
                  onClickFunction={() =>
                    setMealStatus({
                      id: "",
                      expanded: false,
                      option: "",
                    })
                  }
                />
              </div>

              <div className="meal-macro" style={{ borderRight: "1px solid" }}>
                <h2 style={{ margin: 0 }}>{macros.calories}</h2>
                <p style={{ margin: 0 }}>calories</p>
              </div>
              <div className="meal-macro" style={{ borderRight: "1px solid" }}>
                <h2 style={{ margin: 0 }}>{macros.fat}</h2>
                <p style={{ margin: 0 }}>fat</p>
              </div>
              <div className="meal-macro" style={{ borderRight: "1px solid" }}>
                <h2 style={{ margin: 0 }}>{macros.carbs}</h2>
                <p style={{ margin: 0 }}>carbs</p>
              </div>
              <div className="meal-macro">
                <h2 style={{ margin: 0 }}>{macros.protein}</h2>
                <p style={{ margin: 0 }}>protein</p>
              </div>
            </div>
          </div>
        );
      case "new":
        return (
          <div className="meal">
            <div
              className={"item-container meal-container expanded"}
              style={{ position: "relative" }}
            >
              <div className="meal-header">
                <input
                  placeholder="Meal Name"
                  onChange={(e) =>
                    setMealEdits(
                      mealEdits.toSpliced(0, 1, {
                        ...mealEdits[0],
                        name: e.target.value,
                      })
                    )
                  }
                />
              </div>
              <div className="grid-buttons" style={{ borderTop: "1px solid" }}>
                <img src={Check} onClick={sendNewMeal} />
                <img
                  src={X}
                  onClick={() => setMealStatus({ ...mealStatus, option: "" })}
                />
              </div>
              {mealStatus.id === meal._id && mealStatus.expanded && (
                <div
                  style={{
                    display: "inline-block",
                    margin: "auto",
                    gridColumn: "span 4",
                    width: "100%",
                  }}
                >
                  {meal.ingredients.map((m, i) => (
                    <MealFood
                      key={i}
                      food={m}
                      mealIndex={mealIndex}
                      mealEdits={mealEdits}
                      status="new"
                      setMealEdits={setMealEdits}
                      index={i}
                      updateMeals={updateMeals}
                    />
                  ))}
                  <div
                    onClick={handleAddIngredient}
                    style={{
                      width: "calc(100% - 16px)",
                      height: "22px",
                      margin: "3px auto 3px auto",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "#eee",
                      borderRadius: "5px",
                      border: "1px solid",
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="#000"
                      className="bi bi-plus-lg"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"
                      />
                    </svg>
                  </div>
                </div>
              )}

              <div className="meal-macro" style={{ borderRight: "1px solid" }}>
                <h2 style={{ margin: 0 }}>{macros.calories}</h2>
                <p style={{ margin: 0 }}>calories</p>
              </div>
              <div className="meal-macro" style={{ borderRight: "1px solid" }}>
                <h2 style={{ margin: 0 }}>{macros.fat}</h2>
                <p style={{ margin: 0 }}>fat</p>
              </div>
              <div className="meal-macro" style={{ borderRight: "1px solid" }}>
                <h2 style={{ margin: 0 }}>{macros.carbs}</h2>
                <p style={{ margin: 0 }}>carbs</p>
              </div>
              <div className="meal-macro">
                <h2 style={{ margin: 0 }}>{macros.protein}</h2>
                <p style={{ margin: 0 }}>protein</p>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="meal">
            <div
              className={"item-container meal-container expanded"}
              style={{ position: "relative" }}
            >
              <div
                className="meal-header"
                onClick={() =>
                  setMealStatus({
                    id: "",
                    expanded:
                      mealStatus.id === meal._id ? !mealStatus.expanded : true,
                    option: "",
                  })
                }
              >
                <h4>{meal.name}</h4>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="#000"
                  className="bi bi-dash-lg"
                  viewBox="0 0 16 16"
                  style={{
                    position: "absolute",
                    top: "5px",
                    right: "5px",
                    border: "1px solid",
                    borderRadius: "50%",
                  }}
                >
                  <path
                    fillRule="evenodd"
                    d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8"
                  />
                </svg>
              </div>
              <div className="grid-buttons" style={{ borderTop: "1px solid" }}>
                {buttons.map((button, i) => {
                  return (
                    <SquareButton
                      key={i}
                      icon={button}
                      onClickFunction={() =>
                        setMealStatus({
                          id: meal._id,
                          expanded: true,
                          option: button.includes("addtolog")
                            ? "log"
                            : button.includes("edit")
                            ? "edit"
                            : "delete",
                        })
                      }
                    />
                  );
                })}
              </div>
              {mealStatus.id === meal._id && mealStatus.expanded && (
                <div
                  style={{
                    display: "inline-block",
                    margin: "auto",
                    gridColumn: "span 4",
                    width: "100%",
                  }}
                >
                  {meal.ingredients.map((m, i) => (
                    <div key={i}>
                      <MealFood
                        food={m}
                        mealIndex={mealIndex}
                        mealEdits={mealEdits}
                        setMealEdits={setMealEdits}
                        index={i}
                        updateMeals={updateMeals}
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="meal-macro" style={{ borderRight: "1px solid" }}>
                <h2 style={{ margin: 0 }}>{macros.calories}</h2>
                <p style={{ margin: 0 }}>calories</p>
              </div>
              <div className="meal-macro" style={{ borderRight: "1px solid" }}>
                <h2 style={{ margin: 0 }}>{macros.fat}</h2>
                <p style={{ margin: 0 }}>fat</p>
              </div>
              <div className="meal-macro" style={{ borderRight: "1px solid" }}>
                <h2 style={{ margin: 0 }}>{macros.carbs}</h2>
                <p style={{ margin: 0 }}>carbs</p>
              </div>
              <div className="meal-macro">
                <h2 style={{ margin: 0 }}>{macros.protein}</h2>
                <p style={{ margin: 0 }}>protein</p>
              </div>
            </div>
          </div>
        );
    }
  } else {
    // collapsed
    return (
      <div className="meal">
        <div
          className={"item-container meal-container collapsed"}
          style={{ position: "relative" }}
        >
          <div
            className="meal-header"
            onClick={() =>
              setMealStatus({
                id: meal._id,
                expanded:
                  mealStatus.id === meal._id ? !mealStatus.expanded : true,
                option: "",
              })
            }
          >
            <h4>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="#000"
                className="bi bi-plus-lg"
                viewBox="0 0 16 16"
                style={{
                  position: "absolute",
                  top: "5px",
                  right: "5px",
                  border: "1px solid",
                  borderRadius: "50%",
                }}
              >
                <path
                  fillRule="evenodd"
                  d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"
                />
              </svg>
              {meal.name}
            </h4>
          </div>
          <div className="grid-buttons" style={{ borderTop: "1px solid" }}>
            {buttons.map((button, i) => {
              return (
                <SquareButton
                  key={i}
                  icon={button}
                  onClickFunction={() =>
                    setMealStatus({
                      id: meal._id,
                      expanded: true,
                      option: button.includes("addtolog")
                        ? "log"
                        : button.includes("edit")
                        ? "edit"
                        : "delete",
                    })
                  }
                />
              );
            })}
          </div>

          <div className="meal-macro" style={{ borderRight: "1px solid" }}>
            <h2 style={{ margin: 0 }}>{macros.calories}</h2>
            <p style={{ margin: 0 }}>calories</p>
          </div>
          <div className="meal-macro" style={{ borderRight: "1px solid" }}>
            <h2 style={{ margin: 0 }}>{macros.fat}</h2>
            <p style={{ margin: 0 }}>fat</p>
          </div>
          <div className="meal-macro" style={{ borderRight: "1px solid" }}>
            <h2 style={{ margin: 0 }}>{macros.carbs}</h2>
            <p style={{ margin: 0 }}>carbs</p>
          </div>
          <div className="meal-macro">
            <h2 style={{ margin: 0 }}>{macros.protein}</h2>
            <p style={{ margin: 0 }}>protein</p>
          </div>
        </div>
      </div>
    );
  }
}
