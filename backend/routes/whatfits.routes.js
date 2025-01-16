import express from "express";
import getFoodsAndMeals from "../controllers/whatfits.controller.js";
import foodRouter from "./food.routes.js";
import { userInfo } from "../config/userInfoMiddleware.js";

const whatFitsRouter = express.Router();
whatFitsRouter.use(userInfo);

whatFitsRouter.get('/:caloriesRemaining', getFoodsAndMeals);

export default whatFitsRouter;