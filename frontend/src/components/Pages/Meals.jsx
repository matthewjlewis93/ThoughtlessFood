import react, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../Providers/ContextProvider";
import CloseButton from "../CloseButton";
import MealDisplay from "../MealDisplay";
import SearchBar from "../SearchBar";
import createDateString from "../../createDateString";
import USDALookup from "../USDALookup";

export default function Meals() {
  const { APIUrl } = useContext(AppContext);
  const [meals, setMeals] = useState([]);
  const [visibleMeals, setVisibleMeals] = useState([]);
  const [mealEdits, setMealEdits] = useState({});
  const [sortBy, setSortBy] = useState("alpha");
  const [USDADisplay, setUSDADisplay] = useState(false);
  const [mealStatus, setMealStatus] = useState({
    id: "",
    expanded: false,
    option: "",
  });

  const editVisibleMeals = () => {
    let mealsToShow = structuredClone(meals);
    mealsToShow.sort(
      sortBy === "alpha"
        ? (a, b) => a.name.localeCompare(b.name)
        : (a, b) => b.lastLogged.localeCompare(a.lastLogged)
    );
    setVisibleMeals(mealsToShow);
    setMealEdits(mealsToShow);
  };

  const handleAddMeal = (e) => {
    e.preventDefault();
  
    if (meals.length === 0 || meals[0]._id !== "new") {
      setVisibleMeals([
        {
          _id: "new",
          name: "",
          complete: false,
          lastLogged: createDateString(new Date("1900-1-1")),
          ingredients: [
            // { calories: 0, fat: 0, carbs: 0, protein: 0, amount: 0, unit: "grams" },
          ],
        },
        ...meals,
      ]);
      setMealStatus({ id: "new", expanded: true, option: "new" });
    }
  };

  const handleAddIngredient = (newFood) => {
    // setMeals([
    //   {
    //     ...mealEdits[0],
    //     ingredients: [
    //       ...mealEdits[0].ingredients,
    //       {
    //         name: newFood.name || "",
    //         calories: newFood.calories || 0,
    //         fat: newFood.fat || 0,
    //         carbs: newFood.carbs || 0,
    //         protein: newFood.protein || 0,
    //         amount: newFood.amount || 0,
    //         unit: "gram",
    //       },
    //     ],
    //   },
    //   ...mealEdits.slice(1),
    // ]);
    setMealEdits([
      {
        ...mealEdits[0],
        ingredients: [
          ...mealEdits[0].ingredients,
          {
            name: newFood.name || "",
            calories: newFood.calories || 0,
            fat: newFood.fat || 0,
            carbs: newFood.carbs || 0,
            protein: newFood.protein || 0,
            amount: newFood.amount || 0,
            unit: "gram",
          },
        ],
      },
      ...mealEdits.slice(1),
    ]);
    setUSDADisplay(false);
  };

  const fetchMeals = async () => {
    const res = await fetch(APIUrl + "meals");
    const data = await res.json();
    setMeals(data.data);
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  useEffect(() => {
    editVisibleMeals();
  }, [meals, mealStatus, sortBy]);

  useEffect(() => {
    if (mealStatus.option !== "new") {
      setMeals(meals.filter((m) => m.complete !== false));
      setMealEdits(meals.filter((m) => m.complete !== false));
    } else {
      setMealEdits(meals);
    }
  }, [mealStatus]);

  return (
    <div
      id="meals"
      className={"container-box main-page " + "subpage transition"}
    >
      <CloseButton
        pageID="meals"
        functionList={[
          () => {
            setMealStatus({ id: "", expanded: false, option: "" });
          },
          () => document.getElementById("meal-div").scroll(0, "smooth"),
        ]}
      />
      <h1>
        Saved Meals
        <hr />
      </h1>
      <SearchBar itemList={mealEdits} setItemList={setVisibleMeals} />
      <form
        style={{
          display: "flex",
          justifyContent: "space-between",
          maxWidth: "425px",
          margin: "0px auto 2px auto",
        }}
      >
        <label>
          Alphabetical
          <input
            name="sort"
            type="radio"
            defaultChecked={true}
            onChange={() => setSortBy("alpha")}
          />
        </label>

        <label>
          Recently Logged
          <input
            name="sort"
            type="radio"
            onChange={() => setSortBy("recent")}
          />
        </label>
        <button onClick={(e) => handleAddMeal(e)}>Add Meal</button>
      </form>
      <div id={"meal-div"}>
        {visibleMeals.map((e, i) => (
          <div key={e._id}>
            <MealDisplay
              meal={e}
              mealEdits={mealEdits}
              setMealEdits={setMealEdits}
              mealIndex={i}
              updateMeals={setMeals}
              setMealStatus={setMealStatus}
              mealStatus={mealStatus}
              setMeals={setMeals}
              handleAddIngredient={handleAddIngredient}
              setUSDADisplay={setUSDADisplay}
              buttons={["addtolog", "edit", "trash"]}
            />
          </div>
        ))}
      </div>
      {USDADisplay && (
        <USDALookup
          setAddFood={handleAddIngredient}
          setDisplay={setUSDADisplay}
        />
      )}
    </div>
  );
}
