import {
  BOTANICAL_COLORS,
  PROGRESS_THEME_COLORS,
  SEASON_COLORS,
  SEASON_NIGHT_COLORS,
} from '../../../tokens/solarized.ts';
import type { LeafColors } from './SeasonBackground.types.ts';
import { interpolateHex } from './seasonUtils.ts';

export const LIGHT_LEAF_PALETTE: LeafColors = {
  vein: BOTANICAL_COLORS.leafVeinDark,
  leftTop: PROGRESS_THEME_COLORS.yellow,
  leftMid: PROGRESS_THEME_COLORS.orange,
  leftBottom: PROGRESS_THEME_COLORS.red,
  rightTop: PROGRESS_THEME_COLORS.green,
  rightMid: BOTANICAL_COLORS.grassBladeHighlight,
  rightBottom: PROGRESS_THEME_COLORS.darkContrast,
};

export const DARK_LEAF_PALETTE: LeafColors = {
  vein: SEASON_NIGHT_COLORS.summer.leafVein,
  leftTop: PROGRESS_THEME_COLORS.cyan,
  leftMid: PROGRESS_THEME_COLORS.blue,
  leftBottom: PROGRESS_THEME_COLORS.purple,
  rightTop: PROGRESS_THEME_COLORS.green,
  rightMid: PROGRESS_THEME_COLORS.cyan,
  rightBottom: PROGRESS_THEME_COLORS.darkContrast,
};

function getDarkSummerToFallPalette(blendFactor: number): LeafColors {
  return {
    vein: interpolateHex(
      SEASON_NIGHT_COLORS.summer.leafVein,
      SEASON_NIGHT_COLORS.fall.foliageSienna,
      blendFactor
    ),
    leftTop: interpolateHex(
      SEASON_NIGHT_COLORS.summer.canopyWarm,
      SEASON_NIGHT_COLORS.fall.foliageGold,
      blendFactor
    ),
    leftMid: interpolateHex(
      SEASON_NIGHT_COLORS.summer.canopyA,
      SEASON_NIGHT_COLORS.fall.foliageOrange,
      blendFactor
    ),
    leftBottom: interpolateHex(
      SEASON_NIGHT_COLORS.summer.canopyB,
      SEASON_NIGHT_COLORS.fall.foliageRed,
      blendFactor
    ),
    rightTop: interpolateHex(
      SEASON_NIGHT_COLORS.summer.canopyWarm,
      SEASON_NIGHT_COLORS.fall.foliageOrange,
      blendFactor
    ),
    rightMid: interpolateHex(
      SEASON_NIGHT_COLORS.summer.canopyLight,
      SEASON_NIGHT_COLORS.fall.foliageGold,
      blendFactor
    ),
    rightBottom: interpolateHex(
      SEASON_NIGHT_COLORS.summer.leafBottom,
      SEASON_NIGHT_COLORS.fall.foliageSienna,
      blendFactor
    ),
  };
}

