import { useEffect, useRef, useState, type RefObject } from 'react';
import { CVDocument } from '../preview/CVDocument';

export function PreviewPanel(props: { printRef: RefObject<HTMLDivElement | null> }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const A4_WIDTH = 794;
    const update = () => {
      const panelWidth = el.clientWidth;
      if (!panelWidth) return;
      const next = panelWidth / A4_WIDTH;
      setScale(Math.min(1, next));
    };

    update();
    const ro = new ResizeObserver(() => update());
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="overflow-x-hidden p-4">
      <div
        className="flex justify-center"
        style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
      >
        <CVDocument ref={props.printRef} />
      </div>
    </div>
  );
}

