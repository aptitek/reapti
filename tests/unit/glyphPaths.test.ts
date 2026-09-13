import { describe, it, expect } from 'vitest';
import {
  AIRPLANE_PATH,
  BADGE_PATH,
  DOOR_CLOSED_PATH,
  DOOR_OPEN_PATH,
  FRANCE_MAP_PATH,
  HOUSE_PATH,
  LAPTOP_PATH,
  LOCK_CLOSED_PATH,
  LOCK_OPEN_PATH,
  MOON_PATH,
  NFC_PATH,
  PEDESTRIAN_PATH,
  PIN_PATH,
  SCHOOL_PATH,
  SUN_PATH,
  UK_MAP_PATH,
} from '../../src/components/molecules/FancySwitch/glyphPaths.ts';

describe('FancySwitch Glyph Paths Constants', () => {
  it('defines valid SVG path coordinates for country maps', () => {
    expect(FRANCE_MAP_PATH).toContain('M 16.1 2.8');
    expect(UK_MAP_PATH).toContain('M 16.2 2.6');
  });

  it('defines valid SVG path coordinates for celestial icons', () => {
    expect(SUN_PATH).toContain('M12 7c-2.76');
    expect(MOON_PATH).toContain('M11.01 3.05');
  });

  it('defines valid SVG path coordinates for transportation and pedestrian', () => {
    expect(AIRPLANE_PATH).toContain('M21 16v-2l-8-5');
    expect(PEDESTRIAN_PATH).toContain('M13.5 5.5');
  });

  it('defines valid SVG path coordinates for attendance and access control', () => {
    expect(PIN_PATH).toContain('M12 2C8.13');
    expect(LAPTOP_PATH).toContain('M20 18c1.1');
    expect(LOCK_CLOSED_PATH).toContain('M18 8h-1V6');
    expect(LOCK_OPEN_PATH).toContain('M12 13c-1.1');
    expect(DOOR_CLOSED_PATH).toContain('M19 19V5');
    expect(DOOR_OPEN_PATH).toContain('M19 19V4');
    expect(BADGE_PATH).toContain('M20 7h-5');
    expect(NFC_PATH).toContain('M12 2C6.48');
    expect(HOUSE_PATH).toContain('M10 20v-6');
    expect(SCHOOL_PATH).toContain('M5 13.18v4');
  });
});
