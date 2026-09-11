import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { useA11yString } from '../../../i18n/context.tsx';
import { MapPin } from './MapPin.tsx';

function MapPinStoryHarness({ withLabel }: { withLabel?: boolean }): ReactNode {
  const pinLabel = withLabel ? 'Campus Paris-Saclay' : undefined;
  const ariaLabel = useA11yString('appMain');

  return <MapPin label={pinLabel} ariaLabel={ariaLabel} />;
}

const meta: Meta<typeof MapPin> = {
  title: 'Atoms/MapPin',
  component: MapPin,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof MapPin>;

export const Default: Story = {
  render: () => <MapPinStoryHarness />,
};

export const WithLabel: Story = {
  render: () => <MapPinStoryHarness withLabel />,
};
