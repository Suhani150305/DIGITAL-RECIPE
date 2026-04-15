const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer"); 
const path = require("path");
require("dotenv").config();

const Recipe = require("./models/Recipe");
const app = express();

app.use(cors());
app.use(express.json());

// Serves uploaded images so the browser can display them
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected Successfully"))
    .catch(err => console.log("❌ MongoDB Connection Error:", err));

// Configure Multer for file saving
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
const upload = multer({ storage: storage });

// --- API ROUTES ---

// 1. POST: Save a new recipe
app.post("/recipes", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No image uploaded" });
        }

        const newRecipe = new Recipe({
            name: req.body.name,
            category: req.body.category,
            description: req.body.description,
            // Splitting and cleaning ingredients for the checkbox list
            ingredients: req.body.ingredients ? req.body.ingredients.split(",").map(i => i.trim()) : [],
            instructions: req.body.instructions,
            image: `http://localhost:3000/uploads/${req.file.filename}` 
        });

        const savedRecipe = await newRecipe.save(); 
        console.log("✅ Saved to Compass:", savedRecipe.name);
        res.status(201).json(savedRecipe);
    } catch (err) {
        console.log("❌ Database Error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// 2. GET ALL: For the Gallery
app.get("/recipes", async (req, res) => {
    try {
        const recipes = await Recipe.find();
        res.json(recipes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. GET SINGLE: FIXED - This was the missing link for detail.html
app.get("/recipes/:id", async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }
        res.json(recipe);
    } catch (err) {
        res.status(500).json({ message: "Invalid ID format", error: err.message });
    }
});

// 3.5. POST REVIEW: Add a review (with optional image) to a recipe
app.post("/recipes/:id/reviews", upload.single("image"), async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }

        const newReview = {
            reviewerName: req.body.reviewerName || "Anonymous",
            rating: parseInt(req.body.rating) || 5, // Parse the star rating
            comment: req.body.comment,
            image: req.file ? `http://localhost:3000/uploads/${req.file.filename}` : null
        };

        recipe.reviews.push(newReview);
        const savedRecipe = await recipe.save();
        res.status(201).json(savedRecipe);
    } catch (err) {
        console.error("❌ Review Error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// 4. DELETE: Remove a recipe
app.delete("/recipes/:id", async (req, res) => {
    try {
        await Recipe.findByIdAndDelete(req.params.id);
        res.json({ message: "Recipe deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(3000, () => console.log("🚀 Server is live on http://localhost:3000"));