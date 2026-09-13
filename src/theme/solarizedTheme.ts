import type { ThemeTokens } from './types.ts';

/**
 * Solarized Design Theme
 *
 * Canonical theme featuring Solarized color harmonies:
 * - Primary: Solarized Green (#859900 / #9ec43b)
 * - Secondary: Solarized Magenta (#d33682 / #e25c9e)
 * - Tertiary: Solarized Blue (#268bd2 / #4ba3e3)
 * - Typography: Milkshake for titles, Recursive Casual for body
 * - Geometry: Quite rounded pill surfaces
 * - Elevation: Soft shadows in light mode, luminous specular highlights in dark mode
 * - Spacing: Relaxed and spacious layout rhythm
 * - Motion: Deliberate, slightly slow transitions
 */
export const solarizedTheme: ThemeTokens = {
  name: 'solarized',
  light: {
    colors: {
      primary: '#859900',
      onPrimary: '#fdf6e3',
      primaryContainer: '#eef5ce',
      onPrimaryContainer: '#073642',
      secondary: '#d33682',
      onSecondary: '#fdf6e3',
      secondaryContainer: '#fde4ef',
      onSecondaryContainer: '#073642',
      tertiary: '#268bd2',
      onTertiary: '#fdf6e3',
      tertiaryContainer: '#d8eefc',
      onTertiaryContainer: '#073642',
      error: '#dc322f',
      onError: '#fdf6e3',
      errorContainer: '#fdd9d7',
      onErrorContainer: '#4c1010',
      background: '#fdf6e3',
      onBackground: '#073642',
      surface: '#eee8d5',
      onSurface: '#073642',
      surfaceVariant: '#f5eedc',
      onSurfaceVariant: '#586e75',
      surfaceDim: '#e6dfca',
      surfaceBright: '#fdf6e3',
      surfaceContainerLowest: '#fdf6e3',
      surfaceContainerLow: '#f9f2e0',
      surfaceContainer: '#f5eedc',
      surfaceContainerHigh: '#ebe3cd',
      surfaceContainerHighest: '#e3dbbe',
      outline: 'rgba(7, 54, 66, 0.20)',
      outlineVariant: 'rgba(7, 54, 66, 0.10)',
      shadow: 'rgba(7, 54, 66, 0.25)',
      scrim: 'rgba(0, 43, 54, 0.60)',
      inverseSurface: '#073642',
      inverseOnSurface: '#fdf6e3',
      inversePrimary: '#9ec43b',
      surfaceTint: '#859900',
    },
    elevation: {
      level0: 'none',
      level1:
        '0 4px 14px -2px rgba(7, 54, 66, 0.08), 0 1px 3px -1px rgba(7, 54, 66, 0.04)',
      level2:
        '0 8px 24px -4px rgba(7, 54, 66, 0.10), 0 2px 6px -1px rgba(7, 54, 66, 0.05)',
      level3:
        '0 14px 36px -6px rgba(7, 54, 66, 0.14), 0 4px 12px -2px rgba(7, 54, 66, 0.06)',
      level4:
        '0 24px 52px -10px rgba(7, 54, 66, 0.18), 0 6px 18px -3px rgba(7, 54, 66, 0.08)',
    },
  },
  dark: {
    colors: {
      primary: '#9ec43b',
      onPrimary: '#002b36',
      primaryContainer: '#24420e',
      onPrimaryContainer: '#d8f085',
      secondary: '#e25c9e',
      onSecondary: '#002b36',
      secondaryContainer: '#4e1232',
      onSecondaryContainer: '#ffb6d8',
      tertiary: '#4ba3e3',
      onTertiary: '#002b36',
      tertiaryContainer: '#0e3550',
      onTertiaryContainer: '#c5e5fd',
      error: '#dc322f',
      onError: '#002b36',
      errorContainer: '#4c1010',
      onErrorContainer: '#ffb4ab',
      background: '#002b36',
      onBackground: '#fdf6e3',
      surface: '#073642',
      onSurface: '#fdf6e3',
      surfaceVariant: '#0a3d4a',
      onSurfaceVariant: '#839496',
      surfaceDim: '#00242e',
      surfaceBright: '#0f4857',
      surfaceContainerLowest: '#002028',
      surfaceContainerLow: '#042831',
      surfaceContainer: '#0a3d4a',
      surfaceContainerHigh: '#0f4857',
      surfaceContainerHighest: '#155364',
      outline: 'rgba(147, 161, 161, 0.22)',
      outlineVariant: 'rgba(147, 161, 161, 0.12)',
      shadow: 'rgba(0, 43, 54, 0.70)',
      scrim: 'rgba(0, 43, 54, 0.85)',
      inverseSurface: '#eee8d5',
      inverseOnSurface: '#073642',
      inversePrimary: '#859900',
      surfaceTint: '#9ec43b',
    },
    elevation: {
      level0: 'none',
      level1:
        'inset 0 1px 0 0 rgba(253, 246, 227, 0.14), 0 0 0 1px rgba(158, 196, 59, 0.18)',
      level2:
        'inset 0 1px 0 0 rgba(253, 246, 227, 0.22), 0 0 0 1px rgba(158, 196, 59, 0.26), 0 0 20px -2px rgba(158, 196, 59, 0.16)',
      level3:
        'inset 0 1.5px 0 0 rgba(253, 246, 227, 0.30), 0 0 0 1px rgba(158, 196, 59, 0.34), 0 0 32px -4px rgba(158, 196, 59, 0.24)',
      level4:
        'inset 0 2px 0 0 rgba(253, 246, 227, 0.38), 0 0 0 1.5px rgba(158, 196, 59, 0.42), 0 0 48px -6px rgba(158, 196, 59, 0.32)',
    },
  },
  radii: {
    xs: '10px',
    sm: '16px',
    md: '24px',
    lg: '32px',
    xl: '40px',
    full: '9999px',
  },
  typography: {
    titleFamily: "'Milkshake', cursive, sans-serif",
    bodyFamily: "'Recursive', system-ui, -apple-system, sans-serif",
    bodyVariation: "'CASL' 1, 'CRSV' 0.5",
    baseFontSize: '16px',
    minFontSize: '12px',
    lineHeightRelaxed: '1.68',
  },
  motion: {
    durationFast: '240ms',
    durationNormal: '420ms',
    durationSlow: '650ms',
    easingOrganic: 'cubic-bezier(0.22, 1, 0.36, 1)',
  },
  spacing: {
    xs: '6px',
    sm: '12px',
    md: '20px',
    lg: '28px',
    xl: '36px',
    relaxed: '28px',
    airy: '44px',
    spacious: '64px',
  },
};
