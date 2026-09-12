import type { MapProps as ReactMapGLProps } from 'react-map-gl/maplibre';
import type { MapProps, MapPinItem } from './Map.types.ts';
import { md3SemanticTokens } from '../../../tokens/md3.ts';
import {
  syncMapPitchFactor,
  type TransitionMapTarget,
} from './useMap3DTransition.ts';

export const DEFAULT_MAP_STYLE = '/map-style.json';

export function getMapStyleUrl(mode: 'light' | 'dark' = 'light'): string {
  return mode === 'dark' ? '/map-style-dark.json' : '/map-style-light.json';
}

export const DEFAULT_COORDINATES = {
  longitude: 2.3522,
  latitude: 48.8566,
  zoom: 14,
  pitch: 0,
  bearing: 0,
};

export const DEFAULT_3D_CONFIG = {
  targetPitch: 55,
  targetBearing: -20,
  transitionDelayMs: 2000,
  transitionDurationMs: 2500,
};

export function resolveMapContainerClass(className?: string): string {
  return className
    ? `reapti_map_container ${className}`
    : 'reapti_map_container';
}

export function resolveEffectiveViewState(
  initialViewState: MapProps['initialViewState'],
  hasViewState: boolean
) {
  if (initialViewState) {
    return {
      ...initialViewState,
      pitch: initialViewState.pitch ?? 0,
      bearing: initialViewState.bearing ?? 0,
    };
  }
  return !hasViewState ? DEFAULT_COORDINATES : undefined;
}

export function resolveCenterCoordinates(props: MapProps): {
  longitude: number;
  latitude: number;
} {
  const vs = props.initialViewState;
  const lng =
    typeof vs?.longitude === 'number' ? vs.longitude : props.longitude;
  const lat = typeof vs?.latitude === 'number' ? vs.latitude : props.latitude;
  return {
    longitude: typeof lng === 'number' ? lng : DEFAULT_COORDINATES.longitude,
    latitude: typeof lat === 'number' ? lat : DEFAULT_COORDINATES.latitude,
  };
}

export function buildConveniencePin(
  props: MapProps,
  coords: { longitude: number; latitude: number }
): MapPinItem | undefined {
  if (
    !props.pinLabel &&
    !props.pinColor &&
    !props.pinIcon &&
    !props.pinAriaLabel
  ) {
    return undefined;
  }
  return {
    id: 'center-pin',
    longitude: coords.longitude,
    latitude: coords.latitude,
    label: props.pinLabel,
    color: props.pinColor,
    icon: props.pinIcon,
    ariaLabel: props.pinAriaLabel,
    billboard: true,
    pitchAlignment: 'viewport',
    rotationAlignment: 'viewport',
  };
}

export function resolveMapPins(props: MapProps): readonly MapPinItem[] {
  if (props.showPin === false) return [];
  const result: MapPinItem[] = [];
  if (props.pins?.length) result.push(...props.pins);
  if (props.pin) result.push(props.pin);
  if (result.length === 0) {
    const convenience = buildConveniencePin(
      props,
      resolveCenterCoordinates(props)
    );
    if (convenience) result.push(convenience);
  }
  return result;
}

export interface MapLike {
  getStyle?: () =>
    | {
        sources?: Record<string, { type?: string }>;
        layers?: Array<{
          id: string;
          type?: string;
          layout?: Record<string, unknown>;
        }>;
      }
    | undefined;
  getLayer?: (id: string) => unknown;
  setLayoutProperty?: (...args: readonly unknown[]) => unknown;
  addLayer?: (...args: readonly unknown[]) => unknown;
  on?: (event: string, listener: () => void) => unknown;
}

function hasExistingBuildingLayer(map: MapLike): boolean {
  for (const id of ['building-3d', '3d-buildings']) {
    if (map.getLayer?.(id)) {
      map.setLayoutProperty?.(id, 'visibility', 'visible');
      return true;
    }
  }
  return false;
}

function findVectorSourceId(
  sources?: Record<string, { type?: string }>
): string | undefined {
  if (!sources) return undefined;
  return Object.keys(sources).find((id) => sources[id]?.type === 'vector');
}

function findLabelLayerId(
  layers?: Array<{
    id: string;
    type?: string;
    layout?: Record<string, unknown>;
  }>
): string | undefined {
  return layers?.find(
    (l) => l.type === 'symbol' && Boolean(l.layout?.['text-field'])
  )?.id;
}

const DEFAULT_3D_BUILDING_COLOR =
  md3SemanticTokens.colors.surfaceVariant.value.base;

function resolveBuildingColor(): string {
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    const computed = window
      .getComputedStyle(document.documentElement)
      .getPropertyValue('--colors-surface-variant')
      .trim();
    if (computed && (computed.startsWith('#') || computed.startsWith('rgb'))) {
      return computed;
    }
  }
  return DEFAULT_3D_BUILDING_COLOR;
}

const createInterpolatedHeight = (vKey: string, fKey: string, def: number) => [
  'interpolate',
  ['linear'],
  ['zoom'],
  14,
  0,
  14.5,
  ['coalesce', ['get', vKey], ['get', fKey], def],
];

function create3DBuildingSpec(sourceId: string): Record<string, unknown> {
  return {
    id: '3d-buildings',
    source: sourceId,
    'source-layer': 'building',
    type: 'fill-extrusion',
    minzoom: 14,
    paint: {
      'fill-extrusion-color': resolveBuildingColor(),
      'fill-extrusion-height': createInterpolatedHeight(
        'render_height',
        'height',
        10
      ),
      'fill-extrusion-base': createInterpolatedHeight(
        'render_min_height',
        'min_height',
        0
      ),
      'fill-extrusion-opacity': 0.8,
    },
  };
}

export function add3DBuildingsLayer(map?: MapLike): boolean {
  if (!map?.getStyle) return false;
  if (hasExistingBuildingLayer(map)) return true;
  if (!map.addLayer) return false;

  const style = map.getStyle();
  const sourceId = findVectorSourceId(style?.sources);
  if (!sourceId) return false;

  const labelLayerId = findLabelLayerId(style?.layers);
  map.addLayer(create3DBuildingSpec(sourceId), labelLayerId);
  return true;
}

function hide3DBuildings(map: MapLike): void {
  for (const id of ['building-3d', '3d-buildings']) {
    if (map.getLayer?.(id)) {
      map.setLayoutProperty?.(id, 'visibility', 'none');
    }
  }
}

export function toggle3DBuildings(map?: MapLike, enable = true): boolean {
  if (!map) return false;
  if (!enable) {
    hide3DBuildings(map);
    return true;
  }
  const added = add3DBuildingsLayer(map);
  if (!added && map.on) {
    map.on('style.load', () => add3DBuildingsLayer(map));
  }
  return added;
}

export function createMapLoadHandler(
  props: MapProps,
  fallbackLoad?: ReactMapGLProps['onLoad']
): ReactMapGLProps['onLoad'] {
  return (e) => {
    toggle3DBuildings(
      e.target as unknown as MapLike,
      props.enable3DBuildings !== false
    );
    syncMapPitchFactor(e.target as unknown as TransitionMapTarget);
    const target = e.target as { on?: (event: string, cb: () => void) => void };
    target?.on?.('pitch', () => {
      syncMapPitchFactor(e.target as unknown as TransitionMapTarget);
    });
    fallbackLoad?.(e);
  };
}
