import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as React from 'react';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { useSeasonPointer } from '../../src/components/organisms/SeasonBackground/useSeasonPointer.ts';
import type { MouseState } from '../../src/components/organisms/SeasonBackground/SeasonBackground.types.ts';

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

let listeners: Record<string, (e: unknown) => void> = {};

beforeEach(() => {
  listeners = {};
  vi.stubGlobal('window', {
    addEventListener: vi.fn((event: string, handler: (e: unknown) => void) => {
      listeners[event] = handler;
    }),
    removeEventListener: vi.fn((event: string) => {
      delete listeners[event];
    }),
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('useSeasonPointer - Interactive Move Tracking', () => {
  it('tracks window mouse move events when interactive is true', () => {
    const mockContainer = {
      getBoundingClientRect: vi.fn().mockReturnValue({
        left: 0,
        top: 0,
        width: 1000,
        height: 600,
      }),
    } as unknown as HTMLDivElement;

    const mouseStateRef = {
      current: {
        x: 0,
        y: 0,
        targetX: 0,
        targetY: 0,
        speedX: 0,
        speedY: 0,
      } as MouseState,
    };

    const cleanup = runHook(() => {
      useSeasonPointer({
        interactive: true,
        containerRef: { current: mockContainer },
        mouseStateRef,
      });
    });

    listeners.mousemove?.({ clientX: 800, clientY: 400 });
    expect(mouseStateRef.current.targetX).toBe(800);
    expect(mouseStateRef.current.targetY).toBe(400);
    cleanup();
  });
});

describe('useSeasonPointer - Null Container State', () => {
  it('safely handles mousemove when containerRef.current is null', () => {
    const mouseStateRef = {
      current: {
        x: 0,
        y: 0,
        targetX: 0,
        targetY: 0,
        speedX: 0,
        speedY: 0,
      } as MouseState,
    };

    const cleanup = runHook(() => {
      useSeasonPointer({
        interactive: true,
        containerRef: { current: null },
        mouseStateRef,
      });
    });

    listeners.mousemove?.({ clientX: 500, clientY: 300 });
    expect(mouseStateRef.current.targetX).toBe(0);
    cleanup();
  });
});

describe('useSeasonPointer - Window Undefined', () => {
  it('safely returns without attaching listeners when window is undefined', () => {
    vi.stubGlobal('window', undefined);
    const mouseStateRef = {
      current: {
        x: 0,
        y: 0,
        targetX: 0,
        targetY: 0,
        speedX: 0,
        speedY: 0,
      } as MouseState,
    };

    runHook(() => {
      useSeasonPointer({
        interactive: true,
        containerRef: { current: null },
        mouseStateRef,
      });
    });
    expect(mouseStateRef.current.targetX).toBe(0);
  });
});

describe('useSeasonPointer - Non-Interactive Mode', () => {
  it('ignores window mouse move events when interactive is false', () => {
    const mouseStateRef = {
      current: {
        x: 0,
        y: 0,
        targetX: 0,
        targetY: 0,
        speedX: 0,
        speedY: 0,
      } as MouseState,
    };

    const cleanup = runHook(() => {
      useSeasonPointer({
        interactive: false,
        containerRef: { current: null },
        mouseStateRef,
      });
    });

    listeners.mousemove?.({ clientX: 500, clientY: 500 });
    expect(mouseStateRef.current.targetX).toBe(0);
    cleanup();
  });
});
