import { describe, it, expect, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  syncHoldButtonStyles,
  computeStrokeBounds,
  resolveInitialBounds,
  renderBorderSvg,
  resolveBorderWidth,
  resolveBorderSpacing,
  observeHoldDimensions,
  createHoldEventHandlers,
} from '../../src/components/atoms/HoldButton/holdButtonHelpers.ts';

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

describe('HoldButton Token Resolution & Styles', () => {
  it('resolves tokenised border width and spacing correctly', () => {
    expect(resolveBorderWidth('thin')).toBe(1);
    expect(resolveBorderWidth('heavy')).toBe(4);
    expect(resolveBorderWidth('none')).toBe(0);
    expect(resolveBorderWidth(5)).toBe(5);
    expect(resolveBorderWidth(-2)).toBe(0);
    expect(resolveBorderWidth()).toBe(3);

    expect(resolveBorderSpacing('none')).toBe(0);
    expect(resolveBorderSpacing('compact')).toBe(2);
    expect(resolveBorderSpacing('relaxed')).toBe(8);
    expect(resolveBorderSpacing(6)).toBe(6);
    expect(resolveBorderSpacing(-1)).toBe(0);
    expect(resolveBorderSpacing()).toBe(4);
  });

  it('syncs CSS variables onto element style map correctly', () => {
    const mockEl = createMockElement();
    syncHoldButtonStyles(mockEl, {
      holdingTime: 1500,
      retractDuration: 400,
      borderWidth: 3,
      borderSpacing: 6,
      borderColor: 'var(--colors-secondary)',
    });
    expect(mockEl.style.getPropertyValue('--hold-duration')).toBe('1500ms');
    expect(mockEl.style.getPropertyValue('--hold-retract-duration')).toBe(
      '400ms'
    );
    expect(mockEl.style.getPropertyValue('--hold-border-width')).toBe('3px');
    expect(mockEl.style.getPropertyValue('--hold-border-spacing')).toBe('6px');
    expect(mockEl.style.getPropertyValue('--hold-border-color')).toBe(
      'var(--colors-secondary)'
    );
  });

  it('removes custom border color property when undefined', () => {
    const mockEl = createMockElement();
    syncHoldButtonStyles(mockEl, { borderColor: 'var(--colors-primary)' });
    expect(mockEl.style.getPropertyValue('--hold-border-color')).toBe(
      'var(--colors-primary)'
    );
    syncHoldButtonStyles(mockEl, {});
    expect(mockEl.style.getPropertyValue('--hold-border-color')).toBe('');
    syncHoldButtonStyles(null, {});
  });
});

describe('HoldButton Bounds & SVG Rendering', () => {
  it('computes concentric stroke bounds with tokenised spacing', () => {
    expect(
      computeStrokeBounds(100, 50, { strokeWidth: 4, spacing: 6 })
    ).toEqual({
      x: 2,
      y: 2,
      width: 116,
      height: 66,
      rootWidth: 120,
      rootHeight: 70,
      padding: 10,
    });
  });

  it('resolves deterministic initial bounds for SSR', () => {
    expect(resolveInitialBounds(2, 4)).toEqual({
      x: 1,
      y: 1,
      width: 130,
      height: 50,
      rootWidth: 132,
      rootHeight: 52,
      padding: 6,
    });
  });

  it('renders SVG overlay with pathLength 1000 and viewBox', () => {
    const svgNode = renderBorderSvg('M0 0 L100 50 Z', {
      width: 100,
      height: 50,
      strokeWidth: 2,
      dataTestId: 'test-btn',
    });
    const html = renderToStaticMarkup(svgNode as never);
    expect(html).toContain('viewBox="0 0 100 50"');
    expect(html).toContain('hold-button_border-svg');
    expect(html).toContain('pathLength="1000"');
    expect(html).toContain('data-testid="test-btn-border-svg"');
  });
});

describe('HoldButton Resize Observer Lifecycle', () => {
  it('handles null element and SSR when ResizeObserver is undefined', () => {
    observeHoldDimensions(null, {}, vi.fn())();
    const orig = globalThis.ResizeObserver;
    // @ts-expect-error test SSR
    delete globalThis.ResizeObserver;
    try {
      const onUpdate = vi.fn();
      const mockEl = {
        querySelector: () => null,
        offsetWidth: 140,
        offsetHeight: 44,
      } as unknown as HTMLElement;
      observeHoldDimensions(mockEl, {}, onUpdate)();
      expect(onUpdate).toHaveBeenCalledTimes(1);
    } finally {
      globalThis.ResizeObserver = orig;
    }
  });

  it('observes element and child shape element with ResizeObserver', () => {
    const orig = globalThis.ResizeObserver;
    const observe = vi.fn();
    const disconnect = vi.fn();
    // @ts-expect-error mock ResizeObserver
    globalThis.ResizeObserver = class {
      observe = observe;
      disconnect = disconnect;
    };
    try {
      const onUpdate = vi.fn();
      const mockShape = { offsetWidth: 100, offsetHeight: 40 };
      const mockEl = {
        querySelector: () => mockShape,
        offsetWidth: 120,
        offsetHeight: 50,
      } as unknown as HTMLElement;
      const cleanup = observeHoldDimensions(
        mockEl,
        { strokeWidth: 3, spacing: 4 },
        onUpdate
      );
      expect(onUpdate).toHaveBeenCalledTimes(1);
      expect(observe).toHaveBeenCalledWith(mockShape);
      expect(observe).toHaveBeenCalledWith(mockEl);
      cleanup();
      expect(disconnect).toHaveBeenCalledTimes(1);
    } finally {
      globalThis.ResizeObserver = orig;
    }
  });
});

