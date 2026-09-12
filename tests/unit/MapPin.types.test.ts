import { describe, it, expect } from 'vitest';
import type {
  MapPinProps,
  MapPinChipVariant,
  MapPinAlignment,
  MapPinAnchor,
} from '../../src/components/atoms/MapPin/MapPin.types.ts';

describe('MapPin Type Contracts', () => {
  it('verifies valid MapPinProps configuration types', () => {
    const validChipVariant: MapPinChipVariant = 'elevated';
    const validAlignment: MapPinAlignment = 'map';
    const validAnchor: MapPinAnchor = 'bottom';

    const props: MapPinProps = {
      label: 'Campus Paris',
      color: 'var(--colors-primary)',
      icon: 'location_on',
      iconVariant: 'rounded',
      chipVariant: validChipVariant,
      billboard: true,
      longitude: 2.3522,
      latitude: 48.8566,
      pitchAlignment: validAlignment,
      rotationAlignment: 'auto',
      anchor: validAnchor,
      onClick: () => {},
      onChipClick: () => {},
      showRadar: true,
      showShadow: true,
      interactive: true,
      disabled: false,
      dataTestId: 'test-pin',
      ariaLabel: 'Campus Paris Location',
    };

    expect(props).toBeDefined();
    expect(props.label).toBe('Campus Paris');
    expect(props.chipVariant).toBe('elevated');
    expect(props.pitchAlignment).toBe('map');
  });

  it('allows minimal empty props configuration', () => {
    const minimal: MapPinProps = {};
    expect(minimal).toBeDefined();
  });
});
