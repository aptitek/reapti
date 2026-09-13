import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  createSvg,
  createPathSvg,
  createSunSvg,
  createMoonSvg,
  createFlagUkSvg,
  createFlagFranceSvg,
  createMapSvg,
  createArcSvg,
  createAnalogClockSvg,
  createDoorSvg,
  createRippleSvg,
  FRANCE_MAP_PATH,
  UK_MAP_PATH,
} from '../../src/components/molecules/FancySwitch/fancySwitchGlyphHelpers.ts';

describe('fancySwitchGlyphHelpers - Basic SVG creation', () => {
  it('creates svg elements and path wrappers correctly', () => {
    const svg = createSvg('svg', { viewBox: '0 0 10 10' });
    const markup = renderToStaticMarkup(svg);
    expect(markup).toContain('viewBox="0 0 10 10"');

    const pathSvg = createPathSvg('M0 0 L10 10', { width: 12 });
    const pathMarkup = renderToStaticMarkup(pathSvg);
    expect(pathMarkup).toContain('d="M0 0 L10 10"');
    expect(pathMarkup).toContain('width="12"');
  });

  it('creates celestial svg icons correctly', () => {
    const sunSvg = createSunSvg(24, 'custom-sun');
    const sunMarkup = renderToStaticMarkup(sunSvg);
    expect(sunMarkup).toContain('fancy_sun_glyph custom-sun');
    expect(sunMarkup).toContain('M12 7c-2.76');

    const moonSvg = createMoonSvg(24, 'custom-moon');
    const moonMarkup = renderToStaticMarkup(moonSvg);
    expect(moonMarkup).toContain('fancy_moon_glyph custom-moon');
  });
});

describe('fancySwitchGlyphHelpers - Geographic & Clock creation', () => {
  it('creates flag svgs and map svgs correctly', () => {
    const ukFlag = createFlagUkSvg(32);
    const ukMarkup = renderToStaticMarkup(ukFlag);
    expect(ukMarkup).toContain('fancy_flag_puck');
    expect(ukMarkup).toContain('var(--fancy-switch-uk-blue)');

    const frFlag = createFlagFranceSvg(32);
    const frMarkup = renderToStaticMarkup(frFlag);
    expect(frMarkup).toContain('fancy_flag_puck');
    expect(frMarkup).toContain('var(--fancy-switch-fr-blue)');

    const ukMap = createMapSvg(UK_MAP_PATH, true, 20);
    const ukMapMarkup = renderToStaticMarkup(ukMap);
    expect(ukMapMarkup).toContain('data-active="true"');

    const frMap = createMapSvg(FRANCE_MAP_PATH, false, 20);
    const frMapMarkup = renderToStaticMarkup(frMap);
    expect(frMapMarkup).toContain('data-active="false"');
  });

  it('creates arcs, analog dials, doors, and scan ripples correctly', () => {
    const arcSvg = createArcSvg('M0 0 Q 5 5 10 0', '2 2');
    const arcMarkup = renderToStaticMarkup(arcSvg);
    expect(arcMarkup).toContain('fancy_celestial_arc');

    const clockSvg = createAnalogClockSvg(16);
    const clockMarkup = renderToStaticMarkup(clockSvg);
    expect(clockMarkup).toContain('switch-analog-clock');

    const doorOpenSvg = createDoorSvg(true);
    expect(renderToStaticMarkup(doorOpenSvg)).toContain(
      'meeting-room-open-icon'
    );

    const doorClosedSvg = createDoorSvg(false);
    expect(renderToStaticMarkup(doorClosedSvg)).toContain(
      'door-front-closed-icon'
    );

    const rippleSvg = createRippleSvg(true, 18);
    expect(renderToStaticMarkup(rippleSvg)).toContain('badge-scan-ripple');

    const rippleLockedSvg = createRippleSvg(false, 18);
    expect(renderToStaticMarkup(rippleLockedSvg)).toContain(
      'badge-scan-ripple'
    );
  });
});
