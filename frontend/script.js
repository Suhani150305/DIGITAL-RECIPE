const container = document.querySelector(".recipe-container");
const searchInput = document.getElementById("searchInput");
const ingredientInput = document.getElementById("ingredientInput");
let allRecipes = [];

// Mock initial data if localStorage is empty
const defaultRecipes = [
    {
        _id: "1",
        name: "Refreshing Berry Smoothie",
        category: "Breakfast",
        description: "Start your day with this vibrant berry mix.",
        ingredients: "1 cup berries, 1/2 cup yogurt, Honey",
        instructions: "Blend all ingredients until smooth. Serve chilled.",
        image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?q=80&w=400",
        reviews: []
    },
    {
        _id: "2",
        name: "Caprese Salad",
        category: "Appetizer",
        description: "Fresh tomatoes, mozzarella, and basil with balsamic glaze.",
        ingredients: "Tomatoes, Mozzarella, Fresh Basil, Balsamic Glaze",
        instructions: "Slice tomatoes and mozzarella. Layer them with basil leaves. Drizzle with balsamic glaze.",
        image: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?q=80&w=400",
        reviews: []
    },
    {
        _id: "3",
        name: "Creamy Tomato Pasta",
        category: "Main Course",
        description: "A rich and velvety pink sauce pasta that everyone loves.",
        ingredients: "250g Penne, 2 cups Marinara sauce, 1/2 cup Cream, Parmesan",
        instructions: "Cook pasta. Heat marinara sauce and stir in cream. Toss pasta in sauce and top with cheese.",
        image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=400",
        reviews: []
    },
    {
        _id: "4",
        name: "Paneer Butter Masala",
        category: "Indian Cuisine",
        description: "A classic Indian dish with soft paneer cubes in a spicy, buttery gravy.",
        ingredients: "200g Paneer, 2 Onions, 3 Tomatoes, Ginger-garlic paste, Butter, Cream, Spices",
        instructions: "Sauté onions and ginger-garlic paste. Add tomato puree and spices. Cook until thick. Stir in butter, cream, and paneer cubes.",
        image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=400",
        reviews: []
    },
    {
        _id: "5",
        name: "Fudgy Chocolate Brownie",
        category: "Dessert",
        description: "Gooey, chocolatey, and incredibly rich brownies.",
        ingredients: "1/2 cup Cocoa powder, 1 cup Sugar, 2 Eggs, 1/2 cup Flour, 1/2 cup Butter, Choco chips",
        instructions: "Melt butter and whisk in sugar and eggs. Stir in cocoa and flour. Fold in chocolate chips and bake at 180°C for 25 minutes.",
        image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?q=80&w=400",
        reviews: []
    },

];

// Initialize localStorage if needed (reset if count is less than our 6 defaults)
// Added version key to force-clear previous broken images
const LOCAL_STORAGE_VERSION = "1.3";
if (localStorage.getItem("recipeVersion") !== LOCAL_STORAGE_VERSION) {
    localStorage.setItem("recipes", JSON.stringify(defaultRecipes));
    localStorage.setItem("recipeVersion", LOCAL_STORAGE_VERSION);
}

const existingRecipes = JSON.parse(localStorage.getItem("recipes")) || [];
if (existingRecipes.length < 6) {
    localStorage.setItem("recipes", JSON.stringify(defaultRecipes));
}






// 1. Fetch recipes from localStorage
function fetchRecipes() {
    container.innerHTML = '<div class="card skeleton"></div><div class="card skeleton"></div><div class="card skeleton"></div>';

    // Simulate a short delay for that "pro" feel
    setTimeout(() => {
        allRecipes = JSON.parse(localStorage.getItem("recipes")) || [];
        displayRecipes(allRecipes);
    }, 300);
}

// 2. Display recipes as cards
function displayRecipes(recipes) {
    container.innerHTML = "";

    if (recipes.length === 0) {
        container.innerHTML = "<p>No recipes found.</p>";
        return;
    }

    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    recipes.forEach(recipe => {
        const isFav = favorites.includes(recipe._id) ? "active" : "";
        const card = `
            <div class="card">
                <button class="delete-btn" onclick="deleteRecipe('${recipe._id}')">🗑️</button>
                <button class="fav-btn ${isFav}" onclick="toggleFavorite('${recipe._id}', this)">❤️</button>
                
                <img src="${recipe.image}" alt="${recipe.name}">
                <h3>${recipe.name}</h3>
                <p><strong>${recipe.category}</strong></p>
                <p>${recipe.description}</p>
                
                <a href="detail.html?id=${recipe._id}" class="btn-small">View Details</a>
            </div>
        `;
        container.innerHTML += card;
    });
}

// 3. SEARCH FUNCTION
function filterRecipes() {
    const valueName = searchInput.value.toLowerCase();
    const valueIng = ingredientInput.value.toLowerCase().split(",").map(i => i.trim()).filter(i => i);

    const filtered = allRecipes.filter(recipe => {
        const nameMatch = recipe.name.toLowerCase().includes(valueName);
        let ingMatch = true;

        if (valueIng.length > 0) {
            const recipeIngs = Array.isArray(recipe.ingredients) ? recipe.ingredients.join(" ").toLowerCase() : (recipe.ingredients || "").toLowerCase();
            ingMatch = valueIng.every(ing => recipeIngs.includes(ing));
        }

        return nameMatch && ingMatch;
    });
    displayRecipes(filtered);
}

searchInput.addEventListener("keyup", filterRecipes);
ingredientInput.addEventListener("keyup", filterRecipes);

// 3.5 FAVORITE TOGGLE
function toggleFavorite(id, btn) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if (favorites.includes(id)) {
        favorites = favorites.filter(favId => favId !== id);
        btn.classList.remove("active");
    } else {
        favorites.push(id);
        btn.classList.add("active");
    }
    localStorage.setItem("favorites", JSON.stringify(favorites));
}

// 5. DELETE RECIPE (Added for a professional touch)
function deleteRecipe(id) {
    if (confirm("Are you sure you want to delete this recipe?")) {
        let recipes = JSON.parse(localStorage.getItem("recipes")) || [];
        recipes = recipes.filter(r => r._id !== id);
        localStorage.setItem("recipes", JSON.stringify(recipes));

        alert("Recipe Deleted!");
        fetchRecipes(); // Refresh list
    }
}

// Initialize on load
fetchRecipes();
