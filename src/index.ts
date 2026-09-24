import './index.css';

// Atoms
export { Accordeon } from './components/atoms/Accordeon/Accordeon.tsx';
export type { AccordeonProps } from './components/atoms/Accordeon/Accordeon.tsx';

export { HoldButton } from './components/atoms/HoldButton/HoldButton.tsx';
export type { HoldButtonProps } from './components/atoms/HoldButton/HoldButton.types.ts';

export { HoloDecorator } from './components/atoms/HoloDecorator/HoloDecorator.tsx';
export type { HoloDecoratorProps } from './components/atoms/HoloDecorator/HoloDecorator.tsx';

export { MapPin } from './components/atoms/MapPin/MapPin.tsx';
export type { MapPinProps } from './components/atoms/MapPin/MapPin.types.ts';

export { MeshAccordeon } from './components/atoms/MeshAccordeon/MeshAccordeon.tsx';
export type { MeshAccordeonProps } from './components/atoms/MeshAccordeon/MeshAccordeon.tsx';

export { NumberPicker } from './components/atoms/NumberPicker/NumberPicker.tsx';
export type {
  NumberPickerProps,
  NumberPickerMode,
  RangePickerVariant,
  NumberPickerSize,
  CommonNumberPickerProps,
  SingleNumberPickerProps,
  RangeNumberPickerProps,
} from './components/atoms/NumberPicker/NumberPicker.types.ts';

export {
  PillChip,
  PillChipDecorator,
} from './components/atoms/PillChipDecorator/PillChipDecorator.tsx';
export type {
  PillChipProps,
  PillChipDecoratorProps,
  PillChipPlacement,
} from './components/atoms/PillChipDecorator/PillChipDecorator.types.ts';

export { SegmentedChip } from './components/atoms/SegmentedChip/SegmentedChip.tsx';
export { SegmentedChipElement } from './components/atoms/SegmentedChip/SegmentedChipElement.ts';
export type {
  SegmentedChipProps,
  SegmentedChipItemConfig,
  SegmentedChipVariant,
  SegmentedChipSize,
} from './components/atoms/SegmentedChip/SegmentedChip.types.ts';

export { Switch } from './components/atoms/Switch/Switch.tsx';
export type { SwitchProps } from './components/atoms/Switch/Switch.types.ts';

// Molecules
export {
  FancySwitch,
  ZenithSwitch,
  ThemeSwitch,
  MeridianSwitch,
  LanguageSwitch,
  ClockFormatSwitch,
  AttendanceSwitch,
  BadgeAccessSwitch,
} from './components/molecules/FancySwitch/FancySwitch.tsx';
export type {
  FancySwitchProps,
  ZenithSwitchProps,
  ThemeSwitchProps,
  MeridianSwitchProps,
  LanguageSwitchProps,
  ClockFormatSwitchProps,
  AttendanceSwitchProps,
  BadgeAccessSwitchProps,
  ClockFormat,
  AttendanceMode,
  AccessStatus,
  FancySwitchRenderState,
} from './components/molecules/FancySwitch/FancySwitch.types.ts';

export { EmailField } from './components/molecules/EmailField/EmailField.tsx';
export type {
  EmailFieldProps,
  EmailFieldVariant,
  EmailFieldSize,
} from './components/molecules/EmailField/EmailField.types.ts';

export { FlipCard } from './components/molecules/FlipCard/FlipCard.tsx';
export type { FlipCardProps } from './components/molecules/FlipCard/FlipCard.tsx';

export { HeroTicker } from './components/molecules/HeroTicker/HeroTicker.tsx';
export { HeroTickerControls } from './components/molecules/HeroTicker/HeroTickerControls.tsx';
export { HeroTickerDisplay } from './components/molecules/HeroTicker/HeroTickerDisplay.tsx';
export { HeroTickerFlourish } from './components/molecules/HeroTicker/HeroTickerFlourish.tsx';
export { HeroTickerNib } from './components/molecules/HeroTicker/HeroTickerNib.tsx';
export type {
  HeroTickerProps,
  HeroTickerSize,
  HeroTickerAnimationMode,
  HeroTickerThemeMode,
} from './components/molecules/HeroTicker/HeroTicker.types.ts';

