import { describe, it, expect } from 'vitest';
import type {
  MapProps,
  MapPinItem,
  MapRef,
} from '../../src/components/molecules/Map/Map.types.ts';

describe('Map Type Contracts', () => {
  it('verifies valid MapProps configuration extending react-map-gl MapProps with 3D options', () => {
    const pinItem: MapPinItem = {
      id: 'pin-1',
      longitude: 2.3522,
      latitude: 48.8566,
      label: 'Campus Paris',
      billboard: true,
      pitchAlignment: 'viewport',
    };

    const props: MapProps = {
      initialViewState: {
        longitude: 2.3522,
        latitude: 48.8566,
        zoom: 15.5,
        pitch: 0,
        bearing: 0,
      },
      mapStyle: 'https://tiles.openfreemap.org/styles/liberty',
      interactive: true,
      cursor: 'grab',
      enable3DBuildings: true,
      autoTransitionTo3D: true,
      transitionDelayMs: 2000,
      transitionDurationMs: 2500,
      targetPitch: 55,
      targetBearing: -20,
      pins: [pinItem],
      pinLabel: 'Center',
      showPin: true,
      dataTestId: 'custom-map',
      isLoading: false,
    };

    expect(props).toBeDefined();
    expect(props.enable3DBuildings).toBe(true);
    expect(props.autoTransitionTo3D).toBe(true);
    expect(props.targetPitch).toBe(55);
  });

  it('verifies MapRef type contract compatibility', () => {
    const refHandler = (mapRef: MapRef | null) => {
      if (mapRef) {
        expect(typeof mapRef.getMap).toBe('function');
      }
    };
    expect(refHandler).toBeDefined();
  });
});
