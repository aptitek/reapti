import { describe, it, expect } from 'vitest';
import {
  CANOPY_NIGHT_SEASON_PALETTES,
  CANOPY_SEASON_PALETTES,
  GRASS_NIGHT_SEASON_PALETTES,
  GRASS_SEASON_PALETTES,
  HILLS_NIGHT_SEASON_PALETTES,
  HILLS_SEASON_PALETTES,
  calculateFlowerScale,
} from '../../src/components/organisms/SeasonBackground/seasonLandscapePalettes.ts';

describe('seasonLandscapePalettes - Canopy Tables', () => {
  it('exposes four seasonal palettes for day and night canopies', () => {
    expect(CANOPY_SEASON_PALETTES).toHaveLength(4);
    expect(CANOPY_NIGHT_SEASON_PALETTES).toHaveLength(4);

    for (let i = 0; i < 4; i++) {
      expect(CANOPY_SEASON_PALETTES[i]?.foliage1A).toBeDefined();
      expect(CANOPY_SEASON_PALETTES[i]?.foliage1B).toBeDefined();
      expect(CANOPY_NIGHT_SEASON_PALETTES[i]?.foliageWarmA).toBeDefined();
    }
  });
});

describe('seasonLandscapePalettes - Hills and Grass Tables', () => {
  it('exposes four seasonal palettes for hills and grass in day and night', () => {
    expect(HILLS_SEASON_PALETTES).toHaveLength(4);
    expect(HILLS_NIGHT_SEASON_PALETTES).toHaveLength(4);
    expect(GRASS_SEASON_PALETTES).toHaveLength(4);
    expect(GRASS_NIGHT_SEASON_PALETTES).toHaveLength(4);

    for (let i = 0; i < 4; i++) {
      expect(HILLS_SEASON_PALETTES[i]?.back).toBeDefined();
      expect(HILLS_NIGHT_SEASON_PALETTES[i]?.front).toBeDefined();
      expect(GRASS_SEASON_PALETTES[i]?.pStart).toBeDefined();
      expect(GRASS_NIGHT_SEASON_PALETTES[i]?.sStart).toBeDefined();
    }
  });
});

describe('calculateFlowerScale - Dimensions & Constraints', () => {
  it('returns unit scale for zero or sub-threshold dimensions', () => {
    expect(calculateFlowerScale(0, 0)).toEqual({ scaleX: 1, scaleY: 1 });
    expect(calculateFlowerScale(5, 5)).toEqual({ scaleX: 1, scaleY: 1 });
  });

  it('calculates proportional scale for standard desktop aspect ratio', () => {
    const scale = calculateFlowerScale(1440, 900);
    expect(scale.scaleX).toBeCloseTo(1, 1);
    expect(scale.scaleY).toBeCloseTo(1, 1);
  });

  it('handles width-constrained scenarios where wTree > wMax', () => {
    const scale = calculateFlowerScale(400, 900);
    expect(scale.scaleX).toBeGreaterThan(0.05);
    expect(scale.scaleY).toBeGreaterThan(0.05);
  });

  it('clamps scales within bounds for extreme viewport sizes', () => {
    const extremeWide = calculateFlowerScale(5000, 200);
    expect(extremeWide.scaleX).toBeGreaterThanOrEqual(0.05);
    expect(extremeWide.scaleX).toBeLessThanOrEqual(5);

    const extremeTall = calculateFlowerScale(200, 5000);
    expect(extremeTall.scaleY).toBeGreaterThanOrEqual(0.05);
    expect(extremeTall.scaleY).toBeLessThanOrEqual(5);
  });
});
