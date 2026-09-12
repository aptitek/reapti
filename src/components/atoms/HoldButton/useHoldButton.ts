import { useState, useRef, useEffect, useCallback } from 'react';
import { resolveBorderPath } from '../../../tokens/shapes.ts';
import { useInteractiveShape } from '../../../hooks/useInteractiveShape.ts';
import type { HoldButtonProps } from './HoldButton.types.ts';
import type { StyleSyncOptions } from './holdButtonHelpers.ts';
import {
  useHoldDimensions,
  createHoldEventHandlers,
  syncHoldButtonStyles,
  resolveBorderWidth,
  resolveBorderSpacing,
} from './holdButtonHelpers.ts';

const SHAKE_RESET_MS = 400;

export function syncHoldStylesEffect(
  element: HTMLElement | null,
  options: StyleSyncOptions
): void {
  syncHoldButtonStyles(element, options);
}

export function createHoldTimersCleanup(
  clearHoldTimer: () => void,
  clearShakeTimer: () => void
): () => void {
  return () => {
    clearHoldTimer();
    clearShakeTimer();
  };
}

export function useHoldTimers(setIsShaking: (val: boolean) => void) {
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shakeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isShakingRef = useRef(false);

  const clearHoldTimer = useCallback(() => {
    if (holdTimerRef.current !== null) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  }, []);

  const clearShakeTimer = useCallback(() => {
    if (shakeTimerRef.current !== null) {
      clearTimeout(shakeTimerRef.current);
      shakeTimerRef.current = null;
    }
  }, []);

  const triggerShake = useCallback(() => {
    clearShakeTimer();
    isShakingRef.current = true;
    setIsShaking(true);
    shakeTimerRef.current = setTimeout(() => {
      isShakingRef.current = false;
      setIsShaking(false);
      shakeTimerRef.current = null;
    }, SHAKE_RESET_MS);
  }, [clearShakeTimer, setIsShaking]);

  const handleTimersLifecycle = useCallback(
    () => createHoldTimersCleanup(clearHoldTimer, clearShakeTimer),
    [clearHoldTimer, clearShakeTimer]
  );

  useEffect(handleTimersLifecycle, [handleTimersLifecycle]);

  return {
    holdTimerRef,
    isShakingRef,
    clearHoldTimer,
    triggerShake,
    clearShakeTimer,
    handleTimersLifecycle,
  };
}

interface StartActionParams {
  props: HoldButtonProps;
  clearHoldTimer: () => void;
  holdTimerRef: React.RefObject<ReturnType<typeof setTimeout> | null>;
  startTimeRef: React.RefObject<number>;
  hasCompletedRef: React.RefObject<boolean>;
  isHoldingRef: React.RefObject<boolean>;
  setIsHolding: (v: boolean) => void;
  setIsCompleted: (v: boolean) => void;
}

function useHoldStartAction(params: StartActionParams) {
  const { props, clearHoldTimer, holdTimerRef, startTimeRef } = params;
  const { hasCompletedRef, isHoldingRef, setIsHolding, setIsCompleted } =
    params;
  const { disabled, holdingTime = 1000, onHoldComplete, onHold } = props;

  return useCallback(() => {
    if (disabled) return;
    clearHoldTimer();
    startTimeRef.current = Date.now();
    hasCompletedRef.current = false;
    isHoldingRef.current = true;
    setIsHolding(true);
    setIsCompleted(false);

    holdTimerRef.current = setTimeout(() => {
      hasCompletedRef.current = true;
      isHoldingRef.current = false;
      setIsHolding(false);
      setIsCompleted(true);
      onHoldComplete?.();
      onHold?.();
    }, holdingTime);
  }, [
    disabled,
    clearHoldTimer,
    holdTimerRef,
    holdingTime,
    onHoldComplete,
    onHold,
    startTimeRef,
    hasCompletedRef,
    isHoldingRef,
    setIsHolding,
    setIsCompleted,
  ]);
}

