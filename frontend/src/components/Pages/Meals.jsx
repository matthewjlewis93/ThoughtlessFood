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
  const [searchedMeals, setSearchedMeals] = useState([]);
  const [mealEdits, setMealEdits] = useState([]);
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
    mealsToShow = mealsToShow.filter((meal) =>
      searchedMeals.map((s) => s._id).includes(meal._id)
    );

    setVisibleMeals(mealsToShow);
    setMealEdits(mealsToShow);
  };

  const handleAddMeal = (e) => {
    e.preventDefault();

    if (meals.length === 0 || meals[0]._id !== "new") {
      setMealStatus({ id: "new", expanded: true, option: "new" });
      setMealEdits([
        {
          _id: "new",
          name: "",
          complete: false,
          lastLogged: createDateString(
            new Date(new Date().setDate(new Date().getDate() + 1))
          ),
          ingredients: [],
        },
        ...meals,
      ]);
      setMeals([
        {
          _id: "new",
          name: "",
          complete: false,
          lastLogged: createDateString(
            new Date(new Date().setDate(new Date().getDate() + 1))
          ),
          ingredients: [],
        },
        ...meals,
      ]);
      setVisibleMeals([
        {
          _id: "new",
          name: "",
          complete: false,
          lastLogged: createDateString(
            new Date(new Date().setDate(new Date().getDate() + 1))
          ),
          ingredients: [],
        },
        ...visibleMeals,
      ]);
      setSearchedMeals([
        {
          _id: "new",
          name: "",
          complete: false,
          lastLogged: createDateString(
            new Date(new Date().setDate(new Date().getDate() + 1))
          ),
          ingredients: [],
        },
        ...searchedMeals,
      ]);
    }
  };

  const handleAddIngredient = (newFood) => {
    let editIndex = mealEdits.findIndex((meal) => meal._id === mealStatus.id);
    setMealEdits(
      mealEdits.toSpliced(editIndex, 1, {
        ...mealEdits[editIndex],
        ingredients: [
          ...mealEdits[editIndex].ingredients,
          {
            name: newFood.name || "",
            calories: newFood.calories || "",
            fat: newFood.fat || "",
            carbs: newFood.carbs || "",
            protein: newFood.protein || "",
            amount: newFood.amount || "",
            unit: newFood.unit || "gram",
          },
        ],
      })
    );
    setUSDADisplay(false);
  };

  const fetchMeals = async () => {
    const res = await fetch(APIUrl + "meals");
    const data = await res.json();
    setMeals(data.data);
    setSearchedMeals(data.data);
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  useEffect(() => {
    editVisibleMeals();
  }, [meals, mealStatus, sortBy, searchedMeals]);

  useEffect(() => {
    if (mealStatus.option !== "new") {
      setMeals(meals.filter((m) => m.complete !== false));
      setMealEdits(meals.filter((m) => m.complete !== false));
      setSearchedMeals(searchedMeals.filter((m) => m.complete !== false));
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
      <div className="search-filter-bar">
        <SearchBar itemList={meals} setItemList={setSearchedMeals} />
        <form
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
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
      </div>

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
