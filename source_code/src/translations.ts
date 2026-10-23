export type Language = 'en' | 'bn' | 'hi';

export interface Translations {
  // Brand
  brandName: string;
  brandTagline: string;
  brandMotto: string;
  
  // Navigation
  navOverview: string;
  navFeature1: string;
  navFeature2: string;
  navFeature3: string;
  navFeature4: string;
  navReport: string;
  navTeam: string;
  navSettings: string;
  navLogout: string;

  // Header
  searchPlaceholder: string;
  notificationsTitle: string;
  markAllRead: string;
  memberRole: string;
  downloadZip: string;

  // Banner
  bannerBadge: string;
  bannerTitle: string;
  bannerSubtitle: string;
  logMealBtn: string;
  exploreFeaturesBtn: string;
  bannerPill: string;

  // Metrics
  calTarget: string;
  calAchieved: string;
  calLeft: string;
  proteinTitle: string;
  proteinLeft: string;
  hydrationTitle: string;
  hydrationLeft: string;
  addWaterBtn: string;
  healthScoreTitle: string;
  healthScoreSub: string;
  optimalBadge: string;

  // Core Features
  featuresHeading: string;
  featuresSubtitle: string;
  featuresBadge: string;
  openFeatureBtn: string;
  whatIncluded: string;
  hideDetails: string;

  // Feature 1
  f1Title: string;
  f1Desc: string;
  f1Bullets: string[];
  f1Details: string[];

  // Feature 2
  f2Title: string;
  f2Desc: string;
  f2Bullets: string[];
  f2Details: string[];

  // Feature 3
  f3Title: string;
  f3Desc: string;
  f3Bullets: string[];
  f3Details: string[];

  // Feature 4
  f4Title: string;
  f4Desc: string;
  f4Bullets: string[];
  f4Details: string[];

  // Team & About
  aboutTitle: string;
  aboutSubtitle: string;
  developedBy: string;
  teamMembers: { name: string; role: string; feature: string }[];
  projectMission: string;

  // Settings
  settingsTitle: string;
  settingsSubtitle: string;
  tabProfile: string;
  tabGoals: string;
  tabLanguage: string;
  tabAppearance: string;
  displayName: string;
  emailLabel: string;
  dietPreference: string;
  saveSettings: string;
  savedToast: string;
  selectLanguage: string;

  // Theme
  themeModeLabel: string;
  themeBright: string;
  themeDark: string;
  themeDescription: string;

  // Password verification
  passStrengthWeak: string;
  passStrengthFair: string;
  passStrengthGood: string;
  passStrengthStrong: string;
  passReqLength: string;
  passReqUpper: string;
  passReqNumber: string;
  passReqSpecial: string;
  passMustBeStrong: string;

  // Gmail / Google optional
  gmailOptionalNotice: string;
  continueWithGoogle: string;
  continueWithoutGoogle: string;
  googleConnectTitle: string;
  googleConnected: string;
  googleNotConnected: string;
  connectGoogleBtn: string;
  disconnectGoogleBtn: string;

  // 0-start & Intake
  setupGoalsTitle: string;
  setupGoalsSubtitle: string;
  quickLogMeal: string;
  resetToZero: string;
  resetZeroConfirm: string;
  zeroStartBadge: string;
  selectPresetMeal: string;

  // Report Card (Weekly & Monthly)
  reportCardTitle: string;
  reportCardSubtitle: string;
  weeklyView: string;
  monthlyView: string;
  adherenceScore: string;
  totalLogged: string;
  avgProteinPerDay: string;
  avgHydrationPerDay: string;
  reportConsistencyBadge: string;
  todayRealtimeUpdate: string;

  // Auth Screen
  signInTab: string;
  signUpTab: string;
  googleBtnText: string;
  orWithEmail: string;
  fullNameLabel: string;
  passwordLabel: string;
  forgotPassword: string;
  rememberDevice: string;
  encryptedNotice: string;
  signInBtn: string;
  signUpBtn: string;
  footerRights: string;

  // Feature components internal
  backToOverview: string;
  portionGrams: string;
  searchFoodPlaceholder: string;
  scanPhotoBtn: string;
  scanningText: string;
  nutritionBreakdown: string;
  estimatedEnergy: string;
  primaryGoalLabel: string;
  activityLevelLabel: string;
  foodStyleLabel: string;
  generateCoachBtn: string;
  coachInsightTitle: string;
  targetDailyBudget: string;
  householdPersons: string;
  mealTimelineTitle: string;
  addMealBtn: string;
  conversationalAITitle: string;
  askPlaceholder: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    brandName: 'Nouriva AI',
    brandTagline: 'Smarter Food · Healthier You',
    brandMotto: 'Good Food · Good Health · Better Future',

    navOverview: 'Overview',
    navFeature1: 'AI Food Scanner',
    navFeature2: 'AI Nutrition Coach',
    navFeature3: 'Budget Meal Planner',
    navFeature4: 'Nutrition Tracker',
    navReport: 'Progress Report',
    navTeam: 'About & Team',
    navSettings: 'Settings',
    navLogout: 'Sign Out',

    searchPlaceholder: 'Search health metrics, recipes, or foods...',
    notificationsTitle: 'Notifications',
    markAllRead: 'Mark all read',
    memberRole: 'Verified Member',
    downloadZip: 'Download Project ZIP',

    bannerBadge: 'AI Powered Insights',
    bannerTitle: 'Personalized Health & Nutrition Portal',
    bannerSubtitle: 'Track macros, analyze metabolic indicators, and optimize daily meal plans with real-time AI guidance.',
    logMealBtn: "Log Today's Meal",
    exploreFeaturesBtn: 'Explore 4 Core Features',
    bannerPill: 'Small Steps → Big Changes',

