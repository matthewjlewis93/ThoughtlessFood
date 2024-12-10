import Meals from "../models/meal.model.js";

export const getAllMeals = async (req, res) => {
  try {
    const meals = await Meals.find({});
    res.status(200).json({ success: true, data: meals });
  } catch (error) {
    console.error(`Error fetching meals: ${error}`);
    res.status(500).json({ success: true, message: "Error fetching meals." });
  }
};

export const addNewMeal = async (req, res) => {
  const recievedMeal = req.body;
  recievedMeal.ingredients = recievedMeal.ingredients.map((m,i) => ({
    ...m,
    _id: i,
  }));
  const newMeal = new Meals(recievedMeal);
  try {
    await newMeal.save();
    res.status(200).json({ success: true, data: newMeal });
  } catch (error) {
    console.error(`Error in create meal: ${error}`);
    res.status(500).json({ success: false, message: "Error adding meal." });
  }
};

export const updateMeal = async (req, res) => {
  const { id } = req.params;
  const meal = req.body;

  try {
    const updatedMeal = await Meals.findByIdAndUpdate(id, meal, { new: true });
    res.status(200).json({ success: true, data: updatedMeal });
  } catch (error) {
    console.error(`Error updating meal: ${error}`)
    res.status(500).json({ success: false, message: "Error updating meal." });
  }
};

export const deleteMeal = async (req, res) => {
  const { id } = req.params;

  try {
    const mealToDelete = await Meals.findByIdAndDelete(id);
    res.status(200).json({ success: true, data: mealToDelete });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error delete log." });
  }
};
