import { useMemo, type RefObject } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useCVStore } from '../../store/cvStore';
import type { CVTemplateKey } from '../../types/cv.types';
import { exportPdf } from '../../utils/exportPdf';
import { validateCV } from '../../utils/cvValidation';

export function Toolbar(props: { printRef: RefObject<HTMLDivElement | null> }) {
  const template = useCVStore((s) => s.template);
  const setTemplate = useCVStore((s) => s.setTemplate);
  const reset = useCVStore((s) => s.reset);
  const cv = useCVStore((s) => s.cv);

  const issueCount = useMemo(() => validateCV(cv).length, [cv]);
  const print = useReactToPrint({
    contentRef: props.printRef,
    documentTitle: cv.basics.name ? `${cv.basics.name} — CV` : 'CV',
  });

  const templates = useMemo(
    () =>
      [
        { key: 'classic', label: 'Classic' },
        { key: 'modern', label: 'Modern' },
      ] satisfies { key: CVTemplateKey; label: string }[],
    [],
  );

  return (
    <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-3">
      <div className="flex items-baseline gap-3">
        <div className="text-sm font-semibold">CV Builder</div>
        <div className="text-xs text-zinc-500">
          Live preview • ATS-friendly
          {issueCount ? (
            <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-amber-800">
              {issueCount} issue{issueCount === 1 ? '' : 's'}
            </span>
          ) : null}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setTemplate(template === 'classic' ? 'modern' : 'classic')}
          className="h-9 rounded-lg border border-zinc-300 bg-white px-3 text-sm hover:bg-zinc-50"
          aria-label="Toggle template"
        >
          Template: <span className="font-semibold">{templates.find((t) => t.key === template)?.label}</span>
        </button>

        <button
          type="button"
          onClick={() => exportPdf(print)}
          className="h-9 rounded-lg bg-zinc-950 px-3 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Export PDF
        </button>

        <button
          type="button"
          onClick={reset}
          className="h-9 rounded-lg border border-zinc-300 bg-white px-3 text-sm hover:bg-zinc-50"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

