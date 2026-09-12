import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box, Flex } from 'styled-system/jsx';
import { HeroTicker } from './HeroTicker.tsx';
import {
  DEFAULT_HERO_TICKER_DRAW_SPEED,
  DEFAULT_HERO_TICKER_TYPE_SPEED,
  DEFAULT_HERO_TICKER_ERASE_SPEED,
  DEFAULT_HERO_TICKER_PAUSE_DURATION,
} from './heroTickerHelpers.ts';

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
    drawSpeed: DEFAULT_HERO_TICKER_DRAW_SPEED,
    typeSpeed: DEFAULT_HERO_TICKER_TYPE_SPEED,
    eraseSpeed: DEFAULT_HERO_TICKER_ERASE_SPEED,
    pauseDuration: DEFAULT_HERO_TICKER_PAUSE_DURATION,
  },
  argTypes: {
    drawSpeed: {
      control: { type: 'range', min: 400, max: 6000, step: 50 },
      description:
        'Total duration in ms to complete one draw cycle in cursive-draw mode.',
    },
    typeSpeed: {
      control: { type: 'range', min: 20, max: 300, step: 5 },
      description:
        'Delay in ms per character for cursive-type typewriter mode.',
    },
    eraseSpeed: {
      control: { type: 'range', min: 10, max: 150, step: 5 },
      description: 'Delay in ms per character erased in typewriter mode.',
    },
    pauseDuration: {
      control: { type: 'range', min: 500, max: 5000, step: 100 },
      description: 'Pause duration in ms between phrases.',
    },
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
    typeSpeed: 120,
    eraseSpeed: 50,
    pauseDuration: 2600,
  },
};

export const FinelyTunedSpeeds: Story = {
  args: {
    drawSpeed: 3600,
    pauseDuration: 3000,
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
