export type ThemeMode = 'light' | 'dark';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarText: string;
  role: string;
  isPremium: boolean;
  dietaryPreference: string;
  dailyCalorieTarget: number;
  dailyProteinTarget: number;
  dailyWaterTarget: number; // in Liters
  dailyBudgetBDT: number; // in BDT ৳
  healthScore: number;
  authMethod?: 'google' | 'password' | 'guest';
  theme?: ThemeMode;
  googleLinked?: boolean;
}

export interface MetricItem {
  id: string;
  title: string;
  current: number;
  target: number;
  unit: string;
  icon: string;
  color: string;
  subtext: string;
}

export interface DailyIntakeLog {
  calories: number;
  protein: number;
  water: number;
  targetCalories: number;
  targetProtein: number;
  targetWater: number;
  healthScore: number;
  lastUpdated: string;
}

export interface DayReportItem {
  dayName: string;
  dayShort: string;
  calories: number;
  calorieTarget: number;
  protein: number;
  proteinTarget: number;
  water: number;
  waterTarget: number;
  healthScore: number;
  isToday?: boolean;
}

export interface FeatureDefinition {
  id: string;
  memberNumber: number;
  memberName: string;
  memberFile: string;
  title: string;
  shortDesc: string;
  image: string;
  bullets: string[];
  fullDetails: string[];
  gitBranch: string;
  category: string;
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  assignedFeature: string;
  filePath: string;
  status: 'Ready for GitHub Push' | 'Placeholder Created' | 'Active';
}

export interface NotificationItem {
  id: string;
  title: string;
  time: string;
  type: 'info' | 'success' | 'alert';
  read: boolean;
}
