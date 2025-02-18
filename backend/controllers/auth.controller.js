import bcrypt from "bcrypt";
import mongoose from "mongoose";
import userData from "../models/users.model.js";
import generateToken from "../config/generateToken.js";
import jwt from "jsonwebtoken";

const saltRounds = 10;

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
            res.status(200).json({ existingUser: true, id: userInfo._id, goal: userSearch.goal });
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
    res.status(401).json({ existingUser: false, message: "User not found" });
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
    newUser.save();
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

export const createGuest = (req, res) => {
  try {
    let newGuest = {
      username: `Guest${Math.floor(Math.random() * 9999999) + 1}`,
      password: Math.floor(Math.random() * 99999999) + 1,
      goal: 1850,
      expireAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };
    newGuest = userData(newGuest);
    newGuest.save();
    generateToken(res, newGuest._id, 24 * 60 * 60 * 1000);
    res.status(200).json({success: true, username: newGuest.username});
  } catch (e) {
    res.status(500).json({ e: e });
  }
};
