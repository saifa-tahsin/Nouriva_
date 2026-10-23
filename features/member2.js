/**
 * =========================================================================
 * NOURIVA HEALTH & NUTRITION AI — FEATURE 2
 * FEATURE NAME: Personalized AI Nutrition Coach
 * ASSIGNED DEVELOPER: Asma Bintay Arif
 * FILE PATH: features/member2.js
 * =========================================================================
 * 
 * INSTRUCTIONS FOR ASMA BINTAY ARIF:
 * 1. To change recommendations or AI coaching:
 *    Write your code inside `generateCoachAdvice()`.
 * 2. To change the coaching interface / questions:
 *    Customize `renderMember2UI()` below!
 * 3. The main dashboard automatically calls your functions.
 */

window.Member2Feature = {
  developer: "Asma Bintay Arif",
  featureName: "Personalized AI Nutrition Coach",
  status: "Ready for code input",

  // 1. Coaching Advice Generator (Asma - add your recommendation logic here)
  generateCoachAdvice: function(userProfile) {
    console.log("[Member 2 - Asma] Generating coaching for:", userProfile);

    const goal = userProfile.goal || "Metabolic Balance";
    return {
      goal: goal,
      morning: "2 glasses lukewarm water, 2 boiled eggs, and whole-wheat ruti with vegetable sabji.",
      lunch: "Brown rice, fresh Rui or Tilapia fish curry, spinach/palong shak, and 1 bowl thick lentils (daal).",
      snack: "Roasted chickpeas (chhola), seasonal fruits (guava or papaya), and green tea.",
      dinner: "Light chicken stew with raw papaya and carrots, paired with 2 handmade rutis.",
      tips: [
        "Drink at least 2.5 to 3.0 Liters of water daily.",
        "Include local leafy greens (shak) at least 4 days a week for iron.",
        "Eat dinner at least 2 hours before sleeping."
      ]
    };
  }
};
