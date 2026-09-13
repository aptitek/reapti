import type {
  SwitchProps,
  SwitchSize,
} from '../../atoms/Switch/Switch.types.ts';

export type { SwitchSize };

export type SupportedLanguage = 'en' | 'fr';
export type ClockFormat = '12h' | '24h';
export type AttendanceMode = 'in-person' | 'remote';
export type AccessStatus = 'locked' | 'unlocked';

export interface FancySwitchRenderState {
  checked: boolean;
  isHovered: boolean;
  isToggling: boolean;
  toggleDirection: 'forward' | 'backward';
  size: SwitchSize;
  disabled: boolean;
}

export interface FancySwitchProps extends Omit<SwitchProps, 'onChange'> {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  onToggle?: (checked: boolean) => void;
  bimodal?: boolean;
  tooltipTitle?: string;
  'data-testid'?: string;
}

export interface ZenithSwitchProps {
  checked?: boolean;
  mode?: 'light' | 'dark';
  size?: SwitchSize;
  onChange?: (checked: boolean) => void;
  onToggle?: (checked: boolean) => void;
  onChangeMode?: (mode: 'light' | 'dark') => void;
  disabled?: boolean;
  className?: string;
  'data-testid'?: string;
  dataTestId?: string;
  ariaLabel?: string;
}

export interface ThemeSwitchProps {
  className?: string;
  size?: SwitchSize;
  disabled?: boolean;
  'data-testid'?: string;
  dataTestId?: string;
  ariaLabel?: string;
}

export interface MeridianSwitchProps {
  language?: SupportedLanguage;
  onLanguageChange?: (lang: SupportedLanguage) => void;
  size?: SwitchSize;
  disabled?: boolean;
  className?: string;
  'data-testid'?: string;
  dataTestId?: string;
  ariaLabel?: string;
}

export interface LanguageSwitchProps {
  className?: string;
  size?: SwitchSize;
  disabled?: boolean;
  'data-testid'?: string;
  dataTestId?: string;
  ariaLabel?: string;
}

export interface ClockFormatSwitchProps {
  format?: ClockFormat;
  onChangeFormat?: (format: ClockFormat) => void;
  onChange?: (is24h: boolean) => void;
  onToggle?: (is24h: boolean) => void;
  size?: SwitchSize;
  disabled?: boolean;
  className?: string;
  'data-testid'?: string;
  dataTestId?: string;
  ariaLabel?: string;
}

export interface AttendanceSwitchProps {
  mode?: AttendanceMode;
  checked?: boolean;
  onChangeMode?: (mode: AttendanceMode) => void;
  onChange?: (checked: boolean) => void;
  onToggle?: (checked: boolean) => void;
  size?: SwitchSize;
  disabled?: boolean;
  className?: string;
  'data-testid'?: string;
  dataTestId?: string;
  ariaLabel?: string;
}

export interface BadgeAccessSwitchProps {
  status?: AccessStatus;
  checked?: boolean;
  onChangeStatus?: (status: AccessStatus) => void;
  onChange?: (checked: boolean) => void;
  onToggle?: (checked: boolean) => void;
  size?: SwitchSize;
  disabled?: boolean;
  className?: string;
  'data-testid'?: string;
  dataTestId?: string;
  ariaLabel?: string;
}

export interface BaseGlyphProps {
  size?: number;
  className?: string;
  'data-testid'?: string;
}

export interface CelestialGlyphProps extends BaseGlyphProps {
  isDark?: boolean;
}

export interface CountrySilhouetteProps extends BaseGlyphProps {
  active?: boolean;
}

export interface DigitalClockGlyphProps extends BaseGlyphProps {
  format?: ClockFormat;
  isHovered?: boolean;
}

export interface AnalogClockGlyphProps extends BaseGlyphProps {
  isAnimating?: boolean;
}

export interface LockGlyphProps extends BaseGlyphProps {
  isUnlocked?: boolean;
}

export interface DoorPortalProps extends BaseGlyphProps {
  isOpen?: boolean;
  isHovered?: boolean;
}

export interface HoloNetworkProps extends BaseGlyphProps {
  isInPerson?: boolean;
  isHovered?: boolean;
}

export interface PeekingFlightProps extends BaseGlyphProps {
  isFrench?: boolean;
  isHovered?: boolean;
  isFlying?: boolean;
  flightDirection?: 'forward' | 'backward';
}

export interface PeekingPedestrianProps extends BaseGlyphProps {
  isInPerson?: boolean;
  isHovered?: boolean;
  isWalking?: boolean;
  walkDirection?: 'forward' | 'backward';
}

export interface PeekingBadgeProps extends BaseGlyphProps {
  isUnlocked?: boolean;
  isHovered?: boolean;
  isScanning?: boolean;
  scanDirection?: 'forward' | 'backward';
}

export interface BadgeRippleProps extends BaseGlyphProps {
  isUnlocked?: boolean;
}

export const A11Y_TEXT = {
  zenith: 'Theme switch',
  meridian: 'Language switch',
  clock: 'Clock format switch',
  attendance: 'Attendance mode switch',
  badge: 'Badge access switch',
  base: 'Fancy switch',
};
