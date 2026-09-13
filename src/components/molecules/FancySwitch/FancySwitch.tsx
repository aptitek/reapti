import { forwardRef, useState, type FC } from 'react';
import { Box } from 'styled-system/jsx';
import { Switch } from '../../atoms/Switch/Switch.tsx';
import type { M3eSwitchElement } from '../../atoms/Switch/Switch.types.ts';
import { useThemeMode } from '../../../theme/useThemeMode.ts';
import type {
  AttendanceSwitchProps,
  BadgeAccessSwitchProps,
  ClockFormatSwitchProps,
  FancySwitchProps,
  LanguageSwitchProps,
  MeridianSwitchProps,
  SupportedLanguage,
  ThemeSwitchProps,
  ZenithSwitchProps,
} from './FancySwitch.types.ts';
import {
  A11Y_TEXT,
  applyThemeToggle,
  resolveAttendanceSwitchProps,
  resolveBadgeAccessSwitchProps,
  resolveClockFormatSwitchProps,
  resolveMeridianSwitchProps,
  resolveZenithSwitchProps,
} from './fancySwitchHelpers.ts';
import './fancySwitch.css';

export const FancySwitch = forwardRef<M3eSwitchElement, FancySwitchProps>(
  (props, ref) => {
    const {
      checked = false,
      onChange,
      onToggle,
      ariaLabel,
      'data-testid': testIdAttr,
      dataTestId,
      bimodal,
      className,
      ...rest
    } = props;
    const computedTestId = testIdAttr ?? dataTestId ?? 'fancy-unit-switch';
    const resolvedClassName = [bimodal ? 'switch_bimodal' : '', className]
      .filter(Boolean)
      .join(' ');

    return (
      <Switch
        ref={ref}
        checked={checked}
        onChange={(next) => {
          onChange?.(next);
          onToggle?.(next);
        }}
        ariaLabel={ariaLabel ?? A11Y_TEXT.base}
        dataTestId={computedTestId}
        className={resolvedClassName || undefined}
        {...rest}
      />
    );
  }
);
FancySwitch.displayName = 'FancySwitch';

export const ZenithSwitch = forwardRef<M3eSwitchElement, ZenithSwitchProps>(
  (props, ref) => <FancySwitch ref={ref} {...resolveZenithSwitchProps(props)} />
);
ZenithSwitch.displayName = 'ZenithSwitch';

export const ThemeSwitch: FC<ThemeSwitchProps> = ({
  className,
  size = 'small',
  disabled,
  'data-testid': testIdAttr,
  dataTestId,
  ariaLabel,
}) => {
  const mode = useThemeMode();
  const isDark = mode === 'dark';

  return (
    <Box className={className} role="region">
      <ZenithSwitch
        checked={isDark}
        onChange={applyThemeToggle}
        size={size}
        disabled={disabled}
        dataTestId={testIdAttr ?? dataTestId ?? 'theme-toggle'}
        ariaLabel={ariaLabel}
      />
    </Box>
  );
};

export const MeridianSwitch = forwardRef<M3eSwitchElement, MeridianSwitchProps>(
  (props, ref) => (
    <FancySwitch ref={ref} {...resolveMeridianSwitchProps(props)} />
  )
);
MeridianSwitch.displayName = 'MeridianSwitch';

export const LanguageSwitch: FC<LanguageSwitchProps> = ({
  className,
  size = 'small',
  disabled,
  'data-testid': testIdAttr,
  dataTestId,
  ariaLabel,
}) => {
  const [lang, setLang] = useState<SupportedLanguage>('en');

  return (
    <Box className={className} role="region">
      <MeridianSwitch
        language={lang}
        onLanguageChange={setLang}
        size={size}
        disabled={disabled}
        dataTestId={testIdAttr ?? dataTestId ?? 'language-toggle'}
        ariaLabel={ariaLabel}
      />
    </Box>
  );
};

export const ClockFormatSwitch = forwardRef<
  M3eSwitchElement,
  ClockFormatSwitchProps
>((props, ref) => (
  <FancySwitch ref={ref} {...resolveClockFormatSwitchProps(props)} />
));
ClockFormatSwitch.displayName = 'ClockFormatSwitch';

export const AttendanceSwitch = forwardRef<
  M3eSwitchElement,
  AttendanceSwitchProps
>((props, ref) => (
  <FancySwitch ref={ref} {...resolveAttendanceSwitchProps(props)} />
));
AttendanceSwitch.displayName = 'AttendanceSwitch';

export const BadgeAccessSwitch = forwardRef<
  M3eSwitchElement,
  BadgeAccessSwitchProps
>((props, ref) => (
  <FancySwitch ref={ref} {...resolveBadgeAccessSwitchProps(props)} />
));
BadgeAccessSwitch.displayName = 'BadgeAccessSwitch';
