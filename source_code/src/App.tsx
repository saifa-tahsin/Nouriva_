/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthScreen } from './components/AuthScreen.tsx';
import { Sidebar } from './components/Sidebar.tsx';
import { TopHeader } from './components/TopHeader.tsx';
import { BannerSection } from './components/BannerSection.tsx';
import { KeyMetricsGrid } from './components/KeyMetricsGrid.tsx';
import { ReportCard } from './components/ReportCard.tsx';
import { CoreFeaturesGrid } from './components/CoreFeaturesGrid.tsx';
import { TeamPanel } from './components/TeamPanel.tsx';
import { SettingsModal } from './components/SettingsModal.tsx';
import { Member1FoodScanner } from './features/member1_food_scanner.tsx';
import { Member2NutritionCoach } from './features/member2_nutrition_coach.tsx';
import { Member3BudgetMealPlanner } from './features/member3_budget_meal_planner.tsx';
import { Member4TrackerAssistant } from './features/member4_tracker_assistant.tsx';
import { UserProfile, DailyIntakeLog, ThemeMode } from './types.ts';
import { Language, translations } from './translations.ts';
import { ArrowLeft } from 'lucide-react';

const STORAGE_KEY = 'nouriva_logged_user';
const LANG_STORAGE_KEY = 'nouriva_app_language';
const THEME_STORAGE_KEY = 'nouriva_app_theme';
const INTAKE_STORAGE_KEY = 'nouriva_daily_intake';

