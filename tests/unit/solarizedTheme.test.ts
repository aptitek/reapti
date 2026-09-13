import { describe, it, expect } from 'vitest';
import { solarizedTheme } from '../../src/theme/solarizedTheme.ts';

describe('solarizedTheme', () => {
  it('defines canonical solarized metadata and modes', () => {
    expect(solarizedTheme.name).toBe('solarized');
    expect(solarizedTheme.light).toBeDefined();
    expect(solarizedTheme.dark).toBeDefined();
  });

  it('contains valid light and dark mode colors', () => {
    expect(solarizedTheme.light.colors.primary).toBe('#859900');
    expect(solarizedTheme.light.colors.onSurface).toBe('#073642');
    expect(solarizedTheme.dark.colors.primary).toBe('#9ec43b');
    expect(solarizedTheme.dark.colors.onSurface).toBe('#fdf6e3');
  });

  it('defines typography, motion, radii, and spacing scales', () => {
    expect(solarizedTheme.typography.titleFamily).toContain('Milkshake');
    expect(solarizedTheme.typography.bodyFamily).toContain('Recursive');
    expect(solarizedTheme.radii.full).toBe('9999px');
    expect(solarizedTheme.motion.easingOrganic).toBeDefined();
    expect(solarizedTheme.spacing.relaxed).toBe('28px');
  });

  it('contains valid elevation lattices for light and dark', () => {
    expect(solarizedTheme.light.elevation.level0).toBe('none');
    expect(solarizedTheme.light.elevation.level1).toBeDefined();
    expect(solarizedTheme.dark.elevation.level1).toContain('inset');
  });
});
