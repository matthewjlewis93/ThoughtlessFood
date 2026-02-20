import express from "express";
import cookieParser from "cookie-parser";
import serverless from "serverless-http";
import { connectDB } from "../../backend/config/db";
import foodRouter from "../../backend/routes/food.routes";
import logRouter from "../../backend/routes/log.routes";
import mealRouter from "../../backend/routes/meal.routes";
import whatFitsRouter from "../../backend/routes/whatfits.routes";
import authRouter from "../../backend/routes/auth.routes";
import foodLookupRouter from "../../backend/routes/foodlookup.routes";
import settingsRouter from "../../backend/routes/settings.routes";
import { userInfo } from "../../backend/config/userInfoMiddleware";

const PORT = process.env.PORT || 8080;
const app = express();

connectDB();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use(userInfo);
app.use("/api/foods", foodRouter);
app.use("/api/log", logRouter);
app.use("/api/meals", mealRouter);
app.use("/api/whatfits", whatFitsRouter);
app.use("/api/foodlookup", foodLookupRouter);
app.use("/api/settings", settingsRouter);
app.get("/", (req, res) => {
  res.status(200).json({ status: "live", loggedIn: req.sessionID });
});


export const handler = serverless(app);