    calTarget: 'Daily Calorie Target',
    calAchieved: 'achieved today',
    calLeft: 'kcal left',
    proteinTitle: 'Protein Intake',
    proteinLeft: 'remaining',
    hydrationTitle: 'Hydration Level',
    hydrationLeft: 'to target',
    addWaterBtn: '+250ml',
    healthScoreTitle: 'Metabolic Health Score',
    healthScoreSub: '+4% from last week',
    optimalBadge: 'Optimal',

    featuresHeading: 'Core Nutrition & Wellness Features',
    featuresSubtitle: 'Explore our 4 dedicated health & nutrition programs developed by the Nouriva team.',
    featuresBadge: 'Features',
    openFeatureBtn: 'Open Feature Module',
    whatIncluded: 'What this feature includes',
    hideDetails: 'Hide Details',

    f1Title: 'AI Food & Health Scanner',
    f1Desc: 'Food identification, nutrition analysis, portion estimation, and food-label scanning with instant macro breakdown.',
    f1Bullets: [
      'Food name & quantity input with portion scale',
      'Instant estimated calories, protein, carbs & fat',
      'Food image & nutrition label scanning'
    ],
    f1Details: [
      'Enter food name and serving quantity in grams.',
      'View estimated calories, protein, carbohydrates, and fat.',
      'Optionally scan a food image or camera nutrition label.',
      'Review an easy-to-read nutrition summary and daily percentage.'
    ],

    f2Title: 'Personalized AI Nutrition Coach',
    f2Desc: 'Profile-based suggestions using goals, food preferences, activity, and lifestyle context.',
    f2Bullets: [
      'User profile and dietary preferences input',
      'Personalized food suggestions tailored to lifestyle',
      'General, non-medical wellness guidance'
    ],
    f2Details: [
      'Set your profile with fitness goals and food preferences.',
      'Include daily activity level and lifestyle context.',
      'Receive personalized meal and nutrition suggestions.',
      'Get general wellness guidance (not medical diagnosis).'
    ],

    f3Title: 'Budget-Aware AI Meal Planner',
    f3Desc: 'Affordable daily or weekly meal plans using local Bangladeshi foods and available ingredients.',
    f3Bullets: [
      'Budget in Bangladeshi Taka (৳ BDT) & ingredients',
      'Estimated meal costs and grocery calculations',
      'Shopping list and smart affordable substitutions'
    ],
    f3Details: [
      'Enter a daily or weekly food budget in BDT (৳).',
      'Plan meals around familiar Bangladeshi staples (Rice, Daal, Rui, Shak).',
      'See realistic estimated costs for planned meals.',
      'Get a shopping list and affordable ingredient substitutions.'
    ],

    f4Title: 'Nutrition Tracker & Food Assistant',
    f4Desc: 'Daily food logging, nutrition summaries, food history, and a conversational food assistant.',
    f4Bullets: [
      'Meals and snacks log timeline',
      'Daily nutrition progress summaries',
      'Conversational AI food assistant chat'
    ],
    f4Details: [
      'Log meals and snacks throughout the day.',
      'Review daily nutrition progress and caloric summaries.',
      'Look back at historical food logs.',
      'Ask food and nutrition questions in an interactive chat interface.'
    ],

    aboutTitle: 'About Nouriva',
    aboutSubtitle: 'Better Food · Better Health · Brighter Future',
    developedBy: 'Developed By',
    teamMembers: [
      { name: 'Jannatul Ferdous Jenny', role: 'Feature 1 Specialist', feature: 'AI Food & Health Scanner' },
      { name: 'Asma Bintay Arif', role: 'Feature 2 Specialist', feature: 'Personalized AI Nutrition Coach' },
      { name: 'Saifa Tahsin', role: 'Feature 3 Specialist', feature: 'Budget-Aware AI Meal Planner' },
      { name: 'Tahsin Saba Aroby', role: 'Feature 4 Specialist', feature: 'Nutrition Tracker & Food Assistant' }
    ],
    projectMission: 'Nouriva is designed to bridge scientific nutrition intelligence with everyday lifestyles, empowering healthier choices through smart automation, cultural food integration, and accessible healthy living.',

    settingsTitle: 'Nouriva Settings',
    settingsSubtitle: 'Personalize your preferences, health goals, and appearance',
    tabProfile: 'Profile & Account',
    tabGoals: 'Health & Targets',
    tabLanguage: 'Language / ভাষা / भाषा',
    tabAppearance: 'Appearance & Theme',
    displayName: 'Display Name',
    emailLabel: 'Email / Gmail',
    dietPreference: 'Dietary Protocol & Cultural Preference',
    saveSettings: 'Save Settings',
    savedToast: 'Saved Successfully!',
    selectLanguage: 'Choose Application Language',

    themeModeLabel: 'Screen Display Mode',
    themeBright: 'Bright Mode (Light)',
    themeDark: 'Dark Mode (Night)',
    themeDescription: 'Switch between refreshing bright daylight theme and relaxing high-contrast dark green mode.',

    passStrengthWeak: 'Weak Password',
    passStrengthFair: 'Fair Password',
    passStrengthGood: 'Good Password',
    passStrengthStrong: 'Strong Password',
    passReqLength: 'At least 8 characters',
    passReqUpper: 'At least 1 uppercase & lowercase letter',
    passReqNumber: 'At least 1 number (0-9)',
    passReqSpecial: 'At least 1 special character (!@#$%^&*)',
    passMustBeStrong: 'Password must be strong before continuing (meet all requirements).',

    gmailOptionalNotice: 'Google / Gmail access is optional. You can sign in with Gmail or continue without it.',
    continueWithGoogle: 'Continue with Google / Gmail',
    continueWithoutGoogle: 'Continue without Google (Optional)',
    googleConnectTitle: 'Google Account Connection',
    googleConnected: 'Connected to Google',
    googleNotConnected: 'Not connected (Optional)',
    connectGoogleBtn: 'Connect Google / Gmail',
    disconnectGoogleBtn: 'Disconnect Google',

