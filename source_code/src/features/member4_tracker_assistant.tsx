/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Feature 4 uses the supplied standalone Member 4 module.
 * The iframe isolates its styles and scripts from the main Nouriva dashboard.
 */
import React from 'react';
import { Language } from '../translations.ts';

interface Member4TrackerAssistantProps {
  language: Language;
}

export const Member4TrackerAssistant: React.FC<Member4TrackerAssistantProps> = ({ language }) => {
  return (
    <div className="w-full overflow-hidden rounded-3xl border border-[#dcebd2] dark:border-[#223725] bg-white dark:bg-[#122014]">
      <iframe
        title={`Nouriva Feature 4 — ${language}`}
        src="/member4/tracker.html"
        className="block w-full border-0"
        style={{ height: '1050px' }}
        loading="lazy"
      />
    </div>
  );
};
