import type { RefObject } from 'react';
import { CVDocument } from '../preview/CVDocument';

export function PreviewPanel(props: { printRef: RefObject<HTMLDivElement | null> }) {
  return (
    <div className="p-4">
      <CVDocument ref={props.printRef} />
    </div>
  );
}

