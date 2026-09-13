import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as React from 'react';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  useSeasonCanvas,
  computeTargetWindVector,
} from '../../src/components/organisms/SeasonBackground/useSeasonCanvas.ts';
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
    clearRect: vi.fn(),
    createLinearGradient: vi.fn().mockReturnValue({ addColorStop: vi.fn() }),
  } as unknown as CanvasRenderingContext2D;
}

function createMockEnv(
  w = 800,
  h = 600,
  ctx: CanvasRenderingContext2D | null = createMockContext()
) {
  return {
    ctx,
    canvas: {
      width: 0,
      height: 0,
      getContext: vi.fn().mockReturnValue(ctx),
    } as unknown as HTMLCanvasElement,
    container: {
      clientWidth: w,
      clientHeight: h,
      querySelector: vi.fn(),
    } as unknown as HTMLDivElement,
  };
}

function runHook(runner: () => void): () => void {
  const internals = (
    React as unknown as {
      __CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE?: {
        H?: { useEffect?: (eff: () => (() => void) | void) => void };
      };
    }
  ).__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  const cleanups: (() => void)[] = [];
  function Probe() {
    if (internals?.H) {
      internals.H.useEffect = (eff) => {
        const cleanup = eff();
        if (typeof cleanup === 'function') cleanups.push(cleanup);
      };
    }
    runner();
    return null;
  }
  renderToStaticMarkup(createElement(Probe));
  return () => cleanups.forEach((c) => c());
}

let tickCallbacks: (() => void)[] = [];
let resizeCallbacks: ((entries: unknown[]) => void)[] = [];

beforeEach(() => {
  tickCallbacks = [];
  resizeCallbacks = [];
  vi.stubGlobal('requestAnimationFrame', (cb: () => void) => {
    tickCallbacks.push(cb);
    return 101;
  });
  vi.stubGlobal('cancelAnimationFrame', vi.fn());
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe = vi.fn();
      disconnect = vi.fn();
      constructor(cb: (entries: unknown[]) => void) {
        resizeCallbacks.push(cb);
      }
    }
  );
  vi.stubGlobal('window', {
    matchMedia: vi.fn().mockReturnValue({ matches: false }),
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('useSeasonCanvas - Hook Lifecycle', () => {
  it('initializes canvas context, registers animation tick and cleans up', () => {
    const env = createMockEnv(0, 0);
    const mouseStateRef = {
      current: {
        x: 50,
        y: 50,
        targetX: 50,
        targetY: 50,
        speedX: 0,
        speedY: 0,
      } as MouseState,
    };
    const windStateRef = {
      current: {
        baseSpeedX: 1,
        baseSpeedY: 0,
        currentX: 1,
        currentY: 0,
        gustBoost: 0,
      } as WindState,
    };

    const cleanup = runHook(() => {
      useSeasonCanvas({
        canvasRef: { current: env.canvas },
        containerRef: { current: env.container },
        leafCount: 15,
        windIntensity: 1.0,
        isDarkMode: false,
        mouseStateRef,
        windStateRef,
        seasonProgress: 1.2,
      });
    });

    expect(tickCallbacks.length).toBeGreaterThan(0);
    tickCallbacks[0]?.();
    expect(env.ctx!.clearRect).toHaveBeenCalled();

    resizeCallbacks[0]?.([{ contentRect: { width: 1100, height: 700 } }]);
    expect(env.canvas.width).toBe(1100);
    resizeCallbacks[0]?.([]);
    cleanup();
  });
});

describe('useSeasonCanvas - Periodic Canopy & Reduced Motion', () => {
  it('runs multiple frames hitting 60-frame canopy recalculation interval', () => {
    vi.stubGlobal('window', {
      matchMedia: vi.fn().mockReturnValue({ matches: true }),
    });
    const env = createMockEnv(800, 600);
    const cleanup = runHook(() => {
      useSeasonCanvas({
        canvasRef: { current: env.canvas },
        containerRef: { current: env.container },
        leafCount: 8,
        windIntensity: 1.0,
        isDarkMode: true,
        mouseStateRef: {
          current: { x: 0, y: 0, targetX: 0, targetY: 0, speedX: 0, speedY: 0 },
        },
        windStateRef: {
          current: {
            baseSpeedX: 1,
            baseSpeedY: 0,
            currentX: 1,
            currentY: 0,
            gustBoost: 0,
          },
        },
      });
    });

    for (let i = 0; i < 62; i++) {
      const cb = tickCallbacks[tickCallbacks.length - 1];
      cb?.();
    }
    expect(env.ctx!.clearRect).toHaveBeenCalled();
    cleanup();
  });
});

describe('useSeasonCanvas - Guard Branches', () => {
  it('handles null canvas, container, context, or null refs in tick', () => {
    const env = createMockEnv(800, 600, null);
    const valid = createMockEnv(800, 600);
    const nullMouseRef = {
      current: null,
    } as unknown as React.RefObject<MouseState>;
    const nullWindRef = {
      current: null,
    } as unknown as React.RefObject<WindState>;
    const baseOpts = { leafCount: 4, windIntensity: 1, isDarkMode: false };

    runHook(() =>
      useSeasonCanvas({
        ...baseOpts,
        canvasRef: { current: null },
        containerRef: { current: valid.container },
        mouseStateRef: nullMouseRef,
        windStateRef: nullWindRef,
      })
    );
    runHook(() =>
      useSeasonCanvas({
        ...baseOpts,
        canvasRef: { current: valid.canvas },
        containerRef: { current: null },
        mouseStateRef: nullMouseRef,
        windStateRef: nullWindRef,
      })
    );
    runHook(() =>
      useSeasonCanvas({
        ...baseOpts,
        canvasRef: { current: env.canvas },
        containerRef: { current: valid.container },
        mouseStateRef: nullMouseRef,
        windStateRef: nullWindRef,
      })
    );
    const cleanup = runHook(() =>
      useSeasonCanvas({
        ...baseOpts,
        canvasRef: { current: valid.canvas },
        containerRef: { current: valid.container },
        mouseStateRef: nullMouseRef,
        windStateRef: nullWindRef,
      })
    );
    tickCallbacks[tickCallbacks.length - 1]?.();
    cleanup();
  });
});

describe('useSeasonCanvas - Utilities', () => {
  it('re-exports computeTargetWindVector math utility', () => {
    const vector = computeTargetWindVector({
      mouseState: {
        x: 100,
        y: 100,
        targetX: 100,
        targetY: 100,
        speedX: 0,
        speedY: 0,
      },
      origin: { x: 200, y: 200 },
      windIntensity: 1.0,
    });
    expect(vector.y).toBe(0);
  });
});
