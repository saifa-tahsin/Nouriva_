/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, Heart, Download } from 'lucide-react';
import { Language, translations } from '../translations.ts';
import { downloadProjectZip } from '../utils/zipExporter.ts';

interface TeamPanelProps {
  language: Language;
}

export const TeamPanel: React.FC<TeamPanelProps> = ({ language }) => {
  const t = translations[language];
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    await downloadProjectZip();
    setTimeout(() => setIsDownloading(false), 1500);
  };

  return (
    <section className="mb-10 bg-gradient-to-br from-[#f4faef] via-[#ebf6e7] to-[#e4f3de] dark:from-[#0d170e] dark:via-[#132315] dark:to-[#172c19] border border-[#dcebd2] dark:border-[#223725] rounded-3xl p-6 sm:p-8 shadow-xs transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-[#dcebd2] dark:border-[#223725]">
        <div>
          <div className="inline-flex items-center gap-2 text-[11px] font-bold text-[#4f8e36] dark:text-[#b6f07a] uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.aboutTitle}</span>
          </div>
          <h2 className="text-2xl font-bold text-[#2c592b] dark:text-white tracking-tight">
            {t.developedBy}
          </h2>
          <p className="text-xs text-[#6b8665] dark:text-[#8ea987] max-w-xl mt-1 leading-relaxed">
            {t.projectMission}
          </p>
        </div>

        {/* Download Project ZIP button */}
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#356d30] hover:bg-[#285724] dark:bg-[#78b943] dark:hover:bg-[#68a737] text-white dark:text-[#0b170c] rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Download className={`w-4 h-4 ${isDownloading ? 'animate-bounce' : ''}`} />
          <span>
            {isDownloading 
              ? (language === 'bn' ? 'ডাউনলোড হচ্ছে...' : 'Downloading...') 
              : (language === 'bn' ? 'সম্পূর্ণ প্রোজেক্ট ZIP ডাউনলোড' : 'Download Complete Project ZIP')}
          </span>
        </button>
      </div>

      {/* 4 Members Clean Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {t.teamMembers.map((m, idx) => (
          <div 
            key={idx}
            className="bg-white dark:bg-[#152417] p-5 rounded-2xl border border-[#dcebd2] dark:border-[#223725] shadow-2xs hover:border-[#a6d86b] dark:hover:border-[#52a647] hover:shadow-xs transition-all text-center flex flex-col items-center"
          >
            <div className="w-12 h-12 rounded-full bg-[#356d30] text-white flex items-center justify-center font-bold text-sm mb-3 shadow-xs">
              0{idx + 1}
            </div>
            <h4 className="text-sm font-bold text-[#1b3b18] dark:text-white mb-0.5">{m.name}</h4>
            <span className="text-[11px] text-[#4f8e38] dark:text-[#b6f07a] font-semibold mb-2">{m.role}</span>
            <div className="text-[11px] bg-[#f7fbf4] dark:bg-[#0d170e] border border-[#dcebd2] dark:border-[#223725] text-[#2c592b] dark:text-gray-300 px-3 py-1 rounded-full font-medium">
              {m.feature}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white/70 dark:bg-[#152417]/80 backdrop-blur-xs p-4 rounded-2xl border border-[#dcebd2] dark:border-[#223725] flex items-center justify-between text-xs text-[#4f8e3c] dark:text-[#b6f07a]">
        <span className="font-semibold flex items-center gap-1.5">
          <Heart className="w-3.5 h-3.5 text-[#356d30] dark:text-[#b6f07a]" />
          <span>Nouriva AI — {t.brandTagline}</span>
        </span>
        <span className="text-[11px] text-[#6b8665] dark:text-[#8ea987]">Dhaka, Bangladesh</span>
      </div>
    </section>
  );
};
