import type { Meta, StoryObj } from '@storybook/react-vite';
import App from './App.tsx';

const meta: Meta<typeof App> = {
  title: 'Application/App',
  component: App,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof App>;

export const Default: Story = {};
