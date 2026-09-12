import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as React from 'react';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  calculatePitchFactor,
  syncMapPitchFactor,
  execute3DTransition,
  attachMap3DTransition,
  useMap3DTransition,
  type TransitionMapTarget,
} from '../../src/components/molecules/Map/useMap3DTransition.ts';

describe('useMap3DTransition Default Behavior', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('triggers map.easeTo with default 3D pitch and bearing after delay', () => {
    const easeToMock = vi.fn();
    const mockMapRef = {
      current: { getMap: () => ({ easeTo: easeToMock }) },
    };
    execute3DTransition(mockMapRef);
    expect(easeToMock).not.toHaveBeenCalled();
    vi.advanceTimersByTime(2000);
    expect(easeToMock).toHaveBeenCalledWith({
      pitch: 55,
      bearing: -20,
      duration: 2500,
    });
  });

  it('honors custom targetPitch, targetBearing, and transitionDelayMs', () => {
    const easeToMock = vi.fn();
    const mockMapRef = {
      current: {
        getMap: () => ({
          easeTo: easeToMock,
        }),
      },
    };

    execute3DTransition(mockMapRef, {
      targetPitch: 60,
      targetBearing: -30,
      transitionDelayMs: 3000,
      transitionDurationMs: 1500,
    });

    vi.advanceTimersByTime(2999);
    expect(easeToMock).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(easeToMock).toHaveBeenCalledWith({
      pitch: 60,
      bearing: -30,
      duration: 1500,
    });
  });

  it('handles timer expiration gracefully when map or easeTo is missing', () => {
    const nullMapRef = { current: null };
    execute3DTransition(nullMapRef, { transitionDelayMs: 100 });
    expect(() => vi.advanceTimersByTime(100)).not.toThrow();

    const noEaseToMapRef = {
      current: {
        getMap: () =>
          ({}) as ReturnType<NonNullable<TransitionMapTarget['getMap']>>,
      },
    };
    execute3DTransition(noEaseToMapRef, { transitionDelayMs: 100 });
    expect(() => vi.advanceTimersByTime(100)).not.toThrow();
  });
});

describe('useMap3DTransition Execution Options', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('does not trigger easeTo when autoTransitionTo3D is false', () => {
    const easeToMock = vi.fn();
    const mockMapRef = {
      current: {
        getMap: () => ({
          easeTo: easeToMock,
        }),
      },
    };

    const cleanup = execute3DTransition(mockMapRef, {
      autoTransitionTo3D: false,
    });

    expect(cleanup).toBeUndefined();

    vi.advanceTimersByTime(5000);
    expect(easeToMock).not.toHaveBeenCalled();
  });

  it('clears timer on unmount before delay elapses', () => {
    const easeToMock = vi.fn();
    const mockMapRef = {
      current: {
        getMap: () => ({
          easeTo: easeToMock,
        }),
      },
    };

    const cleanup = execute3DTransition(mockMapRef);

    vi.advanceTimersByTime(1000);
    cleanup?.();

    vi.advanceTimersByTime(3000);
    expect(easeToMock).not.toHaveBeenCalled();
  });
});

describe('useMap3DTransition Listener Attachment', () => {
  it('attaches and cleans up map pitch event listeners via attachMap3DTransition', () => {
    const onMock = vi.fn();
    const offMock = vi.fn();
    const getPitchMock = vi.fn(() => 45);

    const mockMap = {
      on: onMock,
      off: offMock,
      getPitch: getPitchMock,
      getContainer: () => ({
        style: { setProperty: vi.fn() },
      }),
    };

    const mockMapRef = {
      current: {
        getMap: () => mockMap,
      } as TransitionMapTarget,
    };

    const cleanup = attachMap3DTransition(mockMapRef);
    expect(onMock).toHaveBeenCalledWith('pitch', expect.any(Function));
    expect(onMock).toHaveBeenCalledWith('render', expect.any(Function));

    cleanup?.();
    expect(offMock).toHaveBeenCalledWith('pitch', expect.any(Function));
    expect(offMock).toHaveBeenCalledWith('render', expect.any(Function));
  });

  it('handles attachMap3DTransition when map target lacks on/off or uses direct target', () => {
    const mockMapRef1 = {
      current: {
        getMap: () => null,
      },
    };
    expect(attachMap3DTransition(mockMapRef1)).toBeDefined();

    const directMap: TransitionMapTarget = {
      getPitch: () => 10,
    };
    const mockMapRef2 = {
      current: directMap,
    };
    expect(attachMap3DTransition(mockMapRef2)).toBeDefined();
  });
});

describe('useMap3DTransition Hook Execution', () => {
  it('invokes useMap3DTransition hook and executes effect and cleanup', () => {
    const internals = (
      React as unknown as {
        __CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE?: {
          H?: {
            useEffect?: (
              effect: () => (() => void) | void,
              deps?: unknown[]
            ) => void;
          };
        };
      }
    ).__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;

    let effectExecuted = false;
    function Probe() {
      if (internals?.H) {
        const origEffect = internals.H.useEffect;
        internals.H.useEffect = (effect, deps) => {
          const cleanup = effect();
          effectExecuted = true;
          if (typeof cleanup === 'function') cleanup();
          origEffect?.(effect, deps);
        };
      }
      const mockRef = { current: null };
      useMap3DTransition(mockRef, { autoTransitionTo3D: false });
      return null;
    }

    renderToStaticMarkup(createElement(Probe));
    expect(effectExecuted).toBe(true);
  });
});

describe('calculatePitchFactor and syncMapPitchFactor', () => {
  it('calculates pitch factor accurately across range', () => {
    expect(calculatePitchFactor(-10)).toBe(0);
    expect(calculatePitchFactor(0)).toBe(0);
    expect(calculatePitchFactor(25)).toBe(0.5);
    expect(calculatePitchFactor(50)).toBe(1);
    expect(calculatePitchFactor(60)).toBe(1);
  });

  it('syncs --map-pitch-factor property on container element and parentElement', () => {
    const setPropertyMock = vi.fn();
    const mockContainer = {
      style: { setProperty: setPropertyMock },
      parentElement: { style: { setProperty: setPropertyMock } },
    } as unknown as HTMLElement;

    const mockMap = { getPitch: () => 50, getContainer: () => mockContainer };
    syncMapPitchFactor(mockMap);
    expect(setPropertyMock).toHaveBeenCalledWith('--map-pitch-factor', '1.000');

    const loneContainer = {
      style: { setProperty: setPropertyMock },
    } as unknown as HTMLElement;
    syncMapPitchFactor(mockMap, loneContainer);
    expect(setPropertyMock).toHaveBeenCalled();
  });

  it('safely handles missing map, getPitch, or container element', () => {
    expect(() => syncMapPitchFactor(undefined)).not.toThrow();
    expect(() => syncMapPitchFactor(null)).not.toThrow();
    expect(() => syncMapPitchFactor({} as TransitionMapTarget)).not.toThrow();
    expect(() =>
      syncMapPitchFactor({ getPitch: () => 20 } as TransitionMapTarget, null)
    ).not.toThrow();
  });
});
