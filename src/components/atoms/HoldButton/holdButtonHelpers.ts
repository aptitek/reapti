import { createElement, useState, useEffect } from 'react';
import type {
  ReactNode,
  RefObject,
  PointerEvent as ReactPointerEvent,
  KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import type { RectBounds } from '../../../tokens/shapes.ts';
import type { useInteractiveShape } from '../../../hooks/useInteractiveShape.ts';
import type {
  HoldButtonProps,
  HoldButtonBorderWidth,
  HoldButtonSpacing,
} from './HoldButton.types.ts';

export interface HoldDimensionsBounds extends RectBounds {
  rootWidth: number;
  rootHeight: number;
  padding: number;
}

export function resolveBorderWidth(width?: HoldButtonBorderWidth): number {
  if (typeof width === 'number') return Math.max(0, width);
  if (width === 'none') return 0;
  if (width === 'thin') return 1;
  if (width === 'medium') return 2;
  if (width === 'heavy') return 4;
  return 3;
}

export function resolveBorderSpacing(spacing?: HoldButtonSpacing): number {
  if (typeof spacing === 'number') return Math.max(0, spacing);
  if (spacing === 'none') return 0;
  if (spacing === 'compact') return 2;
  if (spacing === 'relaxed') return 8;
  return 4;
}

export interface StrokeBoundsOptions {
  strokeWidth?: number;
  spacing?: number;
}

export function computeStrokeBounds(
  width: number,
  height: number,
  options: StrokeBoundsOptions = {}
): HoldDimensionsBounds {
  const strokeWidth = options.strokeWidth ?? 3;
  const spacing = options.spacing ?? 4;
  const pad = spacing + strokeWidth;
  const rootWidth = width + 2 * pad;
  const rootHeight = height + 2 * pad;
  const half = strokeWidth / 2;
  return {
    x: half,
    y: half,
    width: Math.max(0, rootWidth - strokeWidth),
    height: Math.max(0, rootHeight - strokeWidth),
    rootWidth,
    rootHeight,
    padding: pad,
  };
}

export function resolveInitialBounds(
  strokeWidth = 3,
  spacing = 4
): HoldDimensionsBounds {
  return computeStrokeBounds(120, 40, { strokeWidth, spacing });
}

export function observeHoldDimensions(
  el: HTMLElement | null,
  options: StrokeBoundsOptions,
  onUpdate: (bounds: HoldDimensionsBounds) => void
): () => void {
  if (!el) return () => {};
  const update = () => {
    const shapeEl = el.querySelector('m3e-shape') as HTMLElement | null;
    const target = shapeEl ?? el;
    const w = target.offsetWidth || 120;
    const h = target.offsetHeight || 40;
    onUpdate(computeStrokeBounds(w, h, options));
  };
  update();
  if (typeof ResizeObserver === 'undefined') return () => {};
  const observer = new ResizeObserver(update);
  const shapeEl = el.querySelector('m3e-shape');
  if (shapeEl) observer.observe(shapeEl);
  observer.observe(el);
  return () => observer.disconnect();
}

export function useHoldDimensions(
  rootRef: RefObject<HTMLElement | null>,
  borderWidth = 3,
  borderSpacing = 4
): HoldDimensionsBounds {
  const [bounds, setBounds] = useState<HoldDimensionsBounds>(() =>
    resolveInitialBounds(borderWidth, borderSpacing)
  );

  useEffect(
    () =>
      observeHoldDimensions(
        rootRef.current,
        { strokeWidth: borderWidth, spacing: borderSpacing },
        setBounds
      ),
    [rootRef, borderWidth, borderSpacing]
  );

  return bounds;
}

export interface StyleSyncOptions {
  holdingTime?: number;
  retractDuration?: number;
  borderWidth?: number;
  borderSpacing?: number;
  borderColor?: string;
}

export interface BorderSvgOptions {
  width: number;
  height: number;
  strokeWidth: number;
  dataTestId?: string;
}

/**
 * Synchronizes dynamic CSS variables onto the DOM root element directly,
 * bypassing inline style attributes in JSX.
 */
export function syncHoldButtonStyles(
  element: HTMLElement | null,
  options: StyleSyncOptions
): void {
  if (!element) return;
  const {
    holdingTime = 1000,
    retractDuration = 350,
    borderWidth = 3,
    borderSpacing = 4,
    borderColor,
  } = options;

  element.style.setProperty('--hold-duration', `${holdingTime}ms`);
  element.style.setProperty('--hold-retract-duration', `${retractDuration}ms`);
  element.style.setProperty('--hold-border-width', `${borderWidth}px`);
  element.style.setProperty('--hold-border-spacing', `${borderSpacing}px`);

  if (borderColor) {
    element.style.setProperty('--hold-border-color', borderColor);
  } else {
    element.style.removeProperty('--hold-border-color');
  }
}

/**
 * Builds the SVG overlay and animated path with normalized pathLength="1000",
 * constructed via React.createElement to honor intrinsic tag ESLint restrictions.
 */
export function renderBorderSvg(
  borderPath: string,
  options: BorderSvgOptions
): ReactNode {
  const { width, height, dataTestId } = options;
  const w = Math.max(1, Math.round(width));
  const h = Math.max(1, Math.round(height));

  const pathElement = createElement('path', {
    d: borderPath,
    pathLength: 1000,
    className: 'hold-button_border-path',
    'data-testid': dataTestId ? `${dataTestId}-border-path` : undefined,
  });

  return createElement(
    'svg',
    {
      viewBox: `0 0 ${w} ${h}`,
      className: 'hold-button_border-svg',
      'aria-hidden': 'true',
      'data-testid': dataTestId ? `${dataTestId}-border-svg` : undefined,
    },
    pathElement
  );
}

export interface EventBindingsOptions {
  props: HoldButtonProps;
  hasCompletedRef: RefObject<boolean>;
  startHold: () => void;
  endHold: (evalBrief?: boolean) => void;
  shapeState: ReturnType<typeof useInteractiveShape<HTMLElement>>;
}

export function createHoldEventHandlers(options: EventBindingsOptions) {
  const { props, hasCompletedRef, startHold, endHold, shapeState } = options;

  const handlePointerDown = (e: ReactPointerEvent<HTMLElement>) => {
    if (e.button === 0) startHold();
    props.onPointerDown?.(e);
  };
  const handlePointerUp = (e: ReactPointerEvent<HTMLElement>) => {
    endHold(true);
    props.onPointerUp?.(e);
  };
  const handlePointerLeave = (e: ReactPointerEvent<HTMLElement>) => {
    shapeState.handlePointerLeave(e);
    endHold(false);
    props.onPointerLeave?.(e);
  };
  const handleKeyDown = (e: ReactKeyboardEvent<HTMLElement>) => {
    if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) {
      if (e.key === ' ') e.preventDefault();
      startHold();
    }
    props.onKeyDown?.(e);
  };
  const handleKeyUp = (e: ReactKeyboardEvent<HTMLElement>) => {
    if (e.key === ' ' || e.key === 'Enter') endHold(true);
    props.onKeyUp?.(e);
  };
  const handleClick = (e: Event) => {
    if (hasCompletedRef.current) {
      props.onClick?.(e);
    } else {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return {
    onPointerEnter: shapeState.handlePointerEnter,
    onPointerLeave: handlePointerLeave,
    onFocus: shapeState.handleFocus,
    onBlur: shapeState.handleBlur,
    onPointerDown: handlePointerDown,
    onPointerUp: handlePointerUp,
    onPointerCancel: handlePointerLeave,
    onKeyDown: handleKeyDown,
    onKeyUp: handleKeyUp,
    onClick: handleClick,
  };
}
