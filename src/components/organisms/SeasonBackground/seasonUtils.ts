import type {
  LeafColors,
  SeasonBackgroundProps,
  SeasonThemeMode,
  SeasonTransitionState,
  SeasonVariant,
} from './SeasonBackground.types.ts';
import {
  CANOPY_NIGHT_SEASON_PALETTES,
  CANOPY_SEASON_PALETTES,
  GRASS_NIGHT_SEASON_PALETTES,
  GRASS_SEASON_PALETTES,
  HILLS_NIGHT_SEASON_PALETTES,
  HILLS_SEASON_PALETTES,
} from './seasonLandscapePalettes.ts';
import {
  getDarkSeasonalLeafPalette,
  getLightSeasonalLeafPalette,
} from './seasonPalettes.ts';

export interface SeasonalCanopyTokens {
  trunkPrimary: string;
  trunkSecondary: string;
  foliage1A: string;
  foliage1B: string;
  foliage2A: string;
  foliage2B: string;
  foliageWarmA: string;
  foliageWarmB: string;
  blossomOpacity: number;
  snowOpacity: number;
}

export interface SeasonalHillTokens {
  hillBack: string;
  hillMid: string;
  hillFront: string;
}

export interface SeasonalGrassTokens {
  primaryStart: string;
  primaryMid: string;
  primaryEnd: string;
  secondaryStart: string;
  secondaryEnd: string;
}

export interface ResolvedBackgroundConfig {
  interactive: boolean;
  showTree: boolean;
  showHills: boolean;
  showCelestial: boolean;
  showClouds: boolean;
  showGodrays: boolean;
  showAurora: boolean;
  showGrass: boolean;
  leafCount: number;
  windIntensity: number;
  season?: SeasonBackgroundProps['season'];
  seasonProgress?: number;
}

const DEFAULT_BG_CONFIG: ResolvedBackgroundConfig = {
  interactive: true,
  showTree: true,
  showHills: true,
  showCelestial: true,
  showClouds: true,
  showGodrays: true,
  showAurora: true,
  showGrass: true,
  leafCount: 44,
  windIntensity: 1.0,
  season: 'summer',
};

export function resolveBackgroundConfig(
  props: SeasonBackgroundProps
): ResolvedBackgroundConfig {
  return {
    ...DEFAULT_BG_CONFIG,
    ...props,
  };
}

export function resolveIsDark(
  modeOption?: SeasonThemeMode,
  isContextDark = false
): boolean {
  if (modeOption === 'dark') return true;
  if (modeOption === 'light' || modeOption === 'sunset') return false;
  return isContextDark;
}

export function resolveSeasonProgress(
  season?: SeasonVariant,
  seasonProgress?: number
): number {
  if (typeof seasonProgress === 'number' && !Number.isNaN(seasonProgress)) {
    return ((seasonProgress % 4) + 4) % 4;
  }
  if (season === 'spring') return 0.0;
  if (season === 'fall' || season === 'autumn') return 2.0;
  if (season === 'winter') return 3.0;
  return 1.0;
}

export function getSeasonTransitionState(
  progress: number
): SeasonTransitionState {
  const normalized = ((progress % 4) + 4) % 4;
  const fromIndex = Math.floor(normalized);
  const toIndex = (fromIndex + 1) % 4;
  const blendFactor = normalized - fromIndex;
  return { fromIndex, toIndex, blendFactor };
}

