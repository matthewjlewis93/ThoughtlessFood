import { createContext, useState } from "react";
import useLocalStorage from "../useLocalStorage";

const AppContext = createContext();

const ContextProvider = ({ children, theme, setTheme }) => {
  // Active page
  const [activePage, setActivePage] = useState("HomePage");
  const updateActivePage = (ActivePage) => setActivePage(ActivePage);

  // API link provider
  // const [APIUrl] = useState("https://4pm9081m-8080.usw3.devtunnels.ms/api/");
  const [APIUrl] = useState("/api/");
  // const [APIUrl] = useState("http://192.168.1.110:8080/api/");

  //Today's Macro Info
  const [macroTotals, setMacroTotals] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    date: "",
  });
  const updateMacros = (macros) => setMacroTotals(macros);
  const addToMacros = (macros) => {
    const todaysDate = new Date();
    const month = (todaysDate.getMonth() + 1).toString().padStart(2, "0");
    const day = todaysDate.getDate().toString().padStart(2, "0");
    const todaysDateString = `${todaysDate.getFullYear()}-${month}-${day}`;
    let newMacros = structuredClone(macroTotals);
    if (macros.date === todaysDateString) {
      for (const macro in newMacros) {
        newMacros[macro] += Number(macros[macro]);
      }
      setMacroTotals(newMacros);
    }
  };
  const [toastInfo, setToastInfo] = useState({
    toastActivated: false,
    toastMessage: "",
    positive: false,
  });

  const [calorieGoal, setCalorieGoal] = useLocalStorage("goal",1850);


  return (
    <AppContext.Provider
      value={{
        activePage,
        updateActivePage,
        APIUrl,
        macroTotals,
        updateMacros,
        addToMacros,
        toastInfo,
        setToastInfo,
        theme,
        setTheme,
        calorieGoal,
        setCalorieGoal
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { ContextProvider, AppContext };
