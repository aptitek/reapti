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

export const STAR_POSITIONS = [
  { id: 'star-01', left: '8%', top: '12%', size: 2.2, opacity: 0.8 },
  { id: 'star-02', left: '14%', top: '28%', size: 1.6, opacity: 0.6 },
  { id: 'star-03', left: '22%', top: '8%', size: 2.4, opacity: 0.85 },
  { id: 'star-04', left: '28%', top: '34%', size: 1.4, opacity: 0.5 },
  { id: 'star-05', left: '35%', top: '18%', size: 2.0, opacity: 0.7 },
  { id: 'star-06', left: '42%', top: '6%', size: 2.5, opacity: 0.9 },
  { id: 'star-07', left: '48%', top: '26%', size: 1.5, opacity: 0.6 },
  { id: 'star-08', left: '55%', top: '14%', size: 2.2, opacity: 0.8 },
  { id: 'star-09', left: '62%', top: '38%', size: 1.8, opacity: 0.65 },
  { id: 'star-10', left: '68%', top: '9%', size: 2.6, opacity: 0.85 },
  { id: 'star-11', left: '75%', top: '22%', size: 1.6, opacity: 0.7 },
  { id: 'star-12', left: '82%', top: '7%', size: 2.4, opacity: 0.9 },
  { id: 'star-13', left: '88%', top: '32%', size: 1.5, opacity: 0.55 },
  { id: 'star-14', left: '94%', top: '16%', size: 2.0, opacity: 0.75 },
  { id: 'star-15', left: '11%', top: '45%', size: 1.4, opacity: 0.5 },
  { id: 'star-16', left: '26%', top: '48%', size: 2.1, opacity: 0.7 },
  { id: 'star-17', left: '52%', top: '44%', size: 1.7, opacity: 0.6 },
  { id: 'star-18', left: '72%', top: '46%', size: 2.2, opacity: 0.75 },
  { id: 'star-19', left: '86%', top: '42%', size: 1.8, opacity: 0.65 },
];

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
