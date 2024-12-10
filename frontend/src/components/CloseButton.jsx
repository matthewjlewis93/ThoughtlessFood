import closeButton from "../assets/close.svg";
import { useContext } from "react";
import { AppContext } from "../Providers/ContextProvider";

export default function CloseButton({functionList}) {
    const {updateActivePage} = useContext(AppContext);
    const handleClick = () => {
        updateActivePage("HomePage");
        functionList.forEach((func) => func())
    }
  return (
    <div
      style={{
        position: "absolute",
        top: "5px",
        right: "5px",
        backgroundColor: "#DD1D1D",
        height:"24px",
        borderRadius:"6px",
        border:"1px solid white",
        margin:"0px 0px 5px 10px"
      }}
    >
      <img src={closeButton} onClick={handleClick} />
    </div>
  );
}