export default function App() {
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const savedLang = localStorage.getItem(LANG_STORAGE_KEY) as Language;
      return savedLang && ['en', 'bn', 'hi'].includes(savedLang) ? savedLang : 'bn';
    } catch {
      return 'bn';
    }
  });

  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode;
      return savedTheme && ['light', 'dark'].includes(savedTheme) ? savedTheme : 'light';
    } catch {
      return 'light';
    }
  });

  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Daily logged intake starts at 0 for new sessions or initial setup
  const [dailyIntake, setDailyIntake] = useState<DailyIntakeLog>(() => {
    try {
      const saved = localStorage.getItem(INTAKE_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Intake parse error', e);
    }
    return {
      calories: 0,
      protein: 0,
      water: 0,
      targetCalories: 0,
      targetProtein: 0,
      targetWater: 0,
      healthScore: 0,
      lastUpdated: new Date().toISOString()
    };
  });

  // Keep Overview, targets, and Progress Report synced with Feature 4.
  useEffect(() => {
    let cancelled = false;
    const syncFoodLog = async (incomingLogs?: any[], incomingGoals?: any) => {
      try {
        const rawLogs = incomingLogs ? JSON.stringify(incomingLogs) : localStorage.getItem('ls_logs');
        const logs = rawLogs ? JSON.parse(rawLogs) : [];
        const rawGoals = incomingGoals ? JSON.stringify(incomingGoals) : localStorage.getItem('ls_goals');
        const trackerGoals = rawGoals ? JSON.parse(rawGoals) : {};
        const response = await fetch('./member4/data/foods.json', { cache: 'no-store' });
        if (!response.ok) return;
        const foods = await response.json();
        if (cancelled) return;
        const now = new Date();
        const pad = (n: number) => String(n).padStart(2, '0');
        const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
        const byId = new Map(foods.map((food: any) => [food.id, food]));
        const totals = (Array.isArray(logs) ? logs : []).filter((entry: any) => entry.date === today).reduce(
          (sum: { calories: number; protein: number }, entry: any) => {
            const food: any = byId.get(entry.foodId);
            const qty = Number(entry.qty);
            if (food && Number.isFinite(qty) && qty > 0) {
              sum.calories += Number(food.kcal || 0) * qty;
              sum.protein += Number(food.p || 0) * qty;
            }
            return sum;
          }, { calories: 0, protein: 0 }
        );
        const kcalGoal = Number(trackerGoals.kcal);
        const proteinGoal = Number(trackerGoals.p);
        // Feature 4's saved goals are the source of truth for dashboard targets.
        if (Number.isFinite(kcalGoal) && kcalGoal > 0 || Number.isFinite(proteinGoal) && proteinGoal > 0) {
          setUser(prev => {
            if (!prev) return prev;
            const nextCal = Number.isFinite(kcalGoal) && kcalGoal > 0 ? kcalGoal : prev.dailyCalorieTarget;
            const nextProtein = Number.isFinite(proteinGoal) && proteinGoal > 0 ? proteinGoal : prev.dailyProteinTarget;
            if (nextCal === prev.dailyCalorieTarget && nextProtein === prev.dailyProteinTarget) return prev;
            const nextUser = { ...prev, dailyCalorieTarget: nextCal, dailyProteinTarget: nextProtein };
            try { localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser)); } catch {}
            return nextUser;
          });
        }
        setDailyIntake(prev => {
          const next = {
            ...prev,
            calories: Math.round(totals.calories),
            protein: Math.round(totals.protein * 10) / 10,
            targetCalories: Number.isFinite(kcalGoal) && kcalGoal > 0 ? kcalGoal : (user?.dailyCalorieTarget ?? prev.targetCalories ?? 0),
            targetProtein: Number.isFinite(proteinGoal) && proteinGoal > 0 ? proteinGoal : (user?.dailyProteinTarget ?? prev.targetProtein ?? 0),
            targetWater: user?.dailyWaterTarget ?? prev.targetWater ?? 0,
            lastUpdated: new Date().toISOString(),
          };
          try { localStorage.setItem(INTAKE_STORAGE_KEY, JSON.stringify(next)); } catch {}
          return next;
        });
      } catch (err) {
        console.warn('Could not sync Feature 4 food log with dashboard metrics:', err);
      }
    };
    const onStorage = (event: StorageEvent) => {
      if (!event.key || ['ls_logs', 'ls_goals'].includes(event.key)) void syncFoodLog();
    };
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.data?.type !== 'NOURIVA_FOOD_LOG_UPDATED') return;
      try {
        if (Array.isArray(event.data.logs)) localStorage.setItem('ls_logs', JSON.stringify(event.data.logs));
        if (event.data.goals && typeof event.data.goals === 'object') localStorage.setItem('ls_goals', JSON.stringify(event.data.goals));
      } catch (err) { console.warn('Could not persist Feature 4 tracker update:', err); }
      void syncFoodLog(event.data.logs, event.data.goals);
    };
    window.addEventListener('storage', onStorage);
    window.addEventListener('message', onMessage);
    void syncFoodLog();
    return () => {
      cancelled = true;
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('message', onMessage);
    };
  }, [user?.dailyCalorieTarget, user?.dailyProteinTarget, user?.dailyWaterTarget]);

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const t = translations[language];

  // Sync theme with HTML document class
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (e) {
      console.warn('Theme storage error', e);
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, newLang);
    } catch (e) {
      console.warn('Language storage error', e);
    }
  };

  const handleLoginSuccess = (newUser: UserProfile) => {
    setUser(newUser);
    if (newUser.theme) {
      setTheme(newUser.theme);
    }
    setDailyIntake(prev => ({
      ...prev,
      targetCalories: newUser.dailyCalorieTarget ?? 0,
      targetProtein: newUser.dailyProteinTarget ?? 0,
      targetWater: newUser.dailyWaterTarget ?? 0,
    }));
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    } catch (e) {
      console.warn('Storage error', e);
    }
  };

  const handleLogout = () => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn('Storage error', e);
    }
  };

  const handleUpdateUser = (updatedUser: UserProfile) => {
    setUser(updatedUser);
    setDailyIntake(prev => ({
      ...prev,
      targetCalories: updatedUser.dailyCalorieTarget,
      targetProtein: updatedUser.dailyProteinTarget,
      targetWater: updatedUser.dailyWaterTarget,
    }));
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
    } catch (e) {
      console.warn('Storage error', e);
    }
  };

  const handleUpdateDailyIntake = (newIntake: DailyIntakeLog) => {
    setDailyIntake(newIntake);
    try {
      localStorage.setItem(INTAKE_STORAGE_KEY, JSON.stringify(newIntake));
    } catch (e) {
      console.warn('Intake storage error', e);
    }
  };

  // If user is not logged in, render the AuthScreen
  if (!user) {
    return (
      <AuthScreen 
        onLoginSuccess={handleLoginSuccess}
        language={language}
        onLanguageChange={handleLanguageChange}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />
    );
  }

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#09110a] text-[#e6f6e1]' : 'bg-[#f7fbf4] text-[#244b25]'} flex transition-colors duration-250`}>
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onLogout={handleLogout}
        language={language}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0 min-h-screen">
        {/* Top Header */}
        <TopHeader
          user={user}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onLogout={handleLogout}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          language={language}
          onLanguageChange={handleLanguageChange}
          theme={theme}
          onToggleTheme={handleToggleTheme}
        />

        {/* Dynamic Views */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl w-full mx-auto">
          {activeTab !== 'dashboard' && (
            <div className="mb-4">
              <button
                onClick={() => setActiveTab('dashboard')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#356d30] dark:text-[#b6f07a] hover:text-[#244b25] dark:hover:text-white bg-white dark:bg-[#121e14] px-3 py-1.5 rounded-xl border border-[#dcebd2] dark:border-[#1d3320] hover:bg-[#eef7e9] dark:hover:bg-[#18271a] transition-all cursor-pointer shadow-2xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{t.backToOverview}</span>
              </button>
            </div>
          )}

          {/* VIEW 1: Main Dashboard (Clean overview: Banner, Metrics, Core 4 Features, Footer) */}
          {activeTab === 'dashboard' && (
            <div>
              {/* Banner */}
              <BannerSection
                onLogMealClick={() => setActiveTab('feature-4')}
                onExploreFeaturesClick={() => {
                  const el = document.getElementById('core-features-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                language={language}
              />

              {/* Key Metrics with 0-start and Live Preset Meal & Hydration Logging */}
              <KeyMetricsGrid 
                user={user} 
                dailyIntake={dailyIntake}
                onUpdateDailyIntake={handleUpdateDailyIntake}
                onUpdateUser={handleUpdateUser}
                language={language} 
              />

              {/* Core 4 Features */}
              <div id="core-features-section">
                <CoreFeaturesGrid
                  onSelectFeature={(featureId) => setActiveTab(featureId)}
                  language={language}
                />
              </div>

              {/* Footer */}
              <footer className="mt-12 pt-6 border-t border-[#dcebd2] dark:border-[#1d3320] flex flex-col sm:flex-row items-center justify-between text-xs text-[#6b8665] dark:text-[#8ea987] gap-3">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-[#356d30] dark:text-[#b6f07a] tracking-wider">{t.brandName}</span>
                  <span>·</span>
                  <span>{t.brandMotto}</span>
                </div>
                <div>
                  {t.footerRights}
                </div>
              </footer>
            </div>
          )}

          {/* VIEW: Feature 1 */}
          {activeTab === 'feature-1' && (
            <div className="space-y-6">
              <Member1FoodScanner language={language} />
            </div>
          )}

          {/* VIEW: Feature 2 */}
          {activeTab === 'feature-2' && (
            <div className="space-y-6">
              <Member2NutritionCoach language={language} />
            </div>
          )}

          {/* VIEW: Feature 3 */}
          {activeTab === 'feature-3' && (
            <div className="space-y-6">
              <Member3BudgetMealPlanner language={language} />
            </div>
          )}

          {/* VIEW: Feature 4 */}
          {activeTab === 'feature-4' && (
            <div className="space-y-6">
              <Member4TrackerAssistant language={language} />
            </div>
          )}

          {/* VIEW: Progress Report (Dedicated view accessible from left sidebar before About & Team) */}
          {activeTab === 'report' && (
            <div className="space-y-6">
              <ReportCard
                user={user}
                dailyIntake={dailyIntake}
                onUpdateDailyIntake={handleUpdateDailyIntake}
                onUpdateUser={handleUpdateUser}
                language={language}
              />
            </div>
          )}

          {/* VIEW: Team & About (Dedicated view accessible from left sidebar) */}
          {activeTab === 'team' && (
            <div className="space-y-6">
              <TeamPanel language={language} />
            </div>
          )}
        </main>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        user={user}
        onUpdateUser={handleUpdateUser}
        language={language}
        onLanguageChange={handleLanguageChange}
        theme={theme}
        onThemeChange={(newTheme) => setTheme(newTheme)}
      />
    </div>
  );
}
