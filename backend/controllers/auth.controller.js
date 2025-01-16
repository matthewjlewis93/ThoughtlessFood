import bcrypt from "bcrypt";
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
            res.status(200).json({ existingUser: true, id: userInfo._id });
          } else {
            res
              .status(401)
              .json({ existingUser: true, message: "Failed Log In" });
          }
        }
      }
    );
  } else {
    res.status(401).json({ existingUser: false, message: "User not found" });
  }
};

export const checkLogIn = async (req, res) => {
  let token = req.cookies.jwt;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.SESSIONSECRET);
      req.user = await userData.findById(decoded.userID).select("-password");
      generateToken(res, req.user._id);
      res.status(200).json({success: true, data: req.user})
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "log in error: " + error });
    }
  } else {
    res.status(401).json({ success: false, message: "not logged in" });
  }
};
