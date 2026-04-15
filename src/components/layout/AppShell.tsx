import { EditorPanel } from './EditorPanel';
import { PreviewPanel } from './PreviewPanel';
import { SectionNav } from './SectionNav';
import { Toolbar } from '../toolbar/Toolbar';
import { useMemo, useRef, useState } from 'react';
import { useCVStore } from '../../store/cvStore';
import type { SectionKey } from '../../types/cv.types';

export function AppShell() {
  const printRef = useRef<HTMLDivElement | null>(null);
  const activeSection = useCVStore((s) => s.activeSection);
  const setActiveSection = useCVStore((s) => s.setActiveSection);
  const [showMobilePreview, setShowMobilePreview] = useState(false);

  const tabs = useMemo(
    () =>
      [
        { key: 'basics', label: 'Basics' },
        { key: 'experience', label: 'Experience' },
        { key: 'education', label: 'Education' },
        { key: 'skills', label: 'Skills' },
        { key: 'languages', label: 'Languages' },
        { key: 'projects', label: 'Projects' },
        { key: 'certifications', label: 'Certifications' },
      ] satisfies { key: SectionKey; label: string }[],
    [],
  );

  return (
    <div className="min-h-dvh bg-zinc-50 text-zinc-950">
      <div className="border-b border-zinc-200 bg-white print:hidden">
        <Toolbar printRef={printRef} />
      </div>

      {/* Large (>=1100px): 3-panel grid */}
      <div className="mx-auto hidden max-w-[1400px] grid-cols-[140px_minmax(0,1fr)_1.8fr] gap-4 px-4 py-4 min-[1100px]:grid">
        <aside className="print:hidden">
          <SectionNav />
        </aside>

        <main className="min-w-0 print:hidden">
          <EditorPanel />
        </main>

        <aside className="sticky top-4 h-[calc(100dvh-88px)] self-start overflow-y-auto overflow-x-hidden rounded-xl border border-zinc-200 bg-white shadow-sm print:static print:h-auto print:overflow-visible print:border-0 print:shadow-none">
          <PreviewPanel printRef={printRef} />
        </aside>
      </div>

      {/* Medium (<1100px): stacked layout with horizontal tabs */}
      <div className="mx-auto hidden max-w-[1400px] px-4 py-4 md:block min-[1100px]:hidden">
        <div className="mb-4 overflow-x-auto print:hidden">
          <div className="flex w-max gap-2 rounded-xl border border-zinc-200 bg-white p-2 shadow-sm">
            {tabs.map((t) => {
              const isActive = t.key === activeSection;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setActiveSection(t.key)}
                  className={[
                    'h-9 whitespace-nowrap rounded-lg px-3 text-sm transition',
                    isActive ? 'bg-zinc-950 text-white' : 'hover:bg-zinc-100',
                  ].join(' ')}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <main className="min-w-0 print:hidden">
            <EditorPanel />
          </main>
          <section className="rounded-xl border border-zinc-200 bg-white shadow-sm print:border-0 print:shadow-none">
            <PreviewPanel printRef={printRef} />
          </section>
        </div>
      </div>

      {/* Small (<768px): medium layout + preview hidden by default, toggled by floating button */}
      <div className="mx-auto max-w-[1400px] px-4 py-4 md:hidden">
        <div className="mb-4 overflow-x-auto print:hidden">
          <div className="flex w-max gap-2 rounded-xl border border-zinc-200 bg-white p-2 shadow-sm">
            {tabs.map((t) => {
              const isActive = t.key === activeSection;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setActiveSection(t.key)}
                  className={[
                    'h-9 whitespace-nowrap rounded-lg px-3 text-sm transition',
                    isActive ? 'bg-zinc-950 text-white' : 'hover:bg-zinc-100',
                  ].join(' ')}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-4 pb-16">
          <main className="min-w-0 print:hidden">
            <EditorPanel />
          </main>

          {showMobilePreview ? (
            <section className="rounded-xl border border-zinc-200 bg-white shadow-sm print:border-0 print:shadow-none">
              <PreviewPanel printRef={printRef} />
            </section>
          ) : null}
        </div>

        <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 print:hidden">
          <button
            type="button"
            onClick={() => setShowMobilePreview((s) => !s)}
            className="h-11 rounded-full bg-zinc-950 px-6 text-sm font-semibold text-white shadow-lg"
          >
            {showMobilePreview ? 'Hide Preview' : 'Preview'}
          </button>
        </div>
      </div>
    </div>
  );
}

