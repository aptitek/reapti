import { describe, it, expect, vi } from 'vitest';
import { createElement, type ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

vi.mock('react-map-gl/maplibre', () => ({
  Marker: ({
    children,
    longitude,
    latitude,
  }: {
    children?: ReactNode;
    longitude: number;
    latitude: number;
  }) =>
    createElement(
      'div',
      {
        'data-testid': 'mock-marker',
        'data-lng': longitude,
        'data-lat': latitude,
      },
      children
    ),
}));

import { MapPin } from '../../src/components/atoms/MapPin/MapPin.tsx';

describe('MapPin Static Rendering', () => {
  it('renders pin container with role img and MDI icon when non-interactive', () => {
    const html = renderToStaticMarkup(
      createElement(MapPin, {
        ariaLabel: 'Selected Campus Location',
        dataTestId: 'custom-pin',
      })
    );

    expect(html).toContain('role="img"');
    expect(html).toContain('aria-label="Selected Campus Location"');
    expect(html).toContain('data-testid="custom-pin"');
    expect(html).toContain('data-testid="custom-pin-icon"');
    expect(html).not.toContain('reapti_pin_tip');
    expect(html).toContain('data-testid="custom-pin-radar"');
    expect(html).toContain('m3e-icon');
    expect(html).toContain('data-icon="location_on"');
    expect(html).not.toContain('m3e-chip');
  });

  it('renders Chip label when label is supplied', () => {
    const html = renderToStaticMarkup(
      createElement(MapPin, {
        label: 'Paris Campus',
        dataTestId: 'chip-pin',
      })
    );

    expect(html).toContain('data-testid="chip-pin-chip"');
    expect(html).toContain('m3e-chip');
    expect(html).toContain('Paris Campus');
  });

  it('hides shadow and radar when disabled via props', () => {
    const html = renderToStaticMarkup(
      createElement(MapPin, {
        showRadar: false,
        showShadow: false,
        dataTestId: 'bare-pin',
      })
    );

    expect(html).not.toContain('data-testid="bare-pin-radar"');
    expect(html).not.toContain('reapti_pin_shadow');
  });
});

describe('MapPin Interactive Features', () => {
  it('renders interactive button role and tabIndex when onClick is provided', () => {
    const onClick = vi.fn();
    const html = renderToStaticMarkup(
      createElement(MapPin, {
        label: 'Interactive Pin',
        onClick,
        dataTestId: 'action-pin',
      })
    );

    expect(html).toContain('role="button"');
    expect(html).toContain('tabindex="0"');
    expect(html).toContain('reapti_pin--interactive');
  });

  it('supports custom icon and custom color', () => {
    const html = renderToStaticMarkup(
      createElement(MapPin, {
        icon: 'pin_drop',
        color: 'var(--colors-tertiary)',
        dataTestId: 'tertiary-pin',
      })
    );

    expect(html).toContain('data-icon="pin_drop"');
    expect(html).toContain('data-testid="tertiary-pin-icon"');
  });

  it('handles disabled state with modifier class', () => {
    const html = renderToStaticMarkup(
      createElement(MapPin, {
        disabled: true,
        onClick: vi.fn(),
        dataTestId: 'disabled-pin',
      })
    );

    expect(html).toContain('reapti_pin--disabled');
  });
});

describe('MapPin Spatial Projection Features', () => {
  it('renders spatial map marker when longitude and latitude are provided', () => {
    const onChipClick = vi.fn();
    const onClick = vi.fn();
    const html = renderToStaticMarkup(
      createElement(MapPin, {
        longitude: 2.3522,
        latitude: 48.8566,
        label: 'Spatial Campus',
        onClick,
        onChipClick,
        dataTestId: 'spatial-pin',
      })
    );

    expect(html).toContain('data-testid="spatial-pin-ground"');
    expect(html).toContain('reapti_pin_shadow');
    expect(html).toContain('data-testid="spatial-pin-radar"');
    expect(html).toContain('Spatial Campus');
  });

  it('renders spatial map marker without ground surface when disabled', () => {
    const html = renderToStaticMarkup(
      createElement(MapPin, {
        longitude: 2.3522,
        latitude: 48.8566,
        showShadow: false,
        showRadar: false,
        dataTestId: 'no-ground-pin',
      })
    );

    expect(html).not.toContain('data-testid="no-ground-pin-ground"');
    expect(html).toContain('data-testid="no-ground-pin"');
  });
});
