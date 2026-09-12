import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as React from 'react';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  useVisibleText,
  useTickerState,
  usePrefersReducedMotion,
  useFadeAnimation,
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

describe('useHeroTickerAnimation - Text & Motion', () => {
  it('slices text based on type mode and handles reduced motion queries', () => {
    let t1 = '';
    let t2 = '';
    runHook(() => {
      t1 = useVisibleText('cursive-type', 'alpha', 2, false);
      t2 = useVisibleText('cursive-draw', 'alpha', 2, false);
    });
    expect(t1).toBe('al');
    expect(t2).toBe('alpha');

    (globalThis as unknown as { window: unknown }).window = {};
    let reduced = false;
    runHook(() => {
      reduced = usePrefersReducedMotion();
    });
    expect(reduced).toBe(false);

    let listener: ((e: MediaQueryListEvent) => void) | null = null;
    const removeListener = vi.fn();
    (globalThis as unknown as { window: unknown }).window = {
      matchMedia: (q: string) => ({
        matches: false,
        media: q,
        addEventListener: (_: string, l: (e: MediaQueryListEvent) => void) => {
          listener = l;
        },
        removeEventListener: removeListener,
      }),
    };
    const cleanup = runHook(() => {
      reduced = usePrefersReducedMotion();
    });
    listener?.({ matches: true } as MediaQueryListEvent);
    cleanup();
    expect(removeListener).toHaveBeenCalled();
  });
});

describe('useHeroTickerAnimation - Ticker State', () => {
  it('manages index navigation, hover, and pause state', () => {
    let api: ReturnType<typeof useTickerState> | null = null;
    const onChange = vi.fn();
    runHook(() => {
      api = useTickerState(['A', 'B'], onChange);
    });
    expect(onChange).toHaveBeenCalledWith(0, 'A');
    if (!api) return;
    const state = api as ReturnType<typeof useTickerState>;
    state.goToNext();
    state.goToPrev();
    state.goToIndex(1);
    state.onPauseComplete();
    state.onDrawComplete();
    state.setIsHovered(true);
    state.setIsPausedManually(true);
    state.togglePause();

    runHook(() => {
      useTickerState([]);
    });
  });
});

describe('useHeroTickerAnimation - Fade Animation', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('handles drawing, paused, erasing, and cancellation', () => {
    const onIn = vi.fn();
    const onOut = vi.fn();
    const opts = {
      enabled: true,
      pauseDuration: 50,
      isPaused: false,
      onFadeInComplete: onIn,
      onPauseComplete: vi.fn(),
      onFadeOutComplete: onOut,
    };

    runHook(() => {
      useFadeAnimation({ ...opts, isPaused: true });
    });

    const c1 = runHook(() => {
      useFadeAnimation({ ...opts, phase: 'drawing' });
    });
    vi.advanceTimersByTime(350);
    c1();
    expect(onIn).toHaveBeenCalled();

    const c2 = runHook(() => {
      useFadeAnimation({ ...opts, phase: 'paused' });
    });
    c2();

    const c3 = runHook(() => {
      useFadeAnimation({ ...opts, phase: 'erasing' });
    });
    vi.advanceTimersByTime(300);
    c3();
    expect(onOut).toHaveBeenCalled();
  });
});
