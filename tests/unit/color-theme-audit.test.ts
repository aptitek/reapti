import { describe, it, expect, vi } from 'vitest';
import { THEME_REGISTRY } from '../../src/theme/themeRegistry.ts';
import type { ThemeTokens, ColorRamp } from '../../src/theme/types.ts';
import {
  syncDocumentTheme,
  applyThemeVariables,
} from '../../src/theme/themeProviderHelpers.ts';

const PURE_WHITE_PATTERNS = [
  /#ffffff\b/i,
  /#fff\b/i,
  /\bwhite\b/i,
  /rgb\(\s*255\s*,\s*255\s*,\s*255\s*\)/i,
];

const PURE_BLACK_PATTERNS = [
  /#000000\b/i,
  /#000\b/i,
  /\bblack\b/i,
  /rgb\(\s*0\s*,\s*0\s*,\s*0\s*\)/i,
];

const REQUIRED_COLOR_ROLES: (keyof ColorRamp)[] = [
  'primary',
  'onPrimary',
  'primaryContainer',
  'onPrimaryContainer',
  'secondary',
  'onSecondary',
  'secondaryContainer',
  'onSecondaryContainer',
  'tertiary',
  'onTertiary',
  'tertiaryContainer',
  'onTertiaryContainer',
  'error',
  'onError',
  'errorContainer',
  'onErrorContainer',
  'background',
  'onBackground',
  'surface',
  'onSurface',
  'surfaceVariant',
  'onSurfaceVariant',
  'surfaceDim',
  'surfaceBright',
  'surfaceContainerLowest',
  'surfaceContainerLow',
  'surfaceContainer',
  'surfaceContainerHigh',
  'surfaceContainerHighest',
  'outline',
  'outlineVariant',
  'shadow',
  'scrim',
  'inverseSurface',
  'inverseOnSurface',
  'inversePrimary',
  'surfaceTint',
];

function checkNoPureColors(identifier: string, value: string): void {
  for (const pattern of PURE_WHITE_PATTERNS) {
    expect(
      pattern.test(value),
      `${identifier} contains forbidden pure white: "${value}"`
    ).toBe(false);
  }
  for (const pattern of PURE_BLACK_PATTERNS) {
    expect(
      pattern.test(value),
      `${identifier} contains forbidden pure black: "${value}"`
    ).toBe(false);
  }
}

function checkRampPurity(
  themeName: string,
  mode: string,
  colors: Record<string, string>
): void {
  for (const [role, value] of Object.entries(colors)) {
    checkNoPureColors(
      `Theme "${themeName}" mode "${mode}" role "${role}"`,
      value
    );
  }
}

function checkElevationPurity(
  themeName: string,
  mode: string,
  elevation: Record<string, string>
): void {
  for (const [level, val] of Object.entries(elevation)) {
    if (val === 'none') continue;
    expect(
      val.includes('rgba(0, 0, 0,'),
      `Theme "${themeName}" mode "${mode}" elevation "${level}" uses pure black rgba(0, 0, 0, ...): "${val}"`
    ).toBe(false);
  }
}

describe('Color Theme Audit: Zero Pure Black & Pure White', () => {
  const themeEntries = Object.entries(THEME_REGISTRY);

  it('verifies that all registered themes define all required color roles', () => {
    for (const [name, theme] of themeEntries) {
      for (const mode of ['light', 'dark'] as const) {
        const colors = theme[mode].colors;
        for (const role of REQUIRED_COLOR_ROLES) {
          expect(
            colors[role],
            `Theme "${name}" mode "${mode}" is missing color role "${role}"`
          ).toBeDefined();
          expect(
            typeof colors[role],
            `Theme "${name}" mode "${mode}" role "${role}" must be a string`
          ).toBe('string');
        }
      }
    }
  });

  it('guarantees zero pure white and zero pure black in all theme color ramps', () => {
    for (const [name, theme] of themeEntries) {
      for (const mode of ['light', 'dark'] as const) {
        checkRampPurity(name, mode, theme[mode].colors);
      }
    }
  });

  it('guarantees zero pure black rgba(0, 0, 0, ...) in elevation shadows', () => {
    for (const [name, theme] of themeEntries) {
      for (const mode of ['light', 'dark'] as const) {
        checkElevationPurity(name, mode, theme[mode].elevation);
      }
    }
  });
});

describe('Color Theme Audit: Dynamic Theme Application', () => {
  it('updates all theme variables on an element when applyThemeVariables is called', () => {
    const target = {
      style: {
        setProperty: vi.fn(),
      },
    } as unknown as HTMLElement;

    const exotic = THEME_REGISTRY['exotic'] as ThemeTokens;
    applyThemeVariables('light', exotic, target);

    expect(target.style.setProperty).toHaveBeenCalledWith(
      '--theme-primary',
      '#00d68f'
    );
    expect(target.style.setProperty).toHaveBeenCalledWith(
      '--theme-secondary',
      '#ff007f'
    );
    expect(target.style.setProperty).toHaveBeenCalledWith(
      '--theme-tertiary',
      '#7b2cbf'
    );
    expect(target.style.setProperty).toHaveBeenCalledWith(
      '--theme-surface',
      '#f3e8ee'
    );
  });

  it('syncs document attributes data-theme and data-theme-name', () => {
    const origDoc = globalThis.document;
    try {
      const setAttribute = vi.fn();
      const setProperty = vi.fn();
      globalThis.document = {
        documentElement: {
          setAttribute,
          style: { setProperty },
        },
      } as unknown as Document;

      const exotic = THEME_REGISTRY['exotic'] as ThemeTokens;
      syncDocumentTheme('dark', exotic);

      expect(setAttribute).toHaveBeenCalledWith('data-theme', 'dark');
      expect(setAttribute).toHaveBeenCalledWith('data-theme-name', 'exotic');
      expect(setProperty).toHaveBeenCalledWith('--theme-primary', '#00ff9f');
    } finally {
      globalThis.document = origDoc;
    }
  });
});
