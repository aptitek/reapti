import { describe, it, expect, vi } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  useHeroTickerTheme,
  isDocumentDark,
  isSystemDark,
  checkSystemOrDocumentDark,
  createThemeMutationObserver,
  listenMediaQuery,
  subscribeToThemeChanges,
} from '../../src/components/molecules/HeroTicker/useHeroTickerTheme.ts';

function renderHookHelper<T>(runner: () => T): { current: T } {
  let result!: T;
  function Probe() {
    result = runner();
    return null;
  }
  renderToStaticMarkup(createElement(Probe));
  return {
    get current() {
      return result;
    },
  };
}

describe('useHeroTickerTheme - Static and Auto Hook Mode', () => {
  it('returns true when mode is dark and false when light', () => {
    expect(renderHookHelper(() => useHeroTickerTheme('dark')).current).toBe(
      true
    );
    expect(renderHookHelper(() => useHeroTickerTheme('light')).current).toBe(
      false
    );
  });

  it('returns false in node environment when auto mode runs without window', () => {
    const origWin = globalThis.window;
    try {
      delete (globalThis as { window?: unknown }).window;
      expect(renderHookHelper(() => useHeroTickerTheme('auto')).current).toBe(
        false
      );
    } finally {
      globalThis.window = origWin;
    }
  });
});

describe('useHeroTickerTheme - Document and System Evaluators', () => {
  it('evaluates document darkness states correctly', () => {
    const origDoc = globalThis.document;
    try {
      delete (globalThis as { document?: unknown }).document;
      expect(isDocumentDark()).toBe(false);

      globalThis.document = { documentElement: null } as unknown as Document;
      expect(isDocumentDark()).toBe(false);

      globalThis.document = {
        documentElement: {
          getAttribute: (a: string) => (a === 'data-theme' ? 'dark' : null),
          classList: { contains: () => false },
        },
      } as unknown as Document;
      expect(isDocumentDark()).toBe(true);

      globalThis.document = {
        documentElement: {
          getAttribute: (a: string) => (a === 'data-mode' ? 'dark' : null),
          classList: { contains: () => false },
        },
      } as unknown as Document;
      expect(isDocumentDark()).toBe(true);

      globalThis.document = {
        documentElement: {
          getAttribute: () => null,
          classList: { contains: (c: string) => c === 'dark' },
        },
      } as unknown as Document;
      expect(isDocumentDark()).toBe(true);

      globalThis.document = {
        documentElement: {
          getAttribute: () => null,
          classList: { contains: () => false },
        },
      } as unknown as Document;
      expect(isDocumentDark()).toBe(false);
    } finally {
      globalThis.document = origDoc;
    }
  });

  it('evaluates system darkness states correctly', () => {
    const origWin = globalThis.window;
    try {
      delete (globalThis as { window?: unknown }).window;
      expect(isSystemDark()).toBe(false);

      globalThis.window = {} as unknown as Window & typeof globalThis;
      expect(isSystemDark()).toBe(false);

      globalThis.window = {
        matchMedia: vi.fn().mockReturnValue({ matches: true }),
      } as unknown as Window & typeof globalThis;
      expect(isSystemDark()).toBe(true);
      expect(checkSystemOrDocumentDark()).toBe(true);

      globalThis.window = {
        matchMedia: vi.fn().mockReturnValue({ matches: false }),
      } as unknown as Window & typeof globalThis;
      expect(isSystemDark()).toBe(false);
    } finally {
      globalThis.window = origWin;
    }
  });
});

describe('useHeroTickerTheme - Fallbacks', () => {
  it('handles subscription fallback when window or document is missing', () => {
    const origWin = globalThis.window;
    try {
      delete (globalThis as { window?: unknown }).window;
      const unsubscribe = subscribeToThemeChanges(() => {});
      expect(() => unsubscribe()).not.toThrow();
    } finally {
      globalThis.window = origWin;
    }
  });

  it('handles missing MutationObserver and matchMedia', () => {
    const origWin = globalThis.window;
    const origDoc = globalThis.document;
    const origObserver = globalThis.MutationObserver;
    try {
      delete (globalThis as { MutationObserver?: unknown }).MutationObserver;
      globalThis.document = {
        documentElement: {},
      } as unknown as Document;
      expect(createThemeMutationObserver(() => {})).toBeNull();

      globalThis.window = {} as unknown as Window & typeof globalThis;
      expect(listenMediaQuery(() => {})).toBeNull();
    } finally {
      globalThis.window = origWin;
      globalThis.document = origDoc;
      globalThis.MutationObserver = origObserver;
    }
  });
});

describe('useHeroTickerTheme - Event Listeners and Cleanup', () => {
  it('subscribes to MutationObserver and MediaQuery events then cleans up', () => {
    const origWin = globalThis.window;
    const origDoc = globalThis.document;
    const origObserver = globalThis.MutationObserver;
    const disconnect = vi.fn();
    const observe = vi.fn();
    const removeEventListener = vi.fn();
    const addEventListener = vi.fn();

    try {
      class MockMutationObserver {
        observe = observe;
        disconnect = disconnect;
      }
      globalThis.MutationObserver =
        MockMutationObserver as unknown as typeof MutationObserver;
      globalThis.document = { documentElement: {} } as unknown as Document;
      globalThis.window = {
        matchMedia: vi.fn().mockReturnValue({
          addEventListener,
          removeEventListener,
        }),
      } as unknown as Window & typeof globalThis;

      const unsubscribe = subscribeToThemeChanges(() => {});
      expect(observe).toHaveBeenCalledTimes(1);
      expect(addEventListener).toHaveBeenCalledTimes(1);

      unsubscribe();
      expect(disconnect).toHaveBeenCalledTimes(1);
      expect(removeEventListener).toHaveBeenCalledTimes(1);
    } finally {
      globalThis.window = origWin;
      globalThis.document = origDoc;
      globalThis.MutationObserver = origObserver;
    }
  });
});
