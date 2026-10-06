function showLoading(element) {
    element.innerHTML = `
        <div class="empty-result">
            <span>⏳</span>
            <h3>Working...</h3>
            <p>Please wait a moment.</p>
        </div>
    `;
}

function createRecipe() {
    const ingredientsInput = document.getElementById("ingredients").value.trim();
    const result = document.getElementById("recipeResult");

    if (!ingredientsInput) {
        result.innerHTML = `
            <div class="empty-result">
                <span>⚠️</span>
                <h3>Please enter ingredients</h3>
                <p>Enter at least one ingredient to create a recipe.</p>
            </div>
        `;
        return;
    }

    showLoading(result);

    setTimeout(() => {
        const ingredients = ingredientsInput
            .split(",")
            .map(item => item.trim())
            .filter(item => item);

        const text = ingredientsInput.toLowerCase();

        let recipeName;
        let extraIngredients;
        let instructions;

        if (text.includes("egg") && text.includes("tomato")) {
            recipeName = "Tomato Egg Scramble";
            extraIngredients = ["Salt", "Black pepper", "Oil", "Onion"];
            instructions = [
                "Heat a little oil in a pan.",
                "Add chopped onion and tomato.",
                "Cook until the tomato becomes soft.",
                "Beat the eggs and add them to the pan.",
                "Add salt and black pepper.",
                "Stir gently until the eggs are fully cooked.",
                "Serve hot."
            ];
        } else if (text.includes("rice") && text.includes("tomato")) {
            recipeName = "Easy Tomato Rice";
            extraIngredients = ["Onion", "Salt", "Oil", "Chili powder"];
            instructions = [
                "Heat oil in a pan.",
                "Add chopped onion and cook until soft.",
                "Add chopped tomatoes and spices.",
                "Cook until the tomatoes become soft.",
                "Add cooked rice.",
                "Mix everything well and cook for a few minutes.",
                "Serve hot."
            ];
        } else if (text.includes("bread") && text.includes("egg")) {
            recipeName = "Simple Egg Bread Toast";
            extraIngredients = ["Salt", "Pepper", "Oil"];
            instructions = [
                "Beat the eggs in a bowl.",
                "Add salt and pepper.",
                "Dip the bread slices into the egg mixture.",
                "Heat a pan with a little oil.",
                "Toast both sides until golden.",
                "Serve warm."
            ];
        } else {
            recipeName = "Simple Mixed Ingredient Recipe";
            extraIngredients = ["Salt", "Pepper", "Oil", "Basic spices"];
            instructions = [
                "Wash and prepare all the ingredients.",
                "Heat a small amount of oil in a pan.",
                "Add the ingredients that need longer cooking first.",
                "Add the remaining ingredients.",
                "Season with salt, pepper and basic spices.",
                "Cook until everything is properly done.",
                "Serve hot."
            ];
        }

        result.innerHTML = `
            <h2 class="result-title">${recipeName}</h2>
            <div class="result-section">
                <h4>🥕 Your Ingredients</h4>
                <ul>
                    ${ingredients.map(item => `<li>${item}</li>`).join("")}
                </ul>
            </div>
            <div class="result-section">
                <h4>🧂 Additional Ingredients</h4>
                <ul>
                    ${extraIngredients.map(item => `<li>${item}</li>`).join("")}
                </ul>
            </div>
            <div class="result-section">
                <h4>👨‍🍳 Instructions</h4>
                <ol>
                    ${instructions.map(item => `<li>${item}</li>`).join("")}
                </ol>
            </div>
        `;
    }, 500);
}

