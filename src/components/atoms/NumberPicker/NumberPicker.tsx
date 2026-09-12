import { forwardRef, createElement, type FC, type ReactNode } from 'react';
import { Box } from 'styled-system/jsx';
import { M3eFormField } from '@m3e/react/form-field';
import { M3eIconButton } from '@m3e/react/icon-button';
import { M3eIcon } from '@m3e/react/icon';
import '@m3e/icons/rounded/add';
import '@m3e/icons/rounded/remove';

import type { NumberPickerProps } from './NumberPicker.types.ts';
import { useNumberPicker } from './useNumberPicker.ts';
import {
  resolveTestId,
  resolveDisplayValue,
  formatBoundaryLabel,
  resolvePickerLabels,
  renderPrefixIcon,
  resolveSingleStepperHandlers,
} from './numberPickerHelpers.ts';
import './numberPicker.css';

export type { NumberPickerProps };

const M3eTextField = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>((props, ref) => createElement('input', { ref, ...props }));
M3eTextField.displayName = 'M3eTextField';

type StepperBtnProps = {
  slot?: 'prefix' | 'suffix';
  disabled?: boolean;
  label: string;
  testId: string;
  icon: 'add' | 'remove';
  onClick: () => void;
};
const StepperBtn: FC<StepperBtnProps> = ({
  slot,
  disabled,
  label,
  testId,
  icon,
  onClick,
}) => (
  <M3eIconButton
    slot={slot}
    variant="standard"
    size="small"
    className="number-picker_stepper-btn"
    disabled={disabled}
    aria-label={label}
    data-testid={testId}
    onClick={onClick}
  >
    <M3eIcon name={icon} variant="rounded" />
  </M3eIconButton>
);

interface SingleViewProps {
  props: NumberPickerProps;
  testId: string;
  hook: ReturnType<typeof useNumberPicker>;
}

const SinglePickerView: FC<SingleViewProps> = ({ props, testId, hook }) => {
  const { decLabel, incLabel } = resolvePickerLabels(props);
  const showBtns = props.showStepButtons !== false;
  const singleVal = hook.effectiveSingleValue ?? props.value ?? '';
  const { val, onDec, onInc, onInput } = resolveSingleStepperHandlers(
    props,
    singleVal,
    {
      dec: hook.handleSingleDecrement,
      inc: hook.handleSingleIncrement,
      input: hook.handleSingleInputChange,
    }
  );

  return (
    <M3eFormField
      variant="outlined"
      floatLabel="always"
      hideSubscript="always"
      hide-subscript="always"
      data-testid={testId}
    >
      {props.label && (
        <Box as="label" slot="label">
          {props.label}
        </Box>
      )}
      {showBtns && (
        <StepperBtn
          slot="prefix"
          disabled={props.disabled}
          label={decLabel}
          testId={`${testId}-decrement`}
          icon="remove"
          onClick={onDec}
        />
      )}
      <M3eTextField
        type="number"
        id={props.id}
        name={props.name}
        className="number-picker_single-input"
        value={resolveDisplayValue(val)}
        placeholder={props.placeholder}
        disabled={props.disabled}
        aria-label={props.ariaLabel ?? props.label}
        min={hook.singleConfig.min}
        max={hook.singleConfig.max}
        step={hook.singleConfig.step}
        onChange={onInput}
      />
      {showBtns && (
        <StepperBtn
          slot="suffix"
          disabled={props.disabled}
          label={incLabel}
          testId={`${testId}-increment`}
          icon="add"
          onClick={onInc}
        />
      )}
    </M3eFormField>
  );
};

const BoundaryInput: FC<{
  boundary: 'from' | 'to';
  testId: string;
  hook: ReturnType<typeof useNumberPicker>;
  placeholder?: string;
  disabled?: boolean;
}> = ({ boundary, testId, hook, placeholder, disabled }) => {
  const isFrom = boundary === 'from';
  return (
    <Box
      as="span"
      className="number-picker_sub-input-wrapper"
      data-active={hook.activeBoundary === boundary}
    >
      <M3eTextField
        id={`${testId}-${boundary}-${hook.autoId}`}
        type="number"
        className="number-picker_sub-input"
        value={(isFrom ? hook.effectiveMin : hook.effectiveMax) ?? ''}
        placeholder={placeholder}
        disabled={disabled}
        min={hook.rangeBounds.min}
        max={hook.rangeBounds.max}
        step={hook.rangeBounds.step}
        aria-label={placeholder}
        data-testid={`${testId}-${boundary}`}
        onFocus={isFrom ? hook.focusFrom : hook.focusTo}
        onChange={
          isFrom ? hook.handleFromInputChange : hook.handleToInputChange
        }
      />
    </Box>
  );
};

