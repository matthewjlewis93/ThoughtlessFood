import express from "express";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/food.routes.js";
import logRouter from "./routes/log.routes.js";
import mealRouter from "./routes/meal.routes.js";
import whatFitsRouter from "./routes/whatfits.routes.js";
import authRouter from "./routes/auth.routes.js";
import userData from "./models/users.model.js";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";

const PORT = process.env.PORT || 8080;
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/foods", foodRouter);
app.use("/api/log", logRouter);
app.use("/api/meals", mealRouter);
app.use("/api/whatfits", whatFitsRouter);
app.get("/", (req, res) => {
  res.json({ status: "live", loggedIn: req.sessionID });
});

app.listen(PORT, () => {
  connectDB();
  console.log("Server started at http://localhost:" + PORT);
});
