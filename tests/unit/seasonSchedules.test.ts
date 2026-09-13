import { describe, it, expect } from 'vitest';
import {
  CANOPY_BUD_THRESHOLDS,
  getCanopyClusterFill,
  SPRING_FLOWER_SCHEDULES,
  SPRING_PETAL_SCHEDULES,
  getFlowerBloomFactor,
} from '../../src/components/organisms/SeasonBackground/seasonSchedules.ts';

describe('seasonSchedules Module', () => {
  it('exposes canopy bud thresholds and returns correct canopy fills', () => {
    expect(CANOPY_BUD_THRESHOLDS).toHaveLength(17);

    // Spring (0.0): all clusters use spring cherry blossom fills
    expect(getCanopyClusterFill(0, 'grad1', 0.0)).toBe(
      'url(#treeCanopyGrad1Spring)'
    );
    expect(getCanopyClusterFill(0, 'grad2', 0.0)).toBe(
      'url(#treeCanopyGrad2Spring)'
    );
    expect(getCanopyClusterFill(0, 'warm', 0.0)).toBe(
      'url(#treeCanopyWarmSpring)'
    );

    // Mid-spring: index 0 threshold is 0.18, so at 0.5 it is green (Summer)
    expect(getCanopyClusterFill(0, 'grad1', 0.5)).toBe(
      'url(#treeCanopyGrad1Summer)'
    );
    expect(getCanopyClusterFill(0, 'grad2', 0.5)).toBe(
      'url(#treeCanopyGrad2Summer)'
    );
    expect(getCanopyClusterFill(0, 'warm', 0.5)).toBe(
      'url(#treeCanopyWarmSummer)'
    );

    // Fallback cluster index threshold test
    expect(getCanopyClusterFill(999, 'grad1', 0.6)).toBe(
      'url(#treeCanopyGrad1Summer)'
    );
    expect(getCanopyClusterFill(999, 'grad1', 0.4)).toBe(
      'url(#treeCanopyGrad1Spring)'
    );

    // Beyond progress >= 1.0 (Summer/Fall/Winter)
    expect(getCanopyClusterFill(0, 'grad1', 1.0)).toBe('url(#treeCanopyGrad1)');
    expect(getCanopyClusterFill(0, 'grad2', 2.0)).toBe('url(#treeCanopyGrad2)');
    expect(getCanopyClusterFill(0, 'warm', 3.0)).toBe('url(#treeCanopyWarm)');
  });

  it('calculates flower bloom factors in winter and spring thaw', () => {
    expect(SPRING_FLOWER_SCHEDULES).toHaveLength(20);
    expect(SPRING_PETAL_SCHEDULES).toHaveLength(17);

    const schedule = { bloomIn: 3.4, bloomOut: 0.4 };
    // Winter into spring thaw: progress >= 3.0
    // Before bloomIn: 0
    expect(getFlowerBloomFactor(3.1, schedule)).toBe(0);
    // During ramp: (3.42 - 3.40) / 0.04 = 0.5
    expect(getFlowerBloomFactor(3.42, schedule)).toBeCloseTo(0.5);
    // Fully bloomed: 1
    expect(getFlowerBloomFactor(3.5, schedule)).toBe(1);
  });

  it('calculates flower bloom factors in spring into summer and non-spring', () => {
    const schedule = { bloomIn: 3.4, bloomOut: 0.4 };
    // Spring into summer: progress < 1.0
    // Fully bloomed before bloomOut: 1
    expect(getFlowerBloomFactor(0.2, schedule)).toBe(1);
    // Fading out during ramp: 1 - (0.42 - 0.4) / 0.04 = 0.5
    expect(getFlowerBloomFactor(0.42, schedule)).toBeCloseTo(0.5);
    // Fully faded: 0
    expect(getFlowerBloomFactor(0.5, schedule)).toBe(0);

    // Deep summer / fall: 1.0 <= progress < 3.0 -> always 0
    expect(getFlowerBloomFactor(1.5, schedule)).toBe(0);
    expect(getFlowerBloomFactor(2.5, schedule)).toBe(0);
  });
});
