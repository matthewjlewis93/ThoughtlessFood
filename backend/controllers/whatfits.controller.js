import FoodItem from "../models/food.model.js";
import MealItem from "../models/meal.model.js";

export const getFoodsAndMeals = async (req, res) => {
  const { caloriesRemaining } = req.params;
  try {
    let foods = await FoodItem.find({});
    foods = foods.map((f, i) => {
      let newAmount = Math.floor(caloriesRemaining / (f.calories / f.amount));
      if (newAmount > 0) {
        return {
          _id: f._id,
            name: f.name,
            amount: newAmount,
            unit: f.unit,
          calories: Math.round((f.calories / f.amount) * newAmount),
          protein: Math.round((f.protein / f.amount) * newAmount),
          carbs: Math.round((f.carbs / f.amount) * newAmount),
          fat: Math.round((f.fat / f.amount) * newAmount),
        };
      }
    });
    let meals = await MealItem.find({});
    meals = meals.filter(
      (meal) =>
        meal.ingredients.reduce((p, c) => {
          return p + c.calories;
        }, 0) < caloriesRemaining
    );
    res
      .status(200)
      .json({ success: true, data: { foods: foods, meals: meals } });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Failed to search foods and meals. " + e,
    });
  }
};
