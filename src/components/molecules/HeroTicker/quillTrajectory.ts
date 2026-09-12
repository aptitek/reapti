/**
 * Quill Letter-Line Trajectory Engine
 *
 * Calculates the exact 2D coordinates (X, Y), slant offset, loop offsets,
 * and tilt angle of the calligraphy quill nib so that it closely tracks the
 * physical cursive letter strokes of the Milkshake script (ascenders,
 * descenders, median loops, counter-clockwise round letter ovals, and
 * pen-up word transitions).
 */

export interface QuillTrajectoryPoint {
  /** CSS left position expression with horizontal slant and loop correction */
  left: string;
  /** CSS bottom position expression aligning the nib tip to the letter line */
  bottom: string;
  /** Dynamic tilt angle in degrees (-14deg on downstrokes, -4deg on upstrokes, -8deg resting) */
  tiltAngle: number;
  /** Vertical position as a percentage from container bottom (11% descender to 86% ascender) */
  verticalPercent: number;
  /** Whether the quill is currently executing a high-pressure downstroke */
  isDownstroke: boolean;
}

export interface CharInterval {
  char: string;
  start: number;
  end: number;
}

export interface StrokeResult {
  y: number;
  down: boolean;
  xOffset: number;
}

// Measured Milkshake cursive script typography landmarks (% from container bottom)
export const LETTER_METRICS = {
  baseline: 26,
  median: 60,
  ascender: 86,
  descender: 11,
  slantFactor: 13, // 13px forward slant at ascender height relative to baseline
  tipOffsetX: 11.6, // nib tip is 11.6px inside the 52px quill asset
  tipOffsetY: 2.5, // nib tip is 2.5px above the bottom of the 52px quill asset
} as const;

export function normalizeChar(char: string): string {
  if (!char) return 'e';
  return char.normalize('NFD').charAt(0).toLowerCase();
}

export function getCharWidthWeight(char: string): number {
  if (char === ' ') return 0.7;
  if (/[MW]/.test(char)) return 1.6;
  if (/[mw]/.test(char)) return 1.4;
  if (/[ijl.,!]/.test(char)) return 0.6;
  if (/[frt]/.test(char)) return 0.8;
  if (/[A-Z]/.test(char)) return 1.3;
  return 1.0;
}

export function buildCharIntervals(phrase: string): CharInterval[] {
  if (!phrase) return [];
  const chars = phrase.split('');
  const weights = chars.map(getCharWidthWeight);
  const total = weights.reduce((acc, w) => acc + w, 0);

  let accumulated = 0;
  return chars.map((char, i) => {
    const start = (accumulated / total) * 100;
    accumulated += weights[i]!;
    const end = (accumulated / total) * 100;
    return { char, start, end };
  });
}

function computeIntervalRatio(inv: CharInterval, clamped: number): number {
  const span = inv.end - inv.start;
  const ratio = span > 0 ? (clamped - inv.start) / span : 0.5;
  return Math.max(0, Math.min(1, ratio));
}

export function findActiveChar(
  intervals: CharInterval[],
  progress: number
): { char: string; t: number } {
  if (intervals.length === 0) return { char: 'e', t: 0.5 };
  const clamped = Math.max(0, Math.min(100, progress));
  const active = intervals.find(
    (inv) => clamped >= inv.start && clamped <= inv.end
  );

  if (active) {
    return { char: active.char, t: computeIntervalRatio(active, clamped) };
  }

  const last = intervals[intervals.length - 1];
  return { char: last?.char ?? 'e', t: 1.0 };
}

function getAscenderStroke(t: number): StrokeResult {
  const { baseline, ascender } = LETTER_METRICS;
  if (t < 0.4) {
    const upRatio = t / 0.4;
    const y = 30 + (ascender - 30) * Math.sin(upRatio * (Math.PI / 2));
    const xOffset = Math.sin(upRatio * Math.PI) * 2;
    return { y, down: false, xOffset };
  }
  if (t < 0.8) {
    const downRatio = (t - 0.4) / 0.4;
    const y =
      ascender - (ascender - baseline) * Math.sin(downRatio * (Math.PI / 2));
    return { y, down: true, xOffset: 0 };
  }
  const exitRatio = (t - 0.8) / 0.2;
  const y = baseline + 6 * Math.sin(exitRatio * (Math.PI / 2));
  return { y, down: false, xOffset: exitRatio * 2 };
}

