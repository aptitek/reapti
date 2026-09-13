import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box } from 'styled-system/jsx';
import {
  AtmosphereLayer,
  CelestialLayer,
  LandscapeLayer,
  ForegroundGrassLayer,
} from './SeasonLayers.tsx';

const meta: Meta<typeof AtmosphereLayer> = {
  title: 'Organisms/SeasonBackground/Layers',
  component: AtmosphereLayer,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof AtmosphereLayer>;

export const AuroraAtmosphere: Story = {
  render: () => (
    <Box
      inlineSize="100vw"
      blockSize="100vh"
      position="relative"
      background="var(--color-solarized-base03, #002b36)"
    >
      <AtmosphereLayer showAurora={true} isDarkMode={true} />
    </Box>
  ),
};

export const SunCelestial: Story = {
  render: () => (
    <Box
      inlineSize="100vw"
      blockSize="100vh"
      position="relative"
      background="var(--color-solarized-base3, #fdf6e3)"
    >
      <CelestialLayer
        showCelestial={true}
        showGodrays={true}
        isDarkMode={false}
      />
    </Box>
  ),
};

export const MoonCelestial: Story = {
  render: () => (
    <Box
      inlineSize="100vw"
      blockSize="100vh"
      position="relative"
      background="var(--color-solarized-base03, #002b36)"
    >
      <CelestialLayer
        showCelestial={true}
        showGodrays={false}
        isDarkMode={true}
      />
    </Box>
  ),
};

export const SummerLandscape: Story = {
  render: () => (
    <Box
      inlineSize="100vw"
      blockSize="100vh"
      position="relative"
      background="var(--color-solarized-base3, #fdf6e3)"
    >
      <LandscapeLayer
        showClouds={true}
        showHills={true}
        showTree={true}
        seasonProgress={1.0}
        isDarkMode={false}
        parallax={{ x: 0, y: 0 }}
      />
    </Box>
  ),
};

export const ForegroundGrass: Story = {
  render: () => (
    <Box
      inlineSize="100vw"
      blockSize="100vh"
      position="relative"
      background="var(--color-solarized-base3, #fdf6e3)"
    >
      <ForegroundGrassLayer
        showGrass={true}
        seasonProgress={1.0}
        isDarkMode={false}
      />
    </Box>
  ),
};
