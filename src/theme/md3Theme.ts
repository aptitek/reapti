import type { ThemeTokens } from './types.ts';

/**
 * Material Design 3 Design Theme
 *
 * Canonical theme featuring MD3 color roles, typography, elevation, and shape geometry.
 */
export const md3Theme: ThemeTokens = {
  name: 'md3',
  light: {
    colors: {
      primary: '#006874',
      onPrimary: '#ffffff',
      primaryContainer: '#97f0ff',
      onPrimaryContainer: '#001f24',
      secondary: '#4a6267',
      onSecondary: '#ffffff',
      secondaryContainer: '#cde7ed',
      onSecondaryContainer: '#051f23',
      tertiary: '#535e7d',
      onTertiary: '#ffffff',
      tertiaryContainer: '#dae2ff',
      onTertiaryContainer: '#0f1b37',
      background: '#f8fafb',
      surface: '#f8fafb',
      onSurface: '#191c1d',
      surfaceContainer: '#eceeef',
      surfaceContainerHigh: '#e6e9ea',
      onSurfaceVariant: '#3f484a',
      outline: '#6f797a',
      outlineVariant: '#bfc8ca',
    },
    elevation: {
      level0: 'none',
      level1:
        '0 1px 3px 1px rgba(0, 0, 0, 0.15), 0 1px 2px 0 rgba(0, 0, 0, 0.30)',
      level2:
        '0 2px 6px 2px rgba(0, 0, 0, 0.15), 0 1px 2px 0 rgba(0, 0, 0, 0.30)',
      level3:
        '0 4px 8px 3px rgba(0, 0, 0, 0.15), 0 1px 3px 0 rgba(0, 0, 0, 0.30)',
      level4:
        '0 6px 10px 4px rgba(0, 0, 0, 0.15), 0 2px 3px 0 rgba(0, 0, 0, 0.30)',
    },
  },
  dark: {
    colors: {
      primary: '#80d5e3',
      onPrimary: '#00363d',
      primaryContainer: '#004f58',
      onPrimaryContainer: '#97f0ff',
      secondary: '#b1cbd1',
      onSecondary: '#1c3438',
      secondaryContainer: '#334a4f',
      onSecondaryContainer: '#cde7ed',
      tertiary: '#bac6ea',
      onTertiary: '#25304d',
      tertiaryContainer: '#3c4665',
      onTertiaryContainer: '#dae2ff',
      background: '#191c1d',
      surface: '#191c1d',
      onSurface: '#e1e3e4',
      surfaceContainer: '#1b1f20',
      surfaceContainerHigh: '#25292a',
      onSurfaceVariant: '#bfc8ca',
      outline: '#899294',
      outlineVariant: '#3f484a',
    },
    elevation: {
      level0: 'none',
      level1:
        '0 1px 3px 1px rgba(0, 0, 0, 0.30), 0 1px 2px 0 rgba(0, 0, 0, 0.40)',
      level2:
        '0 2px 6px 2px rgba(0, 0, 0, 0.30), 0 1px 2px 0 rgba(0, 0, 0, 0.40)',
      level3:
        '0 4px 8px 3px rgba(0, 0, 0, 0.30), 0 1px 3px 0 rgba(0, 0, 0, 0.40)',
      level4:
        '0 6px 10px 4px rgba(0, 0, 0, 0.30), 0 2px 3px 0 rgba(0, 0, 0, 0.40)',
    },
  },
  radii: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '28px',
    full: '9999px',
  },
  typography: {
    titleFamily: "'Roboto', system-ui, -apple-system, sans-serif",
    bodyFamily: "'Roboto', system-ui, -apple-system, sans-serif",
    bodyVariation: 'normal',
    baseFontSize: '16px',
    minFontSize: '12px',
    lineHeightRelaxed: '1.5',
  },
  motion: {
    durationFast: '200ms',
    durationNormal: '400ms',
    durationSlow: '600ms',
    easingOrganic: 'cubic-bezier(0.2, 0, 0, 1)',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    relaxed: '24px',
    airy: '40px',
    spacious: '56px',
  },
};
