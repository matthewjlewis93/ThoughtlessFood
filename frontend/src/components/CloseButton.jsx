import closeButton from "../assets/close.svg";
import { useContext } from "react";
import { AppContext } from "../Providers/ContextProvider";
import transitionControl from "../transitionControl";

export default function CloseButton({ functionList, pageID }) {
  const { updateActivePage } = useContext(AppContext);
  const handleClick = () => {
    if (pageID) {
      updateActivePage("HomePage");
      transitionControl(pageID);
    }
    setTimeout(() =>
      functionList.forEach((func) => func()),
      300 // hide reset until after page change
    );
  };
  return (
    <div
      style={{
        position: "absolute",
        top: "6px",
        right: "6px",
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
