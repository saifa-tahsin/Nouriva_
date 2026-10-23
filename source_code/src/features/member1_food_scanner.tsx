/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * =========================================================================
 * FEATURE 1 INTERFACE COMPONENT: AI Food & Health Scanner
 * ASSIGNED DEVELOPER: Jannatul Ferdous Jenny
 * =========================================================================
 */

import React, { useState } from 'react';
import { Camera, Search, Sparkles, CheckCircle2 } from 'lucide-react';
import { Language, translations } from '../translations.ts';
import { backendServices } from '../backend/features/index.ts';

interface Member1FoodScannerProps {
  language: Language;
}

const POPULAR_FOODS = [
  { name: 'Brown Rice (Bhaat)', serving: '1 cup (150g)', calories: 165, protein: 3.8, carbs: 35, fat: 1.2 },
  { name: 'Rui Fish Curry (Machher Jhol)', serving: '1 medium piece (120g)', calories: 180, protein: 22, carbs: 2, fat: 9 },
  { name: 'Lentil Soup (Mushur Daal)', serving: '1 bowl (150ml)', calories: 120, protein: 8.5, carbs: 18, fat: 1.5 },
  { name: 'Spinach Shak (Palong Shak)', serving: '1 small bowl (100g)', calories: 65, protein: 2.8, carbs: 4.5, fat: 3.2 },
  { name: 'Boiled Egg (Dim Siddho)', serving: '1 large (50g)', calories: 78, protein: 6.3, carbs: 0.6, fat: 5.3 },
  { name: 'Chicken Breast Curry', serving: '1 cup (140g)', calories: 210, protein: 29, carbs: 3, fat: 8.5 },
];

