import { describe, it, expect } from 'vitest';
import type {
  NumberPickerProps,
  NumberPickerMode,
  RangePickerVariant,
  NumberPickerSize,
  ActiveBoundary,
} from '../../src/components/atoms/NumberPicker/NumberPicker.types.ts';

describe('NumberPicker Type Contract Verification', () => {
  it('supports all valid NumberPickerModes', () => {
    const modes: NumberPickerMode[] = ['single', 'range'];
    expect(modes).toHaveLength(2);
  });

  it('supports all valid RangePickerVariants', () => {
    const variants: RangePickerVariant[] = ['unified', 'split'];
    expect(variants).toHaveLength(2);
  });

  it('supports all valid NumberPickerSizes', () => {
    const sizes: NumberPickerSize[] = ['small', 'medium'];
    expect(sizes).toHaveLength(2);
  });

  it('supports all valid ActiveBoundaries', () => {
    const boundaries: ActiveBoundary[] = ['from', 'to'];
    expect(boundaries).toHaveLength(2);
  });

  it('constructs a valid NumberPickerProps object for single mode', () => {
    const props: NumberPickerProps = {
      mode: 'single',
      value: 42,
      min: 0,
      max: 100,
      step: 5,
      showStepButtons: true,
      allowAll: false,
      size: 'small',
      disabled: false,
      dataTestId: 'test-single-picker',
    };
    expect(props.mode).toBe('single');
    expect(props.value).toBe(42);
    expect(props.step).toBe(5);
  });

  it('constructs a valid NumberPickerProps object for range mode', () => {
    const props: NumberPickerProps = {
      mode: 'range',
      variant: 'unified',
      minValue: 2020,
      maxValue: 2026,
      placeholderMin: 'Start',
      placeholderMax: 'End',
      clearable: true,
      startYearMin: 2020,
      startYearMax: 2026,
      size: 'medium',
      dataTestId: 'test-range-picker',
    };
    expect(props.mode).toBe('range');
    expect(props.variant).toBe('unified');
    expect(props.minValue).toBe(2020);
    expect(props.maxValue).toBe(2026);
  });
});
