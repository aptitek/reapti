import { describe, it, expect, vi } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import type { PointerEvent, FocusEvent } from 'react';
import type { M3eButtonElement } from '@m3e/web/button';
import {
  useInteractiveShape,
  resolveActiveShape,
} from '../../src/components/atoms/Me3Button/useInteractiveShape.ts';

describe('useInteractiveShape Hook Unit Tests', () => {
  it('resolves active shapes with shifted state and fallback', () => {
    expect(resolveActiveShape('sunny', 'arch', true)).toBe('arch');
    expect(resolveActiveShape('sunny', 'arch', false)).toBe('sunny');
    expect(resolveActiveShape('sunny', undefined, true)).toBe('sunny');
  });

  it('handles pointer and focus lifecycle events', () => {
    type HookReturn = ReturnType<typeof useInteractiveShape>;
    let captured: HookReturn | null = null;
    const onPointerEnter = vi.fn();
    const onPointerLeave = vi.fn();
    const onFocus = vi.fn();
    const onBlur = vi.fn();

    function Probe() {
      captured = useInteractiveShape('sunny', 'arch', {
        onPointerEnter,
        onPointerLeave,
        onFocus,
        onBlur,
      });
      return null;
    }

    renderToStaticMarkup(createElement(Probe));
    expect(captured).not.toBeNull();

    const mockPointerEvent = {} as PointerEvent<M3eButtonElement>;
    const mockFocusEvent = {} as FocusEvent<M3eButtonElement>;

    captured?.handlePointerEnter(mockPointerEvent);
    expect(onPointerEnter).toHaveBeenCalledTimes(1);

    captured?.handlePointerLeave(mockPointerEvent);
    expect(onPointerLeave).toHaveBeenCalledTimes(1);

    captured?.handleFocus(mockFocusEvent);
    expect(onFocus).toHaveBeenCalledTimes(1);

    captured?.handleBlur(mockFocusEvent);
    expect(onBlur).toHaveBeenCalledTimes(1);
  });
});
