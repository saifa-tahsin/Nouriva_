/**
 * Foodsphere Nutritio Intelligence - Budget-Aware AI Meal Planner
 * Structured Recipe Dataset (Bangladeshi Everyday Meals)
 * 
 * Each recipe references ingredient IDs from BANGLADESHI_FOOD_DATABASE in data/foods.js.
 * All quantities, costs, and nutrition are derived deterministically from the ingredient
 * quantities and the food table (estimates only). Oil, onion, salt and spices are not counted.
 * The 'diabetic-friendly' tag means vegetable/lentil/whole-wheat emphasis (general food
 * information only, NOT medical advice).
 */

const BANGLADESHI_RECIPE_DATABASE = [
  // --------------------------------------------------------------------------
  // BREAKFAST RECIPES
  // --------------------------------------------------------------------------
  {
    id: "bf_roti_daal_egg",
    name: "Roti with Torka Daal & Boiled Egg",
    bengaliName: "রুটি, ঘন ডাল এবং সিদ্ধ ডিম",
    mealType: "breakfast",
    dietaryPreferences: ["standard", "high-protein"],
    description: "Wholesome whole-wheat rotis paired with protein-packed yellow lentils and an egg.",
    descriptionBn: "পুষ্টিকর আটার রুটি, প্রোটিনসমৃদ্ধ ডাল আর একটি সিদ্ধ ডিম দিয়ে ভরপুর সকালের নাশতা।",
    ingredients: [
      { foodId: "roti", quantity: 2, unit: "piece" },
      { foodId: "lentils_daal", quantity: 40, unit: "g" },
      { foodId: "egg", quantity: 1, unit: "piece" }
    ],
    budgetTier: "economical",
    alternativeSuggestion: null
  },
  {
    id: "bf_roti_shobji_banana",
    name: "Roti with Mixed Shobji & Banana",
    bengaliName: "রুটি, মিক্সড সবজি এবং কলা",
    mealType: "breakfast",
    dietaryPreferences: ["standard", "vegetarian", "budget-saver"],
    description: "Fiber-rich breakfast with seasonal vegetables, potato mash, and fresh local banana.",
    descriptionBn: "মৌসুমি সবজি, আলু ভর্তা আর পাকা দেশি কলা দিয়ে আঁশসমৃদ্ধ সকালের নাশতা।",
    ingredients: [
      { foodId: "roti", quantity: 2, unit: "piece" },
      { foodId: "seasonal_vegetables", quantity: 100, unit: "g" },
      { foodId: "potato", quantity: 50, unit: "g" },
      { foodId: "banana", quantity: 1, unit: "piece" }
    ],
    budgetTier: "budget-saver",
    alternativeSuggestion: null
  },
  {
    id: "bf_dim_khichuri",
    name: "Quick Dim Khichuri (Lentil Rice with Egg)",
    bengaliName: "ডিম খিচুড়ি",
    mealType: "breakfast",
    dietaryPreferences: ["standard", "budget-saver", "high-protein"],
    description: "Comforting morning khichuri made with rice, split lentils, and a topped fried or boiled egg.",
    descriptionBn: "চাল, ডাল আর ওপরে ভাজা বা সিদ্ধ ডিম দিয়ে তৈরি আরামদায়ক সকালের খিচুড়ি।",
    ingredients: [
      { foodId: "rice", quantity: 60, unit: "g" },
      { foodId: "lentils_daal", quantity: 40, unit: "g" },
      { foodId: "egg", quantity: 1, unit: "piece" }
    ],
    budgetTier: "budget-saver",
    alternativeSuggestion: null
  },
  {
    id: "bf_ruti_alu_bhaji",
    name: "Roti with Alu Bhaji",
    bengaliName: "রুটি ও আলু ভাজি",
    mealType: "breakfast",
    dietaryPreferences: ["standard", "vegetarian", "budget-saver"],
    description: "Classic Bangladeshi student breakfast: hand-made rotis with spiced potato bhaji.",
    descriptionBn: "বাংলাদেশি শিক্ষার্থীদের পরিচিত নাশতা: হাতে বানানো রুটির সাথে মসলাদার আলু ভাজি।",
    ingredients: [
      { foodId: "roti", quantity: 2, unit: "piece" },
      { foodId: "potato", quantity: 100, unit: "g" }
    ],
    budgetTier: "ultra-saver",
    alternativeSuggestion: null
  },
  {
    id: "bf_doodh_bhaat_banana",
    name: "Doodh Bhaat with Ripe Banana",
    bengaliName: "দুধ ভাত ও কলা",
    mealType: "breakfast",
    dietaryPreferences: ["standard", "vegetarian"],
    description: "Traditional gentle morning meal with warm cow's milk, steamed rice, and sweet banana.",
    descriptionBn: "গরম গরুর দুধ, সেদ্ধ ভাত আর মিষ্টি কলা দিয়ে ঐতিহ্যবাহী হালকা সকালের খাবার।",
    ingredients: [
      { foodId: "rice", quantity: 70, unit: "g" },
      { foodId: "milk", quantity: 200, unit: "ml" },
      { foodId: "banana", quantity: 1, unit: "piece" }
    ],
    budgetTier: "moderate",
    alternativeSuggestion: "Swap milk for daal to save approx ৳12 BDT."
  },

  // --------------------------------------------------------------------------
  // LUNCH RECIPES
  // --------------------------------------------------------------------------
  {
    id: "lunch_bhaat_fish_daal",
    name: "Bhaat, Rui Macher Jhol & Patla Daal",
    bengaliName: "ভাত, রুই মাছের ঝোল ও পাতলা ডাল",
    mealType: "lunch",
    dietaryPreferences: ["standard", "high-protein"],
    description: "Staple Bengali lunch with steamed rice, fresh Rui fish curry with potatoes, and yellow lentils.",
    descriptionBn: "সেদ্ধ ভাত, আলু দিয়ে তাজা রুই মাছের ঝোল আর পাতলা ডালের চিরচেনা বাঙালি দুপুরের খাবার।",
    ingredients: [
      { foodId: "rice", quantity: 100, unit: "g" },
      { foodId: "fish", quantity: 100, unit: "g" },
      { foodId: "potato", quantity: 50, unit: "g" },
      { foodId: "lentils_daal", quantity: 40, unit: "g" }
    ],
    budgetTier: "premium",
    alternativeSuggestion: "Replace Rui fish with Egg Curry (Dim Bhuna) to save ~৳24 BDT."
  },
  {
    id: "lunch_bhaat_chicken_shobji",
    name: "Bhaat, Broiler Chicken Curry & Shobji",
    bengaliName: "ভাত, ব্রয়লার মুরগির তরকারি ও সবজি",
    mealType: "lunch",
    dietaryPreferences: ["standard", "high-protein"],
    description: "Hearty Bangladeshi chicken curry with diced potatoes, fresh vegetables, and white rice.",
    descriptionBn: "আলুর টুকরা ও তাজা সবজি দিয়ে রান্না করা ভরপেট মুরগির তরকারি, সাথে সাদা ভাত।",
    ingredients: [
      { foodId: "rice", quantity: 100, unit: "g" },
      { foodId: "chicken", quantity: 100, unit: "g" },
      { foodId: "potato", quantity: 50, unit: "g" },
      { foodId: "seasonal_vegetables", quantity: 80, unit: "g" }
    ],
    budgetTier: "moderate",
    alternativeSuggestion: "Replace Chicken with Egg or Daal to save ~৳10-15 BDT."
  },
  {
    id: "lunch_bhaat_dim_daal",
    name: "Bhaat, Dim Bhuna & Ghono Daal",
    bengaliName: "ভাত, ডিম ভুনা ও ঘন ডাল",
    mealType: "lunch",
    dietaryPreferences: ["standard", "budget-saver", "high-protein"],
    description: "High-protein, economical lunch: spiced egg curry with potatoes, fragrant daal, and rice.",
    descriptionBn: "প্রোটিনসমৃদ্ধ ও সাশ্রয়ী দুপুরের খাবার: আলু দিয়ে মসলাদার ডিম ভুনা, সুগন্ধি ডাল আর ভাত।",
    ingredients: [
      { foodId: "rice", quantity: 100, unit: "g" },
      { foodId: "egg", quantity: 1, unit: "piece" },
      { foodId: "lentils_daal", quantity: 50, unit: "g" },
      { foodId: "potato", quantity: 50, unit: "g" }
    ],
    budgetTier: "budget-saver",
    alternativeSuggestion: null
  },
  {
    id: "lunch_bhaat_shobji_daal",
    name: "Bhaat, Mixed Seasonal Shobji & Daal",
    bengaliName: "ভাত, নিরামিষ সবজি ও ডাল",
    mealType: "lunch",
    dietaryPreferences: ["standard", "vegetarian", "budget-saver", "diabetic-friendly"],
    description: "Nutritious vegetarian combo with abundant seasonal vegetables, hearty lentils, and rice.",
    descriptionBn: "প্রচুর মৌসুমি সবজি, ঘন ডাল আর ভাত দিয়ে পুষ্টিকর নিরামিষ খাবার।",
    ingredients: [
      { foodId: "rice", quantity: 100, unit: "g" },
      { foodId: "seasonal_vegetables", quantity: 120, unit: "g" },
      { foodId: "lentils_daal", quantity: 50, unit: "g" },
      { foodId: "potato", quantity: 50, unit: "g" }
    ],
    budgetTier: "ultra-saver",
    alternativeSuggestion: null
  },
  {
    id: "lunch_khichuri_shobji",
    name: "Bengali Shobji Khichuri",
    bengaliName: "সবজি খিচুড়ি",
    mealType: "lunch",
    dietaryPreferences: ["standard", "vegetarian", "budget-saver"],
    description: "One-pot comfort meal combining rice, lentils, seasonal vegetables, and potatoes.",
    descriptionBn: "চাল, ডাল, মৌসুমি সবজি ও আলু দিয়ে এক হাঁড়িতে রান্না করা আরামদায়ক খিচুড়ি।",
    ingredients: [
      { foodId: "rice", quantity: 80, unit: "g" },
      { foodId: "lentils_daal", quantity: 60, unit: "g" },
      { foodId: "seasonal_vegetables", quantity: 100, unit: "g" },
      { foodId: "potato", quantity: 50, unit: "g" }
    ],
    budgetTier: "budget-saver",
    alternativeSuggestion: null
  },

  // --------------------------------------------------------------------------
  // DINNER RECIPES
  // --------------------------------------------------------------------------
  {
    id: "din_roti_omelette_shobji",
    name: "Roti with Egg Omelette & Shobji",
    bengaliName: "রুটি, ডিম অমলেট ও সবজি",
    mealType: "dinner",
    dietaryPreferences: ["standard", "high-protein", "diabetic-friendly"],
    description: "Light evening dinner with whole-wheat rotis, a fluffy egg omelette, and sauteed vegetables.",
    descriptionBn: "আটার রুটি, তুলতুলে ডিমের অমলেট আর ভাজা সবজি দিয়ে হালকা রাতের খাবার।",
    ingredients: [
      { foodId: "roti", quantity: 2, unit: "piece" },
      { foodId: "egg", quantity: 1, unit: "piece" },
      { foodId: "seasonal_vegetables", quantity: 80, unit: "g" },
      { foodId: "potato", quantity: 40, unit: "g" }
    ],
    budgetTier: "economical",
    alternativeSuggestion: null
  },
  {
    id: "din_bhaat_fish_shobji",
    name: "Bhaat, Macher Jhol & Shobji",
    bengaliName: "ভাত, মাছের ঝোল ও সবজি",
    mealType: "dinner",
    dietaryPreferences: ["standard", "high-protein"],
    description: "Delicate dinner with steamed rice, Rui fish in light broth, and fresh seasonal greens.",
    descriptionBn: "সেদ্ধ ভাত, হালকা ঝোলে রুই মাছ আর তাজা মৌসুমি শাক-সবজি দিয়ে হালকা রাতের খাবার।",
    ingredients: [
      { foodId: "rice", quantity: 80, unit: "g" },
      { foodId: "fish", quantity: 100, unit: "g" },
      { foodId: "seasonal_vegetables", quantity: 100, unit: "g" }
    ],
    budgetTier: "premium",
    alternativeSuggestion: "Replace Rui fish with Daal or Egg to save ~৳24 BDT."
  },
  {
    id: "din_roti_daal_shobji",
    name: "Roti with Ghono Daal & Shobji",
    bengaliName: "রুটি, ঘন ডাল ও সবজি তরকারি",
    mealType: "dinner",
    dietaryPreferences: ["standard", "vegetarian", "budget-saver", "diabetic-friendly"],
    description: "Light and digestible vegetarian dinner of rotis with thick lentil stew and vegetables.",
    descriptionBn: "রুটি, ঘন ডাল আর সবজি দিয়ে হালকা ও সহজে হজম হয় এমন নিরামিষ রাতের খাবার।",
    ingredients: [
      { foodId: "roti", quantity: 2, unit: "piece" },
      { foodId: "lentils_daal", quantity: 50, unit: "g" },
      { foodId: "seasonal_vegetables", quantity: 100, unit: "g" }
    ],
    budgetTier: "budget-saver",
    alternativeSuggestion: null
  },
  {
    id: "din_bhaat_alu_dim_daal",
    name: "Bhaat with Alu Bhorta, Dim & Daal",
    bengaliName: "ভাত, আলু ভর্তা, ডিম ও ডাল",
    mealType: "dinner",
    dietaryPreferences: ["standard", "budget-saver", "high-protein"],
    description: "Cherished Bengali staple: steaming rice with mashed spiced potato (alu bhorta), boiled egg, and daal.",
    descriptionBn: "গরম ভাতের সাথে মসলাদার আলু ভর্তা, সিদ্ধ ডিম ও ডাল: প্রিয় বাঙালি খাবার।",
    ingredients: [
      { foodId: "rice", quantity: 80, unit: "g" },
      { foodId: "egg", quantity: 1, unit: "piece" },
      { foodId: "potato", quantity: 80, unit: "g" },
      { foodId: "lentils_daal", quantity: 40, unit: "g" }
    ],
    budgetTier: "budget-saver",
    alternativeSuggestion: null
  },
  {
    id: "din_bhaat_patla_daal",
    name: "Bhaat with Patla Daal & Alu Chorchori",
    bengaliName: "ভাত, পাতলা ডাল ও আলু চরচরি",
    mealType: "dinner",
    dietaryPreferences: ["standard", "vegetarian", "budget-saver"],
    description: "Ultra-budget dinner featuring rice, light yellow lentils, and sliced potato stir-fry.",
    descriptionBn: "ভাত, পাতলা ডাল আর আলু চরচরি দিয়ে খুবই কম খরচের রাতের খাবার।",
    ingredients: [
      { foodId: "rice", quantity: 80, unit: "g" },
      { foodId: "lentils_daal", quantity: 60, unit: "g" },
      { foodId: "potato", quantity: 50, unit: "g" }
    ],
    budgetTier: "ultra-saver",
    alternativeSuggestion: null
  },
  {
    id: "din_roti_milk_banana",
    name: "Roti with Warm Milk & Banana",
    bengaliName: "রুটি, দুধ ও কলা",
    mealType: "dinner",
    dietaryPreferences: ["standard", "vegetarian"],
    description: "Gentle bedtime meal with whole-wheat rotis, a glass of warm milk, and ripe banana.",
    descriptionBn: "আটার রুটি, এক গ্লাস গরম দুধ আর পাকা কলা দিয়ে হালকা রাতের খাবার।",
    ingredients: [
      { foodId: "roti", quantity: 2, unit: "piece" },
      { foodId: "milk", quantity: 250, unit: "ml" },
      { foodId: "banana", quantity: 1, unit: "piece" }
    ],
    budgetTier: "moderate",
    alternativeSuggestion: "Swap milk for daal to save approx ৳14 BDT."
  },

  // --------------------------------------------------------------------------
  // ADDITIONAL RECIPES (added to widen variety for 7-day plans and each diet)
  // --------------------------------------------------------------------------
  {
    id: "bf_roti_dim_shobji",
    name: "Roti with Egg & Vegetable Bhaji",
    bengaliName: "রুটি ও ডিম-সবজি ভাজি",
    mealType: "breakfast",
    dietaryPreferences: ["standard", "high-protein", "budget-saver", "diabetic-friendly"],
    description: "Whole-wheat rotis with a quick egg and mixed-vegetable bhaji for a protein-rich, lower-starch start.",
    descriptionBn: "আটার রুটির সাথে ডিম ও মিশ্র সবজি ভাজি: প্রোটিনসমৃদ্ধ, তুলনামূলক কম শর্করার হালকা সকাল।",
    ingredients: [
      { foodId: "roti", quantity: 2, unit: "piece" },
      { foodId: "egg", quantity: 1, unit: "piece" },
      { foodId: "seasonal_vegetables", quantity: 100, unit: "g" }
    ],
    budgetTier: "economical",
    alternativeSuggestion: null
  },
  {
    id: "bf_roti_shobji_daal",
    name: "Roti with Vegetable Bhaji & Daal",
    bengaliName: "রুটি, সবজি ভাজি ও ডাল",
    mealType: "breakfast",
    dietaryPreferences: ["standard", "vegetarian", "budget-saver", "diabetic-friendly"],
    description: "Light vegetarian breakfast of rotis, sauteed seasonal vegetables and a small bowl of daal.",
    descriptionBn: "রুটি, ভাজা মৌসুমি সবজি আর এক বাটি ডাল দিয়ে হালকা নিরামিষ সকালের নাশতা।",
    ingredients: [
      { foodId: "roti", quantity: 2, unit: "piece" },
      { foodId: "seasonal_vegetables", quantity: 100, unit: "g" },
      { foodId: "lentils_daal", quantity: 30, unit: "g" }
    ],
    budgetTier: "budget-saver",
    alternativeSuggestion: null
  },
  {
    id: "lunch_roti_chicken_shobji",
    name: "Roti, Chicken Curry & Shobji",
    bengaliName: "রুটি, মুরগির তরকারি ও সবজি",
    mealType: "lunch",
    dietaryPreferences: ["standard", "high-protein", "diabetic-friendly"],
    description: "Whole-wheat rotis with a home-style chicken curry and plenty of seasonal vegetables.",
    descriptionBn: "আটার রুটির সাথে ঘরোয়া মুরগির তরকারি আর প্রচুর মৌসুমি সবজি।",
    ingredients: [
      { foodId: "roti", quantity: 3, unit: "piece" },
      { foodId: "chicken", quantity: 100, unit: "g" },
      { foodId: "seasonal_vegetables", quantity: 100, unit: "g" }
    ],
    budgetTier: "moderate",
    alternativeSuggestion: null
  },
  {
    id: "lunch_roti_daal_shobji",
    name: "Roti with Daal & Vegetable Stew",
    bengaliName: "রুটি, ডাল ও সবজির স্টু",
    mealType: "lunch",
    dietaryPreferences: ["standard", "vegetarian", "budget-saver", "diabetic-friendly"],
    description: "Filling vegetarian lunch of rotis, thick lentil daal and a generous portion of vegetables.",
    descriptionBn: "রুটি, ঘন ডাল আর বেশি করে সবজি দিয়ে পেট ভরানো নিরামিষ দুপুরের খাবার।",
    ingredients: [
      { foodId: "roti", quantity: 3, unit: "piece" },
      { foodId: "lentils_daal", quantity: 50, unit: "g" },
      { foodId: "seasonal_vegetables", quantity: 150, unit: "g" }
    ],
    budgetTier: "budget-saver",
    alternativeSuggestion: null
  },
  {
    id: "lunch_bhaat_egg_shobji",
    name: "Bhaat, Egg Curry & Shobji",
    bengaliName: "ভাত, ডিমের তরকারি ও সবজি",
    mealType: "lunch",
    dietaryPreferences: ["standard", "high-protein", "budget-saver"],
    description: "Steamed rice with a two-egg curry and mixed vegetables: simple, protein-rich and affordable.",
    descriptionBn: "ভাতের সাথে দুটি ডিমের তরকারি ও মিশ্র সবজি: সহজ, প্রোটিনসমৃদ্ধ ও সাশ্রয়ী।",
    ingredients: [
      { foodId: "rice", quantity: 100, unit: "g" },
      { foodId: "egg", quantity: 2, unit: "piece" },
      { foodId: "seasonal_vegetables", quantity: 100, unit: "g" }
    ],
    budgetTier: "economical",
    alternativeSuggestion: null
  },
  {
    id: "din_roti_fish_shobji",
    name: "Roti, Fish Curry & Shobji",
    bengaliName: "রুটি, মাছের তরকারি ও সবজি",
    mealType: "dinner",
    dietaryPreferences: ["standard", "high-protein", "diabetic-friendly"],
    description: "Light dinner of whole-wheat rotis with Rui fish curry and sauteed vegetables.",
    descriptionBn: "আটার রুটির সাথে রুই মাছের তরকারি ও ভাজা সবজি দিয়ে হালকা রাতের খাবার।",
    ingredients: [
      { foodId: "roti", quantity: 3, unit: "piece" },
      { foodId: "fish", quantity: 100, unit: "g" },
      { foodId: "seasonal_vegetables", quantity: 100, unit: "g" }
    ],
    budgetTier: "premium",
    alternativeSuggestion: null
  },
  {
    id: "din_roti_dim_shobji",
    name: "Roti, Egg Bhuna & Shobji",
    bengaliName: "রুটি, ডিম ভুনা ও সবজি",
    mealType: "dinner",
    dietaryPreferences: ["standard", "high-protein", "budget-saver", "diabetic-friendly"],
    description: "Rotis with a spiced two-egg bhuna and vegetables for a protein-rich, budget-friendly dinner.",
    descriptionBn: "রুটির সাথে মসলাদার দুই ডিমের ভুনা ও সবজি: প্রোটিনসমৃদ্ধ ও কম খরচের রাতের খাবার।",
    ingredients: [
      { foodId: "roti", quantity: 3, unit: "piece" },
      { foodId: "egg", quantity: 2, unit: "piece" },
      { foodId: "seasonal_vegetables", quantity: 100, unit: "g" }
    ],
    budgetTier: "economical",
    alternativeSuggestion: null
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { BANGLADESHI_RECIPE_DATABASE };
}
