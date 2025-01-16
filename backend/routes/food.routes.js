import express from 'express';
import FoodItem from '../models/food.model.js';
import { addNewFood, deleteFood, getAllFoods, updateFood } from '../controllers/food.controller.js';
import { userInfo } from '../config/userInfoMiddleware.js';

const foodRouter = express.Router();
foodRouter.use(userInfo);

foodRouter.get('/', getAllFoods);

foodRouter.post('/', addNewFood);

foodRouter.patch('/:id', updateFood)

foodRouter.delete('/:id', deleteFood);

export default foodRouter;