function getDarkStaticPalette(
  fromIndex: number,
  isWinter: boolean
): LeafColors {
  if (isWinter) {
    return {
      vein: SEASON_NIGHT_COLORS.winter.leafVein,
      leftTop: SEASON_NIGHT_COLORS.winter.canopyWarm,
      leftMid: SEASON_NIGHT_COLORS.winter.frostSlate,
      leftBottom: SEASON_NIGHT_COLORS.winter.canopyB,
      rightTop: SEASON_NIGHT_COLORS.winter.snowWhite,
      rightMid: SEASON_NIGHT_COLORS.winter.snowSoft,
      rightBottom: SEASON_NIGHT_COLORS.winter.leafBottom,
    };
  }
  if (fromIndex === 0) {
    return {
      vein: SEASON_NIGHT_COLORS.spring.leafVein,
      leftTop: SEASON_NIGHT_COLORS.spring.canopyWarm,
      leftMid: SEASON_NIGHT_COLORS.spring.canopyA,
      leftBottom: SEASON_NIGHT_COLORS.spring.canopyB,
      rightTop: SEASON_NIGHT_COLORS.spring.blossom,
      rightMid: SEASON_NIGHT_COLORS.spring.blossomPetal,
      rightBottom: SEASON_NIGHT_COLORS.spring.leafBottom,
    };
  }
  if (fromIndex === 2) {
    return {
      vein: SEASON_NIGHT_COLORS.fall.foliageSienna,
      leftTop: SEASON_NIGHT_COLORS.fall.foliageGold,
      leftMid: SEASON_NIGHT_COLORS.fall.foliageOrange,
      leftBottom: SEASON_NIGHT_COLORS.fall.foliageRed,
      rightTop: SEASON_NIGHT_COLORS.fall.foliageOrange,
      rightMid: SEASON_NIGHT_COLORS.fall.foliageGold,
      rightBottom: SEASON_NIGHT_COLORS.fall.foliageSienna,
    };
  }
  return {
    vein: SEASON_NIGHT_COLORS.summer.leafVein,
    leftTop: SEASON_NIGHT_COLORS.summer.canopyWarm,
    leftMid: SEASON_NIGHT_COLORS.summer.canopyA,
    leftBottom: SEASON_NIGHT_COLORS.summer.canopyB,
    rightTop: SEASON_NIGHT_COLORS.summer.canopyWarm,
    rightMid: SEASON_NIGHT_COLORS.summer.canopyLight,
    rightBottom: SEASON_NIGHT_COLORS.summer.leafBottom,
  };
}

export function getDarkSeasonalLeafPalette(
  fromIndex: number,
  toIndex: number,
  blendFactor: number
): LeafColors {
  if (fromIndex === 1 && toIndex === 2) {
    return getDarkSummerToFallPalette(blendFactor);
  }
  const isWinter = fromIndex === 3 || (fromIndex === 2 && blendFactor >= 0.5);
  return getDarkStaticPalette(fromIndex, isWinter);
}

export function getLightSeasonalLeafPalette(
  fromIndex: number,
  toIndex: number,
  blendFactor: number
): LeafColors {
  if (fromIndex === 1 && toIndex === 2) {
    return {
      vein: interpolateHex(
        BOTANICAL_COLORS.leafVeinDark,
        SEASON_COLORS.fall.foliageSienna,
        blendFactor
      ),
      leftTop: interpolateHex(
        PROGRESS_THEME_COLORS.yellow,
        SEASON_COLORS.fall.foliageGold,
        blendFactor
      ),
      leftMid: interpolateHex(
        PROGRESS_THEME_COLORS.orange,
        SEASON_COLORS.fall.foliageOrange,
        blendFactor
      ),
      leftBottom: interpolateHex(
        PROGRESS_THEME_COLORS.red,
        SEASON_COLORS.fall.foliageRed,
        blendFactor
      ),
      rightTop: interpolateHex(
        PROGRESS_THEME_COLORS.green,
        SEASON_COLORS.fall.foliageOrange,
        blendFactor
      ),
      rightMid: interpolateHex(
        BOTANICAL_COLORS.grassBladeHighlight,
        SEASON_COLORS.fall.foliageGold,
        blendFactor
      ),
      rightBottom: interpolateHex(
        PROGRESS_THEME_COLORS.darkContrast,
        SEASON_COLORS.fall.foliageSienna,
        blendFactor
      ),
    };
  }

  if (fromIndex === 2 && blendFactor < 0.5) {
    return {
      vein: SEASON_COLORS.fall.foliageSienna,
      leftTop: SEASON_COLORS.fall.foliageGold,
      leftMid: SEASON_COLORS.fall.foliageOrange,
      leftBottom: SEASON_COLORS.fall.foliageRed,
      rightTop: SEASON_COLORS.fall.foliageOrange,
      rightMid: SEASON_COLORS.fall.foliageGold,
      rightBottom: SEASON_COLORS.fall.foliageSienna,
    };
  }

  return LIGHT_LEAF_PALETTE;
}
