import {
  BOTANICAL_COLORS,
  SEASON_COLORS,
  SEASON_NIGHT_COLORS,
} from '../../../tokens/solarized.ts';

export const CANOPY_SEASON_PALETTES = [
  {
    foliage1A: SEASON_COLORS.spring.canopyA,
    foliage1B: SEASON_COLORS.spring.canopyB,
    foliage2A: SEASON_COLORS.spring.blossomDeep,
    foliage2B: SEASON_COLORS.spring.blossom,
    foliageWarmA: SEASON_COLORS.spring.canopyWarm,
    foliageWarmB: SEASON_COLORS.spring.blossomPetal,
  },
  {
    foliage1A: SEASON_COLORS.summer.canopyA,
    foliage1B: SEASON_COLORS.summer.canopyB,
    foliage2A: SEASON_COLORS.summer.deepCanopyA,
    foliage2B: SEASON_COLORS.summer.deepCanopyB,
    foliageWarmA: SEASON_COLORS.summer.canopyWarm,
    foliageWarmB: SEASON_COLORS.summer.canopyLight,
  },
  {
    foliage1A: SEASON_COLORS.fall.canopyA,
    foliage1B: SEASON_COLORS.fall.canopyB,
    foliage2A: SEASON_COLORS.fall.foliageOrange,
    foliage2B: SEASON_COLORS.fall.foliageRed,
    foliageWarmA: SEASON_COLORS.fall.canopyWarm,
    foliageWarmB: SEASON_COLORS.fall.foliageSienna,
  },
  {
    foliage1A: SEASON_COLORS.winter.canopyA,
    foliage1B: SEASON_COLORS.winter.canopyB,
    foliage2A: SEASON_COLORS.winter.frostSlate,
    foliage2B: SEASON_COLORS.winter.snowSoft,
    foliageWarmA: SEASON_COLORS.winter.canopyWarm,
    foliageWarmB: SEASON_COLORS.winter.iceCyan,
  },
];

export const CANOPY_NIGHT_SEASON_PALETTES = [
  {
    foliage1A: SEASON_NIGHT_COLORS.spring.canopyA,
    foliage1B: SEASON_NIGHT_COLORS.spring.canopyB,
    foliage2A: SEASON_NIGHT_COLORS.spring.deepCanopyA,
    foliage2B: SEASON_NIGHT_COLORS.spring.deepCanopyB,
    foliageWarmA: SEASON_NIGHT_COLORS.spring.canopyWarm,
    foliageWarmB: SEASON_NIGHT_COLORS.spring.canopyLight,
  },
  {
    foliage1A: SEASON_NIGHT_COLORS.summer.canopyA,
    foliage1B: SEASON_NIGHT_COLORS.summer.canopyB,
    foliage2A: SEASON_NIGHT_COLORS.summer.deepCanopyA,
    foliage2B: SEASON_NIGHT_COLORS.summer.deepCanopyB,
    foliageWarmA: SEASON_NIGHT_COLORS.summer.canopyWarm,
    foliageWarmB: SEASON_NIGHT_COLORS.summer.canopyLight,
  },
  {
    foliage1A: SEASON_NIGHT_COLORS.fall.canopyA,
    foliage1B: SEASON_NIGHT_COLORS.fall.canopyB,
    foliage2A: SEASON_NIGHT_COLORS.fall.deepCanopyA,
    foliage2B: SEASON_NIGHT_COLORS.fall.deepCanopyB,
    foliageWarmA: SEASON_NIGHT_COLORS.fall.canopyWarm,
    foliageWarmB: SEASON_NIGHT_COLORS.fall.canopyLight,
  },
  {
    foliage1A: SEASON_NIGHT_COLORS.winter.canopyA,
    foliage1B: SEASON_NIGHT_COLORS.winter.canopyB,
    foliage2A: SEASON_NIGHT_COLORS.winter.deepCanopyA,
    foliage2B: SEASON_NIGHT_COLORS.winter.deepCanopyB,
    foliageWarmA: SEASON_NIGHT_COLORS.winter.canopyWarm,
    foliageWarmB: SEASON_NIGHT_COLORS.winter.canopyLight,
  },
];

export const HILLS_SEASON_PALETTES = [
  {
    back: SEASON_COLORS.spring.hillBack,
    mid: SEASON_COLORS.spring.hillMid,
    front: SEASON_COLORS.spring.hillFront,
  },
  {
    back: SEASON_COLORS.summer.hillBack,
    mid: SEASON_COLORS.summer.hillMid,
    front: SEASON_COLORS.summer.hillFront,
  },
  {
    back: SEASON_COLORS.fall.hillBack,
    mid: SEASON_COLORS.fall.hillMid,
    front: SEASON_COLORS.fall.hillFront,
  },
  {
    back: SEASON_COLORS.winter.hillBack,
    mid: SEASON_COLORS.winter.hillMid,
    front: SEASON_COLORS.winter.hillFront,
  },
];

export const HILLS_NIGHT_SEASON_PALETTES = [
  {
    back: SEASON_NIGHT_COLORS.spring.hillBack,
    mid: SEASON_NIGHT_COLORS.spring.hillMid,
    front: SEASON_NIGHT_COLORS.spring.hillFront,
  },
  {
    back: SEASON_NIGHT_COLORS.summer.hillBack,
    mid: SEASON_NIGHT_COLORS.summer.hillMid,
    front: SEASON_NIGHT_COLORS.summer.hillFront,
  },
  {
    back: SEASON_NIGHT_COLORS.fall.hillBack,
    mid: SEASON_NIGHT_COLORS.fall.hillMid,
    front: SEASON_NIGHT_COLORS.fall.hillFront,
  },
  {
    back: SEASON_NIGHT_COLORS.winter.hillBack,
    mid: SEASON_NIGHT_COLORS.winter.hillMid,
    front: SEASON_NIGHT_COLORS.winter.hillFront,
  },
];

