import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box } from 'styled-system/jsx';
import { HeroTickerControls } from './HeroTickerControls.tsx';

const demoPhrases = [
  'revolutionary ideas',
  'limitless experiences',
  'sustainable futures',
  'artistic intelligence',
];

function InteractiveControlsDemo() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  return (
    <HeroTickerControls
      phrases={demoPhrases}
      currentIndex={index}
      isPaused={paused}
      onPrev={() =>
        setIndex((i) => (i - 1 + demoPhrases.length) % demoPhrases.length)
      }
      onNext={() => setIndex((i) => (i + 1) % demoPhrases.length)}
      onTogglePause={() => setPaused((p) => !p)}
      onSelectIndex={(i) => setIndex(i)}
    />
  );
}

const meta: Meta<typeof HeroTickerControls> = {
  title: 'Molecules/HeroTicker/Controls',
  component: HeroTickerControls,
  parameters: {
    layout: 'centered',
  },
  args: {
    phrases: demoPhrases,
    currentIndex: 0,
    isPaused: false,
    onPrev: () => {},
    onNext: () => {},
    onTogglePause: () => {},
    onSelectIndex: () => {},
  },
  decorators: [
    (Story) => (
      <Box p="6">
        <Story />
      </Box>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof HeroTickerControls>;

export const Default: Story = {};

export const PausedState: Story = {
  args: {
    isPaused: true,
  },
};

export const Interactive: Story = {
  render: () => <InteractiveControlsDemo />,
};
