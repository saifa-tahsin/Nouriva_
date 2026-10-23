/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Calendar, 
  TrendingUp, 
  Sparkles, 
  Clock, 
  BarChart3, 
  Download, 
  Target, 
  Plus, 
  Check, 
  RotateCcw,
  Sliders,
  Utensils
} from 'lucide-react';
import { UserProfile, DailyIntakeLog, DayReportItem } from '../types.ts';
import { Language, translations } from '../translations.ts';
import { downloadProjectZip } from '../utils/zipExporter.ts';

interface ReportCardProps {
  user: UserProfile;
  dailyIntake: DailyIntakeLog;
  onUpdateDailyIntake?: (intake: DailyIntakeLog) => void;
  onUpdateUser?: (user: UserProfile) => void;
  language: Language;
}

export const ReportCard: React.FC<ReportCardProps> = ({ 
  user, 
  dailyIntake, 
  onUpdateDailyIntake,
  onUpdateUser,
  language 
}) => {
  const [period, setPeriod] = useState<'weekly' | 'monthly'>('weekly');
  const [isDownloading, setIsDownloading] = useState(false);
  const [showTargetModal, setShowTargetModal] = useState(false);
  const [targetCalInput, setTargetCalInput] = useState('2000');
  const [targetProtInput, setTargetProtInput] = useState('120');
  const [targetWaterInput, setTargetWaterInput] = useState('3.0');

  const t = translations[language];

  // User targets start at 0 by requirement
  const calorieTarget = user.dailyCalorieTarget ?? 0;
  const proteinTarget = user.dailyProteinTarget ?? 0;
  const waterTarget = user.dailyWaterTarget ?? 0;

  // ALL days start strictly at 0! Today's values update live as meals/hydration are logged
  const weeklyDays: DayReportItem[] = [
    { dayName: 'Saturday', dayShort: language === 'bn' ? 'শনি' : language === 'hi' ? 'शनि' : 'Sat', calories: 0, calorieTarget, protein: 0, proteinTarget, water: 0, waterTarget, healthScore: 0 },
    { dayName: 'Sunday', dayShort: language === 'bn' ? 'রবি' : language === 'hi' ? 'रवि' : 'Sun', calories: 0, calorieTarget, protein: 0, proteinTarget, water: 0, waterTarget, healthScore: 0 },
    { dayName: 'Monday', dayShort: language === 'bn' ? 'সোম' : language === 'hi' ? 'सोम' : 'Mon', calories: 0, calorieTarget, protein: 0, proteinTarget, water: 0, waterTarget, healthScore: 0 },
    { dayName: 'Tuesday', dayShort: language === 'bn' ? 'মঙ্গল' : language === 'hi' ? 'मंगल' : 'Tue', calories: 0, calorieTarget, protein: 0, proteinTarget, water: 0, waterTarget, healthScore: 0 },
    { dayName: 'Wednesday', dayShort: language === 'bn' ? 'বুধ' : language === 'hi' ? 'बुध' : 'Wed', calories: 0, calorieTarget, protein: 0, proteinTarget, water: 0, waterTarget, healthScore: 0 },
    { dayName: 'Thursday', dayShort: language === 'bn' ? 'বৃহঃ' : language === 'hi' ? 'गुरु' : 'Thu', calories: 0, calorieTarget, protein: 0, proteinTarget, water: 0, waterTarget, healthScore: 0 },
    { 
      dayName: 'Today', 
      dayShort: language === 'bn' ? 'আজ' : language === 'hi' ? 'आज' : 'Today', 
      calories: dailyIntake.calories, 
      calorieTarget, 
      protein: dailyIntake.protein, 
      proteinTarget, 
      water: dailyIntake.water, 
      waterTarget, 
      healthScore: dailyIntake.healthScore, 
      isToday: true 
    },
  ];

  // 4 Weeks data for Monthly view — strictly starts at 0 until meals are logged
  const todayAdherence = calorieTarget > 0 
    ? Math.min(100, Math.round((dailyIntake.calories / calorieTarget) * 100)) 
    : 0;

  const monthlyWeeks = [
    { name: language === 'bn' ? 'সপ্তাহ ১' : language === 'hi' ? 'सप्ताह १' : 'Week 1', avgCalories: 0, avgProtein: 0, avgWater: 0, adherence: 0 },
    { name: language === 'bn' ? 'সপ্তাহ ২' : language === 'hi' ? 'सप्ताह २' : 'Week 2', avgCalories: 0, avgProtein: 0, avgWater: 0, adherence: 0 },
    { name: language === 'bn' ? 'সপ্তাহ ৩' : language === 'hi' ? 'सप्ताह ৩' : 'Week 3', avgCalories: 0, avgProtein: 0, avgWater: 0, adherence: 0 },
    { 
      name: language === 'bn' ? 'সপ্তাহ ৪ (চলতি)' : language === 'hi' ? 'सप्ताह ४ (বর্তমান)' : 'Week 4 (Current)', 
      avgCalories: dailyIntake.calories, 
      avgProtein: dailyIntake.protein, 
      avgWater: dailyIntake.water, 
      adherence: todayAdherence 
    },
  ];

  // Aggregate stats — initially all 0!
  const totalCaloriesWeekly = weeklyDays.reduce((acc, d) => acc + d.calories, 0);
  const avgProteinWeekly = Math.round(weeklyDays.reduce((acc, d) => acc + d.protein, 0) / 7);
  const avgWaterWeekly = +(weeklyDays.reduce((acc, d) => acc + d.water, 0) / 7).toFixed(1);
  const avgAdherenceWeekly = calorieTarget > 0 
    ? Math.min(100, Math.round((totalCaloriesWeekly / calorieTarget) * 100)) 
    : (dailyIntake.calories > 0 ? 100 : 0);

  const totalCaloriesMonthly = dailyIntake.calories;
  const avgProteinMonthly = dailyIntake.protein;
  const avgWaterMonthly = dailyIntake.water;
  const avgAdherenceMonthly = todayAdherence;

  const currentAdherence = period === 'weekly' ? avgAdherenceWeekly : avgAdherenceMonthly;
  const currentTotalCalories = period === 'weekly' ? totalCaloriesWeekly : totalCaloriesMonthly;
  const currentAvgProtein = period === 'weekly' ? avgProteinWeekly : avgProteinMonthly;
  const currentAvgWater = period === 'weekly' ? avgWaterWeekly : avgWaterMonthly;

  const handleDownloadZip = async () => {
    setIsDownloading(true);
    await downloadProjectZip();
    setTimeout(() => setIsDownloading(false), 1500);
  };

  const handleApplyPreset = (cal: number, prot: number, water: number) => {
    if (onUpdateUser) {
      onUpdateUser({
        ...user,
        dailyCalorieTarget: cal,
        dailyProteinTarget: prot,
        dailyWaterTarget: water,
      });
    }
    if (onUpdateDailyIntake) {
      onUpdateDailyIntake({
        ...dailyIntake,
        targetCalories: cal,
        targetProtein: prot,
        targetWater: water,
        healthScore: dailyIntake.calories > 0 ? 85 : 0
      });
    }
    setShowTargetModal(false);
  };

  const handleSaveCustomTarget = (e: React.FormEvent) => {
    e.preventDefault();
    const cal = Number(targetCalInput) || 2000;
    const prot = Number(targetProtInput) || 120;
    const water = Number(targetWaterInput) || 3.0;
    handleApplyPreset(cal, prot, water);
  };


  const handleResetAllToZero = () => {
    if (window.confirm(language === 'bn' ? 'সব রিপোর্ট ও দৈনিক লগ শূন্য (০) তে রিসেট করবেন?' : 'Reset all progress report and intake logs to zero (0)?')) {
      if (onUpdateDailyIntake) {
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
    }
  };

  return (
    <div className="bg-white dark:bg-[#152417] p-5 sm:p-6 rounded-3xl border border-[#dcebd2] dark:border-[#223725] shadow-xs mb-8 transition-colors">
      {/* Top Header of Report Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#dcebd2] dark:border-[#223725]">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#356d30] dark:text-[#b6f07a] bg-[#eaf4e5] dark:bg-[#1d331f] px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <BarChart3 className="w-3.5 h-3.5" />
              {t.reportConsistencyBadge}
            </span>
            <span className="text-xs text-[#6b8665] dark:text-[#8ea987] flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {dailyIntake.calories === 0 
                ? (language === 'bn' ? 'সব মান বর্তমানে শূন্য (০) থেকে শুরু' : 'All values initialized at zero (0)')
                : t.todayRealtimeUpdate}
            </span>
          </div>
          <h3 className="text-lg font-black text-[#1b3b18] dark:text-white">
            {t.reportCardTitle}
          </h3>
          <p className="text-xs text-[#6b8665] dark:text-[#8ea987] mt-0.5">
            {language === 'bn' 
              ? 'খাবার ও পানি লগ করার সাথে সাথে এই রিপোর্ট কার্ডটি স্বয়ংক্রিয়ভাবে আপডেট হবে।'
              : 'This report card updates dynamically in real-time as you log food and water.'}
          </p>
        </div>

        {/* Action Controls: Switcher + Set Targets + Download ZIP */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Period Switcher: Weekly vs Monthly */}
          <div className="flex bg-[#f4faef] dark:bg-[#0d170e] p-1 rounded-2xl border border-[#dcebd2] dark:border-[#223725]">
            <button
              onClick={() => setPeriod('weekly')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                period === 'weekly'
                  ? 'bg-[#356d30] text-white shadow-xs'
                  : 'text-[#6b8665] dark:text-[#8ea987] hover:text-[#244b25] dark:hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{t.weeklyView}</span>
            </button>
            <button
              onClick={() => setPeriod('monthly')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                period === 'monthly'
                  ? 'bg-[#356d30] text-white shadow-xs'
                  : 'text-[#6b8665] dark:text-[#8ea987] hover:text-[#244b25] dark:hover:text-white'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{t.monthlyView}</span>
            </button>
          </div>

          {/* Set Targets Button */}
          <button
            onClick={() => setShowTargetModal(true)}
            className="flex items-center gap-1 px-3 py-1.5 bg-[#eef7e9] dark:bg-[#1a301d] hover:bg-[#e1f2da] text-[#356d30] dark:text-[#b6f07a] rounded-xl text-xs font-bold border border-[#cfe6c3] dark:border-[#28482b] transition-all cursor-pointer"
            title="Set daily nutrition targets"
          >
            <Target className="w-3.5 h-3.5" />
            <span>{calorieTarget === 0 ? (language === 'bn' ? 'টার্গেট নির্ধারণ করুন' : 'Set Targets') : (language === 'bn' ? 'টার্গেট পরিবর্তন' : 'Edit Targets')}</span>
          </button>

          {/* Download ZIP Button */}
          <button
            onClick={handleDownloadZip}
            disabled={isDownloading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#356d30] hover:bg-[#285724] dark:bg-[#78b943] text-white dark:text-[#0b170c] rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
            title="Download Project ZIP"
          >
            <Download className={`w-3.5 h-3.5 ${isDownloading ? 'animate-bounce' : ''}`} />
            <span>{isDownloading ? '...' : (language === 'bn' ? 'ZIP ডাউনলোড' : 'Download ZIP')}</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Strip — All 0 Initially! */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
        <div className="p-3.5 bg-[#fbfdf9] dark:bg-[#0d170e] rounded-2xl border border-[#dcebd2] dark:border-[#223725]">
          <span className="text-[11px] font-semibold text-[#6b8665] dark:text-[#8ea987] block mb-1">
            {t.adherenceScore}
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-[#356d30] dark:text-[#b6f07a]">
              {currentAdherence}%
            </span>
            <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
              currentAdherence === 0 
                ? 'text-gray-500 bg-gray-100 dark:bg-gray-800' 
                : currentAdherence >= 80 
                ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950' 
                : 'text-amber-600 bg-amber-50 dark:bg-amber-950'
            }`}>
              {currentAdherence === 0 
                ? (language === 'bn' ? '০ থেকে শুরু' : '0 Start') 
                : currentAdherence >= 80 ? 'Optimal' : 'Active'}
            </span>
          </div>
        </div>

        <div className="p-3.5 bg-[#fbfdf9] dark:bg-[#0d170e] rounded-2xl border border-[#dcebd2] dark:border-[#223725]">
          <span className="text-[11px] font-semibold text-[#6b8665] dark:text-[#8ea987] block mb-1">
            {t.totalLogged}
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-[#1b3b18] dark:text-white">
              {currentTotalCalories.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-[#6b8665]">kcal</span>
          </div>
        </div>

        <div className="p-3.5 bg-[#fbfdf9] dark:bg-[#0d170e] rounded-2xl border border-[#dcebd2] dark:border-[#223725]">
          <span className="text-[11px] font-semibold text-[#6b8665] dark:text-[#8ea987] block mb-1">
            {t.avgProteinPerDay}
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-[#1b3b18] dark:text-white">
              {currentAvgProtein}g
            </span>
            <span className="text-xs font-semibold text-[#6b8665]">/ day</span>
          </div>
        </div>

        <div className="p-3.5 bg-[#fbfdf9] dark:bg-[#0d170e] rounded-2xl border border-[#dcebd2] dark:border-[#223725]">
          <span className="text-[11px] font-semibold text-[#6b8665] dark:text-[#8ea987] block mb-1">
            {t.avgHydrationPerDay}
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-[#1b3b18] dark:text-white">
              {currentAvgWater}L
            </span>
            <span className="text-xs font-semibold text-[#6b8665]">/ day</span>
          </div>
        </div>
      </div>

      {/* Visual Chart / Adherence Bars */}
      <div className="pt-2">
        <div className="flex items-center justify-between text-xs font-bold text-[#356d30] dark:text-[#b6f07a] mb-3">
          <span>
            {period === 'weekly' 
              ? (language === 'bn' ? 'সাপ্তাহিক দৈনিক ক্যালোরি ও প্রোটিন পূর্ণতা (সবগুলো ০ দিয়ে শুরু)' : language === 'hi' ? 'दैनिक कैलोरी व प्रोटीन पूर्ति' : 'Weekly Daily Adherence (0-Initialized)')
              : (language === 'bn' ? 'সাপ্তাহিক সামগ্রিক অর্জন ও অগ্রগতি' : language === 'hi' ? 'साप्ताहिक प्रगति सारांश' : 'Weekly Milestone Progress')}
          </span>
          <span className="text-[11px] font-normal text-[#6b8665] dark:text-[#8ea987]">
            {calorieTarget > 0 ? `Target: ${calorieTarget} kcal` : (language === 'bn' ? 'টার্গেট সেট করা হয়নি (০)' : 'Target: 0 (Not set)')}
          </span>
        </div>

        {period === 'weekly' ? (
          <div className="grid grid-cols-7 gap-2 sm:gap-3">
            {weeklyDays.map((day, idx) => {
              const calPercent = (day.calorieTarget > 0 && day.calories > 0)
                ? Math.min(100, Math.round((day.calories / day.calorieTarget) * 100))
                : (day.calories > 0 ? 100 : 0);

              return (
                <div 
                  key={idx}
                  className={`p-2.5 rounded-2xl border text-center flex flex-col justify-between transition-all ${
                    day.isToday
                      ? 'bg-[#eaf4e5] dark:bg-[#1d3521] border-[#356d30] dark:border-[#52a647] ring-2 ring-[#78b943]/20 shadow-xs'
                      : 'bg-[#fbfdf9] dark:bg-[#0d170e] border-[#dcebd2] dark:border-[#223725]'
                  }`}
                >
                  <div className="mb-2">
                    <span className={`text-[11px] font-extrabold block ${
                      day.isToday ? 'text-[#356d30] dark:text-[#b6f07a]' : 'text-[#6b8665] dark:text-[#8ea987]'
                    }`}>
                      {day.dayShort}
                    </span>
                    {day.isToday && (
                      <span className="inline-block text-[9px] font-bold px-1.5 py-0.2 bg-[#356d30] text-white rounded-full">
                        Live
                      </span>
                    )}
                  </div>

                  {/* Progress Bar Container: 0 height when 0 */}
                  <div className="space-y-1.5 my-1">
                    <div className="h-14 sm:h-20 bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5 flex flex-col justify-end overflow-hidden border border-dashed border-gray-200 dark:border-gray-700">
                      {day.calories > 0 ? (
                        <div 
                          className={`w-full rounded-md transition-all duration-500 ${
                            day.isToday 
                              ? 'bg-gradient-to-t from-orange-500 to-[#4f8e38]' 
                              : 'bg-[#4f8e38] dark:bg-[#5bb844]'
                          }`}
                          style={{ height: `${Math.max(10, calPercent)}%` }}
                          title={`${day.calories} kcal`}
                        />
                      ) : (
                        <div className="w-full h-1 bg-gray-300 dark:bg-gray-700 rounded-full opacity-40" />
                      )}
                    </div>
                  </div>

                  <div className="text-[10px] font-bold text-[#1b3b18] dark:text-white mt-1">
                    {calPercent}%
                  </div>
                  <div className="text-[9px] text-[#6b8665] dark:text-[#8ea987]">
                    {day.calories} kcal
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-3">
            {monthlyWeeks.map((week, idx) => (
              <div 
                key={idx}
                className="p-3 bg-[#fbfdf9] dark:bg-[#0d170e] rounded-2xl border border-[#dcebd2] dark:border-[#223725] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="min-w-[120px]">
                  <h4 className="text-xs font-bold text-[#1b3b18] dark:text-white">{week.name}</h4>
                  <span className="text-[11px] text-[#6b8665] dark:text-[#8ea987]">
                    Avg: {week.avgCalories} kcal · {week.avgProtein}g prot · {week.avgWater}L
                  </span>
                </div>

                <div className="flex-1 max-w-md">
                  <div className="w-full h-2.5 bg-[#eef7e9] dark:bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#4f8e38] to-[#80bf43] rounded-full transition-all duration-500" 
                      style={{ width: `${week.adherence}%` }} 
                    />
                  </div>
                </div>

                <div className="text-right sm:min-w-[70px]">
                  <span className="text-sm font-black text-[#356d30] dark:text-[#b6f07a]">{week.adherence}%</span>
                  <span className="text-[10px] text-[#6b8665] block">{language === 'bn' ? 'অর্জিত' : language === 'hi' ? 'पूर्ण' : 'Met'}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* AI Health Summary Note */}
        <div className="mt-3 p-3.5 bg-gradient-to-r from-[#f4faef] to-[#eaf5e4] dark:from-[#0d170e] dark:to-[#172b1a] rounded-2xl border border-[#dcebd2] dark:border-[#223725] flex items-start gap-3">
          <div className="w-7 h-7 rounded-xl bg-[#356d30] text-white flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="w-3.5 h-3.5 text-[#c1e88b]" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#1b3b18] dark:text-white block">
              {language === 'bn' 
                ? 'নুরিভা এআই লাইভ স্বাস্থ্য রিপোর্ট পর্যবেক্ষণ' 
                : language === 'hi' 
                ? 'नूरीवा एआई स्वास्थ्य विश्लेषण' 
                : 'Nouriva AI Real-Time Progress Analysis'}
            </span>
            <p className="text-[11px] text-[#6b8665] dark:text-[#8ea987] mt-0.5 leading-relaxed">
              {dailyIntake.calories === 0 ? (
                language === 'bn' 
                  ? 'আপনার আজকের লক্ষ্য ও লগ এখনও ০ রয়েছে। Feature 4-এর Daily Nutrition Tracker-এ লক্ষ্য সংরক্ষণ বা খাবার যোগ করলে এই রিপোর্ট স্বয়ংক্রিয়ভাবে আপডেট হবে।'
                  : 'Your intake and targets are currently at 0. Set goals or add food in Feature 4 Daily Nutrition Tracker. This report updates automatically.'
              ) : (
                language === 'bn'
                  ? `আজকের পর্যন্ত অর্জিত ক্যালোরি: ${dailyIntake.calories} kcal, প্রোটিন: ${dailyIntake.protein}g এবং পানি: ${dailyIntake.water}L। আপনার স্বাস্থ্য স্কোর ও রিপোর্ট রিয়েল-টাইমে আপডেট হচ্ছে।`
                  : `Logged so far today: ${dailyIntake.calories} kcal, ${dailyIntake.protein}g protein, and ${dailyIntake.water}L water. Real-time metrics are syncing smoothly.`
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Target Setting Modal */}
      {showTargetModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#152417] border border-[#dcebd2] dark:border-[#223725] rounded-3xl max-w-md w-full p-6 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-[#dcebd2] dark:border-[#223725] mb-4">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-[#356d30] dark:text-[#b6f07a]" />
                <h3 className="font-extrabold text-sm text-[#1b3b18] dark:text-white">
                  {language === 'bn' ? 'দৈনিক পুষ্টি টার্গেট নির্বাচন করুন' : 'Select Daily Nutrition Targets'}
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
                ? 'প্রথম লগইনে সব মান ০ রাখা হয়েছিল। এখন নিচের যে কোন একটি প্ল্যান নির্বাচন করুন অথবা নিজের মতো সংখ্যা বসান:'
                : 'All values were initialized to 0. Now select a target preset or enter custom targets:'}
            </p>

            {/* Presets */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
              <button
                type="button"
                onClick={() => handleApplyPreset(2000, 120, 3.0)}
                className="p-3 text-left rounded-xl border border-[#cfe6c3] dark:border-[#28482b] bg-[#f7fbf4] dark:bg-[#1b2f1d] hover:border-[#356d30] cursor-pointer"
              >
                <span className="font-bold text-xs text-[#356d30] dark:text-[#b6f07a] block">সুষম পুষ্টি</span>
                <span className="text-[10px] text-[#6b8665] dark:text-[#8ea987] block">2000 kcal · 120g</span>
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset(1600, 130, 3.2)}
                className="p-3 text-left rounded-xl border border-[#cfe6c3] dark:border-[#28482b] bg-[#f7fbf4] dark:bg-[#1b2f1d] hover:border-[#356d30] cursor-pointer"
              >
                <span className="font-bold text-xs text-orange-600 dark:text-orange-400 block">ওজন হ্রাস</span>
                <span className="text-[10px] text-[#6b8665] dark:text-[#8ea987] block">1600 kcal · 130g</span>
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset(2500, 160, 3.8)}
                className="p-3 text-left rounded-xl border border-[#cfe6c3] dark:border-[#28482b] bg-[#f7fbf4] dark:bg-[#1b2f1d] hover:border-[#356d30] cursor-pointer"
              >
                <span className="font-bold text-xs text-blue-600 dark:text-blue-400 block">মাসল গেইন</span>
                <span className="text-[10px] text-[#6b8665] dark:text-[#8ea987] block">2500 kcal · 160g</span>
              </button>
            </div>

            {/* Custom Input */}
            <form onSubmit={handleSaveCustomTarget} className="space-y-3">
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
                  className="px-4 py-2 text-xs font-bold text-white bg-[#356d30] hover:bg-[#285724] rounded-xl cursor-pointer"
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
