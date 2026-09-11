import { Flex } from 'styled-system/jsx';
import { M3eButton } from '@m3e/react/button';
import AppContent from './content/en/app.mdx';
import CtaContent from './content/en/cta.mdx';

export default function App() {
  return (
    <Flex
      minHeight="100vh"
      direction="column"
      alignItems="center"
      justifyContent="center"
      gap="4"
      p="8"
    >
      <AppContent />
      <M3eButton variant="filled">
        <CtaContent />
      </M3eButton>
    </Flex>
  );
}
