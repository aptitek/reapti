import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box } from 'styled-system/jsx';
import { ContentProvider } from './ContentProvider.tsx';
import { useLocale, useContentElement } from './context.tsx';

function DemoConsumer() {
  const { locale } = useLocale();
  const appContent = useContentElement('app');
  return (
    <Box p="4" bg="surface" color="onSurface" data-locale={locale}>
      {appContent}
    </Box>
  );
}

const meta: Meta<typeof ContentProvider> = {
  title: 'Architecture/ContentProvider',
  component: ContentProvider,
};

export default meta;
type Story = StoryObj<typeof ContentProvider>;

export const English: Story = {
  args: {
    initialLocale: 'en',
    children: <DemoConsumer />,
  },
};

export const French: Story = {
  args: {
    initialLocale: 'fr',
    children: <DemoConsumer />,
  },
};

export const German: Story = {
  args: {
    initialLocale: 'de',
    children: <DemoConsumer />,
  },
};

export const Spanish: Story = {
  args: {
    initialLocale: 'es',
    children: <DemoConsumer />,
  },
};