export const GRASS_SEASON_PALETTES = [
  {
    pStart: SEASON_COLORS.spring.grass,
    pMid: BOTANICAL_COLORS.grassBladeHighlight,
    sStart: BOTANICAL_COLORS.grassBladeLight,
  },
  {
    pStart: BOTANICAL_COLORS.grassBladeLight,
    pMid: BOTANICAL_COLORS.grassBladeHighlight,
    sStart: BOTANICAL_COLORS.grassBladeWarm,
  },
  {
    pStart: SEASON_COLORS.fall.grass,
    pMid: SEASON_COLORS.fall.foliageGold,
    sStart: SEASON_COLORS.fall.foliageOrange,
  },
  {
    pStart: SEASON_COLORS.winter.snowWhite,
    pMid: SEASON_COLORS.winter.frostSlate,
    sStart: SEASON_COLORS.winter.snowSoft,
  },
];

export const GRASS_NIGHT_SEASON_PALETTES = [
  {
    pStart: SEASON_NIGHT_COLORS.spring.grass,
    pMid: SEASON_NIGHT_COLORS.spring.hillFront,
    sStart: SEASON_NIGHT_COLORS.spring.hillMid,
  },
  {
    pStart: SEASON_NIGHT_COLORS.summer.grass,
    pMid: SEASON_NIGHT_COLORS.summer.hillFront,
    sStart: SEASON_NIGHT_COLORS.summer.hillMid,
  },
  {
    pStart: SEASON_NIGHT_COLORS.fall.grass,
    pMid: SEASON_NIGHT_COLORS.fall.hillFront,
    sStart: SEASON_NIGHT_COLORS.fall.hillMid,
  },
  {
    pStart: SEASON_NIGHT_COLORS.winter.grass,
    pMid: SEASON_NIGHT_COLORS.winter.hillFront,
    sStart: SEASON_NIGHT_COLORS.winter.hillMid,
  },
];

export interface StarPosition {
  id: string;
  left: string;
  top: string;
  size: number;
  opacity: number;
  phase: number;
  isSparkle?: boolean;
}

const RAW_STARS: [string, string, string, number, number, number, boolean?][] =
  [
    ['star-01', '8%', '12%', 2.2, 0.8, 0],
    ['star-02', '14%', '28%', 1.6, 0.6, 1],
    ['star-03', '22%', '8%', 2.8, 0.95, 2, true],
    ['star-04', '28%', '34%', 1.4, 0.5, 0],
    ['star-05', '35%', '18%', 2.0, 0.7, 1],
    ['star-06', '42%', '6%', 3.0, 1.0, 2, true],
    ['star-07', '48%', '26%', 1.5, 0.6, 0],
    ['star-08', '55%', '14%', 2.2, 0.8, 1],
    ['star-09', '62%', '38%', 1.8, 0.65, 2],
    ['star-10', '68%', '9%', 3.1, 0.95, 0, true],
    ['star-11', '75%', '22%', 1.6, 0.7, 1],
    ['star-12', '82%', '7%', 2.8, 0.9, 2, true],
    ['star-13', '88%', '32%', 1.5, 0.55, 0],
    ['star-14', '94%', '16%', 2.0, 0.75, 1],
    ['star-15', '11%', '45%', 1.4, 0.5, 2],
    ['star-16', '26%', '48%', 2.1, 0.7, 0],
    ['star-17', '52%', '44%', 1.7, 0.6, 1],
    ['star-18', '72%', '46%', 2.2, 0.75, 2],
    ['star-19', '86%', '42%', 1.8, 0.65, 0],
    ['star-20', '4%', '36%', 1.5, 0.55, 1],
    ['star-21', '38%', '41%', 2.7, 0.9, 2, true],
    ['star-22', '60%', '24%', 1.5, 0.6, 0],
    ['star-23', '79%', '37%', 1.9, 0.7, 1],
    ['star-24', '92%', '46%', 2.6, 0.85, 2, true],
  ];

export const STAR_POSITIONS: StarPosition[] = RAW_STARS.map(
  ([id, left, top, size, opacity, phase, isSparkle]) => ({
    id,
    left,
    top,
    size,
    opacity,
    phase,
    ...(isSparkle ? { isSparkle } : {}),
  })
);

export interface FlowerScaleFactors {
  scaleX: number;
  scaleY: number;
}

export function calculateFlowerScale(
  width: number,
  height: number
): FlowerScaleFactors {
  if (width <= 10 || height <= 10) return { scaleX: 1, scaleY: 1 };
  const hTree = Math.min(height * 0.84, 820);
  const wTree = hTree * (5 / 6);
  const wMax = Math.min(width * 0.52, 680);
  const treeH = wTree > wMax ? wMax * (6 / 5) : hTree;
  const treeScale = treeH / (900 * 0.84);

  const scaleX = Math.max(0.05, Math.min(5, treeScale * (1440 / width)));
  const scaleY = Math.max(0.05, Math.min(5, treeScale * (900 / height)));
  return { scaleX, scaleY };
}
