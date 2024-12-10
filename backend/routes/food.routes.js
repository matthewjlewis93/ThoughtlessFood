import express from 'express';
import FoodItem from '../models/food.model.js';
import { addNewFood, deleteFood, getAllFoods, updateFood } from '../controllers/food.controller.js';

const foodRouter = express.Router();

foodRouter.get('/', getAllFoods);

foodRouter.post('/', addNewFood);

foodRouter.patch('/:id', updateFood)

foodRouter.delete('/:id', deleteFood);

export default foodRouter;