import { describe, it, expect } from 'vitest';
import { md3Theme } from '../../src/theme/md3Theme.ts';

describe('md3Theme', () => {
  it('defines canonical md3 metadata and modes', () => {
    expect(md3Theme.name).toBe('md3');
    expect(md3Theme.light).toBeDefined();
    expect(md3Theme.dark).toBeDefined();
  });

  it('contains valid light and dark mode colors', () => {
    expect(md3Theme.light.colors.primary).toBe('#006874');
    expect(md3Theme.light.colors.onSurface).toBe('#191c1d');
    expect(md3Theme.dark.colors.primary).toBe('#80d5e3');
    expect(md3Theme.dark.colors.onSurface).toBe('#e1e3e4');
  });

  it('defines typography, motion, radii, and spacing scales', () => {
    expect(md3Theme.typography.titleFamily).toContain('Roboto');
    expect(md3Theme.radii.full).toBe('9999px');
    expect(md3Theme.motion.easingOrganic).toBeDefined();
    expect(md3Theme.spacing.md).toBe('16px');
  });

  it('contains valid elevation lattices for light and dark', () => {
    expect(md3Theme.light.elevation.level0).toBe('none');
    expect(md3Theme.light.elevation.level1).toBeDefined();
    expect(md3Theme.dark.elevation.level1).toBeDefined();
  });
});
