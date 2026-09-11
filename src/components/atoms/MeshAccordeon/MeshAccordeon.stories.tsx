import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box, Flex } from 'styled-system/jsx';
import { MeshAccordeon } from './MeshAccordeon.tsx';

function MockMapView() {
  return (
    <Flex
      inlineSize="100%"
      blockSize="100%"
      bg="surfaceContainerHigh"
      color="onSurface"
      direction="column"
      alignItems="center"
      justifyContent="center"
      position="relative"
      overflow="hidden"
      borderRadius="medium"
      p="4"
    >
      <Box
        position="absolute"
        inset="0"
        opacity="0.35"
        bg="radial-gradient(circle, var(--colors-primary) 1.5px, transparent 1.5px)"
        backgroundSize="28px 28px"
      />
      <Box
        position="absolute"
        inlineSize="120%"
        blockSize="36px"
        bg="secondaryContainer"
        opacity="0.75"
        transform="rotate(-18deg)"
        borderRadius="full"
      />
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        gap="2"
        position="relative"
        zIndex="1"
        bg="surface"
        p="3"
        borderRadius="large"
        shadow="elevation2"
        borderWidth="1px"
        borderColor="outlineVariant"
      >
        <Box
          inlineSize="16px"
          blockSize="16px"
          borderRadius="full"
          bg="primary"
        />
        <Box
          inlineSize="64px"
          blockSize="6px"
          borderRadius="full"
          bg="surfaceVariant"
        />
      </Flex>
    </Flex>
  );
}

function StoryContainer({ children }: { children: React.ReactNode }) {
  return (
    <Box
      inlineSize="640px"
      maxInlineSize="92vw"
      blockSize="380px"
      position="relative"
      p="2"
    >
      {children}
    </Box>
  );
}

const meta: Meta<typeof MeshAccordeon> = {
  title: 'Atoms/MeshAccordeon',
  component: MeshAccordeon,
  parameters: {
    layout: 'centered',
  },
  args: {
    folds: 2,
    defaultFolded: false,
    depth: 0.28,
    radius: 0.05,
    segments: 64,
    children: <MockMapView />,
  },
  decorators: [
    (Story) => (
      <StoryContainer>
        <Story />
      </StoryContainer>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MeshAccordeon>;

export const Default: Story = {};

export const FoldedSoftMesh: Story = {
  args: {
    folds: 2,
    defaultFolded: true,
  },
};

export const SingleFoldV: Story = {
  args: {
    folds: 1,
    defaultFolded: true,
  },
};

export const TripleFold: Story = {
  args: {
    folds: 3,
    defaultFolded: true,
  },
};

export const FallbackMode: Story = {
  args: {
    forceFallback: true,
    defaultFolded: true,
  },
};
