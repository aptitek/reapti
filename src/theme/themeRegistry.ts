import type { ThemeTokens } from './types.ts';
import { solarizedTheme } from './solarizedTheme.ts';
import { md3Theme } from './md3Theme.ts';
import { exoticTheme } from './exoticTheme.ts';

export const THEME_REGISTRY: Record<string, ThemeTokens> = {
  solarized: solarizedTheme,
  md3: md3Theme,
  exotic: exoticTheme,
};

export const DEFAULT_THEME_NAME = 'solarized';

/**
 * Registers a new theme into the global registry.
 */
export function registerTheme(theme: ThemeTokens): void {
  THEME_REGISTRY[theme.name] = theme;
}

/**
 * Retrieves a theme by name, falling back to Solarized.
 */
export function getTheme(name: string = DEFAULT_THEME_NAME): ThemeTokens {
  return THEME_REGISTRY[name] ?? solarizedTheme;
}
