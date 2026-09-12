import { md3SemanticTokens } from '../../../tokens/md3.ts';

export type MapThemeMode = 'light' | 'dark';

export interface MapStyleThemeTokens {
  background: string;
  park: string;
  water: string;
  residential: string;
  building: string;
  buildingOutline: string;
  roadSurface: string;
  roadCasing: string;
  motorwaySurface: string;
  motorwayCasing: string;
  boundary: string;
  textPrimary: string;
  textSecondary: string;
  waterLabel: string;
  halo: string;
}

export interface GenerateMapStyleOptions {
  mode?: MapThemeMode;
  tokens?: Partial<MapStyleThemeTokens>;
  sources?: Record<string, unknown>;
  sprite?: string;
  glyphs?: string;
}

export const OPENFREEMAP_SOURCES = {
  openmaptiles: {
    type: 'vector',
    url: 'https://tiles.openfreemap.org/planet',
  },
};

export const OPENFREEMAP_SPRITE =
  'https://tiles.openfreemap.org/sprites/ofm_f384/ofm';
export const OPENFREEMAP_GLYPHS =
  'https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf';

const c = md3SemanticTokens.colors;

const createTokenSet = (key: 'base' | '_dark'): MapStyleThemeTokens => ({
  background: c.surface.value[key],
  park: c.secondaryContainer.value[key],
  water: c.primaryContainer.value[key],
  residential: c.surfaceContainerLow.value[key],
  building: c.surfaceVariant.value[key],
  buildingOutline: c.outlineVariant.value[key],
  roadSurface:
    key === '_dark'
      ? c.surfaceContainerHigh.value._dark
      : c.surfaceContainerLowest.value.base,
  roadCasing: c.outlineVariant.value[key],
  motorwaySurface:
    key === '_dark'
      ? c.surfaceContainerHighest.value._dark
      : c.surfaceContainerLow.value.base,
  motorwayCasing: c.outline.value[key],
  boundary: c.outline.value[key],
  textPrimary: c.onSurface.value[key],
  textSecondary: c.onSurfaceVariant.value[key],
  waterLabel: c.primary.value[key],
  halo: c.surface.value[key],
});

const LIGHT_TOKENS = createTokenSet('base');
const DARK_TOKENS = createTokenSet('_dark');

export function resolveMapThemeTokens(
  mode: MapThemeMode = 'light',
  overrides: Partial<MapStyleThemeTokens> = {}
): MapStyleThemeTokens {
  const base = mode === 'dark' ? DARK_TOKENS : LIGHT_TOKENS;
  return { ...base, ...overrides };
}

interface LayerDef {
  id: string;
  type: string;
  layer?: string;
  paint?: Record<string, unknown>;
  layout?: Record<string, unknown>;
  filter?: unknown[];
}

const createLayer = (def: LayerDef): Record<string, unknown> => ({
  id: def.id,
  type: def.type,
  source: 'openmaptiles',
  ...(def.layer ? { 'source-layer': def.layer } : {}),
  ...(def.filter ? { filter: def.filter } : {}),
  ...(def.layout ? { layout: def.layout } : {}),
  ...(def.paint ? { paint: def.paint } : {}),
});

function createLandWaterLayers(
  t: MapStyleThemeTokens
): Record<string, unknown>[] {
  const fl = (id: string, layer: string, paint: Record<string, unknown>) =>
    createLayer({ id, type: 'fill', layer, paint });
  return [
    {
      id: 'background',
      type: 'background',
      paint: { 'background-color': t.background },
    },
    fl('park', 'park', { 'fill-color': t.park, 'fill-opacity': 0.4 }),
    createLayer({
      id: 'landcover_wood',
      type: 'fill',
      layer: 'landcover',
      filter: ['==', 'class', 'wood'],
      paint: { 'fill-color': t.park, 'fill-opacity': 0.25 },
    }),
    fl('water', 'water', { 'fill-color': t.water }),
    createLayer({
      id: 'waterway',
      type: 'line',
      layer: 'waterway',
      paint: { 'line-color': t.water, 'line-width': 1.5 },
    }),
    createLayer({
      id: 'landuse_residential',
      type: 'fill',
      layer: 'landuse',
      filter: ['==', 'class', 'residential'],
      paint: { 'fill-color': t.residential, 'fill-opacity': 0.6 },
    }),
    fl('building', 'building', {
      'fill-color': t.building,
      'fill-outline-color': t.buildingOutline,
    }),
  ];
}

