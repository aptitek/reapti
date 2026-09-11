import { describe, it, expect, vi } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  isInteractiveElement,
  calculateNormalizedCoords,
  calculateTiltAngles,
  calculateSheenPosition,
  applyCardTiltVariables,
  applyCardStaticVariables,
  useFlipCard,
} from '../../src/components/molecules/FlipCard/useFlipCard.ts';

describe('Interactive Element Click Filtering', () => {
  it('identifies interactive elements that should prevent card flipping', () => {
    const mockButton = {
      closest: (sel: string) => (sel.includes('button') ? {} : null),
    } as unknown as EventTarget;
    expect(isInteractiveElement(mockButton)).toBe(true);

    const mockNoFlip = {
      closest: (sel: string) => (sel.includes('[data-no-flip]') ? {} : null),
    } as unknown as EventTarget;
    expect(isInteractiveElement(mockNoFlip)).toBe(true);

    const mockPlain = {
      closest: () => null,
    } as unknown as EventTarget;
    expect(isInteractiveElement(mockPlain)).toBe(false);

    expect(isInteractiveElement(null)).toBe(false);
  });
});

describe('Coordinate Normalization and Tilt Mathematics', () => {
  it('normalizes coordinates relative to card center with clamping', () => {
    const rect = {
      left: 100,
      top: 50,
      width: 200,
      height: 100,
    } as DOMRect;

    const center = calculateNormalizedCoords(200, 100, rect);
    expect(center.normX).toBeCloseTo(0);
    expect(center.normY).toBeCloseTo(0);

    const topLeft = calculateNormalizedCoords(100, 50, rect);
    expect(topLeft.normX).toBeCloseTo(-0.5);
    expect(topLeft.normY).toBeCloseTo(-0.5);

    const outside = calculateNormalizedCoords(500, 500, rect);
    expect(outside.normX).toBe(0.5);
    expect(outside.normY).toBe(0.5);
  });

  it('calculates 3D tilt angles according to tiltStrength multiplier', () => {
    const baseAngles = calculateTiltAngles(0.5, -0.5, 1);
    expect(baseAngles.rotateX).toBe(15);
    expect(baseAngles.rotateY).toBe(15);

    const doubledAngles = calculateTiltAngles(0.5, -0.5, 2);
    expect(doubledAngles.rotateX).toBe(30);
    expect(doubledAngles.rotateY).toBe(30);

    const zeroAngles = calculateTiltAngles(0.5, -0.5, 0);
    expect(zeroAngles.rotateX).toBe(0);
    expect(zeroAngles.rotateY).toBe(0);
  });

  it('computes lighting sheen coordinates across card surface', () => {
    const centerSheen = calculateSheenPosition(0, 0);
    expect(centerSheen.sheenX).toBe(50);
    expect(centerSheen.sheenY).toBe(50);

    const rightSheen = calculateSheenPosition(0.5, 0.5);
    expect(rightSheen.sheenX).toBe(0);
    expect(rightSheen.sheenY).toBe(0);
  });
});

describe('Card Variable Application', () => {
  it('applies tilt and static variables to container style', () => {
    const setProperty = vi.fn();
    const mockContainer = {
      style: { setProperty },
    } as unknown as HTMLElement;

    applyCardTiltVariables(
      mockContainer,
      { rotateX: 10, rotateY: -10 },
      { sheenX: 25, sheenY: 75 }
    );
    expect(setProperty).toHaveBeenCalledWith(
      '--flip-card-rotate-x',
      '10.00deg'
    );
    expect(setProperty).toHaveBeenCalledWith(
      '--flip-card-rotate-y',
      '-10.00deg'
    );
    expect(setProperty).toHaveBeenCalledWith('--sheen-x', '25%');
    expect(setProperty).toHaveBeenCalledWith('--mouse-x', '25%');

    applyCardStaticVariables(mockContainer, {
      ratio: '1.5',
      holoMaskImage: 'mask.svg',
      isFlipped: true,
    });
    expect(setProperty).toHaveBeenCalledWith(
      '--flip-card-flip-angle',
      '180deg'
    );
    expect(setProperty).toHaveBeenCalledWith('--flip-card-ratio', '1.5');
    expect(setProperty).toHaveBeenCalledWith(
      '--holo-mask-image',
      'url("mask.svg")'
    );
  });

  it('handles linear gradient masks without wrapping in url()', () => {
    const setProperty = vi.fn();
    const mockContainer = {
      style: { setProperty },
    } as unknown as HTMLElement;

    applyCardStaticVariables(mockContainer, {
      holoMaskImage: 'linear-gradient(to right, black, transparent)',
      isFlipped: false,
    });
    expect(setProperty).toHaveBeenCalledWith(
      '--holo-mask-image',
      'linear-gradient(to right, black, transparent)'
    );
  });

  it('handles null container in variable helpers safely', () => {
    expect(() =>
      applyCardTiltVariables(
        null,
        { rotateX: 0, rotateY: 0 },
        { sheenX: 50, sheenY: 50 }
      )
    ).not.toThrow();
    expect(() =>
      applyCardStaticVariables(null, { isFlipped: false })
    ).not.toThrow();
  });
});

