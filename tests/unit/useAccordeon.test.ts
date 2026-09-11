import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  useAccordeon,
  resolvePanelCount,
  generateAccordeonClipPaths,
  applyAccordeonVariables,
  toggleAccordeonFold,
  triggerResizeAfterFold,
} from '../../src/components/atoms/Accordeon/useAccordeon.ts';

describe('Accordeon Geometry and Panel Resolution', () => {
  it('resolves 2 panels per fold like a W', () => {
    expect(resolvePanelCount(undefined, 2)).toBe(4);
    expect(resolvePanelCount(undefined, 1)).toBe(2);
    expect(resolvePanelCount(undefined, 3)).toBe(6);
    expect(resolvePanelCount(4)).toBe(4);
    expect(resolvePanelCount(3)).toBe(4);
    expect(resolvePanelCount(1)).toBe(2);
    expect(resolvePanelCount(undefined, undefined)).toBe(4);
    expect(resolvePanelCount(Number.NaN, Number.NaN)).toBe(4);
    expect(resolvePanelCount(0, 0)).toBe(4);
  });

  it('generates 3D W-fold polygon clip paths', () => {
    const { unfolded, folded } = generateAccordeonClipPaths(4, 4);
    expect(unfolded).toContain('polygon(');
    expect(unfolded).toContain('25% 0%');
    expect(unfolded).toContain('75% 100%');

    expect(folded).toContain('polygon(');
    expect(folded).toContain('25% 4%');
    expect(folded).toContain('75% 96%');
  });

  it('applies CSS variables including clip paths to container', () => {
    const setProperty = vi.fn();
    const mockContainer = {
      style: { setProperty },
    } as unknown as HTMLElement;

    applyAccordeonVariables(mockContainer, {
      panelCount: 4,
      perspective: 1200,
      maxAngle: 25,
    });

    expect(setProperty).toHaveBeenCalledWith('--accordeon-panels', '4');
    expect(setProperty).toHaveBeenCalledWith(
      '--accordeon-perspective',
      '1200px'
    );
    expect(setProperty).toHaveBeenCalledWith('--accordeon-max-angle', '25deg');
    expect(setProperty).toHaveBeenCalledWith(
      '--accordeon-clip-unfolded',
      expect.stringContaining('polygon(')
    );
    expect(setProperty).toHaveBeenCalledWith(
      '--accordeon-clip-folded',
      expect.stringContaining('polygon(')
    );
  });

  it('handles null container in applyAccordeonVariables gracefully', () => {
    expect(() =>
      applyAccordeonVariables(null, {
        panelCount: 4,
        perspective: 1200,
        maxAngle: 25,
      })
    ).not.toThrow();
  });
});

describe('Fold Transitions and Toggles', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('triggers resize event after unfolding', () => {
    const dispatchEventMock = vi.fn();
    (globalThis as unknown as { window: unknown }).window = {
      dispatchEvent: dispatchEventMock,
    };

    try {
      const cleanupUnfolded = triggerResizeAfterFold(false);
      vi.advanceTimersByTime(600);
      expect(dispatchEventMock).toHaveBeenCalled();
      cleanupUnfolded();

      dispatchEventMock.mockClear();
      const cleanupFolded = triggerResizeAfterFold(true);
      vi.advanceTimersByTime(600);
      expect(dispatchEventMock).not.toHaveBeenCalled();
      cleanupFolded();
    } finally {
      delete (globalThis as unknown as { window?: unknown }).window;
    }
  });

  it('toggles fold state in controlled and uncontrolled modes', () => {
    const setInternal = vi.fn();
    const onToggle = vi.fn();

    const res1 = toggleAccordeonFold({
      currentFolded: false,
      isControlled: false,
      setInternal,
      onToggle,
    });
    expect(res1).toBe(true);
    expect(setInternal).toHaveBeenCalledWith(true);
    expect(onToggle).toHaveBeenCalledWith(true);

    setInternal.mockClear();
    onToggle.mockClear();
    const res2 = toggleAccordeonFold({
      currentFolded: true,
      isControlled: true,
      setInternal,
    });
    expect(res2).toBe(false);
    expect(setInternal).not.toHaveBeenCalled();
  });
});

describe('useAccordeon Hook Execution', () => {
  it('exposes hook state, callbacks, and keyboard interactions', () => {
    let hookApi: ReturnType<typeof useAccordeon> | null = null;
    const onToggle = vi.fn();

    function Probe() {
      hookApi = useAccordeon({
        folds: 2,
        defaultFolded: false,
        onToggle,
        ariaLabel: 'Foldable Accordion',
      });
      return null;
    }

    renderToStaticMarkup(createElement(Probe));
    expect(hookApi).not.toBeNull();
    if (!hookApi) return;

    expect(hookApi.panelCount).toBe(4);
    expect(hookApi.isFolded).toBe(false);
    expect(hookApi.ariaLabel).toBe('Foldable Accordion');

    const toggled = hookApi.handleToggle();
    expect(toggled).toBe(true);
    expect(onToggle).toHaveBeenCalledWith(true);

    const preventDefault = vi.fn();
    hookApi.handleKeyDown({ key: 'Enter', preventDefault } as never);
    expect(preventDefault).toHaveBeenCalled();

    const preventDefaultSpace = vi.fn();
    hookApi.handleKeyDown({
      key: ' ',
      preventDefault: preventDefaultSpace,
    } as never);
    expect(preventDefaultSpace).toHaveBeenCalled();

    const preventDefaultOther = vi.fn();
    hookApi.handleKeyDown({
      key: 'Tab',
      preventDefault: preventDefaultOther,
    } as never);
    expect(preventDefaultOther).not.toHaveBeenCalled();

    hookApi.syncVariables();
    const cleanupResize = hookApi.handleResize();
    cleanupResize();
  });
});
