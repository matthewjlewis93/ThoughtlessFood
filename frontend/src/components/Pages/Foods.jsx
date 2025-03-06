import react, { useContext, useState, useEffect } from "react";
import { AppContext } from "../../Providers/ContextProvider";
import FoodDisplay from "../FoodDisplay";
import CloseButton from "../CloseButton";
import createDateString from "../../createDateString";
import SearchBar from "../SearchBar";
import favorite from "../../assets/favorite.svg";
import USDALookup from "../USDALookup";

export default function Foods() {
  const { activePage, APIUrl } = useContext(AppContext);
  const [foods, setFoods] = useState([]);
  const [searchedFoods, setSearchedFoods] = useState([]);
  const [displayedFoods, setDisplayedFoods] = useState([]);
  const [sortBy, setSortBy] = useState("alpha");
  const [foodEdit, setFoodEdit] = useState({ amount: 0, unit: "" });
  const [logDate, setLogDate] = useState(createDateString(new Date()));
  const [filterFavorites, setFilterFavorites] = useState(false);
  const [displayFoodLookup, setDisplayFoodLookup] = useState(false);
  const [itemStates, setItemStates] = useState({
    item: "",
    option: "",
  });

  const futureDate = () => {
    const dateToday = new Date();
    dateToday.setDate(dateToday.getDate() + 2);
    return dateToday;
  }

  const stateReset = () => {
    setItemStates({
      item: "",
      option: "",
    });
    setFoodEdit({});
    setLogDate(createDateString(new Date()));
  };

  const fetchFoods = async () => {
    setFilterFavorites(false);
    const res = await fetch(APIUrl + "foods");
    const data = await res.json();
    setFoods(data.data);
    setSearchedFoods(data.data);
  };

  const addFoodFromLookup = (food) => {
    newFood(food);
    setDisplayFoodLookup(false);
  };

  const newFood = (food) => {
    const addedFood = {
      _id: document.querySelectorAll("#foods-div .item-container").length,
      placeholderName: food ? food.name : "",
      name: food ? food.name : "",
      fat: food ? food.fat : "",
      calories: food ? food.calories : "",
      carbs: food ? food.carbs : "",
      protein: food ? food.protein : "",
      amount: food ? food.amount : "",
      unit: food ? food.unit : "gram",
      lastLogged: createDateString(futureDate()),
      category: "fooditem",
      favorite: false,
    };
    setFoods([addedFood, ...foods]);
    setSearchedFoods([addedFood, ...searchedFoods]);
    setItemStates({
      item: document.querySelectorAll("#foods-div .item-container").length,
      option: "new",
    });
  };

  const [currentlyActive, setCurrentlyActive] = useState(0);
  useEffect(() => {
    if (activePage === "Foods") {
      setCurrentlyActive(currentlyActive + 1);
    }
  }, [activePage]);

  useEffect(() => {
    fetchFoods();
  }, [currentlyActive]);

  useEffect(() => {

    setDisplayedFoods(
      foods
        .filter(
          (eachFood) =>
            searchedFoods.map((f) => f._id).includes(eachFood._id) &&
            (filterFavorites ? eachFood.favorite : true)
        )
        .sort(
          sortBy === "alpha"
            ? (a, b) => a.name.localeCompare(b.name)
            : (a, b) => b.lastLogged.localeCompare(a.lastLogged)
        )
    );
  }, [filterFavorites, searchedFoods, foods, sortBy]);

  useEffect(() => {
    if (itemStates.option === "edit") {
      setFoodEdit(foods.find((f) => f._id === itemStates.item));
    } else if (itemStates.option === "new") {
      setFoodEdit(foods[0]);
    } else {
      setFoodEdit({ amount: 0, unit: "gram" });
    }
  }, [itemStates]);

  return (
    <div
      id="foods"
      className={"container-box main-page " + "subpage transition"}
    >
      <CloseButton
        functionList={[
          stateReset,
          () => document.getElementById("foods-div").scroll(0, "smooth"),
          () =>
            Array.from(document.getElementsByClassName("search-bar")).forEach(
              (e) => (e.value = "")
            ),
        ]}
        pageID="foods"
      />
      <h1>
        Saved Foods
        <hr />
      </h1>
      <div className="search-filter-bar">
        <SearchBar itemList={foods} setItemList={setSearchedFoods} />
        <form
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            marginBottom: "1px",
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

          <label>
            <img src={favorite} />
            <input
              type="checkbox"
              checked={filterFavorites}
              onChange={() => setFilterFavorites(!filterFavorites)}
            />
          </label>
        </form>
      </div>

      <button
        style={{
          height: "18px",
          width: "49%",
          padding: "0",
          margin: "2px 1% 4px 0px",
        }}
        onClick={newFood}
      >
        Create New Food
      </button>
      <button
        style={{
          height: "18px",
          width: "49%",
          padding: "0",
          margin: "2px 0px 4px 1%",
        }}
        onClick={() => {
          setDisplayFoodLookup(true);
        }}
      >
        Search Basic Foods
      </button>
      <div id="foods-div">
        {displayedFoods.map((food, i) => (
          <div key={i}>
            <FoodDisplay
              food={food}
              itemState={itemStates}
              setItemState={setItemStates}
              allFoods={foods}
              setAllFoods={setFoods}
              foodEdit={foodEdit}
              setFoodEdit={setFoodEdit}
              buttons={["addtolog", "edit", "trash"]}
              link="foods"
              favoritable={true}
            />
          </div>
        ))}
      </div>
      {displayFoodLookup && (
        <USDALookup
          setAddFood={addFoodFromLookup}
          setDisplay={setDisplayFoodLookup}
        />
      )}
    </div>
  );
}
