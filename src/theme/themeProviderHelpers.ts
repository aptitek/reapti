import type { ThemeMode, ResolvedThemeMode } from './types.ts';

export function resolveNextThemeMode(prev: ThemeMode): ThemeMode {
  return prev === 'dark' ? 'light' : 'dark';
}

export function syncDocumentTheme(mode: ResolvedThemeMode): void {
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.setAttribute('data-theme', mode);
  }
}

export function resolveCurrentMode(
  mode: ThemeMode,
  detectedMode: ResolvedThemeMode
): ResolvedThemeMode {
  if (mode === 'auto') return detectedMode;
  return mode;
}
