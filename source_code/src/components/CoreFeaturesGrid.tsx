/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Scan, 
  Bot, 
  Wallet, 
  ClipboardList, 
  ArrowRight, 
  Plus, 
  Minus, 
  Check, 
  Sparkles
} from 'lucide-react';
import { Language, translations } from '../translations.ts';

interface CoreFeaturesGridProps {
  onSelectFeature: (featureId: string) => void;
  language: Language;
}

export const CoreFeaturesGrid: React.FC<CoreFeaturesGridProps> = ({ onSelectFeature, language }) => {
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  const t = translations[language];

  const toggleExpand = (id: string) => {
    setExpandedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const features = [
    {
      id: 'feature-1',
      memberNum: 1,
      title: t.f1Title,
      desc: t.f1Desc,
      bullets: t.f1Bullets,
      details: t.f1Details,
      image: '/assets/feature-1.jpg',
      icon: Scan,
      specialist: 'Jannatul Ferdous Jenny'
    },
    {
      id: 'feature-2',
      memberNum: 2,
      title: t.f2Title,
      desc: t.f2Desc,
      bullets: t.f2Bullets,
      details: t.f2Details,
      image: '/assets/feature-2.jpg',
      icon: Bot,
      specialist: 'Asma Bintay Arif'
    },
    {
      id: 'feature-3',
      memberNum: 3,
      title: t.f3Title,
      desc: t.f3Desc,
      bullets: t.f3Bullets,
      details: t.f3Details,
      image: '/assets/feature-3.jpg',
      icon: Wallet,
      specialist: 'Saifa Tahsin'
    },
    {
      id: 'feature-4',
      memberNum: 4,
      title: t.f4Title,
      desc: t.f4Desc,
      bullets: t.f4Bullets,
      details: t.f4Details,
      image: '/assets/feature-4.jpg',
      icon: ClipboardList,
      specialist: 'Tahsin Saba Aroby'
    }
  ];

  return (
    <section className="mb-10">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#4f8e36] dark:text-[#b6f07a] uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.brandName}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#2c592b] dark:text-white tracking-tight">
            {t.featuresHeading}
          </h2>
          <p className="text-xs text-[#6b8665] dark:text-[#8ea987] mt-0.5">
            {t.featuresSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2.5 bg-white dark:bg-[#152417] border border-[#dcebd2] dark:border-[#223725] px-3.5 py-2 rounded-xl text-xs font-semibold text-[#6b8665] dark:text-[#8ea987] shrink-0">
          <strong className="text-xl text-[#356d30] dark:text-[#b6f07a] font-black">04</strong>
          <span>{t.featuresBadge}</span>
        </div>
      </div>

      {/* Grid of 4 Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {features.map((feature) => {
          const Icon = feature.icon;
          const isExpanded = !!expandedCards[feature.id];

          return (
            <article
              key={feature.id}
              className="bg-white dark:bg-[#152417] rounded-2xl border border-[#dcebd2] dark:border-[#223725] overflow-hidden shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Feature Image Banner */}
              <div className="relative h-44 overflow-hidden bg-[#e5f2fa]">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2.5 left-2.5 bg-white/90 dark:bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-[#1b3b18] dark:text-[#b6f07a] border border-white/60 dark:border-white/10 shadow-xs">
                  {feature.specialist}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  {/* Title row */}
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#356d30] text-[#c1e88b] flex items-center justify-center shrink-0 shadow-xs">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#2c592b] dark:text-white leading-snug">
                        {feature.title}
                      </h3>
                    </div>
                  </div>

                  {/* Summary */}
                  <p className="text-xs text-[#6b8665] dark:text-[#8ea987] leading-relaxed mb-3 min-h-[38px]">
                    {feature.desc}
                  </p>

                  {/* Bullets */}
                  <ul className="space-y-1.5 mb-4">
                    {feature.bullets.map((b, i) => (
                      <li key={i} className="text-[11px] text-[#244b25] dark:text-gray-300 flex items-start gap-1.5 leading-snug">
                        <Check className="w-3.5 h-3.5 text-[#4f8e38] dark:text-[#b6f07a] shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Toggle details */}
                  <button
                    type="button"
                    onClick={() => toggleExpand(feature.id)}
                    className="w-full text-left py-2 px-3 bg-[#f7fbf4] dark:bg-[#0d170e] hover:bg-[#edf7e8] dark:hover:bg-[#1a2f1c] border border-[#dcebd2] dark:border-[#223725] rounded-xl text-xs font-bold text-[#356d30] dark:text-[#b6f07a] flex items-center justify-between transition-colors cursor-pointer mb-3"
                  >
                    <span>{isExpanded ? t.hideDetails : t.whatIncluded}</span>
                    {isExpanded ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  </button>

                  {/* Expandable details */}
                  {isExpanded && (
                    <div className="p-3 bg-[#f3f9ef] dark:bg-[#0d170e] border border-[#dcebd2] dark:border-[#223725] rounded-xl mb-3 text-[11px] text-[#244b25] dark:text-gray-300 space-y-1.5 animate-fadeIn">
                      <ul className="list-disc list-inside space-y-1 text-[#4f6e4a] dark:text-[#8ea987]">
                        {feature.details.map((detail, idx) => (
                          <li key={idx}>{detail}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Primary Action Button */}
                <button
                  type="button"
                  onClick={() => onSelectFeature(feature.id)}
                  className="w-full py-2.5 px-3 bg-[#356d30] hover:bg-[#285724] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer group"
                >
                  <span>{t.openFeatureBtn}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
