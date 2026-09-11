import { useRef, useEffect, useCallback } from 'react';
import type { RefObject } from 'react';

export interface HoloOffsets {
  bgSizeX: number;
  bgSizeY: number;
  offsetX: number;
  offsetY: number;
}

export interface UseHoloDecoratorProps {
  active?: boolean;
  type?: 'text' | 'image';
  maskUrl?: string;
  maskSize?: string;
}

export function calculateHoloOffsets(
  elementRect: DOMRect,
  cardRect: DOMRect
): HoloOffsets {
  return {
    bgSizeX: cardRect.width,
    bgSizeY: cardRect.height,
    offsetX: elementRect.left - cardRect.left,
    offsetY: elementRect.top - cardRect.top,
  };
}

export function findParentCard(
  element: HTMLElement | null
): HTMLElement | null {
  if (!element) return null;
  return element.closest('.physics-card, .physic-card, .flip-card');
}

export function applyHoloProperties(
  element: HTMLElement | null,
  offsets: HoloOffsets,
  maskOptions?: { maskUrl?: string; maskSize?: string }
): void {
  if (!element) return;
  element.style.setProperty('--holo-bg-size-x', `${offsets.bgSizeX}px`);
  element.style.setProperty('--holo-bg-size-y', `${offsets.bgSizeY}px`);
  element.style.setProperty('--holo-offset-x', `${offsets.offsetX}px`);
  element.style.setProperty('--holo-offset-y', `${offsets.offsetY}px`);

  if (maskOptions?.maskUrl) {
    const isDirectCss =
      maskOptions.maskUrl.includes('url(') ||
      maskOptions.maskUrl.includes('-gradient');
    const maskVal = isDirectCss
      ? maskOptions.maskUrl
      : `url("${maskOptions.maskUrl}")`;
    element.style.setProperty('--holo-mask-url', maskVal);
  }
  if (maskOptions?.maskSize) {
    element.style.setProperty('--holo-mask-size', maskOptions.maskSize);
  }
}

export function setupHoloObserver(
  element: HTMLElement,
  card: HTMLElement,
  onUpdate: () => void
): () => void {
  onUpdate();
  if (typeof ResizeObserver === 'undefined') return () => {};

  const observer = new ResizeObserver(onUpdate);
  observer.observe(card);
  observer.observe(element);

  return () => observer.disconnect();
}

export function syncHoloElement(
  el: HTMLElement | null,
  options: UseHoloDecoratorProps
): void {
  if (!el) return;
  const card = findParentCard(el);
  if (!card) return;

  const offsets = calculateHoloOffsets(
    el.getBoundingClientRect(),
    card.getBoundingClientRect()
  );
  applyHoloProperties(el, offsets, options);
}

export function createHoloLifecycle(
  wrapperRef: RefObject<HTMLDivElement | null>,
  options: UseHoloDecoratorProps
): () => void {
  if (!options.active && options.active !== undefined) return () => {};
  const el = wrapperRef.current;
  if (!el) return () => {};
  const card = findParentCard(el);
  if (!card) return () => {};

  return setupHoloObserver(el, card, () => syncHoloElement(el, options));
}

export function useHoloDecorator(props: UseHoloDecoratorProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const syncOffsets = useCallback(() => {
    syncHoloElement(wrapperRef.current, props);
  }, [props]);

  const handleLifecycle = useCallback(() => {
    return createHoloLifecycle(wrapperRef, props);
  }, [props]);

  useEffect(handleLifecycle, [handleLifecycle]);

  return { wrapperRef, syncOffsets, handleLifecycle };
}
