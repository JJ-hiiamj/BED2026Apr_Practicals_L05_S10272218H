const express = require("express");
const app = express();
const PORT = 3000;
let foods = [];

app.use(express.json());

app.get("/hello", (req, res) => {
  res.send("Hello, world!");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// Create food items
// Create food (POST) :	http://localhost:3000/foods, { "name": "Apple", "calories": 95 }
app.post("/foods", (req, res) => {
  const { name, calories } = req.body;
  if (!name || calories == null) {
    return res
      .status(400)
      .json({ message: "Cannot create food: name and calories are required." });
  }
  const newFood = { id: Date.now(), name, calories };
  foods.push(newFood);
  res
    .status(201)
    .json({ message: "Food created successfully.", food: newFood });
});

// Returns all food found in Foods array, if no name provided all food are shown.
// Read all foods (GET) : http://localhost:3000/foods
app.get("/foods", (req, res) => {
  const { name } = req.query;
  let results = foods;
  if (name) {
    results = foods.filter((f) => f.name.includes(name));
    return res.json({
      message: `Found ${results.length} food(s) matching name filter.`,
      foods: results,
    });
  }
  res.json({
    message: `Retrieved all foods (${results.length}).`,
    foods: results,
  });
});

//Update Food items.
// Update food (PUT):	http://localhost:3000/foods/{id}, { "name": "Banana", "calories": 105 }, the {id} just put the id no need curly bracket.
app.put("/foods/:id", (req, res) => {
  const foodId = Number(req.params.id);
  const { name, calories } = req.body;
  if (!name || calories == null) {
    return res
      .status(400)
      .json({ message: "Cannot update: name and calories are required." });
  }
  const idx = foods.findIndex((f) => f.id === foodId);
  if (idx === -1) {
    return res
      .status(404)
      .json({ message: `No food found with id ${foodId}.` });
  }
  foods[idx] = { id: foodId, name, calories };
  res.json({
    message: `Food with id ${foodId} updated successfully.`,
    food: foods[idx],
  });
});

// Delet food items
// Delete food (DELETE) : http://localhost:3000/foods/{id}, no need curly bracket.
app.delete("/foods/:id", (req, res) => {
  const foodId = Number(req.params.id);
  const exists = foods.some((f) => f.id === foodId);
  if (!exists) {
    return res
      .status(404)
      .json({ message: `No food found with id ${foodId}.` });
  }
  foods = foods.filter((f) => f.id !== foodId);
  res.json({ message: `Food with id ${foodId} deleted successfully.` });
});