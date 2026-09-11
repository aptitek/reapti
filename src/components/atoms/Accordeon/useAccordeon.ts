import { useState, useRef, useEffect, useCallback, useId } from 'react';
import type { KeyboardEvent, RefObject } from 'react';

export interface AccordeonHookOptions {
  panels?: number;
  folds?: number;
  isFolded?: boolean;
  defaultFolded?: boolean;
  onToggle?: (isFolded: boolean) => void;
  maxAngle?: number;
  perspective?: number;
  ariaLabel?: string;
}

export function resolvePanelCount(panels?: number, folds?: number): number {
  if (typeof folds === 'number' && !Number.isNaN(folds) && folds > 0) {
    return Math.max(2, Math.floor(folds) * 2);
  }
  if (typeof panels === 'number' && !Number.isNaN(panels) && panels > 0) {
    const p = Math.floor(panels);
    return Math.max(2, p % 2 === 0 ? p : p + 1);
  }
  return 4;
}

export function generateAccordeonClipPaths(panelCount: number, depth = 4) {
  const topUnfolded: string[] = [];
  const topFolded: string[] = [];
  const step = 100 / panelCount;

  for (let i = 0; i <= panelCount; i++) {
    const x = Math.round(i * step * 100) / 100;
    const isValley = i % 2 === 1;
    topUnfolded.push(`${x}% 0%`);
    topFolded.push(`${x}% ${isValley ? depth : 0}%`);
  }

  const bottomUnfolded: string[] = [];
  const bottomFolded: string[] = [];

  for (let i = panelCount; i >= 0; i--) {
    const x = Math.round(i * step * 100) / 100;
    const isValley = i % 2 === 1;
    bottomUnfolded.push(`${x}% 100%`);
    bottomFolded.push(`${x}% ${isValley ? 100 - depth : 100}%`);
  }

  const unfolded = `polygon(${[...topUnfolded, ...bottomUnfolded].join(', ')})`;
  const folded = `polygon(${[...topFolded, ...bottomFolded].join(', ')})`;

  return { unfolded, folded };
}

export function applyAccordeonVariables(
  container: HTMLElement | null,
  options: {
    panelCount: number;
    perspective: number;
    maxAngle: number;
  }
): void {
  if (!container) return;
  container.style.setProperty('--accordeon-panels', String(options.panelCount));
  container.style.setProperty(
    '--accordeon-perspective',
    `${options.perspective}px`
  );
  container.style.setProperty(
    '--accordeon-max-angle',
    `${options.maxAngle}deg`
  );
  const { unfolded, folded } = generateAccordeonClipPaths(options.panelCount);
  container.style.setProperty('--accordeon-clip-unfolded', unfolded);
  container.style.setProperty('--accordeon-clip-folded', folded);
}

export interface ToggleFoldOptions {
  currentFolded: boolean;
  isControlled: boolean;
  setInternal: (next: boolean) => void;
  onToggle?: (next: boolean) => void;
}

export function toggleAccordeonFold(options: ToggleFoldOptions): boolean {
  const next = !options.currentFolded;
  if (!options.isControlled) {
    options.setInternal(next);
  }
  options.onToggle?.(next);
  return next;
}

export function triggerResizeAfterFold(isFolded: boolean): () => void {
  const timer = setTimeout(() => {
    if (!isFolded && typeof window !== 'undefined') {
      window.dispatchEvent(new Event('resize'));
    }
  }, 600);

  return () => {
    clearTimeout(timer);
  };
}

export interface AccordeonLifecycleOptions {
  containerRef: RefObject<HTMLDivElement | null>;
  isFolded: boolean;
  panelCount: number;
  perspective: number;
  maxAngle: number;
}

function useAccordeonEffects(options: AccordeonLifecycleOptions) {
  const { containerRef, isFolded, panelCount, perspective, maxAngle } = options;

  const syncVariables = useCallback(() => {
    applyAccordeonVariables(containerRef.current, {
      panelCount,
      perspective,
      maxAngle,
    });
  }, [containerRef, panelCount, perspective, maxAngle]);

  const handleResize = useCallback(() => {
    return triggerResizeAfterFold(isFolded);
  }, [isFolded]);

  useEffect(syncVariables, [syncVariables]);
  useEffect(handleResize, [handleResize]);

  return { syncVariables, handleResize };
}

export function useAccordeon({
  panels,
  folds,
  isFolded: controlledIsFolded,
  defaultFolded = false,
  onToggle,
  maxAngle = 0,
  perspective = 1200,
  ariaLabel,
}: AccordeonHookOptions) {
  const isControlled = controlledIsFolded !== undefined;
  const [internalFolded, setInternalFolded] = useState(defaultFolded);
  const isFolded = isControlled ? controlledIsFolded : internalFolded;

  const containerRef = useRef<HTMLDivElement>(null);
  const panelCount = resolvePanelCount(panels, folds);
  const regionId = useId();

  const handleToggle = useCallback(() => {
    return toggleAccordeonFold({
      currentFolded: isFolded,
      isControlled,
      setInternal: setInternalFolded,
      onToggle,
    });
  }, [isFolded, isControlled, onToggle]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleToggle();
      }
    },
    [handleToggle]
  );

  const { syncVariables, handleResize } = useAccordeonEffects({
    containerRef,
    isFolded,
    panelCount,
    perspective,
    maxAngle,
  });

  return {
    isFolded,
    panelCount,
    regionId,
    containerRef,
    handleToggle,
    handleKeyDown,
    syncVariables,
    handleResize,
    ariaLabel,
  };
}
