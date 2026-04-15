let originalIngredients = [];
let currentServings = 4;
let isSpeaking = false;

const params = new URLSearchParams(window.location.search);
const recipeId = params.get("id");

if (!recipeId) {
    document.body.innerHTML = "<h2>No Recipe ID found. Please go back to the gallery.</h2>";
} else {
    // Fetch from localStorage instead of Backend
    const recipes = JSON.parse(localStorage.getItem("recipes")) || [];
    const recipe = recipes.find(r => r._id === recipeId);

    if (!recipe) {
        document.body.innerHTML = "<h2>Recipe Not Found! Make sure you clicked from the gallery.</h2>";
    } else {
        // Fill the page with the data found in localStorage
        document.getElementById("title").innerText = recipe.name;
        document.getElementById("img").src = recipe.image;

        // Instructions as Ordered List
        const instLines = recipe.instructions.split(/\n|\.\s/).filter(line => line.trim() !== "");
        let olHTML = "<ol style='padding-left: 20px;'>";
        instLines.forEach(line => {
            olHTML += `<li style="margin-bottom:12px; font-size:17px; line-height:1.6; color:var(--text-muted, #555);">${line.trim()}</li>`;
        });
        olHTML += "</ol>";
        document.getElementById("instructionsText").innerHTML = olHTML;

        // Ingredients Processing
        const items = Array.isArray(recipe.ingredients) ? recipe.ingredients : recipe.ingredients.split(",");
        originalIngredients = items.filter(i => i.trim() !== "");
        renderIngredients();

        // Render Reviews
        const reviewsContainer = document.getElementById("reviewsContainer");
        if (recipe.reviews && recipe.reviews.length > 0) {
            reviewsContainer.innerHTML = "";
            recipe.reviews.forEach(review => {
                const reviewEl = document.createElement("div");
                reviewEl.className = "review-card";
                const imgTag = review.image ? `<img src="${review.image}" alt="Review Photo">` : "";
                const dateStr = new Date(review.createdAt).toLocaleDateString();
                const starStr = "⭐".repeat(review.rating || 5);
                reviewEl.innerHTML = `
                    <h4>${review.reviewerName} <span style="font-size:12px;color:#999;font-weight:normal;">- ${dateStr}</span></h4>
                    <p style="color:#ffb703; margin-bottom:5px;">${starStr}</p>
                    <p>${review.comment}</p>
                    ${imgTag}
                `;
                reviewsContainer.appendChild(reviewEl);
            });
        } else {
            reviewsContainer.innerHTML = "<p>No reviews yet. Be the first to review!</p>";
        }
    }
}

// Share Recipe Function
function shareRecipe() {
    if (navigator.share) {
        navigator.share({
            title: document.getElementById("title").innerText,
            text: 'Check out this awesome recipe!',
            url: window.location.href,
        }).catch(err => console.error("Error sharing", err));
    } else {
        alert("Sharing not supported in this browser. You can copy the URL contextually!");
    }
}

// Submit Review Function (Local Storage Version)
function submitReview() {
    const name = document.getElementById("reviewerName").value || "Guest";
    const rating = document.getElementById("reviewRating").value;
    const comment = document.getElementById("reviewComment").value;
    const imageFile = document.getElementById("reviewImage").files[0];

    if (!comment) {
        alert("Please write a comment for your review!");
        return;
    }

    const recipes = JSON.parse(localStorage.getItem("recipes")) || [];
    const recipeIndex = recipes.findIndex(r => r._id === recipeId);

    if (recipeIndex === -1) {
        alert("Recipe not found!");
        return;
    }

    const processReview = (base64Image = null) => {
        const newReview = {
            reviewerName: name,
            rating: parseInt(rating),
            comment: comment,
            image: base64Image,
            createdAt: new Date().toISOString()
        };

        if (!recipes[recipeIndex].reviews) recipes[recipeIndex].reviews = [];
        recipes[recipeIndex].reviews.push(newReview);
        localStorage.setItem("recipes", JSON.stringify(recipes));

        alert("Review Posted Successfully! 🌟");
        location.reload();
    };

    if (imageFile) {
        const reader = new FileReader();
        reader.onload = (e) => processReview(e.target.result);
        reader.readAsDataURL(imageFile);
    } else {
        processReview();
    }
}


function renderIngredients() {
    const list = document.getElementById("ingredientsList");
    list.innerHTML = "";
    originalIngredients.forEach((item, index) => {
        let displayItem = item.trim();
        // More robust Regex to extract leading digits, fractions, or ranges (e.g., "1-2 cups", "1/2 cup", "2 cloves")
        // This looks for numbers at the start of the string
        const match = displayItem.match(/^([\d\.\/\-]+)\s*(.*)/);
        
        if (match) {
            let numStr = match[1];
            let rest = match[2];
            let num;

            // Handle range like "1-2"
            if (numStr.includes('-')) {
                const parts = numStr.split('-');
                num = (parseFloat(parts[0]) + parseFloat(parts[1])) / 2; // scale by average
            } 
            // Handle fraction like "1/2"
            else if (numStr.includes('/')) {
                const parts = numStr.split('/');
                num = parseFloat(parts[0]) / parseFloat(parts[1]);
            } 
            else {
                num = parseFloat(numStr);
            }

            if (!isNaN(num)) {
                let scaled = (num * currentServings) / 4; // Assuming 4 was the original baseline
                // Format nicely: no decimals if whole, else 2 decimals
                scaled = scaled % 1 === 0 ? scaled : scaled.toFixed(2);
                displayItem = `${scaled} ${rest}`;
            }
        }
        
        const div = document.createElement("div");
        div.className = "checklist-item";
        div.innerHTML = `
            <input type="checkbox" id="ing-${index}">
            <label for="ing-${index}">${displayItem}</label>
        `;
        list.appendChild(div);
    });
}

function changeServings(delta) {
    if (currentServings + delta > 0) {
        currentServings += delta;
        document.getElementById("servingCount").innerText = currentServings;
        renderIngredients();
    }
}

function readRecipe() {
    if (isSpeaking) {
        window.speechSynthesis.cancel();
        isSpeaking = false;
        document.getElementById("readBtn").innerText = "🔊 Read Steps";
        return;
    }
    const txt = document.getElementById("instructionsText").innerText;
    const utterance = new SpeechSynthesisUtterance(txt);
    utterance.onend = () => {
        isSpeaking = false;
        document.getElementById("readBtn").innerText = "🔊 Read Steps";
    };
    window.speechSynthesis.speak(utterance);
    isSpeaking = true;
    document.getElementById("readBtn").innerText = "⏹ Stop Reading";
}

function openLightbox() {
    document.getElementById("lightboxImg").src = document.getElementById("img").src;
    document.getElementById("lightbox").classList.add("active");
}

function closeLightbox() {
    document.getElementById("lightbox").classList.remove("active");
}

function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
}