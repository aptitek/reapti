import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box, Flex } from 'styled-system/jsx';
import { HeroTicker } from './HeroTicker.tsx';

const meta: Meta<typeof HeroTicker> = {
  title: 'Molecules/HeroTicker',
  component: HeroTicker,
  parameters: {
    layout: 'centered',
  },
  args: {
    prefix: 'We craft ',
    phrases: [
      'revolutionary ideas',
      'limitless experiences',
      'sustainable futures',
      'artistic intelligence',
      'elegant software',
    ],
    suffix: ' that inspire.',
    animationMode: 'cursive-draw',
    accentColor: 'primary',
    flourish: 'swoosh',
    size: 'large',
    showControls: false,
    showNib: true,
    glow: false,
  },
  decorators: [
    (Story) => (
      <Box p="8" minInlineSize="680px" display="flex" justifyContent="center">
        <Story />
      </Box>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof HeroTicker>;

export const Default: Story = {};

export const CursiveTypewriter: Story = {
  args: {
    animationMode: 'cursive-type',
    typeSpeed: 70,
    eraseSpeed: 30,
    pauseDuration: 1800,
  },
};

export const FadeTransition: Story = {
  args: {
    animationMode: 'fade',
    pauseDuration: 2000,
  },
};

export const WithControls: Story = {
  args: {
    showControls: true,
  },
};

export const ThemeAccents: Story = {
  render: () => (
    <Flex direction="column" gap="8" align="center">
      <HeroTicker
        accentColor="primary"
        phrases={['Primary accent theme']}
        prefix="Mode: "
        suffix="."
        showControls={false}
      />
      <HeroTicker
        accentColor="secondary"
        phrases={['Secondary accent theme']}
        prefix="Mode: "
        suffix="."
        showControls={false}
      />
      <HeroTicker
        accentColor="tertiary"
        phrases={['Tertiary accent theme']}
        prefix="Mode: "
        suffix="."
        showControls={false}
      />
    </Flex>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Flex direction="column" gap="6" align="center">
      <HeroTicker
        size="large"
        phrases={['Large Display']}
        prefix="Size: "
        suffix="."
      />
      <HeroTicker
        size="medium"
        phrases={['Medium Display']}
        prefix="Size: "
        suffix="."
      />
      <HeroTicker
        size="small"
        phrases={['Small Display']}
        prefix="Size: "
        suffix="."
      />
    </Flex>
  ),
};

export const WithoutFlourish: Story = {
  args: {
    flourish: 'none',
  },
};

export const WaveFlourish: Story = {
  args: {
    flourish: 'wave',
  },
};

export const GlowLineFlourish: Story = {
  args: {
    flourish: 'glow-line',
  },
};

export const WithGlow: Story = {
  args: {
    glow: true,
  },
};
