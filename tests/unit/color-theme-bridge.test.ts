import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, join } from 'node:path';

const REQUIRED_M3_TOKENS = [
  '--md-sys-color-primary',
  '--md-sys-color-on-primary',
  '--md-sys-color-primary-container',
  '--md-sys-color-on-primary-container',
  '--md-sys-color-secondary',
  '--md-sys-color-on-secondary',
  '--md-sys-color-secondary-container',
  '--md-sys-color-on-secondary-container',
  '--md-sys-color-tertiary',
  '--md-sys-color-on-tertiary',
  '--md-sys-color-tertiary-container',
  '--md-sys-color-on-tertiary-container',
  '--md-sys-color-error',
  '--md-sys-color-on-error',
  '--md-sys-color-error-container',
  '--md-sys-color-on-error-container',
  '--md-sys-color-background',
  '--md-sys-color-on-background',
  '--md-sys-color-surface',
  '--md-sys-color-on-surface',
  '--md-sys-color-surface-variant',
  '--md-sys-color-on-surface-variant',
  '--md-sys-color-surface-dim',
  '--md-sys-color-surface-bright',
  '--md-sys-color-surface-container-lowest',
  '--md-sys-color-surface-container-low',
  '--md-sys-color-surface-container',
  '--md-sys-color-surface-container-high',
  '--md-sys-color-surface-container-highest',
  '--md-sys-color-outline',
  '--md-sys-color-outline-variant',
  '--md-sys-color-shadow',
  '--md-sys-color-scrim',
  '--md-sys-color-inverse-surface',
  '--md-sys-color-inverse-on-surface',
  '--md-sys-color-inverse-primary',
  '--md-sys-color-surface-tint',
];

const REQUIRED_PANDA_TOKENS = [
  '--colors-primary',
  '--colors-on-primary',
  '--colors-primary-container',
  '--colors-on-primary-container',
  '--colors-secondary',
  '--colors-on-secondary',
  '--colors-secondary-container',
  '--colors-on-secondary-container',
  '--colors-tertiary',
  '--colors-on-tertiary',
  '--colors-tertiary-container',
  '--colors-on-tertiary-container',
  '--colors-error',
  '--colors-on-error',
  '--colors-error-container',
  '--colors-on-error-container',
  '--colors-background',
  '--colors-on-background',
  '--colors-surface',
  '--colors-on-surface',
  '--colors-surface-variant',
  '--colors-on-surface-variant',
  '--colors-surface-dim',
  '--colors-surface-bright',
  '--colors-surface-container-lowest',
  '--colors-surface-container-low',
  '--colors-surface-container',
  '--colors-surface-container-high',
  '--colors-surface-container-highest',
  '--colors-outline',
  '--colors-outline-variant',
  '--colors-shadow',
  '--colors-scrim',
  '--colors-inverse-surface',
  '--colors-inverse-on-surface',
  '--colors-inverse-primary',
];

function getAllCssFiles(dir: string): string[] {
  const files: string[] = [];
  for (const item of readdirSync(dir)) {
    const full = join(dir, item);
    if (statSync(full).isDirectory()) {
      files.push(...getAllCssFiles(full));
    } else if (full.endsWith('.css')) {
      files.push(full);
    }
  }
  return files;
}

describe('Color Theme Bridge: M3e & Panda Token Mappings', () => {
  const themeCssPath = resolve(process.cwd(), 'src/theme/theme.css');
  const themeCss = readFileSync(themeCssPath, 'utf-8');

  it('maps all Material Design 3 Expressive color tokens to theme properties', () => {
    for (const token of REQUIRED_M3_TOKENS) {
      const pattern = new RegExp(`${token}:\\s*var\\(\\s*--theme-`);
      expect(
        pattern.test(themeCss),
        `theme.css must map "${token}" to a --theme-* custom property`
      ).toBe(true);
    }
  });

  it('maps all Panda CSS semantic color tokens to theme custom properties', () => {
    for (const token of REQUIRED_PANDA_TOKENS) {
      const pattern = new RegExp(`${token}:\\s*var\\(\\s*--theme-`);
      expect(
        pattern.test(themeCss),
        `theme.css must map "${token}" to a --theme-* custom property`
      ).toBe(true);
    }
  });
});

describe('Color Theme Bridge: Component CSS Health', () => {
  const cssFiles = getAllCssFiles(resolve(process.cwd(), 'src'));

  it('ensures no component CSS uses camelCase for color custom properties', () => {
    const camelCaseRegex = /var\(--colors-[a-z0-9]+[A-Z][a-zA-Z0-9]*\)/g;
    for (const file of cssFiles) {
      const content = readFileSync(file, 'utf-8');
      const matches = content.match(camelCaseRegex);
      expect(
        matches,
        `File ${file} contains broken camelCase color variables: ${matches?.join(', ')}`
      ).toBeNull();
    }
  });
});
