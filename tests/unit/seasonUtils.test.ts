import { describe, it, expect } from 'vitest';
import {
  resolveSeasonProgress,
  getSeasonTransitionState,
  interpolateHex,
  getSeasonalCanopyTokens,
  getSeasonalHillTokens,
  getSeasonalGrassTokens,
  getSeasonalLeafPalette,
} from '../../src/components/organisms/SeasonBackground/seasonUtils.ts';

describe('seasonUtils - Progress & Hex Math', () => {
  it('resolves season progress correctly for all named variants and numbers', () => {
    expect(resolveSeasonProgress('spring')).toBe(0.0);
    expect(resolveSeasonProgress('summer')).toBe(1.0);
    expect(resolveSeasonProgress('fall')).toBe(2.0);
    expect(resolveSeasonProgress('autumn')).toBe(2.0);
    expect(resolveSeasonProgress('winter')).toBe(3.0);
    expect(resolveSeasonProgress(undefined)).toBe(1.0);
    expect(resolveSeasonProgress('summer', 2.5)).toBe(2.5);
    expect(resolveSeasonProgress('winter', NaN)).toBe(3.0);
    expect(resolveSeasonProgress(undefined, -1)).toBe(3.0);
  });

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
