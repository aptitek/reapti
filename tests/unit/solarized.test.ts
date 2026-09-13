import { describe, it, expect } from 'vitest';
import {
  SOLARIZED_BASE_COLORS,
  BOTANICAL_COLORS,
  PASTEL_SKY_COLORS,
  CELESTIAL_COLORS,
  PROGRESS_THEME_COLORS,
  SEASON_COLORS,
  SEASON_NIGHT_COLORS,
} from '../../src/tokens/solarized.ts';

describe('Solarized and Seasonal Tokens', () => {
  it('defines canonical base solarized palette', () => {
    expect(SOLARIZED_BASE_COLORS.base03).toBe('#002b36');
    expect(SOLARIZED_BASE_COLORS.base3).toBe('#fdf6e3');
    expect(SOLARIZED_BASE_COLORS.green).toBe('#859900');
    expect(SOLARIZED_BASE_COLORS.blue).toBe('#268bd2');
    expect(SOLARIZED_BASE_COLORS.yellow).toBe('#b58900');
  });

  it('defines botanical and sky tones', () => {
    expect(BOTANICAL_COLORS.leafVeinDark).toBe('#1f4e2b');
    expect(BOTANICAL_COLORS.grassBladeLight).toBe('#a6bd1a');
    expect(PASTEL_SKY_COLORS.zenith).toBe('#fdf8f0');
    expect(PASTEL_SKY_COLORS.pastelPink).toBe('#f5cad3');
  });

  it('defines celestial sun and moon tones', () => {
    expect(CELESTIAL_COLORS.sun.main).toBe('#b58900');
    expect(CELESTIAL_COLORS.sun.goldenHourCore).toBe('#fff3cc');
    expect(CELESTIAL_COLORS.moon.main).toBe('#268bd2');
    expect(CELESTIAL_COLORS.moon.aura).toContain('rgba');
  });

  it('defines progress theme spectrum', () => {
    expect(PROGRESS_THEME_COLORS.purple).toBe('#6c71c4');
    expect(PROGRESS_THEME_COLORS.orange).toBe('#cb4b16');
  });

  it('defines all 4 seasonal daylight color sets', () => {
    expect(SEASON_COLORS.spring.blossom).toBe('#fbb1bd');
    expect(SEASON_COLORS.summer.canopyA).toBe('#859900');
    expect(SEASON_COLORS.fall.foliageOrange).toBe('#d35400');
    expect(SEASON_COLORS.winter.snowWhite).toBe('#f8fcfd');
  });

  it('defines nocturnal dark mode seasonal palettes', () => {
    expect(SEASON_NIGHT_COLORS.spring.canopyA).toBe('#5a283c');
    expect(SEASON_NIGHT_COLORS.summer.canopyA).toBe('#1b4324');
    expect(SEASON_NIGHT_COLORS.fall.foliageGold).toBe('#8a4210');
    expect(SEASON_NIGHT_COLORS.winter.snowWhite).toBe('#d8eef2');
  });
});
