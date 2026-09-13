import type {
  ThemeMode,
  ResolvedThemeMode,
  ThemeTokens,
  ColorRamp,
  ElevationTokens,
} from './types.ts';

export function resolveNextThemeMode(prev: ThemeMode): ThemeMode {
  return prev === 'dark' ? 'light' : 'dark';
}

function applyColorProperties(target: HTMLElement, colors: ColorRamp): void {
  for (const [key, value] of Object.entries(colors)) {
    if (typeof value === 'string') {
      const kebab = key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
      target.style.setProperty(`--theme-${kebab}`, value);
    }
  }
}

function applyElevationProperties(
  target: HTMLElement,
  elevation: ElevationTokens
): void {
  target.style.setProperty('--theme-elevation-0', elevation.level0);
  target.style.setProperty('--theme-elevation-1', elevation.level1);
  target.style.setProperty('--theme-elevation-2', elevation.level2);
  target.style.setProperty('--theme-elevation-3', elevation.level3);
  target.style.setProperty('--theme-elevation-4', elevation.level4);
}

export function applyThemeVariables(
  mode: ResolvedThemeMode,
  theme: ThemeTokens,
  target: HTMLElement
): void {
  const modeTokens = theme[mode];
  if (!modeTokens || !target.style) return;

  if (modeTokens.colors) {
    applyColorProperties(target, modeTokens.colors);
  }
  if (modeTokens.elevation) {
    applyElevationProperties(target, modeTokens.elevation);
  }
}

export function syncDocumentTheme(
  mode: ResolvedThemeMode,
  theme?: ThemeTokens
): void {
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.setAttribute('data-theme', mode);
    if (theme) {
      document.documentElement.setAttribute('data-theme-name', theme.name);
      applyThemeVariables(mode, theme, document.documentElement);
    }
  }
}

export function resolveCurrentMode(
  mode: ThemeMode,
  detectedMode: ResolvedThemeMode
): ResolvedThemeMode {
  if (mode === 'auto') return detectedMode;
  return mode;
}
