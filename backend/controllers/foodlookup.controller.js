export default async function foodLookup(req, res) {
  const { searchParam } = req.params;
  try {
    let searchResult = await fetch(
      `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${process.env.FDAAPIKEY}&query=${searchParam}&dataType=Foundation`
    );
    searchResult = await searchResult.json();

    let formattedFood = searchResult.foods.filter((food) =>
      food.foodNutrients.find((n) => n["unitName"] === "KCAL")
    );

    formattedFood = formattedFood.map((food) => ({
      name: food.description,
      calories: Math.round(
        food.foodNutrients.find((n) => n["unitName"] === "KCAL").value
      ),
      fat: Math.round(
        food.foodNutrients.find((n) => n["nutrientId"] == 1004).value
      ),
      carbs: Math.round(
        food.foodNutrients.find((n) => n["nutrientId"] == 1005).value
      ),
      protein: Math.round(
        food.foodNutrients.find((n) => n["nutrientId"] == 1003).value
      ),
      amount: 100,
      unit: "gram",
    }));

    res.status(200).json({ success: true, data: formattedFood });
  } catch (e) {
    console.log(e);
    res.status(200).json({ success: false });
  }
}
