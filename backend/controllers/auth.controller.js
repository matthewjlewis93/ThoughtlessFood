import bcrypt from "bcrypt";
import mongoose from "mongoose";
import userData from "../models/users.model.js";
import generateToken from "../config/generateToken.js";
import jwt from "jsonwebtoken";
import FoodLog from "../models/log.model.js";
import Meals from "../models/meal.model.js";
import FoodItem from "../models/food.model.js";

const saltRounds = 10;

const exampleMeal = {
  name: "Cream Cheese Bagel (example)",
  ingredients: [
    {
      name: "Everything Bagel",
      calories: 260,
      fat: 2,
      carbs: 48,
      protein: 11,
      amount: 1,
      unit: "unit",
      _id: 0,
    },
    {
      name: "Cream Cheese",
      calories: 179,
      fat: 18,
      carbs: 2,
      protein: 4,
      amount: "50",
      unit: "gram",
      _id: 1,
    },
  ],
  lastLogged: "2024-09-10T00:00:00.000Z",
  amount: 1,
  unit: "Meal",
};

const exampleFood = {
  name: "Chicken Noodle Soup (example)",
  category: "fooditem",
  calories: 130,
  protein: 7,
  carbs: 18,
  fat: 3,
  favorite: false,
  amount: 1,
  unit: "unit",
  lastLogged: "2024-09-10T00:00:00.000Z",
};

const exampleBreakfast = {
  name: "Vanilla Yogurt (example)",
  meal: "Breakfast",
  calories: 200,
  protein: 6,
  carbs: 39,
  fat: 1,
  amount: 200,
  unit: "gram",
};

const exampleDinner = {
  name: "Chicken Noodle Soup (example)",
  meal: "Dinner",
  calories: 130,
  protein: 7,
  carbs: 18,
  fat: 3,
  amount: 1,
  unit: "unit",
};

export const logInUser = async (req, res) => {
  const userInfo = req.body;
  const userSearch = await userData.findOne({ username: userInfo.username });
  if (userSearch) {
    // login
    bcrypt.compare(
      userInfo.password,
      userSearch._doc.password,
      (err, result) => {
        if (err) {
          console.log("Error comparing passwords: ", err);
          res.status(500).json({ message: err });
        } else {
          if (result) {
            generateToken(res, userSearch._id);
            res.status(200).json({
              success: true,
              existingUser: true,
              id: userInfo._id,
              goal: userSearch.goal,
            });
          } else {
            res.status(200).json({
              success: false,
              existingUser: true,
              message: "Failed Log In",
            });
          }
        }
      }
    );
  } else {
    res
      .status(200)
      .json({ success: false, existingUser: false, message: "User not found" });
  }
};

export const registerUser = async (req, res) => {
  const newUserInfo = req.body;
  const newUserSearch = await userData.findOne({
    username: newUserInfo.username,
  });
  if (newUserSearch) {
    console.log("existing user: " + newUserSearch);
    bcrypt.compare(
      userInfo.password,
      userSearch._doc.password,
      (err, result) => {
        if (err) {
          console.log("Error comparing passwords: ", err);
          res.status(500).json({ message: err });
        } else {
          if (result) {
            generateToken(res, userSearch._id);
            res
              .status(200)
              .json({ success: true, existingUser: true, id: userInfo._id });
          } else {
            res.status(200).json({
              success: false,
              existingUser: true,
              message: "Failed Log In",
            });
          }
        }
      }
    );
  } else {
    newUserInfo.password = await bcrypt.hash(newUserInfo.password, saltRounds);
    newUserInfo.goal = 1850;
    const newUser = new userData(newUserInfo);
    await newUser.save();


    let newUserExampleMeal = structuredClone(exampleMeal);
    newUserExampleMeal.userID = newUser._id;
    newUserExampleMeal.expireAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    newUserExampleMeal = new Meals(guestExampleMeal);
    await newUserExampleMeal.save();

    let newUserExampleFood = structuredClone(exampleFood);
    newUserExampleFood.userID = newGuest._id;
    newUserExampleFood.expireAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    newUserExampleFood = new FoodItem(guestExampleFood);
    await newUserExampleFood.save();

    generateToken(res, newUser._id);
    res.status(200).json({ success: true });
  }
};

export const checkLogIn = async (req, res) => {
  let token = req.cookies.jwt;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.SESSIONSECRET);
      req.user = await userData.findById(decoded.userID).select("-password");
      generateToken(res, req.user._id);
      res.status(200).json({ success: true, data: req.user });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "log in error: " + error });
    }
  } else {
    res.status(200).json({ success: false, message: "not logged in" });
  }
};

export const logOut = async (req, res) => {
  res.cookie("jwt", "", { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ success: true });
};

export const createGuest = async (req, res) => {
  const logDate = req.body.date;
  try {
    let newGuest = {
      username: `Guest${Math.floor(Math.random() * 9999999) + 1}`,
      password: Math.floor(Math.random() * 99999999) + 1,
      goal: 1850,
      expireAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };
    newGuest = new userData(newGuest);
    await newGuest.save();

    let guestExampleMeal = structuredClone(exampleMeal);
    guestExampleMeal.userID = newGuest._id;
    guestExampleMeal.expireAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    guestExampleMeal = new Meals(guestExampleMeal);
    await guestExampleMeal.save();


    let guestExampleFood = structuredClone(exampleFood);
    guestExampleFood.userID = newGuest._id;
    guestExampleFood.expireAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    guestExampleFood = new FoodItem(guestExampleFood);
    await guestExampleFood.save();

    let guestExampleBreakfast = structuredClone(exampleBreakfast);
    guestExampleBreakfast.userID = newGuest._id;
    guestExampleBreakfast.expireAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    guestExampleBreakfast.date = logDate;

    let guestExampleDinner = structuredClone(exampleDinner);
    guestExampleDinner.userID = newGuest._id;
    guestExampleDinner.expireAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    guestExampleDinner.date = logDate;

    guestExampleBreakfast = new FoodLog(guestExampleBreakfast);
    await guestExampleBreakfast.save();

    guestExampleDinner = new FoodLog(guestExampleDinner);
    await guestExampleDinner.save();

    generateToken(res, newGuest._id, 24 * 60 * 60 * 1000);
    res.status(200).json({ success: true, username: newGuest.username });
  } catch (e) {
    console.log(e);
    res.status(500).json({ e: e });
  }
};
