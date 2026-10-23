/**
 * =========================================================================
 * NOURIVA HEALTH & NUTRITION AI — FEATURE 1
 * FEATURE NAME: AI Food & Health Scanner
 * ASSIGNED DEVELOPER: Jannatul Ferdous Jenny
 * FILE PATH: features/member1.js
 * =========================================================================
 * 
 * INSTRUCTIONS FOR JANNATUL FERDOUS JENNY:
 * 1. To change calculation or add AI APIs:
 *    Write your code inside `member1CalculateNutrition()` or `member1ScanPhoto()`.
 * 2. To change the interface / HTML view:
 *    Customize the function `renderMember1UI()` below!
 * 3. The main dashboard automatically calls your functions.
 */

window.Member1Feature = {
  developer: "Jannatul Ferdous Jenny",
  featureName: "AI Food & Health Scanner",
  status: "Ready for code input",

  // 1. Food calculation function (Jannatul - add your custom logic here)
  calculateNutrition: function(foodName, quantityGrams) {
    console.log("[Member 1 - Jannatul] Analyzing:", foodName, quantityGrams + "g");
    
    // Default fallback calculation:
    const factor = quantityGrams / 100;
    return {
      foodName: foodName,
      grams: quantityGrams,
      calories: Math.round(135 * factor),
      protein: +(3.2 * factor).toFixed(1),
      carbs: +(27.5 * factor).toFixed(1),
      fat: +(0.8 * factor).toFixed(1),
      advice: "Good source of balanced macro energy."
    };
  },

  // 2. Photo / Label Scanner function (Jannatul - add image processing here)
  scanPhoto: function(imageSrc) {
    console.log("[Member 1 - Jannatul] Image scan triggered");
    return {
      success: true,
      detectedFood: "Traditional Bangladeshi Rui Machher Jhol",
      calories: 185,
      protein: 22
    };
  }
};
