import { describe, it, expect } from 'vitest';
import * as React from 'react';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { HeroTickerFlourish } from '../../src/components/molecules/HeroTicker/HeroTickerFlourish.tsx';
import { applyFlourishOffset } from '../../src/components/molecules/HeroTicker/heroTickerHelpers.ts';

describe('HeroTickerFlourish Shapes', () => {
  it('renders swoosh flourish decoration by default', () => {
    const html = renderToStaticMarkup(
      createElement(HeroTickerFlourish, {
        flourishStyle: 'swoosh',
        dataTestId: 'test-flourish',
      })
    );

    expect(html).toContain('data-testid="test-flourish"');
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('hero-ticker_flourish-canvas');
    expect(html).toContain('heroFlourishGrad');
  });

  it('renders wave flourish decoration', () => {
    const html = renderToStaticMarkup(
      createElement(HeroTickerFlourish, {
        flourishStyle: 'wave',
        dataTestId: 'test-wave',
      })
    );
    expect(html).toContain('data-testid="test-wave"');
    expect(html).toContain('Q 35 15');
  });

  it('renders glow-line flourish decoration', () => {
    const html = renderToStaticMarkup(
      createElement(HeroTickerFlourish, {
        flourishStyle: 'glow-line',
        dataTestId: 'test-line',
      })
    );
    expect(html).toContain('data-testid="test-line"');
    expect(html).toContain('<line');
  });

  it('returns null when style is none', () => {
    const html = renderToStaticMarkup(
      createElement(HeroTickerFlourish, {
        flourishStyle: 'none',
        dataTestId: 'test-none',
      })
    );
    expect(html).toBe('');
  });
});

describe('HeroTickerFlourish Offset and Effects', () => {
  it('updates CSS variable via applyFlourishOffset safely', () => {
    const store = new Map<string, string>();
    const mockEl = {
      style: {
        setProperty: (k: string, v: string) => store.set(k, v),
      },
    } as unknown as HTMLDivElement;

    applyFlourishOffset(mockEl, 120);
    expect(store.get('--ticker-flourish-offset')).toBe('120');

    expect(() => applyFlourishOffset(null, 50)).not.toThrow();
  });

  it('handles fallback data-testid attribute and custom colorVar', () => {
    const html = renderToStaticMarkup(
      createElement(HeroTickerFlourish, {
        'data-testid': 'legacy-flourish-id',
        colorVar: 'var(--custom-glow)',
      })
    );
    expect(html).toContain('data-testid="legacy-flourish-id"');
    expect(html).toContain('stop-color="var(--custom-glow)"');
  });

  it('runs useEffect hook during rendering when effect dispatcher is present', () => {
    const internals = (
      React as unknown as {
        __CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE?: {
          H?: {
            useEffect?: (effect: () => void) => void;
          };
        };
      }
    ).__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;

    let ranEffect = false;
    function Probe() {
      if (internals?.H) {
        const orig = internals.H.useEffect;
        internals.H.useEffect = (eff) => {
          ranEffect = true;
          eff();
          orig?.(eff);
        };
      }
      return createElement(HeroTickerFlourish, {
        progress: 50,
      });
    }

    renderToStaticMarkup(createElement(Probe));
    expect(ranEffect).toBe(true);
  });

  it('returns null when visible is false', () => {
    const html = renderToStaticMarkup(
      createElement(HeroTickerFlourish, {
        visible: false,
        dataTestId: 'test-hidden',
      })
    );
    expect(html).toBe('');
  });
});
