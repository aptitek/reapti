import { describe, it, expect } from 'vitest';
import {
  getDomCanopyMetrics,
  getCssFallbackCanopyMetrics,
  getCanopyMetrics,
  calculateCanopyOrigin,
  getCanopyCenter,
} from '../../src/components/organisms/SeasonBackground/seasonCanopyMetrics.ts';

describe('seasonCanopyMetrics - Fallbacks & Geometry', () => {
  it('calculates CSS fallback canopy metrics for wide and narrow viewports', () => {
    const wide = getCssFallbackCanopyMetrics(1200, 800);
    expect(wide.center.x).toBeGreaterThan(0);
    expect(wide.center.y).toBeGreaterThan(0);
    expect(wide.radiusX).toBeGreaterThan(0);
    expect(wide.radiusY).toBeGreaterThan(0);

    const narrow = getCssFallbackCanopyMetrics(600, 800);
    expect(narrow.center.x).toBeGreaterThan(0);
  });

  it('calculates canopy origin and center', () => {
    const origin = calculateCanopyOrigin(1000, 700);
    expect(origin.x).toBeGreaterThan(0);
    expect(origin.y).toBeGreaterThan(0);

    const center = getCanopyCenter(1000, 700);
    expect(center.x).toBeGreaterThan(0);
  });
});

describe('seasonCanopyMetrics - DOM Evaluation', () => {
  it('safely evaluates DOM canopy metrics or falls back to CSS', () => {
    const invalidMetrics = getDomCanopyMetrics({} as HTMLElement);
    expect(invalidMetrics).toBeNull();

    const mockContainer = {
      getBoundingClientRect: () => ({
        left: 100,
        top: 50,
        width: 1000,
        height: 700,
      }),
      querySelector: (sel: string) => {
        if (sel === '.tree-swaying-canopy') {
          return {
            getBoundingClientRect: () => ({
              left: 150,
              top: 120,
              width: 300,
              height: 250,
            }),
          };
        }
        return null;
      },
    } as unknown as HTMLElement;

    const domMetrics = getDomCanopyMetrics(mockContainer);
    expect(domMetrics).not.toBeNull();
    expect(domMetrics?.center.x).toBe(150 - 100 + 150);

    const mockTree = {
      getBoundingClientRect: () => ({
        left: 100,
        top: 50,
        width: 1000,
        height: 700,
      }),
      querySelector: (sel: string) => {
        if (sel === '#peacefulTreeContainer') {
          return {
            getBoundingClientRect: () => ({
              left: 120,
              top: 100,
              width: 200,
              height: 300,
            }),
          };
        }
        return null;
      },
    } as unknown as HTMLElement;

    expect(getDomCanopyMetrics(mockTree)).not.toBeNull();
    expect(getCanopyMetrics(800, 600, null).radiusX).toBeGreaterThan(0);
    expect(getCanopyMetrics(800, 600, mockContainer)).toEqual(domMetrics);
  });
});
