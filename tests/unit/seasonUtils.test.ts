import { describe, it, expect } from 'vitest';
import {
  getNorthernHemisphereSeason,
  getNorthernHemisphereSeasonProgress,
  resolveSeasonProgress,
  getSeasonTransitionState,
  interpolateHex,
  getSeasonalCanopyTokens,
  getSeasonalHillTokens,
  getSeasonalGrassTokens,
  getSeasonalLeafPalette,
} from '../../src/components/organisms/SeasonBackground/seasonUtils.ts';

describe('seasonUtils - Northern Hemisphere Variant Detection', () => {
  it('detects northern hemisphere season by month correctly', () => {
    // Winter: Dec, Jan, Feb
    expect(getNorthernHemisphereSeason(new Date(2026, 11, 15))).toBe('winter');
    expect(getNorthernHemisphereSeason(new Date(2026, 0, 10))).toBe('winter');
    expect(getNorthernHemisphereSeason(new Date(2026, 1, 20))).toBe('winter');

    // Spring: Mar, Apr, May
    expect(getNorthernHemisphereSeason(new Date(2026, 2, 1))).toBe('spring');
    expect(getNorthernHemisphereSeason(new Date(2026, 3, 15))).toBe('spring');
    expect(getNorthernHemisphereSeason(new Date(2026, 4, 31))).toBe('spring');

    // Summer: Jun, Jul, Aug
    expect(getNorthernHemisphereSeason(new Date(2026, 5, 1))).toBe('summer');
    expect(getNorthernHemisphereSeason(new Date(2026, 6, 15))).toBe('summer');
    expect(getNorthernHemisphereSeason(new Date(2026, 7, 31))).toBe('summer');

    // Fall: Sep, Oct, Nov
    expect(getNorthernHemisphereSeason(new Date(2026, 8, 1))).toBe('fall');
    expect(getNorthernHemisphereSeason(new Date(2026, 9, 15))).toBe('fall');
    expect(getNorthernHemisphereSeason(new Date(2026, 10, 30))).toBe('fall');
  });
});

describe('seasonUtils - Northern Hemisphere Continuous Progress', () => {
  it('resolves northern hemisphere default progress by date with fine transitions', () => {
    // Exact season start boundaries
    expect(
      getNorthernHemisphereSeasonProgress(new Date(2026, 2, 1))
    ).toBeCloseTo(0.0, 4);
    expect(
      getNorthernHemisphereSeasonProgress(new Date(2026, 5, 1))
    ).toBeCloseTo(1.0, 4);
    expect(
      getNorthernHemisphereSeasonProgress(new Date(2026, 8, 1))
    ).toBeCloseTo(2.0, 4);
    expect(
      getNorthernHemisphereSeasonProgress(new Date(2026, 11, 1))
    ).toBeCloseTo(3.0, 4);

    // Continuous floating-point progress mid-season
    const midSpring = getNorthernHemisphereSeasonProgress(
      new Date(2026, 3, 16)
    );
    expect(midSpring).toBeGreaterThan(0.4);
    expect(midSpring).toBeLessThan(0.6);

    const midSummer = getNorthernHemisphereSeasonProgress(
      new Date(2026, 6, 16)
    );
    expect(midSummer).toBeGreaterThan(1.4);
    expect(midSummer).toBeLessThan(1.6);

    const midFall = getNorthernHemisphereSeasonProgress(new Date(2026, 9, 16));
    expect(midFall).toBeGreaterThan(2.4);
    expect(midFall).toBeLessThan(2.6);

    const midWinter = getNorthernHemisphereSeasonProgress(
      new Date(2026, 0, 15)
    );
    expect(midWinter).toBeGreaterThan(3.4);
    expect(midWinter).toBeLessThan(3.6);
  });

  it('resolves season progress correctly for all named variants, dates, and numbers', () => {
    expect(resolveSeasonProgress('spring')).toBe(0.0);
    expect(resolveSeasonProgress('summer')).toBe(1.0);
    expect(resolveSeasonProgress('fall')).toBe(2.0);
    expect(resolveSeasonProgress('autumn')).toBe(2.0);
    expect(resolveSeasonProgress('winter')).toBe(3.0);

    // Default without arguments uses continuous northern hemisphere season progress
    expect(resolveSeasonProgress(undefined)).toBe(
      getNorthernHemisphereSeasonProgress()
    );

    // With explicit date overrides
    const aprProgress = resolveSeasonProgress(
      undefined,
      undefined,
      new Date(2026, 3, 16)
    );
    expect(aprProgress).toBeCloseTo(
      getNorthernHemisphereSeasonProgress(new Date(2026, 3, 16)),
      5
    );

    expect(resolveSeasonProgress('summer', 2.5)).toBe(2.5);
    expect(resolveSeasonProgress('winter', NaN)).toBe(3.0);
    expect(resolveSeasonProgress(undefined, -1)).toBe(3.0);
  });
});

