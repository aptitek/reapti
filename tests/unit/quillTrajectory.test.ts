import { describe, it, expect } from 'vitest';
import {
  LETTER_METRICS,
  normalizeChar,
  getCharWidthWeight,
  buildCharIntervals,
  findActiveChar,
  getCharacterStroke,
  calculateSlantOffset,
  calculateQuillTrajectory,
  applyNibStyle,
} from '../../src/components/molecules/HeroTicker/quillTrajectory.ts';

describe('quillTrajectory - Characters and Intervals', () => {
  it('normalizes accented and uppercase characters', () => {
    expect(normalizeChar('é')).toBe('e');
    expect(normalizeChar('À')).toBe('a');
    expect(normalizeChar('ç')).toBe('c');
    expect(normalizeChar('L')).toBe('l');
    expect(normalizeChar('')).toBe('e');
  });

  it('assigns appropriate typographic weights', () => {
    expect(getCharWidthWeight('m')).toBeGreaterThan(getCharWidthWeight('a'));
    expect(getCharWidthWeight('i')).toBeLessThan(getCharWidthWeight('a'));
    expect(getCharWidthWeight(' ')).toBeLessThan(getCharWidthWeight('a'));
    expect(getCharWidthWeight('W')).toBeGreaterThan(getCharWidthWeight('w'));
  });

  it('generates contiguous intervals summing to 100%', () => {
    expect(buildCharIntervals('')).toEqual([]);
    const intervals = buildCharIntervals('test phrase');
    expect(intervals).toHaveLength('test phrase'.length);
    expect(intervals[0]?.start).toBe(0);
    expect(intervals[intervals.length - 1]?.end).toBeCloseTo(100, 1);

    for (let i = 1; i < intervals.length; i += 1) {
      expect(intervals[i]?.start).toBeCloseTo(intervals[i - 1]?.end ?? 0, 4);
    }
  });

  it('handles edge cases and clamped progress in findActiveChar', () => {
    expect(findActiveChar([], 50)).toEqual({ char: 'e', t: 0.5 });
    const intervals = buildCharIntervals('abc');
    const atZero = findActiveChar(intervals, -10);
    expect(atZero.char).toBe('a');
    expect(atZero.t).toBe(0);

    const atEnd = findActiveChar(intervals, 110);
    expect(atEnd.char).toBe('c');
    expect(atEnd.t).toBe(1.0);

    const zeroSpan = findActiveChar([{ char: 'x', start: 10, end: 10 }], 10);
    expect(zeroSpan.char).toBe('x');
    expect(zeroSpan.t).toBe(0.5);
  });
});

describe('quillTrajectory - Strokes and Coordinates', () => {
  it('tracks ascender and descender letters accurately', () => {
    const peak = getCharacterStroke('l', 0.35);
    expect(peak.y).toBeCloseTo(LETTER_METRICS.ascender, -1);
    expect(peak.down).toBe(false);

    const downstroke = getCharacterStroke('l', 0.6);
    expect(downstroke.down).toBe(true);
    expect(downstroke.y).toBeLessThan(LETTER_METRICS.ascender);
    expect(downstroke.y).toBeGreaterThan(LETTER_METRICS.baseline);

    const dip = getCharacterStroke('g', 0.65);
    expect(dip.y).toBeLessThan(LETTER_METRICS.baseline);
    expect(dip.y).toBeGreaterThanOrEqual(LETTER_METRICS.descender);

    const ascenderExit = getCharacterStroke('l', 0.9);
    expect(ascenderExit.down).toBe(false);
    expect(ascenderExit.y).toBeGreaterThanOrEqual(LETTER_METRICS.baseline);

    const descenderUpEarly = getCharacterStroke('g', 0.1);
    expect(descenderUpEarly.down).toBe(false);

    const descenderUpLate = getCharacterStroke('g', 0.25);
    expect(descenderUpLate.down).toBe(true);

    const descenderPlungeEarly = getCharacterStroke('g', 0.45);
    expect(descenderPlungeEarly.down).toBe(true);

    const exit = getCharacterStroke('g', 0.95);
    expect(exit.y).toBeGreaterThanOrEqual(LETTER_METRICS.baseline);
    expect(exit.down).toBe(false);
  });
});

