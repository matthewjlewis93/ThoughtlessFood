import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/food.routes.js";
import logRouter from "./routes/log.routes.js";
import mealRouter from "./routes/meal.routes.js";
import whatFitsRouter from "./routes/whatfits.routes.js";
import authRouter from "./routes/auth.routes.js";
import session from "express-session";
import passport from "passport";
import { Strategy } from "passport-local";
import userData from "./models/users.model.js";
import bcrypt from "bcrypt";

const PORT = process.env.PORT || 8080;
const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/foods", foodRouter);
app.use("/api/log", logRouter);
app.use("/api/meals", mealRouter);
app.use("/api/whatfits", whatFitsRouter);
// app.use("/api/auth", authRouter);

app.use(
  session({
    secret: process.env.SESSIONSECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use("/api/auth", passport.authenticate("local"), function (req, res) {
  res.status(200).json({success: true, id: req.user._id});
});
app.use(passport.initialize());
app.use(passport.session());
passport.use(
  new Strategy(async function verify(username, password, cb) {
    console.log("strategy activated")
    const userSearch = await userData.findOne({ username: username });
    if (userSearch) {
      console.log("user found")
      // login
      bcrypt.compare(password, userSearch._doc.password, (err, result) => {
        if (err) {
          console.log("Error comparing passwords: ", err);
          cb(err, false, {success: false, data: "login failed: "+err});
          // res.status(500).json({ message: err });
        } else {
          if (result) {
            console.log('user logged in')
            // res.status(200).json({ existingUser: true, message: "Logged In" });
            cb(null, userSearch);
          } else {
            console.log('log in failed')
            cb(null, false, {success: false, data: "Incorrect password"});
            // res.status(200).json({ existingUser: true, message: "Failed Log In" });
          }
        }
      });
    } else {
      cb("User not found.");
    }
  })
);

app.get("/", (req, res) => {
  res.json({ status: "live", loggedIn: req.isAuthenticated() });
});

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});

app.listen(PORT, () => {
  connectDB();
  console.log("Server started at http://localhost:" + PORT);
});
