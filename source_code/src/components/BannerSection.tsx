/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Language, translations } from '../translations.ts';

interface BannerSectionProps {
  onLogMealClick: () => void;
  onExploreFeaturesClick: () => void;
  language: Language;
}

export const BannerSection: React.FC<BannerSectionProps> = ({
  onLogMealClick,
  onExploreFeaturesClick,
  language
}) => {
  const t = translations[language];

  return (
    <section
      className="relative rounded-3xl overflow-hidden my-6 border-2 border-[#356d30] shadow-xs bg-[#f7fbf4] min-h-[260px]"
      style={{
        backgroundImage: `url('/assets/health-nutrition-banner.jpg')`,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#f7fbf4',
      }}
      aria-label="Nouriva health and nutrition banner"
    >
      <div className="absolute left-5 top-5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 text-[11px] font-bold text-[#356d30] border border-[#dcebd2] shadow-sm">
        <span aria-hidden="true">✦</span>
        <span>{t.bannerBadge}</span>
      </div>
      <div className="absolute left-5 bottom-5 flex flex-row flex-wrap items-center gap-3">
        <button onClick={onLogMealClick} className="px-4 py-2.5 bg-[#78b943] hover:bg-[#8cd152] text-[#1b3b18] font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer">
          {t.logMealBtn}
        </button>
        <button onClick={onExploreFeaturesClick} className="px-4 py-2.5 bg-white hover:bg-[#eef7e9] text-[#1b3b18] font-semibold text-xs rounded-xl border border-[#356d30] transition-all cursor-pointer shadow-sm">
          {t.exploreFeaturesBtn}
        </button>
      </div>
    </section>
  );
};
