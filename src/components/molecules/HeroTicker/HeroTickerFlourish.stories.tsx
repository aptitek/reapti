import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box } from 'styled-system/jsx';
import { HeroTickerFlourish } from './HeroTickerFlourish.tsx';

const meta: Meta<typeof HeroTickerFlourish> = {
  title: 'Molecules/HeroTicker/Flourish',
  component: HeroTickerFlourish,
  parameters: {
    layout: 'centered',
  },
  args: {
    flourishStyle: 'swoosh',
    progress: 100,
    visible: true,
  },
  decorators: [
    (Story) => (
      <Box p="8" minInlineSize="320px" block-size="60px" position="relative">
        <Story />
      </Box>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof HeroTickerFlourish>;

export const Default: Story = {};

export const WaveStyle: Story = {
  args: {
    flourishStyle: 'wave',
  },
};

export const GlowLineStyle: Story = {
  args: {
    flourishStyle: 'glow-line',
  },
};
