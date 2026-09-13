import { describe, it, expect, vi } from 'vitest';
import {
  A11Y_TEXT,
  resolveZenithSwitchProps,
  resolveMeridianSwitchProps,
  resolveClockFormatSwitchProps,
  resolveAttendanceSwitchProps,
  resolveBadgeAccessSwitchProps,
} from '../../src/components/molecules/FancySwitch/fancySwitchHelpers.ts';

describe('fancySwitchHelpers - A11y Text', () => {
  it('defines accessibility labels for all variants', () => {
    expect(A11Y_TEXT.zenith).toBe('Theme switch');
    expect(A11Y_TEXT.meridian).toBe('Language switch');
    expect(A11Y_TEXT.clock).toBe('Clock format switch');
    expect(A11Y_TEXT.attendance).toBe('Attendance mode switch');
    expect(A11Y_TEXT.badge).toBe('Badge access switch');
    expect(A11Y_TEXT.base).toBe('Fancy switch');
  });
});

describe('fancySwitchHelpers - Zenith & Meridian Resolvers', () => {
  it('resolves zenith switch props with toggle callbacks', () => {
    const onChange = vi.fn();
    const onToggle = vi.fn();
    const onChangeMode = vi.fn();

    const props = resolveZenithSwitchProps({
      checked: false,
      onChange,
      onToggle,
      onChangeMode,
    });

    expect(props.checked).toBe(true);
    expect(props.bimodal).toBe(true);
    expect(props.ariaLabel).toBe('Theme switch');

    props.onChange?.(false);
    expect(onChange).toHaveBeenCalledWith(true);
    expect(onToggle).toHaveBeenCalledWith(true);
    expect(onChangeMode).toHaveBeenCalledWith('dark');

    const defaultProps = resolveZenithSwitchProps({
      mode: 'light',
      ariaLabel: 'Custom Theme',
      'data-testid': 'custom-zenith-id',
      className: 'extra-class',
    });
    expect(defaultProps.checked).toBe(true);
    expect(defaultProps.ariaLabel).toBe('Custom Theme');
    expect(defaultProps.dataTestId).toBe('custom-zenith-id');
  });

  it('resolves meridian switch props with language callbacks and transition component', () => {
    const onLanguageChange = vi.fn();

    const props = resolveMeridianSwitchProps({
      language: 'fr',
      onLanguageChange,
    });

    expect(props.checked).toBe(true);
    expect(props.ariaLabel).toBe('Language switch');

    const compOff = props.handleTransitionComponent?.('to-off');
    const compOn = props.handleTransitionComponent?.('to-on');
    expect(compOff).toBeDefined();
    expect(compOn).toBeDefined();

    props.onChange?.(false);
    expect(onLanguageChange).toHaveBeenCalledWith('en');

    props.onChange?.(true);
    expect(onLanguageChange).toHaveBeenCalledWith('fr');

    const defaultMeridian = resolveMeridianSwitchProps({});
    expect(defaultMeridian.checked).toBe(false);
    defaultMeridian.onChange?.(true);
  });
});

describe('fancySwitchHelpers - Clock & Attendance Resolvers', () => {
  it('resolves clock format switch props', () => {
    const onChangeFormat = vi.fn();
    const onChange = vi.fn();
    const onToggle = vi.fn();

    const props = resolveClockFormatSwitchProps({
      format: '24h',
      onChangeFormat,
      onChange,
      onToggle,
    });

    expect(props.checked).toBe(true);
    props.onChange?.(false);
    expect(onChangeFormat).toHaveBeenCalledWith('12h');
    expect(onChange).toHaveBeenCalledWith(false);
    expect(onToggle).toHaveBeenCalledWith(false);

    props.onChange?.(true);
    expect(onChangeFormat).toHaveBeenCalledWith('24h');

    const defaultClock = resolveClockFormatSwitchProps({});
    expect(defaultClock.checked).toBe(false);
    defaultClock.onChange?.(false);
  });

  it('resolves attendance mode switch props', () => {
    const onChangeMode = vi.fn();
    const onChange = vi.fn();
    const onToggle = vi.fn();

    const props = resolveAttendanceSwitchProps({
      mode: 'in-person',
      onChangeMode,
      onChange,
      onToggle,
    });

    expect(props.checked).toBe(true);
    props.onChange?.(false);
    expect(onChangeMode).toHaveBeenCalledWith('remote');
    expect(onChange).toHaveBeenCalledWith(false);
    expect(onToggle).toHaveBeenCalledWith(false);

    props.onChange?.(true);
    expect(onChangeMode).toHaveBeenCalledWith('in-person');

    const checkedOverride = resolveAttendanceSwitchProps({ checked: false });
    expect(checkedOverride.checked).toBe(false);
    checkedOverride.onChange?.(false);
  });
});

describe('fancySwitchHelpers - Badge Access Resolver', () => {
  it('resolves badge access switch props', () => {
    const onChangeStatus = vi.fn();
    const onChange = vi.fn();
    const onToggle = vi.fn();

    const props = resolveBadgeAccessSwitchProps({
      status: 'unlocked',
      onChangeStatus,
      onChange,
      onToggle,
    });

    expect(props.checked).toBe(true);
    props.onChange?.(false);
    expect(onChangeStatus).toHaveBeenCalledWith('locked');
    expect(onChange).toHaveBeenCalledWith(false);
    expect(onToggle).toHaveBeenCalledWith(false);

    props.onChange?.(true);
    expect(onChangeStatus).toHaveBeenCalledWith('unlocked');

    const checkedOverride = resolveBadgeAccessSwitchProps({ checked: false });
    expect(checkedOverride.checked).toBe(false);
    checkedOverride.onChange?.(true);
  });
});