export { Map } from './components/molecules/Map/Map.tsx';
export type {
  MapProps,
  MapRef,
  MapPinItem,
} from './components/molecules/Map/Map.types.ts';

export { VerticalNavBar } from './components/molecules/VerticalNavBar/VerticalNavBar.tsx';
export { VerticalNavBarElement } from './components/molecules/VerticalNavBar/VerticalNavBarElement.ts';
export type {
  VerticalNavBarProps,
  VerticalNavBarItemConfig,
  NavBarMode,
} from './components/molecules/VerticalNavBar/VerticalNavBar.types.ts';

export { VerticalAppBar } from './components/molecules/VerticalAppBar/VerticalAppBar.tsx';
export { VerticalAppBarElement } from './components/molecules/VerticalAppBar/VerticalAppBarElement.ts';
export type {
  VerticalAppBarProps,
  VerticalAppBarSide,
} from './components/molecules/VerticalAppBar/VerticalAppBar.types.ts';

// Organisms
export { PrintPage } from './components/organisms/PrintPage/PrintPage.tsx';
export { PrintPageControls } from './components/organisms/PrintPage/PrintPageControls.tsx';
export { PrintPageFab } from './components/organisms/PrintPage/PrintPageFab.tsx';
export {
  FlipView,
  FlipView as PrintPageFlipView,
} from './components/organisms/PrintPage/PrintPageFlipView.tsx';
export { PrintPageItem } from './components/organisms/PrintPage/PrintPageItem.tsx';
export type {
  PrintPageProps,
  PrintPageItemProps,
  PrintPageControlsProps,
  PrintPageFabProps,
  PrintPageViewMode,
  PrintPageCardVariant,
} from './components/organisms/PrintPage/PrintPage.types.ts';

export { SeasonBackground } from './components/organisms/SeasonBackground/SeasonBackground.tsx';
export {
  AtmosphereLayer,
  CelestialLayer,
  LandscapeLayer,
  ForegroundGrassLayer,
} from './components/organisms/SeasonBackground/SeasonLayers.tsx';
export type {
  SeasonBackgroundProps,
  SeasonThemeMode,
  SeasonVariant,
} from './components/organisms/SeasonBackground/SeasonBackground.types.ts';
export {
  getNorthernHemisphereSeason,
  getNorthernHemisphereSeasonProgress,
  resolveSeasonProgress,
} from './components/organisms/SeasonBackground/seasonUtils.ts';

// i18n
export { ContentProvider } from './i18n/ContentProvider.tsx';
export type { ContentProviderProps } from './i18n/ContentProvider.tsx';
export {
  useLocale,
  useContentElement,
  useA11yString,
} from './i18n/context.tsx';

// Design Tokens
export {
  SOLARIZED_BASE_COLORS,
  BOTANICAL_COLORS,
  PASTEL_SKY_COLORS,
  CELESTIAL_COLORS,
  PROGRESS_THEME_COLORS,
  SEASON_COLORS,
  SEASON_NIGHT_COLORS,
} from './tokens/solarized.ts';
export { md3Tokens, md3SemanticTokens } from './tokens/md3.ts';

// Theme System
export { solarizedTheme } from './theme/solarizedTheme.ts';
export { md3Theme } from './theme/md3Theme.ts';
export {
  THEME_REGISTRY,
  DEFAULT_THEME_NAME,
  getTheme,
  registerTheme,
} from './theme/themeRegistry.ts';
export { useThemeMode } from './theme/useThemeMode.ts';
export { ThemeProvider } from './theme/ThemeProvider.tsx';
export type { ThemeProviderProps } from './theme/ThemeProvider.tsx';
export {
  resolveNextThemeMode,
  syncDocumentTheme,
  resolveCurrentMode,
} from './theme/themeProviderHelpers.ts';
export { ThemeContext } from './theme/ThemeContext.ts';
export type { ThemeContextValue } from './theme/ThemeContext.ts';
export { useTheme } from './theme/useTheme.ts';
export type {
  ThemeTokens,
  ColorRamp,
  ElevationTokens,
  RadiusTokens,
  TypographyTokens,
  MotionTokens,
  SpacingTokens,
  ThemeModeTokens,
  ThemeMode,
  ResolvedThemeMode,
} from './theme/types.ts';
