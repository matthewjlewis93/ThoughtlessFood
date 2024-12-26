import { useContext, useEffect, useState } from "react";
import Trash from "../assets/trash.svg";
import Check from "../assets/check.svg";
import X from "../assets/x.svg";
import { AppContext } from "../Providers/ContextProvider";

export default function MealFood({
  food,
  mealEdits,
  setMealEdits,
  status,
  index,
  mealIndex,
  mealFoodAmount,
  setMealFoodAmount,
}) {
  const { APIUrl } = useContext(AppContext);
  const [visible, setVisible] = useState(true);
  const [deleteItem, setDeleteItem] = useState(false);
  const editMeal = (property, value) => {
    if (Boolean(Number(value)) || value == 0) {
      value = Number(value);
    }
    setMealEdits(
      mealEdits.toSpliced(mealIndex, 1, {
        ...mealEdits[mealIndex],
        ingredients: mealEdits[mealIndex].ingredients.toSpliced(index, 1, {
          ...mealEdits[mealIndex].ingredients[index],
          [property]: value !== "" ? value : meal[property],
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

  switch (status) {
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
            <h3>Delete {food.name}?</h3>
          </div>
          <div className="grid-buttons" style={{gridRow: "span 4", borderBottom:"0px", borderLeft: "1px solid"}}>
            <img src={Check} onClick={deleteFood} />
            <img
              src={X}
              onClick={() => setDeleteItem(false)}
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
            <br />
            <input
              placeholder={food.name}
              onChange={(e) => editMeal("name", e.target.value)}
            />
            <div>
              <input
                placeholder={food.amount}
                style={{ width: "2.8em" }}
                onChange={(e) => editMeal("amount", e.target.value)}
              />
              <select
                onChange={(e) => editMeal("unit", e.target.value)}
                style={{ marginLeft: "3px", width: "5em" }}
                defaultValue={food.unit}
              >
                <option value="grams">grams</option>
                <option value="oz">oz</option>
                <option value="mL">mL</option>
                <option value="unit">Unit(s)</option>
              </select>
            </div>

            <div style={{ display: "flex", justifyContent: "right" }}>
              <img
                src={Trash}
                width={24}
                style={{
                  backgroundColor: "#eefded",
                  border: "1px solid #0c335a",
                  borderRadius: "5px",
                }}
                onClick={() => setDeleteItem(true)}
              />
            </div>
          </div>

          <label
            style={{
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
              placeholder={food.calories}
            />{" "}
            calories
          </label>

          <label
            style={{
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
              placeholder={food.fat}
            />
            g fat
          </label>

          <label
            style={{
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
              placeholder={food.carbs}
            />
            g carbs
          </label>

          <label
            style={{
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
              placeholder={food.protein}
            />
            g protein
          </label>
        </div>
      );

    case "new":
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
            <br />
            <input
              placeholder={food.name}
              onChange={(e) => editMeal("name", e.target.value)}
            />
            <br />
            <div>
              <input
                placeholder={food.amount}
                style={{ width: "2.8em" }}
                onChange={(e) => editMeal("amount", e.target.value)}
              />
              <select
                onChange={(e) => editMeal("unit", e.target.value)}
                style={{ marginLeft: "3px", width: "5em" }}
                defaultValue={food.unit}
              >
                <option value="grams">grams</option>
                <option value="oz">oz</option>
                <option value="mL">mL</option>
                <option value="unit">Unit(s)</option>
              </select>
            </div>
          </div>

          <label
            style={{
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
                width: "2.2em",
                fontSize: "12px",
              }}
              placeholder={food.calories}
            />{" "}
            calories
          </label>

          <label
            style={{
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
                width: "2.2em",
                fontSize: "12px",
              }}
              placeholder={food.fat}
            />
            g fat
          </label>

          <label
            style={{
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
                width: "2.2em",
                fontSize: "12px",
              }}
              placeholder={food.carbs}
            />
            g carbs
          </label>

          <label
            style={{
              alignContent: "center",
              paddingLeft: "2px",
              borderLeft: "1px solid",
            }}
          >
            <input
              type="number"
              onChange={(e) => editMeal("protein", e.target.value)}
              style={{
                width: "2.2em",
                fontSize: "12px",
              }}
              placeholder={food.protein}
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
            }}
          >
            <h1>{food.name}</h1>
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
              {" " + food.unit}{" "}
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
            <h1>{food.name}</h1>
            <p>
              {food.amount} {food.unit}
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
