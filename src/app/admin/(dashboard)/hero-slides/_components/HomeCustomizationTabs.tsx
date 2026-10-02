'use client';

import { useState, type ReactNode } from 'react';
import { GalleryHorizontal, Type, BookOpen, Feather } from 'lucide-react';

const TABS = [
  { id: 'hero',    label: 'Hero Slides',  icon: GalleryHorizontal },
  { id: 'home',    label: 'Home Text',    icon: Type              },
  { id: 'about',   label: 'About Us',     icon: BookOpen          },
  { id: 'story',   label: 'Our Story',    icon: Feather           },
] as const;

type TabId = (typeof TABS)[number]['id'];

export default function HomeCustomizationTabs({
  heroSlidesTab,
  settingsTab,
  aboutTab,
  storyTab,
}: {
  heroSlidesTab: ReactNode;
  settingsTab:   ReactNode;
  aboutTab:      ReactNode;
  storyTab:      ReactNode;
}) {
  const [active, setActive] = useState<TabId>('hero');

  return (
    <div>
      {/* Tab Bar */}
      <div className="mb-6 flex gap-1 overflow-x-auto border-b border-cream-300 pb-0 scrollbar-none">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActive(id)}
            className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-semibold transition-all ${
              active === id
                ? 'border-brand-500 text-brand-700'
                : 'border-transparent text-muted hover:text-brand-600'
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {active === 'hero'  && heroSlidesTab}
      {active === 'home'  && settingsTab}
      {active === 'about' && aboutTab}
      {active === 'story' && storyTab}
    </div>
  );
}
