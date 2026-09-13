import type { ThemeTokens } from './types.ts';

/**
 * Exotic Dev Testing Theme
 *
 * Designed for visual auditing and automated verification:
 * - Bright, exotic cyber-tropical palette (Electric Mint, Hot Magenta, Vivid Violet, Neon Tangelo)
 * - Zero pure white (#ffffff) or pure black (#000000)
 * - Calibrated contrast ensuring accessibility while making any hardcoded or fallback color immediately apparent.
 */
export const exoticTheme: ThemeTokens = {
  name: 'exotic',
  light: {
    colors: {
      primary: '#00d68f',
      onPrimary: '#0d281e',
      primaryContainer: '#b3ffd9',
      onPrimaryContainer: '#003822',
      secondary: '#ff007f',
      onSecondary: '#2b0014',
      secondaryContainer: '#ffd0e6',
      onSecondaryContainer: '#40001f',
      tertiary: '#7b2cbf',
      onTertiary: '#f5e6ff',
      tertiaryContainer: '#e0aaff',
      onTertiaryContainer: '#240046',
      error: '#ff5400',
      onError: '#330f00',
      errorContainer: '#ffc4a8',
      onErrorContainer: '#4d1600',
      background: '#fef6e4',
      onBackground: '#172c3c',
      surface: '#f3e8ee',
      onSurface: '#271824',
      surfaceVariant: '#e5d4de',
      onSurfaceVariant: '#594553',
      surfaceDim: '#e8dae3',
      surfaceBright: '#fffcf9',
      surfaceContainerLowest: '#fffcf9',
      surfaceContainerLow: '#fbf0f4',
      surfaceContainer: '#f3e8ee',
      surfaceContainerHigh: '#ebdce5',
      surfaceContainerHighest: '#e2cfdc',
      outline: 'rgba(89, 69, 83, 0.35)',
      outlineVariant: 'rgba(89, 69, 83, 0.18)',
      shadow: 'rgba(39, 24, 36, 0.28)',
      scrim: 'rgba(39, 24, 36, 0.70)',
      inverseSurface: '#271824',
      inverseOnSurface: '#f3e8ee',
      inversePrimary: '#00d68f',
      surfaceTint: '#00d68f',
    },
    elevation: {
      level0: 'none',
      level1:
        '0 4px 14px -2px rgba(39, 24, 36, 0.12), 0 1px 3px -1px rgba(39, 24, 36, 0.08)',
      level2:
        '0 8px 24px -4px rgba(39, 24, 36, 0.18), 0 2px 6px -1px rgba(39, 24, 36, 0.10)',
      level3:
        '0 14px 36px -6px rgba(39, 24, 36, 0.22), 0 4px 12px -2px rgba(39, 24, 36, 0.12)',
      level4:
        '0 24px 52px -10px rgba(39, 24, 36, 0.28), 0 6px 18px -3px rgba(39, 24, 36, 0.14)',
    },
  },
  dark: {
    colors: {
      primary: '#00ff9f',
      onPrimary: '#003b22',
      primaryContainer: '#005734',
      onPrimaryContainer: '#a3ffcf',
      secondary: '#ff2a8d',
      onSecondary: '#3d001e',
      secondaryContainer: '#660036',
      onSecondaryContainer: '#ffa6d2',
      tertiary: '#a855f7',
      onTertiary: '#250045',
      tertiaryContainer: '#4c0580',
      onTertiaryContainer: '#dfbaff',
      error: '#ff6b35',
      onError: '#3b1100',
      errorContainer: '#6b2100',
      onErrorContainer: '#ffc2a6',
      background: '#0f0c1b',
      onBackground: '#f5efff',
      surface: '#161226',
      onSurface: '#f5efff',
      surfaceVariant: '#251e3d',
      onSurfaceVariant: '#b5a8cb',
      surfaceDim: '#0e0b19',
      surfaceBright: '#2f274f',
      surfaceContainerLowest: '#0a0714',
      surfaceContainerLow: '#120e20',
      surfaceContainer: '#161226',
      surfaceContainerHigh: '#1f1a34',
      surfaceContainerHighest: '#292344',
      outline: 'rgba(181, 168, 203, 0.35)',
      outlineVariant: 'rgba(181, 168, 203, 0.18)',
      shadow: 'rgba(10, 7, 20, 0.85)',
      scrim: 'rgba(10, 7, 20, 0.95)',
      inverseSurface: '#f5efff',
      inverseOnSurface: '#161226',
      inversePrimary: '#00b875',
      surfaceTint: '#00ff9f',
    },
    elevation: {
      level0: 'none',
      level1:
        'inset 0 1px 0 0 rgba(245, 239, 255, 0.16), 0 0 0 1px rgba(0, 255, 159, 0.25)',
      level2:
        'inset 0 1px 0 0 rgba(245, 239, 255, 0.24), 0 0 0 1px rgba(0, 255, 159, 0.35), 0 0 20px -2px rgba(0, 255, 159, 0.20)',
      level3:
        'inset 0 1.5px 0 0 rgba(245, 239, 255, 0.32), 0 0 0 1px rgba(0, 255, 159, 0.45), 0 0 32px -4px rgba(0, 255, 159, 0.30)',
      level4:
        'inset 0 2px 0 0 rgba(245, 239, 255, 0.40), 0 0 0 1.5px rgba(0, 255, 159, 0.55), 0 0 48px -6px rgba(0, 255, 159, 0.40)',
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
