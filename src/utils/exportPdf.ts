import type { RefObject } from 'react';
import type { UseReactToPrintFn } from 'react-to-print';

export type PrintTargetRef = RefObject<HTMLElement | null>;

export function exportPdf(printFn: UseReactToPrintFn) {
  printFn();
}


