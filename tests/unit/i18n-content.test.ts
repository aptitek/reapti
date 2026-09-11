import { describe, it, expect } from 'vitest';
import {
  isLocale,
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
} from '../../src/i18n/locales.ts';
import { CONTENT_REGISTRY } from '../../src/i18n/registry.ts';

describe('i18n Content Routing & Locales', () => {
  it('validates supported locales algebraically', () => {
    expect(SUPPORTED_LOCALES).toEqual(['en', 'fr', 'de', 'es']);
    expect(DEFAULT_LOCALE).toBe('en');
    expect(isLocale('en')).toBe(true);
    expect(isLocale('fr')).toBe(true);
    expect(isLocale('de')).toBe(true);
    expect(isLocale('es')).toBe(true);
    expect(isLocale('invalid')).toBe(false);
  });

  it('guarantees complete content contracts across all supported locales', () => {
    for (const loc of SUPPORTED_LOCALES) {
      const dict = CONTENT_REGISTRY[loc];
      expect(dict).toBeDefined();
      expect(dict.app).toBeDefined();
      expect(dict.cta).toBeDefined();
      expect(typeof dict.app).toBe('function');
      expect(typeof dict.cta).toBe('function');
    }
  });
});
