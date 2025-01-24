import mongoose from "mongoose";

const mealSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    ingredients: {
      type: Array, // array of food item objects
      required: true,
    },
    lastLogged: {
      type: Date,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
    userID: {
      type: String,
      required: true,
    },
    expireAt: {
      type: Date,
      expires: 0,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Meals = mongoose.model("Meal", mealSchema);
export default Meals;