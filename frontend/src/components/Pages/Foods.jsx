import react, { useContext, useState, useEffect } from "react";
import { AppContext } from "../../Providers/ContextProvider";
import FoodDisplay from "../FoodDisplay";
import CloseButton from "../CloseButton";
import createDateString from "../../createDateString";
import SearchBar from "../SearchBar";
import favorite from "../../assets/favorite.svg";

export default function Foods() {
  const { activePage, APIUrl } = useContext(AppContext);
  const [foods, setFoods] = useState([]);
  const [searchedFoods, setSearchedFoods] = useState([]);
  const [favoriteFoods, setFavoriteFoods] = useState([]); //foods displayed
  const [displayedFoods, setDisplayedFoods] = useState([]);
  const [sortBy, setSortBy] = useState("alpha");
  const [foodEdit, setFoodEdit] = useState({});
  const [logDate, setLogDate] = useState(createDateString(new Date()));
  const [filterFavorites, setFilterFavorites] = useState(false);
  const [itemStates, setItemStates] = useState({
    item: "",
    option: "",
  });

  const handleFavorites = () => {
    setFilterFavorites(!filterFavorites);
    if (!filterFavorites === true) {
      setFavoriteFoods(foods.filter((food) => food.favorite));
    } else {
      setFavoriteFoods(foods);
    }
  };

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
    setFavoriteFoods(data.data);
  };

  const newFood = () => {
    const addedFood = {
      _id: document.querySelectorAll("#foods-div .item-container").length,
      name: "",
      lastLogged: createDateString(new Date()),
      category: "fooditem",
      favorite: false,
    };
    setFoods([addedFood, ...foods]);
    setSearchedFoods([...searchedFoods, addedFood]);
    setFavoriteFoods([...favoriteFoods, addedFood]);
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
            favoriteFoods.map((f) => f._id).includes(eachFood._id)
        )
        .sort(
          sortBy === "alpha"
            ? (a, b) => a.name.localeCompare(b.name)
            : (a, b) => b.lastLogged.localeCompare(a.lastLogged)
        )
    );
  }, [favoriteFoods, searchedFoods, foods, sortBy]);

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
      <SearchBar itemList={foods} setItemList={setSearchedFoods} />
      <form
        style={{
          display: "flex",
          justifyContent: "space-between",
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
            value={filterFavorites}
            onChange={handleFavorites}
          />
        </label>
      </form>
      <button
        style={{
          height: "18px",
          width: "100%",
          padding: "0",
          margin: "2px 0 4px 0",
        }}
        onClick={newFood}
      >
        +
      </button>
      <div
        id="foods-div"
        style={{ height: "calc(100% - 115px)", overflow: "auto" }}
      >
        {displayedFoods.map((food, i) => (
          <div key={i}>
            <FoodDisplay
              food={food}
              itemState={itemStates}
              setItemState={setItemStates}
              allFoods={foods}
              setAllFoods={setFoods}
              buttons={["addtolog", "edit", "trash"]}
              link="foods"
              favoritable={true}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