    setupGoalsTitle: 'Daily Nutrition & Macro Intake',
    setupGoalsSubtitle: 'Values start at 0 until you log or select your daily nutrition plan.',
    quickLogMeal: 'Quick Log Food / Water',
    resetToZero: 'Reset Intake to 0',
    resetZeroConfirm: 'Are you sure you want to reset today\'s logged calories, protein, and water to 0?',
    zeroStartBadge: 'Starts at 0 · Log to update',
    selectPresetMeal: 'Select Bangladeshi Meal / Quick Entry',

    reportCardTitle: 'Weekly & Monthly Progress Report Card',
    reportCardSubtitle: 'Real-time adherence report that automatically updates whenever you log today\'s meals and hydration.',
    weeklyView: 'Weekly View (7 Days)',
    monthlyView: 'Monthly View (4 Weeks)',
    adherenceScore: 'Target Adherence',
    totalLogged: 'Total Calories Logged',
    avgProteinPerDay: 'Avg Protein / Day',
    avgHydrationPerDay: 'Avg Hydration / Day',
    reportConsistencyBadge: 'High Consistency',
    todayRealtimeUpdate: 'Updates live with daily inputs',

    signInTab: 'Sign In / Login',
    signUpTab: 'Create Account',
    googleBtnText: 'Continue with Google',
    orWithEmail: 'Or with Email',
    fullNameLabel: 'Full Name',
    passwordLabel: 'Password',
    forgotPassword: 'Forgot password?',
    rememberDevice: 'Remember this device',
    encryptedNotice: '256-bit Encrypted',
    signInBtn: 'Sign In to Dashboard',
    signUpBtn: 'Create My Account',
    footerRights: '© 2026 Nouriva AI Health Technologies. All rights reserved.',

