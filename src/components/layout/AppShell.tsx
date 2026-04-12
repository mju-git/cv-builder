import { EditorPanel } from './EditorPanel';
import { PreviewPanel } from './PreviewPanel';
import { SectionNav } from './SectionNav';
import { Toolbar } from '../toolbar/Toolbar';
import { useRef } from 'react';

export function AppShell() {
  const printRef = useRef<HTMLDivElement | null>(null);
  return (
    <div className="min-h-dvh bg-zinc-50 text-zinc-950">
      <div className="border-b border-zinc-200 bg-white print:hidden">
        <Toolbar printRef={printRef} />
      </div>

      <div className="mx-auto grid max-w-[1400px] grid-cols-[180px_minmax(0,1fr)_420px] gap-4 px-4 py-4">
        <aside className="print:hidden">
          <SectionNav />
        </aside>

        <main className="min-w-0 print:hidden">
          <EditorPanel />
        </main>

        <aside className="sticky top-4 h-[calc(100dvh-88px)] self-start overflow-auto rounded-xl border border-zinc-200 bg-white shadow-sm print:static print:h-auto print:overflow-visible print:border-0 print:shadow-none">
          <PreviewPanel printRef={printRef} />
        </aside>
      </div>
    </div>
  );
}

