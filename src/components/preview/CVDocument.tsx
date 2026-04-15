import { forwardRef, useEffect, useRef, useState, type ForwardedRef } from 'react';
import { useCVStore } from '../../store/cvStore';
import { Classic } from './templates/Classic';
import { Modern } from './templates/Modern';

function assignRef<T>(ref: ForwardedRef<T> | undefined, value: T | null) {
  if (!ref) return;
  if (typeof ref === 'function') ref(value);
  else ref.current = value;
}

export const CVDocument = forwardRef<HTMLDivElement>(function CVDocument(_, ref) {
  const cv = useCVStore((s) => s.cv);
  const template = useCVStore((s) => s.template);

  const innerRef = useRef<HTMLDivElement | null>(null);
  const setRef = (node: HTMLDivElement | null) => {
    innerRef.current = node;
    assignRef(ref, node);
  };

  const [pages, setPages] = useState(1);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const height = el.scrollHeight;
      const p = Math.max(1, Math.ceil(height / 1123));
      setPages(p);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="flex justify-center">
      <div className="w-full">
        {pages > 1 ? (
          <div className="mb-2 text-center text-xs font-medium text-zinc-500 print:hidden">
            Page 2{pages > 2 ? `–${pages}` : ''}
          </div>
        ) : null}

        <div
          ref={setRef}
          id="cv-document"
          className={[
            'rounded-md bg-white text-zinc-950 shadow-sm print:shadow-none',
          ].join(' ')}
          style={{ width: 794 }}
        >
          {template === 'modern' ? (
            <Modern cv={cv} />
          ) : (
            <div className="px-10 py-10">
              <Classic cv={cv} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

