const mongoose = require("mongoose");

// Defining the blueprint for a Recipe document
const RecipeSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, "Recipe name is required"],
        trim: true 
    },
    category: { 
        type: String, 
        required: [true, "Category is required"],
        enum: ["Italian", "Dessert", "Healthy", "Indian", "Fast Food"] // Limits to specific types
    },
    rating: { 
        type: String, 
        default: "⭐⭐⭐⭐☆" 
    },
    description: { 
        type: String, 
        required: true 
    },
    image: { 
        type: String, 
        required: true,
        default: "images/default.jpg" // Fallback image
    },
    // New fields for professional depth
    ingredients: {
        type: [String], 
        required: false 
    },
    instructions: {
        type: String,
        required: false
    },
    reviews: [{
        reviewerName: { type: String, required: true },
        rating: { type: Number, required: true, default: 5 },
        comment: { type: String, required: true },
        image: { type: String, required: false },
        createdAt: { type: Date, default: Date.now }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Export the model so server.js can use it to perform CRUD operations
module.exports = mongoose.model("Recipe", RecipeSchema);