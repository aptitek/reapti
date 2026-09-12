import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box } from 'styled-system/jsx';
import { HeroTickerNib } from './HeroTickerNib.tsx';

const meta: Meta<typeof HeroTickerNib> = {
  title: 'Molecules/HeroTicker/Nib',
  component: HeroTickerNib,
  parameters: {
    layout: 'centered',
  },
  args: {
    progress: 50,
    phrase: 'calligraphy craftsmanship',
    active: true,
    visible: true,
    accentVar: 'var(--colors-primary)',
  },
  decorators: [
    (Story) => (
      <Box p="12" minInlineSize="300px" block-size="120px" position="relative">
        <Story />
      </Box>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof HeroTickerNib>;

export const Default: Story = {};

export const RestPosition: Story = {
  args: {
    progress: 0,
    active: false,
  },
};

export const PeakAscender: Story = {
  args: {
    progress: 25,
    phrase: 'flourishing letterform',
    active: true,
  },
};
