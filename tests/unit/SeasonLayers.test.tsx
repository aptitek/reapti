import { describe, it, expect } from 'vitest';
import * as React from 'react';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  AtmosphereLayer,
  CelestialLayer,
  ForegroundGrassLayer,
  LandscapeLayer,
} from '../../src/components/organisms/SeasonBackground/SeasonLayers.tsx';

describe('SeasonLayers - Atmosphere Layer', () => {
  it('renders aurora in dark mode when enabled', () => {
    const darkHtml = renderToStaticMarkup(
      createElement(AtmosphereLayer, {
        showAurora: true,
        isDarkMode: true,
      })
    );
    expect(darkHtml).toContain('season_aurora_wrapper');
    expect(darkHtml).toContain('season_aurora_canvas');

    const lightHtml = renderToStaticMarkup(
      createElement(AtmosphereLayer, {
        showAurora: true,
        isDarkMode: false,
      })
    );
    expect(lightHtml).toBe('');

    const hiddenHtml = renderToStaticMarkup(
      createElement(AtmosphereLayer, {
        showAurora: false,
        isDarkMode: true,
      })
    );
    expect(hiddenHtml).toBe('');
  });

  it('runs AtmosphereLayer effect lifecycle with attached canvas and cleanups', () => {
    const internals = (
      React as unknown as {
        __CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE?: {
          H?: { useEffect?: (eff: () => (() => void) | void) => void };
        };
      }
    ).__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;

    const mockCanvas = {
      width: 800,
      height: 400,
      parentElement: { clientWidth: 800, clientHeight: 400 },
    } as unknown as HTMLCanvasElement;

    const cleanups: (() => void)[] = [];
    function Probe(props: { canvas: HTMLCanvasElement | null }) {
      if (internals?.H) {
        internals.H.useEffect = (eff) => {
          const cleanup = eff();
          if (typeof cleanup === 'function') cleanups.push(cleanup);
        };
      }
      return createElement(AtmosphereLayer, {
        showAurora: true,
        isDarkMode: true,
        canvasRef: { current: props.canvas },
      });
    }

    renderToStaticMarkup(createElement(Probe, { canvas: mockCanvas }));
    cleanups.forEach((c) => c());

    // When canvas is null
    renderToStaticMarkup(createElement(Probe, { canvas: null }));
  });
});

describe('SeasonLayers - Celestial Layer', () => {
  it('renders sun with godrays in day mode and moon with stars in night mode', () => {
    const dayHtml = renderToStaticMarkup(
      createElement(CelestialLayer, {
        showCelestial: true,
        showGodrays: true,
        isDarkMode: false,
      })
    );
    expect(dayHtml).toContain('id="celestialBodyContainer"');
    expect(dayHtml).toContain('season_sun_orb');
    expect(dayHtml).toContain('season_godrays_svg');

    const nightHtml = renderToStaticMarkup(
      createElement(CelestialLayer, {
        showCelestial: true,
        showGodrays: false,
        isDarkMode: true,
      })
    );
    expect(nightHtml).toContain('season_moon_orb');
    expect(nightHtml).toContain('season_starfield_overlay');
    expect(nightHtml).toContain('season_star_dot');
    expect(nightHtml).toContain('season_star_sparkle');
    expect(nightHtml).toContain('season_star_glint');
    expect(nightHtml).toContain('season_star_phase_');

    const hiddenHtml = renderToStaticMarkup(
      createElement(CelestialLayer, {
        showCelestial: false,
        showGodrays: true,
        isDarkMode: false,
      })
    );
    expect(hiddenHtml).toBe('');
  });
});

describe('SeasonLayers - Landscape & Grass', () => {
  it('renders clouds, hills, and tree with parallax transform', () => {
    const html = renderToStaticMarkup(
      createElement(LandscapeLayer, {
        showClouds: true,
        showHills: true,
        showTree: true,
        seasonProgress: 1.0,
        isDarkMode: false,
        parallax: { x: 10, y: 5 },
      })
    );
    expect(html).toContain('season_clouds');
    expect(html).toContain('season_hills');
    expect(html).toContain('id="peacefulTreeContainer"');
    expect(html).toContain('translate(10px,_5px)');

    const minimalHtml = renderToStaticMarkup(
      createElement(LandscapeLayer, {
        showClouds: false,
        showHills: false,
        showTree: false,
        seasonProgress: 1.0,
        isDarkMode: false,
        parallax: { x: 0, y: 0 },
      })
    );
    expect(minimalHtml).not.toContain('season_clouds');
    expect(minimalHtml).not.toContain('season_hills');
    expect(minimalHtml).not.toContain('id="peacefulTreeContainer"');
  });

  it('renders foreground grass blade wrapper when showGrass is true', () => {
    const html = renderToStaticMarkup(
      createElement(ForegroundGrassLayer, {
        showGrass: true,
        seasonProgress: 0.0,
        isDarkMode: false,
      })
    );
    expect(html).toContain('season_grass_wrapper');

    const hiddenHtml = renderToStaticMarkup(
      createElement(ForegroundGrassLayer, {
        showGrass: false,
        seasonProgress: 0.0,
        isDarkMode: false,
      })
    );
    expect(hiddenHtml).toBe('');
  });
});
