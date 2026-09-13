import { useState, useCallback, useEffect } from 'react';
import type { PrintPageViewMode } from './PrintPage.types.ts';
import { clampPage, isPlaywrightEnvironment } from './printPageHelpers.ts';

export interface UsePrintPageOptions {
  readonly totalPages: number;
  readonly defaultMode?: PrintPageViewMode;
  readonly initialPage?: number;
  readonly controlledMode?: PrintPageViewMode;
  readonly onModeChange?: (mode: PrintPageViewMode) => void;
  readonly isPdf?: boolean;
}

export interface UsePrintPageReturn {
  readonly viewMode: PrintPageViewMode;
  readonly setViewMode: (mode: PrintPageViewMode) => void;
  readonly currentPage: number;
  readonly targetPage: number;
  readonly goToPage: (page: number) => void;
  readonly nextPage: () => void;
  readonly prevPage: () => void;
  readonly completeFlip: () => void;
  readonly isPdfMode: boolean;
  readonly flipDirection: 'next' | 'prev' | 'idle';
}

interface KeyboardNavOptions {
  readonly activeMode: PrintPageViewMode;
  readonly isPdfMode: boolean;
  readonly nextPage: () => void;
  readonly prevPage: () => void;
}

function usePrintPageKeyboardNavigation({
  activeMode,
  isPdfMode,
  nextPage,
  prevPage,
}: KeyboardNavOptions) {
  useEffect(() => {
    if (activeMode === 'vertical' || isPdfMode) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        nextPage();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        prevPage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeMode, isPdfMode, nextPage, prevPage]);
}

interface PageNavOptions {
  readonly totalPages: number;
  readonly initialPage: number;
  readonly isFlipMode: boolean;
}

function usePageNavigation({
  totalPages,
  initialPage,
  isFlipMode,
}: PageNavOptions) {
  const [currentPage, setCurrentPage] = useState<number>(
    clampPage(initialPage, totalPages)
  );
  const [targetPage, setTargetPage] = useState<number>(
    clampPage(initialPage, totalPages)
  );
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev' | 'idle'>(
    'idle'
  );

  const completeFlip = useCallback(() => {
    setCurrentPage(targetPage);
    setFlipDirection('idle');
  }, [targetPage]);

  const triggerNav = useCallback(
    (next: number, dir: 'next' | 'prev') => {
      if (flipDirection !== 'idle') return;
      if (!isFlipMode) {
        setCurrentPage(next);
        setTargetPage(next);
      } else {
        setTargetPage(next);
        setFlipDirection(dir);
        if (typeof window !== 'undefined') {
          window.setTimeout(() => {
            setCurrentPage(next);
            setFlipDirection('idle');
          }, 650);
        }
      }
    },
    [flipDirection, isFlipMode]
  );

  const nextPage = useCallback(() => {
    if (currentPage < totalPages) triggerNav(currentPage + 1, 'next');
  }, [currentPage, totalPages, triggerNav]);

  const prevPage = useCallback(() => {
    if (currentPage > 1) triggerNav(currentPage - 1, 'prev');
  }, [currentPage, triggerNav]);

  const goToPage = useCallback(
    (page: number) => {
      const next = clampPage(page, totalPages);
      if (next !== currentPage) {
        triggerNav(next, next > currentPage ? 'next' : 'prev');
      }
    },
    [currentPage, totalPages, triggerNav]
  );

  return {
    currentPage,
    targetPage,
    goToPage,
    nextPage,
    prevPage,
    completeFlip,
    flipDirection,
  };
}

export function usePrintPage({
  totalPages,
  defaultMode = 'vertical',
  initialPage = 1,
  controlledMode,
  onModeChange,
  isPdf,
}: UsePrintPageOptions): UsePrintPageReturn {
  const [internalMode, setInternalMode] =
    useState<PrintPageViewMode>(defaultMode);

  const isPdfMode = isPdf ?? isPlaywrightEnvironment();
  const activeMode: PrintPageViewMode = isPdfMode
    ? 'vertical'
    : (controlledMode ?? internalMode);

  const {
    currentPage,
    targetPage,
    goToPage,
    nextPage,
    prevPage,
    completeFlip,
    flipDirection,
  } = usePageNavigation({
    totalPages,
    initialPage,
    isFlipMode: activeMode === 'flip',
  });

  const setViewMode = useCallback(
    (nextMode: PrintPageViewMode) => {
      setInternalMode(nextMode);
      onModeChange?.(nextMode);
    },
    [onModeChange]
  );

  usePrintPageKeyboardNavigation({
    activeMode,
    isPdfMode,
    nextPage,
    prevPage,
  });

  return {
    viewMode: activeMode,
    setViewMode,
    currentPage,
    targetPage,
    goToPage,
    nextPage,
    prevPage,
    completeFlip,
    isPdfMode,
    flipDirection,
  };
}
