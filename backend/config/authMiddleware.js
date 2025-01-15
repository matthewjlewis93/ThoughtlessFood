import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import userData from "../models/users.model";

const protect = asyncHandler(async (req, res, next) => {
  let token;
  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.SESSIONSECRET);
      req.user = await userData.findById(decoded.userID).select("-password");
      next();
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "log in error: " + error });
    }
  } else {
    res.status(401).json({ success: false, message: "not logged in" });
  }
});

export { protect };
