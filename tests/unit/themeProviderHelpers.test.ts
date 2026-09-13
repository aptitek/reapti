import { describe, it, expect, vi } from 'vitest';
import {
  resolveNextThemeMode,
  syncDocumentTheme,
  resolveCurrentMode,
  applyThemeVariables,
} from '../../src/theme/themeProviderHelpers.ts';
import { THEME_REGISTRY } from '../../src/theme/themeRegistry.ts';
import type { ThemeTokens } from '../../src/theme/types.ts';

describe('themeProviderHelpers: mode resolution', () => {
  it('toggles mode correctly', () => {
    expect(resolveNextThemeMode('dark')).toBe('light');
    expect(resolveNextThemeMode('light')).toBe('dark');
    expect(resolveNextThemeMode('auto')).toBe('dark');
  });

  it('resolves current mode with auto and explicit modes', () => {
    expect(resolveCurrentMode('auto', 'dark')).toBe('dark');
    expect(resolveCurrentMode('auto', 'light')).toBe('light');
    expect(resolveCurrentMode('light', 'dark')).toBe('light');
    expect(resolveCurrentMode('dark', 'light')).toBe('dark');
  });
});

describe('themeProviderHelpers: variable & document sync', () => {
  it('syncs document attribute safely', () => {
    const origDoc = globalThis.document;
    try {
      const setAttribute = vi.fn();
      const setProperty = vi.fn();
      globalThis.document = {
        documentElement: {
          setAttribute,
          style: { setProperty },
        },
      } as unknown as Document;

      syncDocumentTheme('dark');
      expect(setAttribute).toHaveBeenCalledWith('data-theme', 'dark');

      const solarized = THEME_REGISTRY['solarized'] as ThemeTokens;
      syncDocumentTheme('light', solarized);
      expect(setAttribute).toHaveBeenCalledWith('data-theme', 'light');
      expect(setAttribute).toHaveBeenCalledWith('data-theme-name', 'solarized');
      expect(setProperty).toHaveBeenCalledWith('--theme-primary', '#859900');

      delete (globalThis as { document?: unknown }).document;
      expect(() => syncDocumentTheme('light')).not.toThrow();
    } finally {
      globalThis.document = origDoc;
    }
  });

  it('handles syncDocumentTheme when documentElement is null', () => {
    const origDoc = globalThis.document;
    try {
      globalThis.document = {} as unknown as Document;
      expect(() => syncDocumentTheme('dark')).not.toThrow();
    } finally {
      globalThis.document = origDoc;
    }
  });

  it('applies theme variables to an element with style', () => {
    const setProperty = vi.fn();
    const target = {
      style: { setProperty },
    } as unknown as HTMLElement;

    const solarized = THEME_REGISTRY['solarized'] as ThemeTokens;
    applyThemeVariables('light', solarized, target);

    expect(setProperty).toHaveBeenCalledWith('--theme-primary', '#859900');
    expect(setProperty).toHaveBeenCalledWith('--theme-elevation-0', 'none');
  });

  it('handles applyThemeVariables gracefully when tokens or style missing', () => {
    const targetWithStyle = {
      style: { setProperty: vi.fn() },
    } as unknown as HTMLElement;
    const targetNoStyle = {} as unknown as HTMLElement;
    const dummyTheme = {
      name: 'incomplete',
      mode: 'light',
    } as unknown as ThemeTokens;

    expect(() =>
      applyThemeVariables('light', dummyTheme, targetWithStyle)
    ).not.toThrow();
    const solarized = THEME_REGISTRY['solarized'] as ThemeTokens;
    expect(() =>
      applyThemeVariables('light', solarized, targetNoStyle)
    ).not.toThrow();
  });
});
