import { describe, it, expect } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Box } from 'styled-system/jsx';
import { HoldButton } from '../../src/components/atoms/HoldButton/HoldButton.tsx';

describe('HoldButton Atom Basic Rendering', () => {
  it('renders native m3e-button inside shape wrapper with svg border overlay', () => {
    const html = renderToStaticMarkup(
      createElement(
        HoldButton,
        {
          ariaLabel: 'Action trigger',
          dataTestId: 'test-hold-btn',
          holdingTime: 1200,
        },
        createElement(Box, { 'data-testid': 'btn-label' })
      )
    );

    expect(html).toContain('hold-button_root');
    expect(html).toContain('override-hold-button');
    expect(html).not.toContain('override-shape-button');
    expect(html).toContain('m3e-shape');
    expect(html).toContain('m3e-button');
    expect(html).toContain('hold-button_border-svg');
    expect(html).toContain('hold-button_border-path');
    expect(html).toContain('pathLength="1000"');
    expect(html).toContain('data-testid="test-hold-btn"');
    expect(html).toContain('data-testid="btn-label"');
  });

  it('renders with default holding, shaking, and completed states', () => {
    const html = renderToStaticMarkup(
      createElement(HoldButton, {
        ariaLabel: 'State button',
        dataTestId: 'state-btn',
      })
    );

    expect(html).toContain('data-holding="false"');
    expect(html).toContain('data-shaking="false"');
    expect(html).toContain('data-completed="false"');
  });

  it('applies custom className alongside base classes', () => {
    const html = renderToStaticMarkup(
      createElement(HoldButton, {
        className: 'custom-hold-button-class',
        ariaLabel: 'Custom class button',
      })
    );
    expect(html).toContain('hold-button_root');
    expect(html).toContain('custom-hold-button-class');
  });
});

describe('HoldButton Expressive Shape Perimeter Paths', () => {
  it('renders custom expressive shapes without rectangle special cases', () => {
    const sunnyHtml = renderToStaticMarkup(
      createElement(HoldButton, {
        shape: 'sunny',
        ariaLabel: 'Sunny hold',
        dataTestId: 'sunny-btn',
      })
    );
    expect(sunnyHtml).toContain('data-shape="sunny"');
    expect(sunnyHtml).toContain('d="M');

    const archHtml = renderToStaticMarkup(
      createElement(HoldButton, {
        shape: 'arch',
        ariaLabel: 'Arch hold',
        dataTestId: 'arch-btn',
      })
    );
    expect(archHtml).toContain('data-shape="arch"');
    expect(archHtml).toContain('d="M');

    const squareHtml = renderToStaticMarkup(
      createElement(HoldButton, {
        shape: 'square',
        ariaLabel: 'Square hold',
        dataTestId: 'square-btn',
      })
    );
    expect(squareHtml).toContain('data-shape="square"');
    expect(squareHtml).toContain('d="M');
  });

  it('normalizes undefined or rounded shape to pill', () => {
    const defaultHtml = renderToStaticMarkup(
      createElement(HoldButton, { ariaLabel: 'Pill hold' })
    );
    expect(defaultHtml).toContain('data-shape="pill"');
  });
});

describe('HoldButton Variants, Sizes and Accessibility', () => {
  it('renders variants and density sizes correctly', () => {
    const html = renderToStaticMarkup(
      createElement(HoldButton, {
        variant: 'outlined',
        size: 'large',
        ariaLabel: 'Outlined button',
      })
    );

    expect(html).toContain('data-variant="outlined"');
    expect(html).toContain('data-size="large"');
    expect(html).toContain('variant="outlined"');
    expect(html).toContain('size="large"');
  });

  it('respects disabled and accessible attributes', () => {
    const html = renderToStaticMarkup(
      createElement(HoldButton, {
        disabled: true,
        ariaLabel: 'Disabled action',
      })
    );

    expect(html).toContain('data-disabled="true"');
    expect(html).toContain('aria-label="Disabled action"');
  });

  it('renders with tokenised borderWidth and borderSpacing', () => {
    const html = renderToStaticMarkup(
      createElement(HoldButton, {
        borderWidth: 'heavy',
        borderSpacing: 'relaxed',
        ariaLabel: 'Spaced action',
      })
    );

    expect(html).toContain('hold-button_border-svg');
    expect(html).toContain('hold-button_border-path');
  });
});
