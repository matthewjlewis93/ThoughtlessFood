import react, { useContext } from "react";
import { AppContext } from "../Providers/ContextProvider";

export default function SplitButton({ title1, title2 }) {
  const { updateActivePage } = useContext(AppContext);
  return (
    <div style={{ display: "inline-block", maxWidth:"165px" }}>
      <button
        onClick={() => updateActivePage(title1)}
        className="blue-button"
        style={{
          borderTop: "2px solid",
          borderBottom: "2px solid",
          borderLeft: "2px solid",
          borderRight: "1px solid",
          borderTopLeftRadius: "5px",
          borderBottomLeftRadius: "5px",
          width: "50%",
          height:"34px"
        }}
      >
        {title1}
      </button>
      <button
        onClick={() => updateActivePage(title2)}
        className="blue-button"
        style={{
          borderTop: "2px solid",
          borderBottom: "2px solid",
          borderLeft: "1px solid",
          borderRight: "2px solid",
          borderTopRightRadius: "5px",
          borderBottomRightRadius: "5px",
          width: "50%",
          height:"34px"
        }}
      >
        {title2}
      </button>
    </div>
  );
}
