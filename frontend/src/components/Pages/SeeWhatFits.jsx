import react, { useContext } from "react";
import { AppContext } from "../../Providers/ContextProvider";
import CloseButton from "../CloseButton";

export default function SeeWhatFits() {
  const { activePage } = useContext(AppContext);
  return (
    <div
      style={{}}
      className={
        "container-box main-page " +
        (activePage === "See What Fits" ? "active" : "inactive")
      }
    >
      <CloseButton functionList={[() => {}]} />
    </div>
  );
}
