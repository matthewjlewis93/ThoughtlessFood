import react, { useEffect, useContext, useState } from "react";
import { AppContext } from "../../Providers/ContextProvider";
import CloseButton from "../CloseButton";
import FoodDisplay from "../FoodDisplay";
import MealDisplay from "../MealDisplay";

export default function SeeWhatFits() {
  const { activePage, macroTotals, APIUrl, theme, calorieGoal } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState("Foods");
  const [whatFits, setWhatFits] = useState({ foods: [], meals: [] });
  const [itemState, setItemState] = useState({ id: "", option: "" });
  const [mealStatus, setMealStatus] = useState({
    id: "",
    expanded: false,
    option: "",
  });

  const getWhatFits = async () => {
    let res = await fetch(APIUrl + "whatfits/" + (calorieGoal - macroTotals.calories));
    res = await res.json();
    const data = res.data;
    setWhatFits(data);
  };

  useEffect(() => {
    getWhatFits();
  }, [macroTotals]);

  return (
    <div
      id="see-what-fits"
      className={"container-box main-page " + "subpage transition"}
    >
      <CloseButton
        pageID="see-what-fits"
        functionList={[
          () => {
            setItemState({ id: "", option: "" });
          },
          () => document.getElementById("what-fits-div").scroll(0, "smooth"),
        ]}
      />

      <h1>
        See What Fits
        <hr />
      </h1>

      <div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            marginBottom: "2px",
          }}
        >
          <div>
            <h4
              onClick={() => setActiveTab("Foods")}
              style={{
                textAlign: "center",
                color:
                  theme === "light"
                    ? "black"
                    : activeTab == "Foods"
                    ? "black"
                    : "white",
                backgroundColor: activeTab == "Foods" ? "#ffffff" : "#00000030",
                borderTopLeftRadius: "4px",
                borderTopRightRadius: "4px",
                padding: "6px",
                margin: "0",
                borderLeft: "1px solid #00000080",
                borderRight:
                  activeTab == "Foods" ? "1px solid" : "1px solid #00000005",
                borderBottom: "1px solid",
              }}
            >
              Foods
            </h4>
          </div>
          <div>
            <h4
              onClick={() => setActiveTab("Meals")}
              style={{
                textAlign: "center",
                color:
                  theme === "light"
                    ? "black"
                    : activeTab == "Foods"
                    ? "white"
                    : "black",
                backgroundColor: activeTab == "Meals" ? "#ffffff" : "#00000030",
                borderTopLeftRadius: "4px",
                borderTopRightRadius: "4px",
                padding: "6px",
                margin: "0",
                borderRight: "1px solid #00000080",
                borderLeft:
                  activeTab == "Meals" ? "1px solid" : "1px solid #00000005",
                borderBottom: "1px solid",
              }}
            >
              Meals
            </h4>
          </div>
        </div>
        <div id="what-fits-div">
          {activeTab === "Foods"
            ? whatFits.foods.map((food) => (
                <FoodDisplay
                  key={food._id}
                  food={food}
                  allFoods={whatFits.foods}
                  setAllFoods={() => {}}
                  buttons={["addtolog"]}
                  itemState={itemState}
                  setItemState={setItemState}
                />
              ))
            : whatFits.meals.map((meal, i) => (
                <MealDisplay
                  key={meal._id}
                  meal={meal}
                  mealEdits={whatFits.meals}
                  mealIndex={i}
                  mealStatus={mealStatus}
                  setMealStatus={setMealStatus}
                  buttons={["addtolog"]}
                />
              ))}
        </div>
      </div>
    </div>
  );
}
