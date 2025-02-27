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
      <span style={{ display: "flex" }}>
        <button
          style={{
            height: "28px",
            width: "28px",
            marginRight: "5px",
            padding: 0,
          }}
          onClick={(e) => handleDateButton(e, -1)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#000"
          >
            <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" />
          </svg>
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
          style={{ height: "28px", width: "28px", marginLeft: "5px", padding: 0 }}
          onClick={(e) => handleDateButton(e, 1)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#000"
          >
            <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
          </svg>
        </button>
      </span>
    </>
  );
}
