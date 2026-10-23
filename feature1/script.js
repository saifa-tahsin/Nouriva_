const form = document.getElementById("food-form");
const foodRows = document.getElementById("food-rows");
const addFoodButton = document.getElementById("add-food-button");
const imageInput = document.getElementById("food-image");
const uploadTitle = document.getElementById("upload-title");
const imagePreview = document.getElementById("image-preview");
const analyzeButton = document.getElementById("analyze-button");
const buttonLabel = document.getElementById("button-label");
const statusMessage = document.getElementById("status-message");
const resultCard = document.getElementById("result-card");

let selectedImageBase64 = "";
let selectedImageMimeType = "";

addFoodButton.addEventListener("click", () => {
  const row = document.createElement("div");
  row.className = "food-row";
  row.innerHTML = `
    <label class="field food-name-field">
      <span>Food name</span>
      <input class="food-name" type="text" placeholder="e.g. egg, dal, vegetables" autocomplete="off" required>
    </label>
    <label class="field quantity-field">
      <span>Quantity</span>
      <input class="food-quantity" type="number" min="0.1" step="0.1" value="1" required>
    </label>
    <label class="field unit-field">
      <span>Unit</span>
      <select class="food-unit">
        <option value="serving">serving</option><option value="g">g</option><option value="ml">ml</option>
        <option value="cup">cup</option><option value="piece">piece</option><option value="tbsp">tbsp</option><option value="tsp">tsp</option>
      </select>
    </label>
    <button class="remove-btn" type="button">Remove</button>`;
  foodRows.appendChild(row);
  updateRemoveButtons();
  row.querySelector(".food-name").focus();
});

foodRows.addEventListener("click", (event) => {
  const button = event.target.closest(".remove-btn");
  if (!button || button.disabled) return;
  button.closest(".food-row").remove();
  updateRemoveButtons();
});

function updateRemoveButtons() {
  const buttons = foodRows.querySelectorAll(".remove-btn");
  buttons.forEach((button) => { button.disabled = buttons.length === 1; });
}

imageInput.addEventListener("change", () => {
  const file = imageInput.files && imageInput.files[0];
  selectedImageBase64 = "";
  selectedImageMimeType = "";

  if (!file) {
    imagePreview.hidden = true;
    imagePreview.removeAttribute("src");
    uploadTitle.textContent = "Choose a food image (JPG, PNG or WEBP; under 7 MB)";
    return;
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    showStatus("Please choose a JPG, PNG, or WEBP image.", true);
    imageInput.value = "";
    return;
  }
  if (file.size > 7 * 1024 * 1024) {
    showStatus("Image is too large. Please choose an image under 7 MB.", true);
    imageInput.value = "";
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    const result = String(reader.result || "");
    const commaIndex = result.indexOf(",");
    if (commaIndex < 0) {
      showStatus("Could not read this image. Please choose it again.", true);
      return;
    }
    selectedImageBase64 = result.slice(commaIndex + 1);
    selectedImageMimeType = file.type;
    imagePreview.src = result;
    imagePreview.hidden = false;
    uploadTitle.textContent = file.name;
    showStatus("Image ready to analyze.", false);
  };
  reader.onerror = () => showStatus("Could not read this image. Please try another one.", true);
  reader.readAsDataURL(file);
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const rows = Array.from(foodRows.querySelectorAll(".food-row"));
  const foods = [];

  for (const row of rows) {
    const foodName = row.querySelector(".food-name").value.trim();
    const quantityText = row.querySelector(".food-quantity").value.trim();
    const quantity = Number(quantityText);
    const unit = row.querySelector(".food-unit").value;

    if (!foodName) {
      showStatus("Please enter a name for each food row.", true);
      row.querySelector(".food-name").focus();
      return;
    }
    if (!quantityText || !Number.isFinite(quantity) || quantity <= 0) {
      showStatus("Each food quantity must be greater than zero.", true);
      row.querySelector(".food-quantity").focus();
      return;
    }
    foods.push({ foodName, quantity, unit });
  }

  analyzeButton.disabled = true;
  addFoodButton.disabled = true;
  foodRows.querySelectorAll("input, select, .remove-btn").forEach((el) => { el.disabled = true; });
  buttonLabel.textContent = "Analyzing meal...";
  showStatus("Please wait. AI is estimating your meal nutrition.", false);

  try {
    const response = await fetch("/api/analyze-meal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        foods,
        imageBase64: selectedImageBase64,
        mimeType: selectedImageMimeType
      })
    });

    const responseText = await response.text();
    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      console.error("Expected JSON but received:", response.status, responseText.slice(0, 500));
      throw new Error("Server returned a webpage instead of JSON. Open http://localhost:3000 and start the server from this project folder.");
    }
    if (!response.ok) throw new Error(data.error || `Request failed (${response.status}).`);

    renderResult(data);
    showStatus("Analysis complete. Nutrition values are estimates.", false);
    resultCard.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (error) {
    console.error("Meal analysis failed:", error);
    showStatus(error.message || "Something went wrong. Please try again.", true);
  } finally {
    analyzeButton.disabled = false;
    addFoodButton.disabled = false;
    foodRows.querySelectorAll("input, select").forEach((el) => { el.disabled = false; });
    buttonLabel.textContent = "Analyze my meal";
    updateRemoveButtons();
  }
});

function renderResult(data) {
  const totals = data.totals || {};
  document.getElementById("result-title").textContent = "Combined Nutrition Result";
  document.getElementById("total-calories").textContent = formatNumber(totals.calories);
  document.getElementById("total-protein").textContent = formatNumber(totals.protein);
  document.getElementById("total-carbs").textContent = formatNumber(totals.carbs);
  document.getElementById("total-fat").textContent = formatNumber(totals.fat);

  const tableBody = document.getElementById("food-results");
  tableBody.replaceChildren();
  (Array.isArray(data.items) ? data.items : []).forEach((food) => {
    const tr = document.createElement("tr");
    const values = [
      `${food.foodName || "Food"} (${formatNumber(food.quantity)} ${food.unit || ""})`.trim(),
      formatNumber(food.calories),
      `${formatNumber(food.protein)} g`,
      `${formatNumber(food.carbs)} g`,
      `${formatNumber(food.fat)} g`
    ];
    values.forEach((value) => {
      const td = document.createElement("td");
      td.textContent = value;
      tr.appendChild(td);
    });
    tableBody.appendChild(tr);
  });

  const ingredientsList = document.getElementById("ingredients-list");
  ingredientsList.replaceChildren();
  const ingredients = Array.isArray(data.ingredients) ? data.ingredients : [];
  if (!ingredients.length) {
    const li = document.createElement("li");
    li.textContent = "Ingredients not identified";
    ingredientsList.appendChild(li);
  } else {
    ingredients.forEach((ingredient) => {
    const li = document.createElement("li");
    li.textContent = String(ingredient);
    ingredientsList.appendChild(li);
    });
  }
  document.getElementById("info-text").textContent = data.info || "Nutrition values are estimates.";
  resultCard.hidden = false;
}

function formatNumber(value) {
  const number = Number(value);
  return Number.isFinite(number)
    ? number.toLocaleString(undefined, { maximumFractionDigits: 1 })
    : "—";
}

function showStatus(message, isError) {
  statusMessage.textContent = message;
  statusMessage.classList.toggle("error", Boolean(isError));
}
