import { describe, it, expectTypeOf } from 'vitest';
import type {
  AttendanceMode,
  AttendanceSwitchProps,
  BadgeAccessSwitchProps,
  ClockFormat,
  ClockFormatSwitchProps,
  FancySwitchProps,
  FancySwitchRenderState,
  LanguageSwitchProps,
  MeridianSwitchProps,
  SupportedLanguage,
  SwitchSize,
  ThemeSwitchProps,
  ZenithSwitchProps,
} from '../../src/components/molecules/FancySwitch/FancySwitch.types.ts';

describe('FancySwitch Type Definitions', () => {
  it('validates literal union types for Switch features', () => {
    expectTypeOf<SwitchSize>().toEqualTypeOf<'small' | 'medium' | 'large'>();
    expectTypeOf<SupportedLanguage>().toEqualTypeOf<'en' | 'fr'>();
    expectTypeOf<ClockFormat>().toEqualTypeOf<'12h' | '24h'>();
    expectTypeOf<AttendanceMode>().toEqualTypeOf<'in-person' | 'remote'>();
  });

  it('validates prop types assignability', () => {
    expectTypeOf<FancySwitchProps>().toBeObject();
    expectTypeOf<ZenithSwitchProps>().toBeObject();
    expectTypeOf<ThemeSwitchProps>().toBeObject();
    expectTypeOf<MeridianSwitchProps>().toBeObject();
    expectTypeOf<LanguageSwitchProps>().toBeObject();
    expectTypeOf<ClockFormatSwitchProps>().toBeObject();
    expectTypeOf<AttendanceSwitchProps>().toBeObject();
    expectTypeOf<BadgeAccessSwitchProps>().toBeObject();
    expectTypeOf<FancySwitchRenderState>().toBeObject();
  });
});
