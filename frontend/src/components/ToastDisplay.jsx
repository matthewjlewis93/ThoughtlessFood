import { useContext, useEffect, useState } from "react";
import Check from "../assets/check.svg";
import X from "../assets/x.svg";
import { AppContext } from "../Providers/ContextProvider";

export default function ToastDisplay() {
  const [toastWidth, setToastWidth] = useState(0);
  const {setToastInfo} = useContext(AppContext);
  const { toastActivated, toastMessage, positive } = useContext(AppContext).toastInfo;
  useEffect(() => {
    if (toastActivated) {
      document.getElementById("toast").classList.toggle("activated");
      setTimeout(() => {
        document.getElementById("toast").classList.toggle("activated");
        setToastInfo({toastActivated: false, toastMessage: toastMessage, positive: positive})
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
        position: "absolute",
        backgroundColor: "white",
        color: "black",
        zIndex: 5,
        right: `calc(50vw - ${toastWidth}px)`,
        padding: "0px 5px 0px 5px",
        border: `4px solid ${positive ? "#38E5BA" : "#DD1D1D"}`,
        borderRadius: "30px",
        display: "grid",
        gridTemplateColumns: "20px 1fr",
        textAlign: "right",
        opacity: "0%"
      }}
    >
      <img src={positive ? Check : X} />
      <p style={{ margin: "3px 10px" }}>{toastMessage}</p>
    </div>
  );
}