export const Member1FoodScanner: React.FC<Member1FoodScannerProps> = ({ language }) => {
  const t = translations[language];

  const [searchTerm, setSearchTerm] = useState('');
  const [portionGrams, setPortionGrams] = useState(150);
  const [selectedFood, setSelectedFood] = useState(POPULAR_FOODS[0]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState<string | null>(null);

  const filteredFoods = POPULAR_FOODS.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const scanResult = backendServices.scanFood({
    foodName: selectedFood.name,
    quantityGrams: portionGrams
  });

  const handleSimulateScan = () => {
    setIsScanning(true);
    setScanMessage(null);
    setTimeout(() => {
      setIsScanning(false);
      setScanMessage(
        language === 'bn' 
          ? 'খাবার শনাক্ত হয়েছে: ঐতিহ্যবাহী রুই মাছের ঝোল! উচ্চ প্রোটিন ও হার্টের জন্য উপকারী ওমেগা-৩ সমৃদ্ধ।'
          : language === 'hi'
          ? 'भोजन की पहचान हुई: पारंपरिक रुई मछली की करी! उच्च प्रोटीन और हृदय के लिए लाभकारी ओ메गा-३।'
          : 'Food recognized: Traditional Rui Fish Curry! High protein and heart-healthy Omega-3.'
      );
    }, 1000);
  };

  return (
    <div className="bg-white dark:bg-[#122014] rounded-3xl border border-[#dcebd2] dark:border-[#223725] shadow-xs overflow-hidden transition-colors">
      {/* Header: Bright light-mint in light mode, deep emerald in dark mode */}
      <div className="bg-gradient-to-r from-[#eef7e9] via-[#e5f4dc] to-[#f4faf0] dark:from-[#1b351e] dark:via-[#152a18] dark:to-[#101f12] p-6 border-b border-[#dcebd2] dark:border-[#223725]">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="bg-[#356d30]/10 dark:bg-white/10 text-[#244b25] dark:text-[#b6f07a] px-3 py-1 rounded-full text-xs font-bold border border-[#356d30]/20 dark:border-white/10">
            Feature 01 · Jannatul Ferdous Jenny
          </span>
        </div>
        <h2 className="text-2xl font-black text-[#1b3b18] dark:text-white tracking-tight">{t.f1Title}</h2>
        <p className="text-xs sm:text-sm text-[#486b40] dark:text-[#a0c29a] mt-1 max-w-xl font-medium">{t.f1Desc}</p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls */}
          <div className="lg:col-span-7 space-y-5">
            <div className="bg-[#f7fbf4] dark:bg-[#0a140c] p-4 rounded-2xl border border-[#dcebd2] dark:border-[#223725]">
              <label className="block text-xs font-bold text-[#356d30] dark:text-[#b6f07a] uppercase tracking-wider mb-2">
                1. {language === 'bn' ? 'খাবার নির্বাচন করুন' : language === 'hi' ? 'भोजन चुनें' : 'Select Food Item'}
              </label>
              <div className="relative mb-3">
                <Search className="w-4 h-4 text-[#6b8665] dark:text-[#8ea987] absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder={t.searchFoodPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-[#122014] text-[#244b25] dark:text-white border border-[#dcebd2] dark:border-[#223725] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4f8b38]"
                />
              </div>

              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                {filteredFoods.map((food) => (
                  <button
                    key={food.name}
                    onClick={() => setSelectedFood(food)}
                    className={`text-xs px-3 py-1.5 rounded-xl border transition-all text-left flex items-center gap-1.5 cursor-pointer ${
                      selectedFood.name === food.name
                        ? 'bg-[#356d30] text-white border-[#356d30] font-semibold shadow-xs'
                        : 'bg-white dark:bg-[#122014] text-[#244b25] dark:text-gray-200 border-[#dcebd2] dark:border-[#223725] hover:bg-[#edf7e8] dark:hover:bg-[#1d3521]'
                    }`}
                  >
                    <span>{food.name}</span>
                    <span className="text-[10px] opacity-75">({food.calories} kcal)</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Portion Slider */}
            <div className="bg-[#f7fbf4] dark:bg-[#0a140c] p-4 rounded-2xl border border-[#dcebd2] dark:border-[#223725]">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-[#356d30] dark:text-[#b6f07a] uppercase tracking-wider">
                  2. {t.portionGrams}
                </label>
                <span className="text-sm font-bold text-[#1b3b18] dark:text-white bg-white dark:bg-[#122014] px-3 py-0.5 rounded-lg border border-[#dcebd2] dark:border-[#223725]">
                  {portionGrams}g
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="500"
                step="10"
                value={portionGrams}
                onChange={(e) => setPortionGrams(Number(e.target.value))}
                className="w-full accent-[#4f8b38] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-[#6b8665] dark:text-[#8ea987] mt-1">
                <span>50g</span>
                <span>150g (Standard)</span>
                <span>300g</span>
                <span>500g</span>
              </div>
            </div>

            {/* Scan Simulation */}
            <div className="p-4 rounded-2xl border border-dashed border-[#80bf43] dark:border-[#223725] bg-[#fbfdf9] dark:bg-[#0a140c] flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#e5f4d9] dark:bg-[#1d3521] text-[#356d30] dark:text-[#b6f07a] flex items-center justify-center shrink-0">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#244b25] dark:text-white">
                    {language === 'bn' ? 'খাবারের ছবি বা লেবেল স্ক্যান করুন' : language === 'hi' ? 'भोजन की फोटो या लेबल स्कैन करें' : 'Scan Meal Photo or Food Label'}
                  </h4>
                  <p className="text-[11px] text-[#6b8665] dark:text-[#8ea987]">
                    {language === 'bn' ? 'স্বয়ংক্রিয় এআই পরিমাপ' : language === 'hi' ? 'स्वचालित एआई मात्रा अनुमान' : 'Automated AI nutrition analysis'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleSimulateScan}
                disabled={isScanning}
                className="px-4 py-2 bg-[#4f8b38] hover:bg-[#356d30] text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition-all shadow-xs shrink-0 cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isScanning ? t.scanningText : t.scanPhotoBtn}</span>
              </button>
            </div>

            {scanMessage && (
              <div className="p-3 bg-[#e8f7df] dark:bg-[#1d3521] border border-[#a6d86b] dark:border-[#356d30] rounded-xl text-xs text-[#244b25] dark:text-[#d4f2c5] flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-[#4f8b38] dark:text-[#b6f07a] shrink-0" />
                <span>{scanMessage}</span>
              </div>
            )}
          </div>

          {/* Nutrition Output */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#f7fbf4] to-[#eef7e9] dark:from-[#0a140c] dark:to-[#122014] p-5 rounded-2xl border border-[#dcebd2] dark:border-[#223725] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#dcebd2] dark:border-[#223725]">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#4f8e38] dark:text-[#b6f07a]">{t.nutritionBreakdown}</span>
                  <h3 className="text-lg font-bold text-[#1b3b18] dark:text-white">{selectedFood.name}</h3>
                </div>
                <span className="text-xs bg-[#e2f3d6] dark:bg-[#1f3822] text-[#2c592b] dark:text-[#b6f07a] font-semibold px-2.5 py-1 rounded-full border border-[#c1e88b] dark:border-[#2a482c]">
                  {portionGrams}g
                </span>
              </div>

              <div className="my-4 p-4 rounded-2xl bg-white dark:bg-[#122014] border border-[#dcebd2] dark:border-[#223725] text-center shadow-xs">
                <span className="text-xs text-[#6b8665] dark:text-[#8ea987]">{t.estimatedEnergy}</span>
                <div className="text-3xl font-black text-[#356d30] dark:text-[#b6f07a] tracking-tight">
                  {scanResult.calories} <span className="text-sm font-semibold text-[#6b8665] dark:text-[#8ea987]">kcal</span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1 font-medium text-[#244b25] dark:text-gray-200">
                    <span>{language === 'bn' ? 'প্রোটিন' : language === 'hi' ? 'प्रोटीन' : 'Protein'}</span>
                    <span className="font-bold text-[#356d30] dark:text-[#b6f07a]">{scanResult.protein}g</span>
                  </div>
                  <div className="w-full h-2 bg-[#dcebd2] dark:bg-[#1f3521] rounded-full overflow-hidden">
                    <div className="h-full bg-[#4f8b38] dark:bg-[#78b943] rounded-full" style={{ width: `${Math.min(100, (scanResult.protein / 50) * 100)}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1 font-medium text-[#244b25] dark:text-gray-200">
                    <span>{language === 'bn' ? 'শর্করা (কার্ব)' : language === 'hi' ? 'कार्बोहाइड्रेट' : 'Carbohydrates'}</span>
                    <span className="font-bold text-[#6ba83f] dark:text-[#8cd152]">{scanResult.carbs}g</span>
                  </div>
                  <div className="w-full h-2 bg-[#dcebd2] dark:bg-[#1f3521] rounded-full overflow-hidden">
                    <div className="h-full bg-[#80bf43] dark:bg-[#a3db5b] rounded-full" style={{ width: `${Math.min(100, (scanResult.carbs / 100) * 100)}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1 font-medium text-[#244b25] dark:text-gray-200">
                    <span>{language === 'bn' ? 'চর্বি (ফ্যাট)' : language === 'hi' ? 'वसा (फैट)' : 'Healthy Fats'}</span>
                    <span className="font-bold text-[#86a836] dark:text-[#b6e665]">{scanResult.fat}g</span>
                  </div>
                  <div className="w-full h-2 bg-[#dcebd2] dark:bg-[#1f3521] rounded-full overflow-hidden">
                    <div className="h-full bg-[#9bc949] dark:bg-[#c2f07d] rounded-full" style={{ width: `${Math.min(100, (scanResult.fat / 30) * 100)}%` }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#dcebd2] dark:border-[#223725] text-[11px] text-[#6b8665] dark:text-[#8ea987] flex items-center justify-between">
              <span>{t.brandName} Scanner Module</span>
              <span className="font-semibold text-[#356d30] dark:text-[#b6f07a]">Jannatul Ferdous Jenny</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
