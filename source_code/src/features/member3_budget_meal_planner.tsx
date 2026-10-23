/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * =========================================================================
 * FEATURE 3 INTERFACE COMPONENT: Budget-Aware AI Meal Planner
 * ASSIGNED DEVELOPER: Saifa Tahsin
 * =========================================================================
 */

import React, { useState } from 'react';
import { DollarSign, Utensils, CheckCircle2 } from 'lucide-react';
import { Language, translations } from '../translations.ts';
import { backendServices } from '../backend/features/index.ts';

interface Member3BudgetMealPlannerProps {
  language: Language;
}

export const Member3BudgetMealPlanner: React.FC<Member3BudgetMealPlannerProps> = ({ language }) => {
  const t = translations[language];

  const [dailyBudget, setDailyBudget] = useState(250); // BDT ৳
  const [familyMembers, setFamilyMembers] = useState(1);

  const planData = backendServices.planBudgetMeals({
    budgetBDT: dailyBudget,
    householdCount: familyMembers
  });

  return (
    <div className="bg-white dark:bg-[#122014] rounded-3xl border border-[#dcebd2] dark:border-[#223725] shadow-xs overflow-hidden transition-colors">
      {/* Header: Bright light-mint in light mode, deep emerald in dark mode */}
      <div className="bg-gradient-to-r from-[#eef7e9] via-[#e5f4dc] to-[#f4faf0] dark:from-[#1b351e] dark:via-[#152a18] dark:to-[#101f12] p-6 border-b border-[#dcebd2] dark:border-[#223725]">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="bg-[#356d30]/10 dark:bg-white/10 text-[#244b25] dark:text-[#b6f07a] px-3 py-1 rounded-full text-xs font-bold border border-[#356d30]/20 dark:border-white/10">
            Feature 03 · Saifa Tahsin
          </span>
        </div>
        <h2 className="text-2xl font-black text-[#1b3b18] dark:text-white tracking-tight">{t.f3Title}</h2>
        <p className="text-xs sm:text-sm text-[#486b40] dark:text-[#a0c29a] mt-1 max-w-xl font-medium">{t.f3Desc}</p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#f7fbf4] dark:bg-[#0a140c] p-4 rounded-2xl border border-[#dcebd2] dark:border-[#223725]">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-[#356d30] dark:text-[#b6f07a] uppercase tracking-wider">
                  {t.targetDailyBudget}
                </label>
                <span className="text-sm font-bold text-[#1b3b18] dark:text-white bg-white dark:bg-[#122014] px-3 py-0.5 rounded-lg border border-[#dcebd2] dark:border-[#223725]">
                  ৳{dailyBudget} BDT
                </span>
              </div>
              <input
                type="range"
                min="120"
                max="600"
                step="10"
                value={dailyBudget}
                onChange={(e) => setDailyBudget(Number(e.target.value))}
                className="w-full accent-[#356d30] dark:accent-[#78b943] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-[#6b8665] dark:text-[#8ea987] mt-1">
                <span>৳120</span>
                <span>৳250</span>
                <span>৳450+</span>
              </div>
            </div>

            <div className="bg-[#f7fbf4] dark:bg-[#0a140c] p-4 rounded-2xl border border-[#dcebd2] dark:border-[#223725]">
              <label className="block text-xs font-bold text-[#356d30] dark:text-[#b6f07a] uppercase tracking-wider mb-2">
                {t.householdPersons}
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    onClick={() => setFamilyMembers(num)}
                    className={`flex-1 py-1.5 text-xs rounded-xl border font-semibold transition-all cursor-pointer ${
                      familyMembers === num
                        ? 'bg-[#356d30] dark:bg-[#78b943] text-white dark:text-[#0a140c] border-[#356d30] dark:border-[#78b943]'
                        : 'bg-white dark:bg-[#122014] text-[#244b25] dark:text-gray-300 border-[#dcebd2] dark:border-[#223725] hover:bg-[#eef7e9] dark:hover:bg-[#192b1b]'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="p-4 bg-gradient-to-br from-[#eaf5e4] to-[#f4faf0] dark:from-[#0a140c] dark:to-[#122014] rounded-2xl border border-[#c1e88b] dark:border-[#223725] space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#6b8665] dark:text-[#8ea987]">
                  {language === 'bn' ? 'মোট আনুমানিক খরচ:' : language === 'hi' ? 'कुल अनुमानित लागत:' : 'Total Estimated Cost:'}
                </span>
                <span className="text-base font-black text-[#1b3b18] dark:text-[#b6f07a]">৳{planData.totalCostBDT} BDT</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#6b8665] dark:text-[#8ea987]">
                  {language === 'bn' ? 'মোট পুষ্টি মান:' : language === 'hi' ? 'कुल कैलोरी मान:' : 'Total Caloric Value:'}
                </span>
                <span className="font-bold text-[#356d30] dark:text-[#b6f07a]">{planData.totalCalories} kcal</span>
              </div>
            </div>

            <div className="p-3 bg-white dark:bg-[#122014] rounded-xl border border-[#dcebd2] dark:border-[#223725] text-xs text-[#244b25] dark:text-gray-200">
              <strong className="text-[#356d30] dark:text-[#b6f07a] block mb-1">
                {language === 'bn' ? 'সাশ্রয়ী পরামর্শ:' : language === 'hi' ? 'बचत सलाह:' : 'Smart Savings Advice:'}
              </strong>
              {planData.smartSavingsTip}
            </div>
          </div>

          {/* Meals */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-sm font-bold text-[#1b3b18] dark:text-white uppercase tracking-wider">
                {language === 'bn' ? 'দৈনিক খাদ্য সূচি' : language === 'hi' ? 'दैनिक आहार समय सारिणी' : 'Daily Meal Schedule'}
              </h3>
              <span className="text-xs text-[#6b8665] dark:text-[#8ea987]">Dhaka Market Standard</span>
            </div>

            <div className="space-y-2.5">
              {planData.meals.map((meal) => (
                <div 
                  key={meal.meal}
                  className="p-3.5 bg-[#fbfdf9] dark:bg-[#0a140c] hover:bg-[#f4f9f0] dark:hover:bg-[#152417] border border-[#dcebd2] dark:border-[#223725] rounded-2xl transition-all flex items-start justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-bold text-[#356d30] dark:text-[#b6f07a] bg-[#e2f3d6] dark:bg-[#1d3521] px-2 py-0.5 rounded-md">
                        {meal.meal}
                      </span>
                      <span className="text-[11px] text-[#6b8665] dark:text-[#8ea987]">
                        ~{meal.calories} kcal
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-[#1b3b18] dark:text-white">{meal.name}</h4>
                    <p className="text-[11px] text-[#4f8e3c] dark:text-[#9cd470] mt-0.5">{meal.benefit}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-sm font-bold text-[#1b3b18] dark:text-[#b6f07a]">
                      ৳{meal.costBDT * familyMembers}
                    </span>
                    <span className="block text-[10px] text-[#6b8665] dark:text-[#8ea987]">
                      {familyMembers > 1 ? `(৳${meal.costBDT} x ${familyMembers})` : 'approx'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex items-center justify-between text-[11px] text-[#6b8665] dark:text-[#8ea987] border-t border-[#dcebd2] dark:border-[#223725]">
              <span>{t.brandName} Planner Module</span>
              <span className="font-semibold text-[#356d30] dark:text-[#b6f07a]">Saifa Tahsin</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
