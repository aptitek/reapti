import { createElement, type ReactNode } from 'react';
import { Box, type BoxProps } from 'styled-system/jsx';
import type { NumberPickerProps } from './NumberPicker.types.ts';

export interface SingleStepOptions {
  min: number;
  max: number;
  step: number;
  allowAll: boolean;
}

export interface RangeStepBounds {
  min: number;
  max: number;
  step: number;
}

export interface RangeStepOptions {
  bounds: RangeStepBounds;
  otherVal: number | null;
}

function hasRangeHandlers(props: NumberPickerProps): boolean {
  return Boolean(
    props.onMinChange ||
    props.onMaxChange ||
    props.onStartYearMinChange ||
    props.onStartYearMaxChange
  );
}

function hasRangeValues(props: NumberPickerProps): boolean {
  return (
    props.minValue !== undefined ||
    props.maxValue !== undefined ||
    props.startYearMin !== undefined ||
    props.startYearMax !== undefined
  );
}

export function checkIsRangeMode(props: NumberPickerProps): boolean {
  if (props.mode === 'range') return true;
  if (props.mode === 'single') return false;
  return hasRangeHandlers(props) || hasRangeValues(props);
}

export function computeDecrementedValue(
  current: number | string,
  options: SingleStepOptions
): number | string {
  if (current === 'all' || current === '' || current === null) {
    return options.min;
  }
  const numeric = Number(current);
  if (numeric > options.min) {
    return numeric - options.step;
  }
  return options.allowAll ? 'all' : options.min;
}

export function computeIncrementedValue(
  current: number | string,
  options: SingleStepOptions
): number | string {
  if (current === 'all' || current === '' || current === null) {
    return options.min + options.step;
  }
  const numeric = Number(current);
  if (numeric < options.max) {
    return numeric + options.step;
  }
  return numeric;
}

export function parseSingleNumberInput(
  raw: string,
  options: SingleStepOptions
): number | string {
  const trimmed = raw.trim();
  if (trimmed === '' || trimmed.toLowerCase() === 'all') {
    return options.allowAll ? 'all' : options.min;
  }
  const parsed = parseInt(trimmed, 10);
  if (!Number.isNaN(parsed) && parsed >= options.min && parsed <= options.max) {
    return parsed;
  }
  return options.allowAll ? 'all' : options.min;
}

export function parseNumberInput(text: string): number | null {
  const trimmed = text.trim();
  if (!trimmed) return null;
  const num = parseInt(trimmed, 10);
  return Number.isNaN(num) ? null : num;
}

export function getDefaultInitialYear(min: number, max: number): number {
  const currentYear = new Date().getFullYear();
  if (currentYear >= min && currentYear <= max) {
    return currentYear;
  }
  return min;
}

export function computeStepValue(
  current: number | null,
  direction: 'increment' | 'decrement',
  options: RangeStepOptions
): number {
  const { bounds, otherVal } = options;
  if (current === null) {
    if (otherVal !== null) {
      return direction === 'increment'
        ? otherVal
        : Math.max(bounds.min, otherVal - bounds.step);
    }
    return getDefaultInitialYear(bounds.min, bounds.max);
  }

  if (direction === 'increment') {
    return current + bounds.step <= bounds.max
      ? current + bounds.step
      : bounds.max;
  }
  return current - bounds.step >= bounds.min
    ? current - bounds.step
    : bounds.min;
}

export function resolveEffectiveRangeValues(props: NumberPickerProps) {
  const effectiveMin = props.minValue ?? props.startYearMin ?? null;
  const effectiveMax = props.maxValue ?? props.startYearMax ?? null;
  const handleMinChange = props.onMinChange ?? props.onStartYearMinChange;
  const handleMaxChange = props.onMaxChange ?? props.onStartYearMaxChange;
  const hasValue = effectiveMin !== null || effectiveMax !== null;
  return {
    effectiveMin,
    effectiveMax,
    handleMinChange,
    handleMaxChange,
    hasValue,
  };
}

export function resolveDisplayValue(
  value: number | string | undefined
): string {
  if (
    value === 'all' ||
    value === '' ||
    value === null ||
    value === undefined
  ) {
    return '';
  }
  return String(value);
}

export function resolveTestId(
  props: NumberPickerProps,
  fallback: string
): string {
  return props.dataTestId ?? props.testId ?? props['data-testid'] ?? fallback;
}

export function formatBoundaryLabel(
  label: string | undefined,
  placeholder: string
): string {
  if (!label) return placeholder;
  return `${label} (${placeholder})`;
}

export function resolvePickerLabels(props: NumberPickerProps) {
  return {
    decLabel: props.decreaseAriaLabel ?? 'Decrease',
    incLabel: props.increaseAriaLabel ?? 'Increase',
  };
}

export function renderPrefixIcon(
  icon: ReactNode | null | undefined
): ReactNode {
  if (icon === null) return null;
  if (icon !== undefined) {
    return createElement(
      Box,
      { className: 'number-picker_prefix-icon' } as unknown as BoxProps,
      icon
    );
  }
  return createElement(Box, {
    className: 'number-picker_prefix-icon',
    'data-testid': 'range-icon',
  } as unknown as BoxProps);
}

export const DEFAULT_SINGLE_CONFIG: SingleStepOptions = {
  min: 0,
  max: 2100,
  step: 1,
  allowAll: true,
};

export const DEFAULT_RANGE_BOUNDS: RangeStepBounds = {
  min: 1900,
  max: 2100,
  step: 1,
};

function stepBoundary(
  value: number | string | undefined,
  direction: 'inc' | 'dec',
  props: Pick<NumberPickerProps, 'step' | 'min' | 'max'>
): number {
  const current = typeof value === 'number' ? value : Number(value);
  const min = props.min ?? 0;
  const max = props.max ?? 2100;
  const step = props.step ?? 1;
  const base = Number.isNaN(current) ? min : current;
  const delta = direction === 'inc' ? step : -step;
  return Math.min(max, Math.max(min, base + delta));
}

export interface SingleStepperHandlers {
  val: number | string;
  onDec: () => void;
  onInc: () => void;
  onInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function resolveSingleStepperHandlers(
  props: NumberPickerProps,
  singleVal: number | string,
  handlers: {
    dec: () => void;
    inc: () => void;
    input: (val: string) => void;
  }
): SingleStepperHandlers {
  if (props.mode === 'range') {
    return {
      val: props.value ?? '',
      onDec: () => props.onChange?.(stepBoundary(props.value, 'dec', props)),
      onInc: () => props.onChange?.(stepBoundary(props.value, 'inc', props)),
      onInput: (e) => props.onChange?.(e.target.value),
    };
  }
  return {
    val: singleVal,
    onDec: handlers.dec,
    onInc: handlers.inc,
    onInput: (e) => handlers.input(e.target.value),
  };
}
