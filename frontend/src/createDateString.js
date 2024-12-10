function createDateString(date) {
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const dateString = `${date.getFullYear()}-${month}-${day}`;
  return dateString;
}

export default createDateString;