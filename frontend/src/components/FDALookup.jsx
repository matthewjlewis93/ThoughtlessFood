import { useContext, useState, useEffect } from "react";
import FoodDisplay from "./FoodDisplay";
import { AppContext } from "../Providers/ContextProvider";
import CloseButton from "./CloseButton";

export default function FDALookup({ setAddFood, setDisplay }) {
  const { APIUrl } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const foodLookup = async (e) => {
    e.preventDefault();
    setSearchResults([]);
    setSearching(true);
    let res = await fetch(`${APIUrl}foodlookup/${searchTerm}`);
    res = await res.json();
    const data = res.data;
    setSearching(false);
    setSearchResults(data);
    setSearchTerm("");
    document.getElementById("api-search-bar").blur();
  };

  useEffect(() => {
    document.getElementById("api-search-bar").focus();
  }, []);

  return (
    <div id="food-lookup">
      <div
        style={{
          color: "#FCBA40",
          margin: "5vh auto 0 auto",
          backgroundColor: "#0c335a",
          width: "90%",
          height: "80%",
          border: "2px solid white",
          borderRadius: "10px",
          display: "flex",
          position: "relative",
          flexDirection: "column",
        }}
      >
        <CloseButton functionList={[() => setDisplay(false)]} pageID={""} />
        <h1 style={{ flexGrow: 0 }}>Food Lookup</h1>
        <form style={{ flexGrow: 0 }}>
          <input
            id="api-search-bar"
            style={{ width: "50%" }}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          />{" "}
          <button onClick={(e) => foodLookup(e)}>Search</button>
        </form>
        <div
          style={{
            width: "calc(100% - 20px)",
            backgroundColor: "white",
            margin: "5px auto 5px auto",
            paddingTop: "8px",
            borderRadius: "2px",
            flexGrow: 1,
            color: "black",
            overflow: "auto",
          }}
        >
          {searching && <p>Searching...</p>}
          {searchResults.map((r, i) => (
            <div key={i} style={{ padding: "1px" }}>
              <FoodDisplay
                food={r}
                itemState={{ item: "api" }}
                buttons={["check"]}
                allFoods={[]}
                setAllFoods={setAddFood}
                setItemState={() => {}}
                link={"foods"}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
