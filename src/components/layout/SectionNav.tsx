import { useMemo } from 'react';
import { useCVStore } from '../../store/cvStore';
import type { SectionKey } from '../../types/cv.types';

const LABELS: Record<SectionKey, string> = {
  basics: 'Basics',
  experience: 'Experience',
  education: 'Education',
  skills: 'Skills',
  languages: 'Languages',
  projects: 'Projects',
  certifications: 'Certifications',
};

export function SectionNav() {
  const activeSection = useCVStore((s) => s.activeSection);
  const setActiveSection = useCVStore((s) => s.setActiveSection);
  const cv = useCVStore((s) => s.cv);

  const completion = useMemo(() => {
    const hasText = (v?: string) => !!v && v.trim().length > 0;
    const hasList = (arr?: unknown[]) => Array.isArray(arr) && arr.length > 0;

    return {
      basics:
        hasText(cv.basics.name) ||
        hasText(cv.basics.title) ||
        hasText(cv.basics.email) ||
        hasText(cv.basics.phone) ||
        hasText(cv.basics.location) ||
        hasText(cv.basics.linkedin) ||
        hasText(cv.basics.website) ||
        hasText(cv.basics.summary),
      experience: hasList(cv.experience),
      education: hasList(cv.education),
      skills: hasList(cv.skills),
      languages: hasList(cv.languages),
      projects: hasList(cv.projects),
      certifications: hasList(cv.certifications),
    } satisfies Record<SectionKey, boolean>;
  }, [cv]);

  const sections = Object.keys(LABELS) as SectionKey[];

  return (
    <nav className="rounded-xl border border-zinc-200 bg-white p-2 shadow-sm">
      <div className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
        Sections
      </div>
      <ul className="m-0 list-none p-0">
        {sections.map((key) => {
          const isActive = key === activeSection;
          const done = completion[key];
          return (
            <li key={key}>
              <button
                type="button"
                onClick={() => setActiveSection(key)}
                className={[
                  'flex w-full items-center justify-between gap-2 rounded-lg px-2 py-2 text-left text-sm transition',
                  isActive ? 'bg-zinc-950 text-white' : 'hover:bg-zinc-100',
                ].join(' ')}
              >
                <span className="truncate">{LABELS[key]}</span>
                <span
                  aria-label={done ? 'complete' : 'incomplete'}
                  className={[
                    'h-2.5 w-2.5 shrink-0 rounded-full',
                    isActive ? 'bg-purple-500' : done ? 'bg-emerald-500' : 'bg-zinc-300',
                  ].join(' ')}
                />
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

