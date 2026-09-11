import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { Box } from 'styled-system/jsx';
import { ContentProvider } from '../../../i18n/ContentProvider.tsx';
import { MapSkeleton } from './MapSkeleton.tsx';

function SkeletonStoryHarness({
  width = '480px',
  height = '320px',
}: {
  width?: string;
  height?: string;
}): ReactNode {
  return (
    <ContentProvider>
      <Box width={width} height={height}>
        <MapSkeleton width="100%" height="100%" />
      </Box>
    </ContentProvider>
  );
}

const meta: Meta<typeof MapSkeleton> = {
  title: 'Atoms/MapSkeleton',
  component: MapSkeleton,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof MapSkeleton>;

export const Default: Story = {
  render: () => <SkeletonStoryHarness />,
};

export const BannerView: Story = {
  render: () => <SkeletonStoryHarness width="600px" height="220px" />,
};
