import { describe, it, expect } from 'vitest';
import {
  THEME_REGISTRY,
  DEFAULT_THEME_NAME,
  getTheme,
  registerTheme,
} from '../../src/theme/themeRegistry.ts';
import { solarizedTheme } from '../../src/theme/solarizedTheme.ts';
import { md3Theme } from '../../src/theme/md3Theme.ts';

describe('themeRegistry', () => {
  it('contains solarized and md3 themes by default', () => {
    expect(THEME_REGISTRY.solarized).toBe(solarizedTheme);
    expect(THEME_REGISTRY.md3).toBe(md3Theme);
    expect(DEFAULT_THEME_NAME).toBe('solarized');
  });

  it('retrieves default and named themes', () => {
    expect(getTheme()).toBe(solarizedTheme);
    expect(getTheme('solarized')).toBe(solarizedTheme);
    expect(getTheme('md3')).toBe(md3Theme);
  });

  it('falls back to solarizedTheme when theme is unknown', () => {
    expect(getTheme('non_existent')).toBe(solarizedTheme);
  });

  it('allows registering a custom theme', () => {
    const customTheme = { ...solarizedTheme, name: 'custom-theme' };
    registerTheme(customTheme);
    expect(getTheme('custom-theme')).toBe(customTheme);
  });
});
