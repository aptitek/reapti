/**
 * Modular Theme System Type Definitions
 *
 * Defines the contract for pluggable design themes including color ramps,
 * elevation models, border radii, typography, motion physics, and spacing scales.
 */

export type ThemeMode = 'light' | 'dark' | 'auto';
export type ResolvedThemeMode = 'light' | 'dark';

export interface ColorRamp {
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  secondary: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;
  tertiary: string;
  onTertiary: string;
  tertiaryContainer: string;
  onTertiaryContainer: string;
  error: string;
  onError: string;
  errorContainer: string;
  onErrorContainer: string;
  background: string;
  onBackground: string;
  surface: string;
  onSurface: string;
  surfaceVariant: string;
  onSurfaceVariant: string;
  surfaceDim: string;
  surfaceBright: string;
  surfaceContainerLowest: string;
  surfaceContainerLow: string;
  surfaceContainer: string;
  surfaceContainerHigh: string;
  surfaceContainerHighest: string;
  outline: string;
  outlineVariant: string;
  shadow: string;
  scrim: string;
  inverseSurface: string;
  inverseOnSurface: string;
  inversePrimary: string;
  surfaceTint: string;
}

export interface ElevationTokens {
  level0: string;
  level1: string;
  level2: string;
  level3: string;
  level4: string;
}

export interface RadiusTokens {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  full: string;
}

export interface TypographyTokens {
  titleFamily: string;
  bodyFamily: string;
  bodyVariation: string;
  baseFontSize: string;
  minFontSize: string;
  lineHeightRelaxed: string;
}

export interface MotionTokens {
  durationFast: string;
  durationNormal: string;
  durationSlow: string;
  easingOrganic: string;
}

export interface SpacingTokens {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  relaxed: string;
  airy: string;
  spacious: string;
}

export interface ThemeModeTokens {
  colors: ColorRamp;
  elevation: ElevationTokens;
}

export interface ThemeTokens {
  name: string;
  light: ThemeModeTokens;
  dark: ThemeModeTokens;
  radii: RadiusTokens;
  typography: TypographyTokens;
  motion: MotionTokens;
  spacing: SpacingTokens;
}
