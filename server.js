require("dotenv").config();
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

app.get("/api/foods", async (req, res) => {
  try {
    const query = req.query.query?.trim();

    // Pokud je dotaz prazdny, vratime prazdne pole.
    if (!query) {
      return res.json([]);
    }

    const url = new URL(
      "https://api.nal.usda.gov/fdc/v1/foods/search"
    );

    url.searchParams.set("api_key", process.env.FDC_API_KEY);
    url.searchParams.set("query", query);
    url.searchParams.set("dataType", "Foundation");
    url.searchParams.set("pageSize", "10");

    const response = await fetch(url);

    // Pokud USDA API vrati chybu,
    // vyhodime vlastni chybu.
    // if (!response.ok) {
    //   throw new Error(
    //     `USDA API error: ${response.status}`
    //   );
    // }
    if (!response.ok) {
  const errorText = await response.text();

  console.error("USDA response:", errorText);

  throw new Error(
    `USDA API error: ${response.status}`
  );
}

    const data = await response.json();

    const foods = data.foods
      .map((food) => {

        // =========================
        // MACROS
        // =========================

        const protein = food.foodNutrients.find(
          (nutrient) => nutrient.nutrientId === 1003
        );

        const fat = food.foodNutrients.find(
          (nutrient) => nutrient.nutrientId === 1004
        );

        const carbs = food.foodNutrients.find(
          (nutrient) => nutrient.nutrientId === 1005
        );

        const proteinValue = protein
          ? Math.max(0, protein.value)
          : 0;

        const carbsValue = carbs
          ? Math.max(0, carbs.value)
          : 0;

        const fatValue = fat
          ? Math.max(0, fat.value)
          : 0;


        // =========================
        // ENERGY
        // =========================

        const energySpecific = food.foodNutrients.find(
          (nutrient) => nutrient.nutrientId === 2048
        );

        const energyGeneral = food.foodNutrients.find(
          (nutrient) => nutrient.nutrientId === 2047
        );

        const energy = food.foodNutrients.find(
          (nutrient) => nutrient.nutrientId === 1008
        );


        // Nejdrive pouzijeme kcal primo z USDA.
        let calories = energySpecific
          ? energySpecific.value
          : energyGeneral
            ? energyGeneral.value
            : energy
              ? energy.value
              : 0;


        // =========================
        // FALLBACK CALCULATION
        // =========================

        // Pokud USDA kcal neposkytuje,
        // ale mame alespon jedno makro,
        // spocitame kcal z maker.
        if (
          calories === 0 &&
          (
            proteinValue > 0 ||
            carbsValue > 0 ||
            fatValue > 0
          )
        ) {
          calories =
            proteinValue * 4 +
            carbsValue * 4 +
            fatValue * 9;
        }


        // =========================
        // RESULT
        // =========================

        return {
          id: food.fdcId,
          name: food.description,
          calories: Number(calories.toFixed(1)),
          protein: proteinValue,
          carbs: carbsValue,
          fat: fatValue
        };
      })


      // =========================
      // REMOVE FOODS WITHOUT DATA
      // =========================

      .filter((food) => {
        return !(
          food.calories === 0 &&
          food.protein === 0 &&
          food.carbs === 0 &&
          food.fat === 0
        );
      });


    res.json(foods);

  } catch (error) {
    console.error("Food search failed:", error);

    res.status(500).json({
      error: "Failed to fetch food data."
    });
  }
});


app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});