interface EndActionParams {
  holdingTime?: number;
  clearHoldTimer: () => void;
  triggerShake: () => void;
  onBriefPress?: () => void;
  startTimeRef: React.RefObject<number>;
  hasCompletedRef: React.RefObject<boolean>;
  isHoldingRef: React.RefObject<boolean>;
  setIsHolding: (v: boolean) => void;
}

function useHoldEndAction(params: EndActionParams) {
  const {
    holdingTime = 1000,
    clearHoldTimer,
    triggerShake,
    onBriefPress,
  } = params;
  const { startTimeRef, hasCompletedRef, isHoldingRef, setIsHolding } = params;

  return useCallback(
    (evalBrief = true) => {
      clearHoldTimer();
      if (!isHoldingRef.current) return;
      isHoldingRef.current = false;
      setIsHolding(false);

      if (!hasCompletedRef.current && evalBrief) {
        const elapsed = Date.now() - startTimeRef.current;
        if (elapsed < holdingTime) {
          triggerShake();
          onBriefPress?.();
        }
      }
    },
    [
      clearHoldTimer,
      holdingTime,
      triggerShake,
      onBriefPress,
      isHoldingRef,
      setIsHolding,
      hasCompletedRef,
      startTimeRef,
    ]
  );
}

export function useHoldPressState(props: HoldButtonProps) {
  const [isHolding, setIsHolding] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const startTimeRef = useRef(0);
  const hasCompletedRef = useRef(false);
  const isHoldingRef = useRef(false);

  const timers = useHoldTimers(setIsShaking);
  const startHold = useHoldStartAction({
    props,
    clearHoldTimer: timers.clearHoldTimer,
    holdTimerRef: timers.holdTimerRef,
    startTimeRef,
    hasCompletedRef,
    isHoldingRef,
    setIsHolding,
    setIsCompleted,
  });

  const endHold = useHoldEndAction({
    holdingTime: props.holdingTime,
    clearHoldTimer: timers.clearHoldTimer,
    triggerShake: timers.triggerShake,
    onBriefPress: props.onBriefPress,
    startTimeRef,
    hasCompletedRef,
    isHoldingRef,
    setIsHolding,
  });

  return {
    isHolding,
    isCompleted,
    isShaking,
    hasCompletedRef,
    isHoldingRef,
    isShakingRef: timers.isShakingRef,
    startHold,
    endHold,
  };
}

export function useHoldButton(props: HoldButtonProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const numericBorderWidth = resolveBorderWidth(props.borderWidth);
  const numericBorderSpacing = resolveBorderSpacing(props.borderSpacing);

  const bounds = useHoldDimensions(
    rootRef,
    numericBorderWidth,
    numericBorderSpacing
  );
  const shapeState = useInteractiveShape<HTMLElement>(
    props.shape ?? 'rounded',
    props.targetShape
  );
  const borderPath = resolveBorderPath({
    shape: shapeState.activeShape,
    bounds,
  });

  const pressState = useHoldPressState(props);

  const syncStyles = useCallback(() => {
    syncHoldStylesEffect(rootRef.current, {
      holdingTime: props.holdingTime,
      retractDuration: props.retractDuration,
      borderWidth: numericBorderWidth,
      borderSpacing: numericBorderSpacing,
      borderColor: props.borderColor,
    });
  }, [
    props.holdingTime,
    props.retractDuration,
    numericBorderWidth,
    numericBorderSpacing,
    props.borderColor,
  ]);

  useEffect(syncStyles, [syncStyles]);

  const buttonHandlers = createHoldEventHandlers({
    props,
    hasCompletedRef: pressState.hasCompletedRef,
    startHold: pressState.startHold,
    endHold: pressState.endHold,
    shapeState,
  });

  return {
    rootRef,
    bounds,
    activeShape: shapeState.activeShape,
    borderPath,
    borderWidth: numericBorderWidth,
    borderSpacing: numericBorderSpacing,
    isHolding: pressState.isHolding,
    isCompleted: pressState.isCompleted,
    isShaking: pressState.isShaking,
    buttonHandlers,
    syncStyles,
  };
}
