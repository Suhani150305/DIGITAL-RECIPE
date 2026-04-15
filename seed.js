const mongoose = require("mongoose");
require("dotenv").config();
const Recipe = require("./models/Recipe");

mongoose.connect(process.env.MONGO_URI)
.then(async () => {
    console.log("Connected.. Generating test mock data");
    
    // Check if recipes exist to avoid duplicates
    const count = await Recipe.countDocuments();
    if (count > 10) {
        console.log("Database already has many recipes. Skipping seed to prevent bloat.");
        process.exit();
    }
    
    const recipes = [
        {
            name: "Classic Margherita Pizza",
            category: "Italian",
            description: "A simple, beautiful Italian classic with fresh basil and mozzarella.",
            ingredients: ["Pizza Dough", "Tomato Sauce", "Fresh Mozzarella", "Basil Leaves", "Olive Oil"],
            instructions: "1. Preheat oven to 500F.\n2. Stretch dough into a circle.\n3. Add sauce and cheese.\n4. Bake for 10-12 mins.\n5. Top with fresh basil right out of the oven.",
            image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80",
            reviews: [
                { reviewerName: "Mario", rating: 5, comment: "Authentic and perfect!", createdAt: new Date() }
            ]
        },
        {
            name: "Vibrant Quinoa Salad",
            category: "Healthy",
            description: "Fresh, vibrant, and packed with protein. Perfect for meal prep.",
            ingredients: ["Quinoa", "Cherry Tomatoes", "Cucumber", "Feta Cheese", "Lemon Dressing", "Mint"],
            instructions: "1. Cook and cool quinoa.\n2. Chop veggies into small cubes.\n3. Mix all ingredients in a large bowl.\n4. Drizzle generously with lemon dressing.",
            image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
            reviews: []
        },
        {
            name: "Decadent Chocolate Cake",
            category: "Dessert",
            description: "A rich, moist, and indulgent chocolate layer cake.",
            ingredients: ["Flour", "Cocoa Powder", "Sugar", "Eggs", "Butter", "Milk", "Vanilla Extract"],
            instructions: "1. Mix dry ingredients together.\n2. Add wet ingredients and beat until smooth.\n3. Pour into pans and bake at 350F for 35 minutes.\n4. Cool before frosting and serving.",
            image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80",
            reviews: [
                { reviewerName: "SweetTooth", rating: 5, comment: "Best cake I've ever made!", createdAt: new Date() },
                { reviewerName: "John", rating: 4, comment: "Very good but a bit sweet for me.", createdAt: new Date() }
            ]
        }
    ];

    await Recipe.insertMany(recipes);
    console.log("Seeded test dishes successfully!");
    process.exit();
}).catch(console.error);
