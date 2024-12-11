import { useContext, useState } from "react";
import createDateString from "../createDateString";
import checkIcon from "./../assets/check.svg";
import xIcon from "./../assets/x.svg";
import DatePicker from "./DatePicker";
import { AppContext } from "../Providers/ContextProvider";
import FavoriteButton from "./FavoriteButton";

export default function displayFoods({
  food,
  allFoods,
  setAllFoods,
  buttons,
  itemState,
  setItemState,
  link,
  favoritable = false,
}) {
  const { APIUrl } = useContext(AppContext);
  const [foodEdit, setFoodEdit] = useState({});
  const [logDate, setLogDate] = useState(createDateString(new Date()));

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
  };

  const deleteItem = async (foodID) => {
    const res = await fetch(`${APIUrl}${link}/${foodID}`, {
      method: "DELETE",
    });
    setAllFoods(allFoods.filter((food) => food._id !== foodID));
    stateReset();
  };

  const updateFood = async () => {
    const res = await fetch(`${APIUrl}${link}/${foodEdit.id}`, {
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
  };

  if (itemState.item === food._id) {
    switch (itemState.option) {
      case "log":
        let logQuantity = food.amount;
        const date = new Date();
        const dateString = createDateString(date);
        const currentHour = date.getHours();
        let logMeal;
        if (currentHour < 12) {
          logMeal = "Breakfast";
        } else if (currentHour < 17) {
          logMeal = "Lunch";
        } else {
          logMeal = "Dinner";
        }

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
                  onChange={(e) => (logQuantity = e.target.value)}
                  placeholder={food.amount}
                  style={{ width: "3em" }}
                  type="number"
                />
                {" " + food.unit}
              </label>
              <br />
              <select
                defaultValue={logMeal}
                style={{ marginTop: "2px" }}
                onChange={(e) => (logMeal = e.target.value)}
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
              <img
                src={checkIcon}
                onClick={() => submitFoodLog(food._id, logQuantity, logMeal)}
              />
              <img src={xIcon} onClick={stateReset} />
            </div>
          </div>
        );
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
                      name: e.target.value,
                    })
                  }
                  style={{ width: "85%", padding: 0 }}
                  placeholder={food.name}
                />
              </h4>
              <p className="food-amount">
                <input
                  type="number"
                  placeholder={food.amount}
                  style={{ width: "3em" }}
                  onChange={(e) =>
                    setFoodEdit({
                      ...foodEdit,
                      id: food._id,
                      amount: e.target.value,
                    })
                  }
                />
                <select
                  style={{ marginLeft: "3px" }}
                  defaultValue={food.unit}
                  onChange={(e) => {
                    setFoodEdit({
                      ...foodEdit,
                      id: food._id,
                      unit: e.target.value,
                    });
                  }}
                >
                  <option value="grams">grams</option>
                  <option value="oz">oz</option>
                  <option value="mL">mL</option>
                  <option value="unit">Unit(s)</option>
                </select>
              </p>
            </div>
            <p>
              {" "}
              <input
                type="number"
                onChange={(e) =>
                  setFoodEdit({
                    ...foodEdit,
                    id: food._id,
                    calories: e.target.value,
                  })
                }
                placeholder={food.calories}
                style={{ width: "3em", padding: "0" }}
              />{" "}
              calories
            </p>
            <div className="grid-buttons">
              <img src={checkIcon} onClick={updateFood} />
              <img src={xIcon} onClick={stateReset} />
            </div>
            <p>
              <input
                type="number"
                onChange={(e) =>
                  setFoodEdit({
                    ...foodEdit,
                    id: food._id,
                    fat: e.target.value,
                  })
                }
                placeholder={food.fat}
                style={{ width: "3em", padding: "0" }}
              />{" "}
              g fat
            </p>
            <p>
              <input
                type="number"
                onChange={(e) =>
                  setFoodEdit({
                    ...foodEdit,
                    id: food._id,
                    carbs: e.target.value,
                  })
                }
                placeholder={food.carbs}
                style={{ width: "3em", padding: "0" }}
              />{" "}
              g carbs
            </p>
            <p>
              {" "}
              <input
                type="number"
                onChange={(e) =>
                  setFoodEdit({
                    ...foodEdit,
                    id: food._id,
                    protein: e.target.value,
                  })
                }
                placeholder={food.protein}
                style={{ width: "3em", padding: "0" }}
              />{" "}
              g protein
            </p>
          </div>
        );
      case "delete":
        return (
          <div
            key={food._id}
            className="item-container"
            style={{ border: "1px solid #DD1D1D" }}
          >
            <div style={{ textAlign: "center", padding: "15px" }}>
              <h4 className="grid-header" style={{ paddingBottom: "10px" }}>
                Delete {food.name}?
              </h4>
              <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                <button
                  onClick={() => {
                    deleteItem(food._id);
                  }}
                >
                  Yes
                </button>
                <button onClick={stateReset}>No</button>
              </div>
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
          </p>
        </div>
        <p>{food.calories} calories</p>{" "}
        <div className="grid-buttons">
          {buttons.map((button, i) => {
            return (
              <img
                key={i}
                src={button}
                onClick={() =>
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