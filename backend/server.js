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

const PORT = process.env.PORT || 8080;
const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/foods", foodRouter);
app.use("/api/log", logRouter);
app.use("/api/meals", mealRouter);
app.use("/api/whatfits", whatFitsRouter);
app.use("/api/auth", authRouter);
app.use(
  session({
    secret: process.env.SESSIONSECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.json({ status: "live", loggedIn: req.isAuthenticated() });
});

app.listen(PORT, () => {
  connectDB();
  console.log("Server started at http://localhost:" + PORT);
});
