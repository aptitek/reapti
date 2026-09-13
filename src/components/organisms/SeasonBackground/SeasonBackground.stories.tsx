import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box } from 'styled-system/jsx';
import { SeasonBackground } from './SeasonBackground.tsx';

const meta: Meta<typeof SeasonBackground> = {
  title: 'Organisms/SeasonBackground',
  component: SeasonBackground,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof SeasonBackground>;

export const Default: Story = {
  render: () => (
    <Box inlineSize="100vw" blockSize="100vh">
      <SeasonBackground season="summer" mode="light" />
    </Box>
  ),
};

export const Spring: Story = {
  render: () => (
    <Box inlineSize="100vw" blockSize="100vh">
      <SeasonBackground season="spring" seasonProgress={0.0} mode="light" />
    </Box>
  ),
};

export const Fall: Story = {
  render: () => (
    <Box inlineSize="100vw" blockSize="100vh">
      <SeasonBackground season="fall" seasonProgress={2.0} mode="sunset" />
    </Box>
  ),
};

export const Winter: Story = {
  render: () => (
    <Box inlineSize="100vw" blockSize="100vh">
      <SeasonBackground season="winter" seasonProgress={3.0} mode="light" />
    </Box>
  ),
};

export const DarkMode: Story = {
  render: () => (
    <Box inlineSize="100vw" blockSize="100vh">
      <SeasonBackground mode="dark" showAurora={true} />
    </Box>
  ),
};

export const MinimalLayers: Story = {
  render: () => (
    <Box inlineSize="100vw" blockSize="100vh">
      <SeasonBackground
        showTree={false}
        showGrass={false}
        showClouds={false}
        showGodrays={false}
      />
    </Box>
  ),
};

export const WithChildren: Story = {
  render: () => (
    <Box inlineSize="100vw" blockSize="100vh">
      <SeasonBackground season="summer">
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          inlineSize="100%"
          blockSize="100%"
        >
          <Box
            p="32px"
            borderRadius="16px"
            background="var(--colors-surface, rgba(253, 246, 227, 0.85))"
            boxShadow="0 8px 32px var(--color-shadow-tree, rgba(0, 0, 0, 0.15))"
          />
        </Box>
      </SeasonBackground>
    </Box>
  ),
};

export const ExtraSkySpace: Story = {
  render: () => (
    <Box inlineSize="100vw" blockSize="100vh">
      <SeasonBackground season="summer" skySpace="32%" />
    </Box>
  ),
};
