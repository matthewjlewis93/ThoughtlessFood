import { useContext, useEffect, useState } from "react";
import createDateString from "../createDateString";
import DatePicker from "./DatePicker";
import { AppContext } from "../Providers/ContextProvider";
import FavoriteButton from "./FavoriteButton";
import SquareButton from "./SquareButton";
import unitAutoConverter from "../unitAutoConverter";

export default function displayFoods({
  food,
  allFoods,
  setAllFoods,
  foodEdit = { amount: 0, unit: "gram" },
  setFoodEdit,
  buttons,
  itemState,
  setItemState,
  link,
  favoritable = false,
}) {
  const { APIUrl, setToastInfo } = useContext(AppContext);
  const [logDate, setLogDate] = useState(createDateString(new Date()));
  const [logQuantity, setLogQuantity] = useState(food.amount);
  const [logMeal, setLogMeal] = useState("");
  const [enteredAmount, setEnteredAmount] = useState({
    unit: "gram",
    amount: 0,
  });

  const stateReset = () => {
    setItemState({
      item: "",
      option: "",
    });
    setFoodEdit({});
    setLogDate(createDateString(new Date()));
  };

  const favoritesUpdater = (item) => {
    setAllFoods(
      allFoods.map((foodObj) => {
        if (foodObj._id === item._id) {
          return { ...foodObj, favorite: !foodObj.favorite };
        } else return foodObj;
      })
    );
  };

  const submitFoodLog = async (foodID, logQuantity, logMeal) => {
    let foodToLog = structuredClone(allFoods);
    foodToLog = foodToLog.filter((food) => food._id === foodID)[0];
    delete foodToLog._id;
    foodToLog = {
      ...foodToLog,
      calories: Math.round(
        (Number(foodToLog.calories) / Number(foodToLog.amount)) * logQuantity
      ),
      protein: Math.round(
        (Number(foodToLog.protein) / Number(foodToLog.amount)) * logQuantity
      ),
      carbs: Math.round(
        (Number(foodToLog.carbs) / Number(foodToLog.amount)) * logQuantity
      ),
      fat: Math.round(
        (Number(foodToLog.fat) / Number(foodToLog.amount)) * logQuantity
      ),
      amount: logQuantity,
      unit: foodToLog.unit,
      meal: logMeal,
      date: logDate,
    };
    const res = await fetch(`${APIUrl}log`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(foodToLog),
    });
    await fetch(`${APIUrl}foods/${foodID}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ lastLogged: new Date().toJSON() }),
    });
    setAllFoods(
      allFoods.map((f) => {
        if (f._id == foodID) {
          return { ...f, lastLogged: new Date().toJSON() };
        } else return f;
      })
    );
    stateReset();
    setToastInfo({
      toastActivated: true,
      toastMessage: `${food.name} logged!`,
      positive: true,
    });
  };

  const deleteItem = async (foodID) => {
    const res = await fetch(`${APIUrl}${link}/${foodID}`, {
      method: "DELETE",
    });
    setAllFoods(allFoods.filter((food) => food._id !== foodID));
    stateReset();
    setToastInfo({
      toastActivated: true,
      toastMessage: `${food.name} deleted!`,
      positive: true,
    });
  };

  const addFood = async () => {
    if (!foodEdit.name && !food.name && !food.placeholderName) {
      setToastInfo({
        toastActivated: true,
        toastMessage: "Please name your food",
        positive: false,
      });
      return;
    }
    const foodObj = {
      name: foodEdit.name || food.name || food.placeholderName,
      amount: foodEdit.amount || food.amount || 1,
      calories: foodEdit.calories || food.calories || 0,
      fat: foodEdit.fat || food.fat || 0,
      carbs: foodEdit.carbs || food.carbs || 0,
      protein: foodEdit.protein || food.protein || 0,
      unit: foodEdit.unit || food.unit || "gram",
      lastLogged: createDateString(new Date(0)),
      favorite: false,
      category: "fooditem",
    };
    delete foodObj._id;

    const res = await fetch(`${APIUrl}foods`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(foodObj),
    });
    const resData = await res.json();
    if (resData.success) {
      foodObj._id = food._id;
      setAllFoods([...allFoods.splice(1), resData.data]);
      stateReset();
      setToastInfo({
        toastActivated: true,
        toastMessage: `${foodObj.name} added!`,
        positive: true,
      });
    }
  };
  const cancelAddFood = () => {
    stateReset();
    setAllFoods([...allFoods.splice(1)]);
  };

  const scaleMacros = (e) => {
    e.preventDefault();
    const newAmount = e.target.form[0].value;
    const oldAmount = foodEdit.amount || food.amount;

    if (newAmount === "") {
      setToastInfo({
        toastActivated: true,
        toastMessage: "Please enter an amount to scale to",
        positive: false,
      });
      return;
    }
    if (oldAmount === "" || oldAmount === 0) {
      setToastInfo({
        toastActivated: true,
        toastMessage: "Food amount can't be blank or 0",
        positive: false,
      });
      return;
    }
    setEnteredAmount({ unit: foodEdit.unit, amount: newAmount });
    setFoodEdit({
      ...foodEdit,
      id: food._id,
      amount: newAmount,
      calories: foodEdit.calories
        ? Math.round((foodEdit.calories / oldAmount) * newAmount)
        : Math.round((food.calories / oldAmount) * newAmount),
      fat: foodEdit.fat
        ? Math.round((foodEdit.fat / oldAmount) * newAmount)
        : Math.round((food.fat / oldAmount) * newAmount),
      carbs: foodEdit.carbs
        ? Math.round((foodEdit.carbs / oldAmount) * newAmount)
        : Math.round((food.carbs / oldAmount) * newAmount),
      protein: foodEdit.protein
        ? Math.round((foodEdit.protein / oldAmount) * newAmount)
        : Math.round((food.protein / oldAmount) * newAmount),
    });
  };

  const updateFood = async () => {
    const res = await fetch(`${APIUrl}${link}/${food._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(foodEdit),
    });
    setItemState({ item: "" });
    setAllFoods(
      allFoods.map((food) => {
        if (food._id == foodEdit.id) {
          return { ...food, ...foodEdit };
        } else {
          return food;
        }
      })
    );
    setToastInfo({
      toastActivated: true,
      toastMessage: `${food.name} updated!`,
      positive: true,
    });
  };

  const changeUnit = (e) => {
    const newAmount = unitAutoConverter(
      enteredAmount.unit || "gram",
      e.target.value,
      enteredAmount.amount
    );
    setFoodEdit({
      ...foodEdit,
      id: food._id,
      unit: e.target.value,
      amount: newAmount,
    });
  };

  useEffect(() => {
    if (food.amount) {
      setEnteredAmount({
        amount: food.amount,
        unit: food.unit,
      });
    }
    const date = new Date();
    const dateString = createDateString(date);
    const currentHour = date.getHours();
    if (currentHour < 12) {
      setLogMeal("Breakfast");
    } else if (currentHour < 17) {
      setLogMeal("Lunch");
    } else {
      setLogMeal("Dinner");
    }
  }, [food]);

  if (itemState.item === food._id) {
    switch (itemState.option) {
      case "log":
        // setLogQuantity(food.amount);

        return (
          <div
            key={food._id}
            className="item-container grid-container"
            style={{ gridTemplateColumns: "1fr 60px" }}
          >
            <div style={{ paddingLeft: "2px" }}>
              <h4 className="grid-header">{food.name}</h4>
              <label htmlFor="amount">
                Amount to log:
                <input
                  id="amount"
                  onChange={(e) =>
                    setLogQuantity(Number(e.target.value || food.amount))
                  }
                  placeholder={food.amount}
                  style={{ width: "3em" }}
                  type="number"
                />
                {" " + food.unit}
                {food.unit === "unit" || food.unit === "gram" ? "(s)" : ""}
              </label>
              <br />
              <select
                defaultValue={logMeal}
                style={{ marginTop: "2px" }}
                onChange={(e) => setLogMeal(e.target.value)}
              >
                <option value="Breakfast">Breakfast</option>
                <option value="Morning Snack">Morning Snack</option>
                <option value="Lunch">Lunch</option>
                <option value="Afternoon Snack">Afternoon Snack</option>
                <option value="Dinner">Dinner</option>
                <option value="Evening Snack">Evening Snack</option>
              </select>
              <br />
              <DatePicker defaultDate={logDate} setDefaultDate={setLogDate} />
            </div>
            <div className="grid-buttons">
              <SquareButton
                icon="check"
                onClickFunction={() =>
                  submitFoodLog(food._id, logQuantity, logMeal)
                }
              />
              <SquareButton icon="x" onClickFunction={stateReset} />
            </div>
          </div>
        );
      case "new":
      case "edit":
        return (
          <div
            key={food._id}
            className="grid-container item-container"
            style={{ border: "1px solid #555" }}
          >
            <div>
              <h4 className="grid-header">
                <input
                  onChange={(e) =>
                    setFoodEdit({
                      ...foodEdit,
                      id: food._id,
                      placeholderName: e.target.value,
                      name: e.target.value
                    })
                  }
                  style={{ width: "85%", padding: 0 }}
                  value={foodEdit.placeholderName || foodEdit.name || ""}
                  // placeholder={food.placeholderName || food.name}
                />
              </h4>
              <p className="food-amount">
                {food.unit !== "Meal" ? (
                  <>
                    <input
                      type="number"
                      placeholder={food.amount}
                      style={{ width: "3em" }}
                      value={foodEdit.amount + 1 ? foodEdit.amount : ""}
                      onChange={(e) => {
                        setFoodEdit({
                          ...foodEdit,
                          id: food._id,
                          amount: e.target.value,
                        });
                        setEnteredAmount({
                          unit: foodEdit.unit,
                          amount: e.target.value,
                        });
                      }}
                    />
                    <select
                      style={{ marginLeft: "3px" }}
                      defaultValue={food.unit}
                      onChange={(e) => {
                        changeUnit(e);
                        if (enteredAmount.amount === 0) {
                          setEnteredAmount({
                            ...enteredAmount,
                            unit: e.target.value,
                          });
                        }
                      }}
                    >
                      <option value="gram">grams</option>
                      <option value="oz">oz</option>
                      <option value="mL">mL</option>
                      <option value="unit">Unit(s)</option>
                    </select>
                  </>
                ) : (
                  "1 Meal"
                )}
              </p>
              <form autoComplete="off" style={{ margin: "8px 3px" }}>
                <label>
                  Scale Amount:
                  <br />
                  <input
                    id="scale"
                    type="number"
                    style={{ width: "3em" }}
                  />{" "}
                  <button
                    onClick={(e) => {
                      scaleMacros(e);
                    }}
                  >
                    Scale
                  </button>
                </label>
              </form>
            </div>
            <p>
              {" "}
              <input
                type="number"
                value={foodEdit.calories + 1 ? foodEdit.calories : ""}
                onChange={(e) =>
                  setFoodEdit({
                    ...foodEdit,
                    id: food._id,
                    calories: e.target.value,
                  })
                }
                placeholder={food.calories}
                style={{ width: "2.6em", padding: "0" }}
              />{" "}
              calories
            </p>
            <div className="grid-buttons">
              <SquareButton
                icon="check"
                onClickFunction={
                  itemState.option === "edit" ? updateFood : addFood
                }
              />
              <SquareButton
                icon="x"
                onClickFunction={
                  itemState.option === "edit" ? stateReset : cancelAddFood
                }
              />
            </div>
            <p>
              <input
                type="number"
                value={foodEdit.fat + 1 ? foodEdit.fat : ""}
                onChange={(e) =>
                  setFoodEdit({
                    ...foodEdit,
                    id: food._id,
                    fat: e.target.value,
                  })
                }
                placeholder={food.fat}
                style={{ width: "2.6em", padding: "0" }}
              />{" "}
              g fat
            </p>
            <p>
              <input
                type="number"
                value={foodEdit.carbs + 1 ? foodEdit.carbs : ""}
                onChange={(e) =>
                  setFoodEdit({
                    ...foodEdit,
                    id: food._id,
                    carbs: e.target.value,
                  })
                }
                placeholder={food.carbs}
                style={{ width: "2.6em", padding: "0" }}
              />{" "}
              g carbs
            </p>
            <p>
              {" "}
              <input
                type="number"
                value={foodEdit.protein + 1 ? foodEdit.protein : ""}
                onChange={(e) =>
                  setFoodEdit({
                    ...foodEdit,
                    id: food._id,
                    protein: e.target.value,
                  })
                }
                placeholder={food.protein}
                style={{ width: "2.6em", padding: "0" }}
              />{" "}
              g protein
            </p>
          </div>
        );
      case "delete":
        return (
          <div
            key={food._id}
            className="grid-container item-container"
            style={{ border: "1px solid #555" }}
          >
            <div style={{ gridColumn: "span 2" }}>
              <h4 className="grid-header" style={{ color: "#DD1D1D" }}>
                Delete {food.name}?
              </h4>
            </div>
            <div className="grid-buttons">
              <SquareButton
                icon="check"
                onClickFunction={() => {
                  deleteItem(food._id);
                }}
              />
              <SquareButton icon="x" onClickFunction={stateReset} />
            </div>
          </div>
        );
    }
  } else {
    return (
      <div key={food._id} className="grid-container item-container">
        <div style={{ position: "relative" }}>
          {favoritable && (
            <FavoriteButton
              item={food}
              allItems={allFoods}
              link="foods"
              update={favoritesUpdater}
            />
          )}
          <h4 className="grid-header">{food.name}</h4>
          <p className="food-amount">
            {food.amount} {food.unit}
            {food.amount != 1 && (food.unit === "unit" || food.unit === "gram")
              ? "s"
              : ""}
          </p>
        </div>
        <p>{food.calories} calories</p>{" "}
        <div className="grid-buttons">
          {buttons.map((button, i) => {
            return (
              <SquareButton
                key={i}
                icon={button}
                onClickFunction={
                  itemState.item == "api"
                    ? () => setAllFoods(food)
                    : () =>
                        setItemState({
                          item: food._id,
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
        <p>{food.fat}g fat</p>
        <p>{food.carbs}g carbs</p>
        <p>{food.protein}g protein</p>
      </div>
    );
  }
}
