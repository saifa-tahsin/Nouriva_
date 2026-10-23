/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Menu, 
  User, 
  Settings, 
  LogOut, 
  ChevronDown, 
  Globe, 
  Download,
  Sun,
  Moon,
  Sparkles
} from 'lucide-react';
import { UserProfile, NotificationItem, ThemeMode } from '../types.ts';
import { Language, translations } from '../translations.ts';
import { downloadProjectZip } from '../utils/zipExporter.ts';

interface TopHeaderProps {
  user: UserProfile;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onOpenSettings: () => void;
  onLogout: () => void;
  onOpenMobileMenu: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  user,
  searchQuery,
  setSearchQuery,
  onOpenSettings,
  onLogout,
  onOpenMobileMenu,
  language,
  onLanguageChange,
  theme,
  onToggleTheme
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const t = translations[language];
  const isDark = theme === 'dark';

  const handleDownloadZip = async () => {
    setIsDownloading(true);
    await downloadProjectZip();
    setTimeout(() => setIsDownloading(false), 1500);
  };

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    { id: '1', title: language === 'bn' ? 'আজকের পুষ্টি ও ম্যাক্রো ট্র্যাকার ০ থেকে শুরু হয়েছে।' : language === 'hi' ? 'आज का न्यूट्रिशन ट्रैकर प्रारंभ हुआ।' : 'Nutrition & macro tracker initialized for today.', time: '10m', type: 'success', read: false },
    { id: '2', title: language === 'bn' ? 'পানি পানের কথা মনে রাখুন (টার্গেট ৩.০ লিটার)।' : language === 'hi' ? 'पानी पीने का समय (लक्ष्य ३.० लीटर)।' : 'Hydration reminder: Drink a glass of water.', time: '45m', type: 'info', read: false },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const languagesList: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'bn', label: 'বাংলা (Bengali)', flag: '🇧🇩' },
    { code: 'hi', label: 'हिंदी (Hindi)', flag: '🇮🇳' },
  ];

  return (
    <header className="bg-white dark:bg-[#122014] border-b border-[#dcebd2] dark:border-[#223725] px-4 lg:px-8 py-3.5 sticky top-0 z-30 flex items-center justify-between gap-3 sm:gap-4 transition-colors">
      {/* Left: Mobile Menu Toggle & Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-[#244b25] dark:text-[#b6f07a] hover:bg-[#f4faef] dark:hover:bg-[#1e3421] rounded-xl cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full">
          <Search className="w-4 h-4 text-[#6b8665] dark:text-[#8ea987] absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-[#f7fbf4] dark:bg-[#0a140c] border border-[#dcebd2] dark:border-[#223725] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4f8b38] text-[#244b25] dark:text-white transition-all placeholder:text-[#88a082] dark:placeholder:text-[#5f7a5b]"
          />
        </div>
      </div>

      {/* Right Header Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Prominently visible Download ZIP Button */}
        <button
          onClick={handleDownloadZip}
          disabled={isDownloading}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#356d30] hover:bg-[#285724] dark:bg-[#78b943] dark:hover:bg-[#68a737] text-white dark:text-[#0b170c] rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer shrink-0"
          title={language === 'bn' ? 'সম্পূর্ণ প্রোজেক্ট জিপ ডাউনলোড করুন' : 'Download Full Project ZIP'}
        >
          <Download className={`w-3.5 h-3.5 ${isDownloading ? 'animate-bounce' : ''}`} />
          <span className="hidden sm:inline font-bold">
            {isDownloading 
              ? (language === 'bn' ? 'ডাউনলোড হচ্ছে...' : language === 'hi' ? 'डाउनलोडिंग...' : 'Downloading...')
              : (language === 'bn' ? 'ZIP ডাউনলোড' : language === 'hi' ? 'डाउनलोड ZIP' : 'Download ZIP')}
          </span>
          <span className="sm:hidden font-bold">ZIP</span>
        </button>

        {/* Dark / Bright Screen Mode Quick Switcher */}
        <button
          onClick={onToggleTheme}
          className={`px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold shrink-0 ${
            isDark 
              ? 'bg-[#1b2f1d] border-[#2a482c] text-[#b6f07a] hover:bg-[#233d26]' 
              : 'bg-[#f7fbf4] border-[#dcebd2] text-[#356d30] hover:bg-[#edf7e8]'
          }`}
          title={isDark ? t.themeBright : t.themeDark}
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-[#356d30]" />
          )}
          <span className="hidden md:inline">{isDark ? 'Bright' : 'Dark'}</span>
        </button>

        {/* Language Switcher Dropdown */}
        <div className="relative shrink-0">
          <button
            onClick={() => setShowLangDropdown(!showLangDropdown)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#f7fbf4] dark:bg-[#0a140c] hover:bg-[#edf7e8] dark:hover:bg-[#1b2f1d] border border-[#dcebd2] dark:border-[#223725] rounded-xl text-xs font-bold text-[#244b25] dark:text-[#e6f6e1] transition-all cursor-pointer shadow-2xs"
            aria-label="Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-[#356d30] dark:text-[#b6f07a]" />
            <span className="uppercase text-[11px] font-bold">{language}</span>
            <ChevronDown className="w-3 h-3 text-[#6b8665]" />
          </button>

          {showLangDropdown && (
            <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-[#122014] rounded-2xl shadow-xl border border-[#dcebd2] dark:border-[#223725] p-1.5 z-50 animate-fadeIn">
              {languagesList.map((langItem) => (
                <button
                  key={langItem.code}
                  onClick={() => {
                    onLanguageChange(langItem.code);
                    setShowLangDropdown(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    language === langItem.code
                      ? 'bg-[#eef7e9] dark:bg-[#1d3521] text-[#356d30] dark:text-[#b6f07a] font-bold'
                      : 'text-[#244b25] dark:text-gray-300 hover:bg-[#f7fbf4] dark:hover:bg-[#1f3521]'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{langItem.flag}</span>
                    <span>{langItem.label}</span>
                  </span>
                  {language === langItem.code && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#356d30] dark:bg-[#b6f07a]" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notification Bell */}
        <div className="relative shrink-0">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-[#244b25] dark:text-[#e6f6e1] hover:bg-[#f7fbf4] dark:hover:bg-[#0a140c] rounded-xl border border-[#dcebd2] dark:border-[#223725] relative cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white dark:bg-[#122014] rounded-2xl shadow-xl border border-[#dcebd2] dark:border-[#223725] p-4 z-50 animate-fadeIn">
              <div className="flex items-center justify-between pb-2 border-b border-[#dcebd2] dark:border-[#223725] mb-3">
                <span className="text-xs font-bold text-[#1b3b18] dark:text-white">{t.notificationsTitle}</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[11px] text-[#4f8e3c] dark:text-[#b6f07a] hover:underline font-semibold cursor-pointer"
                  >
                    {t.markAllRead}
                  </button>
                )}
              </div>

              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    className={`p-2.5 rounded-xl border transition-colors ${
                      item.read
                        ? 'bg-transparent border-[#dcebd2] dark:border-[#223725] opacity-60'
                        : 'bg-[#f7fbf4] dark:bg-[#0a140c] border-[#c1e88b] dark:border-[#2a482c]'
                    }`}
                  >
                    <p className="text-xs text-[#244b25] dark:text-gray-200 font-medium leading-relaxed">
                      {item.title}
                    </p>
                    <span className="text-[10px] text-[#6b8665] dark:text-[#8ea987] block mt-1">
                      {item.time} ago
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar & Dropdown */}
        <div className="relative shrink-0">
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-2xl hover:bg-[#f7fbf4] dark:hover:bg-[#0a140c] transition-colors border border-transparent hover:border-[#dcebd2] dark:hover:border-[#223725] cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#356d30] to-[#78b943] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {user.avatarText || 'NM'}
            </div>
            <div className="hidden sm:block text-left">
              <span className="block text-xs font-bold text-[#1b3b18] dark:text-white leading-tight">
                {user.name.split(' ')[0]}
              </span>
              <span className="block text-[10px] text-[#6b8665] dark:text-[#8ea987]">
                {t.memberRole}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#6b8665] hidden sm:block" />
          </button>

          {showUserDropdown && (
            <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-[#122014] rounded-2xl shadow-xl border border-[#dcebd2] dark:border-[#223725] p-2 z-50 animate-fadeIn">
              <div className="px-3 py-2 border-b border-[#dcebd2] dark:border-[#223725] mb-1">
                <span className="text-xs font-bold text-[#1b3b18] dark:text-white block truncate">
                  {user.name}
                </span>
                <span className="text-[11px] text-[#6b8665] dark:text-[#8ea987] block truncate">
                  {user.email}
                </span>
              </div>

              <button
                onClick={() => {
                  setShowUserDropdown(false);
                  handleDownloadZip();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#356d30] dark:text-[#b6f07a] hover:bg-[#f4faef] dark:hover:bg-[#1f3521] rounded-xl transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#356d30] dark:text-[#b6f07a]" />
                <span>{language === 'bn' ? 'ZIP ডাউনলোড' : 'Download Project ZIP'}</span>
              </button>

              <button
                onClick={() => {
                  setShowUserDropdown(false);
                  onOpenSettings();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#244b25] dark:text-gray-200 hover:bg-[#f4faef] dark:hover:bg-[#1f3521] rounded-xl transition-colors cursor-pointer"
              >
                <Settings className="w-4 h-4 text-[#356d30] dark:text-[#b6f07a]" />
                <span>{t.navSettings}</span>
              </button>

              <button
                onClick={() => {
                  setShowUserDropdown(false);
                  onToggleTheme();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#244b25] dark:text-gray-200 hover:bg-[#f4faef] dark:hover:bg-[#1f3521] rounded-xl transition-colors cursor-pointer"
              >
                {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#356d30]" />}
                <span>{isDark ? t.themeBright : t.themeDark}</span>
              </button>

              <button
                onClick={() => {
                  setShowUserDropdown(false);
                  onLogout();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>{t.navLogout}</span>
              </button>
            </div>
          )}
        </div>

        {/* Direct One-Click Logout Button on Header */}
        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/40 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs shrink-0"
          title={t.navLogout}
          aria-label="Log Out"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden md:inline">{t.navLogout}</span>
        </button>
      </div>
    </header>
  );
};
