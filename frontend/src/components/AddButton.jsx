import react, { useContext } from "react";
import { AppContext } from "../Providers/ContextProvider";

export default function AddButton({ title, icon }) {
  const { updateActivePage } = useContext(AppContext);

  return (
    <button
      className="blue-button"
      style={{ borderRadius: "5px", display:"flex", alignItems:"center", gap: "10px", maxWidth:"165px", fontSize:"20px"}}
      onClick={() => updateActivePage(title)}
    >
    <img src={icon} /> <span>{title}</span>
    </button>
  );
}
