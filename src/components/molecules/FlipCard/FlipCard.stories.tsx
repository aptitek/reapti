import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box, Flex } from 'styled-system/jsx';
import { FlipCard } from './FlipCard.tsx';

const studentIdTitle = 'STUDENT ID';
const studentNameLabel = 'Name';
const studentName = 'Jane Doe';
const backNotice =
  'This card belongs to the institution. If found, please return.';
const scanQrButton = 'Scan QR';
const hoverToTilt = 'Hover to tilt';
const clickToFlip = 'Click to flip';
const youFlippedIt = 'You flipped it!';
const fullFoilTitle = 'Full Foil';
const maskedHoloTitle = 'Masked Holo';
const ghostModeTitle = 'Ghost Mode';
const ghostModeDesc = 'Flip me to see the back content overlaid';
const secretTitle = 'TOP SECRET';
const secretDesc =
  'This content is physically located on the back of the glass card.';

function FrontPlaceholder() {
  return (
    <Flex
      p="6"
      inlineSize="100%"
      blockSize="100%"
      direction="column"
      justifyContent="space-between"
      bg="primaryContainer"
      color="onPrimaryContainer"
      borderRadius="medium"
    >
      <Box fontSize="xl" fontWeight="bold">
        {studentIdTitle}
      </Box>
      <Box>
        <Box fontSize="xs" opacity={0.8}>
          {studentNameLabel}
        </Box>
        <Box fontSize="lg" fontWeight="semibold">
          {studentName}
        </Box>
      </Box>
    </Flex>
  );
}

function BackPlaceholder() {
  return (
    <Flex
      p="6"
      inlineSize="100%"
      blockSize="100%"
      direction="column"
      justifyContent="center"
      alignItems="center"
      bg="surfaceContainerHigh"
      color="onSurface"
      borderRadius="medium"
      textAlign="center"
      gap="4"
    >
      <Box fontSize="sm">{backNotice}</Box>
      <Box
        px="4"
        py="2"
        borderRadius="full"
        bg="primary"
        color="onPrimary"
        fontSize="sm"
        fontWeight="bold"
      >
        {scanQrButton}
      </Box>
    </Flex>
  );
}

function StoryContainer({ children }: { children: React.ReactNode }) {
  return (
    <Box inlineSize="340px" blockSize="215px" position="relative" p="2">
      {children}
    </Box>
  );
}

const meta: Meta<typeof FlipCard> = {
  title: 'Molecules/FlipCard',
  component: FlipCard,
  parameters: {
    layout: 'centered',
  },
  args: {
    ratio: '85.6/53.98',
    frontContent: <FrontPlaceholder />,
    backContent: <BackPlaceholder />,
    elevation: 2,
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
type Story = StoryObj<typeof FlipCard>;

export const Default: Story = {};

export const StaticCard: Story = {
  args: {
    interactive: false,
    elevation: 1,
  },
};

export const CustomContent: Story = {
  args: {
    frontContent: (
      <Flex
        p="6"
        direction="column"
        blockSize="100%"
        justifyContent="center"
        alignItems="center"
        bg="surfaceContainerLow"
      >
        <Box fontSize="lg" fontWeight="bold">
          {hoverToTilt}
        </Box>
        <Box fontSize="sm" color="onSurfaceVariant" mt="1">
          {clickToFlip}
        </Box>
      </Flex>
    ),
    backContent: (
      <Flex
        p="6"
        direction="column"
        blockSize="100%"
        justifyContent="center"
        alignItems="center"
        bg="primary"
        color="onPrimary"
      >
        <Box fontSize="lg" fontWeight="bold">
          {youFlippedIt}
        </Box>
      </Flex>
    ),
    elevation: 3,
  },
};

export const HolographicFull: Story = {
  args: {
    showHolo: true,
    frontContent: (
      <Flex
        p="6"
        blockSize="100%"
        direction="column"
        justifyContent="center"
        alignItems="center"
        bg="surfaceVariant"
        color="onSurfaceVariant"
      >
        <Box fontSize="2xl" fontWeight="black" zIndex="1">
          {fullFoilTitle}
        </Box>
      </Flex>
    ),
    backContent: <BackPlaceholder />,
    elevation: 4,
  },
};

export const HolographicMasked: Story = {
  args: {
    showHolo: true,
    holoMaskImage:
      'radial-gradient(circle at center, black 30%, transparent 60%)',
    frontContent: (
      <Flex
        p="6"
        blockSize="100%"
        direction="column"
        justifyContent="center"
        alignItems="center"
        bg="secondaryContainer"
        color="onSecondaryContainer"
      >
        <Box fontSize="2xl" fontWeight="black" zIndex="1">
          {maskedHoloTitle}
        </Box>
      </Flex>
    ),
    backContent: <BackPlaceholder />,
    elevation: 4,
  },
};

export const TransparentCard: Story = {
  args: {
    isTransparent: true,
    frontContent: (
      <Flex
        p="6"
        blockSize="100%"
        direction="column"
        justifyContent="center"
        alignItems="center"
        color="primary"
      >
        <Box fontSize="xl" fontWeight="bold">
          {ghostModeTitle}
        </Box>
        <Box fontSize="xs" mt="1" textAlign="center">
          {ghostModeDesc}
        </Box>
      </Flex>
    ),
    backContent: (
      <Flex
        p="6"
        blockSize="100%"
        direction="column"
        justifyContent="center"
        alignItems="center"
        color="secondary"
      >
        <Box fontSize="xl" fontWeight="bold" mb="2">
          {secretTitle}
        </Box>
        <Box fontSize="xs" textAlign="center">
          {secretDesc}
        </Box>
      </Flex>
    ),
    elevation: 0,
  },
};
