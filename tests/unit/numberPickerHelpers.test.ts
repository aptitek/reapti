import { describe, it, expect, vi } from 'vitest';
import {
  checkIsRangeMode,
  computeDecrementedValue,
  computeIncrementedValue,
  parseSingleNumberInput,
  parseNumberInput,
  getDefaultInitialYear,
  computeStepValue,
  resolveEffectiveRangeValues,
  resolveDisplayValue,
  resolveTestId,
  formatBoundaryLabel,
  resolvePickerLabels,
  renderPrefixIcon,
  resolveSingleStepperHandlers,
  DEFAULT_RANGE_BOUNDS,
} from '../../src/components/atoms/NumberPicker/numberPickerHelpers.ts';

describe('numberPickerHelpers - checkIsRangeMode', () => {
  it('returns true when mode is explicitly range', () => {
    expect(checkIsRangeMode({ mode: 'range' })).toBe(true);
  });

  it('returns false when mode is explicitly single even if range props exist', () => {
    expect(checkIsRangeMode({ mode: 'single', minValue: 10 })).toBe(false);
  });

  it('auto-detects range mode when range values or handlers are provided', () => {
    expect(checkIsRangeMode({ minValue: 2020 })).toBe(true);
    expect(checkIsRangeMode({ maxValue: 2025 })).toBe(true);
    expect(checkIsRangeMode({ startYearMin: 2020 })).toBe(true);
    expect(checkIsRangeMode({ startYearMax: 2025 })).toBe(true);
    expect(checkIsRangeMode({ onMinChange: () => {} })).toBe(true);
    expect(checkIsRangeMode({ onMaxChange: () => {} })).toBe(true);
    expect(checkIsRangeMode({ onStartYearMinChange: () => {} })).toBe(true);
    expect(checkIsRangeMode({ onStartYearMaxChange: () => {} })).toBe(true);
  });

  it('defaults to false when no range props are provided', () => {
    expect(checkIsRangeMode({ value: 5 })).toBe(false);
    expect(checkIsRangeMode({})).toBe(false);
  });
});

describe('numberPickerHelpers - computeDecrementedValue & computeIncrementedValue', () => {
  const config = { min: 10, max: 20, step: 2, allowAll: true };

  it('decrements numeric value by step until min, then goes to all if allowed', () => {
    expect(computeDecrementedValue(16, config)).toBe(14);
    expect(computeDecrementedValue(12, config)).toBe(10);
    expect(computeDecrementedValue(10, config)).toBe('all');
  });

  it('decrements to min if allowAll is false', () => {
    expect(computeDecrementedValue(10, { ...config, allowAll: false })).toBe(
      10
    );
  });

  it('decrements from all or empty to min', () => {
    expect(computeDecrementedValue('all', config)).toBe(10);
    expect(computeDecrementedValue('', config)).toBe(10);
  });

  it('increments numeric value by step until max', () => {
    expect(computeIncrementedValue(12, config)).toBe(14);
    expect(computeIncrementedValue(18, config)).toBe(20);
    expect(computeIncrementedValue(20, config)).toBe(20);
  });

  it('increments from all or empty to min + step', () => {
    expect(computeIncrementedValue('all', config)).toBe(12);
    expect(computeIncrementedValue('', config)).toBe(12);
  });
});

describe('numberPickerHelpers - parseSingleNumberInput & parseNumberInput', () => {
  const config = { min: 5, max: 50, step: 1, allowAll: true };

  it('parses valid numeric strings within bounds', () => {
    expect(parseSingleNumberInput('25', config)).toBe(25);
    expect(parseSingleNumberInput('5', config)).toBe(5);
    expect(parseSingleNumberInput('50', config)).toBe(50);
  });

  it('handles all / empty / out of bounds inputs', () => {
    expect(parseSingleNumberInput('all', config)).toBe('all');
    expect(parseSingleNumberInput('  ', config)).toBe('all');
    expect(parseSingleNumberInput('999', config)).toBe('all');
    expect(parseSingleNumberInput('1', config)).toBe('all');
    expect(parseSingleNumberInput('abc', config)).toBe('all');
    expect(parseSingleNumberInput('999', { ...config, allowAll: false })).toBe(
      5
    );
  });

  it('parseNumberInput parses valid integers or returns null', () => {
    expect(parseNumberInput('2024')).toBe(2024);
    expect(parseNumberInput('')).toBeNull();
    expect(parseNumberInput('invalid')).toBeNull();
  });
});

