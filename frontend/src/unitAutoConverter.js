export default function unitAutoConverter(oldUnit, newUnit, amount) {
  switch (oldUnit) {
    case "gram":
      if (newUnit === "oz") {
        return Number(Number(amount / 28.34952).toFixed(1));
      } else if (newUnit === "mL" || newUnit === "gram") {
        return amount;
      } else {
        return 1;
      }
    case "mL":
      if (newUnit === "oz") {
        return Number(Number(amount * 28.34952).toFixed(1));
      } else if (newUnit === "gram" || newUnit === "mL") {
        return amount;
      } else {
        return 1;
      }
    case "oz":
      if (newUnit === "gram" || newUnit === "mL") {
        return Number(Number(amount * 28.34952).toFixed(1));
      } else if (newUnit === "oz") {
        return amount;
      } else {
        return 1;
      }
    case "unit":
      if (newUnit === 'unit') {
        return amount;
      } else {
        return 1;
      }
  }
}
