import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box } from 'styled-system/jsx';
import { PrintPageFab } from './PrintPageFab.tsx';

const samplePdfUrl = '/documents/document.pdf';
const samplePdfName = 'document.pdf';
const downloadNotice = 'FAB is rendered in bottom-right corner.';
const pdfModeNotice =
  'In PDF Mode (Playwright build), the FAB is omitted from DOM.';

const meta: Meta<typeof PrintPageFab> = {
  title: 'Organisms/PrintPage/PrintPageFab',
  component: PrintPageFab,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof PrintPageFab>;

export const Default: Story = {
  render: () => (
    <Box p="8">
      <Box>{downloadNotice}</Box>
      <PrintPageFab pdfUrl={samplePdfUrl} pdfFileName={samplePdfName} />
    </Box>
  ),
};

export const InPdfMode: Story = {
  render: () => (
    <Box p="8">
      <Box>{pdfModeNotice}</Box>
      <PrintPageFab
        pdfUrl={samplePdfUrl}
        pdfFileName={samplePdfName}
        isPdfMode={true}
      />
    </Box>
  ),
};
