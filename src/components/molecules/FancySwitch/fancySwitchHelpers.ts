import { createElement } from 'react';
import {
  A11Y_TEXT,
  type AttendanceSwitchProps,
  type BadgeAccessSwitchProps,
  type ClockFormatSwitchProps,
  type FancySwitchProps,
  type MeridianSwitchProps,
  type ZenithSwitchProps,
} from './FancySwitch.types.ts';
import {
  ActiveZenithGlyph,
  BadgeScanRippleEffect,
  CelestialArcLine,
  ClockDigitPuck,
  DigitalClockGlyph,
  FlightAirplane,
  FranceFlag,
  HighContrastMoonGlyph,
  HighContrastSunGlyph,
  AnimatedDoorPortal,
  HoloNetworkSilhouette,
  LockSecureGlyph,
  MapPinDrop,
  MeridianBackground,
  PeekingBadgeCompanion,
  RemoteHomeGlyph,
  UkFlag,
  WalkingPedestrianGlyph,
} from './FancySwitch.glyphs.tsx';

export { A11Y_TEXT };

export function applyThemeToggle(next: boolean): void {
  const targetTheme = next ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', targetTheme);
  try {
    localStorage.setItem('aptitek-theme', targetTheme);
  } catch {
    /* Ignore */
  }
}

const DEFAULT_TRACK = {
  trackColorOn: 'var(--fancy-switch-track-bg)',
  trackColorOff: 'var(--fancy-switch-track-bg)',
};
const symmetricHandle = (color: string) => ({
  handleColorOn: color,
  handleColorOff: color,
});

export function resolveZenithSwitchProps(
  props: ZenithSwitchProps
): FancySwitchProps {
  const {
    checked,
    mode,
    onChange,
    onToggle,
    onChangeMode,
    ariaLabel,
    'data-testid': testIdAttr,
    dataTestId,
    className,
    ...rest
  } = props;
  const isDark = checked !== undefined ? checked : mode === 'dark';

  return {
    checked: !isDark,
    onChange: (light) => {
      onChange?.(!light);
      onToggle?.(!light);
      onChangeMode?.(!light ? 'dark' : 'light');
    },
    ariaLabel: ariaLabel ?? A11Y_TEXT.zenith,
    dataTestId: testIdAttr ?? dataTestId ?? 'zenith-theme-switch',
    bimodal: true,
    className: ['fancy_switch_zenith', className].filter(Boolean).join(' '),
    handleIconOn: createElement(ActiveZenithGlyph, { isDark: false }),
    handleIconOff: createElement(ActiveZenithGlyph, { isDark: true }),
    ghostIconOn: createElement(HighContrastMoonGlyph, { size: 14 }),
    ghostIconOff: createElement(HighContrastSunGlyph, { size: 14 }),
    ghostColorOn: 'var(--fancy-switch-moon-main)',
    ghostColorOff: 'var(--fancy-switch-sun-light)',
    backgroundSvg: createElement(CelestialArcLine),
    handleColorOn: 'var(--fancy-switch-sun-thumb)',
    handleColorOff: 'var(--fancy-switch-moon-thumb)',
    ...DEFAULT_TRACK,
    ...rest,
  };
}

export function resolveMeridianSwitchProps(
  props: MeridianSwitchProps
): FancySwitchProps {
  const {
    language = 'en',
    onLanguageChange,
    ariaLabel,
    'data-testid': testIdAttr,
    dataTestId,
    className,
    ...rest
  } = props;
  const isFrench = language === 'fr';

  return {
    checked: isFrench,
    onChange: (next) => onLanguageChange?.(next ? 'fr' : 'en'),
    ariaLabel: ariaLabel ?? A11Y_TEXT.meridian,
    dataTestId: testIdAttr ?? dataTestId ?? 'meridian-language-switch',
    bimodal: true,
    className: ['fancy_switch_meridian', className].filter(Boolean).join(' '),
    handleIconOn: createElement(FranceFlag, { size: 20 }),
    handleIconOff: createElement(UkFlag, { size: 20 }),
    peekingIconOn: createElement(FlightAirplane, { isFrench: true }),
    peekingIconOff: createElement(FlightAirplane, { isFrench: false }),
    backgroundSvg: createElement(MeridianBackground, { isFrench }),
    handleTransitionComponent: (dir) =>
      createElement(FlightAirplane, {
        isFrench: dir === 'to-off',
        isFlying: true,
      }),
    ...symmetricHandle('var(--fancy-switch-uk-white)'),
    ...DEFAULT_TRACK,
    ...rest,
  };
}

