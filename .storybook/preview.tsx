import type { Preview } from '@storybook/react-vite';
import { ContentProvider } from '../src/i18n/ContentProvider.tsx';
import '../src/index.css';

const preview: Preview = {
  decorators: [
    (Story) => (
      <ContentProvider>
        <Story />
      </ContentProvider>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
