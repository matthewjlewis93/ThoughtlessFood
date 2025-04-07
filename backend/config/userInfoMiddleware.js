import jwt from "jsonwebtoken";
// import asyncHandler from "express-async-handler";
// import userData from "../models/users.model";

const userInfo = (req, res, next) => {
  let token;
  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.SESSIONSECRET);
      req.body.userID = decoded.userID;
      if (decoded.guest) {
        req.body.expireAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
        req.body.guest = true;
      }
      next();
    } catch (error) {
      res
        .status(200)
        .json({ success: false, message: "log in error: " + error });
        console.log(error);
    }
  } else {
    res.status(200).json({ success: false, message: "not logged in" });
  }
};

export { userInfo };
