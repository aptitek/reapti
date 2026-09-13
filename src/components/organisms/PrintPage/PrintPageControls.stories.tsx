import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box } from 'styled-system/jsx';
import { PrintPageControls } from './PrintPageControls.tsx';
import type { PrintPageViewMode } from './PrintPage.types.ts';

const meta: Meta<typeof PrintPageControls> = {
  title: 'Organisms/PrintPage/PrintPageControls',
  component: PrintPageControls,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof PrintPageControls>;

function InteractiveControlsDemo({
  initialMode = 'vertical',
  initialPage = 1,
  totalPages = 4,
}: {
  initialMode?: PrintPageViewMode;
  initialPage?: number;
  totalPages?: number;
}) {
  const [viewMode, setViewMode] = useState<PrintPageViewMode>(initialMode);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);

  return (
    <Box p="6" inlineSize="400px">
      <PrintPageControls
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        currentPage={currentPage}
        totalPages={totalPages}
        onPrevPage={() => setCurrentPage((p) => Math.max(1, p - 1))}
        onNextPage={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
      />
    </Box>
  );
}

export const Default: Story = {
  render: () => (
    <InteractiveControlsDemo initialMode="vertical" initialPage={1} />
  ),
};

export const HorizontalMode: Story = {
  render: () => (
    <InteractiveControlsDemo initialMode="horizontal" initialPage={2} />
  ),
};

export const FlipMode: Story = {
  render: () => <InteractiveControlsDemo initialMode="flip" initialPage={3} />,
};
