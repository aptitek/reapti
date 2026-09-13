import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box, Flex } from 'styled-system/jsx';
import { FlipView } from './PrintPageFlipView.tsx';

const pageOneTitle = 'Chapter 1: Foundations';
const pageOneBody =
  'Aptitek book viewer with physical 3D paper curl and curvature.';
const pageTwoTitle = 'Chapter 2: Architecture';
const pageTwoBody =
  'Double-sided sheet with spine crease and fore-edge stack depth.';

const meta: Meta<typeof FlipView> = {
  title: 'Organisms/PrintPage/PrintPageFlipView',
  component: FlipView,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof FlipView>;

function PageOne() {
  return (
    <Flex direction="column" gap="4">
      <Box fontSize="xl" fontWeight="bold">
        {pageOneTitle}
      </Box>
      <Box fontSize="sm" lineHeight="relaxed">
        {pageOneBody}
      </Box>
    </Flex>
  );
}

function PageTwo() {
  return (
    <Flex direction="column" gap="4">
      <Box fontSize="xl" fontWeight="bold">
        {pageTwoTitle}
      </Box>
      <Box fontSize="sm" lineHeight="relaxed">
        {pageTwoBody}
      </Box>
    </Flex>
  );
}

const samplePages = [<PageOne key="1" />, <PageTwo key="2" />];

export const Default: Story = {
  render: () => (
    <Box p="6" inlineSize="420px" position="relative">
      <FlipView
        currentPage={1}
        targetPage={1}
        totalPages={2}
        cardVariant="elevated"
        flipDirection="idle"
        pageItems={samplePages}
      />
    </Box>
  ),
};

export const FlippingNext: Story = {
  render: () => (
    <Box p="6" inlineSize="420px" position="relative">
      <FlipView
        currentPage={1}
        targetPage={2}
        totalPages={2}
        cardVariant="elevated"
        flipDirection="next"
        pageItems={samplePages}
      />
    </Box>
  ),
};

export const FlippingPrev: Story = {
  render: () => (
    <Box p="6" inlineSize="420px" position="relative">
      <FlipView
        currentPage={2}
        targetPage={1}
        totalPages={2}
        cardVariant="elevated"
        flipDirection="prev"
        pageItems={samplePages}
      />
    </Box>
  ),
};