const DualRangeInputs: FC<{
  testId: string;
  props: NumberPickerProps;
  hook: ReturnType<typeof useNumberPicker>;
}> = ({ testId, props, hook }) => (
  <Box className="number-picker_range-container">
    <BoundaryInput
      boundary="from"
      testId={testId}
      hook={hook}
      placeholder={props.placeholderMin ?? 'From'}
      disabled={props.disabled}
    />
    <Box as="span" className="number-picker_separator" aria-hidden="true">
      <M3eIcon name="arrow_forward" variant="rounded" />
    </Box>
    <BoundaryInput
      boundary="to"
      testId={testId}
      hook={hook}
      placeholder={props.placeholderMax ?? 'To'}
      disabled={props.disabled}
    />
  </Box>
);

const RangeUnifiedView: FC<SingleViewProps> = ({ props, testId, hook }) => {
  const { decLabel, incLabel } = resolvePickerLabels(props);

  return (
    <M3eFormField
      variant="outlined"
      floatLabel="always"
      hideSubscript="always"
      hide-subscript="always"
      data-testid={testId}
      onFocus={hook.handleContainerFocus}
      onBlur={hook.handleContainerBlur}
    >
      {props.label && (
        <Box as="label" slot="label">
          {props.label}
        </Box>
      )}
      <Box slot="prefix" className="number-picker_slot-group">
        {renderPrefixIcon(props.icon)}
        <StepperBtn
          disabled={props.disabled}
          label={decLabel}
          testId={`${testId}-decrement`}
          icon="remove"
          onClick={hook.handleRangeDecrement}
        />
      </Box>
      <DualRangeInputs testId={testId} props={props} hook={hook} />
      <Box slot="suffix" className="number-picker_slot-group">
        <StepperBtn
          disabled={props.disabled}
          label={incLabel}
          testId={`${testId}-increment`}
          icon="add"
          onClick={hook.handleRangeIncrement}
        />
      </Box>
    </M3eFormField>
  );
};

const RangeSplitView: FC<SingleViewProps> = ({ props, testId, hook }) => (
  <Box className="number-picker_split-container" data-testid={testId}>
    <SinglePickerView
      props={{
        ...props,
        value: hook.effectiveMin ?? '',
        label: formatBoundaryLabel(props.label, props.placeholderMin ?? 'From'),
        placeholder: props.placeholderMin ?? 'From',
        onChange: hook.handleSplitFromChange,
      }}
      hook={hook}
      testId={`${testId}-from`}
    />
    <Box as="span" className="number-picker_separator" aria-hidden="true">
      <M3eIcon name="arrow_forward" variant="rounded" />
    </Box>
    <SinglePickerView
      props={{
        ...props,
        value: hook.effectiveMax ?? '',
        label: formatBoundaryLabel(props.label, props.placeholderMax ?? 'To'),
        placeholder: props.placeholderMax ?? 'To',
        onChange: hook.handleSplitToChange,
      }}
      hook={hook}
      testId={`${testId}-to`}
    />
  </Box>
);

function getRootClassName(customClassName?: string): string {
  const base = 'number-picker_root override-number-picker';
  return customClassName ? `${base} ${customClassName}` : base;
}

function resolveContent(
  props: NumberPickerProps,
  hook: ReturnType<typeof useNumberPicker>,
  testId: string
): ReactNode {
  if (!hook.isRange)
    return <SinglePickerView props={props} testId={testId} hook={hook} />;
  if (props.variant === 'split')
    return <RangeSplitView props={props} testId={testId} hook={hook} />;
  return <RangeUnifiedView props={props} testId={testId} hook={hook} />;
}

export const NumberPicker = forwardRef<HTMLDivElement, NumberPickerProps>(
  (props, ref) => {
    const hook = useNumberPicker(props);
    const testId = resolveTestId(props, 'number-picker');

    return (
      <Box
        ref={ref}
        className={getRootClassName(props.className)}
        data-mode={hook.isRange ? 'range' : 'single'}
        data-variant={props.variant ?? 'unified'}
        data-size={props.size ?? 'small'}
        data-disabled={props.disabled ?? false}
        data-full-width={props.fullWidth ?? false}
        data-testid={`${testId}-wrapper`}
      >
        {resolveContent(props, hook, testId)}
      </Box>
    );
  }
);

NumberPicker.displayName = 'NumberPicker';
