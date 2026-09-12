import { describe, it, expect, vi } from 'vitest';
import * as React from 'react';
import { createElement, createRef, type ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

vi.mock('react-map-gl/maplibre', () => ({
  default: ({
    children,
    initialViewState: _ivs,
    mapStyle: _ms,
    mapLib: _ml,
    ...rest
  }: {
    children?: ReactNode;
    initialViewState?: unknown;
    mapStyle?: unknown;
    mapLib?: unknown;
    [key: string]: unknown;
  }) =>
    createElement('div', { 'data-testid': 'mock-maplibre', ...rest }, children),
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

import { Map, type MapRef } from '../../src/components/molecules/Map/Map.tsx';
import { createMapLoadHandler } from '../../src/components/molecules/Map/mapHelpers.ts';
import { MapPin } from '../../src/components/atoms/MapPin/MapPin.tsx';

describe('Map Surface Rendering', () => {
  it('renders map container with default test ID and container class', () => {
    const html = renderToStaticMarkup(
      createElement(Map, {
        initialViewState: { longitude: 2.3522, latitude: 48.8566, zoom: 12 },
      })
    );

    expect(html).toContain('data-testid="reapti-map"');
    expect(html).toContain('reapti_map_container');
  });

  it('renders loading skeleton when isLoading is true', () => {
    const html = renderToStaticMarkup(
      createElement(Map, {
        isLoading: true,
        dataTestId: 'loading-map',
      })
    );

    expect(html).toContain('data-testid="loading-map"');
    expect(html).toContain('reapti_map_skeleton_surface');
    expect(html).toContain('reapti_map_skeleton_backdrop');
    expect(html).toContain('reapti_map_skeleton_shimmer');
    expect(html).toContain('reapti_map_skeleton_radar');
  });

  it('renders non-OpenGL fallback surface when webGLSupported is false', () => {
    const html = renderToStaticMarkup(
      createElement(Map, {
        webGLSupported: false,
        dataTestId: 'fallback-map',
        pins: [
          { latitude: 45.758, longitude: 4.832, label: 'Place Bellecour' },
          { latitude: 45.772, longitude: 4.855 },
        ],
      })
    );

    expect(html).toContain('data-testid="fallback-map"');
    expect(html).toContain('reapti_map_fallback_surface');
    expect(html).toContain('reapti_map_fallback_card');
    expect(html).toContain('Place Bellecour');
    expect(html).toContain('45.7720° N, 4.8550° E');
  });

  it('renders map with custom dataTestId and className', () => {
    const html = renderToStaticMarkup(
      createElement(Map, {
        dataTestId: 'campus-map',
        className: 'custom-campus-wrapper',
      })
    );

    expect(html).toContain('data-testid="campus-map"');
    expect(html).toContain('custom-campus-wrapper');
  });
});

describe('Map Pins and Controls', () => {
  it('accepts and structures custom children and pin props', () => {
    const childPin = createElement(MapPin, {
      dataTestId: 'child-pin',
      label: 'Direct Child Campus',
    });

    const element = createElement(
      Map,
      {
        dataTestId: 'parent-map',
        pins: [{ longitude: 2.35, latitude: 48.85, label: 'Campus' }],
      },
      childPin
    );

    expect(element.props.dataTestId).toBe('parent-map');
    expect(element.props.pins).toHaveLength(1);
    expect(element.props.children).toBe(childPin);

    const html = renderToStaticMarkup(element);
    expect(html).toContain('data-testid="parent-map"');
    expect(html).toContain('reapti_map_container');
    expect(html).toContain('Campus');
  });

  it('renders pins with custom or automatic keys and empty pins gracefully', () => {
    const emptyHtml = renderToStaticMarkup(createElement(Map, { pins: [] }));
    expect(emptyHtml).toContain('reapti_map_container');

    const html = renderToStaticMarkup(
      createElement(Map, {
        pins: [
          {
            id: 'custom-key-1',
            longitude: 2.35,
            latitude: 48.85,
            label: 'Custom Key Campus',
          },
          {
            longitude: 2.36,
            latitude: 48.86,
            label: 'Auto Key Campus',
          },
        ],
      })
    );
    expect(html).toContain('Custom Key Campus');
    expect(html).toContain('Auto Key Campus');
  });
});

describe('Map Ref Forwarding', () => {
  it('supports ref forwarding for MapRef and executes handle resolution', () => {
    const internals = (
      React as unknown as {
        __CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE?: {
          H?: {
            useImperativeHandle?: (
              ref: unknown,
              init: () => unknown,
              deps?: unknown[]
            ) => void;
          };
        };
      }
    ).__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;

    let handleResolved = false;
    function Probe() {
      if (internals?.H) {
        const origHandle = internals.H.useImperativeHandle;
        internals.H.useImperativeHandle = (_ref, init, deps) => {
          init();
          handleResolved = true;
          origHandle?.(_ref, init, deps);
        };
      }
      return createElement(Map, { ref: createRef<MapRef>() });
    }

    renderToStaticMarkup(createElement(Probe));
    expect(handleResolved).toBe(true);
  });
});

describe('Map Load Handling', () => {
  it('handles map load event, pitch synchronization and fallback onLoad', () => {
    const fallbackLoad = vi.fn();
    const handler = createMapLoadHandler(
      { enable3DBuildings: true },
      fallbackLoad
    );

    let pitchCallback: (() => void) | undefined;
    const mockMap = {
      getPitch: vi.fn(() => 45),
      getCanvas: vi.fn(() => ({
        style: { setProperty: vi.fn() },
      })),
      getContainer: vi.fn(() => ({
        style: { setProperty: vi.fn() },
      })),
      setLayoutProperty: vi.fn(),
      addLayer: vi.fn(),
      getStyle: vi.fn(() => ({ layers: [] })),
      isStyleLoaded: vi.fn(() => true),
      on: vi.fn((event: string, cb: () => void) => {
        if (event === 'pitch') pitchCallback = cb;
      }),
    };

    const mockEvent = {
      target: mockMap,
      type: 'load',
    };

    handler?.(
      mockEvent as unknown as Parameters<NonNullable<typeof handler>>[0]
    );
    expect(fallbackLoad).toHaveBeenCalledWith(mockEvent);
    expect(mockMap.on).toHaveBeenCalledWith('pitch', expect.any(Function));

    pitchCallback?.();
    expect(mockMap.getPitch).toHaveBeenCalled();
  });

  it('handles map load event when enable3DBuildings is false and target lacks on', () => {
    const handler = createMapLoadHandler({ enable3DBuildings: false });
    const mockMap = {
      getPitch: vi.fn(() => 0),
      getCanvas: vi.fn(() => null),
      getContainer: vi.fn(() => null),
      setLayoutProperty: vi.fn(),
      addLayer: vi.fn(),
      getStyle: vi.fn(() => ({ layers: [] })),
      isStyleLoaded: vi.fn(() => true),
    };

    handler?.({ target: mockMap } as unknown as Parameters<
      NonNullable<typeof handler>
    >[0]);
    expect(mockMap.getPitch).toHaveBeenCalled();
  });
});
