/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, 
  User, 
  Target, 
  Globe, 
  Check, 
  Save, 
  Sparkles,
  Sun,
  Moon,
  Monitor,
  ShieldCheck,
  Link2,
  Unlink
} from 'lucide-react';
import { UserProfile, ThemeMode } from '../types.ts';
import { Language, translations } from '../translations.ts';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUpdateUser: (updatedUser: UserProfile) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
  language,
  onLanguageChange,
  theme,
  onThemeChange
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'goals' | 'appearance' | 'language'>('appearance');
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [dietaryPreference, setDietaryPreference] = useState(user.dietaryPreference);
  const [calories, setCalories] = useState(user.dailyCalorieTarget);
  const [protein, setProtein] = useState(user.dailyProteinTarget);
  const [water, setWater] = useState(user.dailyWaterTarget);
  const [budget, setBudget] = useState(user.dailyBudgetBDT);
  const [googleLinked, setGoogleLinked] = useState(user.googleLinked ?? (user.authMethod === 'google'));
  const [isSaved, setIsSaved] = useState(false);

  const t = translations[language];

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...user,
      name,
      email,
      avatarText: name.substring(0, 2).toUpperCase(),
      dietaryPreference,
      dailyCalorieTarget: Number(calories),
      dailyProteinTarget: Number(protein),
      dailyWaterTarget: Number(water),
      dailyBudgetBDT: Number(budget),
      googleLinked,
      theme
    };
    onUpdateUser(updated);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 800);
  };

  const languagesList: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'bn', label: 'বাংলা (Bengali)', flag: '🇧🇩' },
    { code: 'hi', label: 'हिंदी (Hindi)', flag: '🇮🇳' },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white dark:bg-[#152417] rounded-3xl max-w-xl w-full border border-[#dcebd2] dark:border-[#223725] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-colors">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#356d30] to-[#4f8b38] px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#c1e88b]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{t.settingsTitle}</h3>
              <p className="text-[11px] text-[#e0f2d4]">{t.settingsSubtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Bar */}
        <div className="flex border-b border-[#dcebd2] dark:border-[#223725] bg-[#fbfdf9] dark:bg-[#0d170e] px-4 text-xs font-bold overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('appearance')}
            className={`py-3 px-3 flex items-center gap-1.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'appearance'
                ? 'border-[#356d30] text-[#356d30] dark:border-[#b6f07a] dark:text-[#b6f07a]'
                : 'border-transparent text-[#6b8665] dark:text-[#8ea987] hover:text-[#244b25] dark:hover:text-white'
            }`}
          >
            <Sun className="w-3.5 h-3.5" /> {t.tabAppearance}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-3 flex items-center gap-1.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'profile'
                ? 'border-[#356d30] text-[#356d30] dark:border-[#b6f07a] dark:text-[#b6f07a]'
                : 'border-transparent text-[#6b8665] dark:text-[#8ea987] hover:text-[#244b25] dark:hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" /> {t.tabProfile}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('goals')}
            className={`py-3 px-3 flex items-center gap-1.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'goals'
                ? 'border-[#356d30] text-[#356d30] dark:border-[#b6f07a] dark:text-[#b6f07a]'
                : 'border-transparent text-[#6b8665] dark:text-[#8ea987] hover:text-[#244b25] dark:hover:text-white'
            }`}
          >
            <Target className="w-3.5 h-3.5" /> {t.tabGoals}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('language')}
            className={`py-3 px-3 flex items-center gap-1.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'language'
                ? 'border-[#356d30] text-[#356d30] dark:border-[#b6f07a] dark:text-[#b6f07a]'
                : 'border-transparent text-[#6b8665] dark:text-[#8ea987] hover:text-[#244b25] dark:hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" /> {t.tabLanguage}
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 text-[#244b25] dark:text-[#e6f6e1]">
          {/* 1. Appearance / Dark & Bright Theme Tab */}
          {activeTab === 'appearance' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-[#1b3b18] dark:text-white mb-1">
                  {t.themeModeLabel}
                </h4>
                <p className="text-xs text-[#6b8665] dark:text-[#8ea987] mb-4">
                  {t.themeDescription}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Bright (Light) Mode Card */}
                <div
                  onClick={() => onThemeChange('light')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    theme === 'light'
                      ? 'border-[#356d30] bg-[#f4faef] shadow-md ring-2 ring-[#78b943]/20'
                      : 'border-[#dcebd2] dark:border-[#223725] bg-white dark:bg-[#0d170e] hover:border-[#4f8b38]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                      <Sun className="w-5 h-5" />
                    </div>
                    {theme === 'light' && (
                      <span className="w-5 h-5 rounded-full bg-[#356d30] text-white flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                  <h5 className="text-sm font-bold text-[#1b3b18] dark:text-white">
                    {t.themeBright}
                  </h5>
                  <p className="text-[11px] text-[#6b8665] dark:text-[#8ea987] mt-1">
                    {language === 'bn' 
                      ? 'দিনের বেলা ব্যবহারের জন্য পরিচ্ছন্ন ও প্রাণবন্ত উজ্জ্বল সবুজ ডিজাইন।' 
                      : language === 'hi' 
                      ? 'दिन के समय के लिए ताज़ा हरा और सफेद इंटरफ़ेस।' 
                      : 'Clean daylight aesthetic with refreshing emerald tones.'}
                  </p>
                </div>

                {/* Dark Mode Card */}
                <div
                  onClick={() => onThemeChange('dark')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    theme === 'dark'
                      ? 'border-[#52a647] bg-[#1d3521] shadow-md ring-2 ring-[#78b943]/20'
                      : 'border-[#dcebd2] dark:border-[#223725] bg-white dark:bg-[#0d170e] hover:border-[#4f8b38]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl bg-gray-900 text-[#b6f07a] flex items-center justify-center">
                      <Moon className="w-5 h-5" />
                    </div>
                    {theme === 'dark' && (
                      <span className="w-5 h-5 rounded-full bg-[#52a647] text-white flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                  <h5 className="text-sm font-bold text-[#1b3b18] dark:text-white">
                    {t.themeDark}
                  </h5>
                  <p className="text-[11px] text-[#6b8665] dark:text-[#8ea987] mt-1">
                    {language === 'bn' 
                      ? 'চোখের আরামের জন্য গভীর ফরেস্ট গ্রিন ও ডার্ক কন্ট্রাস্ট ডিজাইন।' 
                      : language === 'hi' 
                      ? 'आंखों के तनाव को कम करने वाला गहरा वन-हरा डार्क मोड।' 
                      : 'Eye-friendly deep forest green with high-contrast text.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 2. Profile & Connected Accounts Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 bg-[#f7fbf4] dark:bg-[#0d170e] rounded-2xl border border-[#dcebd2] dark:border-[#223725]">
                <div className="w-14 h-14 rounded-full bg-[#356d30] text-white flex items-center justify-center font-bold text-lg">
                  {name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#1b3b18] dark:text-white">{name}</h4>
                  <p className="text-xs text-[#6b8665] dark:text-[#8ea987]">{email}</p>
                  <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.2 bg-[#eaf4e5] dark:bg-[#1d3521] text-[#356d30] dark:text-[#b6f07a] rounded-full">
                    {user.role}
                  </span>
                </div>
              </div>

              {/* Google Connection Section (Optional) */}
              <div className="p-3.5 rounded-2xl border border-[#dcebd2] dark:border-[#223725] bg-[#fbfdf9] dark:bg-[#0d170e]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    <span className="text-xs font-bold text-[#1b3b18] dark:text-white">
                      {t.googleConnectTitle}
                    </span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    googleLinked
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                  }`}>
                    {googleLinked ? t.googleConnected : t.googleNotConnected}
                  </span>
                </div>
                <p className="text-[11px] text-[#6b8665] dark:text-[#8ea987] mb-2.5">
                  {t.gmailOptionalNotice}
                </p>
                <button
                  type="button"
                  onClick={() => setGoogleLinked(!googleLinked)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                    googleLinked
                      ? 'bg-red-50 dark:bg-red-950/40 text-red-600 border-red-200 dark:border-red-900 hover:bg-red-100'
                      : 'bg-white dark:bg-[#1a2f1c] text-[#356d30] dark:text-[#b6f07a] border-[#dcebd2] dark:border-[#2a482c] hover:bg-[#eef7e9]'
                  }`}
                >
                  {googleLinked ? (
                    <>
                      <Unlink className="w-3.5 h-3.5" />
                      <span>{t.disconnectGoogleBtn}</span>
                    </>
                  ) : (
                    <>
                      <Link2 className="w-3.5 h-3.5" />
                      <span>{t.connectGoogleBtn}</span>
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#356d30] dark:text-[#b6f07a] mb-1">
                    {t.displayName}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs p-2.5 bg-[#fbfdf9] dark:bg-[#0d170e] border border-[#dcebd2] dark:border-[#223725] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4f8b38] dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#356d30] dark:text-[#b6f07a] mb-1">
                    {t.emailLabel}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs p-2.5 bg-[#fbfdf9] dark:bg-[#0d170e] border border-[#dcebd2] dark:border-[#223725] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4f8b38] dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#356d30] dark:text-[#b6f07a] mb-1">
                  {t.dietPreference}
                </label>
                <input
                  type="text"
                  value={dietaryPreference}
                  onChange={(e) => setDietaryPreference(e.target.value)}
                  className="w-full text-xs p-2.5 bg-[#fbfdf9] dark:bg-[#0d170e] border border-[#dcebd2] dark:border-[#223725] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4f8b38] dark:text-white"
                />
              </div>
            </div>
          )}

          {/* 3. Goals Tab */}
          {activeTab === 'goals' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 bg-[#f7fbf4] dark:bg-[#0d170e] rounded-2xl border border-[#dcebd2] dark:border-[#223725]">
                  <label className="block text-xs font-bold text-[#356d30] dark:text-[#b6f07a] mb-1">
                    {t.calTarget} (kcal)
                  </label>
                  <input
                    type="number"
                    value={calories}
                    onChange={(e) => setCalories(Number(e.target.value))}
                    className="w-full text-sm font-bold p-2 bg-white dark:bg-[#152417] border border-[#dcebd2] dark:border-[#223725] rounded-xl text-[#1b3b18] dark:text-white"
                  />
                </div>

                <div className="p-3 bg-[#f7fbf4] dark:bg-[#0d170e] rounded-2xl border border-[#dcebd2] dark:border-[#223725]">
                  <label className="block text-xs font-bold text-[#356d30] dark:text-[#b6f07a] mb-1">
                    {t.proteinTitle} (g)
                  </label>
                  <input
                    type="number"
                    value={protein}
                    onChange={(e) => setProtein(Number(e.target.value))}
                    className="w-full text-sm font-bold p-2 bg-white dark:bg-[#152417] border border-[#dcebd2] dark:border-[#223725] rounded-xl text-[#1b3b18] dark:text-white"
                  />
                </div>

                <div className="p-3 bg-[#f7fbf4] dark:bg-[#0d170e] rounded-2xl border border-[#dcebd2] dark:border-[#223725]">
                  <label className="block text-xs font-bold text-[#356d30] dark:text-[#b6f07a] mb-1">
                    {t.hydrationTitle} (Liters)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={water}
                    onChange={(e) => setWater(Number(e.target.value))}
                    className="w-full text-sm font-bold p-2 bg-white dark:bg-[#152417] border border-[#dcebd2] dark:border-[#223725] rounded-xl text-[#1b3b18] dark:text-white"
                  />
                </div>

                <div className="p-3 bg-[#f7fbf4] dark:bg-[#0d170e] rounded-2xl border border-[#dcebd2] dark:border-[#223725]">
                  <label className="block text-xs font-bold text-[#356d30] dark:text-[#b6f07a] mb-1">
                    {language === 'bn' ? 'দৈনিক বাজেট (টাকা)' : language === 'hi' ? 'दैनिक बजट (रुपये)' : 'Daily Budget (৳ BDT)'}
                  </label>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full text-sm font-bold p-2 bg-white dark:bg-[#152417] border border-[#dcebd2] dark:border-[#223725] rounded-xl text-[#1b3b18] dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 4. Language Tab */}
          {activeTab === 'language' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-[#1b3b18] dark:text-white mb-2">
                {t.selectLanguage}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {languagesList.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => onLanguageChange(lang.code)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                      language === lang.code
                        ? 'border-[#356d30] dark:border-[#b6f07a] bg-[#f4faef] dark:bg-[#1d3521] shadow-xs'
                        : 'border-[#dcebd2] dark:border-[#223725] hover:border-[#4f8b38]'
                    }`}
                  >
                    <span className="text-2xl block mb-2">{lang.flag}</span>
                    <span className="text-xs font-black text-[#1b3b18] dark:text-white block">
                      {lang.label}
                    </span>
                    {language === lang.code && (
                      <span className="inline-block mt-2 text-[10px] font-bold text-[#356d30] dark:text-[#b6f07a]">
                        ✓ Selected
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}


        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#dcebd2] dark:border-[#223725] bg-[#fbfdf9] dark:bg-[#0d170e] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-[#6b8665] dark:text-[#8ea987] hover:text-[#244b25] dark:hover:text-white cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 bg-[#356d30] hover:bg-[#285524] text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center gap-1.5"
          >
            {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{isSaved ? t.savedToast : t.saveSettings}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
