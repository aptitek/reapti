import { useSyncExternalStore } from 'react';

export function subscribeTheme(callback: () => void) {
  if (typeof window === 'undefined') {
    return () => {};
  }
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme', 'data-mode'],
  });
  const mql = window.matchMedia('(prefers-color-scheme: dark)');
  mql.addEventListener('change', callback);
  return () => {
    observer.disconnect();
    mql.removeEventListener('change', callback);
  };
}

export function getThemeSnapshot(): 'dark' | 'light' {
  if (typeof window === 'undefined') return 'light';
  const attr =
    document.documentElement.getAttribute('data-theme') ??
    document.documentElement.getAttribute('data-mode');
  if (attr === 'dark' || attr === 'light') return attr;
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

export function getServerSnapshot(): 'dark' | 'light' {
  return 'light';
}

/**
 * React hook subscribing to active document theme mode changes.
 */
export function useThemeMode(): 'dark' | 'light' {
  return useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getServerSnapshot
  );
}
