import { describe, it, expect } from 'vitest';
import { exoticTheme } from '../../src/theme/exoticTheme.ts';

describe('exoticTheme', () => {
  it('defines canonical exotic metadata and modes', () => {
    expect(exoticTheme.name).toBe('exotic');
    expect(exoticTheme.light).toBeDefined();
    expect(exoticTheme.dark).toBeDefined();
  });

  it('contains bright exotic light and dark mode colors', () => {
    expect(exoticTheme.light.colors.primary).toBe('#00d68f');
    expect(exoticTheme.light.colors.onPrimary).toBe('#0d281e');
    expect(exoticTheme.light.colors.secondary).toBe('#ff007f');
    expect(exoticTheme.light.colors.tertiary).toBe('#7b2cbf');
    expect(exoticTheme.light.colors.error).toBe('#ff5400');
    expect(exoticTheme.light.colors.surface).toBe('#f3e8ee');
    expect(exoticTheme.light.colors.onSurface).toBe('#271824');

    expect(exoticTheme.dark.colors.primary).toBe('#00ff9f');
    expect(exoticTheme.dark.colors.onPrimary).toBe('#003b22');
    expect(exoticTheme.dark.colors.secondary).toBe('#ff2a8d');
    expect(exoticTheme.dark.colors.tertiary).toBe('#a855f7');
    expect(exoticTheme.dark.colors.error).toBe('#ff6b35');
    expect(exoticTheme.dark.colors.surface).toBe('#161226');
    expect(exoticTheme.dark.colors.onSurface).toBe('#f5efff');
  });

  it('contains zero pure black and zero pure white in any color token', () => {
    const checkNoPureBlackWhite = (ramp: Record<string, string>) => {
      for (const [key, val] of Object.entries(ramp)) {
        expect(val, `light token ${key} is pure white`).not.toBe('#ffffff');
        expect(val, `light token ${key} is pure black`).not.toBe('#000000');
        expect(val.toLowerCase()).not.toBe('white');
        expect(val.toLowerCase()).not.toBe('black');
      }
    };
    checkNoPureBlackWhite(
      exoticTheme.light.colors as unknown as Record<string, string>
    );
    checkNoPureBlackWhite(
      exoticTheme.dark.colors as unknown as Record<string, string>
    );
  });

  it('defines typography, motion, radii, and spacing scales', () => {
    expect(exoticTheme.typography.titleFamily).toContain('Milkshake');
    expect(exoticTheme.radii.full).toBe('9999px');
    expect(exoticTheme.motion.easingOrganic).toBeDefined();
    expect(exoticTheme.spacing.relaxed).toBe('28px');
  });

  it('contains valid elevation lattices for light and dark', () => {
    expect(exoticTheme.light.elevation.level0).toBe('none');
    expect(exoticTheme.light.elevation.level1).toBeDefined();
    expect(exoticTheme.dark.elevation.level1).toBeDefined();
  });
});
