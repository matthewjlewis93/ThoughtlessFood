import { useContext } from "react";
import CloseButton from "../CloseButton";
import { AppContext } from "../../Providers/ContextProvider";

export default function UserSettings({ username, setSettingsDisplay }) {
    const { theme, setTheme } = useContext(AppContext);

  return (
    <div id="user-settings" className="popup-screen">
      <form style={{position: "relative"}}>
        <CloseButton functionList={[() => setSettingsDisplay(false)]} />
        <h1>{username}</h1>
        <br />
        <br />
        <button onClick={(e) => { e.preventDefault();setTheme(theme === 'dark' ? 'light' : 'dark')}}>Switch to {theme === 'light' ? "dark" : "light"} mode</button>
      </form>
    </div>
  );
}