function createPackingList() {
    const destination = document.getElementById("destination").value.trim();
    const days = parseInt(document.getElementById("days").value);
    const season = document.getElementById("season").value;
    const result = document.getElementById("packingResult");

    if (!destination || !days || days < 1 || !season) {
        result.innerHTML = `
            <div class="empty-result">
                <span>⚠️</span>
                <h3>Complete all fields</h3>
                <p>Please enter destination, number of days and season.</p>
            </div>
        `;
        return;
    }

    showLoading(result);

    setTimeout(() => {
        const clothesCount = Math.max(2, Math.min(days, 7));
        const clothes = [
            `${clothesCount} tops`,
            `${Math.max(1, Math.min(Math.ceil(days / 2), 4))} bottoms`,
            "Underwear",
            "Socks",
            "Comfortable shoes",
            "Sleepwear"
        ];

        const personalItems = [
            "Toothbrush and toothpaste",
            "Face wash",
            "Shampoo",
            "Soap",
            "Towel",
            "Comb",
            "Personal care items"
        ];

        const essentials = [
            "Mobile phone",
            "Phone charger",
            "Wallet",
            "ID documents",
            "Travel tickets",
            "Water bottle",
            "Small first-aid kit"
        ];

        const optional = [
            "Sunglasses",
            "Power bank",
            "Headphones",
            "Small backpack"
        ];

        const destinationText = destination.toLowerCase();

        if (season === "summer") {
            clothes.push("Light cotton clothes");
            optional.push("Sunscreen", "Cap or hat");
        }

        if (season === "winter") {
            clothes.push("Warm jacket", "Sweater");
            optional.push("Gloves", "Warm scarf");
        }

        if (season === "monsoon") {
            essentials.push("Umbrella");
            clothes.push("Quick-dry clothes");
            optional.push("Waterproof bag", "Raincoat");
        }

        if (season === "spring" || season === "autumn") {
            clothes.push("Light jacket");
        }

        if (
            destinationText.includes("beach") ||
            destinationText.includes("goa") ||
            destinationText.includes("maldives")
        ) {
            optional.push("Swimwear", "Beach towel", "Flip-flops");
        }

        if (
            destinationText.includes("mountain") ||
            destinationText.includes("hill") ||
            destinationText.includes("manali")
        ) {
            optional.push("Walking shoes", "Small backpack");
        }

        result.innerHTML = `
            <h2 class="result-title">🧳 Packing List</h2>
            <p><strong>Destination:</strong> ${destination}</p>
            <p><strong>Trip Duration:</strong> ${days} day${days > 1 ? "s" : ""}</p>
            <p><strong>Season:</strong> ${season.charAt(0).toUpperCase() + season.slice(1)}</p>
            <br>
            <div class="result-section">
                <h4>👕 Clothes</h4>
                <ul>${clothes.map(item => `<li>${item}</li>`).join("")}</ul>
            </div>
            <div class="result-section">
                <h4>🧴 Personal Items</h4>
                <ul>${personalItems.map(item => `<li>${item}</li>`).join("")}</ul>
            </div>
            <div class="result-section">
                <h4>📱 Travel Essentials</h4>
                <ul>${essentials.map(item => `<li>${item}</li>`).join("")}</ul>
            </div>
            <div class="result-section">
                <h4>⭐ Optional Items</h4>
                <ul>${optional.map(item => `<li>${item}</li>`).join("")}</ul>
            </div>
        `;
    }, 500);
}

function createGiftIdeas() {
    const relationship = document.getElementById("relationship").value;
    const age = parseInt(document.getElementById("age").value);
    const budget = document.getElementById("budget").value;
    const interest = document.getElementById("interest").value.trim();
    const result = document.getElementById("giftResult");

    if (!relationship || !age || age < 1 || !budget || !interest) {
        result.innerHTML = `
            <div class="empty-result">
                <span>⚠️</span>
                <h3>Complete all fields</h3>
                <p>Please enter relationship, age, budget and interest.</p>
            </div>
        `;
        return;
    }

    showLoading(result);

    setTimeout(() => {
        const interestText = interest.toLowerCase();
        let ideas;

        if (
            interestText.includes("gaming") ||
            interestText.includes("game")
        ) {
            ideas = [
                "Gaming mouse",
                "Gaming headset",
                "Game controller",
                "Gaming desk accessories",
                "Gift card for games"
            ];
        } else if (
            interestText.includes("music") ||
            interestText.includes("singing")
        ) {
            ideas = [
                "Wireless headphones",
                "Bluetooth speaker",
                "Music-themed accessories",
                "Concert tickets",
                "Music subscription gift"
            ];
        } else if (
            interestText.includes("book") ||
            interestText.includes("reading")
        ) {
            ideas = [
                "A popular book",
                "Personalized bookmark",
                "Reading lamp",
                "Bookshelf organizer",
                "E-book gift card"
            ];
        } else if (
            interestText.includes("fitness") ||
            interestText.includes("gym")
        ) {
            ideas = [
                "Fitness bottle",
                "Workout accessories",
                "Gym bag",
                "Sports shoes",
                "Fitness tracker"
            ];
        } else {
            ideas = [
                "Personalized photo frame",
                "Customized mug",
                "Gift hamper",
                "Wallet or purse",
                "Personalized notebook"
            ];
        }

        if (budget === "low") {
            ideas = ideas.slice(0, 3);
        } else if (budget === "premium") {
            ideas.push("Premium experience gift", "Smart device");
        }

        result.innerHTML = `
            <h2 class="result-title">🎁 Gift Ideas</h2>
            <p><strong>For:</strong> ${relationship}</p>
            <p><strong>Age:</strong> ${age}</p>
            <p><strong>Interest:</strong> ${interest}</p>
            <br>
            <div class="result-section">
                <h4>✨ Suggestions</h4>
                <ul>${ideas.map(item => `<li>${item}</li>`).join("")}</ul>
            </div>
            <div class="result-section">
                <h4>💡 Tip</h4>
                <p>Choose a gift that matches the person's interests and your budget.</p>
            </div>
        `;
    }, 500);
}

