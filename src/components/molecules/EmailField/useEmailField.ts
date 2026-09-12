import {
  useState,
  useCallback,
  type FocusEvent,
  type MouseEvent,
  type ChangeEvent,
} from 'react';
import type { EmailFieldProps } from './EmailField.types.ts';
import {
  cleanDomainString,
  sanitizeLocalPart,
  parseAutofillInput,
} from './emailFieldHelpers.ts';

function getInitialLocal(
  props: EmailFieldProps,
  isControlled: boolean
): string {
  const source = isControlled
    ? (props.value ?? '')
    : (props.defaultValue ?? '');
  return sanitizeLocalPart(source);
}

function useFocusHandlers(
  onFocus?: (e: FocusEvent<HTMLInputElement>) => void,
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void
) {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const handleFocus = useCallback(
    (e: FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    },
    [onFocus]
  );
  const handleBlur = useCallback(
    (e: FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    },
    [onBlur]
  );
  return { isFocused, handleFocus, handleBlur };
}

export function useEmailField(props: EmailFieldProps) {
  const isControlled = props.value !== undefined;
  const domain = cleanDomainString(props.domain);
  const initialLocal = getInitialLocal(props, isControlled);

  const [uncontrolledLocal, setUncontrolledLocal] =
    useState<string>(initialLocal);
  const [autoFillError, setAutoFillError] = useState<string | null>(null);
  const { isFocused, handleFocus, handleBlur } = useFocusHandlers(
    props.onFocus,
    props.onBlur
  );

  const currentLocal = isControlled
    ? sanitizeLocalPart(props.value ?? '')
    : uncontrolledLocal;
  const fullEmail = currentLocal ? `${currentLocal}@${domain}` : '';
  const hasValue = currentLocal.length > 0;

  const handleInputChange = useCallback(
    (valueOrEvent: string | ChangeEvent<HTMLInputElement>) => {
      const rawValue =
        typeof valueOrEvent === 'string'
          ? valueOrEvent
          : valueOrEvent.target.value;
      const { cleanLocal, errorMsg } = parseAutofillInput(rawValue, domain);
      setAutoFillError(errorMsg);
      if (!isControlled) setUncontrolledLocal(cleanLocal);
      const composite = cleanLocal ? `${cleanLocal}@${domain}` : '';
      props.onEmailChange?.(composite, cleanLocal);
      props.onChange?.(composite);
    },
    [domain, isControlled, props]
  );

  const handleClear = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setAutoFillError(null);
      if (!isControlled) setUncontrolledLocal('');
      props.onEmailChange?.('', '');
      props.onChange?.('');
    },
    [isControlled, props]
  );

  return {
    normalizedDomain: domain,
    currentLocal,
    fullEmail,
    hasValue,
    autoFillError,
    isFocused,
    handleInputChange,
    handleClear,
    handleFocus,
    handleBlur,
  };
}
