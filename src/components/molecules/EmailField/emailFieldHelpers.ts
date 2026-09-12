import type { ReactNode } from 'react';
import type {
  EmailFieldProps,
  EmailFieldSize,
  EmailFieldMetrics,
  EmailFieldVariant,
} from './EmailField.types.ts';

export const DEFAULT_DOMAIN = 'example.com';

export const DEFAULT_EMAIL_LABELS = {
  clearPrefix: 'Clear prefix',
  fixedDomain: 'Fixed institutional domain',
  fixedDomainAria: 'Fixed domain',
  usernamePlaceholder: 'username',
  noAtAllowed: "Do not enter '@'. Domain is added automatically.",
  autofillAdjusted: 'Autofilled domain was adjusted to institutional domain.',
};

export function cleanDomainString(domain?: string): string {
  if (!domain) return DEFAULT_DOMAIN;
  const stripped = domain.replace(/^@+/, '').trim().toLowerCase();
  return stripped || DEFAULT_DOMAIN;
}

export function sanitizeLocalPart(rawInput: string): string {
  const cleaned = rawInput.trim();
  if (cleaned.includes('@')) {
    return cleaned.split('@')[0];
  }
  return cleaned;
}

export interface AutofillParseResult {
  cleanLocal: string;
  errorMsg: string | null;
}

export function parseAutofillInput(
  rawValue: string,
  normalizedDomain: string
): AutofillParseResult {
  if (!rawValue.includes('@')) {
    return { cleanLocal: rawValue.trim(), errorMsg: null };
  }

  const parts = rawValue.split('@');
  const cleanLocal = parts[0].trim();
  const enteredDomain = parts.slice(1).join('@').trim();

  if (enteredDomain.length === 0) {
    const errorMsg = `${DEFAULT_EMAIL_LABELS.noAtAllowed} (@${normalizedDomain})`;
    return { cleanLocal, errorMsg };
  }

  const cleanedEntered = cleanDomainString(enteredDomain);
  if (cleanedEntered !== normalizedDomain) {
    const errorMsg = `${DEFAULT_EMAIL_LABELS.autofillAdjusted} (@${cleanedEntered} -> @${normalizedDomain})`;
    return { cleanLocal, errorMsg };
  }

  return { cleanLocal, errorMsg: null };
}

export interface ResolveHelperOptions {
  error?: boolean;
  errorText?: string;
  supportingText?: string;
  helperText?: ReactNode;
  autoFillError?: string | null;
}

export function resolveHelperContent(
  options: ResolveHelperOptions
): ReactNode | undefined {
  if (options.autoFillError) return options.autoFillError;
  if (options.error && options.errorText) return options.errorText;
  return options.supportingText ?? options.helperText;
}

export function isEmailClearable(
  props: EmailFieldProps,
  hasValue: boolean
): boolean {
  if (props.showClearButton === false) return false;
  if (!hasValue || props.disabled || props.readOnly) return false;
  return !props.showDomainLock;
}

export function getFieldMetrics(
  sizePreset: EmailFieldSize = 'medium'
): EmailFieldMetrics {
  if (sizePreset === 'small') {
    return { iconSize: 18, clearBtnSize: 16, lockIconSize: 16 };
  }
  return { iconSize: 20, clearBtnSize: 18, lockIconSize: 18 };
}

export function resolveTestId(
  props: EmailFieldProps,
  fallback = 'email-field'
): string {
  return props.dataTestId ?? props.testId ?? props['data-testid'] ?? fallback;
}

export function getRootClassName(className?: string): string {
  const base = 'email-field_root override-email-field';
  return className ? `${base} ${className}` : base;
}

interface EmailFieldModifiers {
  size: EmailFieldSize;
  variant: EmailFieldVariant;
  fullWidth: boolean;
  disabled: boolean;
  inputAria: string | undefined;
}

function resolveFieldModifiers(props: EmailFieldProps): EmailFieldModifiers {
  return {
    size: props.size ?? 'medium',
    variant: props.variant ?? 'outlined',
    fullWidth: props.fullWidth ?? false,
    disabled: props.disabled ?? false,
    inputAria: typeof props.label === 'string' ? props.label : undefined,
  };
}

export interface EmailFieldConfig extends EmailFieldModifiers {
  inputId: string;
  testId: string;
  rootClass: string;
  canClear: boolean;
  isError: boolean;
  helperText: ReactNode | undefined;
  helperSlot: 'error' | 'hint';
  placeholder: string;
}

export interface ResolveConfigOptions {
  props: EmailFieldProps;
  autoId: string;
  hasValue: boolean;
  autoFillError: string | null;
}

export function resolveEmailFieldConfig(
  opts: ResolveConfigOptions
): EmailFieldConfig {
  const { props, autoId, hasValue, autoFillError } = opts;
  const isError = Boolean(props.error || autoFillError);
  const mods = resolveFieldModifiers(props);

  return {
    ...mods,
    inputId: props.id ?? `email-field-${autoId}`,
    testId: resolveTestId(props, 'email-field'),
    rootClass: getRootClassName(props.className),
    canClear: isEmailClearable(props, hasValue),
    isError,
    helperText: resolveHelperContent({
      error: props.error,
      errorText: props.errorText,
      supportingText: props.supportingText,
      helperText: props.helperText,
      autoFillError,
    }),
    helperSlot: isError ? 'error' : 'hint',
    placeholder: props.placeholder ?? DEFAULT_EMAIL_LABELS.usernamePlaceholder,
  };
}
