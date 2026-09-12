import {
  createElement,
  forwardRef,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { Box, type BoxProps } from 'styled-system/jsx';
import { M3eIconButton } from '@m3e/react/icon-button';
import { M3eIcon } from '@m3e/react/icon';
import type {
  NumberPickerProps,
  StepperBtnProps,
  RangeStepBounds,
  SingleStepOptions,
} from './NumberPicker.types.ts';
import {
  computeDecrementedValue,
  computeIncrementedValue,
  parseSingleNumberInput,
} from './numberPickerHelpers.ts';

export const M3eTextField = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>((props, ref) => createElement('input', { ref, ...props }));
M3eTextField.displayName = 'M3eTextField';

export function renderStepperBtn(btn: StepperBtnProps): ReactNode {
  return createElement(
    M3eIconButton,
    {
      slot: btn.slot,
      variant: 'standard',
      size: 'small',
      className: 'number-picker_stepper-btn',
      disabled: btn.disabled,
      'aria-label': btn.label,
      'data-testid': btn.testId,
      onClick: btn.onClick,
    } as Record<string, unknown>,
    createElement(M3eIcon, { name: btn.icon, variant: 'rounded' })
  );
}

export interface BoundaryRenderOptions {
  boundary: 'from' | 'to';
  testId: string;
  autoId: string;
  activeBoundary: string;
  val: number | null;
  placeholder?: string;
  disabled?: boolean;
  rangeBounds: RangeStepBounds;
  onFocus: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function renderBoundaryInput(opts: BoundaryRenderOptions): ReactNode {
  return createElement(
    Box,
    {
      as: 'span',
      className: 'number-picker_sub-input-wrapper',
      'data-active': opts.activeBoundary === opts.boundary,
    } as unknown as BoxProps,
    createElement('input', {
      id: `${opts.testId}-${opts.boundary}-${opts.autoId}`,
      type: 'number',
      className: 'number-picker_sub-input',
      value: opts.val ?? '',
      placeholder: opts.placeholder,
      disabled: opts.disabled,
      min: opts.rangeBounds.min,
      max: opts.rangeBounds.max,
      step: opts.rangeBounds.step,
      'aria-label': opts.placeholder,
      'data-testid': `${opts.testId}-${opts.boundary}`,
      onFocus: opts.onFocus,
      onChange: opts.onChange,
    })
  );
}

export interface DualRangeRenderContext {
  activeBoundary: string;
  autoId: string;
  effectiveMin: number | null;
  effectiveMax: number | null;
  rangeBounds: RangeStepBounds;
  focusFrom: () => void;
  focusTo: () => void;
  handleFromInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleToInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function renderDualRangeInputs(
  testId: string,
  props: NumberPickerProps,
  hook: DualRangeRenderContext
): ReactNode {
  return createElement(
    Box,
    { className: 'number-picker_range-container' } as unknown as BoxProps,
    renderBoundaryInput({
      boundary: 'from',
      testId,
      autoId: hook.autoId,
      activeBoundary: hook.activeBoundary,
      val: hook.effectiveMin,
      placeholder: props.placeholderMin ?? 'From',
      disabled: props.disabled,
      rangeBounds: hook.rangeBounds,
      onFocus: hook.focusFrom,
      onChange: hook.handleFromInputChange,
    }),
    createElement(
      Box,
      {
        as: 'span',
        className: 'number-picker_separator',
        'aria-hidden': 'true',
      } as unknown as BoxProps,
      createElement(M3eIcon, { name: 'arrow_forward', variant: 'rounded' })
    ),
    renderBoundaryInput({
      boundary: 'to',
      testId,
      autoId: hook.autoId,
      activeBoundary: hook.activeBoundary,
      val: hook.effectiveMax,
      placeholder: props.placeholderMax ?? 'To',
      disabled: props.disabled,
      rangeBounds: hook.rangeBounds,
      onFocus: hook.focusTo,
      onChange: hook.handleToInputChange,
    })
  );
}

export function useSinglePickerActions(
  value: number | string | undefined,
  onChange: ((v: number | string) => void) | undefined,
  singleConfig: SingleStepOptions
) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<number | string>(
    value ?? ''
  );
  const effectiveSingleValue = isControlled ? value : internalValue;

  const handleSingleDecrement = useCallback(() => {
    const next = computeDecrementedValue(
      effectiveSingleValue || 'all',
      singleConfig
    );
    if (!isControlled) setInternalValue(next);
    onChange?.(next);
  }, [onChange, effectiveSingleValue, singleConfig, isControlled]);

  const handleSingleIncrement = useCallback(() => {
    const next = computeIncrementedValue(
      effectiveSingleValue || 'all',
      singleConfig
    );
    if (!isControlled) setInternalValue(next);
    onChange?.(next);
  }, [onChange, effectiveSingleValue, singleConfig, isControlled]);

  const handleSingleInputChange = useCallback(
    (raw: string) => {
      const next = parseSingleNumberInput(raw, singleConfig);
      if (!isControlled) setInternalValue(next);
      onChange?.(next);
    },
    [onChange, singleConfig, isControlled]
  );

  return {
    effectiveSingleValue,
    handleSingleDecrement,
    handleSingleIncrement,
    handleSingleInputChange,
  };
}
