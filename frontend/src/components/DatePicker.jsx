import createDateString from "../createDateString";

export default function DatePicker({
  label = true,
  defaultDate,
  setDefaultDate,
  record = { date: "" },
  setRecord = () => {},
}) {
  const handleDateButton = (e, number) => {
    e.preventDefault();
    let date = new Date(defaultDate);
    date.setDate(date.getDate() + 1);
    date.setDate(date.getDate() + number);
    const newDateString = createDateString(date);
    setDefaultDate(newDateString);
    setRecord({ ...record, date: newDateString });
  };

  return (
    <>
      {label && (
        <label htmlFor="date">
          Date: <br />
        </label>
      )}
      <span style={{display: "flex"}}>
        <button
          style={{ height: "28px", width: "28px", marginRight: "5px" }}
          onClick={(e) => handleDateButton(e, -1)}
        >
          ◄
        </button>
        <input
          type="date"
          id="date"
          style={{ height: "24px", width: "fit-content", fontSize: "1.2em" }}
          onChange={(e) => {
            setRecord({ ...record, date: e.target.value });
            setDefaultDate(e.target.value);
          }}
          value={defaultDate}
        ></input>
        <button
          style={{ height: "28px", width: "28px", marginLeft: "5px" }}
          onClick={(e) => handleDateButton(e, 1)}
        >
          ►
        </button>
      </span>
    </>
  );
}
