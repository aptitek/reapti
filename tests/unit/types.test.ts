import { describe, it, expect } from 'vitest';
import type { ThemeMode, ResolvedThemeMode } from '../../src/theme/types.ts';

describe('theme types', () => {
  it('allows valid theme mode strings', () => {
    const lightMode: ThemeMode = 'light';
    const darkMode: ThemeMode = 'dark';
    const autoMode: ThemeMode = 'auto';
    const resolved: ResolvedThemeMode = 'light';
    expect([lightMode, darkMode, autoMode, resolved]).toHaveLength(4);
  });
});
