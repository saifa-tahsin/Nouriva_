/**
 * =========================================================================
 * NOURIVA HEALTH & NUTRITION AI — FEATURE 4
 * FEATURE NAME: Nutrition Tracker & Food Assistant
 * ASSIGNED DEVELOPER: Tahsin Saba Aroby
 * FILE PATH: features/member4.js
 * =========================================================================
 * 
 * INSTRUCTIONS FOR TAHSIN SABA AROBY:
 * 1. To change food logging storage or calorie progress:
 *    Write your code inside `logMealEntry()`.
 * 2. To change conversational AI assistant chat responses:
 *    Write your code inside `askFoodAssistant()`.
 * 3. The main dashboard automatically calls your functions.
 */

window.Member4Feature = {
  developer: "Tahsin Saba Aroby",
  featureName: "Nutrition Tracker & Food Assistant",
  status: "Ready for code input",

  // 1. Food Logging Handler (Aroby - add logging logic here)
  logMealEntry: function(mealItem) {
    console.log("[Member 4 - Aroby] Logging meal:", mealItem);
    return {
      success: true,
      meal: mealItem,
      loggedAt: new Date().toLocaleTimeString()
    };
  },

  // 2. Conversational Assistant (Aroby - add chat responses or API here)
  askFoodAssistant: function(userQuestion) {
    console.log("[Member 4 - Aroby] Assistant query:", userQuestion);

    const q = userQuestion.toLowerCase();
    let reply = "Maintaining balanced meals with local vegetables and lentils gives sustained vitality!";

    if (q.includes("hilsa") || q.includes("ilish") || q.includes("ইলিশ")) {
      reply = "Ilish (Hilsa) is an extraordinary source of Omega-3 fatty acids, excellent for heart and brain health. 100g provides ~270 kcal and 22g of clean protein.";
    } else if (q.includes("daal") || q.includes("lentil") || q.includes("ডাল")) {
      reply = "Mushur Daal is a cornerstone of Bangladeshi nutrition, delivering ~9g of plant protein and 4g of dietary fiber per cup.";
    } else if (q.includes("bhaat") || q.includes("rice") || q.includes("ভাত")) {
      reply = "1 cup of cooked white rice provides ~200 kcal. Pairing it with lentils or fiber-rich shak lowers its glycemic impact.";
    }

    return {
      reply: reply
    };
  }
};
