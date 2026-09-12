import { describe, it, expect, vi } from 'vitest';
import {
  DEFAULT_MAP_STYLE,
  getMapStyleUrl,
  DEFAULT_COORDINATES,
  DEFAULT_3D_CONFIG,
  resolveMapContainerClass,
  resolveEffectiveViewState,
  resolveCenterCoordinates,
  buildConveniencePin,
  resolveMapPins,
  add3DBuildingsLayer,
  toggle3DBuildings,
  createMapLoadHandler,
  type MapLike,
} from '../../src/components/molecules/Map/mapHelpers.ts';

describe('Map Helpers Basic Resolution', () => {
  it('provides openfreemap style and 3D defaults', () => {
    expect(DEFAULT_MAP_STYLE).toBe('/map-style.json');
    expect(getMapStyleUrl('light')).toBe('/map-style-light.json');
    expect(getMapStyleUrl('dark')).toBe('/map-style-dark.json');
    expect(getMapStyleUrl()).toBe('/map-style-light.json');
    expect(DEFAULT_COORDINATES).toEqual({
      longitude: 2.3522,
      latitude: 48.8566,
      zoom: 14,
      pitch: 0,
      bearing: 0,
    });
    expect(DEFAULT_3D_CONFIG).toEqual({
      targetPitch: 55,
      targetBearing: -20,
      transitionDelayMs: 2000,
      transitionDurationMs: 2500,
    });
  });

  it('resolves container classes with custom class extensions', () => {
    expect(resolveMapContainerClass()).toBe('reapti_map_container');
    expect(resolveMapContainerClass('custom-map')).toBe(
      'reapti_map_container custom-map'
    );
  });

  it('ensures effective view state starts in 2D by default and handles hasViewState', () => {
    const fromProps = resolveEffectiveViewState(
      { longitude: 10, latitude: 20, zoom: 14 },
      false
    );
    expect(fromProps?.pitch).toBe(0);

    const withPitchBearing = resolveEffectiveViewState(
      { longitude: 10, latitude: 20, zoom: 14, pitch: 45, bearing: 30 },
      false
    );
    expect(withPitchBearing?.pitch).toBe(45);
    expect(withPitchBearing?.bearing).toBe(30);

    expect(resolveEffectiveViewState(undefined, true)).toBeUndefined();
    expect(resolveEffectiveViewState(undefined, false)?.pitch).toBe(0);
  });
});

describe('Map Helpers Pin Logic', () => {
  it('resolves center coordinates from initialViewState, direct props, or default', () => {
    expect(
      resolveCenterCoordinates({
        initialViewState: { longitude: 12, latitude: 34 },
      })
    ).toEqual({ longitude: 12, latitude: 34 });

    expect(
      resolveCenterCoordinates({
        longitude: 30,
        latitude: 40,
      })
    ).toEqual({ longitude: 30, latitude: 40 });

    expect(resolveCenterCoordinates({})).toEqual({
      longitude: DEFAULT_COORDINATES.longitude,
      latitude: DEFAULT_COORDINATES.latitude,
    });
  });

  it('builds convenience pin only when single pin properties exist', () => {
    const coords = { longitude: 2.35, latitude: 48.85 };
    expect(buildConveniencePin({}, coords)).toBeUndefined();

    const pin = buildConveniencePin(
      {
        pinLabel: 'Paris Campus',
        pinColor: 'var(--colors-primary)',
        pinIcon: 'school',
        pinAriaLabel: 'School Campus',
      },
      coords
    );
    expect(pin?.label).toBe('Paris Campus');
    expect(pin?.color).toBe('var(--colors-primary)');
    expect(pin?.icon).toBe('school');
    expect(pin?.ariaLabel).toBe('School Campus');
    expect(pin?.billboard).toBe(true);
  });

  it('resolves map pins adhering to showPin flag and pin lists', () => {
    expect(
      resolveMapPins({
        showPin: false,
        pinLabel: 'Hidden Pin',
      })
    ).toEqual([]);

    const singlePin = resolveMapPins({
      pin: { id: 'single', longitude: 10, latitude: 20 },
    });
    expect(singlePin).toHaveLength(1);

    const multiple = resolveMapPins({
      pins: [{ id: 'p1', longitude: 1, latitude: 2, label: 'Pin 1' }],
      pin: { id: 'p2', longitude: 3, latitude: 4 },
    });
    expect(multiple).toHaveLength(2);

    expect(resolveMapPins({})).toEqual([]);
    expect(resolveMapPins({ pinLabel: 'Auto' })).toHaveLength(1);
  });
});