describe('numberPickerHelpers - computeStepValue & getDefaultInitialYear', () => {
  it('returns current year if within range or min', () => {
    const year = new Date().getFullYear();
    expect(getDefaultInitialYear(1900, 2100)).toBe(year);
    expect(getDefaultInitialYear(3000, 3100)).toBe(3000);
  });

  it('steps value up and down respecting bounds', () => {
    const bounds = DEFAULT_RANGE_BOUNDS;
    expect(
      computeStepValue(2020, 'increment', { bounds, otherVal: null })
    ).toBe(2021);
    expect(
      computeStepValue(2020, 'decrement', { bounds, otherVal: null })
    ).toBe(2019);
    expect(
      computeStepValue(2100, 'increment', { bounds, otherVal: null })
    ).toBe(2100);
    expect(
      computeStepValue(1900, 'decrement', { bounds, otherVal: null })
    ).toBe(1900);
  });

  it('handles null values using otherVal or default initial year', () => {
    const bounds = DEFAULT_RANGE_BOUNDS;
    expect(
      computeStepValue(null, 'increment', { bounds, otherVal: 2024 })
    ).toBe(2024);
    expect(
      computeStepValue(null, 'decrement', { bounds, otherVal: 2024 })
    ).toBe(2023);
    const year = new Date().getFullYear();
    expect(
      computeStepValue(null, 'increment', { bounds, otherVal: null })
    ).toBe(year);
  });
});

describe('numberPickerHelpers - resolveEffectiveRangeValues & display formatting', () => {
  it('resolves effective range values and handlers', () => {
    const onMin = () => {};
    const onMax = () => {};
    const res = resolveEffectiveRangeValues({
      minValue: 2021,
      maxValue: 2025,
      onMinChange: onMin,
      onMaxChange: onMax,
    });
    expect(res.effectiveMin).toBe(2021);
    expect(res.effectiveMax).toBe(2025);
    expect(res.handleMinChange).toBe(onMin);
    expect(res.handleMaxChange).toBe(onMax);
    expect(res.hasValue).toBe(true);
  });

  it('falls back to startYear aliases', () => {
    const res = resolveEffectiveRangeValues({
      startYearMin: 2018,
      startYearMax: 2022,
    });
    expect(res.effectiveMin).toBe(2018);
    expect(res.effectiveMax).toBe(2022);
    expect(res.hasValue).toBe(true);
  });

  it('resolves display value correctly', () => {
    expect(resolveDisplayValue('all')).toBe('');
    expect(resolveDisplayValue('')).toBe('');
    expect(resolveDisplayValue(undefined)).toBe('');
    expect(resolveDisplayValue(null as unknown as undefined)).toBe('');
    expect(resolveDisplayValue(42)).toBe('42');
  });

  it('resolves test ID priority', () => {
    expect(resolveTestId({ dataTestId: 'main' }, 'fallback')).toBe('main');
    expect(resolveTestId({ testId: 'second' }, 'fallback')).toBe('second');
    expect(resolveTestId({ 'data-testid': 'third' }, 'fallback')).toBe('third');
    expect(resolveTestId({}, 'fallback')).toBe('fallback');
  });

  it('formats boundary labels', () => {
    expect(formatBoundaryLabel('Year', 'From')).toBe('Year (From)');
    expect(formatBoundaryLabel(undefined, 'From')).toBe('From');
    expect(formatBoundaryLabel('', 'To')).toBe('To');
  });
});

describe('numberPickerHelpers - resolvePickerLabels & stepper handlers', () => {
  it('resolves picker labels from accessible label props', () => {
    expect(resolvePickerLabels({})).toEqual({
      decLabel: 'Decrease',
      incLabel: 'Increase',
    });
    expect(
      resolvePickerLabels({
        decreaseAriaLabel: 'Minus',
        increaseAriaLabel: 'Plus',
      })
    ).toEqual({
      decLabel: 'Minus',
      incLabel: 'Plus',
    });
  });

  it('renders prefix icons or returns null', () => {
    expect(renderPrefixIcon(null)).toBeNull();
    expect(renderPrefixIcon('custom-icon')).not.toBeNull();
    expect(renderPrefixIcon(undefined)).not.toBeNull();
  });

  it('resolves single stepper handlers for single and range mode', () => {
    const dec = vi.fn();
    const inc = vi.fn();
    const input = vi.fn();
    const single = resolveSingleStepperHandlers(
      { mode: 'single', value: 10 },
      10,
      { dec, inc, input }
    );
    single.onDec();
    expect(dec).toHaveBeenCalledTimes(1);
    single.onInc();
    expect(inc).toHaveBeenCalledTimes(1);
    single.onInput({
      target: { value: '15' },
    } as React.ChangeEvent<HTMLInputElement>);
    expect(input).toHaveBeenCalledWith('15');

    const onChange = vi.fn();
    const range = resolveSingleStepperHandlers(
      { mode: 'range', value: 10, min: 0, max: 20, step: 2, onChange },
      10,
      { dec, inc, input }
    );
    range.onDec();
    expect(onChange).toHaveBeenCalledWith(8);
    range.onInc();
    expect(onChange).toHaveBeenCalledWith(12);
    range.onInput({
      target: { value: '14' },
    } as React.ChangeEvent<HTMLInputElement>);
    expect(onChange).toHaveBeenCalledWith('14');
  });
});
