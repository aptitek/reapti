import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import type { SyntheticEvent } from 'react';
import {
  useHoldButton,
  useHoldPressState,
  useHoldTimers,
  createHoldTimersCleanup,
  syncHoldStylesEffect,
} from '../../src/components/atoms/HoldButton/useHoldButton.ts';
import type { HoldButtonProps } from '../../src/components/atoms/HoldButton/HoldButton.types.ts';

describe('useHoldTimers & Cleanup', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('cleans up active timers via createHoldTimersCleanup', () => {
    const clearHold = vi.fn();
    const clearShake = vi.fn();
    const cleanup = createHoldTimersCleanup(clearHold, clearShake);
    cleanup();
    expect(clearHold).toHaveBeenCalledTimes(1);
    expect(clearShake).toHaveBeenCalledTimes(1);
  });

  it('triggers and resets shake timer safely, and cleans up on unmount', () => {
    let timersApi: ReturnType<typeof useHoldTimers> | null = null;
    const setIsShaking = vi.fn();
    function Probe() {
      timersApi = useHoldTimers(setIsShaking);
      return null;
    }
    renderToStaticMarkup(createElement(Probe));
    if (!timersApi) return;

    timersApi.triggerShake();
    expect(timersApi.isShakingRef.current).toBe(true);
    expect(setIsShaking).toHaveBeenCalledWith(true);

    timersApi.triggerShake();

    timersApi.clearHoldTimer();
    timersApi.holdTimerRef.current = setTimeout(() => {}, 1000);
    timersApi.clearHoldTimer();
    expect(timersApi.holdTimerRef.current).toBeNull();

    vi.advanceTimersByTime(400);
    expect(timersApi.isShakingRef.current).toBe(false);
    expect(setIsShaking).toHaveBeenCalledWith(false);

    const cleanup = timersApi.handleTimersLifecycle();
    cleanup();
  });
});

describe('useHoldPressState Timing & Completion', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('completes hold and invokes callbacks when held for full holdingTime', () => {
    let hookApi: ReturnType<typeof useHoldPressState> | null = null;
    const onHoldComplete = vi.fn();
    const onHold = vi.fn();

    function Probe() {
      hookApi = useHoldPressState({ holdingTime: 500, onHoldComplete, onHold });
      return null;
    }

    renderToStaticMarkup(createElement(Probe));
    if (!hookApi) return;

    hookApi.startHold();
    expect(hookApi.isHoldingRef.current).toBe(true);

    vi.advanceTimersByTime(500);

    expect(hookApi.hasCompletedRef.current).toBe(true);
    expect(hookApi.isHoldingRef.current).toBe(false);
    expect(onHoldComplete).toHaveBeenCalledTimes(1);
    expect(onHold).toHaveBeenCalledTimes(1);
  });

  it('does not start hold when disabled', () => {
    let hookApi: ReturnType<typeof useHoldPressState> | null = null;

    function Probe() {
      hookApi = useHoldPressState({ holdingTime: 1000, disabled: true });
      return null;
    }

    renderToStaticMarkup(createElement(Probe));
    if (!hookApi) return;

    hookApi.startHold();
    expect(hookApi.isHoldingRef.current).toBe(false);
  });

  it('handles early returns in endHold when not holding or when elapsed exceeds holdingTime', () => {
    let hookApi: ReturnType<typeof useHoldPressState> | null = null;
    function Probe() {
      hookApi = useHoldPressState({ holdingTime: 500 });
      return null;
    }
    renderToStaticMarkup(createElement(Probe));
    if (!hookApi) return;

    hookApi.endHold();
    expect(hookApi.isHoldingRef.current).toBe(false);

    hookApi.startHold();
    hookApi.endHold(false);
    expect(hookApi.isShakingRef.current).toBe(false);

    hookApi.startHold();
    vi.advanceTimersByTime(600);
    hookApi.endHold(true);
    expect(hookApi.isShakingRef.current).toBe(false);
  });
});

