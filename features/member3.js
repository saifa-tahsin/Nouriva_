/**
 * =========================================================================
 * NOURIVA HEALTH & NUTRITION AI — FEATURE 3
 * FEATURE NAME: Budget-Aware AI Meal Planner
 * ASSIGNED DEVELOPER: Saifa Tahsin
 * FILE PATH: features/member3.js
 * =========================================================================
 * 
 * INSTRUCTIONS FOR SAIFA TAHSIN:
 * 1. To change Bangladeshi food costs, budget algorithms, or grocery lists:
 *    Write your code inside `planBudgetMeals()`.
 * 2. To change the planner layout:
 *    Customize `renderMember3UI()` below!
 * 3. The main dashboard automatically calls your functions.
 */

window.Member3Feature = {
  developer: "Saifa Tahsin",
  featureName: "Budget-Aware AI Meal Planner",
  status: "Ready for code input",

  // 1. Budget Optimizer (Saifa - add your bazaar cost calculations here)
  planBudgetMeals: function(budgetBDT, familyMembers) {
    console.log("[Member 3 - Saifa] Planning budget for:", budgetBDT + " BDT", familyMembers + " people");

    const perPerson = budgetBDT;
    let meals = [];

    if (perPerson < 200) {
      meals = [
        { meal: "Breakfast", name: "2 Handmade Rutis + Dim Bhaji (Egg Omelette) + Cha", costBDT: 40, calories: 340 },
        { meal: "Lunch", name: "Bhaat (Rice) + Thick Mushur Daal + Aloo Bhorta + Lal Shak", costBDT: 65, calories: 580 },
        { meal: "Snack", name: "Muri (Puffed Rice) with roasted Chhola & cucumber", costBDT: 20, calories: 160 },
        { meal: "Dinner", name: "Khichuri with Dim Bhuna & Tomato Salad", costBDT: 60, calories: 520 }
      ];
    } else {
      meals = [
        { meal: "Breakfast", name: "Whole Wheat Ruti + Vegetable Sabji + 1 Boiled Egg", costBDT: 55, calories: 380 },
        { meal: "Lunch", name: "Rice + Fresh Rui Fish Curry + Palong Shak + Mushur Daal", costBDT: 110, calories: 640 },
        { meal: "Snack", name: "Seasonal Fruit (Guava / Banana) + Green Tea", costBDT: 25, calories: 120 },
        { meal: "Dinner", name: "2 Rutis + Chicken Papaya Stew (Murgir Jhol with Pepe)", costBDT: 90, calories: 490 }
      ];
    }

    const totalCost = meals.reduce((acc, m) => acc + m.costBDT, 0) * (familyMembers || 1);
    const totalCalories = meals.reduce((acc, m) => acc + m.calories, 0);

    return {
      meals: meals,
      totalCostBDT: totalCost,
      totalCalories: totalCalories,
      shoppingList: [
        "Miniket / Brown Rice (5kg)",
        "Mushur Daal (1kg)",
        "Eggs (1 Dozen)",
        "Palong / Lal Shak (2 bunches)",
        "Rui Fish (1kg)",
        "Seasonal Fruits"
      ],
      smartSavingsTip: "Purchasing fish and seasonal greens in local morning bazaars saves up to 25% compared to supermarkets."
    };
  }
};
