import react, { useContext } from "react";
import { AppContext } from "../Providers/ContextProvider";
import transitionControl from "../transitionControl.js";

export default function AddButton({ title, icon, pageID }) {
  const { updateActivePage } = useContext(AppContext);

  return (
    <button
      className="blue-button"
      style={{
        borderRadius: "5px",
        display: "flex",
        alignItems: "center",
        gap: "9px",
        maxWidth: "165px",
        fontSize: "18px",
      }}
      onClick={() => {
        updateActivePage(title);
        transitionControl(pageID);
      }}
    >
      <img src={icon} /> <span>{title}</span>
    </button>
  );
}
