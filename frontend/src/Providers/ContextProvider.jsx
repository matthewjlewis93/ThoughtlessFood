import react, { createContext, useState } from "react";

const AppContext = createContext();

const ContextProvider = ({ children }) => {
  // Active page
  const [activePage, setActivePage] = useState("Meals");
  const updateActivePage = (ActivePage) => setActivePage(ActivePage);

  // API link provider
  const [APIUrl, ] = useState("http://192.168.1.110:8080/api/");

  //Today's Macro Info
  const [macroTotals, setMacroTotals] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    date: ''
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
  return (
    <AppContext.Provider
      value={{
        activePage,
        updateActivePage,
        APIUrl,
        macroTotals,
        updateMacros,
        addToMacros,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { ContextProvider, AppContext };