import {
  createContext,
  useContext,
  createElement,
  type ReactNode,
} from 'react';
import { DEFAULT_LOCALE, type Locale } from './locales.ts';
import { CONTENT_REGISTRY } from './registry.ts';
import type { ContentKey, MdxComponent } from './types.ts';

export interface ContentContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  getContent: (key: ContentKey) => MdxComponent;
}

export const ContentContext = createContext<ContentContextValue | null>(null);

export function useLocale(): {
  locale: Locale;
  setLocale: (loc: Locale) => void;
} {
  const ctx = useContext(ContentContext);
  if (!ctx) {
    throw new Error('useLocale must be used within a <ContentProvider>');
  }
  return { locale: ctx.locale, setLocale: ctx.setLocale };
}

export function useContentElement(key: ContentKey): ReactNode {
  const ctx = useContext(ContentContext);
  if (!ctx) {
    throw new Error(
      'useContentElement must be used within a <ContentProvider>'
    );
  }
  return createElement(ctx.getContent(key));
}

export function resolveContent(locale: Locale, key: ContentKey): MdxComponent {
  const dict = CONTENT_REGISTRY[locale] ?? CONTENT_REGISTRY[DEFAULT_LOCALE];
  return dict[key];
}
