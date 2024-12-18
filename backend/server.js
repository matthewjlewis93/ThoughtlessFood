import express from "express";
import cors from 'cors';
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/food.routes.js";
import logRouter from "./routes/log.routes.js";
import mealRouter from "./routes/meal.routes.js";

const PORT = process.env.PORT || 8080;
const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/foods", foodRouter);
app.use("/api/log", logRouter);
app.use("/api/meals", mealRouter);

app.get("/", (req,res) => {res.json({m:"live"})})

app.listen(PORT, () => {
    connectDB();
    console.log("Server started at http://localhost:"+PORT)
});