function getDescenderStroke(t: number): StrokeResult {
  const { baseline, median, descender } = LETTER_METRICS;
  if (t < 0.35) {
    const upRatio = t / 0.35;
    const y = baseline + (median - baseline) * Math.sin(upRatio * Math.PI);
    const xOffset = Math.sin(upRatio * Math.PI) * 2;
    return { y, down: upRatio > 0.5, xOffset };
  }
  if (t < 0.75) {
    const plungeRatio = (t - 0.35) / 0.4;
    const y =
      baseline - (baseline - descender) * Math.sin(plungeRatio * Math.PI);
    const xOffset = -Math.sin(plungeRatio * Math.PI) * 5;
    return { y, down: plungeRatio < 0.5, xOffset };
  }
  const exitRatio = (t - 0.75) / 0.25;
  const y =
    descender +
    (baseline + 4 - descender) * Math.sin(exitRatio * (Math.PI / 2));
  return { y, down: false, xOffset: exitRatio * 2 };
}

function getMultiArchStroke(char: string, t: number): StrokeResult {
  const { baseline, median } = LETTER_METRICS;
  const arches = char === 'm' ? 3 : 2;
  const phase = t * arches * Math.PI;
  const archHeight = median - baseline;
  const y = baseline + archHeight * Math.abs(Math.sin(phase));
  const slope = Math.cos(phase);
  const xOffset = Math.sin(phase) * 1.5;
  return { y, down: slope < 0, xOffset };
}

function getRoundLoopStroke(t: number): StrokeResult {
  const { baseline, median } = LETTER_METRICS;
  if (t < 0.45) {
    const upRatio = t / 0.45;
    const y = 28 + (median - 28) * Math.sin(upRatio * (Math.PI / 2));
    const xOffset = Math.sin(upRatio * Math.PI) * 3;
    return { y, down: false, xOffset };
  }
  if (t < 0.8) {
    const downRatio = (t - 0.45) / 0.35;
    const y =
      median - (median - baseline) * Math.sin(downRatio * (Math.PI / 2));
    const xOffset = -Math.sin(downRatio * Math.PI) * 4;
    return { y, down: true, xOffset };
  }
  const exitRatio = (t - 0.8) / 0.2;
  const y = baseline + 6 * Math.sin(exitRatio * (Math.PI / 2));
  return { y, down: false, xOffset: exitRatio * 2 };
}

export function getCharacterStroke(rawChar: string, t: number): StrokeResult {
  if (rawChar === ' ') {
    return { y: 34 + 12 * Math.sin(t * Math.PI), down: false, xOffset: 0 };
  }

  const char = normalizeChar(rawChar);
  const isAscender =
    /[bdfhklt0-9!]/.test(char) || rawChar !== rawChar.toLowerCase();
  if (isAscender) return getAscenderStroke(t);

  const isDescender = /[gjpqyz]/.test(char);
  if (isDescender) return getDescenderStroke(t);

  if (char === 'm' || char === 'n') return getMultiArchStroke(char, t);

  return getRoundLoopStroke(t);
}

export function calculateSlantOffset(verticalPercent: number): number {
  const { baseline, median, slantFactor } = LETTER_METRICS;
  const range = median - baseline;
  return ((verticalPercent - baseline) / range) * (slantFactor * 0.55);
}

export function calculateQuillTrajectory(
  phrase: string,
  progress: number,
  active: boolean
): QuillTrajectoryPoint {
  if (!active || progress <= 0) {
    const restingY = LETTER_METRICS.baseline + 6;
    const slantPx = calculateSlantOffset(restingY);
    const leftCalc = `calc(${progress}% - ${LETTER_METRICS.tipOffsetX}px + ${slantPx.toFixed(1)}px)`;
    const bottomCalc = `calc(${restingY.toFixed(1)}% - ${LETTER_METRICS.tipOffsetY}px)`;
    return {
      left: leftCalc,
      bottom: bottomCalc,
      tiltAngle: -8,
      verticalPercent: restingY,
      isDownstroke: false,
    };
  }

  const intervals = buildCharIntervals(phrase);
  const { char, t } = findActiveChar(intervals, progress);
  const stroke = getCharacterStroke(char, t);

  const slantPx = calculateSlantOffset(stroke.y);
  const tiltAngle = stroke.down ? -14 : -4;
  const totalOffset = slantPx + stroke.xOffset;
  const leftCalc = `calc(${progress}% - ${LETTER_METRICS.tipOffsetX}px + ${totalOffset.toFixed(1)}px)`;
  const bottomCalc = `calc(${stroke.y.toFixed(1)}% - ${LETTER_METRICS.tipOffsetY}px)`;

  return {
    left: leftCalc,
    bottom: bottomCalc,
    tiltAngle,
    verticalPercent: stroke.y,
    isDownstroke: stroke.down,
  };
}

export function applyNibStyle(
  el: HTMLSpanElement | null,
  trajectory: { left: string; bottom: string; tiltAngle: number },
  accentVar?: string
): void {
  if (!el) return;
  el.style.setProperty('--ticker-nib-left', trajectory.left);
  el.style.setProperty('--ticker-nib-bottom', trajectory.bottom);
  el.style.setProperty('--ticker-nib-tilt', `${trajectory.tiltAngle}deg`);
  if (accentVar) el.style.setProperty('--ticker-nib-color', accentVar);
}
