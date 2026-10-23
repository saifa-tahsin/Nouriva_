/**
 * =========================================================================
 * NOURIVA BACKEND CONNECTOR & INTEGRATION REGISTRY
 * =========================================================================
 * This central router connects the 4 team member backend modules:
 * - Feature 1: Saifa Tahsin
 * - Feature 2: Asma Bintay Arif
 * - Feature 3: Jannatul Ferdous Jenny
 * - Feature 4: Tahsin Saba Aroby
 * 
 * If a member pushes their code to their file, this registry automatically
 * runs their code. If empty, it seamlessly uses the production defaults!
 */

import { executeMember1Scanner, FoodScanInput, FoodScanOutput } from './member1_scanner.ts';
import { executeMember2Coach, CoachInput, CoachOutput } from './member2_coach.ts';
import { executeMember3Planner, BudgetPlannerInput, BudgetPlannerOutput } from './member3_planner.ts';
import { executeMember4Tracker, TrackerInput, TrackerOutput } from './member4_tracker.ts';

export const backendServices = {
  // Feature 1
  scanFood(input: FoodScanInput): FoodScanOutput {
    const customResult = executeMember1Scanner(input);
    if (customResult) return customResult;

    // Production Default Engine
    const factor = input.quantityGrams / 100;
    return {
      foodName: input.foodName,
      calories: Math.round(130 * factor),
      protein: +(2.5 * factor).toFixed(1),
      carbs: +(28 * factor).toFixed(1),
      fat: +(0.5 * factor).toFixed(1),
      fiber: +(1.5 * factor).toFixed(1),
      healthTip: 'Fresh dietary choice aligned with standard South Asian nutritional balance.'
    };
  },

  // Feature 2
  getCoachRecommendations(input: CoachInput): CoachOutput {
    const customResult = executeMember2Coach(input);
    if (customResult) return customResult;

    // Production Default Engine
    return {
      coachSummary: `Tailored plan focused on ${input.goal} for ${input.dietPreference}.`,
      dailyPlan: {
        morning: '2 glasses lukewarm water, 2 boiled eggs, and whole-wheat ruti with vegetable sabji.',
        lunch: 'Brown rice, fresh Rui or Tilapia fish curry, spinach/palong shak, and 1 cup thick lentils (daal).',
        snack: 'Roasted chickpeas (chhola), seasonal fruits (guava or papaya), and green tea.',
        dinner: 'Light chicken stew with raw papaya and carrots, paired with 2 handmade rutis.'
      },
      wellnessTips: [
        'Maintain daily hydration target of at least 2.5 to 3.0 Liters.',
        'Incorporate leafy greens (shak) at least 4 times per week for iron and fiber.',
        'Allow at least 2 hours between dinner and bedtime for optimal digestion.'
      ]
    };
  },

  // Feature 3
  planBudgetMeals(input: BudgetPlannerInput): BudgetPlannerOutput {
    const customResult = executeMember3Planner(input);
    if (customResult) return customResult;

    // Production Default Engine
    const perPerson = input.budgetBDT;
    let meals = [];

    if (perPerson < 200) {
      meals = [
        { meal: 'Breakfast', name: '2 Handmade Rutis + Dim Bhaji (Egg Omelette) + Cha', costBDT: 40, calories: 340, benefit: 'High protein, budget friendly' },
        { meal: 'Lunch', name: 'Bhaat (Rice) + Thick Mushur Daal + Aloo Bhorta + Lal Shak', costBDT: 65, calories: 580, benefit: 'Iron & complex carbs' },
        { meal: 'Snack', name: 'Muri (Puffed Rice) with roasted Chhola & cucumber', costBDT: 20, calories: 160, benefit: 'Low fat fiber snack' },
        { meal: 'Dinner', name: 'Khichuri with Dim Bhuna & Tomato Salad', costBDT: 60, calories: 520, benefit: 'Comforting balanced dinner' },
      ];
    } else {
      meals = [
        { meal: 'Breakfast', name: 'Whole Wheat Ruti + Vegetable Sabji + 1 Boiled Egg', costBDT: 55, calories: 380, benefit: 'Rich in dietary fiber' },
        { meal: 'Lunch', name: 'Rice + Fresh Rui Fish Curry + Palong Shak + Mushur Daal', costBDT: 110, calories: 640, benefit: 'Fresh local omega-3 & protein' },
        { meal: 'Snack', name: 'Seasonal Fruit (Guava / Banana) + Green Tea', costBDT: 25, calories: 120, benefit: 'Vitamin C antioxidant boost' },
        { meal: 'Dinner', name: '2 Rutis + Chicken Papaya Stew (Murgir Jhol with Pepe)', costBDT: 90, calories: 490, benefit: 'Lean poultry protein' },
      ];
    }

    const totalCost = meals.reduce((acc, m) => acc + m.costBDT, 0) * input.householdCount;
    const totalCals = meals.reduce((acc, m) => acc + m.calories, 0);

    return {
      meals,
      totalCostBDT: totalCost,
      totalCalories: totalCals,
      shoppingList: ['Miniket/Brown Rice (5kg)', 'Mushur Daal (1kg)', 'Eggs (1 Dozen)', 'Palong/Lal Shak (2 bunches)', 'Rui Fish (1kg)', 'Seasonal Fruits'],
      smartSavingsTip: 'Purchasing fish and seasonal greens in local morning bazaars saves up to 25% compared to supermarkets.'
    };
  },

  // Feature 4
  interactTracker(input: TrackerInput): TrackerOutput {
    const customResult = executeMember4Tracker(input);
    if (customResult) return customResult;

    // Production Default Engine
    if (input.action === 'chat_question' && input.chatQuery) {
      const q = input.chatQuery.toLowerCase();
      let response = "That is a great nutritional question. Focus on balanced macros and regular water hydration.";
      if (q.includes('hilsa') || q.includes('ilish')) {
        response = "Ilish (Hilsa) is an exceptional source of Omega-3 fatty acids, excellent for heart health. 100g delivers ~270 kcal and 22g of clean protein.";
      } else if (q.includes('daal') || q.includes('lentil')) {
        response = "Mushur Daal is a cornerstone of Bangladeshi nutrition, offering around 9g of plant protein and 4g of dietary fiber per cup.";
      } else if (q.includes('rice') || q.includes('bhaat')) {
        response = "1 cup of cooked white rice provides ~200 kcal. Pairing it with lentils or fiber-rich shak lowers its glycemic impact.";
      }
      return { status: 'success', chatResponse: response };
    }

    return {
      status: 'success',
      calculatedCalories: input.mealData?.calories || 250,
      calculatedProtein: input.mealData?.protein || 12
    };
  }
};
