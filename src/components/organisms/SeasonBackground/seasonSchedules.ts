/**
 * Seasonal Schedules & Canopy Budding Thresholds
 * Controls staggered budding of tree canopy clusters and flower bloom factors across seasons.
 */

export interface FlowerBloomSchedule {
  bloomIn: number;
  bloomOut: number;
}

export const CANOPY_BUD_THRESHOLDS: readonly number[] = [
  0.18, // 0: Deep left (cx=140, cy=220)
  0.28, // 1: Deep right (cx=340, cy=230)
  0.63, // 2: Deep center (cx=230, cy=150)
  0.43, // 3: Mid left (cx=170, cy=180)
  0.53, // 4: Mid right (cx=280, cy=185)
  0.84, // 5: Mid top crown (cx=225, cy=110)
  0.76, // 6: Mid far right (cx=365, cy=190)
  0.33, // 7: Foreground far left (cx=110, cy=205)
  0.88, // 8: Foreground center (cx=230, cy=210)
  0.68, // 9: Foreground top right (cx=300, cy=140)
  0.8, // 10: Foreground top left (cx=180, cy=130)
  0.48, // 11: Foreground far right (cx=400, cy=215)
  0.15, // 12: Outer bud left (cx=95, cy=170)
  0.23, // 13: Outer bud right (cx=435, cy=195)
  0.72, // 14: Outer bud top right (cx=330, cy=85)
  0.38, // 15: Outer bud top left (cx=160, cy=90)
  0.58, // 16: Outer bud bottom right (cx=410, cy=250)
];

export function getCanopyClusterFill(
  clusterIndex: number,
  gradType: 'grad1' | 'grad2' | 'warm',
  normalizedProgress: number
): string {
  if (normalizedProgress >= 1.0) {
    if (gradType === 'grad1') return 'url(#treeCanopyGrad1)';
    if (gradType === 'grad2') return 'url(#treeCanopyGrad2)';
    return 'url(#treeCanopyWarm)';
  }

  const threshold = CANOPY_BUD_THRESHOLDS[clusterIndex] ?? 0.5;
  const isGreen = normalizedProgress >= threshold;
  const suffix = isGreen ? 'Summer' : 'Spring';

  if (gradType === 'grad1') return `url(#treeCanopyGrad1${suffix})`;
  if (gradType === 'grad2') return `url(#treeCanopyGrad2${suffix})`;
  return `url(#treeCanopyWarm${suffix})`;
}

export const SPRING_FLOWER_SCHEDULES: readonly FlowerBloomSchedule[] = [
  { bloomIn: 3.38, bloomOut: 0.25 },
  { bloomIn: 3.55, bloomOut: 0.45 },
  { bloomIn: 3.42, bloomOut: 0.35 },
  { bloomIn: 3.68, bloomOut: 0.6 },
  { bloomIn: 3.48, bloomOut: 0.28 },
  { bloomIn: 3.62, bloomOut: 0.52 },
  { bloomIn: 3.75, bloomOut: 0.7 },
  { bloomIn: 3.4, bloomOut: 0.3 },
  { bloomIn: 3.58, bloomOut: 0.48 },
  { bloomIn: 3.7, bloomOut: 0.65 },
  { bloomIn: 3.45, bloomOut: 0.38 },
  { bloomIn: 3.65, bloomOut: 0.55 },
  { bloomIn: 3.82, bloomOut: 0.75 },
  { bloomIn: 3.5, bloomOut: 0.42 },
  { bloomIn: 3.72, bloomOut: 0.62 },
  { bloomIn: 3.6, bloomOut: 0.5 },
  { bloomIn: 3.78, bloomOut: 0.72 },
  { bloomIn: 3.52, bloomOut: 0.4 },
  { bloomIn: 3.85, bloomOut: 0.78 },
  { bloomIn: 3.66, bloomOut: 0.58 },
];

export const SPRING_PETAL_SCHEDULES: readonly FlowerBloomSchedule[] = [
  { bloomIn: 3.45, bloomOut: 0.32 },
  { bloomIn: 3.52, bloomOut: 0.4 },
  { bloomIn: 3.6, bloomOut: 0.5 },
  { bloomIn: 3.48, bloomOut: 0.36 },
  { bloomIn: 3.7, bloomOut: 0.64 },
  { bloomIn: 3.55, bloomOut: 0.44 },
  { bloomIn: 3.65, bloomOut: 0.56 },
  { bloomIn: 3.75, bloomOut: 0.72 },
  { bloomIn: 3.42, bloomOut: 0.28 },
  { bloomIn: 3.62, bloomOut: 0.52 },
  { bloomIn: 3.5, bloomOut: 0.38 },
  { bloomIn: 3.68, bloomOut: 0.6 },
  { bloomIn: 3.58, bloomOut: 0.46 },
  { bloomIn: 3.78, bloomOut: 0.74 },
  { bloomIn: 3.46, bloomOut: 0.34 },
  { bloomIn: 3.72, bloomOut: 0.66 },
  { bloomIn: 3.82, bloomOut: 0.78 },
];

export function getFlowerBloomFactor(
  normalizedProgress: number,
  schedule: FlowerBloomSchedule,
  ramp = 0.04
): number {
  const { bloomIn, bloomOut } = schedule;
  if (normalizedProgress >= 3.0) {
    if (normalizedProgress < bloomIn) return 0;
    return Math.min(1, (normalizedProgress - bloomIn) / ramp);
  }

  if (normalizedProgress < 1.0) {
    if (normalizedProgress < bloomOut) return 1;
    return Math.max(0, 1 - (normalizedProgress - bloomOut) / ramp);
  }

  return 0;
}
