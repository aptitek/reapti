import type {
  LeafColors,
  SeasonBackgroundProps,
  SeasonThemeMode,
  SeasonTransitionState,
  SeasonVariant,
  SeasonalCanopyTokens,
  SeasonalGrassTokens,
  SeasonalHillTokens,
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

export type { SeasonalCanopyTokens, SeasonalHillTokens, SeasonalGrassTokens };

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
  skySpace?: string | number;
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

/** Resolves the Northern Hemisphere season variant from date. */
export function getNorthernHemisphereSeason(
  date: Date = new Date()
): 'spring' | 'summer' | 'fall' | 'winter' {
  const month = date.getMonth();
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'fall';
  return 'winter';
}

const SEASON_PROGRESS_MAP: Record<SeasonVariant, number> = {
  spring: 0.0,
  summer: 1.0,
  fall: 2.0,
  autumn: 2.0,
  winter: 3.0,
};

/** Resolves continuous floating-point Northern Hemisphere season progress (0.0 to 4.0). */
export function getNorthernHemisphereSeasonProgress(
  date: Date = new Date()
): number {
  const y = date.getFullYear();
  const time = date.getTime();
  const sp = new Date(y, 2, 1).getTime();
  const su = new Date(y, 5, 1).getTime();
  const fa = new Date(y, 8, 1).getTime();
  const wi = new Date(y, 11, 1).getTime();

  let start = fa;
  let end = wi;
  let base = 2.0;

  if (time >= sp && time < su) {
    start = sp;
    end = su;
    base = 0.0;
  } else if (time >= su && time < fa) {
    start = su;
    end = fa;
    base = 1.0;
  } else if (time >= wi) {
    start = wi;
    end = new Date(y + 1, 2, 1).getTime();
    base = 3.0;
  } else if (time < sp) {
    start = new Date(y - 1, 11, 1).getTime();
    end = sp;
    base = 3.0;
  }

  return base + Math.max(0, Math.min(1, (time - start) / (end - start)));
}

export function resolveBackgroundConfig(
  props: SeasonBackgroundProps,
  date: Date = new Date()
): ResolvedBackgroundConfig {
  const skySpace = props.skySpace ?? props.treeTopSpacing ?? props.treeTopSpace;
  const defaultSeason = getNorthernHemisphereSeason(date);
  const defaultSeasonProgress = getNorthernHemisphereSeasonProgress(date);
  return {
    ...DEFAULT_BG_CONFIG,
    ...props,
    season: props.season ?? defaultSeason,
    seasonProgress:
      props.seasonProgress ??
      (props.season !== undefined ? undefined : defaultSeasonProgress),
    skySpace,
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
  seasonProgress?: number,
  date: Date = new Date()
): number {
  if (typeof seasonProgress === 'number' && !Number.isNaN(seasonProgress)) {
    return ((seasonProgress % 4) + 4) % 4;
  }
  if (season !== undefined) {
    return SEASON_PROGRESS_MAP[season] ?? 1.0;
  }
  return getNorthernHemisphereSeasonProgress(date);
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
  const cA = hexA.replace('#', '');
  const cB = hexB.replace('#', '');
  const parse = (c: string, idx: number) =>
    parseInt(c.substring(idx, idx + 2), 16) || 0;
  const mix = (c1: number, c2: number) =>
    Math.round(c1 + (c2 - c1) * t)
      .toString(16)
      .padStart(2, '0');
  const r = mix(parse(cA, 0), parse(cB, 0));
  const g = mix(parse(cA, 2), parse(cB, 2));
  const b = mix(parse(cA, 4), parse(cB, 4));
  return `#${r}${g}${b}`;
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