describe('quillTrajectory - Median and Coordinates', () => {
  it('tracks median, multi-arch, and space strokes', () => {
    const peak = getCharacterStroke('e', 0.45);
    expect(peak.y).toBeCloseTo(LETTER_METRICS.median, 0);

    const loopStart = getCharacterStroke('e', 0.2);
    expect(loopStart.down).toBe(false);

    const loopExit = getCharacterStroke('e', 0.9);
    expect(loopExit.down).toBe(false);

    const baselinePass = getCharacterStroke('e', 0.8);
    expect(baselinePass.y).toBeCloseTo(LETTER_METRICS.baseline, 0);
  });

  it('tracks multi-arch, digit, and space strokes', () => {
    const mStart = getCharacterStroke('m', 0.15);
    expect(mStart.y).toBeGreaterThan(LETTER_METRICS.baseline);
    expect(mStart.y).toBeLessThanOrEqual(LETTER_METRICS.median);

    const nStroke = getCharacterStroke('n', 0.5);
    expect(nStroke.y).toBeGreaterThanOrEqual(LETTER_METRICS.baseline);

    const mDown = getCharacterStroke('m', 0.4);
    expect(mDown.down).toBe(true);

    const digitAscender = getCharacterStroke('7', 0.3);
    expect(digitAscender.y).toBeGreaterThan(LETTER_METRICS.baseline);

    const upperAscender = getCharacterStroke('Z', 0.3);
    expect(upperAscender.y).toBeGreaterThan(LETTER_METRICS.baseline);

    const zeroProgress = calculateQuillTrajectory('active zero', 0, true);
    expect(zeroProgress.isDownstroke).toBe(false);

    const downPoint = calculateQuillTrajectory('l', 60, true);
    expect(downPoint.tiltAngle).toBe(-14);
    expect(downPoint.isDownstroke).toBe(true);

    const spaceLift = getCharacterStroke(' ', 0.5);
    expect(spaceLift.y).toBeGreaterThan(LETTER_METRICS.baseline + 6);
    expect(spaceLift.down).toBe(false);
  });
});

describe('quillTrajectory - Trajectory Coordinates & Styling', () => {
  it('shifts slant offset and computes trajectory coordinates', () => {
    const ascenderSlant = calculateSlantOffset(LETTER_METRICS.ascender);
    const baselineSlant = calculateSlantOffset(LETTER_METRICS.baseline);
    const descenderSlant = calculateSlantOffset(LETTER_METRICS.descender);

    expect(ascenderSlant).toBeGreaterThan(0);
    expect(baselineSlant).toBeCloseTo(0, 5);
    expect(descenderSlant).toBeLessThan(0);

    const resting = calculateQuillTrajectory('fluid interactions', 0, false);
    expect(resting.tiltAngle).toBe(-8);
    expect(resting.isDownstroke).toBe(false);
    expect(resting.verticalPercent).toBe(LETTER_METRICS.baseline + 6);

    const activePoint = calculateQuillTrajectory('elegant software', 45, true);
    expect(activePoint.left).toContain('45%');
    expect(activePoint.bottom).toContain('%');
    expect(activePoint.tiltAngle).toBeLessThan(0);
    expect(typeof activePoint.verticalPercent).toBe('number');
    expect(typeof activePoint.isDownstroke).toBe('boolean');
  });

  it('sets nib styling properties safely on HTML elements', () => {
    const store = new Map<string, string>();
    const mockEl = {
      style: {
        setProperty: (k: string, v: string) => store.set(k, v),
      },
    } as unknown as HTMLSpanElement;

    applyNibStyle(
      mockEl,
      { left: '20px', bottom: '10px', tiltAngle: -5 },
      'var(--accent)'
    );
    expect(store.get('--ticker-nib-left')).toBe('20px');
    expect(store.get('--ticker-nib-bottom')).toBe('10px');
    expect(store.get('--ticker-nib-tilt')).toBe('-5deg');
    expect(store.get('--ticker-nib-color')).toBe('var(--accent)');
    expect(() =>
      applyNibStyle(null, { left: '0', bottom: '0', tiltAngle: 0 })
    ).not.toThrow();
  });
});
