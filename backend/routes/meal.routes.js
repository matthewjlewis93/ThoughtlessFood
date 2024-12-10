import express from "express";
import { addNewMeal, deleteMeal, getAllMeals, updateMeal } from "../controllers/meal.controller.js";

const mealRouter = express.Router();

mealRouter.get('/', getAllMeals);

mealRouter.post('/', addNewMeal);

mealRouter.patch('/:id', updateMeal);

mealRouter.delete('/:id', deleteMeal)

export default mealRouter;