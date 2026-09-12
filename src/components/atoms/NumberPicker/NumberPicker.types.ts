import type { ReactNode } from 'react';

export type NumberPickerMode = 'single' | 'range';
export type RangePickerVariant = 'unified' | 'split';
export type ActiveBoundary = 'from' | 'to';
export type NumberPickerSize = 'small' | 'medium';

interface SingleNumberPickerProps {
  /**
   * Numeric or string value for single mode.
   * @default "all"
   */
  value?: number | string;

  /**
   * Callback invoked when single value changes.
   */
  onChange?: (value: number | string) => void;

  /**
   * Floating label for the form field.
   */
  label?: string;

  /**
   * Placeholder string.
   */
  placeholder?: string;

  /**
   * Minimum allowed value.
   * @default 0
   */
  min?: number;

  /**
   * Maximum allowed value.
   * @default 2100
   */
  max?: number;

  /**
   * Step increment/decrement amount.
   * @default 1
   */
  step?: number;

  /**
   * Whether to display - and + stepper buttons.
   * @default true
   */
  showStepButtons?: boolean;

  /**
   * Whether empty/minimum value can cycle to "all".
   * @default true
   */
  allowAll?: boolean;
}

interface RangeNumberPickerProps {
  /**
   * Lower boundary value for range mode.
   */
  minValue?: number | null;

  /**
   * Upper boundary value for range mode.
   */
  maxValue?: number | null;

  /**
   * Callback invoked when lower boundary changes.
   */
  onMinChange?: (value: number | null) => void;

  /**
   * Callback invoked when upper boundary changes.
   */
  onMaxChange?: (value: number | null) => void;

  /**
   * Placeholder for the lower boundary input.
   * @default "From"
   */
  placeholderMin?: string;

  /**
   * Placeholder for the upper boundary input.
   * @default "To"
   */
  placeholderMax?: string;

  /**
   * Leading icon element rendered in prefix slot. If null, suppressed.
   */
  icon?: ReactNode;

  /**
   * Whether to show a clear button when range has a value.
   * @default true
   */
  clearable?: boolean;

  /**
   * Backward-compatibility alias for minValue.
   */
  startYearMin?: number | null;

  /**
   * Backward-compatibility alias for maxValue.
   */
  startYearMax?: number | null;

  /**
   * Backward-compatibility alias for onMinChange.
   */
  onStartYearMinChange?: (year: number | null) => void;

  /**
   * Backward-compatibility alias for onMaxChange.
   */
  onStartYearMaxChange?: (year: number | null) => void;
}

interface CommonNumberPickerProps {
  /**
   * DOM id for input element.
   */
  id?: string;

  /**
   * Form field name attribute.
   */
  name?: string;

  /**
   * Operating mode: single value or range bounds.
   * Auto-detected if range props are passed.
   * @default "single"
   */
  mode?: NumberPickerMode;

  /**
   * Visual layout variant for range mode:
   * - "unified": Single M3e outline with dual inner inputs
   * - "split": Two separate linked fields
   * @default "unified"
   */
  variant?: RangePickerVariant;

  /**
   * Density/size variant.
   * @default "small"
   */
  size?: NumberPickerSize;

  /**
   * Whether the control is disabled.
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether the field expands to 100% container width.
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Custom min-width specification.
   */
  minWidth?: number | string;

  /**
   * Custom max-width specification.
   */
  maxWidth?: number | string;

  /**
   * Additional CSS class name.
   */
  className?: string;

  /**
   * Primary test ID.
   */
  dataTestId?: string;

  /**
   * Alias test ID.
   */
  testId?: string;

  /**
   * Data-testid attribute alias.
   */
  'data-testid'?: string;

  /**
   * Accessible label for main input.
   */
  ariaLabel?: string;

  /**
   * Accessible label for decrement button.
   */
  decreaseAriaLabel?: string;

  /**
   * Accessible label for increment button.
   */
  increaseAriaLabel?: string;

  /**
   * Accessible label for clear button.
   */
  clearAriaLabel?: string;
}

export type NumberPickerProps = CommonNumberPickerProps &
  SingleNumberPickerProps &
  RangeNumberPickerProps;
