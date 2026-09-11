/**
 * Supported Locales & Algebraic Definitions
 */

export const SUPPORTED_LOCALES = ['en', 'fr', 'de', 'es'] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

export function isLocale(val: string): val is Locale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(val);
}
