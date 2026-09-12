import {
  forwardRef,
  createElement,
  useId,
  type FC,
  type ReactNode,
  type MouseEvent,
  type ChangeEvent,
  type FocusEvent,
} from 'react';
import { Box, type BoxProps } from 'styled-system/jsx';
import { M3eFormField } from '@m3e/react/form-field';
import { M3eIcon } from '@m3e/react/icon';
import { M3eIconButton } from '@m3e/react/icon-button';
import '@m3e/icons/rounded/mail';
import '@m3e/icons/rounded/cancel';
import '@m3e/icons/rounded/lock';

import type { EmailFieldProps } from './EmailField.types.ts';
import { useEmailField } from './useEmailField.ts';
import {
  resolveEmailFieldConfig,
  DEFAULT_EMAIL_LABELS,
  type EmailFieldConfig,
} from './emailFieldHelpers.ts';
import './emailField.css';

export type { EmailFieldProps };

const AT_SYMBOL = '@';

interface StartAdornmentProps {
  icon: ReactNode | null | undefined;
}

const EmailStartAdornment: FC<StartAdornmentProps> = ({ icon }) => {
  if (icon === null) return null;
  return createElement(
    Box,
    { slot: 'prefix', className: 'email-field_prefix' } as unknown as BoxProps,
    icon ?? createElement(M3eIcon, { name: 'mail', variant: 'rounded' })
  );
};

interface EndAdornmentProps {
  props: EmailFieldProps;
  testId: string;
  domain: string;
  canClear: boolean;
  onClear: (event: MouseEvent<HTMLElement>) => void;
}

const EmailEndAdornment: FC<EndAdornmentProps> = ({
  props,
  testId,
  domain,
  canClear,
  onClear,
}) => {
  const clearLabel = props.clearAriaLabel ?? DEFAULT_EMAIL_LABELS.clearPrefix;
  const lockAria =
    props.domainAriaLabel ??
    `${DEFAULT_EMAIL_LABELS.fixedDomainAria} @${domain}`;

  return (
    <Box
      slot="suffix"
      className="email-field_suffix"
      data-testid={`${testId}-suffix`}
    >
      <Box as="span" className="email-field_divider" aria-hidden="true" />
      <Box as="span" className="email-field_domain-badge" aria-label={lockAria}>
        <Box as="span">{AT_SYMBOL}</Box>
        <Box as="span" className="email-field_domain-text">
          {domain}
        </Box>
      </Box>
      {canClear &&
        createElement(
          M3eIconButton,
          {
            size: 'small',
            variant: 'standard',
            className: 'email-field_clear-btn',
            'aria-label': clearLabel,
            tabIndex: -1,
            'data-testid': `${testId}-clear`,
            onClick: onClear,
          } as Record<string, unknown>,
          createElement(M3eIcon, { name: 'cancel', variant: 'rounded' })
        )}
      {props.showDomainLock !== false && !canClear && (
        <Box
          as="span"
          className="email-field_lock-icon"
          aria-label={lockAria}
          data-testid={`${testId}-lock`}
        >
          <M3eIcon name="lock" variant="rounded" />
        </Box>
      )}
    </Box>
  );
};

interface InputControlProps {
  cfg: EmailFieldConfig;
  name?: string;
  readOnly?: boolean;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onFocus: (e: FocusEvent<HTMLInputElement>) => void;
  onBlur: (e: FocusEvent<HTMLInputElement>) => void;
}

const EmailInputControl: FC<InputControlProps> = (props) => {
  return createElement('input', {
    id: props.cfg.inputId,
    name: props.name,
    type: 'text',
    className: 'email-field_input',
    value: props.value,
    placeholder: props.cfg.placeholder,
    disabled: props.cfg.disabled,
    readOnly: props.readOnly,
    'aria-label': props.cfg.inputAria,
    'data-testid': `${props.cfg.testId}-input`,
    onChange: props.onChange,
    onFocus: props.onFocus,
    onBlur: props.onBlur,
  });
};

export const EmailField = forwardRef<HTMLDivElement, EmailFieldProps>(
  (props, ref) => {
    const autoId = useId();
    const hook = useEmailField(props);
    const cfg = resolveEmailFieldConfig({
      props,
      autoId,
      hasValue: hook.hasValue,
      autoFillError: hook.autoFillError,
    });

    return (
      <Box
        ref={ref}
        className={cfg.rootClass}
        data-size={cfg.size}
        data-variant={cfg.variant}
        data-full-width={cfg.fullWidth}
        data-disabled={cfg.disabled}
        data-focused={hook.isFocused}
        data-error={cfg.isError}
        data-testid={`${cfg.testId}-wrapper`}
      >
        <M3eFormField
          variant={cfg.variant}
          floatLabel="always"
          data-testid={cfg.testId}
        >
          {props.label &&
            createElement(
              'label',
              { slot: 'label', htmlFor: cfg.inputId },
              props.label
            )}
          <EmailStartAdornment icon={props.leadingIcon} />
          <EmailInputControl
            cfg={cfg}
            name={props.name}
            readOnly={props.readOnly}
            value={hook.currentLocal}
            onChange={hook.handleInputChange}
            onFocus={hook.handleFocus}
            onBlur={hook.handleBlur}
          />
          <EmailEndAdornment
            props={props}
            testId={cfg.testId}
            domain={hook.normalizedDomain}
            canClear={cfg.canClear}
            onClear={hook.handleClear}
          />
          {cfg.helperText && (
            <Box slot={cfg.helperSlot} className="email-field_helper">
              {cfg.helperText}
            </Box>
          )}
        </M3eFormField>
      </Box>
    );
  }
);

EmailField.displayName = 'EmailField';
