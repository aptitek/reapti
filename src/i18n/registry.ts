import type { LocaleContentRegistry } from './types.ts';

import EnApp from '../content/en/app.mdx';
import EnCta from '../content/en/cta.mdx';
import FrApp from '../content/fr/app.mdx';
import FrCta from '../content/fr/cta.mdx';
import DeApp from '../content/de/app.mdx';
import DeCta from '../content/de/cta.mdx';
import EsApp from '../content/es/app.mdx';
import EsCta from '../content/es/cta.mdx';

export const CONTENT_REGISTRY: LocaleContentRegistry = {
  en: {
    app: EnApp,
    cta: EnCta,
  },
  fr: {
    app: FrApp,
    cta: FrCta,
  },
  de: {
    app: DeApp,
    cta: DeCta,
  },
  es: {
    app: EsApp,
    cta: EsCta,
  },
};
