import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import type { PointerEvent } from 'react';
import {
  useHoldGesture,
  triggerHaptic,
} from '../../src/components/atoms/HoldButton/useHoldGesture.ts';

describe('useHoldGesture Hook Unit Tests', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('handles startHold and timer completion with haptic feedback', () => {
    const handleComplete = vi.fn();
    const vibrate = vi.fn();
    vi.stubGlobal('navigator', { vibrate });

    type GestureReturn = ReturnType<typeof useHoldGesture>;
    let captured: GestureReturn | null = null;

    function Probe() {
      captured = useHoldGesture({
        holdTime: 200,
        onHoldComplete: handleComplete,
      });
      return null;
    }

    renderToStaticMarkup(createElement(Probe));
    expect(captured).not.toBeNull();

    // Right-click should be ignored
    captured?.startHold({ button: 2 } as PointerEvent<HTMLElement>);
    expect(vibrate).not.toHaveBeenCalled();

    // Normal pointer down starts hold (light haptic)
    captured?.startHold({ button: 0 } as PointerEvent<HTMLElement>);
    expect(vibrate).toHaveBeenCalledWith(10);

    // Complete hold to timer expiry (heavy haptic)
    vi.advanceTimersByTime(200);
    expect(handleComplete).toHaveBeenCalledTimes(1);
    expect(vibrate).toHaveBeenCalledWith([30, 50, 30]);
    vi.advanceTimersByTime(250);
  });

  it('handles cancellation and fallbacks', () => {
    const handleComplete = vi.fn();
    const vibrate = vi.fn();
    vi.stubGlobal('navigator', { vibrate });

    type GestureReturn = ReturnType<typeof useHoldGesture>;
    let captured: GestureReturn | null = null;

    function Probe() {
      captured = useHoldGesture({
        holdTime: 200,
        onHoldComplete: handleComplete,
      });
      return null;
    }

    renderToStaticMarkup(createElement(Probe));

    // Cancel without holding is a safe no-op
    captured?.cancelHold();

    // Cancel early triggers medium haptic and shake
    captured?.startHold({ button: 0 } as PointerEvent<HTMLElement>);
    captured?.cancelHold();
    expect(vibrate).toHaveBeenCalledWith(20);
    vi.advanceTimersByTime(350);

    // Safe fallback when navigator is missing vibrate
    vi.stubGlobal('navigator', {});
    triggerHaptic('light');
    triggerHaptic('medium');
    triggerHaptic('heavy');
  });
});
