function addRecipe() {
    const name = document.getElementById("name").value;
    const category = document.getElementById("category").value;
    const desc = document.getElementById("desc").value;
    const ingredients = document.getElementById("ingredients").value;
    const instructions = document.getElementById("instructions").value;
    const imageFile = document.getElementById("imageInput").files[0];

    // Basic Validation
    if (!name || !imageFile) {
        alert("Please provide at least a name and an image!");
        return;
    }

    // Convert Image to Base64 for localStorage
    const reader = new FileReader();
    reader.onload = function(e) {
        const base64Image = e.target.result;

        // Create New Recipe Object
        const newRecipe = {
            _id: Date.now().toString(), // Unique ID based on timestamp
            name: name,
            category: category,
            description: desc,
            ingredients: ingredients,
            instructions: instructions,
            image: base64Image,
            reviews: []
        };

        // Save to localStorage
        const recipes = JSON.parse(localStorage.getItem("recipes")) || [];
        recipes.push(newRecipe);
        localStorage.setItem("recipes", JSON.stringify(recipes));

        alert("Recipe Posted Successfully! 🍳");
        window.location.href = "recipes.html"; // Redirect to gallery
    };

    reader.onerror = function() {
        alert("Failed to read image file.");
    };

    reader.readAsDataURL(imageFile);
}