function improveMessage() {
    const message = document.getElementById("messageText").value.trim();
    const style = document.getElementById("messageStyle").value;
    const result = document.getElementById("messageResult");

    if (!message) {
        result.innerHTML = `
            <div class="empty-result">
                <span>⚠️</span>
                <h3>Please enter a message</h3>
                <p>Enter the WhatsApp message you want to improve.</p>
            </div>
        `;
        return;
    }

    showLoading(result);

    setTimeout(() => {
        const lowerMessage = message.toLowerCase();
        let improved;

        if (
            lowerMessage.includes("tomorrow") &&
            lowerMessage.includes("class") &&
            lowerMessage.includes("10 am")
        ) {
            if (style === "friendly") {
                improved = "Hi everyone! Just a reminder that we have class tomorrow at 10:00 AM. Please make sure to attend. See you there!";
            } else if (style === "formal") {
                improved = "Dear Students, this is to inform you that the class will be held tomorrow at 10:00 AM. All students are requested to attend.";
            } else if (style === "short") {
                improved = "Reminder: Class is tomorrow at 10:00 AM. All students should attend.";
            } else {
                improved = "Dear Students, please be informed that the class will be held tomorrow at 10:00 AM. All students are required to attend.";
            }
        } else {
            const cleaned = message
                .replace(/\s+/g, " ")
                .trim();

            if (style === "friendly") {
                improved = `Hi everyone! ${capitalizeFirstLetter(cleaned)}. Thanks!`;
            } else if (style === "formal") {
                improved = `Dear All,\n\n${capitalizeFirstLetter(cleaned)}.\n\nThank you.`;
            } else if (style === "short") {
                improved = capitalizeFirstLetter(cleaned);
            } else {
                improved = `Hello,\n\n${capitalizeFirstLetter(cleaned)}.\n\nThank you.`;
            }
        }

        result.innerHTML = `
            <h2 class="result-title">💬 Improved Message</h2>
            <div class="result-message">${improved}</div>
        `;
    }, 500);
}

function analyzeHeadline() {
    const headline = document.getElementById("headlineText").value.trim();
    const result = document.getElementById("headlineResult");

    if (!headline) {
        result.innerHTML = `
            <div class="empty-result">
                <span>⚠️</span>
                <h3>Please enter a headline</h3>
                <p>Enter a news headline to analyze it.</p>
            </div>
        `;
        return;
    }

    showLoading(result);

    setTimeout(() => {
        const text = headline.toLowerCase();
        const warnings = [];
        const suggestions = [];

        const emotionalWords = [
            "shocking",
            "amazing",
            "unbelievable",
            "terrifying",
            "horrifying",
            "incredible",
            "outrageous",
            "secret",
            "explosive"
        ];

        const clickbaitWords = [
            "you won't believe",
            "what happens next",
            "this changes everything",
            "number one",
            "must see"
        ];

        const absoluteWords = [
            "always",
            "never",
            "everyone",
            "nobody",
            "completely",
            "definitely"
        ];

        const foundEmotionalWords = emotionalWords.filter(word =>
            text.includes(word)
        );

        const foundClickbaitWords = clickbaitWords.filter(phrase =>
            text.includes(phrase)
        );

        const foundAbsoluteWords = absoluteWords.filter(word =>
            text.includes(word)
        );

        if (foundEmotionalWords.length > 0) {
            warnings.push(
                `Emotional wording detected: ${foundEmotionalWords.join(", ")}`
            );
        }

        if (foundClickbaitWords.length > 0) {
            warnings.push(
                `Possible clickbait phrase detected: ${foundClickbaitWords.join(", ")}`
            );
        }

        if (headline.includes("!")) {
            warnings.push("The headline uses an exclamation mark.");
        }

        if (foundAbsoluteWords.length > 0) {
            warnings.push(
                `Absolute wording detected: ${foundAbsoluteWords.join(", ")}`
            );
        }

        if (warnings.length === 0) {
            suggestions.push("The headline does not show obvious clickbait warning signs.");
            suggestions.push("Check the original news source before accepting the claim.");
        } else {
            suggestions.push("Look for the original source of the story.");
            suggestions.push("Compare the headline with information from reliable sources.");
            suggestions.push("Check whether the headline's main claim is supported by evidence.");
        }

        result.innerHTML = `
            <h2 class="result-title">📰 Headline Analysis</h2>
            <div class="analysis-box">
                <h4>Headline</h4>
                <p>${headline}</p>
            </div>
            <div class="analysis-box">
                <h4 class="${warnings.length > 0 ? "warning" : "success"}">
                    ${warnings.length > 0 ? "⚠️ Warning Signs Found" : "✅ No Obvious Warning Signs"}
                </h4>
                ${
                    warnings.length > 0
                    ? `<ul>${warnings.map(item => `<li>${item}</li>`).join("")}</ul>`
                    : "<p>No obvious emotional or clickbait wording was detected.</p>"
                }
            </div>
            <div class="analysis-box">
                <h4>🔎 Verification Suggestions</h4>
                <ul>${suggestions.map(item => `<li>${item}</li>`).join("")}</ul>
            </div>
            <div class="analysis-box">
                <h4>ℹ️ Important</h4>
                <p>This tool analyzes the wording of a headline. It does not determine whether the news story is true or false.</p>
            </div>
        `;
    }, 500);
}

function capitalizeFirstLetter(text) {
    if (!text) {
        return "";
    }

    return text.charAt(0).toUpperCase() + text.slice(1);
}