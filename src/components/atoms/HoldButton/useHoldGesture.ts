import { useState, useRef, useCallback } from 'react';
import type { PointerEvent } from 'react';

export function triggerHaptic(type: 'light' | 'medium' | 'heavy'): void {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    if (type === 'light') {
      navigator.vibrate(10);
    } else if (type === 'medium') {
      navigator.vibrate(20);
    } else {
      navigator.vibrate([30, 50, 30]);
    }
  }
}

export interface UseHoldGestureParams {
  holdTime: number;
  onHoldComplete: () => void;
}

export function useHoldGesture({
  holdTime,
  onHoldComplete,
}: UseHoldGestureParams) {
  const [isHolding, setIsHolding] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isCompleteRef = useRef(false);

  const startHold = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      if (e.button === 2) return;
      isCompleteRef.current = false;
      setIsHolding(true);
      triggerHaptic('light');

      timerRef.current = setTimeout(() => {
        isCompleteRef.current = true;
        triggerHaptic('heavy');
        onHoldComplete();
        setTimeout(() => setIsHolding(false), 200);
      }, holdTime);
    },
    [holdTime, onHoldComplete]
  );

  const cancelHold = useCallback(() => {
    const wasHolding = isHolding || timerRef.current !== null;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (!isCompleteRef.current && wasHolding) {
      triggerHaptic('medium');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 300);
    }
    setIsHolding(false);
  }, [isHolding]);

  return { isHolding, isShaking, startHold, cancelHold };
}
