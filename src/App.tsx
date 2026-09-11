import { Flex } from 'styled-system/jsx';
import { M3eButton } from '@m3e/react/button';
import { ContentProvider } from './i18n/ContentProvider.tsx';
import { useLocale, useContentElement } from './i18n/context.tsx';

function MainView() {
  const { locale } = useLocale();
  const appContent = useContentElement('app');
  const ctaContent = useContentElement('cta');

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
    >
      {appContent}
      <M3eButton variant="filled">{ctaContent}</M3eButton>
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
