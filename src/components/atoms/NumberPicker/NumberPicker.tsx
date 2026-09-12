import { forwardRef, type FC, type ReactNode } from 'react';
import { Box } from 'styled-system/jsx';
import { M3eFormField } from '@m3e/react/form-field';
import { M3eIcon } from '@m3e/react/icon';
import '@m3e/icons/rounded/add';
import '@m3e/icons/rounded/remove';

import type { NumberPickerProps } from './NumberPicker.types.ts';
import { useNumberPicker } from './useNumberPicker.ts';
import {
  getRootClassName,
  resolveTestId,
  resolveDisplayValue,
  formatBoundaryLabel,
  resolvePickerLabels,
  renderPrefixIcon,
  resolveSingleStepperHandlers,
} from './numberPickerHelpers.ts';
import {
  M3eTextField,
  renderStepperBtn,
  renderDualRangeInputs,
} from './numberPickerRenderers.ts';
import './numberPicker.css';

export type { NumberPickerProps };

interface SingleViewProps {
  props: NumberPickerProps;
  testId: string;
  hook: ReturnType<typeof useNumberPicker>;
}

const SinglePickerView: FC<SingleViewProps> = ({ props, testId, hook }) => {
  const { decLabel, incLabel } = resolvePickerLabels(props);
  const showBtns = props.showStepButtons !== false;
  const singleVal = hook.effectiveSingleValue ?? '';
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
      {showBtns &&
        renderStepperBtn({
          slot: 'prefix',
          disabled: props.disabled,
          label: decLabel,
          testId: `${testId}-decrement`,
          icon: 'remove',
          onClick: onDec,
        })}
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
      {showBtns &&
        renderStepperBtn({
          slot: 'suffix',
          disabled: props.disabled,
          label: incLabel,
          testId: `${testId}-increment`,
          icon: 'add',
          onClick: onInc,
        })}
    </M3eFormField>
  );
};

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
        {renderStepperBtn({
          disabled: props.disabled,
          label: decLabel,
          testId: `${testId}-decrement`,
          icon: 'remove',
          onClick: hook.handleRangeDecrement,
        })}
      </Box>
      {renderDualRangeInputs(testId, props, hook)}
      <Box slot="suffix" className="number-picker_slot-group">
        {renderStepperBtn({
          disabled: props.disabled,
          label: incLabel,
          testId: `${testId}-increment`,
          icon: 'add',
          onClick: hook.handleRangeIncrement,
        })}
      </Box>
    </M3eFormField>
  );
};

const RangeSplitView: FC<SingleViewProps> = ({ props, testId, hook }) => {
  const minP = props.placeholderMin ?? 'From';
  const maxP = props.placeholderMax ?? 'To';
  const fromAria = formatBoundaryLabel(props.label, minP);
  const toAria = formatBoundaryLabel(props.label, maxP);

  return (
    <Box className="number-picker_split-container" data-testid={testId}>
      <SinglePickerView
        props={{
          ...props,
          value: hook.effectiveMin ?? '',
          label: minP,
          ariaLabel: fromAria,
          placeholder: minP,
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
          label: maxP,
          ariaLabel: toAria,
          placeholder: maxP,
          onChange: hook.handleSplitToChange,
        }}
        hook={hook}
        testId={`${testId}-to`}
      />
    </Box>
  );
};

function resolveContent(
  props: NumberPickerProps,
  hook: ReturnType<typeof useNumberPicker>,
  testId: string
): ReactNode {
  if (!hook.isRange) {
    return <SinglePickerView props={props} testId={testId} hook={hook} />;
  }
  if (props.variant === 'split') {
    return <RangeSplitView props={props} testId={testId} hook={hook} />;
  }
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
