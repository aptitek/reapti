import { describe, it, expect, vi } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  renderStepperBtn,
  renderBoundaryInput,
  renderDualRangeInputs,
  useSinglePickerActions,
} from '../../src/components/atoms/NumberPicker/numberPickerRenderers.ts';

describe('numberPickerRenderers - DOM elements', () => {
  it('renders stepper button correctly', () => {
    const html = renderToStaticMarkup(
      renderStepperBtn({
        slot: 'prefix',
        label: 'Decrease value',
        testId: 'test-dec',
        icon: 'remove',
        onClick: vi.fn(),
      }) as React.ReactElement
    );
    expect(html).toContain('number-picker_stepper-btn');
    expect(html).toContain('slot="prefix"');
    expect(html).toContain('aria-label="Decrease value"');
    expect(html).toContain('data-testid="test-dec"');
  });

  it('renders boundary input correctly', () => {
    const html = renderToStaticMarkup(
      renderBoundaryInput({
        boundary: 'from',
        testId: 'split-test',
        autoId: '123',
        activeBoundary: 'from',
        val: 2020,
        placeholder: 'From',
        rangeBounds: { min: 1990, max: 2030, step: 1 },
        onFocus: vi.fn(),
        onChange: vi.fn(),
      }) as React.ReactElement
    );
    expect(html).toContain('data-active="true"');
    expect(html).toContain('value="2020"');
    expect(html).toContain('data-testid="split-test-from"');
  });

  it('renders dual range inputs with arrow separator', () => {
    const html = renderToStaticMarkup(
      renderDualRangeInputs(
        'dual-test',
        { placeholderMin: 'Min Year', placeholderMax: 'Max Year' },
        {
          activeBoundary: 'to',
          autoId: '456',
          effectiveMin: 10,
          effectiveMax: 20,
          rangeBounds: { min: 0, max: 100, step: 5 },
          focusFrom: vi.fn(),
          focusTo: vi.fn(),
          handleFromInputChange: vi.fn(),
          handleToInputChange: vi.fn(),
        }
      ) as React.ReactElement
    );
    expect(html).toContain('number-picker_range-container');
    expect(html).toContain('number-picker_separator');
    expect(html).toContain('aria-label="Min Year"');
  });
});

describe('numberPickerRenderers - useSinglePickerActions hook', () => {
  it('handles single picker actions via probe component', () => {
    const onChange = vi.fn();
    let hookApi: ReturnType<typeof useSinglePickerActions> | null = null;

    function Probe() {
      hookApi = useSinglePickerActions(5, onChange, {
        min: 0,
        max: 10,
        step: 1,
        allowAll: false,
      });
      return null;
    }

    renderToStaticMarkup(createElement(Probe));
    expect(hookApi).not.toBeNull();
    if (!hookApi) return;

    hookApi.handleSingleIncrement();
    expect(onChange).toHaveBeenCalledWith(6);

    hookApi.handleSingleDecrement();
    expect(onChange).toHaveBeenCalledWith(4);

    hookApi.handleSingleInputChange('8');
    expect(onChange).toHaveBeenCalledWith(8);
  });
});
