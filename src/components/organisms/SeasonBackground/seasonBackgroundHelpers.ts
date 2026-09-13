import type { Point2D } from './SeasonBackground.types.ts';
import {
  getCanopyClusterFill,
  getFlowerBloomFactor,
  SPRING_FLOWER_SCHEDULES,
  SPRING_PETAL_SCHEDULES,
} from './seasonSchedules.ts';
import {
  getSeasonalCanopyTokens,
  getSeasonalGrassTokens,
  getSeasonalHillTokens,
  resolveSeasonProgress,
} from './seasonUtils.ts';
import type { SeasonalCanopyTokens } from './seasonUtils.ts';
import type { FlowerScaleFactors } from './seasonLandscapePalettes.ts';

export {
  STAR_POSITIONS,
  calculateFlowerScale,
  type FlowerScaleFactors,
} from './seasonLandscapePalettes.ts';
export { resolveBackgroundConfig, resolveIsDark } from './seasonUtils.ts';

export function calculateParallaxOffset(
  clientX: number,
  clientY: number,
  box: { left: number; top: number; width: number; height: number }
): Point2D {
  const relX = clientX - box.left;
  const relY = clientY - box.top;
  return {
    x: (relX - box.width * 0.5) * 0.015,
    y: (relY - box.height * 0.5) * 0.015,
  };
}

export function calculateAspectCorrection(
  width: number,
  height: number
): { meadowScaleY: number; grassScaleY: number } {
  const w = width || 1440;
  const h = height || 900;
  return {
    meadowScaleY: Math.max(0.1, Math.min(4, w / (1.6 * Math.max(1, h)))),
    grassScaleY: Math.max(0.1, Math.min(4, w / 1440)),
  };
}

function injectCanopyClusterFills(svgRaw: string, norm: number): string {
  let output = svgRaw;
  for (let i = 0; i < 17; i++) {
    const isWarm = [6, 9, 10, 12, 15, 16].includes(i);
    const gradType = isWarm ? 'warm' : i < 3 ? 'grad2' : 'grad1';
    const fill = getCanopyClusterFill(i, gradType, norm);
    output = output.replace(
      new RegExp(`data-cluster="${i}"[^>]*>`, 'g'),
      (match) => match.replace(/fill="[^"]*"/, `fill="${fill}"`)
    );
  }
  return output;
}

function makeGrad(
  id: string,
  [c1, c2]: [string, string],
  isDiag = false
): string {
  const coords = isDiag
    ? 'x1="20%" y1="0%" x2="80%" y2="100%"'
    : 'x1="0%" y1="0%" x2="100%" y2="100%"';
  return `<linearGradient id="${id}" ${coords}><stop offset="0%" stop-color="${c1}" /><stop offset="100%" stop-color="${c2}" /></linearGradient>`;
}

function injectCanopyGradients(
  svgRaw: string,
  tokens: SeasonalCanopyTokens,
  seasonal: { spring: SeasonalCanopyTokens; summer: SeasonalCanopyTokens }
): string {
  const grads = [
    makeGrad('treeTrunkGrad', [tokens.trunkPrimary, tokens.trunkSecondary]),
    makeGrad('treeCanopyGrad1', [tokens.foliage1A, tokens.foliage1B], true),
    makeGrad('treeCanopyGrad2', [tokens.foliage2A, tokens.foliage2B]),
    makeGrad('treeCanopyWarm', [tokens.foliageWarmA, tokens.foliageWarmB]),
    makeGrad(
      'treeCanopyGrad1Spring',
      [seasonal.spring.foliage1A, seasonal.spring.foliage1B],
      true
    ),
    makeGrad('treeCanopyGrad2Spring', [
      seasonal.spring.foliage2A,
      seasonal.spring.foliage2B,
    ]),
    makeGrad('treeCanopyWarmSpring', [
      seasonal.spring.foliageWarmA,
      seasonal.spring.foliageWarmB,
    ]),
    makeGrad(
      'treeCanopyGrad1Summer',
      [seasonal.summer.foliage1A, seasonal.summer.foliage1B],
      true
    ),
    makeGrad('treeCanopyGrad2Summer', [
      seasonal.summer.foliage2A,
      seasonal.summer.foliage2B,
    ]),
    makeGrad('treeCanopyWarmSummer', [
      seasonal.summer.foliageWarmA,
      seasonal.summer.foliageWarmB,
    ]),
  ].join('');
  return svgRaw.replace(/<defs>[\s\S]*?<\/defs>/, `<defs>${grads}</defs>`);
}

function injectWinterSnow(
  svgRaw: string,
  snowOpacity: number,
  isDark: boolean
): string {
  if (snowOpacity <= 0.01) {
    return svgRaw
      .replace(/<g id="treeWinterBranchSnow">[\s\S]*?<\/g>/, '')
      .replace(/<g id="treeWinterSnow">[\s\S]*?<\/g>/, '');
  }
  const effectiveOpacity = (snowOpacity * (isDark ? 0.78 : 0.95)).toFixed(3);
  return svgRaw
    .replace(
      '<g id="treeWinterBranchSnow">',
      `<g id="treeWinterBranchSnow" opacity="${effectiveOpacity}">`
    )
    .replace(
      '<g id="treeWinterSnow">',
      `<g id="treeWinterSnow" opacity="${effectiveOpacity}">`
    );
}

