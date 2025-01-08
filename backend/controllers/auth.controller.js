import bcrypt from "bcrypt";
import userData from "../models/users.model.js";

const saltRounds = 10;

export const registerUser = async (req, res) => {
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
          res.status(500).json({message: err});
        } else {
          if (result) {
            res.status(200).json({ existingUser: true, message: "Logged In" });
          } else {
            res
              .status(200)
              .json({ existingUser: true, message: "Failed Log In" });
          }
        }
      }
    );
  } else {
    // register
    bcrypt.hash(userInfo.password, saltRounds, async (err, hash) => {
      if (err) {
        console.log("Error hashing: ", err);
        res.status(500).json({message: err});
      } else {
        const newUser = new userData({ ...userInfo, password: hash });
        newUser.save();
      }
    });

    res.status(200).json({ existingUser: false, message: "User Registered" });
  }
};
