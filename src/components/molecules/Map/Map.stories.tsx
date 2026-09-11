import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { Box } from 'styled-system/jsx';
import { ContentProvider } from '../../../i18n/ContentProvider.tsx';
import { Map } from './Map.tsx';

function MapStoryHarness({
  isLoading,
  pinLabel,
}: {
  isLoading?: boolean;
  pinLabel?: string;
}): ReactNode {
  return (
    <ContentProvider>
      <Box width="640px" height="400px">
        <Map
          isLoading={isLoading}
          pinLabel={pinLabel}
          pinAriaLabel="Map Center Pin"
        />
      </Box>
    </ContentProvider>
  );
}

const meta: Meta<typeof Map> = {
  title: 'Molecules/Map',
  component: Map,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Map>;

export const Default: Story = {
  render: () => <MapStoryHarness />,
};

export const LoadingState: Story = {
  render: () => <MapStoryHarness isLoading />,
};

export const WithPinLabel: Story = {
  render: () => <MapStoryHarness pinLabel="Campus Central" />,
};
