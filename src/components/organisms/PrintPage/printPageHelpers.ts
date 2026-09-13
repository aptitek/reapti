import { Children, isValidElement, Fragment, type ReactNode } from 'react';

function checkQueryString(search: string): boolean {
  return (
    search.includes('print=true') ||
    search.includes('pdf=true') ||
    search.includes('exportPdf=true')
  );
}

function checkGlobalFlag(): boolean {
  return Boolean(
    (window as unknown as { __PLAYWRIGHT_PDF__?: boolean }).__PLAYWRIGHT_PDF__
  );
}

/**
 * Checks if running inside Playwright PDF generation or print emulation.
 */
export function isPlaywrightEnvironment(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  const isQueryMatch = checkQueryString(window.location?.search ?? '');
  const isFlagMatch = checkGlobalFlag();
  const isAttrMatch =
    typeof document !== 'undefined' &&
    document.documentElement?.getAttribute('data-playwright-pdf') === 'true';

  return isQueryMatch || isFlagMatch || isAttrMatch;
}

/**
 * Clamps a 1-based page number within [1, totalPages].
 */
export function clampPage(page: number, totalPages: number): number {
  const safeTotal = Math.max(1, Math.floor(totalPages));
  const safePage = Math.floor(page);
  return Math.min(Math.max(1, safePage), safeTotal);
}

/**
 * Formats a standard page indicator string, e.g. "1 / 4".
 */
export function formatPageIndicator(
  currentPage: number,
  totalPages: number
): string {
  const safeCurrent = clampPage(currentPage, totalPages);
  const safeTotal = Math.max(1, Math.floor(totalPages));
  return `${safeCurrent} / ${safeTotal}`;
}

/**
 * Unwraps React children or fragments into an array of page nodes.
 */
export function extractPagesFromChildren(children: ReactNode): ReactNode[] {
  if (children == null) {
    return [];
  }
  const result: ReactNode[] = [];
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) {
      if (child != null && child !== false) {
        result.push(child);
      }
      return;
    }
    // If it's a React Fragment, unwrap its children
    if (child.type === Fragment) {
      const fragmentProps = child.props as { children?: ReactNode };
      result.push(...extractPagesFromChildren(fragmentProps.children));
    } else {
      result.push(child);
    }
  });
  return result;
}
