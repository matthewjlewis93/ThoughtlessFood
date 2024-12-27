import closeButton from "../assets/close.svg";
import { useContext } from "react";
import { AppContext } from "../Providers/ContextProvider";

export default function CloseButton({ functionList }) {
  const { updateActivePage } = useContext(AppContext);
  const handleClick = () => {
    updateActivePage("HomePage");
    functionList.forEach((func) => func());
  };
  return (
    <div
      style={{
        position: "absolute",
        top: "5px",
        right: "5px",
        width: "55px",
        height: "45px",
        justifyItems: "right",
      }}
      onClick={handleClick}
    >
      <div
        style={{
          backgroundColor: "#DD1D1D",
          height: "24px",
          width: "24px",
          borderRadius: "6px",
          border: "1px solid white",
        }}
      >
        <img src={closeButton} />
      </div>
    </div>
  );
}
