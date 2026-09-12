import { describe, it, expect, vi } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { useNumberPicker } from '../../src/components/atoms/NumberPicker/useNumberPicker.ts';
import type { NumberPickerProps } from '../../src/components/atoms/NumberPicker/NumberPicker.types.ts';

describe('useNumberPicker Hook - Single Mode', () => {
  it('manages single mode stepper actions and input changes', () => {
    const onChange = vi.fn();
    let hookApi: ReturnType<typeof useNumberPicker> | null = null;

    function Probe(props: NumberPickerProps) {
      hookApi = useNumberPicker(props);
      return null;
    }

    renderToStaticMarkup(
      createElement(Probe, {
        value: 10,
        onChange,
        min: 0,
        max: 20,
        step: 2,
      })
    );

    expect(hookApi).not.toBeNull();
    if (!hookApi) return;

    expect(hookApi.isRange).toBe(false);

    hookApi.handleSingleDecrement();
    expect(onChange).toHaveBeenCalledWith(8);

    hookApi.handleSingleIncrement();
    expect(onChange).toHaveBeenCalledWith(12);

    hookApi.handleSingleInputChange('15');
    expect(onChange).toHaveBeenCalledWith(15);
  });
});

describe('useNumberPicker Hook - Range Mode', () => {
  it('manages range mode boundaries and steps the active boundary', () => {
    const onMinChange = vi.fn();
    const onMaxChange = vi.fn();
    let hookApi: ReturnType<typeof useNumberPicker> | null = null;

    function Probe(props: NumberPickerProps) {
      hookApi = useNumberPicker(props);
      return null;
    }

    renderToStaticMarkup(
      createElement(Probe, {
        mode: 'range',
        minValue: 2022,
        maxValue: 2026,
        onMinChange,
        onMaxChange,
      })
    );

    expect(hookApi).not.toBeNull();
    if (!hookApi) return;

    expect(hookApi.isRange).toBe(true);
    expect(hookApi.activeBoundary).toBe('from');
    expect(hookApi.hasValue).toBe(true);

    hookApi.handleRangeIncrement();
    expect(onMinChange).toHaveBeenCalledWith(2023);

    hookApi.handleRangeDecrement();
    expect(onMinChange).toHaveBeenCalledWith(2021);

    hookApi.setActiveBoundary('to');

    hookApi.handleRangeIncrement();
    expect(onMaxChange).toHaveBeenCalledWith(2027);

    hookApi.handleRangeDecrement();
    expect(onMaxChange).toHaveBeenCalledWith(2025);

    hookApi.handleFromChange('2020');
    expect(onMinChange).toHaveBeenCalledWith(2020);

    hookApi.handleToChange('2028');
    expect(onMaxChange).toHaveBeenCalledWith(2028);

    hookApi.handleClear();
    expect(onMinChange).toHaveBeenCalledWith(null);
    expect(onMaxChange).toHaveBeenCalledWith(null);

    hookApi.focusFrom();
    hookApi.focusTo();

    hookApi.handleFromInputChange({
      target: { value: '2021' },
    } as React.ChangeEvent<HTMLInputElement>);
    expect(onMinChange).toHaveBeenCalledWith(2021);

    hookApi.handleToInputChange({
      target: { value: '2029' },
    } as React.ChangeEvent<HTMLInputElement>);
    expect(onMaxChange).toHaveBeenCalledWith(2029);

    hookApi.handleSplitFromChange('2022');
    expect(onMinChange).toHaveBeenCalledWith(2022);
    hookApi.handleSplitFromChange('');
    expect(onMinChange).toHaveBeenCalledWith(null);

    hookApi.handleSplitToChange(2030);
    expect(onMaxChange).toHaveBeenCalledWith(2030);
    hookApi.handleSplitToChange('');
    expect(onMaxChange).toHaveBeenCalledWith(null);
  });
});

describe('useNumberPicker Hook - Focus and Blur', () => {
  it('handles focus, blur, and boundary selection', () => {
    let hookApi: ReturnType<typeof useNumberPicker> | null = null;

    function Probe(props: NumberPickerProps) {
      hookApi = useNumberPicker(props);
      return null;
    }

    renderToStaticMarkup(createElement(Probe, { mode: 'range' }));
    if (!hookApi) return;

    hookApi.setIsFocused(true);
    hookApi.handleContainerFocus();

    const fakeChild = {} as unknown as Node;
    const insideEvent = {
      currentTarget: {
        contains: (n: unknown) => n === fakeChild,
      },
      relatedTarget: fakeChild,
    } as unknown as React.FocusEvent<HTMLElement>;

    hookApi.handleContainerBlur(insideEvent);

    const outsideEvent = {
      currentTarget: {
        contains: () => false,
      },
      relatedTarget: null,
    } as unknown as React.FocusEvent<HTMLElement>;

    hookApi.handleContainerBlur(outsideEvent);
  });
});

describe('useNumberPicker Hook - Uncontrolled Mode', () => {
  it('handles uncontrolled single mode with defaults', () => {
    let hookApi: ReturnType<typeof useNumberPicker> | null = null;
    function Probe(props: NumberPickerProps) {
      hookApi = useNumberPicker(props);
      return null;
    }
    renderToStaticMarkup(createElement(Probe, {}));
    if (!hookApi) return;
    expect(hookApi.effectiveSingleValue).toBe('');
    hookApi.handleSingleIncrement();
    hookApi.handleSingleDecrement();
    hookApi.handleSingleInputChange('7');
  });

  it('handles uncontrolled range mode with defaults', () => {
    let hookApi: ReturnType<typeof useNumberPicker> | null = null;
    function Probe(props: NumberPickerProps) {
      hookApi = useNumberPicker(props);
      return null;
    }
    renderToStaticMarkup(createElement(Probe, { mode: 'range' }));
    if (!hookApi) return;
    expect(hookApi.effectiveMin).toBeNull();
    expect(hookApi.effectiveMax).toBeNull();
    hookApi.handleRangeIncrement();
    hookApi.handleRangeDecrement();
    hookApi.setActiveBoundary('to');
    hookApi.handleRangeIncrement();
    hookApi.handleRangeDecrement();
  });
});
