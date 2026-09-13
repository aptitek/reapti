import { describe, it, expect, afterEach, vi } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  useThemeMode,
  getThemeSnapshot,
  getServerSnapshot,
  subscribeTheme,
} from '../../src/theme/useThemeMode.ts';

function HookConsumer({
  onValue,
}: {
  onValue: (val: 'dark' | 'light') => void;
}) {
  const mode = useThemeMode();
  onValue(mode);
  return null;
}

describe('useThemeMode SSR', () => {
  it('defaults to light in server environment', () => {
    let captured: 'dark' | 'light' = 'dark';
    renderToStaticMarkup(
      createElement(HookConsumer, {
        onValue: (val) => {
          captured = val;
        },
      })
    );
    expect(captured).toBe('light');
    expect(getServerSnapshot()).toBe('light');
    expect(getThemeSnapshot()).toBe('light');
    const unsub = subscribeTheme(() => {});
    expect(typeof unsub).toBe('function');
    expect(() => unsub()).not.toThrow();
  });
});

describe('useThemeMode Snapshots', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('reads data-theme attribute in getThemeSnapshot', () => {
    globalThis.document = {
      documentElement: {
        getAttribute: (attr: string) => (attr === 'data-theme' ? 'dark' : null),
      },
    } as unknown as Document;
    globalThis.window = {
      matchMedia: vi.fn().mockReturnValue({ matches: false }),
    } as unknown as Window & typeof globalThis;
    expect(getThemeSnapshot()).toBe('dark');
  });

  it('reads data-mode when data-theme is unset', () => {
    globalThis.document = {
      documentElement: {
        getAttribute: (attr: string) => (attr === 'data-mode' ? 'dark' : null),
      },
    } as unknown as Document;
    globalThis.window = {
      matchMedia: vi.fn().mockReturnValue({ matches: false }),
    } as unknown as Window & typeof globalThis;
    expect(getThemeSnapshot()).toBe('dark');
  });

  it('reads prefers-color-scheme when attribute is null', () => {
    globalThis.document = {
      documentElement: { getAttribute: () => null },
    } as unknown as Document;
    globalThis.window = {
      matchMedia: vi.fn().mockReturnValue({ matches: true }),
    } as unknown as Window & typeof globalThis;
    expect(getThemeSnapshot()).toBe('dark');
  });
});

describe('useThemeMode Subscriptions', () => {
  it('subscribes to DOM mutation and matchMedia', () => {
    const mockObserve = vi.fn();
    const mockDisconnect = vi.fn();
    const mockAddListener = vi.fn();
    const mockRemoveListener = vi.fn();
    class MockObserver {
      observe = mockObserve;
      disconnect = mockDisconnect;
    }
    globalThis.window = {
      matchMedia: vi.fn().mockReturnValue({
        matches: false,
        addEventListener: mockAddListener,
        removeEventListener: mockRemoveListener,
      }),
    } as unknown as Window & typeof globalThis;
    globalThis.document = { documentElement: {} } as unknown as Document;
    globalThis.MutationObserver =
      MockObserver as unknown as typeof MutationObserver;
    const cb = vi.fn();
    const unsub = subscribeTheme(cb);
    expect(mockObserve).toHaveBeenCalled();
    unsub();
    expect(mockDisconnect).toHaveBeenCalled();
  });
});
