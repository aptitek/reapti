import { useState, useMemo, type ReactNode } from 'react';
import { DEFAULT_LOCALE, type Locale } from './locales.ts';
import {
  ContentContext,
  resolveContent,
  type ContentContextValue,
} from './context.tsx';
import type { ContentKey, MdxComponent } from './types.ts';

export interface ContentProviderProps {
  initialLocale?: Locale;
  children: ReactNode;
}

export function ContentProvider({
  initialLocale = DEFAULT_LOCALE,
  children,
}: ContentProviderProps) {
  const [locale, setLocale] = useState<Locale>(initialLocale);

  const value = useMemo<ContentContextValue>(() => {
    return {
      locale,
      setLocale,
      getContent: (key: ContentKey): MdxComponent =>
        resolveContent(locale, key),
    };
  }, [locale]);

  return (
    <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
  );
}
