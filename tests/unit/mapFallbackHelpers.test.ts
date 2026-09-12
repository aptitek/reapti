import { describe, it, expect } from 'vitest';
import {
  isWebGLSupported,
  resolveFallbackA11yStrings,
  formatFallbackPinCoordinates,
  formatFallbackPinLabel,
} from '../../src/components/molecules/Map/mapFallbackHelpers.ts';
import { SUPPORTED_LOCALES } from '../../src/i18n/locales.ts';

describe('isWebGLSupported SSR', () => {
  it('returns true when window is undefined in SSR', () => {
    const originalWin = globalThis.window;
    try {
      // @ts-expect-error simulate SSR environment
      delete globalThis.window;
      expect(isWebGLSupported()).toBe(true);
    } finally {
      globalThis.window = originalWin;
    }
  });
});

describe('isWebGLSupported with OffscreenCanvas', () => {
  it('returns true when webgl context is acquired', () => {
    const originalCanvas = globalThis.OffscreenCanvas;
    try {
      // @ts-expect-error mock OffscreenCanvas
      globalThis.OffscreenCanvas = class {
        getContext(type: string) {
          return type === 'webgl2' ? {} : null;
        }
      };
      expect(isWebGLSupported()).toBe(true);
    } finally {
      globalThis.OffscreenCanvas = originalCanvas;
    }
  });

  it('returns false when no webgl context is supported', () => {
    const originalCanvas = globalThis.OffscreenCanvas;
    const originalWin = globalThis.window;
    try {
      globalThis.window = {} as unknown as Window & typeof globalThis;
      // @ts-expect-error mock OffscreenCanvas
      globalThis.OffscreenCanvas = class {
        getContext() {
          return null;
        }
      };
      expect(isWebGLSupported()).toBe(false);
    } finally {
      globalThis.OffscreenCanvas = originalCanvas;
      globalThis.window = originalWin;
    }
  });

  it('handles getContext throwing error gracefully', () => {
    const originalCanvas = globalThis.OffscreenCanvas;
    try {
      // @ts-expect-error mock OffscreenCanvas
      globalThis.OffscreenCanvas = class {
        getContext() {
          throw new Error('WebGL disabled');
        }
      };
      expect(isWebGLSupported()).toBe(false);
    } finally {
      globalThis.OffscreenCanvas = originalCanvas;
    }
  });
});

describe('isWebGLSupported fallback detection', () => {
  it('checks WebGLRenderingContext when OffscreenCanvas is unavailable', () => {
    const originalCanvas = globalThis.OffscreenCanvas;
    const originalWin = globalThis.window;
    try {
      // @ts-expect-error simulate lack of OffscreenCanvas
      delete globalThis.OffscreenCanvas;
      globalThis.window = {
        WebGLRenderingContext: function MockWebGL() {},
      } as unknown as Window & typeof globalThis;

      expect(isWebGLSupported()).toBe(true);
    } finally {
      globalThis.OffscreenCanvas = originalCanvas;
      globalThis.window = originalWin;
    }
  });
});

describe('resolveFallbackA11yStrings', () => {
  it('resolves fallback strings for default locale when omitted', () => {
    const strings = resolveFallbackA11yStrings();
    expect(strings.title.length).toBeGreaterThan(0);
    expect(strings.message.length).toBeGreaterThan(0);
    expect(strings.locationsTitle.length).toBeGreaterThan(0);
    expect(strings.loadingLabel.length).toBeGreaterThan(0);
  });

  it('resolves localized strings across all supported locales', () => {
    for (const loc of SUPPORTED_LOCALES) {
      const strings = resolveFallbackA11yStrings(loc);
      expect(strings.title.length).toBeGreaterThan(0);
      expect(strings.message.length).toBeGreaterThan(0);
      expect(strings.locationsTitle.length).toBeGreaterThan(0);
      expect(strings.loadingLabel.length).toBeGreaterThan(0);
    }
  });
});

describe('formatFallbackPinCoordinates', () => {
  it('formats northern and eastern coordinates correctly', () => {
    const formatted = formatFallbackPinCoordinates(45.76, 4.8357);
    expect(formatted).toBe('45.7600° N, 4.8357° E');
  });

  it('formats southern and western coordinates correctly', () => {
    const formatted = formatFallbackPinCoordinates(-33.8688, -151.2093);
    expect(formatted).toBe('33.8688° S, 151.2093° W');
  });
});

describe('formatFallbackPinLabel', () => {
  it('returns custom string label when provided', () => {
    const label = formatFallbackPinLabel({
      latitude: 45.76,
      longitude: 4.8357,
      label: 'Place Bellecour',
    });
    expect(label).toBe('Place Bellecour');
  });

  it('falls back to formatted coordinates when label is missing', () => {
    const label = formatFallbackPinLabel({
      latitude: 45.76,
      longitude: 4.8357,
    });
    expect(label).toBe('45.7600° N, 4.8357° E');
  });

  it('falls back to formatted coordinates when label is empty string', () => {
    const label = formatFallbackPinLabel({
      latitude: 45.76,
      longitude: 4.8357,
      label: '',
    });
    expect(label).toBe('45.7600° N, 4.8357° E');
  });
});
