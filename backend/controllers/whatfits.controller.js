import FoodItem from "../models/food.model.js";
import MealItem from "../models/meal.model.js";

export const getFoodsAndMeals = async (req, res) => {
    const {caloriesRemaining} = req.params;
    try {
        const foods = await FoodItem.find({ calories: { $lte: caloriesRemaining } });
        let meals = await MealItem.find({});
        meals = meals.filter((meal) => meal.ingredients.reduce((p,c) =>{return p + c.calories} ,0) < caloriesRemaining )
        res.status(200).json({ success: true, data: { foods: foods, meals: meals } });
    }
    catch (e) {
        res.status(500).json({ success: false, message: "Failed to search foods and meals. " + e })
    }
}