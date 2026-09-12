#!/usr/bin/env node
/**
 * Dynamic MapLibre Style Generator
 * Generates static MapLibre v8 styles based on MD3 design tokens into public/.
 */

import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateMapStyle } from '../src/components/molecules/Map/mapStyleGenerator.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function generateMapStyleFiles(
  targetDir = resolve(__dirname, '../public')
) {
  if (!existsSync(targetDir)) {
    mkdirSync(targetDir, { recursive: true });
  }

  const lightStyle = generateMapStyle({ mode: 'light' });
  const darkStyle = generateMapStyle({ mode: 'dark' });

  const files = [
    { name: 'map-style-light.json', content: lightStyle },
    { name: 'map-style-dark.json', content: darkStyle },
    { name: 'map-style.json', content: lightStyle },
  ];

  const generated = [];

  for (const file of files) {
    const destPath = resolve(targetDir, file.name);
    const jsonStr = JSON.stringify(file.content, null, 2);
    writeFileSync(destPath, `${jsonStr}\n`, 'utf-8');
    generated.push({
      path: destPath,
      name: file.name,
      bytes: Buffer.byteLength(jsonStr, 'utf-8'),
    });
  }

  return generated;
}

const isDirectExecution =
  process.argv[1] && resolve(process.argv[1]) === resolve(__filename);

if (isDirectExecution) {
  const generated = generateMapStyleFiles();
  console.log('✅ [Map Styles] Successfully generated static map styles:');
  for (const item of generated) {
    console.log(`   - ${item.name} (${(item.bytes / 1024).toFixed(1)} KB)`);
  }
}