describe('Map Helpers 3D Buildings Layer', () => {
  it('enables existing 3D building layer if present (building-3d or 3d-buildings)', () => {
    const setLayoutProperty = vi.fn();
    const map1 = {
      getStyle: () => ({ sources: {}, layers: [] }),
      getLayer: (id: string) => (id === 'building-3d' ? {} : undefined),
      setLayoutProperty,
    };
    expect(add3DBuildingsLayer(map1)).toBe(true);
    expect(setLayoutProperty).toHaveBeenCalledWith(
      'building-3d',
      'visibility',
      'visible'
    );

    const map2 = {
      getStyle: () => ({ sources: {}, layers: [] }),
      getLayer: (id: string) => (id === '3d-buildings' ? {} : undefined),
      setLayoutProperty,
    };
    expect(add3DBuildingsLayer(map2)).toBe(true);
  });

  it('resolves building color from DOM when available or falls back to default', () => {
    const origWindow = Reflect.get(globalThis, 'window');
    const origDocument = Reflect.get(globalThis, 'document');
    const addLayer = vi.fn();
    const mockMap = {
      getStyle: () => ({ sources: { osm: { type: 'vector' } }, layers: [] }),
      getLayer: () => undefined,
      addLayer,
    };

    Reflect.set(globalThis, 'window', {
      getComputedStyle: () => ({ getPropertyValue: () => '#445566' }),
    });
    Reflect.set(globalThis, 'document', { documentElement: {} });

    try {
      add3DBuildingsLayer(mockMap);
      expect(addLayer).toHaveBeenCalledWith(
        expect.objectContaining({
          paint: expect.objectContaining({ 'fill-extrusion-color': '#445566' }),
        }),
        undefined
      );
    } finally {
      Reflect.set(globalThis, 'window', origWindow);
      Reflect.set(globalThis, 'document', origDocument);
    }
  });

  it('handles edge cases where map, getStyle, or addLayer are missing', () => {
    expect(add3DBuildingsLayer(undefined)).toBe(false);
    expect(add3DBuildingsLayer({})).toBe(false);
    expect(
      add3DBuildingsLayer({ getStyle: () => ({ sources: {}, layers: [] }) })
    ).toBe(false);
  });
});

describe('Map Helpers 3D Toggle and Load Handler', () => {
  it('handles missing vector sources and styles without label layers', () => {
    const addLayer = vi.fn();
    const noVector = {
      getStyle: () => ({
        sources: { raster: { type: 'raster' } },
        layers: [],
      }),
      getLayer: () => undefined,
      addLayer,
    };
    expect(add3DBuildingsLayer(noVector)).toBe(false);

    const noLayers = {
      getStyle: () => ({ sources: { osm: { type: 'vector' } } }),
      getLayer: () => undefined,
      addLayer,
    };
    expect(add3DBuildingsLayer(noLayers)).toBe(true);
  });

  it('hides 3D buildings layer when disabled via toggle3DBuildings', () => {
    expect(toggle3DBuildings(undefined)).toBe(false);
    const setLayoutProperty = vi.fn();
    const mockMap = {
      getLayer: (id: string) =>
        id === 'building-3d' || id === '3d-buildings' ? {} : undefined,
      setLayoutProperty,
    };

    expect(toggle3DBuildings(mockMap, false)).toBe(true);
    expect(setLayoutProperty).toHaveBeenCalledWith(
      'building-3d',
      'visibility',
      'none'
    );
  });

  it('retries add3DBuildingsLayer on style.load and runs createMapLoadHandler', () => {
    let styleLoadListener: (() => void) | undefined;
    const addLayer = vi.fn();
    let isLoaded = false;

    const mockMap: MapLike = {
      getStyle: () =>
        isLoaded
          ? { sources: { osm: { type: 'vector' } }, layers: [] }
          : undefined,
      getLayer: () => undefined,
      addLayer,
      on: vi.fn((event: string, cb: () => void) => {
        if (event === 'style.load') styleLoadListener = cb;
      }),
    };

    expect(toggle3DBuildings(mockMap, true)).toBe(false);
    isLoaded = true;
    styleLoadListener?.();
    expect(addLayer).toHaveBeenCalled();

    const fallbackLoad = vi.fn();
    const handler = createMapLoadHandler(
      { enable3DBuildings: true },
      fallbackLoad
    );
    const mockEvent = { target: mockMap };
    handler(mockEvent);
    expect(fallbackLoad).toHaveBeenCalledWith(mockEvent);
  });
});
