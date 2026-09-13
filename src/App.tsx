import { useState } from 'react';
import { Flex } from 'styled-system/jsx';
import { M3eButton } from '@m3e/react/button';
import { ContentProvider } from './i18n/ContentProvider.tsx';
import {
  useLocale,
  useContentElement,
  useA11yString,
} from './i18n/context.tsx';
import { PrintPage } from './components/organisms/PrintPage/PrintPage.tsx';
import { isPlaywrightEnvironment } from './components/organisms/PrintPage/printPageHelpers.ts';
import DocumentContent from './content/en/document.mdx';

export function MainView() {
  const { locale } = useLocale();
  const appContent = useContentElement('app');
  const ctaContent = useContentElement('cta');
  const appAriaLabel = useA11yString('appMain');
  const ctaAriaLabel = useA11yString('ctaAction');

  const [isDossierView, setIsDossierView] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return (
      window.location.search.includes('print=true') ||
      window.location.search.includes('pdf=true') ||
      window.location.search.includes('view=dossier')
    );
  });

  const isPdf = isPlaywrightEnvironment();

  if (isDossierView || isPdf) {
    return (
      <PrintPage isPdf={isPdf}>
        <DocumentContent />
      </PrintPage>
    );
  }

  return (
    <Flex
      minHeight="100vh"
      direction="column"
      alignItems="center"
      justifyContent="center"
      gap="4"
      p="8"
      bg="surface"
      color="onSurface"
      data-locale={locale}
      role="main"
      aria-label={appAriaLabel}
    >
      {appContent}
      <M3eButton
        variant="filled"
        aria-label={ctaAriaLabel}
        onClick={() => setIsDossierView(true)}
      >
        {ctaContent}
      </M3eButton>
    </Flex>
  );
}

export default function App() {
  return (
    <ContentProvider>
      <MainView />
    </ContentProvider>
  );
}
