import { describe, it, expect, vi } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  calculateHoloOffsets,
  applyHoloProperties,
  findParentCard,
  setupHoloObserver,
  syncHoloElement,
  createHoloLifecycle,
  useHoloDecorator,
} from '../../src/components/atoms/HoloDecorator/useHoloDecorator.ts';

describe('HoloDecorator Offset Geometry Calculation', () => {
  it('calculates offsets and dimensions relative to parent card', () => {
    const elementRect = {
      left: 150,
      top: 80,
      width: 100,
      height: 40,
    } as DOMRect;

    const cardRect = {
      left: 50,
      top: 30,
      width: 300,
      height: 200,
    } as DOMRect;

    const offsets = calculateHoloOffsets(elementRect, cardRect);
    expect(offsets.bgSizeX).toBe(300);
    expect(offsets.bgSizeY).toBe(200);
    expect(offsets.offsetX).toBe(100);
    expect(offsets.offsetY).toBe(50);
  });
});

describe('HoloDecorator Custom Property Application', () => {
  it('applies calculated CSS custom properties to element style', () => {
    const setProperty = vi.fn();
    const mockElement = {
      style: { setProperty },
    } as unknown as HTMLElement;

    applyHoloProperties(
      mockElement,
      { bgSizeX: 400, bgSizeY: 250, offsetX: 20, offsetY: 15 },
      { maskUrl: 'mask.png', maskSize: 'cover' }
    );

    expect(setProperty).toHaveBeenCalledWith('--holo-bg-size-x', '400px');
    expect(setProperty).toHaveBeenCalledWith('--holo-bg-size-y', '250px');
    expect(setProperty).toHaveBeenCalledWith('--holo-offset-x', '20px');
    expect(setProperty).toHaveBeenCalledWith('--holo-offset-y', '15px');
    expect(setProperty).toHaveBeenCalledWith(
      '--holo-mask-url',
      'url("mask.png")'
    );
    expect(setProperty).toHaveBeenCalledWith('--holo-mask-size', 'cover');
  });

  it('handles maskUrl with direct CSS gradient without wrapping', () => {
    const setProperty = vi.fn();
    const mockElement = {
      style: { setProperty },
    } as unknown as HTMLElement;

    applyHoloProperties(
      mockElement,
      { bgSizeX: 100, bgSizeY: 100, offsetX: 0, offsetY: 0 },
      { maskUrl: 'radial-gradient(circle, black, transparent)' }
    );

    expect(setProperty).toHaveBeenCalledWith(
      '--holo-mask-url',
      'radial-gradient(circle, black, transparent)'
    );
  });

  it('safely handles null element in applyHoloProperties', () => {
    expect(() =>
      applyHoloProperties(null, {
        bgSizeX: 100,
        bgSizeY: 100,
        offsetX: 0,
        offsetY: 0,
      })
    ).not.toThrow();
  });
});

describe('Parent Card Resolution and Observation', () => {
  it('finds parent card matching supported classes', () => {
    const mockClosest = vi.fn().mockReturnValue({ id: 'card-1' });
    const mockElement = { closest: mockClosest } as unknown as HTMLElement;

    const card = findParentCard(mockElement);
    expect(card).toEqual({ id: 'card-1' });
    expect(mockClosest).toHaveBeenCalledWith(
      '.physics-card, .physic-card, .flip-card'
    );
  });

  it('returns null when element is null or has no parent card', () => {
    expect(findParentCard(null)).toBeNull();
    const mockElement = {
      closest: () => null,
    } as unknown as HTMLElement;
    expect(findParentCard(mockElement)).toBeNull();
  });

  it('sets up and disconnects ResizeObserver correctly', () => {
    const disconnect = vi.fn();
    const observe = vi.fn();
    const originalResizeObserver = globalThis.ResizeObserver;

    (globalThis as unknown as { ResizeObserver: unknown }).ResizeObserver =
      class MockObserver {
        observe = observe;
        disconnect = disconnect;
      };

    try {
      const onUpdate = vi.fn();
      const mockElement = {} as HTMLElement;
      const mockCard = {} as HTMLElement;

      const cleanup = setupHoloObserver(mockElement, mockCard, onUpdate);
      expect(onUpdate).toHaveBeenCalledTimes(1);
      expect(observe).toHaveBeenCalledWith(mockCard);
      expect(observe).toHaveBeenCalledWith(mockElement);

      cleanup();
      expect(disconnect).toHaveBeenCalled();
    } finally {
      globalThis.ResizeObserver = originalResizeObserver;
    }
  });

  it('returns fallback cleanup when ResizeObserver is undefined', () => {
    const originalResizeObserver = globalThis.ResizeObserver;
    delete (globalThis as unknown as { ResizeObserver?: unknown })
      .ResizeObserver;

    try {
      const onUpdate = vi.fn();
      const mockElement = {} as HTMLElement;
      const mockCard = {} as HTMLElement;

      const cleanup = setupHoloObserver(mockElement, mockCard, onUpdate);
      expect(onUpdate).toHaveBeenCalledTimes(1);
      expect(typeof cleanup).toBe('function');
      cleanup();
    } finally {
      globalThis.ResizeObserver = originalResizeObserver;
    }
  });
});

describe('useHoloDecorator Lifecycle and Sync Helpers', () => {
  it('synchronizes element offsets with parent card', () => {
    const setProperty = vi.fn();
    const mockCard = {
      getBoundingClientRect: () => ({
        left: 0,
        top: 0,
        width: 300,
        height: 150,
      }),
    };
    const mockElement = {
      closest: () => mockCard,
      getBoundingClientRect: () => ({
        left: 20,
        top: 10,
        width: 100,
        height: 30,
      }),
      style: { setProperty },
    } as unknown as HTMLElement;

    syncHoloElement(mockElement, { active: true });
    expect(setProperty).toHaveBeenCalledWith('--holo-bg-size-x', '300px');

    syncHoloElement(null, { active: true });
    const noCardEl = { closest: () => null } as unknown as HTMLElement;
    syncHoloElement(noCardEl, { active: true });
  });

  it('creates and cleans up lifecycle observer safely', () => {
    const mockRef = { current: null };
    const cleanupNull = createHoloLifecycle(mockRef, { active: true });
    cleanupNull();

    const cleanupInactive = createHoloLifecycle(mockRef, { active: false });
    cleanupInactive();

    const mockCard = { getBoundingClientRect: () => ({}) };
    const mockEl = {
      closest: () => mockCard,
      getBoundingClientRect: () => ({}),
      style: { setProperty: vi.fn() },
    } as unknown as HTMLDivElement;

    const activeRef = { current: mockEl };
    const cleanupActive = createHoloLifecycle(activeRef, { active: true });
    cleanupActive();

    const noCardRef = {
      current: {
        closest: () => null,
      } as unknown as HTMLDivElement,
    };
    const cleanupNoCard = createHoloLifecycle(noCardRef, { active: true });
    cleanupNoCard();
  });

  it('initializes hook and exposes syncOffsets callback', () => {
    let hookResult: ReturnType<typeof useHoloDecorator> | null = null;
    function Probe() {
      hookResult = useHoloDecorator({ active: true });
      return null;
    }

    renderToStaticMarkup(createElement(Probe));
    expect(hookResult).not.toBeNull();
    hookResult?.syncOffsets();
    hookResult?.handleLifecycle()();
  });
});
