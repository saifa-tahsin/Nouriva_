/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * =========================================================================
 * FEATURE 2 INTERFACE COMPONENT: AI Personalized Nutrition Coach
 * ASSIGNED DEVELOPER: Asma Bintay Arif
 * =========================================================================
 */

import React, { useState } from 'react';
import { Target, Activity, Heart, Sparkles, CheckCircle2 } from 'lucide-react';
import { Language, translations } from '../translations.ts';
import { backendServices } from '../backend/features/index.ts';

interface Member2NutritionCoachProps {
  language: Language;
}

export const Member2NutritionCoach: React.FC<Member2NutritionCoachProps> = ({ language }) => {
  const t = translations[language];

  const [goal, setGoal] = useState<'Weight Loss' | 'Muscle Tone' | 'Metabolic Balance' | 'Healthy Heart'>('Metabolic Balance');
  const [activityLevel, setActivityLevel] = useState<'Sedentary' | 'Moderate (3-4 days)' | 'Very Active'>('Moderate (3-4 days)');
  const [dietPreference, setDietPreference] = useState('Bangladeshi Traditional');
  const [coachResponse, setCoachResponse] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateAdvice = () => {
    setIsGenerating(true);
    setCoachResponse(null);

    // Call backend service
    const output = backendServices.getCoachRecommendations({
      goal,
      activityLevel,
      dietPreference
    });

    setTimeout(() => {
      setIsGenerating(false);
      if (language === 'bn') {
        setCoachResponse(
          `আপনার নির্বাচিত স্বাস্থ্য লক্ষ্য (${goal}) অনুযায়ী প্রস্তাবিত নুরিভা খাদ্য পরিকল্পনা:\n\n` +
          `• সকালের নাস্তা: ২ গ্লাস কুসুম গরম পানি, ১-২টি সেদ্ধ ডিম, হাতে তৈরি লাল আটার রুটি ও সবজি ভাজি।\n` +
          `• দুপুরের খাবার: ১.৫ কাপ লাল চালের ভাত, ১ বাটি ঘন মসুর ডাল, পালং বা লাল শাক এবং তাজা রুই মাছের পাতলা ঝোল।\n` +
          `• বিকেলের নাস্তা: এক মুঠো ভাজা ছোলা, শসা ও সবুজ চা (গ্রিন টি)।\n` +
          `• রাতের খাবার: পেঁপে ও গাজর দিয়ে হালকা দেশি মুরগির ঝোল এবং ১-২টি রুটি।\n\n` +
          `পরামর্শ: সারাদিনে নিয়মিত পর্যাপ্ত পানি পান নিশ্চিত করুন।`
        );
      } else if (language === 'hi') {
        setCoachResponse(
          `आपके लक्ष्य (${goal}) और जीवनशैली के अनुसार आहार सलाह:\n\n` +
          `• सुबह: २ गिलास गुनगुना पानी, २ उबले अंडे और १-२ मल्टीग्रेन रोटी के साथ हरी सब्जी।\n` +
          `• दोपहर: १.५ कप ब्राउन राइस, १ कटोरी गाढ़ी दाल, पालक की सब्जी और मछली।\n` +
          `• शाम: भुने हुए चने, ताजे फल (पपीता/अमरूद) और ग्रीन टी।\n` +
          `• रात: उबली सब्जियों और चिकन सूप के साथ १ हल्की रोटी।\n\n` +
          `सलाह: संतुलित पोषण और दैनिक जल सेवन बनाए रखें।`
        );
      } else {
        setCoachResponse(
          `Personalized Plan for ${goal} (${dietPreference}):\n\n` +
          `• Morning: ${output.dailyPlan.morning}\n` +
          `• Lunch: ${output.dailyPlan.lunch}\n` +
          `• Snack: ${output.dailyPlan.snack}\n` +
          `• Dinner: ${output.dailyPlan.dinner}\n\n` +
          `Tips:\n${output.wellnessTips.map(tip => `• ${tip}`).join('\n')}`
        );
      }
    }, 800);
  };

  return (
    <div className="bg-white dark:bg-[#122014] rounded-3xl border border-[#dcebd2] dark:border-[#223725] shadow-xs overflow-hidden transition-colors">
      {/* Header: Bright light-mint in light mode, deep emerald in dark mode */}
      <div className="bg-gradient-to-r from-[#eef7e9] via-[#e5f4dc] to-[#f4faf0] dark:from-[#1b351e] dark:via-[#152a18] dark:to-[#101f12] p-6 border-b border-[#dcebd2] dark:border-[#223725]">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="bg-[#356d30]/10 dark:bg-white/10 text-[#244b25] dark:text-[#b6f07a] px-3 py-1 rounded-full text-xs font-bold border border-[#356d30]/20 dark:border-white/10">
            Feature 02 · Asma Bintay Arif
          </span>
        </div>
        <h2 className="text-2xl font-black text-[#1b3b18] dark:text-white tracking-tight">{t.f2Title}</h2>
        <p className="text-xs sm:text-sm text-[#486b40] dark:text-[#a0c29a] mt-1 max-w-xl font-medium">{t.f2Desc}</p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form */}
          <div className="lg:col-span-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#356d30] dark:text-[#b6f07a] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-[#4f8b38] dark:text-[#b6f07a]" /> {t.primaryGoalLabel}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['Weight Loss', 'Muscle Tone', 'Metabolic Balance', 'Healthy Heart'] as const).map((item) => (
                  <button
                    key={item}
                    onClick={() => setGoal(item)}
                    className={`text-xs p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      goal === item
                        ? 'border-[#356d30] dark:border-[#b6f07a] bg-[#eef7e9] dark:bg-[#1a341e] font-bold text-[#1b3b18] dark:text-[#b6f07a] ring-1 ring-[#356d30] dark:ring-[#b6f07a]'
                        : 'border-[#dcebd2] dark:border-[#223725] bg-white dark:bg-[#122014] text-[#6b8665] dark:text-gray-300 hover:bg-[#f7fbf4] dark:hover:bg-[#192b1b]'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#356d30] dark:text-[#b6f07a] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-[#4f8b38] dark:text-[#b6f07a]" /> {t.activityLevelLabel}
              </label>
              <div className="flex gap-2">
                {(['Sedentary', 'Moderate (3-4 days)', 'Very Active'] as const).map((item) => (
                  <button
                    key={item}
                    onClick={() => setActivityLevel(item)}
                    className={`flex-1 text-xs py-2 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                      activityLevel === item
                        ? 'border-[#356d30] dark:border-[#78b943] bg-[#356d30] dark:bg-[#78b943] text-white dark:text-[#0a140c] font-semibold'
                        : 'border-[#dcebd2] dark:border-[#223725] bg-white dark:bg-[#122014] text-[#244b25] dark:text-gray-300 hover:bg-[#f7fbf4] dark:hover:bg-[#192b1b]'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#356d30] dark:text-[#b6f07a] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-[#4f8b38] dark:text-[#b6f07a]" /> {t.foodStyleLabel}
              </label>
              <select
                value={dietPreference}
                onChange={(e) => setDietPreference(e.target.value)}
                className="w-full text-xs p-2.5 bg-white dark:bg-[#0a140c] border border-[#dcebd2] dark:border-[#223725] rounded-xl text-[#244b25] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4f8b38]"
              >
                <option value="Bangladeshi Traditional">Bangladeshi Traditional (Fish, Rice, Daal, Shak)</option>
                <option value="High Protein">High Protein & Muscle Fitness</option>
                <option value="Vegetarian">Strict Plant-based / Vegetarian</option>
                <option value="Heart Health">Low Sodium & Blood Pressure Care</option>
              </select>
            </div>

            <button
              onClick={handleGenerateAdvice}
              disabled={isGenerating}
              className="w-full py-3 bg-[#356d30] hover:bg-[#285724] dark:bg-[#78b943] dark:hover:bg-[#68a737] text-white dark:text-[#0b170c] text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-60"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isGenerating ? t.scanningText : t.generateCoachBtn}</span>
            </button>
          </div>

          {/* Coach Insight */}
          <div className="lg:col-span-6 bg-[#f7fbf4] dark:bg-[#0a140c] border border-[#dcebd2] dark:border-[#223725] p-5 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 pb-3 border-b border-[#dcebd2] dark:border-[#223725] mb-3">
                <div className="w-8 h-8 rounded-full bg-[#4f8b38] dark:bg-[#78b943] text-white dark:text-[#0a140c] flex items-center justify-center font-bold text-xs">
                  NC
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#1b3b18] dark:text-white">{t.coachInsightTitle}</h4>
                  <span className="text-[10px] text-[#6b8665] dark:text-[#8ea987]">{t.brandTagline}</span>
                </div>
              </div>

              {coachResponse ? (
                <div className="bg-white dark:bg-[#122014] p-4 rounded-xl border border-[#dcebd2] dark:border-[#223725] text-xs text-[#244b25] dark:text-gray-200 whitespace-pre-line leading-relaxed shadow-xs">
                  {coachResponse}
                </div>
              ) : (
                <div className="bg-white/80 dark:bg-[#122014]/60 p-8 rounded-xl border border-dashed border-[#c1e88b] dark:border-[#223725] text-center text-xs text-[#6b8665] dark:text-[#8ea987] py-14">
                  <Sparkles className="w-8 h-8 text-[#80bf43] mx-auto mb-2 opacity-60" />
                  <p className="font-semibold text-[#356d30] dark:text-[#b6f07a]">
                    {language === 'bn' ? 'কোনো পরামর্শ এখনো তৈরি হয়নি' : language === 'hi' ? 'अभी कोई सलाह नहीं बनाई गई है' : 'No recommendations generated yet'}
                  </p>
                  <p className="text-[11px] text-[#6b8665] dark:text-[#8ea987] mt-1">
                    {language === 'bn' ? 'বাম পাশের অপশন বেছে নিয়ে বাটনে ক্লিক করুন।' : language === 'hi' ? 'विकल्प चुनें और बटन पर क्लिक करें।' : 'Select your goals on the left and click the button.'}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-[#dcebd2] dark:border-[#223725] text-[11px] text-[#6b8665] dark:text-[#8ea987] flex items-center justify-between">
              <span>{t.brandName} Coaching Engine</span>
              <span className="font-semibold text-[#356d30] dark:text-[#b6f07a]">Asma Bintay Arif</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
