import react, { useContext } from "react";
import { AppContext } from "../Providers/ContextProvider";

export default function AddButton({ title }) {
  const { updateActivePage } = useContext(AppContext);

  return (
    <button
      className="blue-button"
      style={{ borderRadius: "5px"}}
      onClick={() => updateActivePage(title)}
    >
      {title}
    </button>
  );
}
