import { describe, it, expect, vi } from 'vitest';
import {
  LeafParticle,
  WindBreezeStream,
  getSeasonalParticleType,
  getWinterSpringParticle,
} from '../../src/components/organisms/SeasonBackground/SeasonLeafRenderer.ts';
import type {
  MouseState,
  WindState,
} from '../../src/components/organisms/SeasonBackground/SeasonBackground.types.ts';

function createMockContext(): CanvasRenderingContext2D {
  return {
    save: vi.fn(),
    restore: vi.fn(),
    translate: vi.fn(),
    rotate: vi.fn(),
    scale: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    bezierCurveTo: vi.fn(),
    quadraticCurveTo: vi.fn(),
    closePath: vi.fn(),
    fill: vi.fn(),
    stroke: vi.fn(),
    arc: vi.fn(),
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 1,
    lineCap: 'round',
    globalAlpha: 1,
    createLinearGradient: vi.fn().mockReturnValue({
      addColorStop: vi.fn(),
    }),
  } as unknown as CanvasRenderingContext2D;
}

describe('SeasonLeafRenderer - Particle Types & Physics', () => {
  it('correctly resolves winter to spring particle types', () => {
    expect(getWinterSpringParticle(3.1, 0.5)).toBe('snowflake');
    expect(getWinterSpringParticle(3.2, 0.8)).toBe('snowflake');
    expect(getWinterSpringParticle(3.8, 0.1)).toBe('petal');
    expect(getWinterSpringParticle(3.8, 0.9)).toBe('snowflake');
  });

  it('determines particle types across the entire annual cycle', () => {
    expect(getSeasonalParticleType(3.0, 0.5)).toBe('snowflake');
    expect(getSeasonalParticleType(0.0, 0.5)).toBe('petal');
    expect(getSeasonalParticleType(0.5, 0.1)).toBe('petal');
    expect(getSeasonalParticleType(0.5, 0.9)).toBe('leaf');
    expect(getSeasonalParticleType(1.0, 0.5)).toBe('leaf');
    expect(getSeasonalParticleType(2.0, 0.5)).toBe('leaf');
    expect(getSeasonalParticleType(2.7, 0.1)).toBe('snowflake');
    expect(getSeasonalParticleType(2.7, 0.9)).toBe('leaf');
  });

  it('initializes, updates, and resets LeafParticle with wind and mouse physics', () => {
    const leaf = new LeafParticle(true, { x: 1440, y: 900 });
    expect(leaf.x).toBeGreaterThan(0);
    expect(leaf.y).toBeGreaterThan(0);

    const wind: WindState = {
      baseSpeedX: 1.0,
      baseSpeedY: 0,
      currentX: 1.2,
      currentY: 0,
      gustBoost: 0.2,
    };
    const mouse: MouseState = {
      x: leaf.x + 10,
      y: leaf.y + 10,
      targetX: leaf.x + 10,
      targetY: leaf.y + 10,
      speedX: 0,
      speedY: 0,
    };

    const initialX = leaf.x;
    leaf.update({ windState: wind, mouseState: mouse }, { x: 1440, y: 900 });
    expect(leaf.x).not.toBe(initialX);

    leaf.x = 2000;
    leaf.update({ windState: wind, mouseState: mouse }, { x: 1440, y: 900 });
    expect(leaf.x).toBeLessThan(1000);

    const spawnedLeaf = new LeafParticle(
      false,
      { x: 800, y: 600 },
      { x: 200, y: 300 }
    );
    expect(spawnedLeaf.x).toBeCloseTo(200, -2);
  });

  it('draws leaf particle across petal, snowflake, and leaf variants', () => {
    const ctx = createMockContext();
    const leaf = new LeafParticle(true, { x: 1440, y: 900 });

    expect(() => leaf.draw(ctx, false, 0.0)).not.toThrow();
    expect(() => leaf.draw(ctx, false, 3.0)).not.toThrow();
    expect(() => leaf.draw(ctx, false, 1.0)).not.toThrow();
    expect(() => leaf.draw(ctx, true, 2.0)).not.toThrow();
  });
});

describe('SeasonLeafRenderer - Wind Streams', () => {
  it('initializes, updates, and draws WindBreezeStream', () => {
    const ctx = createMockContext();
    const stream = new WindBreezeStream(1440, 900);
    expect(stream.length).toBeGreaterThan(50);

    const windRight: WindState = {
      baseSpeedX: 1.0,
      baseSpeedY: 0,
      currentX: 1.0,
      currentY: 0,
      gustBoost: 0.1,
    };
    stream.update(windRight, 1440, 900);
    expect(() => stream.draw(ctx, false)).not.toThrow();
    expect(() => stream.draw(ctx, true)).not.toThrow();

    const windLeft: WindState = {
      baseSpeedX: 1.0,
      baseSpeedY: 0,
      currentX: -1.0,
      currentY: 0,
      gustBoost: 0.1,
    };
    stream.update(windLeft, 1440, 900);

    stream.x = 5000;
    stream.update(windRight, 1440, 900);
    expect(stream.x).toBeLessThan(2000);

    const leftStream = new WindBreezeStream(800, 600, {
      windState: windLeft,
      isInitial: false,
    });
    expect(leftStream.x).toBeGreaterThan(800);
  });
});