describe('useFlipCard Hook Logic and Pointer Physics', () => {
  it('handles pointer movements when element ref is attached', () => {
    let hookApi: ReturnType<typeof useFlipCard> | null = null;
    const setProperty = vi.fn();

    const mockElement = {
      getBoundingClientRect: () => ({
        left: 0,
        top: 0,
        width: 200,
        height: 100,
      }),
      style: { setProperty },
    } as unknown as HTMLDivElement;

    function Probe() {
      hookApi = useFlipCard({
        interactive: true,
        hasBackContent: true,
        tiltStrength: 1,
      });
      if (hookApi.cardRef.current === null) {
        (
          hookApi.cardRef as {
            current: HTMLDivElement | null;
          }
        ).current = mockElement;
      }
      return null;
    }

    renderToStaticMarkup(createElement(Probe));
    expect(hookApi).not.toBeNull();
    if (!hookApi) return;

    hookApi.handleMouseMove({ clientX: 100, clientY: 50 } as never);
    expect(setProperty).toHaveBeenCalledWith(
      '--flip-card-rotate-x',
      expect.stringContaining('deg')
    );

    hookApi.handleMouseLeave();
    expect(setProperty).toHaveBeenCalledWith('--flip-card-rotate-x', '0.00deg');

    hookApi.handleClick({ target: {} } as never);
    const mockInteractive = {
      closest: (sel: string) => (sel.includes('button') ? {} : null),
    };
    hookApi.handleClick({ target: mockInteractive } as never);

    const preventDefault = vi.fn();
    hookApi.handleKeyDown({ key: ' ', preventDefault } as never);
    expect(preventDefault).toHaveBeenCalled();
  });
});

describe('useFlipCard Interaction and Controlled Mode', () => {
  it('ignores click and flip when non-interactive or target is interactive', () => {
    let hookApi: ReturnType<typeof useFlipCard> | null = null;
    const onFlip = vi.fn();

    function Probe() {
      hookApi = useFlipCard({
        interactive: false,
        hasBackContent: false,
        onFlip,
      });
      return null;
    }

    renderToStaticMarkup(createElement(Probe));
    expect(hookApi).not.toBeNull();
    if (!hookApi) return;

    hookApi.toggleFlip();
    expect(onFlip).not.toHaveBeenCalled();

    const interactiveTarget = {
      closest: (sel: string) => (sel.includes('button') ? {} : null),
    };
    hookApi.handleClick({ target: interactiveTarget } as never);
    expect(onFlip).not.toHaveBeenCalled();
  });

  it('manages controlled mode without updating internal state', () => {
    let hookApi: ReturnType<typeof useFlipCard> | null = null;
    const onFlip = vi.fn();

    function Probe() {
      hookApi = useFlipCard({
        interactive: true,
        hasBackContent: true,
        isFlipped: true,
        onFlip,
      });
      return null;
    }

    renderToStaticMarkup(createElement(Probe));
    expect(hookApi).not.toBeNull();
    if (!hookApi) return;

    expect(hookApi.isFlipped).toBe(true);
    hookApi.toggleFlip();
    expect(onFlip).toHaveBeenCalledWith(false);

    hookApi.handleClick({ target: {} } as never);
    expect(onFlip).toHaveBeenCalledWith(false);

    const preventDefault = vi.fn();
    hookApi.handleKeyDown({ key: 'Enter', preventDefault } as never);
    expect(preventDefault).toHaveBeenCalled();

    hookApi.handleKeyDown({ key: 'Escape', preventDefault: vi.fn() } as never);
    hookApi.syncVariables();
  });
});
