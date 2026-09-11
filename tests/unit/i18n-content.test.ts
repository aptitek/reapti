import { describe, it, expect } from 'vitest';
import { createElement, type ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  isLocale,
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
} from '../../src/i18n/locales.ts';
import { CONTENT_REGISTRY } from '../../src/i18n/registry.ts';
import {
  useLocale,
  useContentElement,
  resolveContent,
} from '../../src/i18n/context.tsx';
import { ContentProvider } from '../../src/i18n/ContentProvider.tsx';

function ConsumerComponent(): ReactElement {
  const { locale } = useLocale();
  const element = useContentElement('app');
  return createElement('span', { 'data-locale': locale }, element);
}

function BadLocaleConsumer(): ReactElement {
  useLocale();
  return createElement('span');
}

function BadElementConsumer(): ReactElement {
  useContentElement('app');
  return createElement('span');
}

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

  it('resolves content with fallback when locale is invalid', () => {
    // @ts-expect-error testing invalid locale fallback
    const resolved = resolveContent('invalid', 'app');
    expect(resolved).toBeDefined();
    expect(typeof resolved).toBe('function');
  });
});

describe('i18n Context and ContentProvider', () => {
  it('renders children with provided initial locale', () => {
    const tree = createElement(
      ContentProvider,
      { initialLocale: 'fr' },
      createElement(ConsumerComponent)
    );
    const html = renderToStaticMarkup(tree);
    expect(html).toContain('data-locale="fr"');
  });

  it('throws helpful error when useLocale is called outside provider', () => {
    expect(() =>
      renderToStaticMarkup(createElement(BadLocaleConsumer))
    ).toThrow('useLocale must be used within a <ContentProvider>');
  });

  it('throws helpful error when useContentElement is called outside provider', () => {
    expect(() =>
      renderToStaticMarkup(createElement(BadElementConsumer))
    ).toThrow('useContentElement must be used within a <ContentProvider>');
  });
});