export function interpolateHex(hexA: string, hexB: string, t: number): string {
  const cleanA = hexA.replace('#', '');
  const cleanB = hexB.replace('#', '');
  const r1 = parseInt(cleanA.substring(0, 2), 16) || 0;
  const g1 = parseInt(cleanA.substring(2, 4), 16) || 0;
  const b1 = parseInt(cleanA.substring(4, 6), 16) || 0;
  const r2 = parseInt(cleanB.substring(0, 2), 16) || 0;
  const g2 = parseInt(cleanB.substring(2, 4), 16) || 0;
  const b2 = parseInt(cleanB.substring(4, 6), 16) || 0;
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export function getSeasonalCanopyTokens(
  progress: number,
  isDarkMode: boolean
): SeasonalCanopyTokens {
  const distSpring = Math.min(progress, 4 - progress);
  const blossomOpacity = Math.max(0, 1 - distSpring * 1.5);
  const distWinter = Math.abs(progress - 3);
  const snowOpacity = Math.max(0, 1 - distWinter * 1.5);

  const { fromIndex, toIndex, blendFactor } =
    getSeasonTransitionState(progress);
  const palettes = isDarkMode
    ? CANOPY_NIGHT_SEASON_PALETTES
    : CANOPY_SEASON_PALETTES;
  const pFrom = palettes[fromIndex]!;
  const pTo = palettes[toIndex]!;

  const trunkPrimary = isDarkMode
    ? 'var(--color-solarized-base03)'
    : 'var(--color-solarized-base01)';
  const trunkSecondary = isDarkMode
    ? 'var(--color-solarized-base02)'
    : 'var(--color-solarized-base00)';

  const springToSummer = fromIndex === 0 && toIndex === 1;
  const blend = springToSummer ? (blendFactor >= 0.5 ? 1 : 0) : blendFactor;

  return {
    trunkPrimary,
    trunkSecondary,
    foliage1A: interpolateHex(pFrom.foliage1A, pTo.foliage1A, blend),
    foliage1B: interpolateHex(pFrom.foliage1B, pTo.foliage1B, blend),
    foliage2A: interpolateHex(pFrom.foliage2A, pTo.foliage2A, blend),
    foliage2B: interpolateHex(pFrom.foliage2B, pTo.foliage2B, blend),
    foliageWarmA: interpolateHex(pFrom.foliageWarmA, pTo.foliageWarmA, blend),
    foliageWarmB: interpolateHex(pFrom.foliageWarmB, pTo.foliageWarmB, blend),
    blossomOpacity,
    snowOpacity,
  };
}

export function getSeasonalHillTokens(
  progress: number,
  isDarkMode: boolean
): SeasonalHillTokens {
  const { fromIndex, toIndex, blendFactor } =
    getSeasonTransitionState(progress);
  const palettes = isDarkMode
    ? HILLS_NIGHT_SEASON_PALETTES
    : HILLS_SEASON_PALETTES;
  const pFrom = palettes[fromIndex]!;
  const pTo = palettes[toIndex]!;

  return {
    hillBack: interpolateHex(pFrom.back, pTo.back, blendFactor),
    hillMid: interpolateHex(pFrom.mid, pTo.mid, blendFactor),
    hillFront: interpolateHex(pFrom.front, pTo.front, blendFactor),
  };
}

export function getSeasonalGrassTokens(
  progress: number,
  isDarkMode: boolean
): SeasonalGrassTokens {
  const pEnd = isDarkMode
    ? 'var(--color-solarized-base03)'
    : 'var(--color-solarized-base2)';
  const { fromIndex, toIndex, blendFactor } =
    getSeasonTransitionState(progress);
  const palettes = isDarkMode
    ? GRASS_NIGHT_SEASON_PALETTES
    : GRASS_SEASON_PALETTES;
  const pFrom = palettes[fromIndex]!;
  const pTo = palettes[toIndex]!;

  return {
    primaryStart: interpolateHex(pFrom.pStart, pTo.pStart, blendFactor),
    primaryMid: interpolateHex(pFrom.pMid, pTo.pMid, blendFactor),
    primaryEnd: pEnd,
    secondaryStart: interpolateHex(pFrom.sStart, pTo.sStart, blendFactor),
    secondaryEnd: pEnd,
  };
}

export function getSeasonalLeafPalette(
  progress: number,
  isDarkMode: boolean
): LeafColors {
  const { fromIndex, toIndex, blendFactor } =
    getSeasonTransitionState(progress);
  return isDarkMode
    ? getDarkSeasonalLeafPalette(fromIndex, toIndex, blendFactor)
    : getLightSeasonalLeafPalette(fromIndex, toIndex, blendFactor);
}
