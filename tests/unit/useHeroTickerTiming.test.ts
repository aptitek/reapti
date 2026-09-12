import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as React from 'react';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  useDrawAnimation,
  useTypeAnimation,
} from '../../src/components/molecules/HeroTicker/useHeroTickerAnimation.ts';

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

function fakeRaf(cb: FrameRequestCallback): number {
  return setTimeout(() => cb(Date.now()), 16) as unknown as number;
}

function fakeCaf(id: number): void {
  clearTimeout(id);
}

describe('useHeroTickerTiming - Draw Lifecycle', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('handles disabled state and pause cleanup', () => {
    const baseOpts = {
      drawSpeed: 50,
      pauseDuration: 50,
      onDrawComplete: vi.fn(),
      onPauseComplete: vi.fn(),
      onEraseComplete: vi.fn(),
    };

    runHook(() => {
      useDrawAnimation({
        ...baseOpts,
        enabled: false,
        phase: 'drawing',
        isPaused: true,
      });
    });

    const cleanPaused = runHook(() => {
      useDrawAnimation({
        ...baseOpts,
        enabled: true,
        phase: 'paused',
        isPaused: false,
      });
    });
    cleanPaused();
  });

  it('cancels active animation frame on cleanup', () => {
    const g = globalThis as unknown as {
      requestAnimationFrame?: unknown;
      cancelAnimationFrame?: unknown;
    };
    g.requestAnimationFrame = vi.fn(fakeRaf);
    g.cancelAnimationFrame = vi.fn(fakeCaf);

    const cleanDraw = runHook(() => {
      useDrawAnimation({
        drawSpeed: 50,
        pauseDuration: 50,
        onDrawComplete: vi.fn(),
        onPauseComplete: vi.fn(),
        onEraseComplete: vi.fn(),
        enabled: true,
        phase: 'drawing',
        isPaused: false,
      });
    });
    cleanDraw();
    expect(g.cancelAnimationFrame).toHaveBeenCalled();
    delete g.requestAnimationFrame;
    delete g.cancelAnimationFrame;
  });
});

describe('useHeroTickerTiming - Draw Fallback', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('steps drawing and erasing to completion using timeout fallback', () => {
    const onDraw = vi.fn();
    const onErase = vi.fn();
    const baseOpts = {
      enabled: true,
      drawSpeed: 40,
      pauseDuration: 40,
      isPaused: false,
      onPauseComplete: vi.fn(),
    };
    runHook(() => {
      useDrawAnimation({
        ...baseOpts,
        phase: 'drawing',
        onDrawComplete: onDraw,
        onEraseComplete: onErase,
      });
    });
    vi.advanceTimersByTime(100);
    expect(onDraw).toHaveBeenCalled();

    runHook(() => {
      useDrawAnimation({
        ...baseOpts,
        phase: 'erasing',
        onDrawComplete: onDraw,
        onEraseComplete: onErase,
      });
    });
    vi.advanceTimersByTime(300);
    expect(onErase).toHaveBeenCalled();
  });
});

describe('useHeroTickerTiming - Typing Lifecycle', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('handles pause, typing steps, and cleanup timers', () => {
    const onType = vi.fn();
    const opts = {
      enabled: true,
      phraseLength: 3,
      typeSpeed: 30,
      eraseSpeed: 30,
      pauseDuration: 50,
      isPaused: false,
      onTypeComplete: onType,
      onPauseComplete: vi.fn(),
      onEraseComplete: vi.fn(),
    };

    runHook(() => {
      useTypeAnimation({ ...opts, enabled: false });
    });
    const cleanPaused = runHook(() => {
      useTypeAnimation({ ...opts, phase: 'paused' });
    });
    cleanPaused();

    const cleanType = runHook(() => {
      useTypeAnimation({ ...opts, phase: 'drawing' }, 1);
    });
    vi.advanceTimersByTime(35);
    cleanType();

    runHook(() => {
      useTypeAnimation({ ...opts, phase: 'drawing', phraseLength: 1 }, 1);
    });
    expect(onType).toHaveBeenCalled();
  });
});

describe('useHeroTickerTiming - Erasing Lifecycle', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('steps erase timer and completes when empty', () => {
    const onErase = vi.fn();
    const opts = {
      enabled: true,
      phase: 'erasing' as const,
      phraseLength: 3,
      typeSpeed: 30,
      eraseSpeed: 30,
      pauseDuration: 50,
      isPaused: false,
      onTypeComplete: vi.fn(),
      onPauseComplete: vi.fn(),
      onEraseComplete: onErase,
    };

    const cleanErase = runHook(() => {
      useTypeAnimation(opts, 2);
    });
    vi.advanceTimersByTime(35);
    cleanErase();

    runHook(() => {
      useTypeAnimation(opts, 0);
    });
    expect(onErase).toHaveBeenCalled();
  });
});
