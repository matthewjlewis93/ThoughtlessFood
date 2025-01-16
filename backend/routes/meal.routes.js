import express from "express";
import { addNewMeal, deleteMeal, getAllMeals, updateMeal } from "../controllers/meal.controller.js";
import { userInfo } from "../config/userInfoMiddleware.js";

const mealRouter = express.Router();
mealRouter.use(userInfo);

mealRouter.get('/', getAllMeals);

mealRouter.post('/', addNewMeal);

mealRouter.patch('/:id', updateMeal);

mealRouter.delete('/:id', deleteMeal)

export default mealRouter;