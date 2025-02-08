import react, { useContext, useState } from "react";
import "./App.css";
import { AppContext, ContextProvider } from "./Providers/ContextProvider";
import LogFoodPage from "./components/Pages/LogFoodPage";
import HomePage from "./components/Pages/HomePage";
import ViewLog from "./components/Pages/ViewLog";
import Foods from "./components/Pages/Foods";
import SeeWhatFits from "./components/Pages/SeeWhatFits";
import Meals from "./components/Pages/Meals";
import ToastDisplay from "./components/ToastDisplay";
import useLocalStorage from "./useLocalStorage";

function App() {
  const [logInConfirmed, setLogInConfirmed] = useState(false)
  // const {theme} = useContext(AppContext);
    const [theme, setTheme] = useLocalStorage("theme", "light");

  return (
    <div className="app-container" data-theme={theme}>
      <ContextProvider theme={theme} setTheme={setTheme}>
        <HomePage setLogInConfirmed={setLogInConfirmed} />
        {logInConfirmed && <>
        <LogFoodPage />
        <ViewLog />
        <Foods />
        <Meals />
        <SeeWhatFits />
        <ToastDisplay />
        </>
        }
      </ContextProvider>
    </div>
  );
}

export default App;
