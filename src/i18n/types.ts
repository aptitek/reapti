import type { ComponentType } from 'react';
import type { Locale } from './locales.ts';

export type ContentKey = 'app' | 'cta';

export type A11yKey =
  | 'appMain'
  | 'ctaAction'
  | 'zoomIn'
  | 'zoomOut'
  | 'mapWebGLDisabledTitle'
  | 'mapWebGLDisabledMessage'
  | 'mapFallbackLocationsTitle'
  | 'mapLoadingAriaLabel'
  | 'printPageMain'
  | 'downloadPdfAriaLabel'
  | 'viewModeVertical'
  | 'viewModeHorizontal'
  | 'viewModeFlip'
  | 'nextPage'
  | 'previousPage'
  | 'pageIndicator';

export type MdxComponent = ComponentType<{
  components?: Record<string, unknown>;
  [key: string]: unknown;
}>;

type ContentDictionary = Record<ContentKey, MdxComponent>;

export type LocaleContentRegistry = Record<Locale, ContentDictionary>;
