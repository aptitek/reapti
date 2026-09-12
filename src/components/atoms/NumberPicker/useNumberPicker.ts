import { useState, useRef, useCallback, useMemo, useId } from 'react';
import type {
  NumberPickerProps,
  ActiveBoundary,
} from './NumberPicker.types.ts';
import type {
  SingleStepOptions,
  RangeStepBounds,
} from './numberPickerHelpers.ts';
import {
  checkIsRangeMode,
  computeDecrementedValue,
  computeIncrementedValue,
  parseSingleNumberInput,
  parseNumberInput,
  computeStepValue,
  resolveEffectiveRangeValues,
  DEFAULT_SINGLE_CONFIG,
  DEFAULT_RANGE_BOUNDS,
} from './numberPickerHelpers.ts';

function useSinglePickerActions(
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

interface RangePickerActionsOptions {
  activeRef: React.RefObject<ActiveBoundary>;
  initialMin: number | null;
  initialMax: number | null;
  bounds: RangeStepBounds;
  onMin?: (v: number | null) => void;
  onMax?: (v: number | null) => void;
}

function useRangePickerActions(options: RangePickerActionsOptions) {
  const { activeRef, initialMin, initialMax, bounds, onMin, onMax } = options;
  const [internalMin, setInternalMin] = useState<number | null>(initialMin);
  const [internalMax, setInternalMax] = useState<number | null>(initialMax);

  const effectiveMin = initialMin !== undefined ? initialMin : internalMin;
  const effectiveMax = initialMax !== undefined ? initialMax : internalMax;

  const updateMin = useCallback(
    (val: number | null) => {
      setInternalMin(val);
      onMin?.(val);
    },
    [onMin]
  );

  const updateMax = useCallback(
    (val: number | null) => {
      setInternalMax(val);
      onMax?.(val);
    },
    [onMax]
  );

  const stepRange = useCallback(
    (direction: 'increment' | 'decrement') => {
      const isFrom = activeRef.current === 'from';
      const current = isFrom ? effectiveMin : effectiveMax;
      const other = isFrom ? effectiveMax : effectiveMin;
      const next = computeStepValue(current, direction, {
        bounds,
        otherVal: other,
      });
      if (isFrom) updateMin(next);
      else updateMax(next);
    },
    [activeRef, effectiveMin, effectiveMax, bounds, updateMin, updateMax]
  );

  const handleRangeDecrement = useCallback(
    () => stepRange('decrement'),
    [stepRange]
  );
  const handleRangeIncrement = useCallback(
    () => stepRange('increment'),
    [stepRange]
  );

  return {
    effectiveMin,
    effectiveMax,
    updateMin,
    updateMax,
    handleRangeDecrement,
    handleRangeIncrement,
  };
}

function usePickerFocusAndBoundary() {
  const [activeBoundary, setActiveBoundaryState] =
    useState<ActiveBoundary>('from');
  const [isFocused, setIsFocusedState] = useState(false);
  const activeBoundaryRef = useRef<ActiveBoundary>('from');
  const isFocusedRef = useRef(false);

  const setActiveBoundary = useCallback((b: ActiveBoundary) => {
    activeBoundaryRef.current = b;
    setActiveBoundaryState(b);
  }, []);

  const setIsFocused = useCallback((f: boolean) => {
    isFocusedRef.current = f;
    setIsFocusedState(f);
  }, []);

  const handleContainerFocus = useCallback(() => {
    isFocusedRef.current = true;
    setIsFocusedState(true);
  }, []);

  const handleContainerBlur = useCallback(
    (e: React.FocusEvent<HTMLElement>) => {
      if (!e.currentTarget?.contains(e.relatedTarget as Node | null)) {
        isFocusedRef.current = false;
        setIsFocusedState(false);
      }
    },
    []
  );

  const focusFrom = useCallback(
    () => setActiveBoundary('from'),
    [setActiveBoundary]
  );
  const focusTo = useCallback(
    () => setActiveBoundary('to'),
    [setActiveBoundary]
  );

  return {
    activeBoundary,
    activeBoundaryRef,
    isFocused,
    setActiveBoundary,
    setIsFocused,
    handleContainerFocus,
    handleContainerBlur,
    focusFrom,
    focusTo,
  };
}

function useBoundaryInputHandlers(
  updateMin: (v: number | null) => void,
  updateMax: (v: number | null) => void
) {
  const handleFromInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      updateMin(parseNumberInput(e.target.value)),
    [updateMin]
  );
  const handleToInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      updateMax(parseNumberInput(e.target.value)),
    [updateMax]
  );
  const handleSplitFromChange = useCallback(
    (v: number | string) => updateMin(v === '' ? null : Number(v)),
    [updateMin]
  );
  const handleSplitToChange = useCallback(
    (v: number | string) => updateMax(v === '' ? null : Number(v)),
    [updateMax]
  );
  const handleFromChange = useCallback(
    (r: string) => updateMin(parseNumberInput(r)),
    [updateMin]
  );
  const handleToChange = useCallback(
    (r: string) => updateMax(parseNumberInput(r)),
    [updateMax]
  );
  const handleClear = useCallback(() => {
    updateMin(null);
    updateMax(null);
  }, [updateMin, updateMax]);

  return {
    handleFromInputChange,
    handleToInputChange,
    handleSplitFromChange,
    handleSplitToChange,
    handleFromChange,
    handleToChange,
    handleClear,
  };
}

export function useNumberPicker(props: NumberPickerProps) {
  const autoId = useId();
  const isRange = checkIsRangeMode(props);
  const focusBoundary = usePickerFocusAndBoundary();

  const singleConfig = useMemo(
    () => ({
      min: props.min ?? DEFAULT_SINGLE_CONFIG.min,
      max: props.max ?? DEFAULT_SINGLE_CONFIG.max,
      step: props.step ?? DEFAULT_SINGLE_CONFIG.step,
      allowAll: props.allowAll ?? DEFAULT_SINGLE_CONFIG.allowAll,
    }),
    [props.min, props.max, props.step, props.allowAll]
  );

  const rangeBounds = useMemo(
    () => ({
      min: props.min ?? DEFAULT_RANGE_BOUNDS.min,
      max: props.max ?? DEFAULT_RANGE_BOUNDS.max,
      step: props.step ?? DEFAULT_RANGE_BOUNDS.step,
    }),
    [props.min, props.max, props.step]
  );

  const rangeValues = resolveEffectiveRangeValues(props);
  const singleActions = useSinglePickerActions(
    props.value,
    props.onChange,
    singleConfig
  );
  const rangeActions = useRangePickerActions({
    activeRef: focusBoundary.activeBoundaryRef,
    initialMin: rangeValues.effectiveMin,
    initialMax: rangeValues.effectiveMax,
    bounds: rangeBounds,
    onMin: rangeValues.handleMinChange,
    onMax: rangeValues.handleMaxChange,
  });

  const { effectiveMin, effectiveMax, updateMin, updateMax } = rangeActions;
  const inputHandlers = useBoundaryInputHandlers(updateMin, updateMax);

  return {
    autoId,
    isRange,
    hasValue: effectiveMin !== null || effectiveMax !== null,
    singleConfig,
    rangeBounds,
    ...focusBoundary,
    ...singleActions,
    ...rangeActions,
    ...inputHandlers,
  };
}
