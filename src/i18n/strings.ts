import type { Locale } from './locales.ts';
import { DEFAULT_LOCALE } from './locales.ts';
import type { A11yKey } from './types.ts';

export const A11Y_STRINGS: Record<Locale, Record<A11yKey, string>> = {
  en: {
    appMain: 'Application View',
    ctaAction: 'Verify Architecture Action',
  },
  fr: {
    appMain: "Vue de l'application",
    ctaAction: "Action de vérification de l'architecture",
  },
  de: {
    appMain: 'Anwendungsansicht',
    ctaAction: 'Aktion zur Überprüfung der Architektur',
  },
  es: {
    appMain: 'Vista de la aplicación',
    ctaAction: 'Acción de verificación de arquitectura',
  },
};

export function resolveA11yString(locale: Locale, key: A11yKey): string {
  const dict = A11Y_STRINGS[locale] ?? A11Y_STRINGS[DEFAULT_LOCALE];
  return dict[key];
}
