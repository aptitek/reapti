import { useSyncExternalStore } from 'react';
import type { HeroTickerThemeMode } from './HeroTicker.types.ts';
import { resolveHeroTickerDark } from './heroTickerHelpers.ts';

export function isDocumentDark(): boolean {
  if (typeof document === 'undefined') return false;
  const doc = document.documentElement;
  if (!doc) return false;
  const theme = doc.getAttribute('data-theme');
  const mode = doc.getAttribute('data-mode');
  return theme === 'dark' || mode === 'dark' || doc.classList.contains('dark');
}

export function isSystemDark(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
}

export function checkSystemOrDocumentDark(): boolean {
  if (typeof window === 'undefined') return false;
  return isDocumentDark() || isSystemDark();
}

export function createThemeMutationObserver(
  onStoreChange: () => void
): MutationObserver | null {
  if (typeof MutationObserver === 'undefined') return null;
  const observer = new MutationObserver(onStoreChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme', 'data-mode', 'class'],
  });
  return observer;
}

export function listenMediaQuery(
  onStoreChange: () => void
): (() => void) | null {
  if (typeof window.matchMedia !== 'function') return null;
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener?.('change', onStoreChange);
  return () => mediaQuery.removeEventListener?.('change', onStoreChange);
}

export function subscribeToThemeChanges(onStoreChange: () => void): () => void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return () => {};
  }
  const observer = createThemeMutationObserver(onStoreChange);
  const unlistenMedia = listenMediaQuery(onStoreChange);

  return () => {
    observer?.disconnect?.();
    unlistenMedia?.();
  };
}

export function useHeroTickerTheme(
  mode: HeroTickerThemeMode = 'auto'
): boolean {
  const isDocDark = useSyncExternalStore(
    subscribeToThemeChanges,
    checkSystemOrDocumentDark,
    checkSystemOrDocumentDark
  );
  return resolveHeroTickerDark(mode, isDocDark);
}