function createRoadLayers(t: MapStyleThemeTokens): Record<string, unknown>[] {
  const major = [
    'match',
    ['get', 'class'],
    ['primary', 'secondary', 'tertiary', 'trunk'],
    true,
    false,
  ];
  const mw = ['==', 'class', 'motorway'];
  const lp = (color: string, width: number, dash?: number[]) => ({
    'line-color': color,
    'line-width': width,
    ...(dash ? { 'line-dasharray': dash } : {}),
  });
  const hw = (id: string, paint: Record<string, unknown>, filter?: unknown[]) =>
    createLayer({ id, type: 'line', layer: 'transportation', filter, paint });

  return [
    hw('highway_minor', lp(t.roadSurface, 1.5), ['==', 'class', 'minor']),
    hw('highway_major_casing', lp(t.roadCasing, 3), major),
    hw('highway_major_inner', lp(t.roadSurface, 2), major),
    hw('highway_motorway_casing', lp(t.motorwayCasing, 4), mw),
    hw('highway_motorway_inner', lp(t.motorwaySurface, 2.5), mw),
    createLayer({
      id: 'boundary_country',
      type: 'line',
      layer: 'boundary',
      filter: ['==', 'admin_level', 2],
      paint: lp(t.boundary, 1.5, [3, 2]),
    }),
  ];
}

function createLabelLayers(t: MapStyleThemeTokens): Record<string, unknown>[] {
  const reg = ['Noto Sans Regular'];
  const bld = ['Noto Sans Bold'];
  const p = (color: string) => ({
    'text-color': color,
    'text-halo-color': t.halo,
    'text-halo-width': 1.5,
  });

  return [
    createLayer({
      id: 'water_name_line_label',
      type: 'symbol',
      layer: 'water_name',
      layout: { 'text-field': '{name}', 'text-font': reg, 'text-size': 12 },
      paint: p(t.waterLabel),
    }),
    createLayer({
      id: 'highway-name-major',
      type: 'symbol',
      layer: 'transportation_name',
      layout: {
        'text-field': '{name}',
        'text-font': reg,
        'text-size': 11,
        'symbol-placement': 'line',
      },
      paint: p(t.textSecondary),
    }),
    createLayer({
      id: 'label_city',
      type: 'symbol',
      layer: 'place',
      filter: ['==', 'class', 'city'],
      layout: { 'text-field': '{name}', 'text-font': bld, 'text-size': 15 },
      paint: p(t.textPrimary),
    }),
  ];
}

export function generateMapStyle(
  opts: GenerateMapStyleOptions = {}
): Record<string, unknown> {
  const mode = opts.mode ?? 'light';
  const tokens = resolveMapThemeTokens(mode, opts.tokens);

  return {
    version: 8,
    name: `Reapti MD3 ${mode === 'dark' ? 'Dark' : 'Light'}`,
    metadata: { 'reapti:theme': mode, 'reapti:generated': true },
    sources: opts.sources ?? OPENFREEMAP_SOURCES,
    sprite: opts.sprite ?? OPENFREEMAP_SPRITE,
    glyphs: opts.glyphs ?? OPENFREEMAP_GLYPHS,
    layers: [
      ...createLandWaterLayers(tokens),
      ...createRoadLayers(tokens),
      ...createLabelLayers(tokens),
    ],
  };
}