describe('useHoldPressState Premature Release', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('triggers shake feedback and calls onBriefPress when released prematurely', () => {
    let hookApi: ReturnType<typeof useHoldPressState> | null = null;
    const onBriefPress = vi.fn();

    function Probe() {
      hookApi = useHoldPressState({ holdingTime: 1000, onBriefPress });
      return null;
    }

    renderToStaticMarkup(createElement(Probe));
    if (!hookApi) return;

    hookApi.startHold();
    expect(hookApi.isHoldingRef.current).toBe(true);

    vi.advanceTimersByTime(200);
    hookApi.endHold(true);

    expect(hookApi.isHoldingRef.current).toBe(false);
    expect(hookApi.hasCompletedRef.current).toBe(false);
    expect(hookApi.isShakingRef.current).toBe(true);
    expect(onBriefPress).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(400);
    expect(hookApi.isShakingRef.current).toBe(false);
  });
});

describe('useHoldButton Event Handlers', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('prevents click execution before hold completion and allows after', () => {
    let hookApi: ReturnType<typeof useHoldButton> | null = null;
    const onClick = vi.fn();

    function Probe(props: HoldButtonProps) {
      hookApi = useHoldButton(props);
      return null;
    }

    renderToStaticMarkup(createElement(Probe, { holdingTime: 500, onClick }));
    if (!hookApi) return;

    const mockPreventDefault = vi.fn();
    const mockStopPropagation = vi.fn();
    const mockEvent = {
      preventDefault: mockPreventDefault,
      stopPropagation: mockStopPropagation,
    } as unknown as SyntheticEvent;

    hookApi.buttonHandlers.onClick(mockEvent);
    expect(mockPreventDefault).toHaveBeenCalled();
    expect(onClick).not.toHaveBeenCalled();

    hookApi.buttonHandlers.onPointerDown({ button: 0 } as never);
    vi.advanceTimersByTime(500);

    hookApi.buttonHandlers.onClick(mockEvent);
    expect(onClick).toHaveBeenCalledWith(mockEvent);
  });

  it('handles Space and Enter keyboard interactions', () => {
    let hookApi: ReturnType<typeof useHoldButton> | null = null;

    function Probe(props: HoldButtonProps) {
      hookApi = useHoldButton(props);
      return null;
    }

    renderToStaticMarkup(createElement(Probe, { holdingTime: 800 }));
    if (!hookApi) return;

    const mockPreventDefault = vi.fn();
    hookApi.buttonHandlers.onKeyDown({
      key: ' ',
      repeat: false,
      preventDefault: mockPreventDefault,
    } as never);

    expect(mockPreventDefault).toHaveBeenCalled();

    hookApi.buttonHandlers.onKeyUp({ key: ' ' } as never);
  });
});

describe('useHoldButton Bounds and Styles Sync', () => {
  it('resolves default and custom tokenised borderWidth and borderSpacing', () => {
    let hookApi: ReturnType<typeof useHoldButton> | null = null;

    function Probe(props: HoldButtonProps) {
      hookApi = useHoldButton(props);
      return null;
    }

    renderToStaticMarkup(createElement(Probe, {}));
    expect(hookApi?.borderWidth).toBe(3);
    expect(hookApi?.borderSpacing).toBe(4);

    renderToStaticMarkup(
      createElement(Probe, { borderWidth: 'heavy', borderSpacing: 'relaxed' })
    );
    expect(hookApi?.borderWidth).toBe(4);
    expect(hookApi?.borderSpacing).toBe(8);
  });

  it('synchronizes styles via syncStyles and syncHoldStylesEffect', () => {
    const setProperty = vi.fn();
    const mockEl = {
      style: { setProperty, removeProperty: vi.fn() },
    } as unknown as HTMLElement;

    syncHoldStylesEffect(mockEl, {
      holdingTime: 1200,
      retractDuration: 300,
      borderWidth: 2,
      borderSpacing: 4,
    });
    expect(setProperty).toHaveBeenCalledWith('--hold-duration', '1200ms');

    let hookApi: ReturnType<typeof useHoldButton> | null = null;
    function Probe() {
      hookApi = useHoldButton({ holdingTime: 1200 });
      return null;
    }
    renderToStaticMarkup(createElement(Probe));
    expect(typeof hookApi?.syncStyles).toBe('function');
    hookApi?.syncStyles();
  });
});
