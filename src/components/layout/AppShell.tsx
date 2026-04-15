import { EditorPanel } from './EditorPanel';
import { PreviewPanel } from './PreviewPanel';
import { SectionNav } from './SectionNav';
import { Toolbar } from '../toolbar/Toolbar';
import { useRef, useState } from 'react';

export function AppShell() {
  const printRef = useRef<HTMLDivElement | null>(null);
  const [mobilePreview, setMobilePreview] = useState(false);
  return (
    <div className="min-h-dvh bg-zinc-50 text-zinc-950">
      <div className="border-b border-zinc-200 bg-white print:hidden">
        <Toolbar printRef={printRef} />
      </div>

      {/* Desktop/tablet layout */}
      <div className="mx-auto hidden max-w-[1400px] grid-cols-[140px_minmax(0,1fr)_1.8fr] gap-4 px-4 py-4 md:grid">
        <aside className="print:hidden">
          <SectionNav />
        </aside>

        <main className="min-w-0 print:hidden">
          <EditorPanel />
        </main>

        <aside className="sticky top-4 h-[calc(100dvh-88px)] min-w-[400px] self-start overflow-y-auto overflow-x-hidden rounded-xl border border-zinc-200 bg-white shadow-sm print:static print:h-auto print:overflow-visible print:border-0 print:shadow-none">
          <PreviewPanel printRef={printRef} />
        </aside>
      </div>

      {/* Mobile fallback (<768px): editor-only or preview-only */}
      <div className="mx-auto max-w-[1400px] px-4 py-4 md:hidden">
        <div className={mobilePreview ? 'hidden' : ''}>
          <EditorPanel />
        </div>
        <div className={mobilePreview ? '' : 'hidden'}>
          <div className="rounded-xl border border-zinc-200 bg-white shadow-sm">
            <PreviewPanel printRef={printRef} />
          </div>
        </div>

        <div className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 print:hidden">
          {mobilePreview ? (
            <button
              type="button"
              onClick={() => setMobilePreview(false)}
              className="h-11 w-full rounded-xl bg-zinc-950 px-4 text-sm font-semibold text-white shadow-lg"
            >
              Back to editing
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setMobilePreview(true)}
              className="h-11 w-full rounded-xl bg-zinc-950 px-4 text-sm font-semibold text-white shadow-lg"
            >
              Preview CV
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

