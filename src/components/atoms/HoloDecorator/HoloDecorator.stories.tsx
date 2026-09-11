import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box, Flex } from 'styled-system/jsx';
import { HoloDecorator } from './HoloDecorator.tsx';

const headlineText = 'APTISPACE LMS';
const subheadlineText = 'Holographic metallic reflection on headline text';
const activeHeadline = 'HOLO SHEEN TEXT';
const standardHeadline = 'STANDARD TEXT';
const inactiveLabel = 'Holo Inactive:';
const activeLabel = 'Holo Active:';
const maskDescription =
  'Holographic SVG mask overlay reflecting across the card surface';

function HoloCardContainer({ children }: { children: React.ReactNode }) {
  return (
    <Box
      className="physics-card"
      p="6"
      borderRadius="large"
      bg="surfaceContainerHigh"
      borderWidth="1px"
      borderColor="outlineVariant"
      textAlign="center"
      minInlineSize="320px"
    >
      {children}
    </Box>
  );
}

const meta: Meta<typeof HoloDecorator> = {
  title: 'Atoms/HoloDecorator',
  component: HoloDecorator,
  parameters: {
    layout: 'centered',
  },
  args: {
    active: true,
    type: 'text',
    children: (
      <Box
        fontWeight="extrabold"
        fontSize="3xl"
        letterSpacing="tight"
        color="primary"
      >
        {headlineText}
      </Box>
    ),
  },
};

export default meta;
type Story = StoryObj<typeof HoloDecorator>;

export const Default: Story = {
  render: () => (
    <HoloCardContainer>
      <HoloDecorator active={true} type="text">
        <Box
          fontWeight="extrabold"
          fontSize="3xl"
          letterSpacing="tight"
          color="primary"
        >
          {headlineText}
        </Box>
      </HoloDecorator>
      <Box fontSize="sm" color="onSurfaceVariant" mt="2">
        {subheadlineText}
      </Box>
    </HoloCardContainer>
  ),
};

export const ImageMask: Story = {
  render: () => (
    <HoloCardContainer>
      <Flex direction="column" alignItems="center" gap="4">
        <HoloDecorator
          active={true}
          type="image"
          maskUrl="radial-gradient(circle, black 40%, transparent 80%)"
          maskSize="contain"
        >
          <Box
            inlineSize="80px"
            blockSize="80px"
            borderRadius="full"
            bg="primary"
          />
        </HoloDecorator>
        <Box fontSize="sm" color="onSurfaceVariant">
          {maskDescription}
        </Box>
      </Flex>
    </HoloCardContainer>
  ),
};

export const InactiveComparison: Story = {
  render: () => (
    <Flex gap="4" p="2">
      <Box
        p="4"
        borderWidth="1px"
        borderColor="outlineVariant"
        borderRadius="medium"
        bg="surface"
      >
        <Box fontSize="xs" fontWeight="bold" mb="2" color="outline">
          {inactiveLabel}
        </Box>
        <HoloDecorator active={false} type="text">
          <Box fontSize="xl" fontWeight="extrabold" color="onSurface">
            {standardHeadline}
          </Box>
        </HoloDecorator>
      </Box>

      <Box
        className="physics-card"
        p="4"
        borderWidth="1px"
        borderColor="outlineVariant"
        borderRadius="medium"
        bg="surfaceContainerHigh"
      >
        <Box fontSize="xs" fontWeight="bold" mb="2" color="outline">
          {activeLabel}
        </Box>
        <HoloDecorator active={true} type="text">
          <Box fontSize="xl" fontWeight="extrabold" color="primary">
            {activeHeadline}
          </Box>
        </HoloDecorator>
      </Box>
    </Flex>
  ),
};
