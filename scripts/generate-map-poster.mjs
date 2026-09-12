#!/usr/bin/env node
/**
 * Dynamic Lyon Vector Map & Poster Generator
 * Generates light and dark vector maps based on MD3 design tokens
 * following the Map2Poster (https://github.com/ScottySalvo/Map2Poster) schema.
 */

import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { md3SemanticTokens } from '../src/tokens/md3.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * @typedef {Object} Map2PosterTheme
 * @property {string} name
 * @property {string} description
 * @property {string} bg
 * @property {string} water
 * @property {string} parks
 * @property {string} road_motorway
 * @property {string} road_primary
 * @property {string} text
 * @property {string} accent
 */

/**
 * @param {'light' | 'dark'} mode
 * @returns {Map2PosterTheme}
 */
export function buildMapTheme(mode) {
  const isLight = mode === 'light';
  const c = md3SemanticTokens.colors;

  return {
    name: isLight ? 'Reapti Material Light' : 'Reapti Material Dark',
    description: `Lyon Map2Poster theme generated from reapti MD3 design tokens (${mode})`,
    bg: isLight
      ? c.surfaceContainerLowest.value._light
      : c.surfaceContainerLowest.value._dark,
    water: isLight
      ? c.secondaryContainer.value._light
      : c.secondaryContainer.value._dark,
    parks: isLight
      ? c.tertiaryContainer.value._light
      : c.tertiaryContainer.value._dark,
    road_motorway: isLight ? c.primary.value._light : c.primary.value._dark,
    road_primary: isLight ? c.outline.value._light : c.outline.value._dark,
    text: isLight ? c.onSurface.value._light : c.onSurface.value._dark,
    accent: isLight ? c.primary.value._light : c.primary.value._dark,
  };
}

function loadLyonLayers() {
  const layerPath = resolve(__dirname, 'assets/lyon_layers.json');
  const raw = readFileSync(layerPath, 'utf-8');
  return JSON.parse(raw);
}

export function renderLyonSvg(theme, layers) {
  const [minX, minY, width, height] = layers.viewBox.split(' ');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${layers.viewBox}" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Lyon symbolic map">
  <rect x="${minX}" y="${minY}" width="${width}" height="${height}" fill="${theme.bg}" />
  <!-- Water: Rhône and Saône rivers meeting at Presqu'île -->
  <path d="${layers.water}" fill="${theme.water}" opacity="0.95" />
  <!-- Major Parks: Parc de la Tête d'Or -->
  <path d="${layers.parks}" fill="${theme.parks}" opacity="0.85" />
  <!-- Major Arterials & Bridges -->
  <path d="${layers.majorRoads}" fill="none" stroke="${theme.road_primary}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" opacity="0.75" />
  <!-- Motorways & Ring Roads -->
  <path d="${layers.motorways}" fill="none" stroke="${theme.road_motorway}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" opacity="0.9" />
</svg>`;
}

export function generateLyonMapFiles(
  targetDir = resolve(__dirname, '../public')
) {
  if (!existsSync(targetDir)) {
    mkdirSync(targetDir, { recursive: true });
  }
  const themesDir = resolve(targetDir, 'themes');
  if (!existsSync(themesDir)) {
    mkdirSync(themesDir, { recursive: true });
  }

  const layers = loadLyonLayers();
  const lightTheme = buildMapTheme('light');
  const darkTheme = buildMapTheme('dark');

  const lightSvg = renderLyonSvg(lightTheme, layers);
  const darkSvg = renderLyonSvg(darkTheme, layers);

  const outputs = [
    { path: resolve(targetDir, 'lyon_skeleton_light.svg'), content: lightSvg },
    { path: resolve(targetDir, 'lyon_skeleton_dark.svg'), content: darkSvg },
    { path: resolve(targetDir, 'lyon_skeleton.svg'), content: lightSvg },
    {
      path: resolve(themesDir, 'reapti_light.json'),
      content: JSON.stringify(lightTheme, null, 2),
    },
    {
      path: resolve(themesDir, 'reapti_dark.json'),
      content: JSON.stringify(darkTheme, null, 2),
    },
  ];

  for (const item of outputs) {
    writeFileSync(item.path, `${item.content}\n`, 'utf-8');
  }

  return outputs.map((o) => ({
    path: o.path,
    bytes: Buffer.byteLength(o.content, 'utf-8'),
  }));
}

const isDirectExecution =
  process.argv[1] && resolve(process.argv[1]) === resolve(__filename);

if (isDirectExecution) {
  const generated = generateLyonMapFiles();
  console.log(
    '✅ [Map2Poster] Successfully generated Lyon map assets from MD3 tokens:'
  );
  for (const item of generated) {
    console.log(`   - ${item.path} (${(item.bytes / 1024).toFixed(1)} KB)`);
  }
}
