import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  useSwitch,
  useSwitchInternalState,
  applySwitchCssVariables,
  clearSwitchTimer,
} from '../../src/components/atoms/Switch/useSwitch.ts';
import type { SwitchProps } from '../../src/components/atoms/Switch/Switch.types.ts';

function createMockElement() {
  const store = new Map<string, string>();
  return {
    style: {
      setProperty: (prop: string, val: string) => store.set(prop, val),
      removeProperty: (prop: string) => store.delete(prop),
      getPropertyValue: (prop: string) => store.get(prop) ?? '',
    },
  } as unknown as HTMLElement;
}

describe('useSwitch Internal State Hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('handles uncontrolled state and fires onChange with next state', () => {
    let hookApi: ReturnType<typeof useSwitchInternalState> | null = null;
    const onChange = vi.fn();

    function Probe() {
      hookApi = useSwitchInternalState(undefined, false, {
        onChange,
        transitionDuration: 200,
      });
      return null;
    }

    renderToStaticMarkup(createElement(Probe));
    expect(hookApi).not.toBeNull();
    if (!hookApi) return;

    expect(hookApi.isChecked).toBe(false);

    const mockEvent = {
      currentTarget: { checked: true },
    } as unknown as Event;

    hookApi.handleChange(mockEvent);
    expect(onChange).toHaveBeenCalledWith(true);

    vi.advanceTimersByTime(200);
  });

  it('respects controlled state and fires onChange when toggled off', () => {
    let hookApi: ReturnType<typeof useSwitchInternalState> | null = null;
    const onChange = vi.fn();

    function Probe() {
      hookApi = useSwitchInternalState(true, false, onChange);
      return null;
    }

    renderToStaticMarkup(createElement(Probe));
    expect(hookApi).not.toBeNull();
    if (!hookApi) return;

    expect(hookApi.isChecked).toBe(true);

    const mockEvent = {
      currentTarget: { checked: false },
    } as unknown as Event;

    hookApi.handleChange(mockEvent);
    expect(onChange).toHaveBeenCalledWith(false);

    vi.advanceTimersByTime(300);
  });
});

describe('useSwitch Composite Hook & Timers', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('cleans up active timers safely via clearSwitchTimer', () => {
    const timerRef: { current: ReturnType<typeof setTimeout> | null } = {
      current: setTimeout(() => {}, 500),
    };
    clearSwitchTimer(timerRef);
    expect(timerRef.current).toBeNull();

    clearSwitchTimer({ current: null });
  });

  it('provides useSwitch composite hook with ref and syncStyles', () => {
    let hookApi: ReturnType<typeof useSwitch> | null = null;
    function Probe() {
      hookApi = useSwitch({ checked: true, colorOn: 'var(--colors-primary)' });
      return null;
    }
    renderToStaticMarkup(createElement(Probe));
    expect(hookApi).not.toBeNull();
    if (!hookApi) return;

    expect(hookApi.isChecked).toBe(true);
    expect(hookApi.rootRef).toBeDefined();
    expect(typeof hookApi.syncStyles).toBe('function');
    hookApi.syncStyles();
    const teardown = hookApi.handleMount();
    teardown();
    hookApi.cleanup();
  });
});

describe('useSwitch CSS Color and Layout Variables', () => {
  it('applies color and layout CSS variables via on/off objects and flat props', () => {
    const el = createMockElement();
    const props: SwitchProps = {
      on: {
        color: 'var(--colors-primary)',
        trackColor: 'var(--colors-tertiary)',
        handleColor: 'var(--colors-on-primary)',
        ghostColor: 'var(--colors-tertiary)',
        peekingColor: 'var(--colors-on-primary)',
        peekingRotation: 180,
        peekingSymmetry: true,
      },
      off: {
        color: 'var(--colors-secondary)',
        trackColor: 'var(--colors-surface)',
        handleColor: 'var(--colors-on-surface)',
        ghostColor: 'var(--colors-outline)',
        peekingColor: 'var(--colors-outline)',
        peekingRotation: 45,
        peekingSymmetry: false,
      },
      peekingOffset: 12,
      transitionDuration: 250,
    };

    applySwitchCssVariables(el, props);

    expect(el.style.getPropertyValue('--switch-color-on')).toBe(
      'var(--colors-primary)'
    );
    expect(el.style.getPropertyValue('--switch-track-color-on')).toBe(
      'var(--colors-tertiary)'
    );
    expect(el.style.getPropertyValue('--switch-ghost-color-on')).toBe(
      'var(--colors-tertiary)'
    );
    expect(el.style.getPropertyValue('--switch-ghost-color-off')).toBe(
      'var(--colors-outline)'
    );
    expect(el.style.getPropertyValue('--switch-peeking-color-on')).toBe(
      'var(--colors-on-primary)'
    );
    expect(el.style.getPropertyValue('--switch-peeking-color-off')).toBe(
      'var(--colors-outline)'
    );
    expect(el.style.getPropertyValue('--switch-peeking-rot-on')).toBe('180deg');
    expect(el.style.getPropertyValue('--switch-peeking-rot-off')).toBe('45deg');
    expect(el.style.getPropertyValue('--switch-peeking-scale-x-on')).toBe('-1');
    expect(el.style.getPropertyValue('--switch-peeking-scale-x-off')).toBe('1');
    expect(el.style.getPropertyValue('--switch-peek-offset')).toBe('12px');
    expect(el.style.getPropertyValue('--switch-trans-duration')).toBe('250ms');

    applySwitchCssVariables(null, props);
  });
});

describe('useSwitch CSS Transform and State Variables', () => {
  it('applies rotation, symmetry, and removes variables on empty props', () => {
    const el = createMockElement();
    const props: SwitchProps = {
      peekingRotation: { on: 180, off: 45 },
      peekingSymmetry: 'horizontal',
    };

    applySwitchCssVariables(el, props);

    expect(el.style.getPropertyValue('--switch-peeking-rot-on')).toBe('180deg');
    expect(el.style.getPropertyValue('--switch-peeking-rot-off')).toBe('45deg');
    expect(el.style.getPropertyValue('--switch-peeking-scale-x-on')).toBe('-1');
    expect(el.style.getPropertyValue('--switch-peeking-scale-x-off')).toBe(
      '-1'
    );

    const emptyProps: SwitchProps = {
      peekingRotation: 90,
      peekingSymmetry: { on: true, off: false },
    };
    applySwitchCssVariables(el, emptyProps);
    expect(el.style.getPropertyValue('--switch-color-on')).toBe('');
    expect(el.style.getPropertyValue('--switch-peek-offset')).toBe('');
    expect(el.style.getPropertyValue('--switch-peeking-rot-on')).toBe('90deg');
    expect(el.style.getPropertyValue('--switch-peeking-rot-off')).toBe('90deg');
    expect(el.style.getPropertyValue('--switch-peeking-scale-x-on')).toBe('-1');
    expect(el.style.getPropertyValue('--switch-peeking-scale-x-off')).toBe('1');
  });

  it('handles symmetry edge cases (boolean, vertical, undefined)', () => {
    const el = createMockElement();
    applySwitchCssVariables(el, { peekingSymmetry: true });
    expect(el.style.getPropertyValue('--switch-peeking-scale-x-on')).toBe('-1');

    applySwitchCssVariables(el, { peekingSymmetry: 'vertical' });
    expect(el.style.getPropertyValue('--switch-peeking-scale-x-on')).toBe('1');

    applySwitchCssVariables(el, { peekingSymmetry: false });
    expect(el.style.getPropertyValue('--switch-peeking-scale-x-on')).toBe('1');
  });
});
