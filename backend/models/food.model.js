import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: { //food item or meal item
        type: String,
        required: true
    },
    calories: {
        type: Number,
        required: true
    },
    protein: {
        type: Number,
        required: false
    },
    carbs: {
        type: Number,
        required: false
    },
    fat: {
        type: Number,
        required: false
    },
    favorite: {
        type: Boolean,
        required: true
    },
    amount: {
        type: Number,
        required: false
    },
    unit: { // oz, servings, bar, etc
        type: String,
        required: false
    },
    lastLogged: {
        type: Date,
        required: true
    }
},{
    timestamps: true
});

const FoodItem = mongoose.model("Food", foodSchema); // = food collection

export default FoodItem;