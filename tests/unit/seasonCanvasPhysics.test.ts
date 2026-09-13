import { describe, it, expect, vi } from 'vitest';
import {
  computeTargetWindVector,
  stepCanvasPhysics,
  updateCanvasLeaves,
  updateCanvasStreams,
  renderSeasonCanvasFrame,
} from '../../src/components/organisms/SeasonBackground/seasonCanvasPhysics.ts';
import {
  LeafParticle,
  WindBreezeStream,
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
    stroke: vi.fn(),
    fill: vi.fn(),
    arc: vi.fn(),
    bezierCurveTo: vi.fn(),
    quadraticCurveTo: vi.fn(),
    closePath: vi.fn(),
    clearRect: vi.fn(),
    createLinearGradient: vi.fn().mockReturnValue({
      addColorStop: vi.fn(),
    }),
  } as unknown as CanvasRenderingContext2D;
}

describe('seasonCanvasPhysics - Wind Vectors', () => {
  it('computes target wind vectors based on mouse distance from canopy', () => {
    const origin = { x: 400, y: 300 };

    const toRight = computeTargetWindVector({
      mouseState: {
        x: 600,
        y: 300,
        targetX: 600,
        targetY: 300,
        speedX: 0,
        speedY: 0,
      },
      origin,
      windIntensity: 1.2,
    });
    expect(toRight.x).toBeGreaterThan(0);
    expect(toRight.y).toBe(0);

    const toLeft = computeTargetWindVector({
      mouseState: {
        x: 200,
        y: 300,
        targetX: 200,
        targetY: 300,
        speedX: 0,
        speedY: 0,
      },
      origin,
      windIntensity: 1.0,
    });
    expect(toLeft.x).toBeLessThan(0);
    expect(toLeft.y).toBe(0);

    const fallbackWind = computeTargetWindVector({
      mouseState: {
        x: 50,
        y: 50,
        targetX: 50,
        targetY: 50,
        speedX: 0,
        speedY: 0,
      },
      origin: { x: 0, y: 0 },
      windIntensity: 0,
    });
    expect(fallbackWind.x).toBeGreaterThan(0);
  });
});

describe('seasonCanvasPhysics - Step Physics', () => {
  it('updates mouse positions and decays gust boosts', () => {
    const mouse: MouseState = {
      x: 100,
      y: 100,
      targetX: 250,
      targetY: 250,
      speedX: 0,
      speedY: 0,
    };
    const wind: WindState = {
      baseSpeedX: 1.0,
      baseSpeedY: 0,
      currentX: 0.8,
      currentY: 0,
      gustBoost: 0.25,
    };

    stepCanvasPhysics({
      mouseState: mouse,
      windState: wind,
      canopyCenter: { x: 400, y: 300 },
      windIntensity: 1.0,
    });
    expect(mouse.x).toBeGreaterThan(100);
    expect(wind.gustBoost).toBeLessThan(0.35);

    mouse.targetX = mouse.x;
    mouse.targetY = mouse.y;
    wind.gustBoost = 0.005;
    stepCanvasPhysics({
      mouseState: mouse,
      windState: wind,
      canopyCenter: { x: 400, y: 300 },
      windIntensity: 1.0,
    });
    expect(wind.gustBoost).toBe(0);

    wind.gustBoost = 0;
    stepCanvasPhysics({
      mouseState: mouse,
      windState: wind,
      canopyCenter: { x: 400, y: 300 },
      windIntensity: 1.0,
    });
    expect(wind.gustBoost).toBe(0);

    wind.gustBoost = 0.3;
    stepCanvasPhysics({
      mouseState: mouse,
      windState: wind,
      canopyCenter: { x: 400, y: 300 },
      windIntensity: 1.0,
    });
    expect(wind.gustBoost).toBeGreaterThan(0.01);
  });
});

describe('seasonCanvasPhysics - Full Frame Render', () => {
  it('renders canvas frame clearing context and drawing streams and leaves', () => {
    const ctx = createMockContext();
    const streams = [new WindBreezeStream(1000, 600)];
    const leaves = [new LeafParticle(true, { x: 1000, y: 600 })];
    const wind: WindState = {
      baseSpeedX: 1,
      baseSpeedY: 0,
      currentX: 1,
      currentY: 0,
      gustBoost: 0,
    };
    const mouse: MouseState = {
      x: 200,
      y: 200,
      targetX: 200,
      targetY: 200,
      speedX: 0,
      speedY: 0,
    };

    expect(() =>
      renderSeasonCanvasFrame({
        ctx,
        viewport: { x: 1000, y: 600 },
        leaves,
        streams,
        mouseState: mouse,
        windState: wind,
        canopyOrigin: { x: 300, y: 300 },
        isDarkMode: false,
        reducedMotion: false,
        seasonProgress: 1.0,
      })
    ).not.toThrow();
    expect(ctx.clearRect).toHaveBeenCalledWith(0, 0, 1000, 600);
  });
});

describe('seasonCanvasPhysics - Reduced Motion Handling', () => {
  it('updates streams and leaves under reduced motion without stepping physics', () => {
    const ctx = createMockContext();
    const streams = [new WindBreezeStream(800, 600)];
    const leaves = [new LeafParticle(true, { x: 800, y: 600 })];

    expect(() =>
      updateCanvasStreams({
        renderContext: ctx,
        streams,
        windState: {
          baseSpeedX: 1,
          baseSpeedY: 0,
          currentX: 1,
          currentY: 0,
          gustBoost: 0,
        },
        viewport: { x: 800, y: 600 },
        isDarkMode: true,
        reducedMotion: true,
      })
    ).not.toThrow();

    expect(() =>
      updateCanvasLeaves({
        renderContext: ctx,
        leaves,
        windState: {
          baseSpeedX: 1,
          baseSpeedY: 0,
          currentX: 1,
          currentY: 0,
          gustBoost: 0,
        },
        mouseState: {
          x: 0,
          y: 0,
          targetX: 0,
          targetY: 0,
          speedX: 0,
          speedY: 0,
        },
        viewport: { x: 800, y: 600 },
        canopyOrigin: { x: 200, y: 200 },
        isDarkMode: true,
        reducedMotion: true,
        seasonProgress: 3.0,
      })
    ).not.toThrow();
  });
});
