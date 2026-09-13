import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box } from 'styled-system/jsx';
import { ThemeProvider } from './ThemeProvider.tsx';
import { useTheme } from './useTheme.ts';

function ThemeDemo() {
  const { themeName, mode, resolvedMode } = useTheme();
  const status = [themeName, mode, resolvedMode].join(' - ');
  return (
    <Box p="4" bg="surface" color="onSurface">
      {status}
    </Box>
  );
}

const meta: Meta<typeof ThemeProvider> = {
  title: 'Architecture/ThemeProvider',
  component: ThemeProvider,
};

export default meta;
type Story = StoryObj<typeof ThemeProvider>;

export const SolarizedLight: Story = {
  args: {
    defaultThemeName: 'solarized',
    defaultMode: 'light',
    children: <ThemeDemo />,
  },
};

export const SolarizedDark: Story = {
  args: {
    defaultThemeName: 'solarized',
    defaultMode: 'dark',
    children: <ThemeDemo />,
  },
};

export const Md3Light: Story = {
  args: {
    defaultThemeName: 'md3',
    defaultMode: 'light',
    children: <ThemeDemo />,
  },
};
