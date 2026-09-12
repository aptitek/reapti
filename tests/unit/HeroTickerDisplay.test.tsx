import { describe, it, expect, vi } from 'vitest';
import * as React from 'react';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { HeroTickerDisplay } from '../../src/components/molecules/HeroTicker/HeroTickerDisplay.tsx';

describe('HeroTickerDisplay Markup', () => {
  it('renders screen-reader live region and visual slogan elements', () => {
    const html = renderToStaticMarkup(
      createElement(HeroTickerDisplay, {
        as: 'h1',
        size: 'large',
        prefix: 'We craft ',
        suffix: ' that inspire.',
        visibleText: 'revolutionary ideas',
        fullSloganText: 'We craft revolutionary ideas that inspire.',
        currentPhrase: 'revolutionary ideas',
        animationMode: 'cursive-draw',
        drawProgress: 100,
        currentProgress: 100,
        fadeOpacity: 1,
        isDrawing: false,
        showNib: true,
        flourish: 'swoosh',
        accentVar: 'var(--colors-primary)',
      })
    );

    expect(html).toContain('role="status"');
    expect(html).toContain('aria-live="polite"');
    expect(html).toContain('We craft revolutionary ideas that inspire.');
    expect(html).toContain('hero-ticker_prefix');
    expect(html).toContain('We craft ');
    expect(html).toContain('hero-ticker_cursive-text');
    expect(html).toContain('revolutionary ideas');
    expect(html).toContain('hero-ticker_suffix');
    expect(html).toContain(' that inspire.');
    expect(html).toContain('data-size="large"');
  });

  it('renders semantic heading level specified by as prop', () => {
    const html = renderToStaticMarkup(
      createElement(HeroTickerDisplay, {
        as: 'h3',
        size: 'medium',
        prefix: '',
        suffix: '',
        visibleText: 'Level 3 Heading',
        fullSloganText: 'Level 3 Heading',
        animationMode: 'cursive-type',
        drawProgress: 100,
        currentProgress: 100,
        fadeOpacity: 1,
        isDrawing: false,
        showNib: false,
        flourish: 'none',
        accentVar: 'var(--colors-primary)',
      })
    );

    expect(html).toContain('<h3');
    expect(html).toContain('data-size="medium"');
    expect(html).not.toContain('data-testid="hero-ticker-prefix"');
    expect(html).not.toContain('data-testid="hero-ticker-suffix"');
  });
});

describe('HeroTickerDisplay Modes & Effects', () => {
  it('renders fade mode with glow enabled', () => {
    const html = renderToStaticMarkup(
      createElement(HeroTickerDisplay, {
        visibleText: 'Fade Test',
        fullSloganText: 'Fade Test',
        animationMode: 'fade',
        drawProgress: 100,
        currentProgress: 50,
        fadeOpacity: 0.7,
        isDrawing: true,
        showNib: true,
        flourish: 'wave',
        accentVar: 'var(--colors-primary)',
        glow: true,
      })
    );

    expect(html).toContain('data-glow="true"');
    expect(html).toContain('data-drawing="false"');
  });

  it('renders with minimal props and default heading level', () => {
    const html = renderToStaticMarkup(
      createElement(HeroTickerDisplay, {
        visibleText: 'Defaults',
        fullSloganText: 'Defaults',
        drawProgress: 50,
        currentProgress: 50,
        fadeOpacity: 1,
        isDrawing: false,
        showNib: true,
        flourish: 'none',
        accentVar: 'var(--accent)',
      })
    );
    expect(html).toContain('<h1');
    expect(html).toContain('data-glow="false"');
  });
});

function createMockElements(store: Map<string, string>) {
  const mockCursive = {
    style: { setProperty: (k: string, v: string) => store.set(k, v) },
    getBoundingClientRect: () => ({ width: 140 }),
  } as unknown as HTMLSpanElement;

  const mockWrapper = {
    style: { setProperty: (k: string, v: string) => store.set(k, v) },
    setAttribute: vi.fn(),
  } as unknown as HTMLSpanElement;

  return { mockCursive, mockWrapper };
}

class MockResizeObserver {
  callback: (entries: unknown[]) => void;
  constructor(cb: (entries: unknown[]) => void) {
    this.callback = cb;
  }
  observe() {
    this.callback([{ borderBoxSize: [{ inlineSize: 155 }] }]);
    this.callback([{ contentRect: { width: 140 } }]);
    this.callback([]);
  }
  disconnect() {}
}

describe('HeroTickerDisplay Effects', () => {
  it('executes useEffect hooks and resize observer with elements', () => {
    const internals = (
      React as unknown as {
        __CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE?: {
          H?: {
            useEffect?: (effect: () => (() => void) | void) => void;
          };
        };
      }
    ).__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;

    const store = new Map<string, string>();
    const { mockCursive, mockWrapper } = createMockElements(store);
    const origRO = (globalThis as unknown as { ResizeObserver?: unknown })
      .ResizeObserver;
    (globalThis as unknown as { ResizeObserver?: unknown }).ResizeObserver =
      MockResizeObserver;

    function Probe() {
      if (internals?.H) {
        internals.H.useEffect = (eff) => {
          const cleanup = eff();
          if (typeof cleanup === 'function') cleanup();
        };
      }
      return createElement(HeroTickerDisplay, {
        visibleText: 'Effect Test',
        fullSloganText: 'Effect Test',
        animationMode: 'cursive-draw',
        drawProgress: 50,
        currentProgress: 50,
        fadeOpacity: 1,
        isDrawing: true,
        showNib: true,
        flourish: 'swoosh',
        accentVar: 'var(--colors-primary)',
        wrapperRef: { current: mockWrapper },
        cursiveRef: { current: mockCursive },
      });
    }

    renderToStaticMarkup(createElement(Probe));
    expect(store.get('--ticker-clip-prog')).toBe('50%');
    expect(store.get('--ticker-word-width')).toBe('140px');

    (globalThis as unknown as { ResizeObserver?: unknown }).ResizeObserver =
      undefined;
    renderToStaticMarkup(createElement(Probe));

    (globalThis as unknown as { ResizeObserver?: unknown }).ResizeObserver =
      origRO;
  });
});
