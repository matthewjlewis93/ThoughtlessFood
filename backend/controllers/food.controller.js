import FoodItem from "../models/food.model.js";

export const getAllFoods = async (req, res) => {
    try {
        const foods = await FoodItem.find({userID: req.body.userID});
        res.status(200).json({ success: true, data: foods});
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false , message: "Error fetching foods" });
    }
};

export const addNewFood = async (req, res) => {
    const newFood = new FoodItem(req.body);
    try {
        await newFood.save();
        res.status(200).json({success: true, data: newFood});
    } catch (error) {
        console.error(`Error adding food: ${error}`);
        res.status(500).json( { success: false, message: "Server error" } );
    }
};

export const updateFood = async (req, res) => {
    const {id} = req.params;
    const food = req.body;

    try {
        const updatedFood = await FoodItem.findByIdAndUpdate(id, food, {new: true});
        res.status(200).json({ success: true, data: updatedFood });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating item." });
    }
};

export const deleteFood = async (req, res) => {
    const {id} = req.params;

    try {
        await FoodItem.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Food deleted successfully." } );
    } catch (error) {
        console.error(`Error deleting item: ${error}`);
        res.status(500).json({ success: false, message: "Server error." })
    }
}