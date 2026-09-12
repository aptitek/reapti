import type { Meta, StoryObj } from '@storybook/react-vite';
import { Flex } from 'styled-system/jsx';
import { MapPin } from './MapPin.tsx';

const parisLabel = 'Campus Paris-Saclay';
const customIconLabel = 'Research Lab';
const customColorLabel = 'Health Center';
const customColorValue = 'var(--colors-tertiary)';
const errorColorValue = 'var(--colors-error)';
const cafeLabel = 'Café Central';

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
  render: () => (
    <Flex p="8" align="center" justify="center">
      <MapPin ariaLabel={parisLabel} />
    </Flex>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <Flex p="8" align="center" justify="center">
      <MapPin label={parisLabel} ariaLabel={parisLabel} />
    </Flex>
  ),
};

export const CustomColorAndIcon: Story = {
  render: () => (
    <Flex p="8" gap="12" align="center" justify="center">
      <MapPin label={customColorLabel} color={customColorValue} icon="place" />
      <MapPin label={customIconLabel} color={errorColorValue} icon="pin_drop" />
      <MapPin
        label={cafeLabel}
        color="var(--colors-secondary)"
        icon="location_on"
      />
    </Flex>
  ),
};

export const Interactive: Story = {
  render: () => (
    <Flex p="8" align="center" justify="center">
      <MapPin label={parisLabel} onClick={() => {}} onChipClick={() => {}} />
    </Flex>
  ),
};
