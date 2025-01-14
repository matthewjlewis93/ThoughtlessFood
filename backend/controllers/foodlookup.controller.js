export default async function foodLookup(req, res) {
    const {searchParam} = req.params;
    let searchResult = await fetch(
      `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${process.env.FDAAPIKEY}&query=${searchParam}&dataType=Foundation`
    );
    searchResult = await searchResult.json();
    
}