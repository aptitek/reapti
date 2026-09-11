import { describe, it, expect } from 'vitest';
import { createElement, createRef } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import type { M3eButtonElement } from '@m3e/web/button';
import { Me3Button } from '../../src/components/atoms/Me3Button/Me3Button.tsx';

describe('Me3Button Native & Ref Rendering', () => {
  it('renders native m3e-button with default rounded shape', () => {
    const html = renderToStaticMarkup(
      createElement(Me3Button, { 'aria-label': 'Action Button' })
    );
    expect(html).toContain('m3e-button');
    expect(html).toContain('data-shape="rounded"');
  });

  it('renders native m3e-button with square shape', () => {
    const html = renderToStaticMarkup(
      createElement(Me3Button, {
        shape: 'square',
        'aria-label': 'Square Action',
      })
    );
    expect(html).toContain('m3e-button');
    expect(html).toContain('data-shape="square"');
  });

  it('forwards ref properly without crashing', () => {
    const ref = createRef<M3eButtonElement>();
    const element = createElement(Me3Button, {
      ref,
      'aria-label': 'Ref Button',
    });
    expect(element.props.ref).toBe(ref);
  });
});

describe('Me3Button Expressive Shapes & Target Morphing', () => {
  it('wraps with m3e-shape when an expressive shape is provided', () => {
    const html = renderToStaticMarkup(
      createElement(Me3Button, { shape: 'sunny', 'aria-label': 'Sunny Action' })
    );
    expect(html).toContain('m3e-shape');
    expect(html).toContain('data-shape="sunny"');
    expect(html).toContain('m3e-button');
  });

  it('renders expressive container when targetShape is specified', () => {
    const html = renderToStaticMarkup(
      createElement(Me3Button, {
        shape: 'rounded',
        targetShape: 'sunny',
        'aria-label': 'Morphing Button',
      })
    );
    expect(html).toContain('override-shape-button');
    expect(html).toContain('m3e-shape');
    expect(html).toContain('data-shape="pill"');
  });

  it('preserves initial expressive shape when targetShape is specified', () => {
    const html = renderToStaticMarkup(
      createElement(Me3Button, {
        shape: 'sunny',
        targetShape: 'arch',
        'aria-label': 'Sunny to Arch Button',
      })
    );
    expect(html).toContain('override-shape-button');
    expect(html).toContain('data-shape="sunny"');
  });
});
