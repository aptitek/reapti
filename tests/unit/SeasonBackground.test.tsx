import { describe, it, expect, vi } from 'vitest';
import * as React from 'react';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { SeasonBackground } from '../../src/components/organisms/SeasonBackground/SeasonBackground.tsx';

function runHook(runner: () => React.ReactNode): () => void {
  const internals = (
    React as unknown as {
      __CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE?: {
        H?: { useEffect?: (eff: () => (() => void) | void) => void };
      };
    }
  ).__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  const effects: (() => (() => void) | void)[] = [];
  const cleanups: (() => void)[] = [];
  function Probe() {
    if (internals?.H) {
      internals.H.useEffect = (eff) => {
        effects.push(eff);
      };
    }
    return runner();
  }
  renderToStaticMarkup(createElement(Probe));
  for (const eff of effects) {
    const cleanup = eff();
    if (typeof cleanup === 'function') cleanups.push(cleanup);
  }
  return () => cleanups.forEach((c) => c());
}

describe('SeasonBackground - Component Rendering', () => {
  it('renders default peaceful landscape structure', () => {
    const html = renderToStaticMarkup(
      createElement(SeasonBackground, {
        dataTestId: 'season-bg-test',
      })
    );

    expect(html).toContain('data-testid="season-bg-test"');
    expect(html).toContain('data-mode="light"');
    expect(html).toContain('season_sky_backdrop');
    expect(html).toContain('season_ambient_glow');
    expect(html).toContain('id="celestialBodyContainer"');
    expect(html).toContain('season_sun_orb');
    expect(html).toContain('season_godrays_svg');
    expect(html).toContain('season_canvas');
    expect(html).toContain('season_clouds');
    expect(html).toContain('season_hills');
    expect(html).toContain('id="peacefulTreeContainer"');
    expect(html).toContain('season_grass_wrapper');
  });

  it('renders dark mode with crescent moon and aurora', () => {
    const html = renderToStaticMarkup(
      createElement(SeasonBackground, {
        mode: 'dark',
        showAurora: true,
      })
    );

    expect(html).toContain('data-mode="dark"');
    expect(html).toContain('season_aurora_wrapper');
    expect(html).toContain('season_moon_orb');
    expect(html).toContain('season_starfield_overlay');
    expect(html).toContain('season_star_dot');
    expect(html).not.toContain('season_sun_orb');
  });
});

describe('SeasonBackground - Seasonal & Custom Options', () => {
  it('renders across spring, fall, and winter regimes', () => {
    const springHtml = renderToStaticMarkup(
      createElement(SeasonBackground, {
        season: 'spring',
        seasonProgress: 0.0,
      })
    );
    expect(springHtml).toContain('id="springMeadowFloorFlowers"');

    const fallHtml = renderToStaticMarkup(
      createElement(SeasonBackground, {
        season: 'fall',
        mode: 'sunset',
      })
    );
    expect(fallHtml).toContain('data-mode="light"');

    const winterHtml = renderToStaticMarkup(
      createElement(SeasonBackground, {
        season: 'winter',
      })
    );
    expect(winterHtml).toContain('id="treeWinterSnow"');
  });

  it('respects visibility toggles and renders custom children', () => {
    const childElement = createElement('span', { className: 'test-child' });
    const html = renderToStaticMarkup(
      createElement(
        SeasonBackground,
        {
          showTree: false,
          showCelestial: false,
          showGrass: false,
          showClouds: false,
          showGodrays: false,
          className: 'custom-bg-class',
        },
        childElement
      )
    );

    expect(html).toContain('custom-bg-class');
    expect(html).not.toContain('id="peacefulTreeContainer"');
    expect(html).not.toContain('id="celestialBodyContainer"');
    expect(html).not.toContain('season_grass_wrapper');
    expect(html).not.toContain('season_clouds');
    expect(html).toContain('season_content_wrapper');
    expect(html).toContain('test-child');
  });
});

describe('useContainerDimensions in SeasonBackground', () => {
  it('handles null container and updates when container element is attached', () => {
    const ref = { current: null as HTMLDivElement | null };

    const cleanup1 = runHook(() =>
      createElement(SeasonBackground, { containerRef: ref })
    );
    cleanup1();

    const mockEl = { clientWidth: 1200, clientHeight: 800 } as HTMLDivElement;
    ref.current = mockEl;
    let roCallback: (() => void) | null = null;
    const observeMock = vi.fn();
    const disconnectMock = vi.fn();

    vi.stubGlobal(
      'ResizeObserver',
      class MockRO {
        observe = observeMock;
        disconnect = disconnectMock;
        constructor(cb: () => void) {
          roCallback = cb;
        }
      }
    );

    const cleanup2 = runHook(() =>
      createElement(SeasonBackground, { containerRef: ref })
    );
    expect(observeMock).toHaveBeenCalledWith(mockEl);

    // Minimal change (< 2px delta)
    mockEl.clientWidth = 1201;
    mockEl.clientHeight = 801;
    roCallback?.();

    // Fallback 0 dimensions
    mockEl.clientWidth = 0;
    mockEl.clientHeight = 0;
    roCallback?.();

    cleanup2();
    expect(disconnectMock).toHaveBeenCalled();
    vi.unstubAllGlobals();
  });

  it('handles environment when ResizeObserver is undefined', () => {
    vi.stubGlobal('ResizeObserver', undefined);
    const ref = {
      current: { clientWidth: 800, clientHeight: 600 } as HTMLDivElement,
    };
    const cleanup = runHook(() =>
      createElement(SeasonBackground, { containerRef: ref })
    );
    cleanup();
    vi.unstubAllGlobals();
  });
});
