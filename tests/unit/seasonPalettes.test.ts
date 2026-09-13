import { describe, it, expect } from 'vitest';
import {
  LIGHT_LEAF_PALETTE,
  DARK_LEAF_PALETTE,
  getDarkSeasonalLeafPalette,
  getLightSeasonalLeafPalette,
} from '../../src/components/organisms/SeasonBackground/seasonPalettes.ts';

describe('seasonPalettes Module', () => {
  it('exposes default leaf palettes', () => {
    expect(LIGHT_LEAF_PALETTE.leftTop).toBeDefined();
    expect(DARK_LEAF_PALETTE.vein).toBeDefined();
  });

  it('generates dark seasonal leaf palettes for all transitions', () => {
    // 1 -> 2 (Summer to Fall)
    const fallTransition = getDarkSeasonalLeafPalette(1, 2, 0.5);
    expect(fallTransition.vein).toBeDefined();
    expect(fallTransition.leftMid).toBeDefined();

    // Peak Fall (fromIndex 2, blendFactor < 0.5)
    const peakFall = getDarkSeasonalLeafPalette(2, 3, 0.2);
    expect(peakFall.vein).toBeDefined();

    // Winter night (fromIndex 3 or fromIndex 2 with blendFactor >= 0.5)
    const winterNight = getDarkSeasonalLeafPalette(3, 0, 0.1);
    expect(winterNight.rightTop).toBeDefined();
    const lateFallWinter = getDarkSeasonalLeafPalette(2, 3, 0.8);
    expect(lateFallWinter.rightTop).toBeDefined();

    // Spring night (fromIndex 0)
    const springNight = getDarkSeasonalLeafPalette(0, 1, 0.2);
    expect(springNight.rightTop).toBeDefined();

    // Default summer night
    const summerNight = getDarkSeasonalLeafPalette(1, 1, 0);
    expect(summerNight.vein).toBeDefined();
  });

  it('generates light seasonal leaf palettes for all transitions', () => {
    // 1 -> 2 (Summer to Fall)
    const fallTransition = getLightSeasonalLeafPalette(1, 2, 0.5);
    expect(fallTransition.leftMid).toBeDefined();

    // Peak Fall (fromIndex 2, blendFactor < 0.5)
    const peakFall = getLightSeasonalLeafPalette(2, 3, 0.2);
    expect(peakFall.leftBottom).toBeDefined();

    // Default summer
    const summer = getLightSeasonalLeafPalette(0, 1, 0.2);
    expect(summer.leftTop).toBe(LIGHT_LEAF_PALETTE.leftTop);
  });
});
