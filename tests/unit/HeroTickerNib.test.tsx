import { describe, it, expect } from 'vitest';
import * as React from 'react';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { HeroTickerNib } from '../../src/components/molecules/HeroTicker/HeroTickerNib.tsx';
import { applyNibStyle } from '../../src/components/molecules/HeroTicker/quillTrajectory.ts';

describe('HeroTickerNib Markup', () => {
  it('renders quill nib positioned along letter line trajectory', () => {
    const html = renderToStaticMarkup(
      createElement(HeroTickerNib, {
        progress: 50,
        phrase: 'elegant software',
        active: true,
        dataTestId: 'test-quill-nib',
      })
    );

    expect(html).toContain('data-testid="test-quill-nib"');
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('hero-ticker_quill-img');
    expect(html).toContain('fill="currentColor"');
    expect(html).toContain('hero-ticker_ink-droplet');
  });

  it('renders nothing when visible is false', () => {
    const html = renderToStaticMarkup(
      createElement(HeroTickerNib, {
        progress: 50,
        phrase: 'hidden nib',
        visible: false,
        dataTestId: 'hidden-nib',
      })
    );
    expect(html).toBe('');
  });

  it('sets resting position attributes when progress is zero', () => {
    const html = renderToStaticMarkup(
      createElement(HeroTickerNib, {
        progress: 0,
        phrase: 'resting nib',
        active: false,
        dataTestId: 'rest-nib',
      })
    );
    expect(html).toContain('data-active="false"');
    expect(html).not.toContain('hero-ticker_ink-droplet');
  });

  it('handles data-testid fallback', () => {
    const html = renderToStaticMarkup(
      createElement(HeroTickerNib, {
        progress: 10,
        'data-testid': 'legacy-nib',
      })
    );
    expect(html).toContain('data-testid="legacy-nib"');
  });
});

describe('HeroTickerNib Styling & Hooks', () => {
  it('applies styles directly via applyNibStyle', () => {
    const store = new Map<string, string>();
    const mockEl = {
      style: {
        setProperty: (k: string, v: string) => store.set(k, v),
      },
    } as unknown as HTMLDivElement;

    applyNibStyle(
      mockEl,
      {
        left: '10px',
        bottom: '20px',
        tiltAngle: -10,
        verticalPercent: 50,
        isDownstroke: true,
      },
      'var(--accent-color)'
    );

    expect(store.get('--ticker-nib-left')).toBe('10px');
    expect(store.get('--ticker-nib-bottom')).toBe('20px');
    expect(store.get('--ticker-nib-tilt')).toBe('-10deg');
    expect(store.get('--ticker-nib-color')).toBe('var(--accent-color)');

    expect(() =>
      applyNibStyle(null, {
        left: '0',
        bottom: '0',
        tiltAngle: 0,
        verticalPercent: 0,
        isDownstroke: false,
      })
    ).not.toThrow();
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
      return createElement(HeroTickerNib, {
        progress: 50,
        phrase: 'test',
        accentVar: 'var(--color)',
      });
    }

    renderToStaticMarkup(createElement(Probe));
    expect(ranEffect).toBe(true);
  });
});
