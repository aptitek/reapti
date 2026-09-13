import { describe, it, expect, vi } from 'vitest';
import {
  resolveNextThemeMode,
  syncDocumentTheme,
  resolveCurrentMode,
} from '../../src/theme/themeProviderHelpers.ts';

describe('themeProviderHelpers', () => {
  it('toggles mode correctly', () => {
    expect(resolveNextThemeMode('dark')).toBe('light');
    expect(resolveNextThemeMode('light')).toBe('dark');
    expect(resolveNextThemeMode('auto')).toBe('dark');
  });

  it('syncs document attribute safely', () => {
    const origDoc = globalThis.document;
    try {
      const setAttribute = vi.fn();
      globalThis.document = {
        documentElement: { setAttribute },
      } as unknown as Document;
      syncDocumentTheme('dark');
      expect(setAttribute).toHaveBeenCalledWith('data-theme', 'dark');

      delete (globalThis as { document?: unknown }).document;
      expect(() => syncDocumentTheme('light')).not.toThrow();
    } finally {
      globalThis.document = origDoc;
    }
  });

  it('resolves current mode with auto and explicit modes', () => {
    expect(resolveCurrentMode('auto', 'dark')).toBe('dark');
    expect(resolveCurrentMode('auto', 'light')).toBe('light');
    expect(resolveCurrentMode('light', 'dark')).toBe('light');
    expect(resolveCurrentMode('dark', 'light')).toBe('dark');
  });
});
