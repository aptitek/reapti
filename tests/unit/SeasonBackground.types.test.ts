import { describe, it, expect } from 'vitest';
import type {
  SeasonBackgroundProps,
  SolarizedBackgroundProps,
  SolarizedThemeMode,
  SolarizedSeason,
  LeafColors,
  Point2D,
  MouseState,
  WindState,
  SeasonTransitionState,
} from '../../src/components/organisms/SeasonBackground/SeasonBackground.types.ts';

describe('SeasonBackground Props Contracts', () => {
  it('allows valid SeasonBackgroundProps configurations', () => {
    const props: SeasonBackgroundProps = {
      mode: 'dark',
      season: 'winter',
      seasonProgress: 3.2,
      interactive: false,
      showTree: true,
      showHills: true,
      showCelestial: true,
      showClouds: true,
      showGodrays: false,
      showAurora: true,
      showGrass: true,
      leafCount: 30,
      windIntensity: 1.2,
      dataTestId: 'custom-bg',
      skySpace: '24%',
      treeTopSpacing: 120,
      treeTopSpace: 0.2,
    };
    expect(props.mode).toBe('dark');
    expect(props.season).toBe('winter');
    expect(props.skySpace).toBe('24%');
    expect(props.treeTopSpacing).toBe(120);
    expect(props.treeTopSpace).toBe(0.2);
  });

  it('supports SolarizedBackgroundProps alias and types', () => {
    const aliasProps: SolarizedBackgroundProps = {
      mode: 'sunset',
      season: 'spring',
    };
    const mode: SolarizedThemeMode = 'dark';
    const season: SolarizedSeason = 'fall';
    expect(aliasProps.mode).toBe('sunset');
    expect(mode).toBe('dark');
    expect(season).toBe('fall');
  });
});

describe('SeasonBackground Math Contracts', () => {
  it('validates math and point interfaces', () => {
    const p: Point2D = { x: 10, y: 20 };
    const mouse: MouseState = {
      x: 10,
      y: 20,
      targetX: 10,
      targetY: 20,
      speedX: 0,
      speedY: 0,
    };
    expect(p.x).toBe(10);
    expect(mouse.targetX).toBe(10);
  });

  it('validates wind, transition, and color interfaces', () => {
    const wind: WindState = {
      baseSpeedX: 1,
      baseSpeedY: 0,
      currentX: 1,
      currentY: 0,
      gustBoost: 0,
    };
    const transition: SeasonTransitionState = {
      fromIndex: 0,
      toIndex: 1,
      blendFactor: 0.5,
    };
    const colors: LeafColors = {
      vein: '#fff',
      leftTop: '#fff',
      leftMid: '#fff',
      leftBottom: '#fff',
      rightTop: '#fff',
      rightMid: '#fff',
      rightBottom: '#fff',
    };
    expect(wind.baseSpeedX).toBe(1);
    expect(transition.blendFactor).toBe(0.5);
    expect(colors.vein).toBe('#fff');
  });
});