export function resolveClockFormatSwitchProps(
  props: ClockFormatSwitchProps
): FancySwitchProps {
  const {
    format = '12h',
    onChangeFormat,
    onChange,
    onToggle,
    ariaLabel,
    'data-testid': testIdAttr,
    dataTestId,
    className,
    ...rest
  } = props;
  const is24h = format === '24h';

  return {
    checked: is24h,
    onChange: (next) => {
      onChangeFormat?.(next ? '24h' : '12h');
      onChange?.(next);
      onToggle?.(next);
    },
    ariaLabel: ariaLabel ?? A11Y_TEXT.clock,
    dataTestId: testIdAttr ?? dataTestId ?? 'clock-format-switch',
    bimodal: true,
    className: ['fancy_switch_clock', className].filter(Boolean).join(' '),
    handleIconOn: createElement(ClockDigitPuck, { is24h: true }),
    handleIconOff: createElement(ClockDigitPuck, { is24h: false }),
    ghostIconOn: createElement(DigitalClockGlyph, { format: '12h' }),
    ghostIconOff: createElement(DigitalClockGlyph, { format: '24h' }),
    ...symmetricHandle('var(--fancy-switch-clock-thumb)'),
    ...DEFAULT_TRACK,
    ...rest,
  };
}

export function resolveAttendanceSwitchProps(
  props: AttendanceSwitchProps
): FancySwitchProps {
  const {
    mode = 'in-person',
    checked,
    onChangeMode,
    onChange,
    onToggle,
    ariaLabel,
    'data-testid': testIdAttr,
    dataTestId,
    className,
    ...rest
  } = props;
  const isInPerson = checked !== undefined ? checked : mode === 'in-person';

  return {
    checked: isInPerson,
    onChange: (next) => {
      onChangeMode?.(next ? 'in-person' : 'remote');
      onChange?.(next);
      onToggle?.(next);
    },
    ariaLabel: ariaLabel ?? A11Y_TEXT.attendance,
    dataTestId: testIdAttr ?? dataTestId ?? 'attendance-switch',
    bimodal: true,
    className: ['fancy_switch_attendance', className].filter(Boolean).join(' '),
    handleIconOn: createElement(MapPinDrop),
    handleIconOff: createElement(RemoteHomeGlyph),
    backgroundSvg: createElement(HoloNetworkSilhouette, { isInPerson }),
    peekingIconOn: createElement(WalkingPedestrianGlyph, { isInPerson: true }),
    peekingIconOff: createElement(WalkingPedestrianGlyph, {
      isInPerson: false,
    }),
    handleColorOn: 'var(--fancy-switch-pin-thumb)',
    handleColorOff: 'var(--fancy-switch-laptop-blue)',
    ...DEFAULT_TRACK,
    ...rest,
  };
}

export function resolveBadgeAccessSwitchProps(
  props: BadgeAccessSwitchProps
): FancySwitchProps {
  const {
    status = 'locked',
    checked,
    onChangeStatus,
    onChange,
    onToggle,
    ariaLabel,
    'data-testid': testIdAttr,
    dataTestId,
    className,
    ...rest
  } = props;
  const isUnlocked = checked !== undefined ? checked : status === 'unlocked';

  return {
    checked: isUnlocked,
    onChange: (next) => {
      onChangeStatus?.(next ? 'unlocked' : 'locked');
      onChange?.(next);
      onToggle?.(next);
    },
    ariaLabel: ariaLabel ?? A11Y_TEXT.badge,
    dataTestId: testIdAttr ?? dataTestId ?? 'badge-access-switch',
    bimodal: true,
    className: ['fancy_switch_badge', className].filter(Boolean).join(' '),
    handleIconOn: createElement(LockSecureGlyph, { isUnlocked: true }),
    handleIconOff: createElement(LockSecureGlyph, { isUnlocked: false }),
    ghostIconOn: createElement(AnimatedDoorPortal, { isOpen: false }),
    ghostIconOff: createElement(AnimatedDoorPortal, { isOpen: true }),
    peekingIconOn: createElement(PeekingBadgeCompanion),
    peekingIconOff: createElement(PeekingBadgeCompanion),
    peekingSymmetry: { on: true, off: false },
    peekingOffset: 'calc(var(--switch-handle-size) * 0.52)',
    handleTransitionComponent: createElement(BadgeScanRippleEffect, {
      isUnlocked,
    }),
    handleColorOn: 'var(--fancy-switch-unlock-thumb)',
    handleColorOff: 'var(--fancy-switch-lock-thumb)',
    ...DEFAULT_TRACK,
    ...rest,
  };
}
