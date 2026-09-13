import { describe, it, expect } from 'vitest';
import {
  resolveBackgroundConfig,
  resolveIsDark,
  calculateParallaxOffset,
  calculateAspectCorrection,
  renderTreeSvgString,
  renderHillsSvgString,
  renderGrassSvgString,
  STAR_POSITIONS,
} from '../../src/components/organisms/SeasonBackground/seasonBackgroundHelpers.ts';

describe('seasonBackgroundHelpers - Config & Geometry', () => {
  it('resolves background configuration with defaults and overrides', () => {
    const defaults = resolveBackgroundConfig({});
    expect(defaults.interactive).toBe(true);
    expect(defaults.showTree).toBe(true);
    expect(defaults.leafCount).toBe(44);
    expect(defaults.windIntensity).toBe(1.0);
    expect(defaults.season).toBe('summer');

    const custom = resolveBackgroundConfig({
      showTree: false,
      showCelestial: false,
      leafCount: 20,
      season: 'winter',
      seasonProgress: 3.1,
    });
    expect(custom.showTree).toBe(false);
    expect(custom.showCelestial).toBe(false);
    expect(custom.leafCount).toBe(20);
    expect(custom.seasonProgress).toBe(3.1);
  });

  it('resolves dark mode state across explicit and context options', () => {
    expect(resolveIsDark('dark', false)).toBe(true);
    expect(resolveIsDark('light', true)).toBe(false);
    expect(resolveIsDark('sunset', true)).toBe(false);
    expect(resolveIsDark('auto', true)).toBe(true);
    expect(resolveIsDark('auto', false)).toBe(false);
    expect(resolveIsDark(undefined, true)).toBe(true);
  });

  it('calculates parallax offset based on relative cursor position', () => {
    const offsetCenter = calculateParallaxOffset(500, 300, {
      left: 0,
      top: 0,
      width: 1000,
      height: 600,
    });
    expect(offsetCenter.x).toBeCloseTo(0);
    expect(offsetCenter.y).toBeCloseTo(0);

    const offsetCorner = calculateParallaxOffset(1000, 600, {
      left: 0,
      top: 0,
      width: 1000,
      height: 600,
    });
    expect(offsetCorner.x).toBeGreaterThan(0);
    expect(offsetCorner.y).toBeGreaterThan(0);
  });

  it('calculates aspect correction bounded values', () => {
    const normal = calculateAspectCorrection(1440, 900);
    expect(normal.meadowScaleY).toBeGreaterThan(0);
    expect(normal.grassScaleY).toBeCloseTo(1.0);

    const wide = calculateAspectCorrection(3000, 500);
    expect(wide.meadowScaleY).toBeLessThanOrEqual(4);

    const fallback = calculateAspectCorrection(0, 0);
    expect(fallback.meadowScaleY).toBeGreaterThan(0);
  });
});

describe('seasonBackgroundHelpers - SVG Transforms', () => {
  it('transforms tree SVG string across seasons', () => {
    const mockTreeSvg = `
      <svg>
        <defs>
          <linearGradient id="treeTrunkGrad">
            <stop offset="0%" stop-color="#586e75" />
            <stop offset="100%" stop-color="#073642" />
          </linearGradient>
        </defs>
        <ellipse data-cluster="0" fill="url(#treeCanopyGrad2)" />
        <ellipse data-cluster="6" fill="url(#treeCanopyWarm)" />
        <g id="treeWinterSnow"><path d="M0,0" /></g>
      </svg>
    `;

    const summerResult = renderTreeSvgString(mockTreeSvg, 1.0, false);
    expect(summerResult).not.toContain('id="treeWinterSnow"');
    expect(summerResult).toContain('data-cluster="0"');

    const winterResult = renderTreeSvgString(mockTreeSvg, 3.0, false);
    expect(winterResult).toContain('id="treeWinterSnow"');
    expect(winterResult).toContain('opacity=');
  });

  it('transforms hills SVG string across seasons', () => {
    const mockHillsSvg = `
      <svg>
        <path class="hill-back-path" fill="#eee8d5" />
        <path class="hill-mid-path" fill="#b58900" />
        <path class="hill-front-path" fill="#859900" />
        <path class="hill-ridge-path" stroke="rgba(255, 255, 255, 0.22)" />
        <g id="springMeadowFloorFlowers">
          <g data-flower="0"><circle cx="0" cy="0" /></g>
          <g data-petal="0"><circle cx="0" cy="0" /></g>
        </g>
      </svg>
    `;

    const springResult = renderHillsSvgString(mockHillsSvg, 0.0, false);
    expect(springResult).toContain('id="springMeadowFloorFlowers"');

    const midSpringResult = renderHillsSvgString(mockHillsSvg, 0.45, false);
    expect(midSpringResult).toContain('id="springMeadowFloorFlowers"');
    expect(midSpringResult).not.toContain('data-flower="0"');

    const darkResult = renderHillsSvgString(mockHillsSvg, 1.0, true);
    expect(darkResult).toContain('var(--color-celestial-night-sky-glow');

    const summerResult = renderHillsSvgString(mockHillsSvg, 1.0, false);
    expect(summerResult).not.toContain('id="springMeadowFloorFlowers"');
  });

  it('transforms grass SVG string and exposes stars', () => {
    const mockGrassSvg = `
      <svg>
        <stop offset="0%" stop-color="#9ec43b" />
        <stop offset="0%" stop-color="#859900" />
        <g id="springFloorFlowers"><path d="M0,0" /></g>
      </svg>
    `;

    const springGrass = renderGrassSvgString(mockGrassSvg, 0.0, false);
    expect(springGrass).toContain('id="springFloorFlowers"');

    const summerGrass = renderGrassSvgString(mockGrassSvg, 1.0, false);
    expect(summerGrass).not.toContain('id="springFloorFlowers"');

    expect(STAR_POSITIONS).toHaveLength(24);
    expect(STAR_POSITIONS[0]?.id).toBe('star-01');
  });
});
