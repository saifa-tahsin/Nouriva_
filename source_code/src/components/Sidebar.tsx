/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  PieChart, 
  Scan, 
  Bot, 
  Wallet, 
  ClipboardList, 
  Users, 
  Settings, 
  LogOut,
  BarChart3,
  Download
} from 'lucide-react';
import { Language, translations } from '../translations.ts';
import { downloadProjectZip } from '../utils/zipExporter.ts';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSettings: () => void;
  onLogout: () => void;
  language: Language;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenSettings,
  onLogout,
  language,
  isMobileOpen,
  onCloseMobile
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const t = translations[language];

  const handleDownload = async () => {
    setIsDownloading(true);
    await downloadProjectZip();
    setTimeout(() => setIsDownloading(false), 1500);
  };

  const navItems = [
    { id: 'dashboard', label: t.navOverview, icon: PieChart },
    { id: 'feature-1', label: t.navFeature1, icon: Scan },
    { id: 'feature-2', label: t.navFeature2, icon: Bot },
    { id: 'feature-3', label: t.navFeature3, icon: Wallet },
    { id: 'feature-4', label: t.navFeature4, icon: ClipboardList },
    { id: 'report', label: t.navReport, icon: BarChart3 },
    { id: 'team', label: t.navTeam, icon: Users },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {isMobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 w-64 bg-gradient-to-b from-[#2d6129] via-[#3a7534] to-[#4c8b3c] dark:from-[#0a140c] dark:via-[#102013] dark:to-[#142918] dark:border-r dark:border-[#223725] text-white flex flex-col justify-between p-4 z-50 transition-transform duration-300 lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="flex items-center gap-3 px-2 py-3 border-b border-white/15 dark:border-white/10 mb-4">
            <div className="w-11 h-11 rounded-xl bg-white p-1 flex items-center justify-center shrink-0 shadow-sm">
              <img 
                src="/assets/nouriva-logo.jpg" 
                alt="Nouriva Logo" 
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-white">{t.brandName}</span>
              </div>
              <p className="text-[10px] text-[#e0f2d4] font-medium leading-tight mt-0.5">
                {t.brandTagline}
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1.5" aria-label="Main Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white dark:bg-[#1f3822] text-[#244b25] dark:text-[#b6f07a] shadow-md font-bold'
                      : 'text-[#e6f4df] hover:bg-white/15 dark:hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#356d30] dark:text-[#b6f07a]' : 'text-[#c1e88b]'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="space-y-2.5 pt-3 border-t border-white/15 dark:border-white/10">
          {/* 1-Click Download ZIP Button in Sidebar */}
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold bg-[#c1e88b] hover:bg-[#b0dc75] text-[#1b3b18] shadow-sm transition-all cursor-pointer"
          >
            <Download className={`w-4 h-4 ${isDownloading ? 'animate-bounce' : ''}`} />
            <span>
              {isDownloading 
                ? (language === 'bn' ? 'ডাউনলোড হচ্ছে...' : 'Downloading...') 
                : (language === 'bn' ? 'ডাউনলোড প্রজেক্ট ZIP' : 'Download Project ZIP')}
            </span>
          </button>

          <button
            onClick={() => {
              onOpenSettings();
              if (onCloseMobile) onCloseMobile();
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-[#e6f4df] hover:bg-white/15 hover:text-white transition-all cursor-pointer"
          >
            <Settings className="w-4 h-4 text-[#c1e88b]" />
            <span>{t.navSettings}</span>
          </button>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-red-200 hover:bg-red-500/20 hover:text-white transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-red-300" />
            <span>{t.navLogout}</span>
          </button>
        </div>
      </aside>
    </>
  );
};
