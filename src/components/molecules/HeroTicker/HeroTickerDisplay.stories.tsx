import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box } from 'styled-system/jsx';
import { HeroTickerDisplay } from './HeroTickerDisplay.tsx';

const meta: Meta<typeof HeroTickerDisplay> = {
  title: 'Molecules/HeroTicker/Display',
  component: HeroTickerDisplay,
  parameters: {
    layout: 'centered',
  },
  args: {
    as: 'h1',
    size: 'large',
    prefix: 'We craft ',
    suffix: ' that inspire.',
    visibleText: 'revolutionary ideas',
    fullSloganText: 'We craft revolutionary ideas that inspire.',
    currentPhrase: 'revolutionary ideas',
    animationMode: 'cursive-draw',
    drawProgress: 100,
    currentProgress: 100,
    fadeOpacity: 1,
    isDrawing: false,
    showNib: true,
    flourish: 'swoosh',
    accentVar: 'var(--colors-primary)',
  },
  decorators: [
    (Story) => (
      <Box p="6" display="flex" justifyContent="center">
        <Story />
      </Box>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof HeroTickerDisplay>;

export const Default: Story = {};

export const MidDrawState: Story = {
  args: {
    drawProgress: 55,
    currentProgress: 55,
    isDrawing: true,
  },
};

export const SmallScale: Story = {
  args: {
    size: 'small',
  },
};
