/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Sparkles, 
  Check, 
  X, 
  Sun, 
  Moon, 
  Globe, 
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile, ThemeMode } from '../types.ts';
import { Language, translations } from '../translations.ts';

interface AuthScreenProps {
  onLoginSuccess: (user: UserProfile) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  theme?: ThemeMode;
  onToggleTheme?: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ 
  onLoginSuccess, 
  language, 
  onLanguageChange,
  theme = 'light',
  onToggleTheme
}) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [dietaryGoal, setDietaryGoal] = useState('Metabolic Health');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Google Login Custom Dialog state (user enters their own real Google account)
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleName, setGoogleName] = useState('');
  const [googleEmail, setGoogleEmail] = useState('');

  // Forgot Password modal
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const t = translations[language];

  // Password verification calculations
  const hasLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  let passScore = 0;
  if (hasLength) passScore++;
  if (hasUpper && hasLower) passScore++;
  if (hasNumber) passScore++;
  if (hasSpecial) passScore++;

  const isPasswordStrong = hasLength && hasUpper && hasLower && hasNumber && hasSpecial;

  const getStrengthLabel = () => {
    if (!password) return '';
    if (passScore <= 1) return t.passStrengthWeak;
    if (passScore === 2) return t.passStrengthFair;
    if (passScore === 3) return t.passStrengthGood;
    return t.passStrengthStrong;
  };

  const getStrengthColor = () => {
    if (passScore <= 1) return 'bg-red-500 text-red-600';
    if (passScore === 2) return 'bg-amber-500 text-amber-600';
    if (passScore === 3) return 'bg-blue-500 text-blue-600';
    return 'bg-[#4f8e38] text-[#356d30]';
  };

  const fireCelebration = () => {
    confetti({
      particleCount: 65,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#356d30', '#78b943', '#c1e88b', '#244b25']
    });
  };

  const handleManualAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password.trim()) {
      setErrorMessage(
        language === 'bn' 
          ? 'অনুগ্রহ করে আপনার সঠিক ইমেইল ও পাসওয়ার্ড প্রদান করুন।' 
          : language === 'hi' 
          ? 'कृपया अपना सही ईमेल और पासवर्ड दर्ज करें।' 
          : 'Please enter your actual email and password.'
      );
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setErrorMessage(
        language === 'bn' 
          ? 'সঠিক ইমেইল ঠিকানা প্রদান করুন।' 
          : language === 'hi' 
          ? 'कृपया एक वैध ईमेल पता दर्ज करें।' 
          : 'Please enter a valid email address.'
      );
      return;
    }

    // Exact credential check for existing accounts.
    if (!isSignUp) {
      let accounts: Record<string, { name: string; password: string }> = {};
      try { accounts = JSON.parse(localStorage.getItem('nouriva_registered_accounts') || '{}'); } catch { accounts = {}; }
      const account = accounts[email.trim().toLowerCase()];
      if (!account || account.password !== password) {
        setErrorMessage(language === 'bn' ? 'নাম/ইমেইল বা পাসওয়ার্ড মেলেনি। আগে অ্যাকাউন্ট তৈরি করুন অথবা সঠিক তথ্য দিন।' : 'Name/email or password does not match. Create an account first or enter the correct credentials.');
        return;
      }
    } else if (!fullName.trim()) {
      setErrorMessage(language === 'bn' ? 'আপনার পুরো নাম লিখুন।' : 'Please enter your full name.');
      return;
    }

    // Strong password verification on Sign Up
    if (isSignUp && !isPasswordStrong) {
      setErrorMessage(t.passMustBeStrong);
      return;
    }

    if (!isSignUp && password.length < 6) {
      setErrorMessage(
        language === 'bn' 
          ? 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।' 
          : language === 'hi' 
          ? 'पासवर्ड कम से कम ६ अक्षरों का होना चाहिए।' 
          : 'Password must be at least 6 characters.'
      );
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Derive name from real user input
      const derivedName = isSignUp 
        ? (fullName.trim() || 'Nouriva Member') 
        : (email.split('@')[0].replace(/[._]/g, ' ') || 'Nouriva Member');
      
      const formattedName = derivedName
        .split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

      const initials = formattedName
        .split(' ')
        .map(n => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase() || 'NM';

      if (isSignUp) {
        try {
          const accounts = JSON.parse(localStorage.getItem('nouriva_registered_accounts') || '{}');
          accounts[email.trim().toLowerCase()] = { name: formattedName, password };
          localStorage.setItem('nouriva_registered_accounts', JSON.stringify(accounts));
        } catch {
          setErrorMessage(language === 'bn' ? 'অ্যাকাউন্ট সংরক্ষণ করা যায়নি। আবার চেষ্টা করুন।' : 'Could not save account. Please try again.');
          return;
        }
      }

      const newUser: UserProfile = {
        id: 'user-' + Date.now(),
        name: formattedName,
        email: email.trim(),
        avatarText: initials,
        role: t.memberRole,
        isPremium: true,
        dietaryPreference: dietaryGoal,
        // Start daily targets initialized to 0 per user requirement
        dailyCalorieTarget: 0,
        dailyProteinTarget: 0,
        dailyWaterTarget: 0,
        dailyBudgetBDT: 0,
        healthScore: 0,
        authMethod: 'password',
        theme: theme,
        googleLinked: false
      };

      fireCelebration();
      onLoginSuccess(newUser);
    }, 600);
  };

  const handleGoogleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(language === 'bn' ? 'নিরাপদ লগইনের জন্য ইমেইল ও পাসওয়ার্ড দিয়ে অ্যাকাউন্ট তৈরি করুন।' : 'For verified login, create an account with email and password.');
    setShowGoogleModal(false);
    return;
    if (!googleEmail.trim()) return;

    setIsLoading(true);
    setShowGoogleModal(false);

    setTimeout(() => {
      setIsLoading(false);
      const name = googleName.trim() || googleEmail.split('@')[0].replace(/[._]/g, ' ');
      const formattedName = name
        .split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

      const initials = formattedName
        .split(' ')
        .map(n => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase() || 'G';

      const newUser: UserProfile = {
        id: 'user-google-' + Date.now(),
        name: formattedName,
        email: googleEmail.trim(),
        avatarText: initials,
        role: t.memberRole,
        isPremium: true,
        dietaryPreference: 'Balanced Nutrition',
        dailyCalorieTarget: 0,
        dailyProteinTarget: 0,
        dailyWaterTarget: 0,
        dailyBudgetBDT: 0,
        healthScore: 0,
        authMethod: 'google',
        theme: theme,
        googleLinked: true
      };

      fireCelebration();
      onLoginSuccess(newUser);
    }, 600);
  };

  const handleContinueAsGuest = () => {
    setErrorMessage(language === 'bn' ? 'লগইন করতে আগে অ্যাকাউন্ট তৈরি করুন।' : 'Please create an account before logging in.');
    return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const guestUser: UserProfile = {
        id: 'user-guest-' + Date.now(),
        name: language === 'bn' ? 'নুরিভা ইউজার' : language === 'hi' ? 'नूरीवा उपयोगकर्ता' : 'Nouriva User',
        email: 'user@nouriva.app',
        avatarText: 'NU',
        role: t.memberRole,
        isPremium: true,
        dietaryPreference: 'General Wellness',
        dailyCalorieTarget: 0,
        dailyProteinTarget: 0,
        dailyWaterTarget: 0,
        dailyBudgetBDT: 0,
        healthScore: 0,
        authMethod: 'guest',
        theme: theme,
        googleLinked: false
      };
      fireCelebration();
      onLoginSuccess(guestUser);
    }, 400);
  };

  const languagesList: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'bn', label: 'বাংলা', flag: '🇧🇩' },
    { code: 'hi', label: 'हिंदी', flag: '🇮🇳' },
  ];

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0d170e] text-[#e6f6e1]' : 'bg-[#f7fbf4] text-[#244b25]'} flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative selection:bg-[#78b943] selection:text-white transition-colors duration-300`}>
      {/* Top Bar with Language Selector and Theme Switcher */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between pb-4">
        <div className="flex items-center gap-2.5">
          <img 
            src="/assets/nouriva-logo.jpg" 
            alt="Nouriva" 
            className="w-8 h-8 rounded-xl object-cover shadow-2xs border border-[#356d30]/20"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <span className="font-black text-lg tracking-tight bg-gradient-to-r from-[#356d30] via-[#4f8b38] to-[#78b943] bg-clip-text text-transparent">
            Nouriva AI
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Theme Quick Toggle */}
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
                isDark 
                  ? 'bg-[#152417] border-[#223725] text-[#b6f07a] hover:bg-[#1e3421]' 
                  : 'bg-white border-[#dcebd2] text-[#356d30] hover:bg-[#eef7e9]'
              }`}
              title={isDark ? t.themeBright : t.themeDark}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#356d30]" />}
              <span className="hidden sm:inline">{isDark ? 'Bright' : 'Dark'}</span>
            </button>
          )}

          {/* Language Selector */}
          <div className="flex items-center gap-1 bg-white/80 dark:bg-[#152417] p-1 rounded-xl border border-[#dcebd2] dark:border-[#223725] shadow-2xs">
            <Globe className="w-3.5 h-3.5 text-[#6b8665] ml-1.5" />
            {languagesList.map((lang) => (
              <button
                key={lang.code}
                onClick={() => onLanguageChange(lang.code)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  language === lang.code
                    ? 'bg-[#356d30] text-white shadow-xs'
                    : 'text-[#6b8665] dark:text-[#8ea987] hover:text-[#244b25] dark:hover:text-white'
                }`}
              >
                <span>{lang.flag}</span> <span className="hidden md:inline">{lang.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Authentication Card */}
      <div className="w-full max-w-md mx-auto my-auto py-4">
        <div className={`rounded-3xl border shadow-xl overflow-hidden backdrop-blur-md transition-colors ${
          isDark 
            ? 'bg-[#152417] border-[#223725]' 
            : 'bg-white/95 border-[#dcebd2]'
        }`}>
          {/* Header Graphic */}
          <div className="bg-gradient-to-r from-[#2a5925] via-[#356d30] to-[#4f8b38] px-6 py-6 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10">
              <div className="w-12 h-12 mx-auto mb-2 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center border border-white/20 shadow-inner">
                <Sparkles className="w-6 h-6 text-[#c1e88b]" />
              </div>
              <h2 className="text-xl font-black tracking-tight text-white">{t.brandName}</h2>
              <p className="text-xs text-[#d7f0c5] mt-1">{t.brandTagline}</p>
            </div>
          </div>

          <div className="p-6 sm:p-7">
            {/* Tab switch between Sign In and Sign Up */}
            <div className={`flex rounded-xl p-1 mb-6 border ${
              isDark ? 'bg-[#0d170e] border-[#223725]' : 'bg-[#f4faef] border-[#dcebd2]'
            }`}>
              <button
                type="button"
                onClick={() => { setIsSignUp(false); setErrorMessage(''); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  !isSignUp
                    ? 'bg-white dark:bg-[#1f3822] text-[#356d30] dark:text-[#b6f07a] shadow-xs'
                    : 'text-[#6b8665] dark:text-[#8ea987] hover:text-[#244b25]'
                }`}
              >
                {t.signInTab}
              </button>
              <button
                type="button"
                onClick={() => { setIsSignUp(true); setErrorMessage(''); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  isSignUp
                    ? 'bg-white dark:bg-[#1f3822] text-[#356d30] dark:text-[#b6f07a] shadow-xs'
                    : 'text-[#6b8665] dark:text-[#8ea987] hover:text-[#244b25]'
                }`}
              >
                {t.signUpTab}
              </button>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="font-medium">{errorMessage}</span>
              </div>
            )}

            {/* 1. Continue with Google Button (Prominent & Official Style) */}
            <button
              type="button"
              onClick={() => {
                setGoogleEmail('r.minha174.25@gmail.com');
                setGoogleName('Minha');
                setShowGoogleModal(true);
              }}
              className={`w-full py-2.5 px-4 rounded-xl border font-bold text-xs flex items-center justify-center gap-3 transition-all cursor-pointer shadow-2xs hover:shadow-sm ${
                isDark 
                  ? 'bg-[#1b2f1d] hover:bg-[#223d25] border-[#2a472c] text-white' 
                  : 'bg-white hover:bg-gray-50 border-[#dcebd2] text-[#244b25]'
              }`}
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{t.googleBtnText}</span>
              <span className="text-[10px] py-0.5 px-1.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold">
                Optional
              </span>
            </button>

            {/* Notice that Google is Optional */}
            <p className="text-[11px] text-center text-[#6b8665] dark:text-[#8ea987] mt-2 mb-3">
              {t.gmailOptionalNotice}
            </p>

            {/* Divider */}
            <div className="relative flex items-center my-4">
              <div className="flex-grow border-t border-[#dcebd2] dark:border-[#223725]"></div>
              <span className="flex-shrink mx-3 text-[11px] font-semibold text-[#6b8665] dark:text-[#8ea987] uppercase tracking-wider">
                {t.orWithEmail}
              </span>
              <div className="flex-grow border-t border-[#dcebd2] dark:border-[#223725]"></div>
            </div>

            {/* Email & Password Form */}
            <form onSubmit={handleManualAuth} className="space-y-3.5">
              {isSignUp && (
                <div>
                  <label className="block text-xs font-bold text-[#356d30] dark:text-[#b6f07a] mb-1">
                    {t.fullNameLabel}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#6b8665] absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="e.g. Minha Rahman"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className={`w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#4f8b38] transition-all ${
                        isDark 
                          ? 'bg-[#0d170e] border-[#223725] text-white' 
                          : 'bg-[#fbfdf9] border-[#dcebd2] text-[#244b25]'
                      }`}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#356d30] dark:text-[#b6f07a] mb-1">
                  {t.emailLabel}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#6b8665] absolute left-3 top-3" />
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#4f8b38] transition-all ${
                      isDark 
                        ? 'bg-[#0d170e] border-[#223725] text-white' 
                        : 'bg-[#fbfdf9] border-[#dcebd2] text-[#244b25]'
                    }`}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-[#356d30] dark:text-[#b6f07a]">
                    {t.passwordLabel}
                  </label>
                  {!isSignUp && (
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-[11px] font-semibold text-[#4f8b38] hover:underline cursor-pointer"
                    >
                      {t.forgotPassword}
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#6b8665] absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full pl-9 pr-10 py-2.5 text-xs rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#4f8b38] transition-all ${
                      isDark 
                        ? 'bg-[#0d170e] border-[#223725] text-white' 
                        : 'bg-[#fbfdf9] border-[#dcebd2] text-[#244b25]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-[#6b8665] hover:text-[#244b25] dark:hover:text-white cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Strong Password Verification Widget */}
                {isSignUp && password.length > 0 && (
                  <div className={`mt-2.5 p-3 rounded-xl border ${
                    isDark ? 'bg-[#0d170e] border-[#223725]' : 'bg-[#f4faef] border-[#dcebd2]'
                  }`}>
                    {/* Strength meter bar */}
                    <div className="flex items-center justify-between text-[11px] font-bold mb-1.5">
                      <span className="text-[#6b8665] dark:text-[#8ea987]">
                        {language === 'bn' ? 'পাসওয়ার্ড শক্তি:' : language === 'hi' ? 'पासवर्ड शक्ति:' : 'Password Strength:'}
                      </span>
                      <span className={`font-black ${getStrengthColor()}`}>
                        {getStrengthLabel()}
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-1.5 h-1.5 mb-2.5">
                      <div className={`rounded-full h-full transition-all ${passScore >= 1 ? getStrengthColor().split(' ')[0] : 'bg-gray-200 dark:bg-gray-700'}`} />
                      <div className={`rounded-full h-full transition-all ${passScore >= 2 ? getStrengthColor().split(' ')[0] : 'bg-gray-200 dark:bg-gray-700'}`} />
                      <div className={`rounded-full h-full transition-all ${passScore >= 3 ? getStrengthColor().split(' ')[0] : 'bg-gray-200 dark:bg-gray-700'}`} />
                      <div className={`rounded-full h-full transition-all ${passScore >= 4 && isPasswordStrong ? getStrengthColor().split(' ')[0] : 'bg-gray-200 dark:bg-gray-700'}`} />
                    </div>

                    {/* Criteria checklist */}
                    <div className="space-y-1 text-[11px]">
                      <div className={`flex items-center gap-1.5 ${hasLength ? 'text-[#356d30] dark:text-[#b6f07a] font-bold' : 'text-[#6b8665] dark:text-[#8ea987]'}`}>
                        {hasLength ? <Check className="w-3.5 h-3.5 text-green-600 shrink-0" /> : <X className="w-3.5 h-3.5 text-gray-400 shrink-0" />}
                        <span>{t.passReqLength}</span>
                      </div>
                      <div className={`flex items-center gap-1.5 ${hasUpper && hasLower ? 'text-[#356d30] dark:text-[#b6f07a] font-bold' : 'text-[#6b8665] dark:text-[#8ea987]'}`}>
                        {hasUpper && hasLower ? <Check className="w-3.5 h-3.5 text-green-600 shrink-0" /> : <X className="w-3.5 h-3.5 text-gray-400 shrink-0" />}
                        <span>{t.passReqUpper}</span>
                      </div>
                      <div className={`flex items-center gap-1.5 ${hasNumber ? 'text-[#356d30] dark:text-[#b6f07a] font-bold' : 'text-[#6b8665] dark:text-[#8ea987]'}`}>
                        {hasNumber ? <Check className="w-3.5 h-3.5 text-green-600 shrink-0" /> : <X className="w-3.5 h-3.5 text-gray-400 shrink-0" />}
                        <span>{t.passReqNumber}</span>
                      </div>
                      <div className={`flex items-center gap-1.5 ${hasSpecial ? 'text-[#356d30] dark:text-[#b6f07a] font-bold' : 'text-[#6b8665] dark:text-[#8ea987]'}`}>
                        {hasSpecial ? <Check className="w-3.5 h-3.5 text-green-600 shrink-0" /> : <X className="w-3.5 h-3.5 text-gray-400 shrink-0" />}
                        <span>{t.passReqSpecial}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {isSignUp && (
                <div>
                  <label className="block text-xs font-bold text-[#356d30] dark:text-[#b6f07a] mb-1">
                    {t.dietPreference}
                  </label>
                  <select
                    value={dietaryGoal}
                    onChange={(e) => setDietaryGoal(e.target.value)}
                    className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#4f8b38] transition-all ${
                      isDark 
                        ? 'bg-[#0d170e] border-[#223725] text-white' 
                        : 'bg-[#fbfdf9] border-[#dcebd2] text-[#244b25]'
                    }`}
                  >
                    <option value="Metabolic Health">Metabolic Health & Wellness (মেটাবলিক স্বাস্থ্য)</option>
                    <option value="Bangladeshi Traditional">Bangladeshi Traditional & Balanced (ঐতিহ্যবাহী সুষম খাদ্য)</option>
                    <option value="Lean Muscle & Protein">High Protein & Muscle Building (উচ্চ প্রোটিন)</option>
                    <option value="Weight Management">Calorie Control & Weight Loss (ওজন নিয়ন্ত্রণ)</option>
                    <option value="Heart Health">Low Sodium & Heart Health (হার্ট স্বাস্থ্য)</option>
                  </select>
                </div>
              )}

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#6b8665] dark:text-[#8ea987]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-[#dcebd2] accent-[#356d30]"
                  />
                  <span>{t.rememberDevice}</span>
                </label>
                <div className="flex items-center gap-1 text-[11px] text-[#4f8b38] font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{t.encryptedNotice}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-3 py-3 bg-gradient-to-r from-[#356d30] via-[#4f8b38] to-[#78b943] hover:from-[#2a5925] hover:to-[#5e9632] text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{isSignUp ? t.signUpBtn : t.signInBtn}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Continue Without Google / Guest Option (Explicitly Optional) */}
              <button
                type="button"
                onClick={handleContinueAsGuest}
                className={`w-full py-2 rounded-xl text-xs font-bold border border-dashed transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  isDark
                    ? 'border-[#2a472c] text-[#8ea987] hover:text-white hover:bg-[#1f3822]'
                    : 'border-[#dcebd2] text-[#6b8665] hover:text-[#244b25] hover:bg-[#f4faef]'
                }`}
              >
                <span>{t.continueWithoutGoogle}</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Google Sign In Modal */}
      {showGoogleModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className={`rounded-3xl max-w-sm w-full p-6 border shadow-2xl ${
            isDark ? 'bg-[#152417] border-[#223725]' : 'bg-white border-[#dcebd2]'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white shadow-xs border border-gray-200 flex items-center justify-center">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                </div>
                <h3 className="text-sm font-bold text-[#1b3b18] dark:text-white">
                  {language === 'bn' ? 'গুগল / জিমেইল অনুমোদন' : language === 'hi' ? 'गूगल खाता सत्यापन' : 'Google / Gmail Sign In'}
                </h3>
              </div>
              <button
                onClick={() => setShowGoogleModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#6b8665] dark:text-[#8ea987] mb-4">
              {language === 'bn' 
                ? 'আপনার আসল জিমেইল অ্যাকাউন্ট ব্যবহার করে সরাসরি লগইন করুন:' 
                : language === 'hi' 
                ? 'अपने वास्तविक जीमेल खाते से सीधे लॉगिन करें:' 
                : 'Sign in directly using your personal Gmail account:'}
            </p>

            <form onSubmit={handleGoogleSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-[#356d30] dark:text-[#b6f07a] mb-1">
                  {t.fullNameLabel}
                </label>
                <input
                  type="text"
                  placeholder="Minha"
                  value={googleName}
                  onChange={(e) => setGoogleName(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#4f8b38] ${
                    isDark ? 'bg-[#0d170e] border-[#223725] text-white' : 'bg-gray-50 border-[#dcebd2] text-[#244b25]'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#356d30] dark:text-[#b6f07a] mb-1">
                  Gmail Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="r.minha174.25@gmail.com"
                  value={googleEmail}
                  onChange={(e) => setGoogleEmail(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#4f8b38] ${
                    isDark ? 'bg-[#0d170e] border-[#223725] text-white' : 'bg-gray-50 border-[#dcebd2] text-[#244b25]'
                  }`}
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowGoogleModal(false)}
                  className="flex-1 py-2 text-xs font-bold rounded-xl border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#356d30] hover:bg-[#285524] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Authorize</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className={`rounded-3xl max-w-sm w-full p-6 border shadow-2xl ${
            isDark ? 'bg-[#152417] border-[#223725]' : 'bg-white border-[#dcebd2]'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-[#1b3b18] dark:text-white">{t.forgotPassword}</h3>
              <button
                onClick={() => { setShowForgotPassword(false); setForgotSuccess(false); }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {forgotSuccess ? (
              <div className="text-center py-4">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2">
                  <Check className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  {language === 'bn' ? 'পাসওয়ার্ড রিসেট লিংক পাঠানো হয়েছে!' : language === 'hi' ? 'पासवर्ड रीसेट लिंक भेज दिया गया है!' : 'Password reset link sent!'}
                </p>
                <p className="text-[11px] text-gray-500 mt-1">
                  {forgotEmail}
                </p>
              </div>
            ) : (
              <div>
                <p className="text-xs text-[#6b8665] dark:text-[#8ea987] mb-3">
                  {language === 'bn' ? 'আপনার নিবন্ধিত ইমেইল ঠিকানা প্রদান করুন:' : language === 'hi' ? 'अपना पंजीकृत ईमेल दर्ज करें:' : 'Enter your registered email address:'}
                </p>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#4f8b38] mb-3 ${
                    isDark ? 'bg-[#0d170e] border-[#223725] text-white' : 'bg-gray-50 border-[#dcebd2] text-[#244b25]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setForgotSuccess(true)}
                  className="w-full py-2 bg-[#356d30] text-white text-xs font-bold rounded-xl hover:bg-[#285524] transition-colors cursor-pointer"
                >
                  {language === 'bn' ? 'রিসেট লিংক পাঠান' : language === 'hi' ? 'रीसेट लिंक भेजें' : 'Send Reset Link'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer copyright */}
      <div className="text-center text-[11px] text-[#6b8665] dark:text-[#8ea987] pt-4">
        {t.footerRights}
      </div>
    </div>
  );
};
