import { describe, it, expect, vi } from 'vitest';
import { createElement, createRef } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import type { M3eButtonElement } from '@m3e/web/button';
import {
  HoldButton,
  HoldBorderOverlay,
} from '../../src/components/atoms/HoldButton/HoldButton.tsx';

describe('HoldButton Basic & Ref Rendering', () => {
  it('renders hold button with inner Me3Button and default shape', () => {
    const handleComplete = vi.fn();
    const html = renderToStaticMarkup(
      createElement(HoldButton, {
        onHoldComplete: handleComplete,
        'aria-label': 'Hold to Confirm',
      })
    );
    expect(html).toContain('m3e-button');
    expect(html).toContain('data-shape="rounded"');
  });

  it('renders expressive shape button when shape is provided', () => {
    const handleComplete = vi.fn();
    const html = renderToStaticMarkup(
      createElement(HoldButton, {
        shape: 'sunny',
        onHoldComplete: handleComplete,
        'aria-label': 'Hold Sunny',
      })
    );
    expect(html).toContain('m3e-shape');
    expect(html).toContain('data-shape="sunny"');
  });

  it('forwards ref properly to M3eButtonElement', () => {
    const ref = createRef<M3eButtonElement>();
    const handleComplete = vi.fn();
    const element = createElement(HoldButton, {
      ref,
      onHoldComplete: handleComplete,
      'aria-label': 'Ref Hold Button',
    });
    expect(element.props.ref).toBe(ref);
  });
});

describe('HoldBorderOverlay States & Overrides', () => {
  it('renders with custom dimensions and outline parameters', () => {
    const handleComplete = vi.fn();
    const html = renderToStaticMarkup(
      createElement(HoldButton, {
        width: 200,
        height: 50,
        outlineGap: 6,
        borderThickness: 3,
        onHoldComplete: handleComplete,
        'aria-label': 'Custom Dimension Hold',
      })
    );
    expect(html).toContain('w_215px');
    expect(html).toContain('h_65px');
  });

  it('renders HoldBorderOverlay in active holding state', () => {
    const holdingHtml = renderToStaticMarkup(
      createElement(HoldBorderOverlay, {
        shape: 'sunny',
        dimensions: { width: 48, height: 48 },
        outlineGap: 4,
        borderThickness: 2.5,
        isHolding: true,
        holdTime: 800,
      })
    );
    expect(holdingHtml).toContain('stk-do_0');
    expect(holdingHtml).toContain('op_1');
    expect(holdingHtml).toContain('800ms');
  });
});
