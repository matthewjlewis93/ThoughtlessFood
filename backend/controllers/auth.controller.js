import userData from "../models/users.model.js";

export const registerUser = async (req, res) => {
  const userInfo = req.body;
  const userSearch = await userData.findOne({ username: userInfo.username });
  if (userSearch) { // login
    if (userInfo.password === userSearch._doc.password) {
        res.status(200).json({ existingUser: true, message: "Logged In" });
    } else {
        res.status(200).json({ existingUser: true, message: "Failed Log In"})
    }
  } else { // register
    const newUser = new userData(userInfo);
    newUser.save();
    res.status(200).json({ existingUser: false, message: "User Registered" });
  }
};