export function renderTreeSvgString(
  svgRaw: string,
  seasonProgress: number,
  isDarkMode: boolean
): string {
  const norm = ((seasonProgress % 4) + 4) % 4;
  const canopyTokens = getSeasonalCanopyTokens(seasonProgress, isDarkMode);
  const springTokens = getSeasonalCanopyTokens(0.0, isDarkMode);
  const summerTokens = getSeasonalCanopyTokens(1.0, isDarkMode);

  const withDefs = injectCanopyGradients(svgRaw, canopyTokens, {
    spring: springTokens,
    summer: summerTokens,
  });
  const withCanopy = injectCanopyClusterFills(withDefs, norm);
  return injectWinterSnow(withCanopy, canopyTokens.snowOpacity, isDarkMode);
}

function stripUnbloomedFlowers(svgRaw: string, norm: number): string {
  let output = svgRaw;
  SPRING_FLOWER_SCHEDULES.forEach((sched, idx) => {
    const factor = getFlowerBloomFactor(norm, sched);
    if (factor <= 0.01) {
      output = output.replace(
        new RegExp(`<g data-flower="${idx}"[\\s\\S]*?<\\/g>`, 'g'),
        ''
      );
    }
  });
  SPRING_PETAL_SCHEDULES.forEach((sched, idx) => {
    const factor = getFlowerBloomFactor(norm, sched);
    if (factor <= 0.01) {
      output = output.replace(
        new RegExp(`<g data-petal="${idx}"[\\s\\S]*?<\\/g>`, 'g'),
        ''
      );
    }
  });
  return output;
}

export interface RenderHillsOptions {
  isDarkMode?: boolean;
  flowerScale?: FlowerScaleFactors;
}

function scaleFlowers(svg: string, scale?: FlowerScaleFactors): string {
  if (!scale) return svg;
  const { scaleX, scaleY } = scale;
  if (Math.abs(scaleX - 1) <= 0.005 && Math.abs(scaleY - 1) <= 0.005)
    return svg;
  return svg.replace(
    /(<g data-(?:flower|petal)="\d+" transform="translate\([^)]+\))/g,
    `$1 scale(${scaleX.toFixed(3)}, ${scaleY.toFixed(3)})`
  );
}

export function renderHillsSvgString(
  svgRaw: string,
  seasonProgress: number,
  isDarkOrOptions: boolean | RenderHillsOptions = false
): string {
  const isDark =
    typeof isDarkOrOptions === 'boolean'
      ? isDarkOrOptions
      : !!isDarkOrOptions.isDarkMode;
  const scale =
    typeof isDarkOrOptions === 'object'
      ? isDarkOrOptions.flowerScale
      : undefined;
  const hillTokens = getSeasonalHillTokens(seasonProgress, isDark);
  const norm = ((seasonProgress % 4) + 4) % 4;
  const distSpring = Math.min(norm, 4 - norm);
  const strokeColor = isDark
    ? 'var(--color-celestial-night-sky-glow, rgba(180,215,225,0.12))'
    : 'var(--color-hill-ridge-stroke, rgba(253, 246, 227, 0.22))';

  const output = svgRaw
    .replace('fill="#eee8d5"', `fill="${hillTokens.hillBack}"`)
    .replace('fill="#b58900"', `fill="${hillTokens.hillMid}"`)
    .replace('fill="#859900"', `fill="${hillTokens.hillFront}"`)
    .replace('stroke="rgba(255, 255, 255, 0.22)"', `stroke="${strokeColor}"`);

  if (1 - distSpring * 1.6 <= 0.01) {
    return output.replace(
      /<g id="springMeadowFloorFlowers"[\s\S]*?<\/g>\s*<\/svg>/,
      '</svg>'
    );
  }
  return scaleFlowers(stripUnbloomedFlowers(output, norm), scale);
}

export function renderGrassSvgString(
  svgRaw: string,
  seasonProgress: number,
  isDarkMode: boolean
): string {
  const grassTokens = getSeasonalGrassTokens(seasonProgress, isDarkMode);
  const distSpring = Math.min(
    resolveSeasonProgress(undefined, seasonProgress),
    4 - resolveSeasonProgress(undefined, seasonProgress)
  );
  const flowerOpacity = Math.max(0, 1 - distSpring * 1.5);

  let output = svgRaw
    .replace('stop-color="#9ec43b"', `stop-color="${grassTokens.primaryStart}"`)
    .replace(
      'stop-color="#859900"',
      `stop-color="${grassTokens.secondaryStart}"`
    );

  if (flowerOpacity <= 0.01) {
    output = output.replace(/<g id="springFloorFlowers"[\s\S]*?<\/g>/, '');
  }
  return output;
}
