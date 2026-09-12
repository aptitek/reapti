import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box } from 'styled-system/jsx';
import { NavigationControl } from 'react-map-gl/maplibre';
import { Map } from './Map.tsx';
import { MapPin } from '../../atoms/MapPin/MapPin.tsx';
import type { MapPinItem } from './Map.types.ts';

const campusParisLabel = 'Campus Paris-Saclay';
const libraryLabel = 'Central Library';
const innovationHubLabel = 'Innovation Hub';
const directChildLabel = 'Direct Child Pin';
const scienceParkLabel = 'Science Park';

const sample3DPins: readonly MapPinItem[] = [
  {
    id: 'pin-1',
    longitude: 2.3522,
    latitude: 48.8566,
    label: campusParisLabel,
    color: 'var(--colors-primary)',
    icon: 'location_on',
    billboard: true,
  },
  {
    id: 'pin-2',
    longitude: 2.358,
    latitude: 48.859,
    label: libraryLabel,
    color: 'var(--colors-tertiary)',
    icon: 'school',
    billboard: true,
  },
  {
    id: 'pin-3',
    longitude: 2.348,
    latitude: 48.854,
    label: innovationHubLabel,
    color: 'var(--colors-secondary)',
    icon: 'apartment',
    billboard: true,
  },
];

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
  render: () => (
    <Box inlineSize="760px" blockSize="500px">
      <Map
        initialViewState={{
          longitude: 2.3522,
          latitude: 48.8566,
          zoom: 14,
        }}
        pinLabel={campusParisLabel}
      >
        <NavigationControl position="top-right" />
      </Map>
    </Box>
  ),
};

export const MultiplePins3DView: Story = {
  render: () => (
    <Box inlineSize="760px" blockSize="500px">
      <Map
        initialViewState={{
          longitude: 2.3522,
          latitude: 48.8566,
          zoom: 14,
        }}
        pins={sample3DPins}
        targetPitch={60}
        targetBearing={-25}
        transitionDelayMs={1500}
      >
        <NavigationControl position="top-right" />
      </Map>
    </Box>
  ),
};

export const ComposableChildren: Story = {
  render: () => (
    <Box inlineSize="720px" blockSize="480px">
      <Map
        initialViewState={{
          longitude: 2.3522,
          latitude: 48.8566,
          zoom: 14,
        }}
      >
        <MapPin
          longitude={2.3522}
          latitude={48.8566}
          label={directChildLabel}
          color="var(--colors-primary)"
          icon="pin_drop"
          billboard
        />
        <MapPin
          longitude={2.358}
          latitude={48.859}
          label={scienceParkLabel}
          color="var(--colors-error)"
          icon="place"
          billboard
        />
        <NavigationControl position="top-right" />
      </Map>
    </Box>
  ),
};

export const LoadingState: Story = {
  render: () => (
    <Box inlineSize="720px" blockSize="480px">
      <Map isLoading />
    </Box>
  ),
};

export const WebGLDisabledFallback: Story = {
  render: () => (
    <Box inlineSize="720px" blockSize="480px">
      <Map
        webGLSupported={false}
        pins={[
          {
            id: 'lyon-1',
            latitude: 45.758,
            longitude: 4.832,
            label: 'Place Bellecour, Lyon',
          },
          {
            id: 'lyon-2',
            latitude: 45.772,
            longitude: 4.855,
            label: "Parc de la Tête d'Or, Lyon",
          },
        ]}
      />
    </Box>
  ),
};
