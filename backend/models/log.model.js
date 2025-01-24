import mongoose from "mongoose";

const logSchema = new mongoose.Schema(
  {
    name: {
      //meal or food name
      type: String,
      required: true,
    },
    meal: {
      //breakfast / lunch / snack / etc
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    calories: {
      type: Number,
      required: true,
    },
    protein: {
      type: Number,
      required: false,
    },
    carbs: {
      type: Number,
      required: false,
    },
    fat: {
      type: Number,
      required: false,
    },
    amount: {
      type: Number,
      required: false,
    },
    unit: {
      type: String,
      required: false,
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

const FoodLog = mongoose.model("Foodlog", logSchema);

export default FoodLog;