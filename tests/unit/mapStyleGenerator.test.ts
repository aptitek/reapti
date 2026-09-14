import { describe, it, expect } from 'vitest';
import {
  generateMapStyle,
  resolveMapThemeTokens,
  OPENFREEMAP_SOURCES,
  OPENFREEMAP_SPRITE,
  OPENFREEMAP_GLYPHS,
} from '../../src/components/molecules/Map/mapStyleGenerator.ts';

describe('resolveMapThemeTokens', () => {
  it('resolves light mode tokens by default', () => {
    const tokens = resolveMapThemeTokens('light');
    expect(tokens.background).toBe('#eee8d5');
    expect(tokens.water).toBe('rgba(133, 153, 0, 0.14)');
    expect(tokens.textPrimary).toBe('#073642');
    expect(tokens.halo).toBe('#eee8d5');
  });

  it('resolves dark mode tokens when specified', () => {
    const tokens = resolveMapThemeTokens('dark');
    expect(tokens.background).toBe('#073642');
    expect(tokens.water).toBe('rgba(133, 153, 0, 0.20)');
    expect(tokens.textPrimary).toBe('#fdf6e3');
    expect(tokens.halo).toBe('#073642');
  });

  it('applies custom token overrides over defaults', () => {
    const tokens = resolveMapThemeTokens('light', {
      background: '#fdf6e3',
      water: '#2aa198',
    });
    expect(tokens.background).toBe('#fdf6e3');
    expect(tokens.water).toBe('#2aa198');
    expect(tokens.textPrimary).toBe('#073642');
  });
});

describe('generateMapStyle Structure', () => {
  it('generates standard MapLibre v8 style with default light mode', () => {
    const style = generateMapStyle();
    expect(style.version).toBe(8);
    expect(style.name).toBe('Reapti MD3 Light');
    expect(style.sources).toEqual(OPENFREEMAP_SOURCES);
    expect(style.sprite).toBe(OPENFREEMAP_SPRITE);
    expect(style.glyphs).toBe(OPENFREEMAP_GLYPHS);

    const layers = style.layers as Array<{ id: string; type: string }>;
    expect(Array.isArray(layers)).toBe(true);
    expect(layers.length).toBeGreaterThanOrEqual(15);
  });

  it('generates dark mode style with dark mode metadata', () => {
    const style = generateMapStyle({ mode: 'dark' });
    expect(style.name).toBe('Reapti MD3 Dark');
    expect((style.metadata as Record<string, string>)['reapti:theme']).toBe(
      'dark'
    );

    const layers = style.layers as Array<{
      id: string;
      paint?: Record<string, unknown>;
    }>;
    const bgLayer = layers.find((l) => l.id === 'background');
    expect(bgLayer?.paint?.['background-color']).toBe('#073642');
  });
});

describe('generateMapStyle Overrides and Layers', () => {
  it('applies custom sources, sprite, glyphs, and token overrides', () => {
    const customSources = {
      custom: { type: 'vector', url: 'https://example.com/tiles' },
    };
    const style = generateMapStyle({
      mode: 'light',
      sources: customSources,
      sprite: 'https://example.com/sprite',
      glyphs: 'https://example.com/fonts/{fontstack}/{range}.pbf',
      tokens: {
        background: '#073642',
        water: '#2aa198',
      },
    });

    expect(style.sources).toEqual(customSources);
    expect(style.sprite).toBe('https://example.com/sprite');
    expect(style.glyphs).toBe(
      'https://example.com/fonts/{fontstack}/{range}.pbf'
    );

    const layers = style.layers as Array<{
      id: string;
      paint?: Record<string, unknown>;
    }>;
    const bgLayer = layers.find((l) => l.id === 'background');
    expect(bgLayer?.paint?.['background-color']).toBe('#073642');

    const waterLayer = layers.find((l) => l.id === 'water');
    expect(waterLayer?.paint?.['fill-color']).toBe('#2aa198');
  });

  it('includes road, building, and label layers properly configured', () => {
    const style = generateMapStyle();
    const layers = style.layers as Array<{
      id: string;
      type: string;
      source?: string;
    }>;

    const layerIds = layers.map((l) => l.id);
    expect(layerIds).toContain('building');
    expect(layerIds).toContain('highway_minor');
    expect(layerIds).toContain('highway_major_inner');
    expect(layerIds).toContain('highway_motorway_inner');
    expect(layerIds).toContain('label_city');
    expect(layerIds).toContain('water_name_line_label');
  });
});

describe('generateMapStyleFiles script helper', () => {
  it('generates light, dark, and default style files in target directory', async () => {
    const { mkdtempSync, rmSync, existsSync } = await import('node:fs');
    const { tmpdir } = await import('node:os');
    const { join } = await import('node:path');
    const { generateMapStyleFiles } =
      await import('../../scripts/generate-map-styles.mjs');

    const tempDir = mkdtempSync(join(tmpdir(), 'reapti-map-styles-'));
    try {
      const results = generateMapStyleFiles(tempDir);
      expect(results).toHaveLength(3);
      expect(existsSync(join(tempDir, 'map-style-light.json'))).toBe(true);
      expect(existsSync(join(tempDir, 'map-style-dark.json'))).toBe(true);
      expect(existsSync(join(tempDir, 'map-style.json'))).toBe(true);
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });
});