function createMockHandlers() {
  const startHold = vi.fn();
  const endHold = vi.fn();
  const shapeState = {
    activeShape: 'pill' as const,
    handlePointerEnter: vi.fn(),
    handlePointerLeave: vi.fn(),
    handleFocus: vi.fn(),
    handleBlur: vi.fn(),
  };
  const callbacks = {
    onPointerDown: vi.fn(),
    onPointerUp: vi.fn(),
    onPointerLeave: vi.fn(),
    onKeyDown: vi.fn(),
    onKeyUp: vi.fn(),
    onClick: vi.fn(),
  };
  const hasCompletedRef = { current: false };
  const handlers = createHoldEventHandlers({
    props: callbacks,
    hasCompletedRef,
    startHold,
    endHold,
    shapeState: shapeState as never,
  });
  return {
    handlers,
    startHold,
    endHold,
    shapeState,
    callbacks,
    hasCompletedRef,
  };
}

describe('HoldButton Event Handlers Pointer Delegation', () => {
  it('handles pointer enter, focus, blur, and pointer down/up/cancel', () => {
    const ctx = createMockHandlers();
    ctx.handlers.onPointerEnter({} as never);
    ctx.handlers.onFocus({} as never);
    ctx.handlers.onBlur({} as never);
    expect(ctx.shapeState.handlePointerEnter).toHaveBeenCalled();
    expect(ctx.shapeState.handleFocus).toHaveBeenCalled();
    expect(ctx.shapeState.handleBlur).toHaveBeenCalled();

    ctx.handlers.onPointerDown({ button: 0 } as never);
    ctx.handlers.onPointerDown({ button: 1 } as never);
    expect(ctx.startHold).toHaveBeenCalledTimes(1);
    expect(ctx.callbacks.onPointerDown).toHaveBeenCalledTimes(2);

    ctx.handlers.onPointerUp({} as never);
    expect(ctx.endHold).toHaveBeenCalledWith(true);
    expect(ctx.callbacks.onPointerUp).toHaveBeenCalledTimes(1);

    ctx.handlers.onPointerLeave({} as never);
    ctx.handlers.onPointerCancel({} as never);
    expect(ctx.shapeState.handlePointerLeave).toHaveBeenCalledTimes(2);
    expect(ctx.endHold).toHaveBeenCalledWith(false);
    expect(ctx.callbacks.onPointerLeave).toHaveBeenCalledTimes(2);
  });
});

describe('HoldButton Event Handlers Keyboard & Click', () => {
  it('manages space/enter keyboard events and click prevention', () => {
    const ctx = createMockHandlers();
    const preventDefault = vi.fn();

    ctx.handlers.onKeyDown({
      key: ' ',
      repeat: false,
      preventDefault,
    } as never);
    expect(preventDefault).toHaveBeenCalled();
    expect(ctx.startHold).toHaveBeenCalledTimes(1);
    expect(ctx.callbacks.onKeyDown).toHaveBeenCalledTimes(1);

    ctx.handlers.onKeyDown({ key: 'Enter', repeat: false } as never);
    ctx.handlers.onKeyDown({ key: 'Enter', repeat: true } as never);
    ctx.handlers.onKeyDown({ key: 'Escape', repeat: false } as never);
    expect(ctx.startHold).toHaveBeenCalledTimes(2);

    ctx.handlers.onKeyUp({ key: ' ' } as never);
    ctx.handlers.onKeyUp({ key: 'Enter' } as never);
    expect(ctx.endHold).toHaveBeenCalledWith(true);

    ctx.handlers.onKeyUp({ key: 'Escape' } as never);
    expect(ctx.callbacks.onKeyUp).toHaveBeenCalledTimes(3);

    const clickPreventDefault = vi.fn();
    const clickStopPropagation = vi.fn();
    ctx.handlers.onClick({
      preventDefault: clickPreventDefault,
      stopPropagation: clickStopPropagation,
    } as never);
    expect(clickPreventDefault).toHaveBeenCalled();
    expect(clickStopPropagation).toHaveBeenCalled();
    expect(ctx.callbacks.onClick).not.toHaveBeenCalled();

    ctx.hasCompletedRef.current = true;
    const allowed = {} as never;
    ctx.handlers.onClick(allowed);
    expect(ctx.callbacks.onClick).toHaveBeenCalledWith(allowed);
  });
});