    backToOverview: 'Back to Overview Dashboard',
    portionGrams: 'Adjust Portion Serving (Grams)',
    searchFoodPlaceholder: 'Search e.g. Bhaat, Rui Fish, Daal, Egg...',
    scanPhotoBtn: 'Simulate AI Scan',
    scanningText: 'Scanning Meal...',
    nutritionBreakdown: 'Nutrition Breakdown',
    estimatedEnergy: 'Estimated Energy',
    primaryGoalLabel: 'Primary Health & Body Goal',
    activityLevelLabel: 'Weekly Activity Level',
    foodStyleLabel: 'Food & Cultural Style',
    generateCoachBtn: 'Generate Personalized Coaching',
    coachInsightTitle: 'Nouriva AI Coach Insight',
    targetDailyBudget: 'Target Daily Budget Per Person',
    householdPersons: 'Number of Household Persons',
    mealTimelineTitle: "Today's Meal Timeline",
    addMealBtn: 'Log Meal',
    conversationalAITitle: 'Conversational AI Assistant',
    askPlaceholder: 'Ask e.g. Calories in 1 cup of Daal?'
  },

  bn: {
    brandName: 'নুরিভা এআই (Nouriva AI)',
    brandTagline: 'উন্নত খাদ্য · সুস্থ জীবন',
    brandMotto: 'ভালো খাবার · ভালো স্বাস্থ্য · সুন্দর ভবিষ্যৎ',

    navOverview: 'ড্যাশবোর্ড',
    navFeature1: 'এআই ফুড স্ক্যানার',
    navFeature2: 'এআই নিউট্রিশন কোচ',
    navFeature3: 'বাজেট মিল প্ল্যানার',
    navFeature4: 'নিউট্রিশন ট্র্যাকার',
    navReport: 'অগ্রগতি রিপোর্ট',
    navTeam: 'আমাদের সম্পর্কে ও টিম',
    navSettings: 'সেটিংস',
    navLogout: 'লগআউট',

    searchPlaceholder: 'পুষ্টি তথ্য, রেসিপি বা খাবার খুঁজুন...',
    notificationsTitle: 'বিজ্ঞপ্তি',
    markAllRead: 'সব পঠিত হিসেবে চিহ্নিত করুন',
    memberRole: 'যাচাইকৃত সদস্য',
    downloadZip: 'প্রজেক্ট ZIP ডাউনলোড করুন',

    bannerBadge: 'এআই চালিত পুষ্টি নির্দেশনা',
    bannerTitle: 'ব্যক্তিগত স্বাস্থ্য ও পুষ্টি পোর্টাল',
    bannerSubtitle: 'ম্যাক্রো ট্র্যাক করুন, শারীরিক সূচক বিশ্লেষণ করুন এবং এআই নির্দেশনায় প্রতিদিনের স্বাস্থ্যকর খাবার নির্বাচন করুন।',
    logMealBtn: 'আজকের খাবার লগ করুন',
    exploreFeaturesBtn: '৪টি মূল ফিচার দেখুন',
    bannerPill: 'ছোট অভ্যাস → বড় পরিবর্তন',

    calTarget: 'দৈনিক ক্যালোরি লক্ষ্যমাত্রা',
    calAchieved: 'আজকের অর্জিত',
    calLeft: 'ক্যালোরি বাকি',
    proteinTitle: 'প্রোটিন গ্রহণ',
    proteinLeft: 'বাকি রয়েছে',
    hydrationTitle: 'পানির পরিমাণ',
    hydrationLeft: 'লক্ষ্যমাত্রায় বাকি',
    addWaterBtn: '+২৫০ মিলি',
    healthScoreTitle: 'মেটাবলিক হেলথ স্কোর',
    healthScoreSub: 'গত সপ্তাহ থেকে +৪%',
    optimalBadge: 'উত্তম',

    featuresHeading: 'মূল পুষ্টি ও স্বাস্থ্য ফিচারসমূহ',
    featuresSubtitle: 'নুরিভা টিমের তৈরি ৪টি বিশেষ স্বাস্থ্য ও পুষ্টি প্রোগ্রাম অন্বেষণ করুন।',
    featuresBadge: 'ফিচার',
    openFeatureBtn: 'ফিচার ওপেন করুন',
    whatIncluded: 'এই ফিচারে যা যা রয়েছে',
    hideDetails: 'বিবরণ লুকান',

    f1Title: 'এআই ফুড ও হেলথ স্ক্যানার',
    f1Desc: 'খাবার শনাক্তকরণ, পুষ্টি উপাদান বিশ্লেষণ, সঠিক পরিমাপ এবং খাবারের লেবেল স্ক্যানিং।',
    f1Bullets: [
      'খাবারের নাম ও ওজনের পরিমাণ নির্বাচন',
      'তাৎক্ষণিক ক্যালোরি, প্রোটিন, কার্ব ও ফ্যাট হিসাব',
      'খাবারের ছবি ও পুষ্টি লেবেল স্ক্যান করার সুবিধা'
    ],
    f1Details: [
      'খাবারের নাম এবং গ্রাম অনুযায়ী পরিমাণ লিখুন।',
      'আনুমানিক ক্যালোরি, প্রোটিন, শর্করা ও চর্বি দেখতে পাবেন।',
      'খাবারের ছবি বা নিউট্রিশন লেবেল স্ক্যান করতে পারবেন।',
      'সহজবোধ্য পুষ্টি সারাংশ ও দৈনিক চাহিদার শতাংশ জানুন।'
    ],

    f2Title: 'ব্যক্তিগত এআই নিউট্রিশন কোচ',
    f2Desc: 'আপনার শারীরিক লক্ষ্য, খাদ্যাভ্যাস এবং জীবনযাত্রার ওপর ভিত্তি করে ব্যক্তিগত পরামর্শ।',
    f2Bullets: [
      'ব্যবহারকারীর স্বাস্থ্য লক্ষ্য ও খাদ্যাভ্যাস ইনপুট',
      'জীবনযাত্রার সঙ্গে মানানসই স্বাস্থ্যকর খাবারের পরামর্শ',
      'সাধারণ ও অমূল্য স্বাস্থ্য ও ওয়েলনেস গাইডলাইন'
    ],
    f2Details: [
      'ওজন হ্রাস, পেশী গঠন বা সাধারণ সুস্থতার লক্ষ্য নির্ধারণ করুন।',
      'দৈনিক অ্যাক্টিভিটি লেভেল ও খাদ্যাভ্যাস যুক্ত করুন।',
      'বাংলাদেশি খাবারের সাথে মানানসই ডায়েট চার্ট পান।',
      'দৈনন্দিন জীবনযাত্রার জন্য প্রয়োজনীয় পুষ্টি পরামর্শ পান।'
    ],

    f3Title: 'বাজেট-সচেতন এআই মিল প্ল্যানার',
    f3Desc: 'পরিচিত বাংলাদেশি খাবার ও সহজলভ্য উপাদান দিয়ে সাশ্রয়ী দৈনিক ও সাপ্তাহিক খাদ্য পরিকল্পনা।',
    f3Bullets: [
      'বাংলাদেশি টাকা (৳) অনুযায়ী বাজেট নির্ধারণ',
      'খাবারের আনুমানিক খরচ ও বাজার হিসাব',
      'বাজারের তালিকা এবং সাশ্রয়ী বিকল্প খাবারের পরামর্শ'
    ],
    f3Details: [
      'দৈনিক বা সাপ্তাহিক খাদ্য বাজেট (৳) নির্ধারণ করুন।',
      'ভাত, ডাল, রুই মাছ, ডিম ও শাক দিয়ে পুষ্টিকর মিল প্ল্যান করুন।',
      'প্রতিটি খাবারের আনুমানিক খরচ দেখুন।',
      'পুষ্টি ঠিক রেখে কম খরচের বিকল্প উপাদানের পরামর্শ নিন।'
    ],

    f4Title: 'নিউট্রিশন ট্র্যাকার ও ফুড অ্যাসিস্ট্যান্ট',
    f4Desc: 'প্রতিদিনের খাবারের হিসাব, পুষ্টির অগ্রগতি ও এআই ফুড চ্যাট সহকারী।',
    f4Bullets: [
      'সকালের নাস্তা, দুপুর ও রাতের খাবারের টাইমলাইন',
      'দৈনিক পুষ্টি গ্রহণের পরিসংখ্যান ও সারাংশ',
      'পুষ্টি বিষয়ক প্রশ্নের জন্য এআই চ্যাট সহকারী'
    ],
    f4Details: [
      'সারাদিনের খাবার ও জলখাবার সহজে সংরক্ষণ করুন।',
      'দৈনিক পুষ্টির অগ্রগতি ও ক্যালোরির হিসাব পর্যালোচনা করুন।',
      'পূর্বের খাবারের ইতিহাস দেখতে পারবেন।',
      'যেকোনো খাবারের পুষ্টিগুণ নিয়ে চ্যাটে সরাসরি প্রশ্ন করুন।'
    ],

    aboutTitle: 'নুরিভা সম্পর্কে',
    aboutSubtitle: 'ভালো খাবার · ভালো স্বাস্থ্য · সুন্দর ভবিষ্যৎ',
    developedBy: 'নির্মাতা টিম (Developed By)',
    teamMembers: [
      { name: 'জান্নাতুল ফেরদৌস জেনী (Jannatul Ferdous Jenny)', role: 'ফিচার ১ স্পেশালিস্ট', feature: 'এআই ফুড ও হেলথ স্ক্যানার' },
      { name: 'আসমা বিনতে আরিফ (Asma Bintay Arif)', role: 'ফিচার ২ স্পেশালিস্ট', feature: 'ব্যক্তিগত এআই নিউট্রিশন কোচ' },
      { name: 'সাইফা তাহসিন (Saifa Tahsin)', role: 'ফিচার ৩ স্পেশালিস্ট', feature: 'বাজেট-সচেতন এআই মিল প্ল্যানার' },
      { name: 'তাহসিন সাবা আরবী (Tahsin Saba Aroby)', role: 'ফিচার ৪ স্পেশালিস্ট', feature: 'নিউট্রিশন ট্র্যাকার ও ফুড অ্যাসিস্ট্যান্ট' }
    ],
    projectMission: 'নুরিভার লক্ষ্য আধুনিক পুষ্টি বিজ্ঞানকে মানুষের দৈনন্দিন জীবনের সাথে যুক্ত করে সবার জন্য স্বাস্থ্যসম্মত ও সাশ্রয়ী জীবনধারা নিশ্চিত করা।',

    settingsTitle: 'নুরিভা সেটিংস',
    settingsSubtitle: 'আপনার পছন্দসমূহ, স্বাস্থ্য লক্ষ্য, থিম ও ভাষা পরিবর্তন করুন',
    tabProfile: 'প্রোফাইল ও অ্যাকাউন্ট',
    tabGoals: 'স্বাস্থ্য লক্ষ্যমাত্রা',
    tabLanguage: 'ভাষা (Language)',
    tabAppearance: 'ডিসপ্লে ও থিম (Theme)',
    displayName: 'নাম',
    emailLabel: 'ইমেইল / জিমেইল',
    dietPreference: 'খাদ্যাভ্যাস ও পছন্দের ধরণ',
    saveSettings: 'সেটিংস সংরক্ষণ করুন',
    savedToast: 'সফলভাবে সংরক্ষিত হয়েছে!',
    selectLanguage: 'অ্যাপের ভাষা বেছে নিন',

    themeModeLabel: 'স্ক্রিন ডিসপ্লে থিম',
    themeBright: 'ব্রাইট মোড (লাইট / দিন)',
    themeDark: 'ডার্ক মোড (নাইট / রাত)',
    themeDescription: 'উজ্জ্বল ফ্রেশ সবুজ বা আরামদায়ক হাই-কন্ট্রাস্ট ডার্ক থিমে স্ক্রিন পরিবর্তন করুন।',

    passStrengthWeak: 'দুর্বল পাসওয়ার্ড',
    passStrengthFair: 'মোটামুটি পাসওয়ার্ড',
    passStrengthGood: 'ভালো পাসওয়ার্ড',
    passStrengthStrong: 'শক্তিশালী পাসওয়ার্ড',
    passReqLength: 'কমপক্ষে ৮টি অক্ষর',
    passReqUpper: 'কমপক্ষে ১টি বড় (A-Z) ও ছোট (a-z) অক্ষর',
    passReqNumber: 'কমপক্ষে ১টি সংখ্যা (০-৯)',
    passReqSpecial: 'কমপক্ষে ১টি বিশেষ চিহ্ন (!@#$%^&*)',
    passMustBeStrong: 'নিরাপত্তার স্বার্থে পাসওয়ার্ডটি শক্তিশালী হতে হবে (সবগুলো শর্ত পূরণ করুন)।',

    gmailOptionalNotice: 'গুগল বা জিমেইল দিয়ে লগইন সম্পূর্ণ ঐচ্ছিক। আপনি জিমেইল ছাড়াও সাধারণ অ্যাকাউন্ট ব্যবহার করতে পারবেন।',
    continueWithGoogle: 'গুগল / জিমেইল দিয়ে চালিয়ে যান',
    continueWithoutGoogle: 'জিমেইল ছাড়া অতিথি হিসেবে প্রবেশ (ঐচ্ছিক)',
    googleConnectTitle: 'গুগল অ্যাকাউন্ট সংযোগ',
    googleConnected: 'গুগল অ্যাকাউন্ট সংযুক্ত',
    googleNotConnected: 'সংযুক্ত নেই (ঐচ্ছিক)',
    connectGoogleBtn: 'জিমেইল যুক্ত করুন',
    disconnectGoogleBtn: 'জিমেইল বিচ্ছিন্ন করুন',

    setupGoalsTitle: 'দৈনিক পুষ্টি ও ইনটেক ট্র্যাকিং',
    setupGoalsSubtitle: 'শুরুতে ক্যালোরি, প্রোটিন ও পানি ০ থাকবে। খাবার বা পানি যোগ করলে আপডেট হবে।',
    quickLogMeal: 'খাবার / পানি যোগ করুন',
    resetToZero: 'পুনরায় ০ করুন',
    resetZeroConfirm: 'আপনি কি আজকের সকল ক্যালোরি, প্রোটিন ও পানির হিসাব শূন্য (০) করতে চান?',
    zeroStartBadge: 'শুরুতে ০ থেকে শুরু · সিলেক্টে আপডেট',
    selectPresetMeal: 'বাংলাদেশি খাবার নির্বাচন বা কাস্টম এন্ট্রি',

    reportCardTitle: 'সাপ্তাহিক ও মাসিক অগ্রগতি রিপোর্ট কার্ড',
    reportCardSubtitle: 'দৈনিক খাবার ও পানি লগ করার সাথে সাথে স্বয়ংক্রিয়ভাবে রিয়েল-টাইমে এই রিপোর্ট আপডেট হবে।',
    weeklyView: 'সাপ্তাহিক রিপোর্ট (৭ দিন)',
    monthlyView: 'মাসিক রিপোর্ট (৪ সপ্তাহ)',
    adherenceScore: 'লক্ষ্যমাত্রা অর্জনের হার',
    totalLogged: 'মোট ক্যালোরি হিসাব',
    avgProteinPerDay: 'দৈনিক গড় প্রোটিন',
    avgHydrationPerDay: 'দৈনিক গড় পানি',
    reportConsistencyBadge: 'উচ্চ ধারাবাহিকতা',
    todayRealtimeUpdate: 'আজকের এন্ট্রি লাইভ আপডেট হচ্ছে',

    signInTab: 'লগইন / সাইন ইন',
    signUpTab: 'নতুন অ্যাকাউন্ট তৈরি',
    googleBtnText: 'গুগল দিয়ে প্রবেশ করুন',
    orWithEmail: 'অথবা ইমেইল দিয়ে',
    fullNameLabel: 'সম্পূর্ণ নাম',
    passwordLabel: 'পাসওয়ার্ড',
    forgotPassword: 'পাসওয়ার্ড ভুলে গেছেন?',
    rememberDevice: 'এই ডিভাইসটি মনে রাখুন',
    encryptedNotice: '২৫৬-বিট সুরক্ষিত',
    signInBtn: 'ড্যাশবোর্ডে প্রবেশ করুন',
    signUpBtn: 'অ্যাকাউন্ট তৈরি করুন',
    footerRights: '© ২০২৬ নুরিভা এআই হেলথ টেকনোলজিস। সর্বস্বত্ব সংরক্ষিত।',

    backToOverview: 'ড্যাশবোর্ডে ফিরে যান',
    portionGrams: 'পরিমাণ নির্ধারণ করুন (গ্রাম)',
    searchFoodPlaceholder: 'যেমন: ভাত, রুই মাছ, ডাল, ডিম...',
    scanPhotoBtn: 'এআই স্ক্যান সিমুলেট করুন',
    scanningText: 'স্ক্যান করা হচ্ছে...',
    nutritionBreakdown: 'পুষ্টি উপাদান বিশ্লেষণ',
    estimatedEnergy: 'আনুমানিক শক্তি',
    primaryGoalLabel: 'প্রাথমিক স্বাস্থ্য লক্ষ্য',
    activityLevelLabel: 'সাপ্তাহিক অ্যাক্টিভিটি লেভেল',
    foodStyleLabel: 'খাবারের ধরণ',
    generateCoachBtn: 'ব্যক্তিগত কোচিং তৈরি করুন',
    coachInsightTitle: 'নুরিভা এআই কোচ পরামর্শ',
    targetDailyBudget: 'মাথাপিছু দৈনিক বাজেট',
    householdPersons: 'পরিবারের সদস্য সংখ্যা',
    mealTimelineTitle: 'আজকের খাবারের তালিকা',
    addMealBtn: 'খাবার যোগ করুন',
    conversationalAITitle: 'কথোপকথনমূলক এআই সহকারী',
    askPlaceholder: 'যেমন: ১ কাপ মুগ ডালে কত ক্যালোরি?'
  },

  hi: {
    brandName: 'नूरीवा एआई (Nouriva AI)',
    brandTagline: 'उन्नत भोजन · स्वस्थ जीवन',
    brandMotto: 'अच्छा भोजन · बेहतर स्वास्थ्य · उज्ज्वल भविष्य',

    navOverview: 'डैशबोर्ड',
    navFeature1: 'एआई फूड स्कैनर',
    navFeature2: 'एआई न्यूट्रिशन कोच',
    navFeature3: 'बजट मील प्लानर',
    navFeature4: 'न्यूट्रिशन ट्रैकर',
    navReport: 'प्रगति रिपोर्ट',
    navTeam: 'हमारे बारे में व टीम',
    navSettings: 'सेटिंग्स',
    navLogout: 'लॉगआउट',

    searchPlaceholder: 'पोषण संबंधी जानकारी, व्यंजन या भोजन खोजें...',
    notificationsTitle: 'सूचनाएं',
    markAllRead: 'सभी को पढ़ा हुआ चिह्नित करें',
    memberRole: 'सत्यापित सदस्य',
    downloadZip: 'प्रोजेक्ट ZIP डाउनलोड करें',

    bannerBadge: 'एआई संचालित पोषण मार्गदर्शन',
    bannerTitle: 'व्यक्तिगत स्वास्थ्य एवं पोषण पोर्टल',
    bannerSubtitle: 'मैक्रोज़ ट्रैक करें, स्वास्थ्य संकेतकों का विश्लेषण करें और एआई मार्गदर्शन से दैनिक स्वस्थ भोजन चुनें।',
    logMealBtn: 'आज का भोजन दर्ज करें',
    exploreFeaturesBtn: '४ मुख्य फीचर्स देखें',
    bannerPill: 'छोटी आदतें → बड़ा बदलाव',

    calTarget: 'दैनिक कैलोरी लक्ष्य',
    calAchieved: 'आज पूर्ण',
    calLeft: 'कैलोरी शेष',
    proteinTitle: 'प्रोटीन सेवन',
    proteinLeft: 'शेष है',
    hydrationTitle: 'जल स्तर (पानी)',
    hydrationLeft: 'लक्ष्य तक शेष',
    addWaterBtn: '+२५० मिली',
    healthScoreTitle: 'मेटाबॉलिक हेल्थ स्कोर',
    healthScoreSub: 'पिछले सप्ताह से +४%',
    optimalBadge: 'उत्कृष्ट',

    featuresHeading: 'मुख्य पोषण एवं स्वास्थ्य सुविधाएं',
    featuresSubtitle: 'नूरीवा टीम द्वारा विकसित ४ समर्पित स्वास्थ्य और पोषण कार्यक्रम देखें।',
    featuresBadge: 'फीचर्स',
    openFeatureBtn: 'फीचर खोलें',
    whatIncluded: 'इस फीचर में क्या शामिल है',
    hideDetails: 'विवरण छुपाएं',

    f1Title: 'एआई फूड एवं हेल्थ स्कैनर',
    f1Desc: 'भोजन पहचान, पोषण विश्लेषण, उचित मात्रा अनुमान और फूड लेबल स्कैनिंग।',
    f1Bullets: [
      'खाद्य नाम और मात्रा इनपुट',
      'तुरंत कैलोरी, प्रोटीन, कार्ब्स और वसा की गणना',
      'खाद्य छवि और लेबल स्कैन करने की सुविधा'
    ],
    f1Details: [
      'खाद्य पदार्थ का नाम और ग्राम में मात्रा दर्ज करें।',
      'अनुमानित कैलोरी, प्रोटीन, कार्बोहाइड्रेट और वसा देखें।',
      'भोजन की फोटो या पोषण लेबल स्कैन करें।',
      'दैनिक आवश्यकता का आसान पोषण सारांश देखें।'
    ],

    f2Title: 'व्यक्तिगत एआई न्यूट्रिशन कोच',
    f2Desc: 'स्वास्थ्य लक्ष्यों, आहार प्राथमिकताओं और जीवनशैली के आधार पर व्यक्तिगत सुझाव।',
    f2Bullets: [
      'उपयोगकर्ता प्रोफ़ाइल और आहार प्राथमिकताएं',
      'जीवनशैली के अनुकूल स्वस्थ भोजन सुझाव',
      'सामान्य, गैर-चिकित्सीय स्वास्थ्य मार्गदर्शन'
    ],
    f2Details: [
      'वजन घटाने, मांसपेशियों या ऊर्जा के लक्ष्य निर्धारित करें।',
      'दैनिक गतिविधि स्तर और आहार प्राथमिकताएं जोड़ें।',
      'व्यक्तिगत भोजन और पोषण सिफारिशें प्राप्त करें।',
      'दैनिक जीवनशैली के लिए महत्वपूर्ण मार्गदर्शन प्राप्त करें।'
    ],

    f3Title: 'बजट-सचेत एआई मील प्लानर',
    f3Desc: 'किफायती दैनिक या साप्ताहिक भोजन योजना स्थानीय खाद्य पदार्थों और बजट के अनुसार।',
    f3Bullets: [
      'दैनिक बजट एवं सामग्री इनपुट',
      'भोजन लागत और किराना गणना',
      'किराना सूची और किफायती विकल्प'
    ],
    f3Details: [
      'दैनिक या साप्ताहिक भोजन बजट दर्ज करें।',
      'दैनिक आहार (चावल, दाल, मछली, सब्जियां) की योजना बनाएं।',
      'भोजन की अनुमानित लागत देखें।',
      'समान पोषण वाले किफायती खाद्य विकल्पों की सलाह लें।'
    ],

    f4Title: 'न्यूट्रिशन ट्रैकर एवं फूड असिस्टेंट',
    f4Desc: 'दैनिक भोजन ट्रैकिंग, पोषण सारांश और एआई फूड चैट सहायक।',
    f4Bullets: [
      'नाश्ता, दोपहर और रात के खाने की टाइमलाइन',
      'दैनिक पोषण प्रगति और आंकड़े',
      'पोषण संबंधी प्रश्नों के लिए एआई चैट सहायक'
    ],
    f4Details: [
      'दिन भर के भोजन और स्नैक्स को आसानी से रिकॉर्ड करें।',
      'दैनिक पोषण प्रगति और कैलोरी संतुलन की समीक्षा करें।',
      'पिछले भोजन का इतिहास देखें।',
      'किसी भी भोजन के पोषण के बारे में चैट में सवाल पूछें।'
    ],

    aboutTitle: 'नूरीवा के बारे में',
    aboutSubtitle: 'अच्छा भोजन · बेहतर स्वास्थ्य · उज्ज्वल भविष्य',
    developedBy: 'निर्माता टीम (Developed By)',
    teamMembers: [
      { name: 'जन्नतुल फिरदौस जेनी (Jannatul Ferdous Jenny)', role: 'फीचर १ विशेषज्ञ', feature: 'एआई फूड एवं हेल्थ स्कैनर' },
      { name: 'असमा बिंते आरिफ (Asma Bintay Arif)', role: 'फीचर २ विशेषज्ञ', feature: 'व्यक्तिगत एआई न्यूट्रिशन कोच' },
      { name: 'सैफा तहसीन (Saifa Tahsin)', role: 'फीचर ३ विशेषज्ञ', feature: 'बजट-सचेत एआई मील प्लानर' },
      { name: 'तहसीन सबा अरबी (Tahsin Saba Aroby)', role: 'फीचर ४ विशेषज्ञ', feature: 'न्यूट्रिशन ट्रैकर एवं फूड असिस्टेंट' }
    ],
    projectMission: 'नूरीवा का उद्देश्य आधुनिक पोषण विज्ञान को दैनिक जीवन से जोड़कर सभी के लिए स्वस्थ और सुलभ जीवनशैली सुनिश्चित करना है।',

    settingsTitle: 'नूरीवा सेटिंग्स',
    settingsSubtitle: 'अपनी प्राथमिकताएं, स्वास्थ्य लक्ष्य, थीम और भाषा बदलें',
    tabProfile: 'प्रोफ़ाइल और खाता',
    tabGoals: 'स्वास्थ्य लक्ष्य',
    tabLanguage: 'भाषा चुनें (Language)',
    tabAppearance: 'थीम एवं डिस्प्ले (Theme)',
    displayName: 'नाम',
    emailLabel: 'ईमेल / जीमेल',
    dietPreference: 'आहार प्राथमिकता',
    saveSettings: 'सेटिंग्स सहेजें',
    savedToast: 'सफलतापूर्वक सहेजा गया!',
    selectLanguage: 'एप्लिकेशन भाषा चुनें',

    themeModeLabel: 'स्क्रीन डिस्प्ले थीम',
    themeBright: 'ब्राइट मोड (दिन / लाइट)',
    themeDark: 'डार्क मोड (रात / डार्क)',
    themeDescription: 'दिन के लिए ताज़ा हरा-सफेद या रात के लिए सुखद डार्क मोड चुनें।',

    passStrengthWeak: 'कमजोर पासवर्ड',
    passStrengthFair: 'मध्यम पासवर्ड',
    passStrengthGood: 'अच्छा पासवर्ड',
    passStrengthStrong: 'मजबूत पासवर्ड',
    passReqLength: 'कम से कम ८ अक्षर',
    passReqUpper: 'कम से कम १ बड़ा (A-Z) व छोटा (a-z) अक्षर',
    passReqNumber: 'कम से कम १ संख्या (०-९)',
    passReqSpecial: 'कम से कम १ विशेष वर्ण (!@#$%^&*)',
    passMustBeStrong: 'सुरक्षा के लिए पासवर्ड मजबूत होना चाहिए (सभी शर्तें पूरी करें)।',

    gmailOptionalNotice: 'गूगल / जीमेल लॉगिन पूरी तरह वैकल्पिक है। आप जीमेल के बिना भी आगे बढ़ सकते हैं।',
    continueWithGoogle: 'गूगल / जीमेल से जारी रखें',
    continueWithoutGoogle: 'जीमेल के बिना जारी रखें (वैकल्पिक)',
    googleConnectTitle: 'गूगल खाता कनेक्शन',
    googleConnected: 'गूगल खाता जुड़ा हुआ है',
    googleNotConnected: 'जुड़ा नहीं है (वैकल्पिक)',
    connectGoogleBtn: 'जीमेल कनेक्ट करें',
    disconnectGoogleBtn: 'जीमेल डिस्कनेक्ट करें',

    setupGoalsTitle: 'दैनिक पोषण एवं सेवन ट्रैकिंग',
    setupGoalsSubtitle: 'प्रारंभ में कैलोरी, प्रोटीन और पानी ० रहेगा। भोजन या पानी दर्ज करने पर यह बढ़ेगा।',
    quickLogMeal: 'भोजन / पानी जोड़ें',
    resetToZero: 'पुनः ० करें',
    resetZeroConfirm: 'क्या आप आज के सभी लॉग किए गए कैलोरी, प्रोटीन और पानी को ० करना चाहते हैं?',
    zeroStartBadge: 'प्रारंभ में ० · चयन करने पर अपडेट',
    selectPresetMeal: 'दैनिक भोजन चुनें या कस्टम दर्ज करें',

    reportCardTitle: 'साप्ताहिक एवं मासिक प्रगति रिपोर्ट कार्ड',
    reportCardSubtitle: 'दैनिक भोजन व पानी रिकॉर्ड करने के साथ-साथ यह रिपोर्ट स्वचालित रूप से अपडेट होती है।',
    weeklyView: 'साप्ताहिक रिपोर्ट (७ दिन)',
    monthlyView: 'मासिक रिपोर्ट (४ सप्ताह)',
    adherenceScore: 'लक्ष्य पूर्ति दर',
    totalLogged: 'कुल कैलोरी दर्ज',
    avgProteinPerDay: 'दैनिक औसत प्रोटीन',
    avgHydrationPerDay: 'दैनिक औसत पानी',
    reportConsistencyBadge: 'उत्कृष्ट निरंतरता',
    todayRealtimeUpdate: 'दैनिक प्रविष्टियों के साथ लाइव अपडेट',

    signInTab: 'साइन इन / लॉगिन',
    signUpTab: 'खाता बनाएं',
    googleBtnText: 'गूगल से जारी रखें',
    orWithEmail: 'या ईमेल द्वारा',
    fullNameLabel: 'पूरा नाम',
    passwordLabel: 'पासवर्ड',
    forgotPassword: 'पासवर्ड भूल गए?',
    rememberDevice: 'इस डिवाइस को याद रखें',
    encryptedNotice: '२५६-बिट एन्क्रिप्टेड',
    signInBtn: 'डैशबोर्ड में प्रवेश करें',
    signUpBtn: 'खाता बनाएं',
    footerRights: '© २०२६ नूरीवा एआई हेल्थ टेक्नोलॉजीज। सर्वाधिकार सुरक्षित।',

    backToOverview: 'डैशबोर्ड पर वापस जाएं',
    portionGrams: 'मात्रा समायोजित करें (ग्राम)',
    searchFoodPlaceholder: 'उदा. चावल, मछली, दाल, अंडा...',
    scanPhotoBtn: 'एआई स्कैन अनुकरण करें',
    scanningText: 'स्कैन हो रहा है...',
    nutritionBreakdown: 'पोषण विवरण',
    estimatedEnergy: 'अनुमानित ऊर्जा',
    primaryGoalLabel: 'प्राथमिक स्वास्थ्य लक्ष्य',
    activityLevelLabel: 'साप्ताहिक गतिविधि स्तर',
    foodStyleLabel: 'आहार शैली',
    generateCoachBtn: 'व्यक्तिगत कोचिंग सलाह बनाएं',
    coachInsightTitle: 'नूरीवा एआई कोच सलाह',
    targetDailyBudget: 'प्रति व्यक्ति दैनिक बजट',
    householdPersons: 'परिवार के सदस्यों की संख्या',
    mealTimelineTitle: 'आज की भोजन टाइमलाइन',
    addMealBtn: 'भोजन जोड़ें',
    conversationalAITitle: 'संवादात्मक एआई सहायक',
    askPlaceholder: 'उदा. १ कप दाल में कितनी कैलोरी होती है?'
  }
};
