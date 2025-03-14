import { useContext, useEffect, useState } from "react";
import { AppContext } from "../Providers/ContextProvider";
import SquareButton from "./SquareButton";
import unitAutoConverter from "../unitAutoConverter";

export default function MealFood({
  food,
  meal,
  mealEdits,
  setMealEdits,
  status,
  index,
  mealIndex,
  mealFoodAmount,
  setMealFoodAmount,
}) {
  const { APIUrl, setToastInfo } = useContext(AppContext);
  const [visible, setVisible] = useState(true);
  const [deleteItem, setDeleteItem] = useState(false);
  const [enteredAmount, setEnteredAmount] = useState({
    unit: "gram",
    amount: 0,
  });

  const editMeal = (property, value) => {
    if (property !== "name" && property !== "unit" && value !== "") {
      value = Number(value);
    }
    setMealEdits(
      mealEdits.toSpliced(mealIndex, 1, {
        ...mealEdits[mealIndex],
        ingredients: mealEdits[mealIndex].ingredients.toSpliced(index, 1, {
          ...mealEdits[mealIndex].ingredients[index],
          [property]: value,
        }),
      })
    );
  };

  const deleteFood = () => {
    let updatedMealToSend = structuredClone(mealEdits);
    updatedMealToSend[mealIndex].ingredients = updatedMealToSend[
      mealIndex
    ].ingredients.filter((x, i) => i !== index);
    setMealEdits(updatedMealToSend);
    setVisible(false);
    setDeleteItem(false);
  };

  const scaleFood = (e) => {
    e.preventDefault();
    const newAmount = e.target.form[0].value;
    const oldAmount = mealEdits[mealIndex].ingredients[index].amount;
    if (oldAmount === 0 || oldAmount === "") {
      setToastInfo({
        toastActivated: true,
        toastMessage: "Ingredient amount can't be blank or 0",
        positive: false,
      });
      return;
    }
    if (newAmount === "") {
      setToastInfo({
        toastActivated: true,
        toastMessage: "Please set amount to scale to",
        positive: false,
      });
      return;
    }
    setEnteredAmount({unit: food.unit, amount: newAmount});
    const thisIngredient = mealEdits[mealIndex].ingredients[index];
    setMealEdits(
      mealEdits.toSpliced(mealIndex, 1, {
        ...mealEdits[mealIndex],
        ingredients: mealEdits[mealIndex].ingredients.toSpliced(index, 1, {
          ...mealEdits[mealIndex].ingredients[index],
          amount: newAmount,
          calories: Math.round(
            (thisIngredient.calories / oldAmount) * newAmount
          ),
          fat: Math.round((thisIngredient.fat / oldAmount) * newAmount),
          carbs: Math.round((thisIngredient.carbs / oldAmount) * newAmount),
          protein: Math.round((thisIngredient.protein / oldAmount) * newAmount),
        }),
      })
    );
  };
  const changeUnit = (newUnit) => {
    const newAmount = unitAutoConverter(
      enteredAmount.unit,
      newUnit.target.value,
      enteredAmount.amount
    );
    setMealEdits(
      mealEdits.toSpliced(mealIndex, 1, {
        ...mealEdits[mealIndex],
        ingredients: mealEdits[mealIndex].ingredients.toSpliced(index, 1, {
          ...mealEdits[mealIndex].ingredients[index],
          unit: newUnit.target.value,
          amount: newAmount,
        }),
      })
    );
  };

  useEffect(() => {
    if (food.amount) {
      setEnteredAmount({
        amount: food.amount,
        unit: food.unit,
      });
    }
  }, []);

  switch (status) {
    case "new":
    case "edit":
      return deleteItem ? (
        <div
          className={"item-container meal-food "}
          style={{ display: visible ? "" : "none" }}
        >
          <div
            style={{
              gridRow: "span 4",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "5px",
            }}
          >
            <h3>Delete?</h3>
          </div>
          <div
            className="grid-buttons"
            style={{
              gridRow: "span 4",
              borderBottom: "0px",
              borderLeft: "1px solid",
            }}
          >
            <SquareButton icon="check" onClickFunction={deleteFood} />
            <SquareButton
              icon="x"
              onClickFunction={() => setDeleteItem(false)}
            />
          </div>
        </div>
      ) : (
        <div
          className={"item-container meal-food "}
          style={{ display: visible ? "" : "none" }}
        >
          <div
            style={{
              gridRow: "span 4",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "5px",
            }}
          >
            <input
              value={food.name}
              onChange={(e) => editMeal("name", e.target.value)}
            />
            <div>
              <input
                type="number"
                value={food.amount}
                style={{ width: "2.8em" }}
                onChange={(e) => {
                  editMeal("amount", e.target.value);
                  setEnteredAmount({
                    unit: food.unit,
                    amount: e.target.value,
                  });
                }}
              />
              <select
                onChange={(e) => {
                  changeUnit(e);
                  if (enteredAmount.amount === 0) {
                    setEnteredAmount({
                      ...enteredAmount,
                      unit: e.target.value,
                    });
                  }
                }}
                style={{ marginLeft: "3px", width: "5em" }}
                defaultValue={food.unit}
              >
                <option value="gram">grams</option>
                <option value="oz">oz</option>
                <option value="mL">mL</option>
                <option value="unit">Unit(s)</option>
              </select>
            </div>
            <br />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                margin: "-5px 0",
              }}
            >
              <form autoComplete="off">
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
                      scaleFood(e);
                    }}
                  >
                    Scale
                  </button>
                </label>
              </form>
              {
                <SquareButton
                  icon="trash"
                  onClickFunction={() => setDeleteItem(true)}
                />
              }{" "}
            </div>
          </div>

          <label
            style={{
              fontSize: "14px",
              alignContent: "center",
              paddingLeft: "2px",
              borderLeft: "1px solid",
              borderBottom: "1px solid",
            }}
          >
            <input
              type="number"
              onChange={(e) => editMeal("calories", e.target.value)}
              style={{
                width: "2.5em",
              }}
              value={food.calories}
            />{" "}
            calories
          </label>

          <label
            style={{
              fontSize: "14px",
              alignContent: "center",
              paddingLeft: "2px",
              borderLeft: "1px solid",
              borderBottom: "1px solid",
            }}
          >
            <input
              type="number"
              onChange={(e) => editMeal("fat", e.target.value)}
              style={{
                width: "2.5em",
              }}
              value={food.fat}
            />
            g fat
          </label>

          <label
            style={{
              fontSize: "14px",
              alignContent: "center",
              paddingLeft: "2px",
              borderLeft: "1px solid",
              borderBottom: "1px solid",
            }}
          >
            <input
              type="number"
              onChange={(e) => editMeal("carbs", e.target.value)}
              style={{
                width: "2.5em",
              }}
              value={food.carbs}
            />
            g carbs
          </label>

          <label
            style={{
              fontSize: "14px",
              alignContent: "center",
              paddingLeft: "2px",
              borderLeft: "1px solid",
            }}
          >
            <input
              type="number"
              onChange={(e) => editMeal("protein", e.target.value)}
              style={{
                width: "2.5em",
              }}
              value={food.protein}
            />
            g protein
          </label>
        </div>
      );

    case "log":
      return (
        <div className="item-container meal-food">
          <div
            style={{
              gridRow: "span 4",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "5px",
              gap: "2px",
            }}
          >
            <h2>{food.name}</h2>
            <label>
              Amount to log: <br />
              <input
                type="number"
                style={{ width: "2.5em" }}
                placeholder={food.amount}
                onChange={(e) =>
                  setMealFoodAmount({
                    ...mealFoodAmount,
                    [index]:
                      e.target.value === ""
                        ? food.amount
                        : Number(e.target.value),
                  })
                }
              />
              {" " + food.unit}
              {food.unit === "unit" || food.unit === "gram" ? "(s)" : ""}
            </label>
          </div>

          <p
            style={{
              paddingLeft: "2px",
              borderLeft: "1px solid",
              borderBottom: "1px solid",
            }}
          >
            {food.calories} calories
          </p>
          <p
            style={{
              paddingLeft: "2px",
              borderLeft: "1px solid",
              borderBottom: "1px solid",
            }}
          >
            {food.fat}g fat
          </p>
          <p
            style={{
              paddingLeft: "2px",
              borderLeft: "1px solid",
              borderBottom: "1px solid",
            }}
          >
            {food.carbs}g carbs
          </p>
          <p style={{ paddingLeft: "2px", borderLeft: "1px solid" }}>
            {food.protein}g protein
          </p>
        </div>
      );

    default:
      return (
        <div className="item-container meal-food">
          <div
            style={{
              gridRow: "span 4",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "5px",
            }}
          >
            <h2>{food.name}</h2>
            <p>
              {food.amount} {food.unit}
              {food.amount != 1 &&
              (food.unit === "unit" || food.unit === "gram")
                ? "s"
                : ""}
            </p>
          </div>

          <p
            style={{
              paddingLeft: "2px",
              borderLeft: "1px solid",
              borderBottom: "1px solid",
            }}
          >
            {food.calories} calories
          </p>
          <p
            style={{
              paddingLeft: "2px",
              borderLeft: "1px solid",
              borderBottom: "1px solid",
            }}
          >
            {food.fat}g fat
          </p>
          <p
            style={{
              paddingLeft: "2px",
              borderLeft: "1px solid",
              borderBottom: "1px solid",
            }}
          >
            {food.carbs}g carbs
          </p>
          <p style={{ paddingLeft: "2px", borderLeft: "1px solid" }}>
            {food.protein}g protein
          </p>
        </div>
      );
  }
}
