import express from "express";
import getFoodsAndMeals from "../controllers/whatfits.controller.js";
import foodRouter from "./food.routes.js";

const whatFitsRouter = express.Router();

whatFitsRouter.get('/:caloriesRemaining', getFoodsAndMeals);

export default whatFitsRouter;