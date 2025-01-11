import react, { useState } from "react";
import "./App.css";
import { ContextProvider } from "./Providers/ContextProvider";
import LogFoodPage from "./components/Pages/LogFoodPage";
import HomePage from "./components/Pages/HomePage";
import ViewLog from "./components/Pages/ViewLog";
import Foods from "./components/Pages/Foods";
import SeeWhatFits from "./components/Pages/SeeWhatFits";
import Meals from "./components/Pages/Meals";
import ToastDisplay from "./components/ToastDisplay";

function App() {

  return (
    <div className="app-container">
      <ContextProvider>
        <HomePage />
        <LogFoodPage />
        <ViewLog />
        <Foods />
        <Meals />
        <SeeWhatFits />
        <ToastDisplay />
      </ContextProvider>
    </div>
  );
}

export default App;
