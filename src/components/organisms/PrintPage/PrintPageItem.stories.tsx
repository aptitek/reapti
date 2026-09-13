import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box, Flex } from 'styled-system/jsx';
import { PrintPageItem } from './PrintPageItem.tsx';

const samplePageTitle = 'Executive Summary';
const samplePageBody =
  'This page demonstrates the A4 aspect ratio card rendered via M3eCard. It provides visual elevation and padding.';
const customHeaderTitle = 'CONFIDENTIAL ARCHITECTURE';

const meta: Meta<typeof PrintPageItem> = {
  title: 'Organisms/PrintPage/PrintPageItem',
  component: PrintPageItem,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof PrintPageItem>;

function SamplePageContent() {
  return (
    <Flex direction="column" gap="4">
      <Box fontSize="xl" fontWeight="bold">
        {samplePageTitle}
      </Box>
      <Box fontSize="sm" lineHeight="relaxed">
        {samplePageBody}
      </Box>
    </Flex>
  );
}

export const Default: Story = {
  render: () => (
    <Box p="4" inlineSize="360px">
      <PrintPageItem pageNumber={1} totalPages={3} variant="elevated">
        <SamplePageContent />
      </PrintPageItem>
    </Box>
  ),
};

export const Outlined: Story = {
  render: () => (
    <Box p="4" inlineSize="360px">
      <PrintPageItem pageNumber={2} totalPages={3} variant="outlined">
        <SamplePageContent />
      </PrintPageItem>
    </Box>
  ),
};

export const WithCustomHeader: Story = {
  render: () => (
    <Box p="4" inlineSize="360px">
      <PrintPageItem
        pageNumber={1}
        totalPages={1}
        variant="elevated"
        header={
          <Box fontSize="xs" fontWeight="bold">
            {customHeaderTitle}
          </Box>
        }
      >
        <SamplePageContent />
      </PrintPageItem>
    </Box>
  ),
};
