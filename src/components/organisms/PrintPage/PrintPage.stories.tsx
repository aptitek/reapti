import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box, Flex } from 'styled-system/jsx';
import { PrintPage } from './PrintPage.tsx';

const page1Title = 'Chapter 1: Architectural Foundations';
const page1Body =
  'Material Design 3 Expressive and Panda CSS provide compile-time performance, dynamic color harmonics, and strict token adherence.';

const page2Title = 'Chapter 2: ISO 216 Geometry';
const page2Body =
  'Standard A4 aspect ratio of 210mm by 297mm (1 : 1.4142) guarantees visual continuity between screen rendering and physical print.';

const page3Title = 'Chapter 3: Static Playwright Automation';
const page3Body =
  'Playwright renders pixel-perfect PDFs at build time, stripping out interactive controls and the FAB to produce pure static documents.';

function SamplePageContent({ title, body }: { title: string; body: string }) {
  return (
    <Flex direction="column" gap="4">
      <Box fontSize="lg" fontWeight="bold">
        {title}
      </Box>
      <Box fontSize="sm" lineHeight="relaxed">
        {body}
      </Box>
    </Flex>
  );
}

const samplePages = [
  <SamplePageContent key="1" title={page1Title} body={page1Body} />,
  <SamplePageContent key="2" title={page2Title} body={page2Body} />,
  <SamplePageContent key="3" title={page3Title} body={page3Body} />,
];

const meta: Meta<typeof PrintPage> = {
  title: 'Organisms/PrintPage',
  component: PrintPage,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof PrintPage>;

export const Default: Story = {
  render: () => (
    <Box p="6">
      <PrintPage pages={samplePages} defaultMode="vertical" />
    </Box>
  ),
};

export const HorizontalScroll: Story = {
  render: () => (
    <Box p="6">
      <PrintPage pages={samplePages} defaultMode="horizontal" />
    </Box>
  ),
};

export const PageFlip: Story = {
  render: () => (
    <Box p="6">
      <PrintPage pages={samplePages} defaultMode="flip" />
    </Box>
  ),
};

export const PdfMode: Story = {
  render: () => (
    <Box p="6">
      <PrintPage pages={samplePages} defaultMode="vertical" isPdf={true} />
    </Box>
  ),
};