describe('seasonUtils - Progress & Hex Math', () => {
  it('computes season transition states with cyclically wrapped indices', () => {
    expect(getSeasonTransitionState(0.0)).toEqual({
      fromIndex: 0,
      toIndex: 1,
      blendFactor: 0,
    });
    expect(getSeasonTransitionState(1.25)).toEqual({
      fromIndex: 1,
      toIndex: 2,
      blendFactor: 0.25,
    });
    expect(getSeasonTransitionState(3.75)).toEqual({
      fromIndex: 3,
      toIndex: 0,
      blendFactor: 0.75,
    });
  });

  it('interpolates hex colors accurately with padding', () => {
    expect(interpolateHex('#000000', '#ffffff', 0.5)).toBe('#808080');
    expect(interpolateHex('#ff0000', '#0000ff', 0)).toBe('#ff0000');
    expect(interpolateHex('#ff0000', '#0000ff', 1)).toBe('#0000ff');
    expect(interpolateHex('invalid', 'xyz', 0.5)).toBe('#000000');
  });
});

describe('seasonUtils - Seasonal Tokens', () => {
  it('calculates seasonal canopy tokens in day and night modes', () => {
    const springCanopy = getSeasonalCanopyTokens(0.0, false);
    expect(springCanopy.blossomOpacity).toBeGreaterThan(0.8);
    expect(springCanopy.snowOpacity).toBe(0);
    expect(springCanopy.trunkPrimary).toContain(
      'var(--color-solarized-base01)'
    );

    const summerCanopy = getSeasonalCanopyTokens(1.0, false);
    expect(summerCanopy.blossomOpacity).toBe(0);
    expect(summerCanopy.snowOpacity).toBe(0);

    const winterCanopy = getSeasonalCanopyTokens(3.0, false);
    expect(winterCanopy.snowOpacity).toBeGreaterThan(0.8);

    const springNightCanopy = getSeasonalCanopyTokens(0.0, true);
    expect(springNightCanopy.trunkPrimary).toContain(
      'var(--color-solarized-base03)'
    );

    const midSpringEarly = getSeasonalCanopyTokens(0.4, false);
    const midSpringLate = getSeasonalCanopyTokens(0.6, false);
    expect(midSpringEarly.foliage1A).toBeDefined();
    expect(midSpringLate.foliage1A).toBeDefined();
  });

  it('calculates seasonal hill, grass, and leaf tokens in day and night modes', () => {
    const hillsDay = getSeasonalHillTokens(1.0, false);
    expect(hillsDay.hillBack).toBeDefined();
    expect(hillsDay.hillMid).toBeDefined();
    expect(hillsDay.hillFront).toBeDefined();

    const hillsNight = getSeasonalHillTokens(2.0, true);
    expect(hillsNight.hillBack).toBeDefined();

    const grassDay = getSeasonalGrassTokens(0.0, false);
    expect(grassDay.primaryStart).toBeDefined();
    expect(grassDay.primaryEnd).toContain('var(--color-solarized-base2)');

    const grassNight = getSeasonalGrassTokens(3.0, true);
    expect(grassNight.primaryEnd).toContain('var(--color-solarized-base03)');

    const leafDay = getSeasonalLeafPalette(1.5, false);
    expect(leafDay.vein).toBeDefined();

    const leafNight = getSeasonalLeafPalette(1.5, true);
    expect(leafNight.vein).toBeDefined();
  });
});
