/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Flame, 
  Beef, 
  Droplets, 
  HeartPulse, 
  Plus, 
  Check, 
  RotateCcw, 
  Utensils, 
  X,
  Sparkles,
  Info
} from 'lucide-react';
import { UserProfile, DailyIntakeLog } from '../types.ts';
import { Language, translations } from '../translations.ts';

interface KeyMetricsGridProps {
  user: UserProfile;
  dailyIntake: DailyIntakeLog;
  onUpdateDailyIntake: (intake: DailyIntakeLog) => void;
  onUpdateUser?: (user: UserProfile) => void;
  language: Language;
}

export const KeyMetricsGrid: React.FC<KeyMetricsGridProps> = ({ 
  user, 
  dailyIntake, 
  onUpdateDailyIntake, 
  onUpdateUser,
  language 
}) => {
  const [showMealModal, setShowMealModal] = useState(false);
  const [showTargetModal, setShowTargetModal] = useState(false);
  const [customCalories, setCustomCalories] = useState('');
  const [customProtein, setCustomProtein] = useState('');
  const [customMealName, setCustomMealName] = useState('');
  const [targetCalInput, setTargetCalInput] = useState('2000');
  const [targetProtInput, setTargetProtInput] = useState('120');
  const [targetWaterInput, setTargetWaterInput] = useState('3.0');
  const [justLogged, setJustLogged] = useState<string | null>(null);

  const t = translations[language];

  // User targets start at 0
  const calorieTarget = user.dailyCalorieTarget ?? 0;
  const proteinTarget = user.dailyProteinTarget ?? 0;
  const waterTarget = user.dailyWaterTarget ?? 0;

  const calorieCurrent = dailyIntake.calories;
  const proteinCurrent = dailyIntake.protein;
  const waterCurrent = dailyIntake.water;

  const caloriePercent = calorieTarget > 0 ? Math.min(100, Math.round((calorieCurrent / calorieTarget) * 100)) : 0;
  const proteinPercent = proteinTarget > 0 ? Math.min(100, Math.round((proteinCurrent / proteinTarget) * 100)) : 0;
  const waterPercent = waterTarget > 0 ? Math.min(100, Math.round((waterCurrent / waterTarget) * 100)) : 0;

  // Calculate dynamic health score based on adherence, 0 if nothing logged
  const dynamicHealthScore = (calorieCurrent > 0 || proteinCurrent > 0 || waterCurrent > 0)
    ? Math.min(100, Math.max(65, Math.round(65 + (caloriePercent * 0.15) + (proteinPercent * 0.1) + (waterPercent * 0.1))))
    : 0;

  const handleAddWater = (amountLiters: number) => {
    const newWater = +(Math.min(waterTarget + 1, waterCurrent + amountLiters)).toFixed(2);
    onUpdateDailyIntake({
      ...dailyIntake,
      water: newWater,
      healthScore: dynamicHealthScore,
      lastUpdated: new Date().toISOString()
    });
    setJustLogged('water');
    setTimeout(() => setJustLogged(null), 1200);
  };

  const handleAddPresetMeal = (mealName: string, cal: number, prot: number) => {
    const newCal = calorieCurrent + cal;
    const newProt = proteinCurrent + prot;
    onUpdateDailyIntake({
      ...dailyIntake,
      calories: newCal,
      protein: newProt,
      healthScore: dynamicHealthScore,
      lastUpdated: new Date().toISOString()
    });
    setJustLogged(mealName);
    setShowMealModal(false);
  };

  const handleAddCustomMeal = (e: React.FormEvent) => {
    e.preventDefault();
    const cal = Number(customCalories) || 0;
    const prot = Number(customProtein) || 0;
    if (cal <= 0 && prot <= 0) return;

    onUpdateDailyIntake({
      ...dailyIntake,
      calories: calorieCurrent + cal,
      protein: proteinCurrent + prot,
      healthScore: dynamicHealthScore,
      lastUpdated: new Date().toISOString()
    });
    setCustomCalories('');
    setCustomProtein('');
    setCustomMealName('');
    setShowMealModal(false);
  };

  const handleApplyPresetTarget = (cal: number, prot: number, water: number) => {
    if (onUpdateUser) {
      onUpdateUser({
        ...user,
        dailyCalorieTarget: cal,
        dailyProteinTarget: prot,
        dailyWaterTarget: water,
      });
    }
    onUpdateDailyIntake({
      ...dailyIntake,
      targetCalories: cal,
      targetProtein: prot,
      targetWater: water,
    });
    setShowTargetModal(false);
  };

  const handleResetToZero = () => {
    if (window.confirm(t.resetZeroConfirm)) {
      onUpdateDailyIntake({
        calories: 0,
        protein: 0,
        water: 0,
        targetCalories: calorieTarget,
        targetProtein: proteinTarget,
        targetWater: waterTarget,
        healthScore: 0,
        lastUpdated: new Date().toISOString()
      });
    }
  };

  // Popular Bangladeshi preset meals for quick selection
  const presetMeals = [
    { name: language === 'bn' ? 'ডিম পরোটা ও চা' : language === 'hi' ? 'अंडा पराठा व चाय' : 'Egg Paratha & Tea', calories: 340, protein: 12, time: 'Breakfast' },
    { name: language === 'bn' ? 'ভাত, রুই মাছের ঝোল ও ডাল' : language === 'hi' ? 'चावल, रोहू मछली व दाल' : 'Rice, Rui Fish & Daal', calories: 480, protein: 28, time: 'Lunch' },
    { name: language === 'bn' ? 'চিকেন খিচুড়ি ও সালাদ' : language === 'hi' ? 'चिकन खिचड़ी व सलाद' : 'Chicken Khichuri & Salad', calories: 520, protein: 34, time: 'Lunch / Dinner' },
    { name: language === 'bn' ? 'লাল চালের ভাত ও সবজি ডাল' : language === 'hi' ? 'लाल चावल व सब्जी दाल' : 'Brown Rice & Mixed Veg Daal', calories: 390, protein: 16, time: 'Dinner' },
    { name: language === 'bn' ? 'প্রোটিন শেক ও বাদাম' : language === 'hi' ? 'प्रोटीन शेक व नट्स' : 'Protein Shake & Almonds', calories: 240, protein: 26, time: 'Snack' },
    { name: language === 'bn' ? 'সিদ্ধ ডিম (২টি) ও কলা' : language === 'hi' ? 'उबले अंडे (२) व केला' : 'Boiled Eggs (2) & Banana', calories: 230, protein: 14, time: 'Breakfast' },
  ];

  return (
    <div className="mb-6">
      {/* Top Banner explaining 0-start & Quick Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 bg-white dark:bg-[#152417] px-4 py-3 rounded-2xl border border-[#dcebd2] dark:border-[#223725] shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#eaf4e5] dark:bg-[#1d3521] text-[#356d30] dark:text-[#b6f07a] flex items-center justify-center">
            <Utensils className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-[#1b3b18] dark:text-white">
                {t.setupGoalsTitle}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#f4faef] dark:bg-[#0d170e] text-[#356d30] dark:text-[#b6f07a] border border-[#dcebd2] dark:border-[#223725]">
                {t.zeroStartBadge}
              </span>
            </div>
            <p className="text-[11px] text-[#6b8665] dark:text-[#8ea987]">
              {calorieTarget === 0 
                ? (language === 'bn' ? 'টার্গেটসমূহ বর্তমানে ০ তে রয়েছে। পছন্দমতো সেট করুন বা খাবার লগ করুন।' : 'Targets are currently 0. Set your target goals or start logging meals.')
                : t.setupGoalsSubtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Set Targets Modal Button */}
          <button
            onClick={() => setShowTargetModal(true)}
            className="px-3 py-1.5 bg-[#eef7e9] dark:bg-[#1a301d] hover:bg-[#e1f2da] text-[#356d30] dark:text-[#b6f07a] text-xs font-bold rounded-xl border border-[#cfe6c3] dark:border-[#28482b] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{calorieTarget === 0 ? (language === 'bn' ? '🎯 টার্গেট নির্বাচন করুন' : '🎯 Set Targets') : (language === 'bn' ? '🎯 টার্গেট পরিবর্তন' : '🎯 Edit Targets')}</span>
          </button>

          {/* Quick Log Meal Modal Button */}
          <button
            onClick={() => setShowMealModal(true)}
            className="px-3 py-1.5 bg-[#356d30] hover:bg-[#285524] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.quickLogMeal}</span>
          </button>

          {/* Reset to 0 button */}
          <button
            onClick={handleResetToZero}
            className="px-3 py-1.5 bg-[#f4faef] dark:bg-[#0d170e] hover:bg-[#e6f3de] text-[#4f8b38] dark:text-[#8ea987] text-xs font-semibold rounded-xl border border-[#dcebd2] dark:border-[#223725] transition-all flex items-center gap-1 cursor-pointer"
            title="Reset daily intake to 0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.resetToZero}</span>
          </button>
        </div>
      </div>

      {/* Grid of 4 Key Metrics */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Daily Calorie Target */}
        <div className="bg-white dark:bg-[#152417] p-5 rounded-2xl border border-[#dcebd2] dark:border-[#223725] shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#6b8665] dark:text-[#8ea987]">{t.calTarget}</span>
            <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#1b3b18] dark:text-white tracking-tight">
            {calorieCurrent.toLocaleString()} / {calorieTarget.toLocaleString()} <span className="text-xs font-semibold text-[#6b8665]">kcal</span>
          </div>
          <div className="w-full h-2 bg-[#eef7e9] dark:bg-gray-800 rounded-full overflow-hidden my-2.5">
            <div 
              className="h-full bg-gradient-to-r from-orange-400 to-[#4f8e38] rounded-full transition-all duration-500" 
              style={{ width: `${caloriePercent}%` }} 
            />
          </div>
          <div className="flex justify-between items-center text-[11px] font-semibold">
            <span className="text-[#4f8e38] dark:text-[#b6f07a]">{caloriePercent}% {t.calAchieved}</span>
            <span className="text-[#6b8665] dark:text-[#8ea987]">
              {Math.max(0, calorieTarget - calorieCurrent)} {t.calLeft}
            </span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-[#f4faef] dark:border-[#1f3521] flex justify-between items-center">
            <button
              onClick={() => setShowMealModal(true)}
              className="text-[11px] font-bold text-[#356d30] dark:text-[#b6f07a] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>{language === 'bn' ? 'খাবার যোগ করুন' : language === 'hi' ? 'भोजन जोड़ें' : 'Add Food'}</span>
            </button>
            <span className="text-[10px] text-[#6b8665]">
              {calorieCurrent === 0 ? 'Starts at 0' : `${calorieCurrent} logged`}
            </span>
          </div>
        </div>

        {/* 2. Protein Intake */}
        <div className="bg-white dark:bg-[#152417] p-5 rounded-2xl border border-[#dcebd2] dark:border-[#223725] shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#6b8665] dark:text-[#8ea987]">{t.proteinTitle}</span>
            <div className="w-8 h-8 rounded-lg bg-[#eaf5e4] dark:bg-[#1d3521] text-[#356d30] dark:text-[#b6f07a] flex items-center justify-center">
              <Beef className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#1b3b18] dark:text-white tracking-tight">
            {proteinCurrent}g / {proteinTarget}g
          </div>
          <div className="w-full h-2 bg-[#eef7e9] dark:bg-gray-800 rounded-full overflow-hidden my-2.5">
            <div 
              className="h-full bg-[#4f8e38] rounded-full transition-all duration-500" 
              style={{ width: `${proteinPercent}%` }} 
            />
          </div>
          <div className="flex justify-between items-center text-[11px] font-semibold">
            <span className="text-[#4f8e38] dark:text-[#b6f07a]">{Math.max(0, proteinTarget - proteinCurrent)}g {t.proteinLeft}</span>
            <span className="text-[#6b8665] dark:text-[#8ea987]">{proteinPercent}%</span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-[#f4faef] dark:border-[#1f3521] flex justify-between items-center">
            <button
              onClick={() => handleAddPresetMeal('Protein Boost', 160, 20)}
              className="text-[11px] font-bold text-[#356d30] dark:text-[#b6f07a] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>+20g Protein</span>
            </button>
            <span className="text-[10px] text-[#6b8665]">
              {proteinCurrent === 0 ? 'Starts at 0' : `${proteinCurrent}g logged`}
            </span>
          </div>
        </div>

        {/* 3. Hydration Level */}
        <div className="bg-white dark:bg-[#152417] p-5 rounded-2xl border border-[#dcebd2] dark:border-[#223725] shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#6b8665] dark:text-[#8ea987]">{t.hydrationTitle}</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-black text-[#1b3b18] dark:text-white tracking-tight">
              {waterCurrent}L / {waterTarget}L
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => handleAddWater(0.25)}
                className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 dark:bg-blue-950 hover:bg-blue-100 text-blue-700 dark:text-blue-300 rounded-md border border-blue-200 dark:border-blue-800 transition-all cursor-pointer flex items-center gap-1"
              >
                {justLogged === 'water' ? <Check className="w-3 h-3 text-green-600" /> : <Plus className="w-3 h-3" />}
                +250ml
              </button>
              <button
                onClick={() => handleAddWater(0.5)}
                className="text-[10px] font-bold px-1.5 py-0.5 bg-blue-50 dark:bg-blue-950 hover:bg-blue-100 text-blue-700 dark:text-blue-300 rounded-md border border-blue-200 dark:border-blue-800 transition-all cursor-pointer"
              >
                +500ml
              </button>
            </div>
          </div>
          <div className="w-full h-2 bg-[#eef7e9] dark:bg-gray-800 rounded-full overflow-hidden my-2.5">
            <div 
              className="h-full bg-blue-500 rounded-full transition-all duration-500" 
              style={{ width: `${waterPercent}%` }} 
            />
          </div>
          <div className="flex justify-between items-center text-[11px] font-semibold">
            <span className="text-[#4f8e38] dark:text-[#b6f07a]">
              {Math.max(0, +(waterTarget - waterCurrent).toFixed(2))}L {t.hydrationLeft}
            </span>
            <span className="text-[#6b8665] dark:text-[#8ea987]">{waterPercent}%</span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-[#f4faef] dark:border-[#1f3521] flex justify-between items-center text-[10px] text-[#6b8665]">
            <span>{waterCurrent === 0 ? 'Starts at 0L' : `${waterCurrent}L logged`}</span>
            <span>Target: {waterTarget}L</span>
          </div>
        </div>

        {/* 4. Health Score */}
        <div className="bg-white dark:bg-[#152417] p-5 rounded-2xl border border-[#dcebd2] dark:border-[#223725] shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#6b8665] dark:text-[#8ea987]">{t.healthScoreTitle}</span>
            <div className="w-8 h-8 rounded-lg bg-[#eaf4e5] dark:bg-[#1d3521] text-[#2c592b] dark:text-[#b6f07a] flex items-center justify-center">
              <HeartPulse className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#1b3b18] dark:text-white tracking-tight">
            {dynamicHealthScore} / 100
          </div>
          <div className="w-full h-2 bg-[#eef7e9] dark:bg-gray-800 rounded-full overflow-hidden my-2.5">
            <div 
              className="h-full bg-gradient-to-r from-[#4f8e38] to-[#80bf43] rounded-full transition-all duration-500" 
              style={{ width: `${dynamicHealthScore}%` }} 
            />
          </div>
          <div className="flex justify-between items-center text-[11px] text-[#4f8e38] dark:text-[#b6f07a] font-semibold">
            <span>{t.healthScoreSub}</span>
            <span className="bg-[#e8f7df] dark:bg-[#1d3521] text-[#2c592b] dark:text-[#b6f07a] px-1.5 py-0.2 rounded font-bold text-[10px]">
              {dynamicHealthScore >= 85 ? t.optimalBadge : 'Good'}
            </span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-[#f4faef] dark:border-[#1f3521] flex justify-between items-center text-[10px] text-[#6b8665]">
            <span>Auto-calculated score</span>
            <span className="text-emerald-600 font-bold">Live Synced</span>
          </div>
        </div>
      </section>

      {/* Quick Meal Logging / Preset Selection Modal */}
      {showMealModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white dark:bg-[#152417] rounded-3xl max-w-lg w-full border border-[#dcebd2] dark:border-[#223725] shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#356d30] to-[#4f8b38] px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Utensils className="w-5 h-5 text-[#c1e88b]" />
                <h3 className="text-sm font-bold text-white">
                  {t.selectPresetMeal}
                </h3>
              </div>
              <button
                onClick={() => setShowMealModal(false)}
                className="p-1 rounded-full hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <p className="text-xs text-[#6b8665] dark:text-[#8ea987]">
                {language === 'bn' 
                  ? 'নিচের যেকোনো সাধারণ খাবার নির্বাচন করুন অথবা আপনার কাস্টম ক্যালোরি ও প্রোটিন লিখে যোগ করুন:' 
                  : language === 'hi' 
                  ? 'नीचे से कोई भी भोजन चुनें या अपनी कस्टम प्रविष्टि जोड़ें:' 
                  : 'Select any traditional Bangladeshi staple meal or enter custom grams/macros below:'}
              </p>

              {/* Preset Meals List */}
              <div className="space-y-2">
                {presetMeals.map((meal, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl border border-[#dcebd2] dark:border-[#223725] bg-[#fbfdf9] dark:bg-[#0d170e] flex items-center justify-between hover:border-[#356d30] transition-all"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#1b3b18] dark:text-white">{meal.name}</span>
                        <span className="text-[10px] font-semibold px-2 py-0.2 bg-[#eaf4e5] dark:bg-[#1d3521] text-[#356d30] dark:text-[#b6f07a] rounded-full">
                          {meal.time}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#6b8665] dark:text-[#8ea987] mt-0.5">
                        +{meal.calories} kcal · +{meal.protein}g protein
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddPresetMeal(meal.name, meal.calories, meal.protein)}
                      className="px-3 py-1.5 bg-[#356d30] hover:bg-[#285524] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                    >
                      <Plus className="w-3 h-3" />
                      <span>{language === 'bn' ? 'যোগ করুন' : language === 'hi' ? 'जोड़ें' : 'Add'}</span>
                    </button>
                  </div>
                ))}
              </div>

              {/* Custom Input Form */}
              <div className="pt-3 border-t border-[#dcebd2] dark:border-[#223725]">
                <h4 className="text-xs font-bold text-[#356d30] dark:text-[#b6f07a] mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'কাস্টম এন্ট্রি (Custom Intake)' : language === 'hi' ? 'कस्टम प्रविष्टि' : 'Custom Meal Entry'}</span>
                </h4>

                <form onSubmit={handleAddCustomMeal} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-[#6b8665] dark:text-[#8ea987] mb-1">
                        Calories (kcal)
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 450"
                        value={customCalories}
                        onChange={(e) => setCustomCalories(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-[#dcebd2] dark:border-[#223725] bg-[#fbfdf9] dark:bg-[#0d170e] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4f8b38]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#6b8665] dark:text-[#8ea987] mb-1">
                        Protein (grams)
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 24"
                        value={customProtein}
                        onChange={(e) => setCustomProtein(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-[#dcebd2] dark:border-[#223725] bg-[#fbfdf9] dark:bg-[#0d170e] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4f8b38]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-[#356d30] hover:bg-[#285524] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'কাস্টম খাবার লগ করুন' : language === 'hi' ? 'कस्टम भोजन दर्ज करें' : 'Log Custom Food Entry'}</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Target Setting Modal */}
      {showTargetModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#152417] border border-[#dcebd2] dark:border-[#223725] rounded-3xl max-w-md w-full p-6 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-[#dcebd2] dark:border-[#223725] mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#356d30] dark:text-[#b6f07a]" />
                <h3 className="font-extrabold text-sm text-[#1b3b18] dark:text-white">
                  {language === 'bn' ? '🎯 দৈনিক পুষ্টি লক্ষ্য নির্ধারণ' : '🎯 Select Daily Target Goals'}
                </h3>
              </div>
              <button 
                onClick={() => setShowTargetModal(false)}
                className="text-gray-400 hover:text-gray-600 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#6b8665] dark:text-[#8ea987] mb-4">
              {language === 'bn'
                ? 'প্রথম লগইনে সব লক্ষ্য ০ রাখা হয়েছে। পছন্দ অনুযায়ী যেকোনো লক্ষ্য নির্বাচন করুন, এরপর ড্যাশবোর্ড ও রিপোর্ট স্বয়ংক্রিয়ভাবে আপডেট হবে:'
                : 'All targets start at 0 initially. Select a goal plan or enter your custom targets below:'}
            </p>

            {/* Presets */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
              <button
                type="button"
                onClick={() => handleApplyPresetTarget(2000, 120, 3.0)}
                className="p-3 text-left rounded-xl border border-[#cfe6c3] dark:border-[#28482b] bg-[#f7fbf4] dark:bg-[#1b2f1d] hover:border-[#356d30] cursor-pointer"
              >
                <span className="font-bold text-xs text-[#356d30] dark:text-[#b6f07a] block">সুষম পুষ্টি</span>
                <span className="text-[10px] text-[#6b8665] dark:text-[#8ea987] block">2000 kcal · 120g</span>
              </button>
              <button
                type="button"
                onClick={() => handleApplyPresetTarget(1600, 130, 3.2)}
                className="p-3 text-left rounded-xl border border-[#cfe6c3] dark:border-[#28482b] bg-[#f7fbf4] dark:bg-[#1b2f1d] hover:border-[#356d30] cursor-pointer"
              >
                <span className="font-bold text-xs text-orange-600 dark:text-orange-400 block">ওজন হ্রাস</span>
                <span className="text-[10px] text-[#6b8665] dark:text-[#8ea987] block">1600 kcal · 130g</span>
              </button>
              <button
                type="button"
                onClick={() => handleApplyPresetTarget(2500, 160, 3.8)}
                className="p-3 text-left rounded-xl border border-[#cfe6c3] dark:border-[#28482b] bg-[#f7fbf4] dark:bg-[#1b2f1d] hover:border-[#356d30] cursor-pointer"
              >
                <span className="font-bold text-xs text-blue-600 dark:text-blue-400 block">মাসল গেইন</span>
                <span className="text-[10px] text-[#6b8665] dark:text-[#8ea987] block">2500 kcal · 160g</span>
              </button>
            </div>

            {/* Custom Input */}
            <form onSubmit={(e) => {
              e.preventDefault();
              const cal = Number(targetCalInput) || 2000;
              const prot = Number(targetProtInput) || 120;
              const water = Number(targetWaterInput) || 3.0;
              handleApplyPresetTarget(cal, prot, water);
            }} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[#1b3b18] dark:text-white block mb-1">
                  ক্যালোরি লক্ষ্য (kcal):
                </label>
                <input
                  type="number"
                  value={targetCalInput}
                  onChange={(e) => setTargetCalInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#cfe6c3] dark:border-[#28482b] bg-[#fbfdf9] dark:bg-[#0d170e] text-[#1b3b18] dark:text-white"
                  placeholder="e.g. 2000"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-[#1b3b18] dark:text-white block mb-1">
                    প্রোটিন (গ্রাম):
                  </label>
                  <input
                    type="number"
                    value={targetProtInput}
                    onChange={(e) => setTargetProtInput(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#cfe6c3] dark:border-[#28482b] bg-[#fbfdf9] dark:bg-[#0d170e] text-[#1b3b18] dark:text-white"
                    placeholder="e.g. 120"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#1b3b18] dark:text-white block mb-1">
                    পানি (লিটার):
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={targetWaterInput}
                    onChange={(e) => setTargetWaterInput(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#cfe6c3] dark:border-[#28482b] bg-[#fbfdf9] dark:bg-[#0d170e] text-[#1b3b18] dark:text-white"
                    placeholder="e.g. 3.0"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowTargetModal(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 rounded-xl cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#356d30] hover:bg-[#285524] rounded-xl cursor-pointer"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
