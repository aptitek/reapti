import { describe, it, expect } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Box } from 'styled-system/jsx';
import { NumberPicker } from '../../src/components/atoms/NumberPicker/NumberPicker.tsx';

describe('NumberPicker Atom (Single Mode)', () => {
  it('renders single picker with M3e form field, input and stepper buttons', () => {
    const html = renderToStaticMarkup(
      createElement(NumberPicker, {
        value: 12,
        label: 'Quantity',
        dataTestId: 'test-single',
      })
    );

    expect(html).toContain('number-picker_root');
    expect(html).toContain('override-number-picker');
    expect(html).toContain('data-mode="single"');
    expect(html).toContain('m3e-form-field');
    expect(html).toContain('Quantity');
    expect(html).toContain('value="12"');
    expect(html).toContain('data-testid="test-single-decrement"');
    expect(html).toContain('data-testid="test-single-increment"');
    expect(html).toContain('m3e-icon');
  });

  it('renders with placeholder and suppresses stepper buttons when showStepButtons is false', () => {
    const html = renderToStaticMarkup(
      createElement(NumberPicker, {
        value: '',
        placeholder: 'All',
        showStepButtons: false,
        dataTestId: 'test-no-buttons',
      })
    );

    expect(html).toContain('placeholder="All"');
    expect(html).not.toContain('data-testid="test-no-buttons-decrement"');
    expect(html).not.toContain('data-testid="test-no-buttons-increment"');
  });

  it('respects disabled, density size and fullWidth props', () => {
    const html = renderToStaticMarkup(
      createElement(NumberPicker, {
        disabled: true,
        size: 'medium',
        fullWidth: true,
        dataTestId: 'test-disabled',
      })
    );

    expect(html).toContain('data-disabled="true"');
    expect(html).toContain('data-size="medium"');
    expect(html).toContain('data-full-width="true"');
  });

  it('supports custom className and ariaLabel in single mode', () => {
    const html = renderToStaticMarkup(
      createElement(NumberPicker, {
        value: 5,
        ariaLabel: 'Custom Counter',
        className: 'my-custom-picker',
      })
    );
    expect(html).toContain('my-custom-picker');
    expect(html).toContain('aria-label="Custom Counter"');
  });
});

describe('NumberPicker Atom (Range Mode Unified Variant)', () => {
  it('renders with floating label and custom boundary placeholders', () => {
    const html = renderToStaticMarkup(
      createElement(NumberPicker, {
        mode: 'range',
        label: 'Production Period',
        placeholderMin: 'Start Year',
        placeholderMax: 'End Year',
        dataTestId: 'range-placeholders',
      })
    );
    expect(html).toContain('Production Period');
    expect(html).toContain('placeholder="Start Year"');
    expect(html).toContain('placeholder="End Year"');
  });

  it('renders dual inputs with separator, stepper buttons, and clear button when valued', () => {
    const html = renderToStaticMarkup(
      createElement(NumberPicker, {
        mode: 'range',
        minValue: 2021,
        maxValue: 2027,
        dataTestId: 'range-test',
      })
    );

    expect(html).toContain('data-mode="range"');
    expect(html).toContain('data-variant="unified"');
    expect(html).toContain('data-testid="range-test-from"');
    expect(html).toContain('value="2021"');
    expect(html).toContain('data-testid="range-test-to"');
    expect(html).toContain('value="2027"');
    expect(html).toContain('data-testid="range-test-decrement"');
    expect(html).toContain('data-testid="range-test-increment"');
    expect(html).toContain('number-picker_separator');
  });

  it('auto-detects range mode from props and supports startYear aliases', () => {
    const html = renderToStaticMarkup(
      createElement(NumberPicker, {
        startYearMin: 2019,
        startYearMax: 2024,
        dataTestId: 'range-alias',
      })
    );

    expect(html).toContain('data-mode="range"');
    expect(html).toContain('value="2019"');
    expect(html).toContain('value="2024"');
  });
});

describe('NumberPicker Atom (Range Mode Unified Variant - Options and Icons)', () => {
  it('does not render clear button by design', () => {
    const html = renderToStaticMarkup(
      createElement(NumberPicker, {
        mode: 'range',
        minValue: 2020,
        maxValue: 2025,
        dataTestId: 'range-check-no-clear',
      })
    );
    expect(html).not.toContain(
      'data-testid="range-check-no-clear-clear-button"'
    );
  });

  it('handles icon customization (custom icon vs suppressed with null)', () => {
    const withIconHtml = renderToStaticMarkup(
      createElement(NumberPicker, {
        mode: 'range',
        icon: createElement(Box, { 'data-testid': 'custom-calendar' }),
        dataTestId: 'range-icon-test',
      })
    );
    expect(withIconHtml).toContain('data-testid="custom-calendar"');

    const suppressedIconHtml = renderToStaticMarkup(
      createElement(NumberPicker, {
        mode: 'range',
        icon: null,
        dataTestId: 'range-no-icon',
      })
    );
    expect(suppressedIconHtml).not.toContain('data-testid="range-icon"');
  });
});

describe('NumberPicker Atom (Range Mode Split Variant)', () => {
  it('renders two separate SinglePickerViews with arrow separator', () => {
    const html = renderToStaticMarkup(
      createElement(NumberPicker, {
        mode: 'range',
        variant: 'split',
        minValue: 2022,
        maxValue: 2026,
        dataTestId: 'split-test',
      })
    );

    expect(html).toContain('number-picker_split-container');
    expect(html).toContain('data-variant="split"');
    expect(html).toContain('data-testid="split-test-from"');
    expect(html).toContain('data-testid="split-test-to"');
    expect(html).toContain('data-testid="split-test-from-decrement"');
    expect(html).toContain('data-testid="split-test-from-increment"');
    expect(html).toContain('data-testid="split-test-to-decrement"');
    expect(html).toContain('data-testid="split-test-to-increment"');
  });

  it('supports custom placeholders, labels, and empty boundary values', () => {
    const html = renderToStaticMarkup(
      createElement(NumberPicker, {
        mode: 'range',
        variant: 'split',
        label: 'Price Range',
        placeholderMin: 'Min Price',
        placeholderMax: 'Max Price',
        dataTestId: 'split-custom',
      })
    );

    expect(html).toContain('placeholder="Min Price"');
    expect(html).toContain('placeholder="Max Price"');
    expect(html).toContain('aria-label="Price Range (Min Price)"');
    expect(html).toContain('aria-label="Price Range (Max Price)"');
  });
});
