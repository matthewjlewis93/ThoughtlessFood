import { useContext, useEffect, useState } from "react";
import { AppContext } from "../Providers/ContextProvider";
import SquareButton from "./SquareButton";

export default function ToastDisplay() {
  const [toastWidth, setToastWidth] = useState(0);
  const { setToastInfo } = useContext(AppContext);
  const { toastActivated, toastMessage, positive } =
    useContext(AppContext).toastInfo;
  useEffect(() => {
    if (toastActivated) {
      document.getElementById("toast").classList.toggle("activated");
      setTimeout(() => {
        document.getElementById("toast").classList.toggle("activated");
        setToastInfo({
          toastActivated: false,
          toastMessage: toastMessage,
          positive: positive,
        });
      }, 2500);
    }
  }, [toastActivated]);

  useEffect(() => {
    setToastWidth(document.getElementById("toast").offsetWidth / 2);
  }, [toastMessage]);

  return (
    <div
      id="toast"
      style={{
        opacity: "0%",
        display: "grid",
        position: "absolute",
        backgroundColor: "white",
        color: "black",
        zIndex: 5,
        right: `calc(50vw - ${toastWidth}px)`,
        padding: "0px 5px 0px 5px",
        border: `4px solid ${positive ? "#38E5BA" : "#DD1D1D"}`,
        borderRadius: "30px",
        gridTemplateColumns: "20px 1fr",
        textAlign: "right",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        fill={positive ? "#38E5BA" : "#DD1D1D"}
      >
        <path
          d={
            positive
              ? "M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"
              : "m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"
          }
        />
      </svg>
      <p style={{ margin: "3px 10px", maxWidth:"300px" }}>{toastMessage}</p>
    </div>
  );
}
